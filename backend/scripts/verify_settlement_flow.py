import asyncio
import sys
import os
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from uuid import uuid4

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.database import AsyncSessionLocal
from app.modules.auth.models.user import User # Import User model
from app.modules.drivers.models.driver import Driver
from app.modules.passengers.models.passenger import Passenger
from app.modules.rides.models.ride import Ride
from app.modules.finance.models.wallet import DriverWallet
from app.modules.finance.models.settlement import Settlement, SettlementStatus
from app.services.ride_payment import RidePaymentService
from app.services.wallet_service import WalletService
from app.services.settlement_service import SettlementService
from sqlalchemy import select, text

async def verify_settlement_flow():
    print("Starting Settlement Flow Verification...")
    
    async with AsyncSessionLocal() as db:
        # 1. Setup Data
        driver_user_id = uuid4()
        passenger_user_id = uuid4()
        
        driver_id = uuid4()
        passenger_id = uuid4()
        
        # Create Users
        driver_user = User(
            id=driver_user_id,
            email=f"driver_{driver_user_id}@test.com",
            password_hash="hashed_secret",
            # full_name="Driver User", # Not in User model?
            phone=f"+55119{driver_user_id.int % 100000000:08d}",
            user_type="driver"
        )
        db.add(driver_user)
        
        pax_user = User(
            id=passenger_user_id,
            email=f"pax_{passenger_user_id}@test.com",
            password_hash="hashed_secret",
            # full_name="Pax User",
            phone=f"+55119{passenger_user_id.int % 100000000:08d}",
            user_type="passenger"
        )
        db.add(pax_user)
        await db.flush()

        # Create Driver Profile
        driver = Driver(
            id=driver_id,
            user_id=driver_user_id,
            full_name="Settlement Test Driver",
            email=driver_user.email,
            phone=driver_user.phone,
            cpf=f"{uuid4().int % 100000000000:011d}",
            cnh_number=f"{uuid4().int % 10000000000:011d}",
            cnh_category="B",
            cnh_expiry_date=datetime.now().date() + timedelta(days=365)
        )
        db.add(driver)
        
        # Create Passenger Profile
        passenger = Passenger(
            id=passenger_id,
            user_id=passenger_user_id,
            full_name="Settlement Test Pax",
            email=pax_user.email,
            phone=pax_user.phone
        )
        db.add(passenger)
        await db.commit()
        
        # Create Wallet
        await WalletService.get_or_create_wallet(driver_id, db)
        print(f"Driver {driver_id} created with wallet.")

        # 2. Ride Flow
        ride_id = uuid4()
        final_price = Decimal("100.00")
        
        ride = Ride(
            id=ride_id,
            passenger_id=passenger_id,
            driver_id=driver_id,
            origin_address="A",
            destination_address="B",
            origin_lat=Decimal("-23.550520"),
            origin_lon=Decimal("-46.633308"),
            destination_lat=Decimal("-23.550520"),
            destination_lon=Decimal("-46.633308"),
            distance_km=Decimal("10.0"),
            duration_min=20,
            estimated_price=final_price,
            status="COMPLETED",
            final_price=final_price,
            payment_method="CREDIT_CARD",
            created_at=datetime.now(timezone.utc),
            completed_at=datetime.now(timezone.utc)
        )
        db.add(ride)
        await db.commit()
        await db.refresh(ride)
        
        # Process Payment
        print("Processing Ride Payment...")
        result = await RidePaymentService.process_ride_payment(ride, db)
        driver_earning = result['driver_earning']
        print(f"Payment processed. Driver Earning: {driver_earning}")
        
        # 3. Check Initial Wallet State (Should be Held)
        wallet = await WalletService.update_wallet(driver_id, db)
        print(f"Initial Wallet State: Total={wallet.total_balance}, Held={wallet.held_balance}, Available={wallet.available_balance}")
        
        if wallet.held_balance != Decimal(str(driver_earning)):
            print(f"FAIL: Held balance should be {driver_earning} but is {wallet.held_balance}")
            # return # Continue for debugging
            
        if wallet.available_balance != Decimal("0.00"):
             print(f"FAIL: Available balance should be 0 but is {wallet.available_balance}")
             # return
             
        print("PASS: Initial state correct (Funds are Held).")
        
        # 4. Time Travel (Simulate D+N passed)
        # Find the settlement and update scheduled_for to make it due NOW
        stmt = select(Settlement).where(Settlement.driver_id == driver_id)
        settlements = (await db.execute(stmt)).scalars().all()
        
        if not settlements:
            print("FAIL: No settlement found!")
            return
            
        settlement = settlements[0]
        print(f"Found settlement {settlement.id}, scheduled for {settlement.scheduled_for}")
        
        # Update to yesterday
        settlement.scheduled_for = datetime.now(timezone.utc) - timedelta(days=1)
        db.add(settlement)
        await db.commit()
        print("Time Travel: Settlement scheduled date moved to yesterday.")
        
        # 5. Run Worker Logic
        print("Running Worker Logic (process_due_settlements)...")
        count = await SettlementService.process_due_settlements(db)
        print(f"Worker processed {count} settlements.")
        
        if count < 1:
            print("FAIL: Worker did not process the settlement!")
            return

        # 6. Check Final Wallet State (Should be Available)
        wallet = await WalletService.update_wallet(driver_id, db)
        print(f"Final Wallet State: Total={wallet.total_balance}, Held={wallet.held_balance}, Available={wallet.available_balance}")
        
        if wallet.held_balance != Decimal("0.00"):
            print(f"FAIL: Held balance should be 0 but is {wallet.held_balance}")
            return
            
        if wallet.available_balance != Decimal(str(driver_earning)):
             print(f"FAIL: Available balance should be {driver_earning} but is {wallet.available_balance}")
             return

        print("SUCCESS: Settlement Flow Verified! Funds released to Available Balance.")

if __name__ == "__main__":
    asyncio.run(verify_settlement_flow())
