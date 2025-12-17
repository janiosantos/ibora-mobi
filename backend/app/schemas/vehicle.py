from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import Optional
from uuid import UUID

class VehicleBase(BaseModel):
    license_plate: str
    renavam: Optional[str] = None
    brand: str
    model: str
    year: int
    color: str
    category: str = "standard"
    seats: int = 4
    crlv_number: Optional[str] = None
    crlv_expiry_date: Optional[date] = None

class VehicleCreate(VehicleBase):
    pass

class VehicleInDBBase(VehicleBase):
    id: UUID
    driver_id: UUID
    status: str
    approval_status: str
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class Vehicle(VehicleInDBBase):
    pass
