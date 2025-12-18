import asyncio
import os
import sys
import logging
from datetime import datetime, timezone, date
from decimal import Decimal
from unittest.mock import MagicMock, patch

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.database import AsyncSessionLocal
from app.services.payout_service import PayoutService
from app.services.ledger_service import LedgerService
from app.modules.drivers.models.driver import Driver
from app.modules.auth.models.user import User
from app.modules.finance.models.payout import Payout
from app.modules.passengers.models.passenger import Passenger
from app.modules.finance.models.financial_event import FinancialEvent
from app.modules.finance.models.wallet import DriverWallet
from app.modules.finance.models.settlement import Settlement
from app.modules.finance.models.ledger import LedgerAccount
from app.services.payment.efi_client import EfiClient

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def verify_payout_flow():
    driver_user_id = None
    driver_id = None
    
    async with AsyncSessionLocal() as db:
        logger.info("Setting up Driver...")
        
        # 1. Create User and Driver
        import uuid
        email = f"driver_payout_{uuid.uuid4()}@test.com"
        user = User(
            email=email, 
            password_hash="hash", 
            user_type="driver", 
            phone=f"11{uuid.uuid4().int % 1000000000}",
            phone_verified=True
        )
        db.add(user)
        await db.flush()
        driver_user_id = user.id
        
        driver = Driver(
            user_id=user.id, 
            full_name="Payout Driver", 
            cpf=f"{uuid.uuid4().int % 100000000000}",
            phone=user.phone,
            email=user.email,
            cnh_number=f"{uuid.uuid4().int % 10000000000}",
            cnh_category="B",
            cnh_expiry_date=date(2030, 1, 1),
            pix_key="12345678909"
        )
        db.add(driver)
        await db.commit()
        await db.refresh(driver)
        driver_id = driver.id
        logger.info(f"Driver created: {driver_id}")
        
        # 2. Add Funds (via Ledger Service manually to simulate earnings)
        # We need to Credit 2100 (Liability)
        ledger_service = LedgerService(db)
        
        driver_code = f"2100-{str(driver_id)[:8]}"
        driver_acc = await ledger_service.get_or_create_account(f"Motorista - {driver_id}", "LIABILITY", driver_code)
        expense_acc = await ledger_service.get_or_create_account("Expense", "EXPENSE", "5000")
        
        # Credit Driver 200.00
        await ledger_service.create_journal_entry(
            transaction_id=f"fe_earn_{uuid.uuid4()}",
            entries=[
                 {"account_id": driver_acc.id, "entry_type": "CREDIT", "amount": Decimal("200.00"), "description": "Ride Earning"},
                 {"account_id": expense_acc.id, "entry_type": "DEBIT", "amount": Decimal("200.00"), "description": "Ride Expense"}
            ]
        )
        await db.commit()
        
        # Verify Balance
        payout_service = PayoutService(db)
        balance = await payout_service.get_driver_available_balance(driver_id)
        logger.info(f"Initial Balance: {balance}")
        
        if balance['available_balance'] < 200:
             logger.error("Balance not updated correctly!")
             return

        # 3. Request Payout
        logger.info("Requesting Payout of R$ 100.00...")
        payout = await payout_service.create_payout(driver_id, Decimal("100.00"))
        logger.info(f"Payout created: {payout.id}, Status: {payout.status}")
        
        # Verify ledger reservation (Balance should decrease)
        balance_after = await payout_service.get_driver_available_balance(driver_id)
        logger.info(f"Balance after request: {balance_after}")
        
        # Note: Ledger Service DEBITED the driver liability account immediately in create_payout.
        # So liability balance (CREDITS - DEBITS) should be 200 - 100 = 100.
        if balance_after['available_balance'] != 100:
             logger.error(f"Balance check failed! Expected 100, got {balance_after['available_balance']}")
             # Proceeding anyway to test processing
    
        # 4. Process Payout (Mocking EfiClient)
        logger.info("Processing Payout...")
        
        with patch('app.services.payment.efi_client.efi_client.send_pix_transfer') as mock_send:
            mock_send.return_value = {
                'e2eId': f'E123456789{uuid.uuid4()}',
                'status': 'SENT',
                'amount': 100.00
            }
            
            await payout_service.process_payout(payout.id)
            
            # Check Status
            await db.refresh(payout)
            logger.info(f"Payout Status: {payout.status}")
            logger.info(f"TxID: {payout.provider_transaction_id}")
            
            if payout.status == 'COMPLETED':
                logger.info("SUCCESS: Payout Completed!")
            else:
                logger.error(f"FAILURE: Payout status is {payout.status}")
                logger.error(f"Reason: {payout.failure_reason}")

if __name__ == "__main__":
    asyncio.run(verify_payout_flow())
