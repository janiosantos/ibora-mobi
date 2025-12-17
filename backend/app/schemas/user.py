from pydantic import BaseModel, EmailStr, Field
from pydantic import ConfigDict
from enum import Enum
from typing import Optional
from datetime import datetime
from uuid import UUID

class UserType(str, Enum):
    passenger = "passenger"
    driver = "driver"
    admin = "admin"

class UserBase(BaseModel):
    email: EmailStr
    phone: Optional[str] = None
    user_type: UserType

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    password: Optional[str] = None

class UserInDBBase(UserBase):
    id: UUID
    status: str
    email_verified: bool
    phone_verified: bool
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class User(UserInDBBase):
    pass
