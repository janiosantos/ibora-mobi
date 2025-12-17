from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from datetime import datetime

from app.core import database
from app.api import deps
from app.modules.rides.models.ride import Ride
from app.modules.passengers.models.passenger import Passenger
from app.modules.drivers.models.driver import Driver
from app.schemas import ride as ride_schema
from app.modules.auth.models.user import User
from app.core.websocket import manager
from app.core.rabbitmq import publish_message
from app.services.payment_service import PaymentService
from app.core.logging import get_logger

logger = get_logger(__name__)

router = APIRouter()

from app.services.ride_service import RideService

@router.post("/estimate", response_model=ride_schema.RideEstimate)
async def estimate_ride(
    *,
    db: AsyncSession = Depends(database.get_db),
    ride_in: ride_schema.RideCreateRequest,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get estimate for a ride.
    """
    estimate = await RideService.estimate_ride(ride_in, db)
    return estimate

@router.post("/request", response_model=ride_schema.Ride)
async def request_ride(
    *,
    db: AsyncSession = Depends(database.get_db),
    ride_in: ride_schema.RideCreateRequest,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Passenger requests a new ride.
    """
    if current_user.user_type != "passenger":
        raise HTTPException(status_code=400, detail="Only passengers can request rides")
    
    ride = await RideService.create_ride_request(current_user, ride_in, db)
    
    # Notify nearby drivers via RabbitMQ
    # This could be moved to RideService or a separate EventService
    await publish_message("new_rides_available", {
        "type": "NEW_RIDE",
        "ride_id": str(ride.id),
        "origin": ride.origin_address,
        "destination": ride.destination_address,
        "price": float(ride.estimated_price) if ride.estimated_price else 0.0,
        "distance": float(ride.distance_km) if ride.distance_km else 0.0,
        "timestamp": datetime.utcnow().isoformat()
    })
    return ride

@router.post("/{ride_id}/accept", response_model=ride_schema.Ride)
async def accept_ride(
    ride_id: str,
    db: AsyncSession = Depends(database.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Driver accepts a ride.
    """
    if current_user.user_type != "driver":
        raise HTTPException(status_code=400, detail="Only drivers can accept rides")
        
    try:
        ride = await RideService.accept_ride(ride_id, current_user, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Notify passenger (Async)
    # We need to ensure logic handles if passenger is not loaded, though RideService updates it.
    # To get passenger info for notification, we might need to load it or it's already there if we eager load in Service?
    # Service uses select(Ride).with_for_update(). It doesn't explicitly SelectInLoad passenger.
    # We might need to fetch it to notify.
    
    # Reload ride with passenger for notification
    result = await db.execute(
        select(Ride).options(selectinload(Ride.passenger)).where(Ride.id == ride.id)
    )
    ride = result.scalars().first()

    # Get Driver Details for notification (Ride has driver_id, but we need name)
    # We can fetch Driver again or trust the one in Service. 
    # Let's fetch it simply via relation if loaded, or query. 
    # Optimization: RideService could return driver too, or we load it on Ride.
    
    # Assuming ride.driver is loaded? No, we didn't eager load it in Service commit.
    
    # Reload with driver too
    result = await db.execute(
        select(Ride)
        .options(selectinload(Ride.passenger), selectinload(Ride.driver))
        .where(Ride.id == ride.id)
    )
    ride = result.scalars().first()

    if ride and ride.passenger:
        await manager.send_personal_message({
            "type": "RIDE_ACCEPTED",
            "ride_id": str(ride.id),
            "driver_name": ride.driver.full_name if ride.driver else "Driver",
            "vehicle": "Vehicle Info Placeholder" 
        }, str(ride.passenger.user_id))

    return ride

@router.post("/{ride_id}/arriving", response_model=ride_schema.RideArrivingResponse)
async def driver_arriving(
    ride_id: str,
    db: AsyncSession = Depends(database.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Driver signals passing arrival.
    """
    if current_user.user_type != "driver":
        raise HTTPException(status_code=400, detail="Only drivers can perform this action")
        
    try:
        ride = await RideService.driver_arriving(ride_id, current_user, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Unexpected error: {str(e)}")
        
    # Notify Passenger
    # Reload with passenger for notification
    result = await db.execute(
        select(Ride)
        .options(selectinload(Ride.passenger), selectinload(Ride.driver))
        .where(Ride.id == ride.id)
    )
    ride = result.scalars().first()
    
    eta = 300 # Mock 5 mins if not calculated
    
    if ride and ride.passenger:
        await manager.send_personal_message({
            "type": "DRIVER_ARRIVING",
            "ride_id": str(ride.id),
            "driver_name": ride.driver.full_name if ride.driver else "Driver",
            "eta_seconds": eta
        }, str(ride.passenger.user_id))
        
    return {
        "ride_id": ride.id,
        "status": ride.status,
        "eta_seconds": eta
    }

from app.services.gps_tracking import GPSTrackingService

@router.post("/{ride_id}/start", response_model=ride_schema.Ride)
async def start_ride(
    ride_id: str,
    db: AsyncSession = Depends(database.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Driver starts the ride (passenger is in the car).
    """
    result_ride = await db.execute(select(Ride).where(Ride.id == ride_id))
    ride = result_ride.scalars().first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
        
    # We should use RideStateMachine here too
    from app.services.ride_state_machine import RideStateMachine, RideStatus
    
    # Check if transition is valid
    if ride.status not in [RideStatus.ACCEPTED, RideStatus.DRIVER_ARRIVING]:
         raise HTTPException(status_code=400, detail=f"Ride cannot be started from status {ride.status}")

    RideStateMachine.transition(ride, RideStatus.IN_PROGRESS)
    
    ride.started_at = datetime.utcnow()
    await db.commit()
    await db.refresh(ride)
    
    # Start GPS Tracking
    await GPSTrackingService.start_tracking(str(ride.id), str(ride.driver_id))
    
    # Notify passenger
    # ... (skipping detail loading for brevity, assume WS manager works if passenger loaded)
    
    return ride

@router.post("/{ride_id}/finish", response_model=ride_schema.Ride)
async def finish_ride(
    ride_id: str,
    db: AsyncSession = Depends(database.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Driver finishes the ride.
    """
    result_ride = await db.execute(select(Ride).where(Ride.id == ride_id))
    ride = result_ride.scalars().first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
        
    # Check for IN_PROGRESS
    if ride.status != "IN_PROGRESS" and ride.status != "STARTED": # Support both for migration safety
         raise HTTPException(status_code=400, detail=f"Ride cannot be finished from status {ride.status}")

    # Stop GPS Tracking & Persist
    await GPSTrackingService.stop_tracking(str(ride.id))
    await GPSTrackingService.persist_path(str(ride.id), db)

    # Transition
    from app.services.ride_state_machine import RideStateMachine, RideStatus
    RideStateMachine.transition(ride, RideStatus.COMPLETED)
    
    ride.completed_at = datetime.utcnow()
    ride.final_price = ride.estimated_price # Simple logic, in real world recalculate
    
    # Financial Transaction
    payment_service = PaymentService(db)
    
    # Re-fetch ride with passenger to be safe
    result_ride_p = await db.execute(
        select(Ride).options(selectinload(Ride.passenger)).where(Ride.id == ride_id)
    )
    ride_p = result_ride_p.scalars().first()
    
    if ride_p and ride_p.passenger:
        await payment_service.distribute_ride_payment(
            ride_id=ride.id,
            amount=ride.final_price,
            passenger_id=ride_p.passenger.user_id,
            driver_user_id=current_user.id,
            driver_id=ride.driver_id
        )

        # Track Incentive Metrics (Async, but awaited for MVP simplicity. In prod, push to Queue)
        # We need to import IncentiveService inside or top
        from app.services.incentive_service import IncentiveService
        incentive_service = IncentiveService(db)
        await incentive_service.track_ride_event(
            driver_id=ride.driver_id,
            event_type="completed",
            ride_value=ride.final_price,
            ride_km=ride.distance_km or 0.0
        )
    
    await db.commit()
    await db.refresh(ride)
    return ride
