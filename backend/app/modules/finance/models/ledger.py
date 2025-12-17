from sqlalchemy import Column, String, Integer, Numeric, DateTime, ForeignKey, CheckConstraint, Boolean, BigInteger, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.base import Base
import uuid

class LedgerAccount(Base):
    __tablename__ = "ledger_accounts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String(20), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(String(255))
    type = Column(String(50), nullable=False) # ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE
    classification = Column(String(20)) # HEADER, DETAIL
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    entity_id = Column(UUID(as_uuid=True), nullable=True) # Generic entity reference
    entity_type = Column(String(50), nullable=True) # Generic entity type
    
    balance = Column(Numeric(19, 4), default=0.00)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    __table_args__ = (
        CheckConstraint("type IN ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE')", name='valid_account_type'),
    )

class LedgerEntry(Base):
    __tablename__ = "ledger_entries"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    transaction_id = Column(String(100), index=True, nullable=False) # Changed to String for flexibility
    
    account_id = Column(UUID(as_uuid=True), ForeignKey("ledger_accounts.id"), nullable=False)
    
    amount = Column(Numeric(19, 4), nullable=False)
    entry_type = Column(String(10), nullable=False) # DEBIT, CREDIT
    
    description = Column(String(255))
    reference_type = Column(String(50)) # RIDE, PAYOUT, TOPUP
    reference_id = Column(UUID(as_uuid=True))
    
    reversed = Column(Boolean, default=False)
    reversal_entry_id = Column(UUID(as_uuid=True), ForeignKey("ledger_entries.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    posted_at = Column(DateTime(timezone=True), server_default=func.now())
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    account = relationship("LedgerAccount", backref="entries")

    __table_args__ = (
        CheckConstraint("entry_type IN ('DEBIT', 'CREDIT')", name='valid_entry_type'),
    )

class LedgerRunningBalance(Base):
    __tablename__ = "ledger_running_balances"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    account_id = Column(UUID(as_uuid=True), ForeignKey("ledger_accounts.id"), nullable=False)
    driver_id = Column(UUID(as_uuid=True), ForeignKey("drivers.id"), nullable=True)
    
    balance = Column(Numeric(19, 6), nullable=False)
    last_entry_id = Column(UUID(as_uuid=True), ForeignKey("ledger_entries.id"), nullable=False)
    
    calculated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    __table_args__ = (
        Index('idx_running_balance_account', 'account_id'),
        Index('idx_running_balance_driver', 'driver_id', postgresql_where=(driver_id != None)),
    )

class LedgerEntryHistory(Base):
    __tablename__ = "ledger_entries_history"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    entry_id = Column(UUID(as_uuid=True), ForeignKey("ledger_entries.id"), nullable=False)
    
    transaction_id = Column(String(100), nullable=False)
    account_id = Column(UUID(as_uuid=True), nullable=False)
    entry_type = Column(String(10), nullable=False)
    amount = Column(Numeric(19, 6), nullable=False)
    
    change_type = Column(String(10), nullable=False) # INSERT, UPDATE
    changed_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    __table_args__ = (
        Index('idx_ledger_history_entry', 'entry_id'),
    )
