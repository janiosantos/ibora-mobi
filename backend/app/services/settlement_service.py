from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from decimal import Decimal
from typing import List, Optional

from app.modules.finance.models.settlement import Settlement, SettlementStatus
from app.modules.finance.models.financial_event import FinancialEvent, EventType, EventStatus
from app.services.wallet_service import WalletService
from app.modules.finance.models.wallet import DriverWallet

import logging

logger = logging.getLogger(__name__)

class SettlementService:
    @staticmethod
    def calculate_release_date(base_date: datetime, days: int = 1) -> datetime:
        """
        Calculate release date skipping weekends (D+N)
        If date falls on Sat/Sun, move to Monday.
        """
        target_date = base_date + timedelta(days=days)
        
        # 0=Mon, 4=Fri, 5=Sat, 6=Sun
        weekday = target_date.weekday()
        
        if weekday == 5: # Saturday
            target_date += timedelta(days=2) # Move to Monday
        elif weekday == 6: # Sunday
            target_date += timedelta(days=1) # Move to Monday
            
        return target_date

    @staticmethod
    async def create_settlement_for_event(
        event: FinancialEvent, 
        db: AsyncSession,
        settlement_days: int = 1
    ) -> Optional[Settlement]:
        """
        Create a settlement hold for a financial earning event
        """
        # Check if already exists
        stmt = select(Settlement).where(Settlement.financial_event_id == event.id)
        result = await db.execute(stmt)
        if result.scalar():
             return None # Already exists
             
        # Only settle earnings
        if event.event_type not in [EventType.RIDE_EARNING, EventType.INCENTIVE_BONUS, EventType.ADJUSTMENT_CREDIT]:
            return None
            
        if event.status != EventStatus.COMPLETED:
            return None

        release_date = SettlementService.calculate_release_date(event.created_at, days=settlement_days)
        
        settlement = Settlement(
            financial_event_id=event.id,
            driver_id=event.driver_id,
            amount=event.amount,
            scheduled_for=release_date,
            status=SettlementStatus.PENDING
        )
        db.add(settlement)
        await db.commit()
        await db.refresh(settlement)
        
        logger.info(f"Created settlement for event {event.id}: {event.amount} on {release_date}")
        
        # Update wallet to reflect Held Balance
        await WalletService.update_wallet(event.driver_id, db)
        
        return settlement

    @staticmethod
    async def process_due_settlements(db: AsyncSession) -> int:
        """
        Process all pending settlements that are due
        """
        now = datetime.now(timezone.utc)
        
        stmt = select(Settlement).where(
            Settlement.status == SettlementStatus.PENDING,
            Settlement.scheduled_for <= now
        )
        result = await db.execute(stmt)
        settlements = result.scalars().all()
        
        count = 0
        for settlement in settlements:
            try:
                # Release funds
                # Logic: The amount moves from Held to Available.
                # In WalletService.calculate_balance, Held is Calculated from Pending Settlements.
                # If we mark as COMPLETED, it will no longer be in Held calculation (if we fix calculation logic).
                # Wait, WalletService.calculate_balances logic needs update to query Settlements table for Held Balance.
                
                settlement.status = SettlementStatus.COMPLETED
                settlement.processed_at = now
                
                # We could create a SETTLEMENT_RELEASE event, but WalletService calculates Total from EARNINGS.
                # Total Balance includes everything.
                # Available = Total - Held - Blocked - PendingWithdrawals.
                # If Settlement is PENDING, it contributes to Held.
                # If Settlement is COMPLETED, it stops contributing to Held.
                # Thus Available increases.
                
                db.add(settlement)
                count += 1
                
                # Update wallet for this driver
                # We do this later or per driver to batch? For MVP, do it here.
                # But querying db inside loop is ok for low volume.
                # For batch, we could collect driver_ids.
                
            except Exception as e:
                logger.error(f"Failed to process settlement {settlement.id}: {e}")
                
        await db.commit()
        
        # Update wallets for unique drivers affected
        driver_ids = set(s.driver_id for s in settlements)
        for driver_id in driver_ids:
            await WalletService.update_wallet(driver_id, db)
            
        logger.info(f"Released {count} settlements")
    @staticmethod
    async def release_settlement(
        settlement: Settlement,
        db: AsyncSession
    ):
        """
        Immediately release a specific settlement (e.g. for Cash payments)
        """
        if settlement.status == SettlementStatus.COMPLETED:
            return

        settlement.status = SettlementStatus.COMPLETED
        settlement.processed_at = datetime.now(timezone.utc)
        db.add(settlement)
        await db.commit()
        await db.refresh(settlement)
        
        await WalletService.update_wallet(settlement.driver_id, db)
        logger.info(f"Released settlement {settlement.id} manually")
