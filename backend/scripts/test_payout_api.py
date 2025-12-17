import asyncio
import uuid
import sys
from decimal import Decimal
from datetime import date
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal
from app.modules.auth.models.user import User
from app.modules.drivers.models.driver import Driver
from app.modules.passengers.models.passenger import Passenger
from app.modules.rides.models.ride import Ride
from app.services.ledger_service import LedgerService
from app.services.payout_service import PayoutService
from app.modules.finance.models.ledger import LedgerAccount
from app.core.security import get_password_hash

print("STARTING TEST SCRIPT", flush=True)

async def test_payout_flow():
    print("Entering async function", flush=True)
    async with AsyncSessionLocal() as db:
        print("--- Setting up Test Data ---", flush=True)
        
        # 1. Create User & Driver
        email = f"driver_payout_{uuid.uuid4()}@example.com"
        user = User(
            email=email,
            password_hash=get_password_hash("secret"),
            user_type="driver"
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
        driver = Driver(
            user_id=user.id,
            full_name="Payout Tester",
            email=email,
            phone="+5511999999999",
            cpf=str(uuid.uuid4().int)[:11],
            cnh_number=str(uuid.uuid4().int)[:20],
            cnh_category="B",
            cnh_expiry_date=date(2030, 1, 1),
            status="active"
        )
        db.add(driver)
        await db.commit()
        await db.refresh(driver)
        print(f"Created Driver: {driver.id}")
        
        # 2. Credit Driver Ledger (Simulate Earnings)
        ledger_service = LedgerService(db)
        payout_service = PayoutService(db)
        
        # Ensure accounts exist
        driver_code = f"2100-{str(driver.id)[:8]}"
        driver_acc = await ledger_service.get_or_create_account(f"Motorista - {driver.id}", "LIABILITY", driver_code)
        expense_acc = await ledger_service.get_or_create_account("Despesa Servicos", "EXPENSE", "3000") # Source of funds (e.g. Platform paying bonus/adjustment)
        
        credit_amount = Decimal("200.00")
        
        print(f"Crediting Ledger: {credit_amount}")
        await ledger_service.create_journal_entry(
            transaction_id=f"manual_credit_{uuid.uuid4()}",
            entries=[
                {
                    "account_id": expense_acc.id,
                    "entry_type": "DEBIT",
                    "amount": credit_amount,
                    "description": "Manual Credit for Test",
                    "reference_type": "MANUAL",
                    "reference_id": uuid.uuid4()
                },
                {
                    "account_id": driver_acc.id,
                    "entry_type": "CREDIT",
                    "amount": credit_amount,
                    "description": "Manual Credit for Test",
                    "reference_type": "MANUAL",
                    "reference_id": uuid.uuid4()
                }
            ]
        )
        
        # 3. Check Balance
        balance = await payout_service.get_driver_available_balance(driver.id)
        print(f"Initial Balance: {balance}")
        assert balance['total_balance'] == credit_amount
        assert balance['available_balance'] == credit_amount
        
        # 4. Request Payout
        payout_amount = Decimal("50.00")
        print(f"Requesting Payout: {payout_amount}")
        
        payout = await payout_service.create_payout(driver.id, payout_amount)
        print(f"Payout Created: {payout.id} - Status: {payout.status}")
        
        assert payout.status == "PENDING"
        assert payout.amount == payout_amount
        
        # 5. Check Balance Post-Payout
        # Driver Liability should reduce by 50.00 (Debit)
        new_balance = await payout_service.get_driver_available_balance(driver.id)
        print(f"Post-Payout Balance: {new_balance}")
        
        # Ledger is updated immediately on creation
        expected_balance = credit_amount - payout_amount
        assert new_balance['total_balance'] == expected_balance
        assert new_balance['available_balance'] == expected_balance
        
        print("--- Payout Flow Verified Successfully ---")

if __name__ == "__main__":
    asyncio.run(test_payout_flow())
