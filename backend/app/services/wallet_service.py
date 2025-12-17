from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from decimal import Decimal
from uuid import UUID
from typing import Dict, Tuple

from app.modules.finance.models.wallet import DriverWallet
from app.modules.drivers.models.driver import Driver
from app.modules.finance.models.financial_event import FinancialEvent, EventType, EventStatus
# from app.modules.finance.models.settlement import Settlement, SettlementStatus # Task 5.2.1

import logging

logger = logging.getLogger(__name__)

class WalletService:
    """
    Manage driver wallet
    """
    
    @staticmethod
    async def get_or_create_wallet(driver_id: UUID, db: AsyncSession) -> DriverWallet:
        """
        Get driver wallet or create if doesn't exist
        """
        stmt = select(DriverWallet).where(DriverWallet.driver_id == driver_id)
        result = await db.execute(stmt)
        wallet = result.scalars().first()
        
        if not wallet:
            wallet = DriverWallet(driver_id=driver_id)
            db.add(wallet)
            await db.commit()
            await db.refresh(wallet)
            
            logger.info(f"Wallet created for driver {driver_id}")
        
        return wallet
    
    @staticmethod
    async def calculate_balances(driver_id: UUID, db: AsyncSession) -> Dict[str, Decimal]:
        """
        Calculate all balance types from financial events
        
        Returns:
            {
                "total_balance": Decimal,
                "held_balance": Decimal,
                "blocked_balance": Decimal,
                "available_balance": Decimal,
                "credit_balance": Decimal
            }
        """
        
        # 1. Calculate Total Balance (Sum of all COMPLETED events)
        # Includes Earnings (+) and Withdrawals (-)
        stmt = select(func.sum(FinancialEvent.amount)).where(
            FinancialEvent.driver_id == driver_id,
            FinancialEvent.status == EventStatus.COMPLETED
        )
        result = await db.execute(stmt)
        total_balance = Decimal(str(result.scalar() or 0))
        
        # 2. Calculate Pending Withdrawals (Amount locked in pending request)
        stmt = select(func.sum(FinancialEvent.amount)).where(
            FinancialEvent.driver_id == driver_id,
            FinancialEvent.status == EventStatus.PENDING,
            FinancialEvent.event_type == EventType.WALLET_WITHDRAWAL
        )
        result = await db.execute(stmt)
        pending_withdrawals = abs(Decimal(str(result.scalar() or 0))) # Amount is negative, take abs

        
        
        # 3. Calculate Held Balance (Settlements) - Task 5.2.1
        # Sum of PENDING settlements
        from app.modules.finance.models.settlement import Settlement, SettlementStatus
        stmt = select(func.sum(Settlement.amount)).where(
            Settlement.driver_id == driver_id,
            Settlement.status == SettlementStatus.PENDING
        )
        result = await db.execute(stmt)
        val = result.scalar()
        held_balance = Decimal(str(val or 0))
        import logging
        logging.getLogger(__name__).info(f"DEBUG: Held Balance Query for {driver_id}: {val} -> {held_balance}")
        
        # 4. Calculate Blocked Balance (Disputes)
        blocked_balance = Decimal(0) # Placeholder
        
        # 5. Calculate Credit Balance (Pre-paid / Incentive Credits)
        # Assuming INCENTIVE_CREDIT is not part of withdrawable cash, effectively separate?
        # Blueprint says: credit_balance = sum(INCENTIVE_CREDIT). 
        # If INCENTIVE_CREDIT events are COMPLETED, they are in total_balance?
        # Typically "Credits" are for platform usage (deducted for commission?), not cash out.
        # If they are in total_balance, they inflate available cash.
        # Let's assume INCENTIVE_CREDIT is separate usage credit, NOT cashable.
        # So it SHOULD NOT be in total_balance?
        # If FinancialEvent records it, it sums to total_balance.
        # We might need to exclude INCENTIVE_CREDIT from total_balance if it's non-cash.
        # For now, let's treat total_balance as "Cash Balance".
        
        stmt = select(func.sum(FinancialEvent.amount)).where(
            FinancialEvent.driver_id == driver_id,
            FinancialEvent.status == EventStatus.COMPLETED,
            FinancialEvent.event_type == EventType.INCENTIVE_CREDIT
        )
        result = await db.execute(stmt)
        credit_balance = Decimal(str(result.scalar() or 0))
        
        # If credits are in total_balance, we should deduct them to get "Cash Balance"?
        # Or maybe total_balance includes everything.
        # available_balance = total - held - blocked - pending_withdrawals
        # If credits are not withdrawable, we should deduct credit_balance too?
        # Blueprint: available_balance = total - held - blocked.
        # Let's stick to blueprint. If logic breaks, we refine.
        
        # Available Balance
        available_balance = total_balance - held_balance - blocked_balance - pending_withdrawals
        
        # Ensure non-negative (though pure math allows negative if debt)
        if available_balance < 0:
            available_balance = Decimal(0)
            
        return {
            "total_balance": total_balance,
            "held_balance": held_balance,
            "blocked_balance": blocked_balance,
            "available_balance": available_balance,
            "credit_balance": credit_balance,
            "pending_withdrawals": pending_withdrawals # internal use
        }

    @staticmethod
    async def update_wallet(driver_id: UUID, db: AsyncSession) -> DriverWallet:
        """
        Recalculate and update wallet balances
        """
        wallet = await WalletService.get_or_create_wallet(driver_id, db)
        balances = await WalletService.calculate_balances(driver_id, db)
        
        wallet.total_balance = balances["total_balance"]
        wallet.held_balance = balances["held_balance"]
        wallet.blocked_balance = balances["blocked_balance"]
        wallet.available_balance = balances["available_balance"]
        wallet.credit_balance = balances["credit_balance"]
        
        await db.commit()
        await db.refresh(wallet)
        
        logger.info(
            f"Wallet updated: driver_id={driver_id}, "
            f"available=R${wallet.available_balance}"
        )
        
        return wallet

    @staticmethod
    async def can_withdraw(
        driver_id: UUID, 
        amount: Decimal, 
        db: AsyncSession
    ) -> Tuple[bool, str]:
        """
        Check if driver can withdraw amount
        """
        wallet = await WalletService.update_wallet(driver_id, db) # Refresh checks
        
        # Check minimum
        if amount < wallet.minimum_withdrawal:
             return False, f"Minimum withdrawal is R${wallet.minimum_withdrawal}"
             
        # Check available balance
        if amount > wallet.available_balance:
            return False, f"Insufficient balance (available: R${wallet.available_balance})"
            
        # Check if driver has pending withdrawals (Blueprint recommends blocking concurrent withdrawals)
        stmt = select(func.count(FinancialEvent.id)).where(
            FinancialEvent.driver_id == driver_id,
            FinancialEvent.event_type == EventType.WALLET_WITHDRAWAL,
            FinancialEvent.status == EventStatus.PENDING
        )
        result = await db.execute(stmt)
        pending_count = result.scalar()
        
        if pending_count > 0:
            return False, "You have pending withdrawals"
            
        return True, ""
