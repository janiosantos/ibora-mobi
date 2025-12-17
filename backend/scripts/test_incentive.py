import asyncio
import sys
import os
from decimal import Decimal

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.database import AsyncSessionLocal as async_session_factory
from app.services.incentive_service import IncentiveService
from app.modules.drivers.models.driver import Driver
from app.modules.auth.models.user import User
from sqlalchemy import select

async def main():
    print("Testing Incentive Service...")
    async with async_session_factory() as session:
        # Get a driver
        result = await session.execute(select(Driver))
        driver = result.scalars().first()
        
        if not driver:
            print("No driver found to test.")
            return

        print(f"Using driver: {driver.id}")
        
        service = IncentiveService(session)
        
        # Determine current balance/campaigns mock
        # Just track event to see if it crashes
        try:
            await service.track_ride_event(
                driver_id=driver.id,
                event_type="completed",
                ride_value=Decimal("20.00"),
                ride_km=Decimal("5.0")
            )
            print("Incentive Service Track Event: SUCCESS")
        except Exception as e:
            print(f"Incentive Service Track Event: FAILED")
            # Print FULL traceback
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
