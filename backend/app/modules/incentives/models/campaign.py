from sqlalchemy import Column, String, Boolean, DateTime, Enum, Integer, Numeric, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base
import enum

class CampaignType(str, enum.Enum):
    BONUS_PER_RIDE = "bonus_per_ride" # Receive X extra per ride
    TARGET_RIDE_COUNT = "target_ride_count" # Complete N rides, get X
    COMMISSION_DISCOUNT = "commission_discount" # Pay less commission

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String)
    
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    
    type = Column(Enum(CampaignType), nullable=False)
    
    # JSON rule definition. distinct per type.
    # Ex (Target): {"target_count": 10, "reward_amount": 50.00}
    rules = Column(JSON, nullable=False) 
    
    enabled = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    incentives = relationship("DriverIncentive", back_populates="campaign")

class DriverMetric(Base):
    __tablename__ = "driver_metrics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    driver_id = Column(UUID(as_uuid=True), ForeignKey("drivers.id"), nullable=False)
    
    date = Column(DateTime(timezone=True), nullable=False) # Period (Day or Week start)
    
    rides_accepted = Column(Integer, default=0)
    rides_completed = Column(Integer, default=0)
    rides_cancelled = Column(Integer, default=0)
    total_km = Column(Numeric(10, 2), default=0.0)
    total_earnings = Column(Numeric(10, 2), default=0.0)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

class DriverIncentive(Base):
    """Tracks progress of a driver in a specific campaign"""
    __tablename__ = "driver_incentives"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    campaign_id = Column(UUID(as_uuid=True), ForeignKey("campaigns.id"), nullable=False)
    driver_id = Column(UUID(as_uuid=True), ForeignKey("drivers.id"), nullable=False)
    
    current_value = Column(Integer, default=0) # e.g. ride count
    target_value = Column(Integer, nullable=False)
    
    reward_amount = Column(Numeric(10, 2), nullable=False)
    
    achieved = Column(Boolean, default=False)
    achieved_at = Column(DateTime(timezone=True))
    paid = Column(Boolean, default=False)
    paid_at = Column(DateTime(timezone=True))
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    campaign = relationship("Campaign", back_populates="incentives")
