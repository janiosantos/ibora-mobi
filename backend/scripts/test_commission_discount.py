import asyncio
import sys
import os
import uuid
from decimal import Decimal
from datetime import datetime, timedelta

# Add backend directory to sys.path
sys.path.append(os.getcwd())

from app.core.database import AsyncSessionLocal as async_session_factory
from app.services.payment_service import PaymentService
from app.modules.auth.models.user import User
from app.modules.drivers.models.driver import Driver
from app.modules.incentives.models.campaign import Campaign, CampaignType, DriverIncentive

async def test_discount():
    async with async_session_factory() as db:
        print("🚀 Starting Commission Discount Test...")

        # 1. Create Driver User
        driver_email = f"driver_disc_{uuid.uuid4().hex[:6]}@example.com"
        # Generate random unique phone
        driver_phone = f"+55119{uuid.uuid4().int % 100000000:08d}"

        driver_user = User(
            email=driver_email,
            password_hash="hashed_secret",
            phone=driver_phone,
            user_type="driver"
        )
        db.add(driver_user)
        await db.flush() # flush to get ID

        # 2. Create Driver Profile
        # Generate random CPF/CNH to satisfy unique constraints
        random_cpf = f"{uuid.uuid4().int % 100000000000:011d}"
        random_cnh = f"{uuid.uuid4().int % 10000000000:010d}"

        driver_profile = Driver(
            user_id=driver_user.id,
            full_name="Discount Driver",
            email=driver_email,
            phone=driver_phone,
            cpf=random_cpf,
            cnh_number=random_cnh,
            cnh_category="B",
            cnh_expiry_date=datetime.now().date() + timedelta(days=365),
            status="active"
        )
        db.add(driver_profile)
        await db.flush()

        # 3. Create Discount Campaign
        campaign = Campaign(
            name="Super Driver Discount",
            description="5% Off Commission",
            start_date=datetime.utcnow() - timedelta(days=1),
            end_date=datetime.utcnow() + timedelta(days=30),
            type=CampaignType.COMMISSION_DISCOUNT,
            rules={"discount_percent": 5},
            enabled=True
        )
        db.add(campaign)
        await db.flush()

        # 4. Assign Incentive to Driver
        # reward_amount 0.05 represents 5% discount
        incentive = DriverIncentive(
            campaign_id=campaign.id,
            driver_id=driver_profile.id,
            target_value=1, # Irrelevant for discount
            current_value=1,
            reward_amount=Decimal("0.05"), # 5% Discount
            achieved=True 
        )
        db.add(incentive)
        await db.commit() # Commit all

        print(f"✅ Setup Complete. DriverID: {driver_profile.id}, Incentive: 5%")

        # 5. Distribute Payment
        payment_service = PaymentService(db)
        ride_id = uuid.uuid4()
        ride_amount = Decimal("100.00")
        
        # Standard fee is 20% (20.00)
        # With 5% discount, fee should be 15% (15.00)
        
        # Dummy passenger ID (not used in logic check but required by signature)
        passenger_id = uuid.uuid4() 

        print(f"💰 Distributing Payment for R$ {ride_amount}...")
        
        result = await payment_service.distribute_ride_payment(
            ride_id=ride_id,
            amount=ride_amount,
            passenger_id=passenger_id,
            driver_user_id=driver_user.id,
            driver_id=driver_profile.id
        )

        platform_fee = result["platform_fee"]
        driver_amount = result["driver_amount"]

        print(f"   Platform Fee: R$ {platform_fee}")
        print(f"   Driver Amount: R$ {driver_amount}")

        # Assertions
        expected_fee = Decimal("15.00") # 15% of 100
        
        if abs(platform_fee - expected_fee) < Decimal("0.01"):
            print("✅ SUCCESS: Commission was correctly discounted to 15%!")
        else:
            print(f"❌ FAILURE: Expected R$ {expected_fee}, got R$ {platform_fee}")
            sys.exit(1)

if __name__ == "__main__":
    asyncio.run(test_discount())
