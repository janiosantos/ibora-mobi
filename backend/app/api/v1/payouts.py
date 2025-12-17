from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core import database
from app.api import deps
from app.modules.auth.models.user import User
from app.modules.drivers.models.driver import Driver
from app.modules.finance.models.payout import Payout
from app.services.payout_service import PayoutService
from app.schemas import payout as payout_schema

router = APIRouter()

async def get_current_driver(
    db: AsyncSession = Depends(database.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Driver:
    if current_user.user_type != "driver":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Current user is not a driver"
        )
    
    result = await db.execute(select(Driver).where(Driver.user_id == current_user.id))
    driver = result.scalars().first()
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Driver profile not found"
        )
    return driver

@router.get("/balance", response_model=payout_schema.BalanceResponse)
async def get_balance(
    db: AsyncSession = Depends(database.get_db),
    driver: Driver = Depends(get_current_driver),
) -> Any:
    """
    Get current driver's financial balance (Total, Held, Available).
    """
    service = PayoutService(db)
    balance_info = await service.get_driver_available_balance(driver.id)
    return balance_info

@router.post("/request", response_model=payout_schema.PayoutResponse)
async def request_payout(
    *,
    db: AsyncSession = Depends(database.get_db),
    payout_in: payout_schema.PayoutCreate,
    driver: Driver = Depends(get_current_driver),
) -> Any:
    """
    Request a payout. Money will be reserved immediately.
    """
    service = PayoutService(db)
    try:
        payout = await service.create_payout(driver.id, payout_in.amount)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return payout

@router.get("/history", response_model=List[payout_schema.PayoutResponse])
async def get_payout_history(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(database.get_db),
    driver: Driver = Depends(get_current_driver),
) -> Any:
    """
    List payout requests.
    """
    query = select(Payout).where(Payout.driver_id == driver.id).order_by(Payout.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    payouts = result.scalars().all()
    return payouts
