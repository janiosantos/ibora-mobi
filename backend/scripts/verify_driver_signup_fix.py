import asyncio
import sys
from datetime import date
import uuid

# Add parent directory to path to import app modules
sys.path.append('.')

from app.core.database import AsyncSessionLocal
from app.modules.drivers.models.driver import Driver, DriverOnlineStatus
from app.modules.finance.models.wallet import DriverWallet
from app.modules.passengers.models.passenger import Passenger
from app.modules.rides.models.ride import Ride
from app.modules.drivers.models.vehicle import Vehicle
from app.modules.auth.models.user import User

async def verify_fix():
    async with AsyncSessionLocal() as session:
        try:
            print("Starting verification...")
            
            # Create a dummy user
            email = f"test_driver_{uuid.uuid4()}@example.com"
            user = User(
                email=email,
                phone="1234567890",
                user_type="driver",
                password_hash="dummy_hash",
                status="active"
            )
            session.add(user)
            await session.commit()
            await session.refresh(user)
            print(f"Created user: {user.id}")

            # Create Driver with date objects
            driver = Driver(
                user_id=user.id,
                full_name="Test Driver",
                email=email,
                phone="1234567890",
                cpf=str(uuid.uuid4())[:14], # Random CPF to avoid unique constraint
                cnh_number=str(uuid.uuid4())[:11],
                cnh_category="B",
                cnh_expiry_date=date(2030, 1, 1), # THE FIX
                status="active",
                online_status=DriverOnlineStatus.OFFLINE
            )
            session.add(driver)
            await session.commit()
            await session.refresh(driver)
            print(f"Created driver: {driver.id}")
            
            # Create Vehicle with date objects
            vehicle = Vehicle(
                driver_id=driver.id,
                license_plate=str(uuid.uuid4())[:7],
                brand="TestBrand",
                model="TestModel",
                year=2024,
                color="Black",
                category="standard",
                crlv_expiry_date=date(2030, 1, 1), # THE FIX
                status="active"
            )
            session.add(vehicle)
            await session.commit()
            print("Created vehicle successfully")
            
            print("VERIFICATION SUCCESS: Driver and Vehicle created with date objects.")
            
            # Cleanup (optional but good)
            # await session.delete(vehicle)
            # await session.delete(driver)
            # await session.delete(user)
            # await session.commit()
            
        except Exception as e:
            print(f"VERIFICATION FAILED: {e}")
            raise e

if __name__ == "__main__":
    asyncio.run(verify_fix())
