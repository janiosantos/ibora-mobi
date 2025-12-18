import asyncio
import sys
import os
from unittest.mock import MagicMock, patch

# Add parent dir to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Mock Stripe before importing app modules potentially using it
sys.modules['stripe'] = MagicMock()

from app.services.payment.stripe_client import stripe_client
from app.services.payment.stripe_customer_service import StripeCustomerService
from app.modules.finance.models.payment_method import PaymentMethod
from app.modules.auth.models.user import User
from app.modules.passengers.models.passenger import Passenger
from app.modules.drivers.models.driver import Driver
from app.modules.finance.models.financial_event import FinancialEvent
from app.modules.rides.models.ride import Ride
from app.modules.finance.models.payment import Payment
from app.modules.finance.models.wallet import DriverWallet
from app.modules.finance.models.settlement import Settlement
from app.core.database import AsyncSessionLocal
from sqlalchemy import select
from uuid import uuid4

# Mock Values
MOCK_CUSTOMER_ID = "cus_test123"
MOCK_PAYMENT_METHOD_ID = "pm_test456"
MOCK_CARD_TOKEN = "tok_visa"

async def test_stripe_logic():
    print("🚀 Starting Stripe Integration Logic Test (Mocked)...")
    
    # Mock Stripe Client methods
    stripe_client.create_customer = MagicMock(return_value=MagicMock(id=MOCK_CUSTOMER_ID))
    stripe_client.create_payment_method = MagicMock(return_value={
        "id": MOCK_PAYMENT_METHOD_ID,
        "card": {
            "brand": "visa",
            "last4": "4242",
            "exp_month": 12,
            "exp_year": 2025,
            "funding": "credit"
        }
    })
    
    async with AsyncSessionLocal() as db:
        # 1. Create Dummy User
        user_email = f"test_stripe_{uuid4().hex[:8]}@example.com"
        user = User(
            email=user_email,
            password_hash="hashed",
            user_type="passenger",
            status="active"
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        print(f"✅ Created Test User: {user.email}")
        
        # 2. Test Get/Create Customer
        print(f"Testing StripeCustomerService...")
        customer_id = await StripeCustomerService.get_or_create_customer(user, db)
        
        # Check DB update
        await db.refresh(user)
        assert user.stripe_customer_id == MOCK_CUSTOMER_ID
        assert customer_id == MOCK_CUSTOMER_ID
        print(f"✅ Customer Service returned ID: {customer_id}")
        
        # 3. Test Add Payment Method Logic (Simulating API logic)
        print(f"Testing Payment Method Creation...")
        
        # Call Client Wrapper
        pm_stripe = stripe_client.create_payment_method(MOCK_CARD_TOKEN, customer_id)
        card = pm_stripe["card"]
        
        # Create DB Record
        pm = PaymentMethod(
            user_id=user.id,
            stripe_customer_id=customer_id,
            stripe_payment_method_id=pm_stripe["id"],
            card_brand=card["brand"],
            card_last4=card["last4"],
            card_exp_month=card["exp_month"],
            card_exp_year=card["exp_year"],
            is_default=True,
            is_active=True
        )
        db.add(pm)
        await db.commit()
        await db.refresh(pm)
        
        assert pm.stripe_payment_method_id == MOCK_PAYMENT_METHOD_ID
        print(f"✅ Payment Method saved in DB: {pm.id} ({pm.card_brand} {pm.card_last4})")
        
    print("\n🎉 Test Completed Successfully!")

if __name__ == "__main__":
    asyncio.run(test_stripe_logic())
