from sqlalchemy import Column, String, Integer, Numeric, Date, Boolean, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.base import Base
import uuid

class Driver(Base):
    __tablename__ = "drivers"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    cpf = Column(String(11), unique=True, nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(255), nullable=False)
    
    # Documentação
    cnh_number = Column(String(20), unique=True, nullable=False)
    cnh_category = Column(String(5), nullable=False) # B, C, D, E
    cnh_expiry_date = Column(Date, nullable=False)
    
    # Conta bancária
    bank_code = Column(String(3))
    bank_branch = Column(String(10))
    bank_account = Column(String(20))
    bank_account_type = Column(String(20)) # checking, savings
    pix_key = Column(String(255))
    pix_key_type = Column(String(20)) # cpf, email, phone, random
    
    # Status
    status = Column(String(50), nullable=False, default='pending_approval')
    approval_status = Column(String(50), default='pending')
    approved_at = Column(DateTime(timezone=True))
    approved_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    
    # Localização
    current_lat = Column(Numeric(10, 8))
    current_lon = Column(Numeric(11, 8))
    current_heading = Column(Numeric(5, 2))
    last_location_update = Column(DateTime(timezone=True))
    
    # Avaliação e Stats
    average_rating = Column(Numeric(3, 2), default=5.00)
    total_ratings = Column(Integer, default=0)
    total_rides = Column(Integer, default=0)
    total_distance_km = Column(Numeric(10, 2), default=0.00)
    total_earnings = Column(Numeric(10, 2), default=0.00)
    
    # Disponibilidade
    online = Column(Boolean, default=False)
    accepting_rides = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    last_ride_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id], backref="driver_profile")
    vehicles = relationship("Vehicle", back_populates="driver", cascade="all, delete-orphan")

    __table_args__ = (
        CheckConstraint("status IN ('pending_approval', 'active', 'available', 'on_trip', 'offline', 'suspended', 'banned')", name='valid_driver_status'),
        CheckConstraint("approval_status IN ('pending', 'approved', 'rejected')", name='valid_driver_approval_status'),
        CheckConstraint("average_rating >= 1.00 AND average_rating <= 5.00", name='valid_driver_rating'),
        # cnh_not_expired check is hard in SQL creation usually left for triggers or app validation logic, omitting for simplicity in model definition but keeping in mind.
    )
