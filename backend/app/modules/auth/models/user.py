from sqlalchemy import Column, String, Boolean, DateTime, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.base import Base
import uuid

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20), unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    
    user_type = Column(String(50), nullable=False) # passenger, driver, admin
    
    email_verified = Column(Boolean, default=False)
    phone_verified = Column(Boolean, default=False)
    email_verified_at = Column(DateTime(timezone=True))
    phone_verified_at = Column(DateTime(timezone=True))
    
    status = Column(String(50), nullable=False, default='active')
    
    mfa_enabled = Column(Boolean, default=False)
    mfa_secret = Column(String(255))
    
    stripe_customer_id = Column(String(255), unique=True, index=True, nullable=True)
    mercadopago_customer_id = Column(String(255), unique=True, index=True, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    last_login_at = Column(DateTime(timezone=True))
    
    __table_args__ = (
        CheckConstraint("user_type IN ('passenger', 'driver', 'admin')", name='valid_user_type'),
        CheckConstraint("status IN ('active', 'suspended', 'banned')", name='valid_user_status'),
    )
