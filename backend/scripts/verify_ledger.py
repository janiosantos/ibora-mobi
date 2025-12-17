import asyncio
import logging
import sys
import os
from sqlalchemy.orm import selectinload

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.database import AsyncSessionLocal, engine
from app.modules.finance.models.financial_event import EventType, EventStatus
from app.services.ledger import LedgerService
from app.modules.drivers.models.driver import Driver
from app.modules.passengers.models.passenger import Passenger
from app.modules.rides.models.ride import Ride
from app.modules.auth.models.user import User
from app.core.security import get_password_hash
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import date

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def create_test_entities(db):
    # Unique suffix
    suffix = str(uuid.uuid4())[:8]
    
    # Create User for Driver
    driver_user = User(
        email=f"driver_ledger_{suffix}@test.com",
        password_hash=get_password_hash("password"),
        phone=f"+55119{suffix}",
        user_type="driver"
    )
    db.add(driver_user)
    
    # Create User for Passenger
    pass_user = User(
        email=f"pass_ledger_{suffix}@test.com",
        password_hash=get_password_hash("password"),
        phone=f"+55118{suffix}",
        user_type="passenger"
    )
    db.add(pass_user)
    await db.flush()
    await db.refresh(driver_user)
    await db.refresh(pass_user)
    
    # Create Driver
    driver = Driver(
        user_id=driver_user.id,
        full_name=f"Driver Ledger {suffix}",
        cpf=f"{suffix[:3]}.{suffix[3:6]}.{suffix[6:9]}-00", # Fake CPF
        phone=driver_user.phone,
        email=driver_user.email,
        cnh_number=f"CNH{suffix}",
        cnh_category="B",
        cnh_expiry_date=date(2030, 1, 1),
        status="active"
    )
    db.add(driver)
    
    # Create Passenger
    passenger = Passenger(
        user_id=pass_user.id,
        full_name=f"Passenger Ledger {suffix}",
        cpf=f"{suffix[1:4]}.{suffix[4:7]}.{suffix[:3]}-01",
        phone=pass_user.phone,
        email=pass_user.email
    )
    db.add(passenger)
    
    await db.commit()
    await db.refresh(driver)
    await db.refresh(passenger)
    
    return driver, passenger

async def verify_ledger():
    async with AsyncSessionLocal() as db:
        logger.info("Starting Ledger Verification...")
        
        # 1. Setup Data
        driver, passenger = await create_test_entities(db)
        logger.info(f"Created Driver {driver.id} and Passenger {passenger.id}")
        
        # 2. Create Event (Earning)
        amount = 50.0
        event = await LedgerService.create_event(
            db=db,
            event_type=EventType.RIDE_EARNING,
            amount=amount,
            description="Test Ride Earning",
            driver_id=driver.id,
            passenger_id=passenger.id,
            metadata={"test": "true"}
        )
        
        assert event.status == EventStatus.PENDING
        assert event.amount == amount
        await db.commit() # Ensure it's saved
        logger.info(f"Event {event.id} Created (PENDING)")

        # Verify balance is 0 initially (only COMPLETED counts)
        bal = await LedgerService.get_driver_balance(db, driver.id)
        assert bal == 0.0
        logger.info(f"Initial Balance Checked: {bal}")
        
        # 3. Complete Event
        completed_event = await LedgerService.complete_event(db, event.id)
        assert completed_event.status == EventStatus.COMPLETED
        logger.info(f"Event {event.id} Completed")
        
        # 4. Verify Balance
        bal = await LedgerService.get_driver_balance(db, driver.id)
        assert bal == 50.0
        logger.info(f"Driver Balance Updated: {bal}")
        
        # 5. Reverse Event
        reversal = await LedgerService.reverse_event(db, event.id, "Correcting error")
        assert reversal.amount == -50.0
        assert reversal.status == EventStatus.COMPLETED
        logger.info(f"Event Reversed. Reversal Event ID: {reversal.id}")
        
        # 6. Verify Final Balance (Should be 0)
        bal = await LedgerService.get_driver_balance(db, driver.id)
        assert bal == 0.0
        logger.info(f"Final Balance Correct: {bal}")
        
        logger.info("✅ Ledger Verification PASSED")

if __name__ == "__main__":
    asyncio.run(verify_ledger())
