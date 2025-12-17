from pydantic import BaseModel, field_validator, ConfigDict
from datetime import datetime
from typing import Optional, List
from decimal import Decimal

class WithdrawalRequest(BaseModel):
    amount: Decimal
    pix_key: str
    pix_key_type: str  # "cpf", "cnpj", "email", "phone", "random"
    
    @field_validator('amount')
    @classmethod
    def validate_amount(cls, v):
        if v <= 0:
            raise ValueError('Amount must be positive')
        if v < 50.0:
            raise ValueError('Minimum withdrawal is R$ 50.00')
        return v
    
    @field_validator('pix_key')
    @classmethod
    def validate_pix_key(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Pix key is required')
        return v.strip()

class WithdrawalResponse(BaseModel):
    id: int # FinancialEvent id is Integer
    amount: Decimal
    status: str
    pix_key: str
    created_at: datetime
    estimated_completion: datetime
    
    model_config = ConfigDict(from_attributes=True)

class WalletStats(BaseModel):
    total_earned: Decimal
    total_withdrawn: Decimal

class WalletResponse(BaseModel):
    total_balance: Decimal
    held_balance: Decimal
    blocked_balance: Decimal
    available_balance: Decimal
    credit_balance: Decimal
    minimum_withdrawal: Decimal
    can_withdraw: bool
    stats: WalletStats
    
    model_config = ConfigDict(from_attributes=True)

class TransactionResponse(BaseModel):
    id: int
    type: str # EventType value
    amount: Decimal
    description: Optional[str]
    ride_id: Optional[str] # UUID as string
    created_at: datetime
    metadata: Optional[dict] = None # metadata field from DB

    model_config = ConfigDict(from_attributes=True)

class TransactionHistoryResponse(BaseModel):
    current_balance: Decimal
    transactions: List[TransactionResponse]
    page: int
    page_size: int
    total: int
