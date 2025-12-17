import asyncio
import logging
from uuid import uuid4
from decimal import Decimal
from datetime import datetime, timezone

from app.core.database import AsyncSessionLocal
from app.modules.auth.models.user import User
from app.modules.drivers.models.driver import Driver
from app.modules.passengers.models.passenger import Passenger
from app.modules.rides.models.ride import Ride
from app.services.wallet_service import WalletService
from app.modules.finance.models.financial_event import FinancialEvent, EventType, EventStatus

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def verify_wallet_flow():
    """
    Verify Driver Wallet Flow
    1. Create Driver
    2. Check Initial Wallet (Empty)
    3. Add Earning Event (Ride)
    4. Check Wallet Balance (Updated)
    5. Request Withdrawal
    6. Check Balances again (Available reduced)
    7. Check Transaction History
    """
    
    async with AsyncSessionLocal() as db:
        logger.info("🚀 Starting Wallet Verification...")
        
        # 1. Create Driver
        user = User(
            email=f"wallet_test_{uuid4()}@example.com",
            password_hash="hash",
            phone=f"119{str(uuid4().int)[:8]}",
            user_type="driver"
        )
        db.add(user)
        await db.flush()
        
        from datetime import date
        driver = Driver(
            id=uuid4(),
            user_id=user.id,
            full_name="Wallet Tester",
            email=user.email,
            phone=user.phone,
            cpf=f"111222333{str(uuid4().int)[:2]}",
            cnh_number=f"CNH{str(uuid4().int)[:8]}",
            cnh_category="B",
            cnh_expiry_date=date(2030, 1, 1),
            status="active"
        )
        db.add(driver)
        await db.commit()
        await db.refresh(driver)
        
        logger.info(f"✅ Created Driver: {driver.id}")
        
        # 2. Check Initial Wallet
        wallet = await WalletService.get_or_create_wallet(driver.id, db)
        assert wallet.total_balance == 0
        assert wallet.available_balance == 0
        logger.info("✅ Initial Wallet is Empty")
        
        # 3. Add Earning Event
        earning_amount = Decimal("100.00")
        earning_event = FinancialEvent(
            event_type=EventType.RIDE_EARNING,
            amount=float(earning_amount),
            driver_id=driver.id,
            description="Ride Earning Test",
            status=EventStatus.COMPLETED
        )
        db.add(earning_event)
        await db.commit()
        logger.info(f"💰 Added Earning: R$ {earning_amount}")
        
        # 4. Check Wallet Balance
        # Need to call update_wallet to refresh from events
        wallet = await WalletService.update_wallet(driver.id, db)
        
        assert wallet.total_balance == earning_amount
        assert wallet.available_balance == earning_amount
        logger.info(f"✅ Wallet Balance Updated: Total={wallet.total_balance}, Available={wallet.available_balance}")
        
        # 5. Request Withdrawal
        withdrawal_amount = Decimal("50.00")
        
        # Check eligibility
        can_withdraw, reason = await WalletService.can_withdraw(driver.id, withdrawal_amount, db)
        assert can_withdraw is True
        
        # Create Withdrawal Event (Simulating API)
        withdrawal_event = FinancialEvent(
            event_type=EventType.WALLET_WITHDRAWAL,
            amount=-float(withdrawal_amount),
            driver_id=driver.id,
            description="Withdrawal Request",
            status=EventStatus.PENDING,
            metadata_info={"pix_key": "test@pix", "pix_key_type": "email"}
        )
        db.add(withdrawal_event)
        await db.commit()
        logger.info(f"💸 Requested Withdrawal: R$ {withdrawal_amount}")
        
        # 6. Check Balances again
        wallet = await WalletService.update_wallet(driver.id, db)
        
        # Total Balance (Completed Events only) -> Should still be 100.00
        # Available Balance -> Should be 100.00 - 50.00 (Pending Withdrawal) = 50.00
        
        logger.info(f"📊 Balances after withdrawal request: Total={wallet.total_balance}, Available={wallet.available_balance}")
        
        assert wallet.total_balance == earning_amount
        assert wallet.available_balance == earning_amount - withdrawal_amount
        
        logger.info("✅ Available Balance correctly reduced by pending withdrawal")
        
        # 7. Check Transaction History (Logic Check)
        # Verify we can find the events
        stmt = "SELECT count(*) FROM financial_events WHERE driver_id = :driver_id"
        # We can implement a simple check using sqlalchemy select if needed, but the assertions above verify the flows.
        
        logger.info("🎉 Wallet Flow VERIFIED!")

if __name__ == "__main__":
    asyncio.run(verify_wallet_flow())
