import asyncio
import sys
import os
from decimal import Decimal
import uuid

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.database import AsyncSessionLocal as async_session_factory
from app.services.payment_service import PaymentService
from app.modules.drivers.models.driver import Driver
from app.modules.passengers.models.passenger import Passenger
from app.modules.auth.models.user import User
from app.modules.rides.models.ride import Ride
from sqlalchemy import select

async def main():
    print("Testing Payment Service...")
    async with async_session_factory() as session:
        # Get a driver
        result = await session.execute(select(Driver))
        driver = result.scalars().first()
        
        # Get a passenger
        result_p = await session.execute(select(Passenger))
        passenger = result_p.scalars().first()
        
        if not driver or not passenger:
            print("No driver or passenger found to test.")
            return

        print(f"Using driver: {driver.id}")
        print(f"Using passenger: {passenger.id}")
        
        # Create a dummy ride to link (optional depending on service implementation, but good for FKs)
        # Assuming we just need IDs for the service method
        
        service = PaymentService(session)
        
        ride_id = uuid.uuid4() 
        amount = Decimal("20.00")
        
        try:
            await service.distribute_ride_payment(
                ride_id=ride_id,
                amount=amount,
                passenger_id=passenger.user_id,
                driver_user_id=driver.user_id,
                driver_id=driver.id
            )
            print("Payment Service Distribute: SUCCESS")
        except Exception as e:
            print(f"Payment Service Distribute: FAILED")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
