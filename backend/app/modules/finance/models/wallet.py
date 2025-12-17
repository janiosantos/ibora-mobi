from sqlalchemy import Column, Numeric, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.base import Base
from app.core.mixins import TimestampMixin
import uuid

class DriverWallet(Base, TimestampMixin):
    """
    Driver wallet
    
    Tracks different balance types:
    - total_balance: All earnings
    - held_balance: D+N settlement hold
    - blocked_balance: Disputes, chargebacks
    - available_balance: Can withdraw
    - credit_balance: Pre-paid usage credit
    """
    __tablename__ = "driver_wallets"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    driver_id = Column(UUID(as_uuid=True), ForeignKey("drivers.id"), unique=True, nullable=False, index=True)
    
    # Balance fields (in BRL)
    total_balance = Column(Numeric(19, 4), default=0.0000, nullable=False)
    held_balance = Column(Numeric(19, 4), default=0.0000, nullable=False)
    blocked_balance = Column(Numeric(19, 4), default=0.0000, nullable=False)
    available_balance = Column(Numeric(19, 4), default=0.0000, nullable=False)
    credit_balance = Column(Numeric(19, 4), default=0.0000, nullable=False)
    
    # Withdrawal limits
    minimum_withdrawal = Column(Numeric(19, 4), default=50.0000, nullable=False)  # R$ 50.00
    
    # Stats
    total_earned = Column(Numeric(19, 4), default=0.0000, nullable=False)
    total_withdrawn = Column(Numeric(19, 4), default=0.0000, nullable=False)
    
    # Relationships
    driver = relationship("Driver", back_populates="wallet")
    
    # Constraints
    __table_args__ = (
        CheckConstraint('total_balance >= 0', name='check_total_balance_positive'),
        CheckConstraint('held_balance >= 0', name='check_held_balance_positive'),
        CheckConstraint('blocked_balance >= 0', name='check_blocked_balance_positive'),
        # available_balance can technically go negative in edge cases (e.g. chargeback after valid withdrawal) however we try to prevent it.
        # But let's enforce >= 0 for now as per blueprint suggestions.
        CheckConstraint('available_balance >= 0', name='check_available_balance_positive'),
        CheckConstraint('credit_balance >= 0', name='check_credit_balance_positive'),
    )
    
    def __repr__(self):
        return f"<DriverWallet(driver_id={self.driver_id}, available={self.available_balance})>"
