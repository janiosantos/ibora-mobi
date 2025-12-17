from typing import Optional, Dict
from datetime import datetime
from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel, Field

class PayoutBase(BaseModel):
    amount: Decimal = Field(..., gt=0)
    
class PayoutCreate(PayoutBase):
    pass

class PayoutResponse(PayoutBase):
    id: UUID
    driver_id: UUID
    status: str
    currency: str
    created_at: datetime
    processed_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    failed_at: Optional[datetime] = None
    failure_reason: Optional[str] = None
    provider_transaction_id: Optional[str] = None
    
    class Config:
        from_attributes = True

class BalanceResponse(BaseModel):
    total_balance: Decimal
    hold_amount: Decimal
    pending_payouts: Decimal
    available_balance: Decimal
