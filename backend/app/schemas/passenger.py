from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

class PassengerBase(BaseModel):
    full_name: str
    cpf: Optional[str] = None
    phone: str
    default_payment_method: str = "pix"
    favorite_addresses: List[Dict[str, Any]] = []

class PassengerCreate(PassengerBase):
    pass

class PassengerUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    default_payment_method: Optional[str] = None
    favorite_addresses: Optional[List[Dict[str, Any]]] = None

class PassengerInDBBase(PassengerBase):
    id: UUID
    user_id: UUID
    status: str
    average_rating: float
    total_ratings: int
    total_rides: int
    total_spent: float
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class Passenger(PassengerInDBBase):
    pass

# For list responses
from typing import Any
