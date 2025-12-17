from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.core.base import Base
from app.core.mixins import TimestampMixin
import enum

class SettlementStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    FAILED = "failed"

class Settlement(Base, TimestampMixin):
    __tablename__ = "settlements"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True) # UUID primary key? Or Integer? 
    # Let's use UUID to match other finance models if possible, or Integer if standard. 
    # Wallet uses UUID (driver_id). FinancialEvent uses Integer. 
    # Let's use Integer for ID to match FinancialEvent or UUID. 
    # Project seems mixed. Let's stick to UUID for new primary entities.
    # Actually, FinancialEvent is Integer. Let's check DriverWallet. DriverWallet is UUID (pk) or Driver ID?
    # DriverWallet(Base, TimestampMixin): id = Column(UUID ...).
    # So using UUID is fine.
    
    # Wait, I need to check if UUID is imported.
    # Also, need to link to FinancialEvent (earning).
    
    financial_event_id = Column(Integer, ForeignKey("financial_events.id"), nullable=False, unique=True)
    driver_id = Column(UUID(as_uuid=True), ForeignKey("drivers.id"), nullable=False, index=True)
    
    amount = Column(Float, nullable=False) # Amount to be settled
    
    scheduled_for = Column(DateTime(timezone=True), nullable=False, index=True) # D+N date
    processed_at = Column(DateTime(timezone=True), nullable=True)
    
    status = Column(SQLEnum(SettlementStatus), default=SettlementStatus.PENDING, nullable=False, index=True)
    
    # Relationships
    financial_event = relationship("app.modules.finance.models.financial_event.FinancialEvent")
    driver = relationship("app.modules.drivers.models.driver.Driver")

    def __repr__(self):
        return f"<Settlement(id={self.id}, amount={self.amount}, status={self.status}, scheduled_for={self.scheduled_for})>"
