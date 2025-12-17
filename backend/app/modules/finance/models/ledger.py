from sqlalchemy import Column, String, Integer, Numeric, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.base import Base
import uuid

class LedgerAccount(Base):
    __tablename__ = "ledger_accounts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True) # Pode ser null para contas sistêmicas (Receita Plataforma)
    
    name = Column(String(255), nullable=False) # Ex: Carteira Motorista, Carteira Passageiro
    type = Column(String(50), nullable=False) # ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE
    
    balance = Column(Numeric(15, 2), default=0.00) # Saldo atual desnormalizado para leitura rápida
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    __table_args__ = (
        CheckConstraint("type IN ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE')", name='valid_account_type'),
    )

class LedgerEntry(Base):
    __tablename__ = "ledger_entries"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    transaction_id = Column(UUID(as_uuid=True), index=True, nullable=False) # ID de agupamento (A transação lógica)
    
    account_id = Column(UUID(as_uuid=True), ForeignKey("ledger_accounts.id"), nullable=False)
    
    amount = Column(Numeric(15, 2), nullable=False) # Pode ser positivo (Debit?) ou negativo (Credit?) - ou usar coluna type
    direction = Column(String(10), nullable=False) # DEBIT, CREDIT
    
    description = Column(String(255))
    reference_type = Column(String(50)) # RIDE, WITHDRAWAL, TOPUP
    reference_id = Column(UUID(as_uuid=True)) # ID da corrida, etc
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    account = relationship("LedgerAccount", backref="entries")

    __table_args__ = (
        CheckConstraint("direction IN ('DEBIT', 'CREDIT')", name='valid_entry_direction'),
    )
