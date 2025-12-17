from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
from uuid import UUID
from decimal import Decimal

class RideBase(BaseModel):
    origin_lat: float
    origin_lon: float
    origin_address: str
    destination_lat: float
    destination_lon: float
    destination_address: str
    payment_method: str = "pix"

class RideCreate(RideBase):
    pass

class RideEstimate(RideBase):
    distance_km: float
    duration_min: int
    estimated_price: float
    route_polyline: Optional[str] = None

class RideArrivingResponse(BaseModel):
    ride_id: UUID
    status: str
    eta_seconds: Optional[int]
    
    model_config = ConfigDict(from_attributes=True)

class RideCreateRequest(BaseModel):
    origin_address: str
    destination_address: str
    origin_lat: float | None = None
    origin_lon: float | None = None
    destination_lat: float | None = None
    destination_lon: float | None = None
    payment_method: str = "pix"

class RideInDBBase(RideBase):
    id: UUID
    passenger_id: UUID
    driver_id: Optional[UUID] = None
    vehicle_id: Optional[UUID] = None
    
    distance_km: Optional[Decimal] = None
    duration_min: Optional[int] = None
    estimated_price: Decimal
    final_price: Optional[Decimal] = None
    
    route_polyline: Optional[str] = None
    
    status: str
    created_at: datetime
    accepted_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class Ride(RideInDBBase):
    pass
