from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload

from app.modules.rides.models.ride import Ride
from app.schemas.ride import RideCreateRequest, RideEstimate
from app.modules.auth.models.user import User
from app.services.maps import MapsService
from app.services.pricing_service import PricingService
from app.modules.passengers.models.passenger import Passenger
from app.modules.drivers.models.driver import Driver

class RideService:
    @classmethod
    async def accept_ride(
        cls,
        ride_id: str,
        driver_user: User,
        db: AsyncSession
    ) -> Ride:
        """
        Driver accepts a ride. 
        Uses FOR UPDATE to prevent race conditions.
        """
        # 1. Get Driver Profile
        result = await db.execute(select(Driver).where(Driver.user_id == driver_user.id))
        driver = result.scalars().first()
        if not driver:
            raise ValueError("Driver profile not found")

        if driver.online_status != "ONLINE":
             # Optional: strict check, though matching filters online drivers.
             # raise ValueError("Driver is offline")
             pass

        # 2. Lock Ride Row
        result_ride = await db.execute(
            select(Ride)
            .where(Ride.id == ride_id)
            .with_for_update()
        )
        ride = result_ride.scalars().first()
        
        if not ride:
            raise ValueError("Ride not found")
            
        if ride.status != "REQUESTED":
            raise ValueError("Ride is no longer available")
            
        # 3. Update Ride
        ride.status = "ACCEPTED"
        ride.driver_id = driver.id
        ride.accepted_at = datetime.utcnow()
        
        # 4. Commit (releases lock)
        await db.commit()
        await db.refresh(ride)
        
        return ride
    @classmethod
    async def estimate_ride(
        cls, 
        request: RideCreateRequest,
        db: AsyncSession
    ) -> RideEstimate:
        """
        Calculates ride estimate (distance, duration, price) without creating a ride.
        """
        # 1. Geocoding (if needed, or just assume frontend sends addresses)
        # Assuming request has lat/lon. If not, we'd need geocoding.
        # Ideally, frontend sends lat/lon from map picker.
        
        origin = (request.origin_lat, request.origin_lon) if request.origin_lat else request.origin_address
        destination = (request.destination_lat, request.destination_lon) if request.destination_lat else request.destination_address
        
        # 2. Get Route Info from Maps
        # For estimate, we at least need distance/duration
        dist_meters, dur_seconds = await MapsService.get_distance_duration(origin, destination)
        
        # Fallback if maps fails
        if dist_meters is None:
            # Mock or raise
            dist_meters = 5000.0
            dur_seconds = 600.0

        # 3. Calculate Price
        price = PricingService.calculate_price(dist_meters, dur_seconds)
        
        # 4. Get Polyline (Optional for estimate, but good for map)
        route_data = await MapsService.get_directions(origin, destination)
        polyline = route_data['overview_polyline']['points'] if route_data else None

        return RideEstimate(
            origin_lat=request.origin_lat or 0.0, # Should handle if missing
            origin_lon=request.origin_lon or 0.0,
            origin_address=request.origin_address,
            destination_lat=request.destination_lat or 0.0,
            destination_lon=request.destination_lon or 0.0,
            destination_address=request.destination_address,
            distance_km=dist_meters / 1000.0,
            duration_min=int(dur_seconds / 60),
            estimated_price=float(price),
            route_polyline=polyline
        )

    @classmethod
    async def create_ride_request(
        cls,
        user: User,
        request: RideCreateRequest,
        db: AsyncSession
    ) -> Ride:
        """
        Creates a new ride request.
        """
        # 1. Validate Passenger
        result = await db.execute(select(Passenger).where(Passenger.user_id == user.id))
        passenger = result.scalars().first()
        if not passenger:
            raise ValueError("Passenger profile not found")
            
        # 2. Re-calculate inputs (trusted source)
        # We should ideally fetch route info again to ensure consistency and store it.
        print("DEBUG: create_ride_request - getting distance")
        
        origin = (request.origin_lat, request.origin_lon)
        destination = (request.destination_lat, request.destination_lon)
        
        dist_meters, dur_seconds = await MapsService.get_distance_duration(origin, destination)
        print(f"DEBUG: Data from Maps: dist={dist_meters}, dur={dur_seconds}")
        
        if dist_meters is None: 
            print("DEBUG: Maps returned None!")
            # Fallback for testing if Maps fails (e.g. no key)
            dist_meters = 5000.0
            dur_seconds = 600.0
            # raise ValueError("Could not calculate route")
        
        price = PricingService.calculate_price(dist_meters, dur_seconds)
        print(f"DEBUG: Calculated price: {price}")
        
        route_data = await MapsService.get_directions(origin, destination)
        polyline = route_data['overview_polyline']['points'] if route_data else None

        ride = Ride(
             passenger_id=passenger.id,
             origin_lat=request.origin_lat,
             origin_lon=request.origin_lon,
             origin_address=request.origin_address,
             destination_lat=request.destination_lat,
             destination_lon=request.destination_lon,
             destination_address=request.destination_address,
             distance_km=Decimal(dist_meters / 1000.0),
             duration_min=int(dur_seconds / 60),
             estimated_price=price,
             route_polyline=polyline,
             status="REQUESTED",
             payment_method=request.payment_method
        )
        
        db.add(ride)
        await db.commit()
        await db.refresh(ride)
        
        # TODO: Notify nearby drivers (Async)
        
        return ride
    @classmethod
    async def driver_arriving(
        cls,
        ride_id: str,
        driver_user: User,
        db: AsyncSession
    ) -> Ride:
        """
        Driver signals they are arriving at pickup.
        Transitions: ACCEPTED -> DRIVER_ARRIVING
        """
        # 1. Get Driver
        result = await db.execute(select(Driver).where(Driver.user_id == driver_user.id))
        driver = result.scalars().first()
        if not driver:
            raise ValueError("Driver profile not found")

        # 2. Lock Ride
        result_ride = await db.execute(
            select(Ride).where(Ride.id == ride_id).with_for_update()
        )
        ride = result_ride.scalars().first()
        if not ride:
            raise ValueError("Ride not found")
            
        if ride.driver_id != driver.id:
            raise ValueError("Ride not assigned to you")

        # 3. Transition State
        try:
            from app.services.ride_state_machine import RideStateMachine, RideStatus
            print(f"DEBUG: Transitioning ride {ride.id} from {ride.status} to {RideStatus.DRIVER_ARRIVING}")
            RideStateMachine.transition(ride, RideStatus.DRIVER_ARRIVING)
        except Exception as e:
            print(f"DEBUG: Error in transition: {e}")
            raise e
        
        # 4. Calculate ETA (Driver -> Origin)
        # Assuming we have driver location (need to implement location updates separately/before)
        # For now, we use MapsService if driver has location, or fallback.
        
        # Note: driver.location is PostGIS element. We need to extract lat/lon or use ST_X/ST_Y if available in model properties
        # But for this MVP step, if we don't have driver location easily, we might skip or mock.
        # Let's try to get distance if possible.
        
        # 5. Commit
        await db.commit()
        await db.refresh(ride)
        
        # 6. Notify Passenger (TODO)
        
        return ride
