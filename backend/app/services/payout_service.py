from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from uuid import UUID
from decimal import Decimal
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional
import httpx # For Mock Gateway

from app.modules.finance.models.payout import Payout
from app.modules.finance.models.ledger import LedgerAccount, LedgerEntry, LedgerRunningBalance
from app.modules.drivers.models.driver import Driver
from app.modules.rides.models.ride import Ride
from app.services.ledger_service import LedgerService
# from app.core.events import event_bus # If exists

class PayoutService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.ledger_service = LedgerService(db)
        self.PAYOUT_HOLD_HOURS = 24
        
    async def get_driver_balance(self, driver_id: UUID) -> Decimal:
        """
        Calculates driver balance from Ledger.
        """
        # Try running balance first (Optimization)
        # stmt = select(LedgerRunningBalance).where(LedgerRunningBalance.driver_id == driver_id).order_by(LedgerRunningBalance.calculated_at.desc())
        # ...
        
        # Live calculation for now to be safe
        driver_code_prefix = "2100" # Liability
        
        # We need to sum credits - debits for Liability account of this driver
        # We know the account code is f"2100-{short_id}"
        driver_code = f"2100-{str(driver_id)[:8]}"
        
        account_res = await self.db.execute(select(LedgerAccount).where(LedgerAccount.code == driver_code))
        account = account_res.scalars().first()
        
        if not account:
            return Decimal("0.00")
            
        result = await self.db.execute(
            select(
                func.sum(LedgerEntry.amount).filter(LedgerEntry.entry_type == 'CREDIT').label('credits'),
                func.sum(LedgerEntry.amount).filter(LedgerEntry.entry_type == 'DEBIT').label('debits')
            )
            .where(LedgerEntry.account_id == account.id)
            .where(LedgerEntry.reversed == False)
        )
        
        row = result.one()
        credits = row.credits or Decimal("0")
        debits = row.debits or Decimal("0")
        
        return credits - debits

    async def get_driver_available_balance(self, driver_id: UUID) -> Dict:
        total_balance = await self.get_driver_balance(driver_id)
        
        # Rides in Hold (Last 24h)
        # Assuming we can query Rides and calculate their share (80%)
        # Or better, query Ledger Entries for RIDE_PAYMENT in last 24h?
        # Blueprint says verify Ride status PAID + 24h.
        
        hold_time = datetime.now(timezone.utc) - timedelta(hours=self.PAYOUT_HOLD_HOURS)
        
        # This query is approximated. Ideally we check Ledger entries linked to these rides.
        # But consistent with blueprint logic:
        rides_in_hold_query = await self.db.execute(
            select(func.sum(Ride.final_price * Decimal("0.80")))
            .where(Ride.driver_id == driver_id)
            .where(Ride.status == 'COMPLETED') # or 'paid'
             # Assumption: completed rides are paid or guaranteed in this model
            .where(Ride.created_at > hold_time) # Approx completed_at
        )
        hold_amount = rides_in_hold_query.scalar() or Decimal("0")
        
        # Pending Payouts
        # Since we debit the ledger immediately upon Payout creation (Reservation),
        # the 'total_balance' already reflects the deduction.
        # So we do NOT need to subtract pending_payouts again.
        # pending_payouts_query is practically useful for UI display (Pending Withdrawals),
        # but not for 'Available for NEW withdrawal' calculation if already debited.
        
        pending_payouts_query = await self.db.execute(
            select(func.sum(Payout.amount))
            .where(Payout.driver_id == driver_id)
            .where(Payout.status.in_(['PENDING', 'PROCESSING']))
        )
        pending_amount = pending_payouts_query.scalar() or Decimal("0")
        
        available = total_balance - hold_amount 
        
        return {
            "total_balance": total_balance + pending_amount, # Show "Gross" balance including pending? Or just Net? Ledger is Net.
            # Let's return Net in total_balance, but maybe UI wants "Gross"?
            # For now: total_balance is what is in Ledger (Net).
            "total_balance": total_balance,
            "hold_amount": hold_amount,
            "pending_payouts": pending_amount,
            "available_balance": max(Decimal("0"), available)
        }

    async def create_payout(self, driver_id: UUID, amount: Decimal) -> Payout:
        driver = await self.db.get(Driver, driver_id)
        if not driver:
            raise ValueError("Driver not found")
            
        # Validate balance
        balance_info = await self.get_driver_available_balance(driver_id)
        if balance_info["available_balance"] < amount:
             raise ValueError(f"Insufficient funds. Available: {balance_info['available_balance']}")
             
        # Create Payout
        payout = Payout(
            driver_id=driver_id,
            amount=amount,
            status="PENDING",
            bank_details={"pix_key": driver.pix_key} if hasattr(driver, 'pix_key') else {"pix_key": "mock-key"},
            provider="efi"
        )
        self.db.add(payout)
        await self.db.commit()
        await self.db.refresh(payout)
        
        # Ledger Reservation (Debit Driver, Credit Bank Payable?)
        driver_code = f"2100-{str(driver_id)[:8]}"
        driver_acc = await self.ledger_service.get_or_create_account(f"Motorista - {driver_id}", "LIABILITY", driver_code)
        
        bank_acc = await self.ledger_service.get_or_create_account("Banco Corrente", "ASSET", "1200")
        
        await self.ledger_service.create_journal_entry(
            transaction_id=f"payout_{payout.id}",
            entries=[
                {
                    "account_id": driver_acc.id,
                    "entry_type": "DEBIT", # LIABILITY DEBIT = DECREASE (Driver has less to receive)
                    "amount": amount,
                    "description": f"Payout Request {payout.id}",
                    "reference_type": "PAYOUT",
                    "reference_id": payout.id
                },
                {
                    "account_id": bank_acc.id,
                    "entry_type": "CREDIT", # ASSET CREDIT = DECREASE (Bank has less money)
                    "amount": amount,
                    "description": f"Payout Reservation {payout.id}",
                    "reference_type": "PAYOUT",
                    "reference_id": payout.id
                }
            ]
        )
        
        return payout

    async def process_payout(self, payout_id: UUID):
        payout = await self.db.get(Payout, payout_id)
        if not payout or payout.status != 'PENDING':
            return
            
        payout.status = 'PROCESSING'
        payout.processing_started_at = datetime.now(timezone.utc)
        await self.db.commit()
        
        try:
            # Mock Gateway Call
            # await efi_client.pay(...)
            txid = f"mock_tx_{payout.id}"
            
            payout.status = 'COMPLETED'
            payout.provider_transaction_id = txid
            payout.completed_at = datetime.now(timezone.utc)
            
            # No additional ledger entry needed if we already credited Bank in `create_payout`?
            # Blueprint logic seems to do the accounting AT payout creation (Reservation).
            # If it fails, we REVERSE it.
            
        except Exception as e:
            payout.status = 'FAILED'
            payout.failed_at = datetime.now(timezone.utc)
            payout.failure_reason = str(e)
            
            # Reverse Ledger
            # Find original entries? We know the structure.
            # Reversal: Debit Bank (Asset +), Credit Driver (Liability +)
            
            driver_code = f"2100-{str(payout.driver_id)[:8]}"
            driver_acc = await self.ledger_service.get_or_create_account(f"Motorista - {payout.driver_id}", "LIABILITY", driver_code)
            bank_acc = await self.ledger_service.get_or_create_account("Banco Corrente", "ASSET", "1200")
            
            await self.ledger_service.create_journal_entry(
                 transaction_id=f"rev_payout_{payout.id}",
                 entries=[
                     {
                         "account_id": bank_acc.id,
                         "entry_type": "DEBIT", # Reverse Credit
                         "amount": payout.amount,
                         "description": f"Reversal Payout {payout.id}",
                         "reference_type": "PAYOUT_REVERSAL",
                         "reference_id": payout.id
                     },
                     {
                         "account_id": driver_acc.id,
                         "entry_type": "CREDIT", # Reverse Debit
                         "amount": payout.amount,
                         "description": f"Reversal Payout {payout.id}",
                         "reference_type": "PAYOUT_REVERSAL",
                         "reference_id": payout.id
                     }
                 ],
                 reversed_entry_id=None # We could link to original if we fetched it
            )
            
        await self.db.commit()
