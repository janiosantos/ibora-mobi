from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum, Text, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from app.core.database import Base
import enum

class EventType(str, enum.Enum):
    """All possible financial event types"""
    
    # Ride events
    RIDE_PAYMENT = "ride_payment"                    # Passenger pays for ride
    RIDE_EARNING = "ride_earning"                    # Driver earns from ride
    PLATFORM_COMMISSION = "platform_commission"      # Platform takes commission
    
    # Cancellation
    CANCELLATION_FEE = "cancellation_fee"            # Passenger charged for late cancel
    
    # Wallet operations
    WALLET_DEPOSIT = "wallet_deposit"                # Driver deposits money
    WALLET_WITHDRAWAL = "wallet_withdrawal"          # Driver withdraws money
    
    # Settlement
    SETTLEMENT_HOLD = "settlement_hold"              # Hold for D+N settlement
    SETTLEMENT_RELEASE = "settlement_release"        # Release after D+N
    PAYOUT_PROCESSING = "payout_processing"          # Payout initiated
    PAYOUT_COMPLETED = "payout_completed"            # Payout confirmed
    PAYOUT_FAILED = "payout_failed"                  # Payout failed
    
    # Adjustments
    ADJUSTMENT_DEBIT = "adjustment_debit"            # Manual debit (support)
    ADJUSTMENT_CREDIT = "adjustment_credit"          # Manual credit (refund, bonus)
    
    # Reversals
    REVERSAL = "reversal"                            # Reverse a previous event
    
    # Incentives (Sprint 7+)
    INCENTIVE_BONUS = "incentive_bonus"              # Performance bonus
    INCENTIVE_CREDIT = "incentive_credit"            # Free usage credit

class EventStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REVERSED = "reversed"

class FinancialEvent(Base):
    """
    Immutable financial event log
    
    Design principles:
    - Append-only (no updates or deletes)
    - Every financial transaction creates an event
    - Reversals create new events (don't delete original)
    - Balance = SUM(amount) WHERE status = COMPLETED
    """
    
    __tablename__ = "financial_events"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Event identification
    event_type = Column(SQLEnum(EventType), nullable=False, index=True)
    status = Column(SQLEnum(EventStatus), default=EventStatus.PENDING, nullable=False, index=True)
    
    # Participants (at least one must be set)
    passenger_id = Column(UUID(as_uuid=True), ForeignKey("passengers.id"), nullable=True, index=True)
    driver_id = Column(UUID(as_uuid=True), ForeignKey("drivers.id"), nullable=True, index=True)
    
    # Related entities
    ride_id = Column(UUID(as_uuid=True), ForeignKey("rides.id"), nullable=True, index=True)
    
    # Financial details
    amount = Column(Float, nullable=False)  # Positive = credit, Negative = debit
    currency = Column(String(3), default="BRL", nullable=False)
    
    # Metadata
    description = Column(Text, nullable=True)
    metadata_info = Column("metadata", JSONB, nullable=True)  # Extra data (payment_id, pix_key, etc). specific name "metadata" in sql, mapped to metadata_info
    
    # Reversal tracking
    reverses_event_id = Column(Integer, ForeignKey("financial_events.id"), nullable=True)
    reversed_by_event_id = Column(Integer, ForeignKey("financial_events.id"), nullable=True)
    
    # External references
    external_transaction_id = Column(String(255), nullable=True, index=True)  # PSP transaction ID
    
    # Timestamps
    completed_at = Column(DateTime(timezone=True), nullable=True)
    failed_at = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    passenger = relationship("app.modules.passengers.models.passenger.Passenger", foreign_keys=[passenger_id])
    driver = relationship("app.modules.drivers.models.driver.Driver", foreign_keys=[driver_id])
    ride = relationship("app.modules.rides.models.ride.Ride", foreign_keys=[ride_id])
    
    reverses = relationship("FinancialEvent", remote_side=[id], foreign_keys=[reverses_event_id])
    reversed_by = relationship("FinancialEvent", remote_side=[id], foreign_keys=[reversed_by_event_id])
    
    # Indexes for performance
    __table_args__ = (
        Index('idx_events_driver_completed', 'driver_id', 'status', 'created_at'),
        Index('idx_events_passenger_completed', 'passenger_id', 'status', 'created_at'),
        Index('idx_events_type_status', 'event_type', 'status'),
    )
    
    def __repr__(self):
        return f"<FinancialEvent(id={self.id}, type={self.event_type}, amount={self.amount}, status={self.status})>"
