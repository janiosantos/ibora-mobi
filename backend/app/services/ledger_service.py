from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from decimal import Decimal
from uuid import UUID
import uuid

from app.modules.finance.models.ledger import LedgerAccount, LedgerEntry

class LedgerService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_or_create_account(self, name: str, type: str, user_id: UUID = None) -> LedgerAccount:
        stmt = select(LedgerAccount).where(LedgerAccount.name == name)
        if user_id:
            stmt = stmt.where(LedgerAccount.user_id == user_id)
        
        result = await self.db.execute(stmt)
        account = result.scalars().first()
        
        if not account:
            account = await self.create_account(name, type, user_id)
            
        return account

    async def create_account(self, name: str, type: str, user_id: UUID = None) -> LedgerAccount:
        account = LedgerAccount(name=name, type=type, user_id=user_id, balance=0)
        self.db.add(account)
        await self.db.commit()
        await self.db.refresh(account)
        return account

    async def record_transaction(
        self,
        debit_account_id: UUID,
        credit_account_id: UUID,
        amount: Decimal,
        description: str,
        reference_type: str = None,
        reference_id: UUID = None
    ) -> UUID:
        """
        Records a double-entry transaction.
        Atomic operation: Debit one account, credit another.
        """
        transaction_id = uuid.uuid4()
        
        # Entry 1: Debit (Increase Asset/Expense or Decrease Liability/Equity/Revenue)
        # For simplicity, let's treat normal accounting:
        # Asset: Debit increases
        # Liability: Credit increases
        # Revenue: Credit increases
        # Expense: Debit increases
        # Equity: Credit increases
        
        entry_debit = LedgerEntry(
            transaction_id=transaction_id,
            account_id=debit_account_id,
            amount=amount,
            direction="DEBIT",
            description=description,
            reference_type=reference_type,
            reference_id=reference_id
        )
        
        entry_credit = LedgerEntry(
            transaction_id=transaction_id,
            account_id=credit_account_id,
            amount=amount,
            direction="CREDIT",
            description=description,
            reference_type=reference_type,
            reference_id=reference_id
        )
        
        self.db.add(entry_debit)
        self.db.add(entry_credit)
        
        # Update balances (Naive approach, race conditions possible in high concurrency without locking rows)
        # TODO: Implement SELECT FOR UPDATE or similar locking mechanism
        
        acc_debit = await self.db.get(LedgerAccount, debit_account_id)
        acc_credit = await self.db.get(LedgerAccount, credit_account_id)
        
        if not acc_debit or not acc_credit:
             raise ValueError("Accounts not found")

        # Update Logic
        # Asset/Expense: +Debit, -Credit
        # Others: -Debit, +Credit
        
        def update_balance(account, amount, direction):
            is_normal_debit = account.type in ['ASSET', 'EXPENSE']
            if is_normal_debit:
                if direction == 'DEBIT':
                    account.balance += amount
                else:
                    account.balance -= amount
            else:
                if direction == 'CREDIT':
                    account.balance += amount
                else:
                    account.balance -= amount
        
        update_balance(acc_debit, amount, 'DEBIT')
        update_balance(acc_credit, amount, 'CREDIT')
        
        await self.db.commit()
        
        return transaction_id
