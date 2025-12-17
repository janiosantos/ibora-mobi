from sqlalchemy import Column, String, Integer, Numeric, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.core.base import Base
import uuid

class Payout(Base):
    __tablename__ = "payouts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    driver_id = Column(UUID(as_uuid=True), ForeignKey("drivers.id"), nullable=False, index=True)
    
    amount = Column(Numeric(19, 2), nullable=False)
    currency = Column(String(3), default="BRL")
    
    status = Column(String(20), default="PENDING", index=True) # PENDING, PROCESSING, COMPLETED, FAILED
    payout_method = Column(String(20), default="pix")
    
    bank_details = Column(JSONB, nullable=False) # pix_key, etc
    provider = Column(String(50), default="efi")
    
    provider_transaction_id = Column(String(100), nullable=True)
    provider_response = Column(JSONB, nullable=True)
    failure_reason = Column(String(255), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    processing_started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    failed_at = Column(DateTime(timezone=True), nullable=True)
    
    __table_args__ = (
        CheckConstraint("status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')", name='valid_payout_status'),
    )
