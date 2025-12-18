from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID
from typing import Optional

class NotificationBase(BaseModel):
    title: str
    message: str
    type: str
    read: bool = False

class NotificationCreate(NotificationBase):
    user_id: UUID

class Notification(NotificationBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    read_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)
