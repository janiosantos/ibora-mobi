from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.modules.auth.models.user import User
from app.core.database import Base
from datetime import datetime

class PaymentMethod(Base):
    """
    Payment method (credit/debit card)
    
    Stores tokenized card information (NOT raw card data)
    """
    __tablename__ = "payment_methods"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    
    # Stripe references
    stripe_customer_id = Column(String(255), nullable=True, index=True)
    stripe_payment_method_id = Column(String(255), nullable=True, unique=True, index=True) # made nullable for MP

    # Mercado Pago references
    mercadopago_card_id = Column(String(255), nullable=True, index=True)
    
    # Provider (stripe, mercadopago)
    provider = Column(String(50), default='stripe', nullable=False)
    
    # Card details (for display only, not sensitive)
    card_brand = Column(String(50), nullable=False)  # visa, mastercard, etc
    card_last4 = Column(String(4), nullable=False)
    card_exp_month = Column(Integer, nullable=False)
    card_exp_year = Column(Integer, nullable=False)
    card_funding = Column(String(20), nullable=True)  # credit, debit, prepaid
    
    # Status
    is_default = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Verification
    verified_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", backref="payment_methods")
    
    def __repr__(self):
        return f"<PaymentMethod(id={self.id}, user_id={self.user_id}, brand={self.card_brand}, last4={self.card_last4})>"
    
    @property
    def is_expired(self) -> bool:
        """Check if card is expired"""
        now = datetime.utcnow()
        if now.year > self.card_exp_year:
            return True
        if now.year == self.card_exp_year and now.month > self.card_exp_month:
            return True
        return False
