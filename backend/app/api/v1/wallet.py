from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from datetime import datetime, timedelta

from app.core.database import get_db
from app.modules.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.drivers.models.driver import Driver
from app.services.wallet_service import WalletService
from app.services.ledger_service import LedgerService
from app.schemas.wallet import WithdrawalRequest, WithdrawalResponse, WalletResponse, TransactionHistoryResponse
from app.modules.finance.models.financial_event import EventType, EventStatus, FinancialEvent

from sqlalchemy import select, func, desc

import logging

router = APIRouter()
logger = logging.getLogger(__name__)

async def get_current_driver(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Driver:
    stmt = select(Driver).where(Driver.user_id == current_user.id)
    result = await db.execute(stmt)
    driver = result.scalars().first()
    
    if not driver:
        raise HTTPException(status_code=404, detail="Driver profile not found")
    return driver

@router.get("/drivers/me/wallet", response_model=WalletResponse)
async def get_my_wallet(
    driver: Driver = Depends(get_current_driver),
    db: AsyncSession = Depends(get_db)
):
    """
    Get driver wallet balances
    """
    wallet = await WalletService.update_wallet(driver.id, db)
    
    # Check if can withdraw minimum
    can_withdraw_bool, _ = await WalletService.can_withdraw(
        driver.id,
        wallet.minimum_withdrawal,
        db
    )
    
    return {
        "total_balance": wallet.total_balance,
        "held_balance": wallet.held_balance,
        "blocked_balance": wallet.blocked_balance,
        "available_balance": wallet.available_balance,
        "credit_balance": wallet.credit_balance,
        "minimum_withdrawal": wallet.minimum_withdrawal,
        "can_withdraw": can_withdraw_bool,
        "stats": {
            "total_earned": wallet.total_earned,
            "total_withdrawn": wallet.total_withdrawn
        }
    }

@router.post("/drivers/me/withdrawals", response_model=WithdrawalResponse)
async def request_withdrawal(
    withdrawal: WithdrawalRequest,
    driver: Driver = Depends(get_current_driver),
    db: AsyncSession = Depends(get_db)
):
    """
    Request withdrawal
    """
    # Check if can withdraw
    can_withdraw, reason = await WalletService.can_withdraw(
        driver.id,
        withdrawal.amount,
        db
    )
    
    if not can_withdraw:
        raise HTTPException(status_code=400, detail=reason)
    
    # Create withdrawal event
    # Using LedgerService directly to creating event, assuming we have a wrapper or method
    # LedgerService currently has create_journal_entry.
    # FinancialEvent should be created directly or via a generic helper.
    # Let's create FinancialEvent directly for now or assume LedgerService.create_financial_event exists?
    # No, it doesn't. I'll create it directly here or add a helper in LedgerService.
    # Pattern: Services encapsulate DB logic.
    # I should add `create_event` to LedgerService or use direct DB add.
    # Let's add it to DB directly for simplicity as per blueprint.
    
    event = FinancialEvent(
        event_type=EventType.WALLET_WITHDRAWAL,
        amount=-float(withdrawal.amount), # stored as float/numeric. Model uses Float? FinancialEvent uses Float.
        driver_id=driver.id,
        description=f"Withdrawal request: R${withdrawal.amount}",
        status=EventStatus.PENDING,
        metadata_info={
            "pix_key": withdrawal.pix_key,
            "pix_key_type": withdrawal.pix_key_type
        }
    )
    db.add(event)
    await db.commit()
    await db.refresh(event)
    
    # Update wallet
    await WalletService.update_wallet(driver.id, db)
    
    # Schedule payout (Task 5.3) - TODO
    
    return {
        "id": event.id,
        "amount": withdrawal.amount,
        "status": "pending",
        "pix_key": withdrawal.pix_key,
        "created_at": event.created_at,
        "estimated_completion": event.created_at + timedelta(hours=2)
    }

@router.get("/drivers/me/wallet/transactions", response_model=TransactionHistoryResponse)
async def get_wallet_transactions(
    transaction_type: Optional[str] = Query(None), # "earning", "withdrawal"
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    driver: Driver = Depends(get_current_driver),
    db: AsyncSession = Depends(get_db)
):
    """
    Get wallet transaction history
    """
    stmt = select(FinancialEvent).where(
        FinancialEvent.driver_id == driver.id,
        FinancialEvent.status == EventStatus.COMPLETED
    )
    
    if transaction_type == "earning":
        stmt = stmt.where(FinancialEvent.event_type.in_([
            EventType.RIDE_EARNING,
            EventType.INCENTIVE_BONUS,
            EventType.ADJUSTMENT_CREDIT
        ]))
    elif transaction_type == "withdrawal":
        stmt = stmt.where(FinancialEvent.event_type.in_([
            EventType.WALLET_WITHDRAWAL,
            EventType.PAYOUT_COMPLETED
        ]))
        
    if start_date:
        stmt = stmt.where(FinancialEvent.created_at >= start_date)
    if end_date:
        stmt = stmt.where(FinancialEvent.created_at <= end_date)
        
    # Count total (separate query or window function)
    # Async count
    count_stmt = select(func.count()).select_from(stmt.subquery())
    result = await db.execute(count_stmt)
    total = result.scalar()
    
    # Pagination
    stmt = stmt.order_by(desc(FinancialEvent.created_at))
    stmt = stmt.offset((page - 1) * page_size).limit(page_size)
    
    result = await db.execute(stmt)
    events = result.scalars().all()
    
    # Get current balance
    wallet = await WalletService.update_wallet(driver.id, db)
    
    transactions = [
        {
            "id": e.id,
            "type": e.event_type,
            "amount": Decimal(str(e.amount)), # Convert float to Decimal
            "description": e.description,
            "ride_id": str(e.ride_id) if e.ride_id else None,
            "created_at": e.created_at,
            "metadata": e.metadata_info
        }
        for e in events
    ]
    
    return {
        "current_balance": wallet.available_balance,
        "transactions": transactions,
        "page": page,
        "page_size": page_size,
        "total": total
    }
