import asyncio
import random
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from geoalchemy2.elements import WKTElement

from app.core.config import settings
from app.modules.drivers.models.driver import Driver, DriverOnlineStatus
from app.modules.auth.models.user import User
from app.modules.drivers.models.vehicle import Vehicle
from app.modules.finance.models.wallet import DriverWallet
from app.modules.passengers.models.passenger import Passenger
from app.modules.rides.models.ride import Ride
from app.core import database

# Mock Driver Data
async def seed_drivers():
    engine = create_async_engine(settings.SQLALCHEMY_DATABASE_URI, echo=True)
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    async with async_session() as session:
        print("Seeding drivers...")
        
        # Sao Paulo Center
        lat_base = -23.55052
        lng_base = -46.633308
        
        for i in range(10):
            # Random offset
            lat = lat_base + (random.random() - 0.5) * 0.02
            lng = lng_base + (random.random() - 0.5) * 0.02
            
            point = WKTElement(f'POINT({lng} {lat})', srid=4326)
            
            # Check if driver exists or create new
            driver_email = f"driver_seed_{i}@test.com"
            # In a real seed we'd create User first, then Driver.
            # Assuming I can just create Driver entries directly if User linkage allows or if I mock it.
            # Driver table has user_id foreign key. I need users.
            
            # Simplified: Find existing users or create dummy ones?
            # I'll just check if there are users, if not warn.
            # Actually, let's just assume we want to "animate" existing drivers if they exist.
            
            # Better: Update "online" status of existing 10 drivers to be near SP.
            result = await session.execute(select(Driver).limit(10))
            drivers = result.scalars().all()
            
            if not drivers:
                print("No drivers found in DB. Please create drivers via API first.")
                return

            for idx, driver in enumerate(drivers):
                driver.location = WKTElement(f'POINT({lng_base + (random.random() - 0.5) * 0.01} {lat_base + (random.random() - 0.5) * 0.01})', srid=4326)
                driver.online_status = DriverOnlineStatus.ONLINE
                driver.heading = random.randint(0, 360)
                session.add(driver)
                print(f"Updated driver {driver.id} to location near SP")
            
            await session.commit()
            print(f"Seeded {len(drivers)} drivers near Sao Paulo.")

if __name__ == "__main__":
    asyncio.run(seed_drivers())
