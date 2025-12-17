import asyncio
import logging
import sys
import os
from decimal import Decimal

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.database import AsyncSessionLocal
from app.services.ride_payment import RidePaymentService
from app.modules.finance.models.financial_event import EventType, EventStatus, FinancialEvent
from app.modules.drivers.models.driver import Driver
from app.modules.passengers.models.passenger import Passenger
from app.modules.rides.models.ride import Ride
from app.modules.auth.models.user import User
from app.core.security import get_password_hash
from sqlalchemy import select
import uuid
from datetime import date, datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def create_test_entities(db):
    suffix = str(uuid.uuid4())[:8]
    
    # User Driver
    driver_user = User(
        email=f"driver_pay_{suffix}@test.com",
        password_hash=get_password_hash("password"),
        phone=f"+55119{suffix}",
        user_type="driver"
    )
    db.add(driver_user)
    
    # User Passenger
    pass_user = User(
        email=f"pass_pay_{suffix}@test.com",
        password_hash=get_password_hash("password"),
        phone=f"+55118{suffix}",
        user_type="passenger"
    )
    db.add(pass_user)
    await db.flush()
    await db.refresh(driver_user)
    await db.refresh(pass_user)
    
    # Driver
    driver = Driver(
        user_id=driver_user.id,
        full_name=f"Driver Payment {suffix}",
        cpf=f"{suffix[:3]}.{suffix[3:6]}.{suffix[6:9]}-00",
        phone=driver_user.phone,
        email=driver_user.email,
        cnh_number=f"CNH{suffix}",
        cnh_category="B",
        cnh_expiry_date=date(2030, 1, 1),
        status="active"
    )
    db.add(driver)
    
    # Passenger
    passenger = Passenger(
        user_id=pass_user.id,
        full_name=f"Passenger Payment {suffix}",
        cpf=f"{suffix[1:4]}.{suffix[4:7]}.{suffix[:3]}-01",
        phone=pass_user.phone,
        email=pass_user.email
    )
    db.add(passenger)
    await db.commit()
    await db.refresh(driver)
    await db.refresh(passenger)
    
    return driver, passenger

async def verify_ride_payment():
    async with AsyncSessionLocal() as db:
        logger.info("Starting Ride Payment Verification...")
        
        # 1. Setup
        driver, passenger = await create_test_entities(db)
        
        # 2. Create Completed Ride
        ride_price = Decimal("100.00")
        ride = Ride(
            passenger_id=passenger.id,
            driver_id=driver.id,
            status='COMPLETED',
            origin_lat=Decimal("-23.55"),
            origin_lon=Decimal("-46.63"),
            origin_address="Origin St",
            destination_lat=Decimal("-23.56"),
            destination_lon=Decimal("-46.64"),
            destination_address="Dest St",
            estimated_price=ride_price,
            final_price=ride_price,
            payment_method="pix",
            created_at=datetime.utcnow(),
            completed_at=datetime.utcnow()
        )
        db.add(ride)
        await db.commit()
        await db.refresh(ride)
        logger.info(f"Created Completed Ride {ride.id} with price {ride.final_price}")
        
        # 3. Process Payment
        result = await RidePaymentService.process_ride_payment(ride, db)
        await db.commit()
        
        logger.info(f"Payment Processed: {result}")
        
        # 4. Verification
        
        # Check Payment Event (Debit)
        payment_event = await db.get(FinancialEvent, result['payment_event_id'])
        assert payment_event.event_type == EventType.RIDE_PAYMENT
        assert payment_event.amount == -100.0
        assert payment_event.passenger_id == passenger.id
        assert payment_event.status == EventStatus.PENDING
        
        # Check Earning Event (Credit)
        # 20% commission -> 80% earning -> 80.0
        earning_event = await db.get(FinancialEvent, result['earning_event_id'])
        assert earning_event.event_type == EventType.RIDE_EARNING
        assert earning_event.amount == 80.0
        assert earning_event.driver_id == driver.id
        assert earning_event.status == EventStatus.PENDING
        
        # Check Commission Event (Credit)
        # 20% commission -> 20.0
        commission_event = await db.get(FinancialEvent, result['commission_event_id'])
        assert commission_event.event_type == EventType.PLATFORM_COMMISSION
        assert commission_event.amount == 20.0
        assert commission_event.driver_id == driver.id # Linked to driver for tracking
        assert commission_event.status == EventStatus.PENDING
        
        logger.info("✅ Ride Payment Verification PASSED")

if __name__ == "__main__":
    asyncio.run(verify_ride_payment())
