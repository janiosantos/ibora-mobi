
import sys
import os
sys.path.append(os.getcwd()) # Ensure backend root is in path

import asyncio
import logging
from uuid import uuid4
from datetime import datetime, timedelta
from app.core.database import AsyncSessionLocal
from app.modules.auth.models.user import User
from app.api.v1.rides import finish_ride
from app.modules.finance.models.financial_event import FinancialEvent
from app.modules.finance.models.payment import Payment, PaymentStatus
from app.modules.finance.models.payment_method import PaymentMethod
from app.modules.rides.models.ride import Ride
from app.modules.passengers.models.passenger import Passenger
from app.modules.drivers.models.driver import Driver
from app.modules.finance.models.wallet import DriverWallet
from sqlalchemy import select, text
from app.services.payment.mercadopago_client import mercadopago_client
from unittest.mock import MagicMock

# Configure Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

# Constants
MOCK_MP_CUSTOMER_ID = f"cust_mp_{uuid4()}"
MOCK_MP_CARD_ID = f"card_mp_{uuid4()}"
MOCK_MP_PAYMENT_ID = f"pay_mp_{uuid4()}"

async def test_mercadopago_flow():
    """
    Test End-to-End Ride Payment Flow with Mercado Pago
    """
    logger.info("🚀 Starting Mercado Pago Payment Flow Test...")

    # Mock Mercado Pago Client to avoid real API calls
    logger.info("🔧 Mocking Mercado Pago SDK...")
    
    # Mock Customer Creation
    mercadopago_client.create_customer = MagicMock(return_value={
        "id": MOCK_MP_CUSTOMER_ID,
        "email": "test@mercadopago.com"
    })
    
    # Mock Save Card
    mercadopago_client.save_card = MagicMock(return_value={
        "id": MOCK_MP_CARD_ID,
        "payment_method": {"id": "master"},
        "last_four_digits": "5678",
        "expiration_month": 12,
        "expiration_year": 2030,
        "status": "active"
    })
    
    # Mock Create Payment (Charge)
    mercadopago_client.create_payment = MagicMock(return_value={
        "id": MOCK_MP_PAYMENT_ID,
        "status": "approved",
        "status_detail": "accredited"
    })

    async with AsyncSessionLocal() as db:
        try:
            # 1. Create User
            user_email = f"mp_user_{uuid4()}@test.com"
            user = User(
                email=user_email,
                phone=f"119{str(uuid4().int)[:8]}",
                password_hash="hashed_secret",
                user_type="passenger",
                mercadopago_customer_id=MOCK_MP_CUSTOMER_ID # simulate already created
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)

            # 2. Create Passenger
            passenger = Passenger(
                user_id=user.id,
                full_name="MP User",
                cpf=f"{uuid4().int}"[:11],
                phone="11999999999", # Required field
                email=user_email # Required field
            )
            db.add(passenger)
            await db.commit()
            
            # 3. Create Mercado Pago Payment Method
            pm = PaymentMethod(
                user_id=user.id,
                mercadopago_card_id=MOCK_MP_CARD_ID,
                provider='mercadopago',
                card_brand='master',
                card_last4='5678',
                card_exp_month=12,
                card_exp_year=2030,
                is_default=True,
                is_active=True
            )
            db.add(pm)
            await db.commit()
            await db.refresh(pm)
            
            # 4. Create Driver & Ride
            driver_user = User(
                email=f"mp_driver_{uuid4()}@test.com", 
                phone=f"119{str(uuid4().int)[:8]}", 
                user_type="driver",
                password_hash="secret"
            )
            db.add(driver_user)
            await db.flush()
            
            driver = Driver(
                user_id=driver_user.id, 
                full_name="MP Driver",
                cpf=f"{uuid4().int}"[:11],
                phone="11988888888",
                email=f"mp_driver_{uuid4()}@test.com",
                cnh_number=f"{uuid4().int}"[:11],
                cnh_category="B", 
                cnh_expiry_date=datetime(2030, 1, 1).date()
            )
            db.add(driver)
            await db.flush()
            
            ride = Ride(
                passenger_id=passenger.id,
                driver_id=driver.id,
                origin_lat=0.0, origin_lon=0.0, origin_address="A",
                destination_lat=0.0, destination_lon=0.0, destination_address="B",
                estimated_price=25.00,
                status="IN_PROGRESS",
                payment_method="credit_card",
                started_at=datetime.utcnow()
            )
            db.add(ride)
            await db.commit()
            await db.refresh(ride)
            
            logger.info(f"✅ Created Ride {ride.id} with MP Payment Method")

            # 5. Execute finish_ride
            logger.info("🏁 Executing finish_ride...")
            
            # Mock Current User Context (not needed for finish_ride logic itself but good practice to have obj)
            mock_current_user = user 
            
            updated_ride = await finish_ride(ride_id=ride.id, db=db, current_user=driver_user) # Driver finishes ride
            
            # 6. Assertions
            logger.info("🔍 Verifying Results...")
            
            # Re-fetch ride
            result = await db.execute(select(Ride).where(Ride.id == ride.id))
            final_ride = result.scalars().first()
            
            if final_ride.status == "COMPLETED" and final_ride.payment_status == "captured":
                logger.info("✅ Ride Status: COMPLETED, Payment Status: captured")
            else:
                logger.error(f"❌ Ride Failed: status={final_ride.status}, payment_status={final_ride.payment_status}")
                exit(1)
            
            # Check Payment Record
            stmt_pay = select(Payment).where(Payment.ride_id == ride.id)
            res_pay = await db.execute(stmt_pay)
            payment_record = res_pay.scalars().first()
            
            if payment_record and payment_record.external_transaction_id == MOCK_MP_PAYMENT_ID:
                logger.info(f"✅ Payment Record Created: {payment_record.id} (MP ID: {payment_record.external_transaction_id})")
            else:
                logger.error("❌ Payment Record missing or incorrect ID")
                exit(1)
            
            # Check Financial Events
            stmt_events = select(FinancialEvent).where(FinancialEvent.ride_id == ride.id)
            res_events = await db.execute(stmt_events)
            events = res_events.scalars().all()
            
            if len(events) == 3:
                logger.info(f"✅ Financial Events Created: {len(events)}")
            else:
                logger.error(f"❌ Incorrect Financial Events count: {len(events)}")
                exit(1)
                
            logger.info("\n🎉 Mercado Pago Flow Verified Successfully!")

        except Exception as e:
            logger.error(f"❌ Test Failed: {e}")
            import traceback
            traceback.print_exc()
            await db.rollback()
            exit(1)
            
if __name__ == "__main__":
    asyncio.run(test_mercadopago_flow())
