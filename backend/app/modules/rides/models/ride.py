from sqlalchemy import Column, String, Integer, Numeric, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.base import Base
import uuid

class Ride(Base):
    __tablename__ = "rides"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    passenger_id = Column(UUID(as_uuid=True), ForeignKey("passengers.id"), nullable=False)
    driver_id = Column(UUID(as_uuid=True), ForeignKey("drivers.id"), nullable=True) # Inicialmente nulo
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=True)
    
    # Locations
    origin_lat = Column(Numeric(10, 8), nullable=False)
    origin_lon = Column(Numeric(11, 8), nullable=False)
    origin_address = Column(String(255), nullable=False)
    
    destination_lat = Column(Numeric(10, 8), nullable=False)
    destination_lon = Column(Numeric(11, 8), nullable=False)
    destination_address = Column(String(255), nullable=False)
    
    # Route Geometry
    route_polyline = Column(String, nullable=True) # Encoded polyline from Google Maps
    
    # Estatísticas/Estimativas
    distance_km = Column(Numeric(10, 2))
    duration_min = Column(Integer)
    estimated_price = Column(Numeric(10, 2), nullable=False)
    final_price = Column(Numeric(10, 2))
    
    # State Machine
    status = Column(String(50), nullable=False, default='REQUESTED')
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    accepted_at = Column(DateTime(timezone=True))
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    cancelled_at = Column(DateTime(timezone=True))
    
    # Payment
    payment_method = Column(String(50), default='pix')
    payment_status = Column(String(50), default='pending') # pending, authorized, captured, refunded
    
    # Relationships
    passenger = relationship("Passenger", backref="rides")
    driver = relationship("Driver", backref="rides")
    
    __table_args__ = (
        CheckConstraint("status IN ('REQUESTED', 'SEARCHING', 'OFFERED', 'ACCEPTED', 'DRIVER_ARRIVING', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')", name='valid_ride_status'),
    )
