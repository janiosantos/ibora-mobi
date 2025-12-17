from sqlalchemy import Column, String, Integer, Date, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.base import Base
import uuid

class Vehicle(Base):
    __tablename__ = "vehicles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    driver_id = Column(UUID(as_uuid=True), ForeignKey("drivers.id"), nullable=False)
    
    license_plate = Column(String(10), unique=True, nullable=False)
    renavam = Column(String(20))
    
    brand = Column(String(100), nullable=False)
    model = Column(String(100), nullable=False)
    year = Column(Integer, nullable=False)
    color = Column(String(50), nullable=False)
    
    category = Column(String(50), nullable=False, default='standard') # standard, comfort, premium, xl
    seats = Column(Integer, nullable=False, default=4)
    
    crlv_number = Column(String(50))
    crlv_expiry_date = Column(Date)
    
    status = Column(String(50), nullable=False, default='pending_approval')
    approval_status = Column(String(50), default='pending')
    approved_at = Column(DateTime(timezone=True))
    approved_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationship
    driver = relationship("Driver", back_populates="vehicles")

    __table_args__ = (
        CheckConstraint("status IN ('pending_approval', 'active', 'inactive', 'suspended')", name='valid_vehicle_status'),
        CheckConstraint("category IN ('standard', 'comfort', 'premium', 'xl')", name='valid_vehicle_category'),
    )
