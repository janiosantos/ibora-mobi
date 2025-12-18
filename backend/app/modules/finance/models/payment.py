from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum, Text, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
import enum
import uuid

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    EXPIRED = "expired"

class Payment(Base):
    """
    Payment record
    
    Tracks payment attempts and status (specifically for Pix)
    """
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    
    ride_id = Column(UUID(as_uuid=True), ForeignKey("rides.id"), nullable=False, unique=True, index=True)
    passenger_id = Column(UUID(as_uuid=True), ForeignKey("passengers.id"), nullable=False, index=True)
    
    # Payment details
    amount = Column(Float, nullable=False)
    payment_method = Column(String(50), nullable=False)  # "pix", "cash", "credit_card"
    status = Column(SQLEnum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False, index=True)
    
    # Pix specific
    pix_txid = Column(String(255), nullable=True, index=True)
    pix_qrcode_image = Column(Text, nullable=True)  # Base64
    pix_qrcode_text = Column(Text, nullable=True)   # Copy & paste
    pix_expiration = Column(DateTime(timezone=True), nullable=True)
    
    # External reference
    external_transaction_id = Column(String(255), nullable=True, index=True)
    
    # Card Payment
    payment_method_id = Column(Integer, ForeignKey("payment_methods.id"), nullable=True)
    stripe_payment_intent_id = Column(String(255), nullable=True, index=True)
    
    # Related events (Mapping for later reconciliation)
    payment_event_id = Column(Integer, ForeignKey("financial_events.id"), nullable=True)
    earning_event_id = Column(Integer, ForeignKey("financial_events.id"), nullable=True)
    commission_event_id = Column(Integer, ForeignKey("financial_events.id"), nullable=True)
    
    # Timestamps
    paid_at = Column(DateTime(timezone=True), nullable=True)
    failed_at = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    ride = relationship("app.modules.rides.models.ride.Ride", backref="payment_record")
    passenger = relationship("app.modules.passengers.models.passenger.Passenger")
    
    payment_event = relationship("app.modules.finance.models.financial_event.FinancialEvent", foreign_keys=[payment_event_id])
    
    # Card Relationship
    card_payment_method = relationship("app.modules.finance.models.payment_method.PaymentMethod", foreign_keys=[payment_method_id])
