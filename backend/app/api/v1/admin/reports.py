from typing import Any, List, Optional
from datetime import datetime, date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload

from app.core import database
from app.api import deps
from app.modules.auth.models.user import User
from app.modules.finance.models.payment import Payment, PaymentStatus
from app.modules.drivers.models.driver import Driver
from app.modules.rides.models.ride import Ride

router = APIRouter()

@router.get("/cash-reconciliation", response_model=List[dict])
async def get_cash_reconciliation_report(
    *,
    db: AsyncSession = Depends(database.get_db),
    current_user: User = Depends(deps.get_current_admin),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    driver_id: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    Get report of cash payments for reconciliation.
    """
    query = (
        select(Payment)
        .options(
            selectinload(Payment.ride).selectinload(Ride.driver),
            selectinload(Payment.ride).selectinload(Ride.passenger)
        )
        .where(
            Payment.payment_method == 'cash',
            Payment.status == PaymentStatus.COMPLETED
        )
    )

    if start_date:
        query = query.where(Payment.created_at >= datetime.combine(start_date, datetime.min.time()))
    if end_date:
        query = query.where(Payment.created_at <= datetime.combine(end_date, datetime.max.time()))
        
    if driver_id:
        # We need to join Ride -> Driver to filter by driver_id if Payment doesn't have it directly.
        # Payment has ride_id. Ride has driver_id.
        # Or Payment might store driver_id? Not in my recollection of view_file earlier.
        # Payment has ride_id, passenger_id.
        # We need to filter by Ride.driver_id
        # We must join Ride for this.
        query = query.join(Ride).where(Ride.driver_id == driver_id)

    query = query.offset(skip).limit(limit).order_by(Payment.created_at.desc())
    
    result = await db.execute(query)
    payments = result.scalars().all()
    
    report_data = []
    for p in payments:
        driver_name = "Unknown"
        if p.ride and p.ride.driver:
            driver_name = p.ride.driver.full_name
            
        report_data.append({
            "payment_id": p.id,
            "ride_id": p.ride_id,
            "amount": p.amount,
            "created_at": p.created_at,
            "driver_name": driver_name,
            "status": p.status
        })
        
    return report_data
