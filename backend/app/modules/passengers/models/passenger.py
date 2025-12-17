from sqlalchemy import Column, String, Integer, Numeric, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.base import Base
import uuid

class Passenger(Base):
    __tablename__ = "passengers"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    cpf = Column(String(20), unique=True)
    phone = Column(String(20), nullable=False)
    email = Column(String(255), nullable=False)
    
    favorite_addresses = Column(JSONB, default=[])
    default_payment_method = Column(String(50), default='pix')
    
    status = Column(String(50), nullable=False, default='active')
    
    average_rating = Column(Numeric(3, 2), default=5.00)
    total_ratings = Column(Integer, default=0)
    
    total_rides = Column(Integer, default=0)
    total_spent = Column(Numeric(10, 2), default=0.00)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    last_ride_at = Column(DateTime(timezone=True))
    
    # Relationship with User
    user = relationship("User", backref="passenger_profile", uselist=False)

    __table_args__ = (
        CheckConstraint("status IN ('active', 'suspended', 'banned')", name='valid_passenger_status'),
        CheckConstraint("average_rating >= 1.00 AND average_rating <= 5.00", name='valid_passenger_rating'),
    )
