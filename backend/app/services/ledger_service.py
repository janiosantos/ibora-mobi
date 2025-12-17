from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from decimal import Decimal
from uuid import UUID
import uuid
from typing import List, Dict, Optional

from app.modules.finance.models.ledger import LedgerAccount, LedgerEntry

class LedgerService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_or_create_account(
        self, 
        name: str, 
        type: str, 
        code: Optional[str] = None,
        user_id: UUID = None,
        classification: str = "DETAIL",
        description: str = None
    ) -> LedgerAccount:
        """
        Get existing ledger account or create a new one.
        If code is provided, look up by code first.
        """
        stmt = select(LedgerAccount)
        
        if code:
            stmt = stmt.where(LedgerAccount.code == code)
        elif user_id:
            # Fallback (Legacy/System Accounts relative to user)
            # CAUTION: Name collision possible if not careful
            stmt = stmt.where(LedgerAccount.user_id == user_id, LedgerAccount.name == name)
        else:
            stmt = stmt.where(LedgerAccount.name == name)
        
        result = await self.db.execute(stmt)
        account = result.scalars().first()
        
        if not account:
            # Auto-generate code if missing? No, enforce code or fail/mock for now.
            # For backward compatibility/simplicity, we generate a mock code if not provided
            final_code = code or f"SYS-{uuid.uuid4().hex[:8].upper()}"
            account = await self.create_account(name, type, final_code, user_id, classification, description)
            
        return account

    async def create_account(
        self, 
        name: str, 
        type: str, 
        code: str, 
        user_id: UUID = None,
        classification: str = "DETAIL",
        description: str = None
    ) -> LedgerAccount:
        account = LedgerAccount(
            name=name, 
            type=type, 
            code=code, 
            user_id=user_id, 
            balance=0,
            classification=classification,
            description=description
        )
        self.db.add(account)
        await self.db.commit()
        await self.db.refresh(account)
        return account

    async def create_journal_entry(
        self,
        transaction_id: str,
        entries: List[Dict],
        posted_at: Optional[str] = None # datetime
    ) -> str:
        """
        Records a multi-entry transaction (Double Entry Bookkeeping).
        Entries must sum to zero (Debits = Credits).
        
        entries = [
            {"account_id": uuid, "entry_type": "DEBIT", "amount": 100, "description": "foo", "reference_type": "bar", "reference_id": uuid},
            {"account_id": uuid, "entry_type": "CREDIT", "amount": 100, ...}
        ]
        """
        
        # Validation: Sum of Debits == Sum of Credits
        total_debit = sum(e['amount'] for e in entries if e['entry_type'] == 'DEBIT')
        total_credit = sum(e['amount'] for e in entries if e['entry_type'] == 'CREDIT')
        
        if total_debit != total_credit:
            raise ValueError(f"Transaction not balanced: Debits {total_debit} != Credits {total_credit}")

        ledger_entries = []
        for e in entries:
            entry = LedgerEntry(
                transaction_id=transaction_id,
                account_id=e['account_id'],
                amount=e['amount'],
                entry_type=e['entry_type'],
                description=e.get('description'),
                reference_type=e.get('reference_type'),
                reference_id=e.get('reference_id'),
                # posted_at=posted_at
            )
            self.db.add(entry)
            ledger_entries.append(entry)
            
        # Update Balances (Naive mechanism for MVP)
        # In production: Use LedgerRunningBalance with incremental updates or SELECT FOR UPDATE
        for e in entries:
            account = await self.db.get(LedgerAccount, e['account_id'])
            if not account:
                raise ValueError(f"Account {e['account_id']} not found")
            
            # Update Logic matching LedgerAccount type
            # Asset/Expense: Debit (+), Credit (-)
            # Liability/Equity/Revenue: Credit (+), Debit (-)
            
            amount = e['amount']
            direction = e['entry_type']
            
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
        
        await self.db.commit()
        return transaction_id

    async def record_transaction(
        self,
        debit_account_id: UUID,
        credit_account_id: UUID,
        amount: Decimal,
        description: str,
        reference_type: str = None,
        reference_id: UUID = None
    ) -> str:
        """
        Legacy wrapper for simple 2-entry transactions.
        """
        transaction_id = f"tx_{uuid.uuid4().hex}"
        
        entries = [
            {
                "account_id": debit_account_id,
                "entry_type": "DEBIT",
                "amount": amount,
                "description": description,
                "reference_type": reference_type,
                "reference_id": reference_id
            },
            {
                "account_id": credit_account_id,
                "entry_type": "CREDIT",
                "amount": amount,
                "description": description,
                "reference_type": reference_type,
                "reference_id": reference_id
            }
        ]
        
        return await self.create_journal_entry(transaction_id, entries)
