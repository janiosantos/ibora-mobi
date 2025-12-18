import asyncio
import sys
import os
from unittest.mock import MagicMock, patch
from datetime import datetime

# Add parent dir to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Mock Stripe
sys.modules['stripe'] = MagicMock()

# Models
from app.modules.finance.models.payment_method import PaymentMethod
from app.modules.finance.models.payment import Payment
from app.modules.auth.models.user import User
from app.modules.passengers.models.passenger import Passenger
from app.modules.drivers.models.driver import Driver
from app.modules.rides.models.ride import Ride
from app.modules.finance.models.financial_event import FinancialEvent
from app.modules.finance.models.settlement import Settlement
from app.modules.finance.models.wallet import DriverWallet

from app.core.database import AsyncSessionLocal
from sqlalchemy import select
from uuid import uuid4

# Mock Values
MOCK_CUSTOMER_ID = f"cus_test_{uuid4().hex[:8]}"
MOCK_PAYMENT_METHOD_ID = f"pm_test_{uuid4().hex[:8]}"
MOCK_INTENT_ID = f"pi_test_{uuid4().hex[:8]}"

async def test_card_payment_flow():
    print("🚀 Starting Card Payment Flow Test...")
    
    # Patch stripe_client in the service module
    with patch('app.services.payment.stripe_client.stripe_client') as mock_stripe:
        # Mock Create Intent
        mock_stripe.create_payment_intent.return_value = {
            "id": MOCK_INTENT_ID,
            "status": "succeeded",
            "amount": 2500,
            "currency": "brl"
        }
        
        async with AsyncSessionLocal() as db:
            # 1. Setup Data
            print("📝 Setting up Test Data...")
            
            # User & Passenger
            user = User(email=f"p_{uuid4().hex[:6]}@test.com", password_hash="x", user_type="passenger", stripe_customer_id=MOCK_CUSTOMER_ID)
            db.add(user)
            await db.flush()
            
            passenger = Passenger(user_id=user.id, full_name="Test Pax", phone="123", email=user.email)
            db.add(passenger)
            
            # Driver
            driver_user = User(email=f"d_{uuid4().hex[:6]}@test.com", password_hash="x", user_type="driver")
            db.add(driver_user)
            await db.flush()
            from random import randint
            unique_cpf = f"{randint(10000000000, 99999999999)}"
            database_driver = Driver(
                user_id=driver_user.id,
                full_name="Test Driver",
                phone="321",
                email=driver_user.email,
                status="active",
                cpf=unique_cpf,
                cnh_number=unique_cpf,
                cnh_category="B",
                cnh_expiry_date=datetime(2030, 1, 1).date() 
            )
            db.add(database_driver)
            await db.flush()
            
            # Payment Method
            pm = PaymentMethod(
                user_id=user.id,
                stripe_customer_id=MOCK_CUSTOMER_ID,
                stripe_payment_method_id=MOCK_PAYMENT_METHOD_ID,
                card_brand="visa",
                card_last4="4242",
                card_exp_month=12,
                card_exp_year=2030,
                is_default=True,
                is_active=True
            )
            db.add(pm)
            
            # Ride (IN_PROGRESS)
            ride = Ride(
                passenger_id=passenger.id,
                driver_id=database_driver.id,
                origin_lat=0.0, origin_lon=0.0, origin_address="A",
                destination_lat=0.0, destination_lon=0.0, destination_address="B",
                estimated_price=25.00,
                status="IN_PROGRESS",
                payment_method="credit_card",
                started_at=datetime.utcnow()
            )
            db.add(ride)
            await db.commit()
            
            ride_id = str(ride.id)
            print(f"✅ Created Ride {ride_id} (IN_PROGRESS) with Credit Card")
            
            # 2. Execute finish_ride Logic
            print("🏁 Executing finish_ride...")
            
            # We import the handler function directly to test logic
            from app.api.v1.rides import finish_ride
            
            # Mock current_user (Driver)
            mock_current_user = driver_user
            
            # Call Endpoint Function
            updated_ride = await finish_ride(ride_id=ride_id, db=db, current_user=mock_current_user)
            
            # 3. Assertions
            print("🔍 Verifying Results...")
            
            # Reload to be sure
            await db.refresh(updated_ride)
            
            # Check Ride Status
            assert updated_ride.status == "COMPLETED"
            assert updated_ride.payment_status == "captured"
            print("✅ Ride Status: COMPLETED, Payment Status: captured")
            
            # Check Payment Record
            stmt_pay = select(Payment).where(Payment.ride_id == updated_ride.id)
            res_pay = await db.execute(stmt_pay)
            payment = res_pay.scalars().first()
            
            assert payment is not None
            assert payment.stripe_payment_intent_id == MOCK_INTENT_ID
            assert payment.status == "completed"
            assert payment.payment_method_id == pm.id
            print(f"✅ Payment Record Created: {payment.id} (Intent: {payment.stripe_payment_intent_id})")
            
            # Check Financial Events (via RidePaymentService)
            # RidePaymentService should have been triggered
            stmt_fe = select(FinancialEvent).where(FinancialEvent.ride_id == updated_ride.id)
            res_fe = await db.execute(stmt_fe)
            events = res_fe.scalars().all()
            
            assert len(events) >= 3 # Payment, Earning, Commission
            print(f"✅ Financial Events Created: {len(events)}")
            
            print("\n🎉 Card Payment Flow Test Validated Successfully!")

if __name__ == "__main__":
    try:
        asyncio.run(test_card_payment_flow())
    except Exception as e:
        print(f"❌ Test Failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
