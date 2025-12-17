from sqlalchemy import Column, String, Integer, Numeric, Date, Boolean, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.base import Base
import uuid

class CommissionConfig(Base):
    __tablename__ = "commission_configs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    vehicle_category = Column(String(50), nullable=True, index=True) # NULL = All
    effective_from = Column(Date, nullable=False)
    effective_until = Column(Date, nullable=True)
    
    commission_type = Column(String(20), nullable=False) # percentage, fixed
    commission_value = Column(Numeric(10, 6), nullable=False)
    
    active = Column(Boolean, default=True)
    
    created_at = Column(Date, server_default=func.now(), nullable=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    __table_args__ = (
        CheckConstraint("commission_type IN ('percentage', 'fixed')", name='valid_commission_type'),
    )
