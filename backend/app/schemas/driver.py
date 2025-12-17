from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import date, datetime
from uuid import UUID
from app.schemas.vehicle import Vehicle, VehicleCreate

class DriverBase(BaseModel):
    full_name: str
    cpf: str
    phone: str
    cnh_number: str
    cnh_category: str
    cnh_expiry_date: date
    bank_code: Optional[str] = None
    bank_branch: Optional[str] = None
    bank_account: Optional[str] = None
    bank_account_type: Optional[str] = None
    pix_key: Optional[str] = None
    pix_key_type: Optional[str] = None

class DriverCreate(DriverBase):
    vehicle: VehicleCreate

class DriverInDBBase(DriverBase):
    id: UUID
    user_id: UUID
    status: str
    approval_status: str
    average_rating: float
    total_ratings: int
    total_rides: int
    total_earnings: float
    created_at: datetime
    updated_at: datetime
    
    vehicles: List[Vehicle] = []
    
    model_config = ConfigDict(from_attributes=True)

class Driver(DriverInDBBase):
    pass
