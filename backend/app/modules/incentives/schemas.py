from pydantic import BaseModel, ConfigDict
from enum import Enum
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID
from app.modules.incentives.models.campaign import CampaignType

class CampaignBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime
    type: CampaignType
    rules: Dict[str, Any]
    enabled: bool = True

class CampaignCreate(CampaignBase):
    pass

class CampaignInDBBase(CampaignBase):
    id: UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class Campaign(CampaignInDBBase):
    pass

class DriverMetricBase(BaseModel):
    driver_id: UUID
    date: datetime
    rides_accepted: int
    rides_completed: int
    rides_cancelled: int
    total_km: float
    total_earnings: float

class DriverMetric(DriverMetricBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
