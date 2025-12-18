from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, desc
from sqlalchemy.orm import selectinload
from datetime import datetime, date

from app.core import database
from app.api import deps
from app.modules.rides.models.ride import Ride
from app.modules.finance.models.payment import Payment, PaymentStatus
from app.modules.passengers.models.passenger import Passenger
from app.modules.drivers.models.driver import Driver
from app.schemas import ride as ride_schema
from app.modules.auth.models.user import User
from app.core.websocket import manager
from app.core.rabbitmq import publish_message
from app.services.payment_service import PaymentService
from app.services.notification_service import NotificationService
from app.core.logging import get_logger

logger = get_logger(__name__)

router = APIRouter()

from app.services.ride_service import RideService

@router.get("/history", response_model=List[ride_schema.Ride])
async def get_ride_history(
    *,
    db: AsyncSession = Depends(database.get_db),
    current_user: User = Depends(deps.get_current_user),
    skip: int = 0,
    limit: int = 20,
    status: str = Query(None),
    start_date: date = Query(None),
    end_date: date = Query(None)
) -> Any:
    """
    Get ride history for current user (Driver or Passenger).
    """
    query = select(Ride).options(
        selectinload(Ride.passenger),
        selectinload(Ride.driver)
    )
    
    if current_user.user_type == "passenger":
        # Find Passenger Profile
        result = await db.execute(select(Passenger).where(Passenger.user_id == current_user.id))
        profile = result.scalars().first()
        if not profile:
             return []
        query = query.where(Ride.passenger_id == profile.id)
        
    elif current_user.user_type == "driver":
        # Find Driver Profile
        result = await db.execute(select(Driver).where(Driver.user_id == current_user.id))
        profile = result.scalars().first()
        if not profile:
             return []
        query = query.where(Ride.driver_id == profile.id)
    else:
        # Admin or other?
        pass
        
    if status:
        query = query.where(Ride.status == status)
        
    if start_date:
        query = query.where(Ride.created_at >= datetime.combine(start_date, datetime.min.time()))
    if end_date:
        query = query.where(Ride.created_at <= datetime.combine(end_date, datetime.max.time()))
        
    # Order by newest first
    query = query.order_by(desc(Ride.created_at))
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    rides = result.scalars().all()
    return rides

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
        
        # Persistent Notification
        await NotificationService(db).create_notification(
            user_id=ride.passenger.user_id,
            title="Ride Accepted",
            message=f"Driver {ride.driver.full_name if ride.driver else 'Driver'} accepted your ride.",
            type="RIDE_UPDATE"
        )

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
        
        # Persistent Notification
        await NotificationService(db).create_notification(
            user_id=ride.passenger.user_id,
            title="Driver Arriving",
            message=f"Driver is arriving soon.",
            type="RIDE_UPDATE"
        )
        
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
    # We should notify persistent too
    result_p = await db.execute(select(Passenger).where(Passenger.id == ride.passenger_id))
    passenger = result_p.scalars().first()
    if passenger:
         await NotificationService(db).create_notification(
            user_id=passenger.user_id,
            title="Ride Started",
            message="Your ride has started.",
            type="RIDE_UPDATE"
        )
    
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
    from app.services.ride_payment import RidePaymentService
    from app.modules.finance.models.payment_method import PaymentMethod
    from app.services.payment.card_payment_service import CardPaymentService
    from app.services.payment.mercadopago_service import MercadoPagoService
    
    # Explicitly fetch Passenger and User to avoid async relationship issues
    stmt_pax_user = (
        select(Passenger, User)
        .join(User, Passenger.user_id == User.id)
        .where(Passenger.id == ride.passenger_id)
    )
    res_pax_user = await db.execute(stmt_pax_user)
    row = res_pax_user.first()
    
    if row:
        passenger_obj, user_obj = row
        
        if ride.payment_method == 'credit_card':
            # Card Payment Flow
            # Find default payment method
            stmt_pm = select(PaymentMethod).where(
                PaymentMethod.user_id == user_obj.id,
                PaymentMethod.is_default == True,
                PaymentMethod.is_active == True
            )
            res_pm = await db.execute(stmt_pm)
            default_pm = res_pm.scalars().first()
            
            if default_pm:
                try:
                    logger.info(f"DEBUG CHARGE: ride={ride.id}, pax_id={passenger_obj.id}, user_id={user_obj.id}, provider={default_pm.provider}")
                    
                    if default_pm.provider == 'mercadopago':
                         # Mercado Pago Charge
                         payment = await MercadoPagoService.charge_card(
                             ride=ride,
                             payment_method_id=default_pm.id,
                             amount=float(ride.final_price),
                             mercadopago_customer_id=user_obj.mercadopago_customer_id,
                             db=db
                         )
                    else:
                        # Stripe Charge (Default)
                        payment = await CardPaymentService.charge_ride(
                            ride=ride,
                            payment_method_id=default_pm.id,
                            amount=float(ride.final_price),
                            customer_id=user_obj.stripe_customer_id, 
                            passenger_id=passenger_obj.id,
                            db=db
                        )
                    
                    logger.info(f"Payment created: id={payment.id}, status={payment.status} (type={type(payment.status)})")

                    if payment.status == PaymentStatus.COMPLETED or payment.status == "completed":
                        ride.payment_status = "captured"
                    elif payment.status == PaymentStatus.PENDING or payment.status == "pending":
                        ride.payment_status = "authorized"
                    else:
                        logger.warning(f"Payment status unhandled/failed: {payment.status}")
                        ride.payment_status = "failed"
                
                except Exception as e:
                    logger.error(f"Auto-charge failed for ride {ride.id}: {e}")
                    ride.payment_status = "failed"
                    await RidePaymentService.process_ride_payment(ride, db)
            else:
                logger.warning(f"No default card for user {user_obj.id}. Marking payment as pending.")
                ride.payment_status = "pending"
                await RidePaymentService.process_ride_payment(ride, db)
                
        else:
            # Cash / Pix Flow
            await RidePaymentService.process_ride_payment(ride, db)

        # Track Incentive Metrics
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
@router.post("/{ride_id}/confirm-cash-payment", response_model=dict)
async def confirm_cash_payment(
    ride_id: str,
    db: AsyncSession = Depends(database.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Confirm cash payment received (driver only).
    Creates financial events immediately. No settlement hold.
    """
    # 1. Get Ride
    result = await db.execute(select(Ride).where(Ride.id == ride_id))
    ride = result.scalars().first()
    
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
        
    # 2. Verify Driver
    result_driver = await db.execute(
        select(Driver).where(Driver.user_id == current_user.id)
    )
    driver = result_driver.scalars().first()
    
    if not driver:
         raise HTTPException(status_code=403, detail="Not a driver")
         
    if str(ride.driver_id) != str(driver.id):
        raise HTTPException(status_code=403, detail="Not authorized for this ride")
        
    # 3. Validation
    if ride.status != "COMPLETED":
        # In case driver forgot to finish? Docs say "Ride completed" flow step 2.
        raise HTTPException(status_code=400, detail="Ride must be COMPLETED")
        
    if ride.payment_method != "cash":
        raise HTTPException(status_code=400, detail="Ride payment method is not cash")
        
    # Check if already confirmed
    if ride.cash_confirmed_by_driver:
        raise HTTPException(status_code=400, detail="Cash payment already confirmed")
        
    # 4. Create Payment Record
    from app.modules.finance.models.payment import Payment, PaymentStatus
    
    # Check existing payment
    existing_payment_res = await db.execute(select(Payment).where(Payment.ride_id == ride.id))
    existing_payment = existing_payment_res.scalars().first()
    
    if existing_payment and existing_payment.status == PaymentStatus.COMPLETED:
         raise HTTPException(status_code=400, detail="Payment already confirmed")
         
    payment = Payment(
        ride_id=ride.id,
        passenger_id=ride.passenger_id,
        amount=float(ride.final_price),
        payment_method="cash",
        status=PaymentStatus.COMPLETED,
        paid_at=datetime.utcnow()
    )
    db.add(payment)
    await db.flush() # Get ID
    
    # 5. Process Financials
    from app.services.ride_payment import RidePaymentService
    from app.modules.finance.models.financial_event import FinancialEvent, EventType
    from app.services.settlement_service import SettlementService
    from app.modules.finance.models.settlement import Settlement
    
    # Check if events already exist (created by finish_ride)
    stmt = select(FinancialEvent).where(
        FinancialEvent.ride_id == ride.id,
        FinancialEvent.event_type == EventType.RIDE_EARNING
    )
    res_event = await db.execute(stmt)
    earning_event = res_event.scalars().first()
    
    if earning_event:
        # Events exist. Find settlement to release.
        logger.info(f"Using existing financial events for ride {ride.id}")
        payment.earning_event_id = earning_event.id
        
        # Link other events if needed? Payment model stores them.
        # Find commission/payment events?
        # For MVP, earning_event is enough to find settlement.
        
        stmt_stl = select(Settlement).where(Settlement.financial_event_id == earning_event.id)
        res_stl = await db.execute(stmt_stl)
        settlement = res_stl.scalars().first()
        
    else:
        # No events found, create them
        logger.info(f"Creating financial events for ride {ride.id}")
        payment_info = await RidePaymentService.process_ride_payment(ride, db)
        
        payment.payment_event_id = payment_info["payment_event_id"]
        payment.earning_event_id = payment_info["earning_event_id"]
        payment.commission_event_id = payment_info["commission_event_id"]
        
        # Find settlement (created by process_ride_payment)
        stmt_stl = select(Settlement).where(Settlement.financial_event_id == payment.earning_event_id)
        res_stl = await db.execute(stmt_stl)
        settlement = res_stl.scalars().first()

    # 6. Release Settlement
    if settlement:
        await SettlementService.release_settlement(settlement, db)
        
    # 7. Update Ride State
    ride.cash_confirmed_by_driver = True
    ride.cash_confirmed_at = datetime.utcnow()
    # Transition to PAID?
    # ride.payment_status = 'paid'
    # db.add(ride)
    
    await db.commit()
    
    logger.info(f"Cash payment confirmed for ride {ride.id}")
    
    return {
        "status": "confirmed",
        "payment_id": payment.id,
        "amount": payment.amount,
        "ride_id": ride.id
    }
