import asyncio
from datetime import datetime, timedelta, timezone
import logging
from decimal import Decimal
import sys
import uuid

# Add backend directory to sys.path to resolve imports
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.database import AsyncSessionLocal
from app.modules.auth.models.user import User
from app.modules.drivers.models.driver import Driver
from app.modules.passengers.models.passenger import Passenger
from app.modules.rides.models.ride import Ride
from app.modules.finance.models.financial_event import FinancialEvent, EventType, EventStatus
from app.modules.finance.models.settlement import Settlement, SettlementStatus
from app.services.ride_payment import RidePaymentService
from app.services.settlement_service import SettlementService
from app.services.wallet_service import WalletService
from app.jobs.settlement_releaser import SettlementReleaserJob

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def verify_settlement_flow():
    async with AsyncSessionLocal() as db:
        logger.info("🚀 Starting Settlement Verification...")

        # 1. Setup Test Data (Driver, Passenger, Ride)
        # Create unique email/phone to avoid conflict
        suffix = datetime.now().strftime("%H%M%S")
        
        # User/Driver
        driver_email = f"driver_settle_{suffix}@test.com"
        driver_phone = f"+551198{suffix}"
        driver_user = User(
            email=driver_email, 
            phone=driver_phone, 
            # full_name removed
            password_hash="hash",
            user_type="driver"
        )
        db.add(driver_user)
        await db.flush()
        
        from datetime import date
        driver = Driver(
            id=driver_user.id, 
            user_id=driver_user.id, 
            full_name="Driver Settle",
            email=driver_email,
            phone=driver_phone,
            cpf=f"123{suffix}",
            cnh_number=f"CNH{suffix}",
            cnh_category="B",
            cnh_expiry_date=date(2030, 1, 1)
        )
        db.add(driver)
        
        # User/Passenger
        pass_email = f"pass_settle_{suffix}@test.com"
        pass_phone = f"+551197{suffix}"
        passenger_user = User(
            email=pass_email, 
            phone=pass_phone, 
            # full_name removed
            password_hash="hash",
            user_type="passenger"
        )
        db.add(passenger_user)
        await db.flush()
        
        passenger = Passenger(
            id=passenger_user.id, 
            user_id=passenger_user.id,
            full_name="Passenger Settle",
            email=pass_email,
            phone=pass_phone
        )
        db.add(passenger)
        
        await db.commit()
        
        # Ride
        ride = Ride(
            passenger_id=passenger.id,
            driver_id=driver.id,
            origin_address="A",
            destination_address="B",
            status="COMPLETED",
            final_price=Decimal("100.00"),
            payment_method="credit_card" # Triggers normal payment flow logic
        )
        db.add(ride)
        await db.commit()
        await db.refresh(ride)
        
        logger.info(f"✅ Created Ride {ride.id} with Price 100.00")
        
        # 2. Process Ride Payment (Trigger Settlement Creation)
        logger.info("💸 Processing Ride Payment...")
        result = await RidePaymentService.process_ride_payment(ride, db)
        earning_event_id = result["earning_event_id"]
        
        # Verify Settlement Exists
        # Check database
        stmt = "SELECT * FROM settlements WHERE financial_event_id = :id"
        from sqlalchemy import text
        res = await db.execute(text(stmt), {"id": earning_event_id})
        settlement_row = res.fetchone()
        
        if not settlement_row:
             logger.error("❌ Settlement NOT created!")
             return
             
        logger.info(f"✅ Settlement Created: ID={settlement_row.id} Amount={settlement_row.amount} Scheduled={settlement_row.scheduled_for}")
        
        # 3. Check Wallet Balances (Should be in HELD, not AVAILABLE)
        wallet = await WalletService.update_wallet(driver.id, db)
        logger.info(f"💰 Wallet Balances: Total={wallet.total_balance}, Held={wallet.held_balance}, Available={wallet.available_balance}")
        
        assert wallet.held_balance == Decimal("100.00") * Decimal("0.80") # Assuming 20% commission from PricingService default
        # Wait, RidePaymentService calls PricingService. 
        # By default PricingService (if mocked or default) might give 100%. 
        # Let's check `process_ride_payment` result
        driver_earning = Decimal(str(result["driver_earning"]))
        
        assert wallet.held_balance == driver_earning
        assert wallet.available_balance == 0
        logger.info("✅ Balances Correct: Funds are HELD.")
        
        # 4. Simulate Time Passage & Run Release Job
        logger.info("asd Simulating Time Travel (Backdating settlement)...")
        # Update settlement scheduled_for to past
        stmt_update = text("UPDATE settlements SET scheduled_for = :past WHERE id = :id")
        await db.execute(stmt_update, {"past": datetime.now(timezone.utc) - timedelta(hours=1), "id": settlement_row.id})
        await db.commit()
        
        logger.info("🕰️ Running Settlement Releaser Job...")
        job = SettlementReleaserJob()
        # Direct call to service method to simulate job run without async loop complexity of job runner
        released_count = await SettlementService.process_due_settlements(db)
        
        assert released_count == 1
        logger.info(f"✅ Released {released_count} settlements")
        
        # 5. Check Wallet Balances (Should be AVAILABLE)
        wallet = await WalletService.update_wallet(driver.id, db)
        logger.info(f"💰 Wallet Balances After Release: Total={wallet.total_balance}, Held={wallet.held_balance}, Available={wallet.available_balance}")
        
        assert wallet.held_balance == 0
        assert wallet.available_balance == driver_earning
        logger.info("✅ Balances Correct: Funds are AVAILABLE.")
        
        logger.info("🎉 Settlement Flow VERIFIED!")

if __name__ == "__main__":
    asyncio.run(verify_settlement_flow())
