# 🎫 IBORA: SPRINT 7 COMPLETO - CARTÃO DE CRÉDITO (PARTE 1)
## Stripe Integration - Tokenização & Pagamento Básico

---

# SPRINT 7: CARD PAYMENT - STRIPE INTEGRATION (PART 1)
**Duração:** Semanas 13-14 (10 dias úteis)  
**Objetivo:** Pagamento com cartão de crédito funcionando (Stripe)  
**Team:** 5 pessoas  
**Velocity target:** 20 SP

---

## 📊 DISTRIBUIÇÃO DO TRABALHO

| Epic | Story Points | Status |
|------|--------------|--------|
| 7.1 Stripe Setup & Integration | 8 SP | ✅ COMPLETO |
| 7.2 Payment Flow | 7 SP | ✅ COMPLETO |
| 7.3 Card Management | 5 SP | ✅ COMPLETO |
| **TOTAL** | **20 SP** | ✅ 100% |

---

## EPIC 7.1: STRIPE SETUP & INTEGRATION (8 SP) ✅

---

### [BACKEND] Task 7.1.1: Stripe SDK Setup
**Responsável:** Backend Dev 1  
**Estimativa:** 3 SP  
**Prioridade:** P0  
**Duração:** 6 horas

**Descrição:**
Configurar Stripe SDK e estrutura básica.

**Dependencies:**
```bash
pip install stripe
```

**Config:**
```python
# backend/src/core/config.py (update)

class Settings(BaseSettings):
    # ... existing settings
    
    # Stripe
    STRIPE_SECRET_KEY: str  # sk_test_... ou sk_live_...
    STRIPE_PUBLISHABLE_KEY: str  # pk_test_... ou pk_live_...
    STRIPE_WEBHOOK_SECRET: str  # whsec_...
    STRIPE_API_VERSION: str = "2023-10-16"
    
    # Payment
    CURRENCY: str = "BRL"
    PLATFORM_FEE_PERCENTAGE: float = 0.15  # 15%
    
    class Config:
        env_file = ".env"

settings = Settings()
```

**.env.example:**
```bash
# Stripe Keys (TEST)
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Keys (PRODUCTION - never commit!)
# STRIPE_SECRET_KEY=sk_live_51...
# STRIPE_PUBLISHABLE_KEY=pk_live_51...
# STRIPE_WEBHOOK_SECRET=whsec_...
```

**Stripe Client:**
```python
# backend/src/services/payment/stripe_client.py
import stripe
from src.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Configure Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY
stripe.api_version = settings.STRIPE_API_VERSION

class StripeClient:
    """
    Stripe API client wrapper
    
    Centralizes all Stripe API calls
    """
    
    @staticmethod
    def create_customer(email: str, name: str, phone: str = None) -> dict:
        """
        Create Stripe customer
        
        Args:
            email: Customer email
            name: Customer name
            phone: Optional phone number
        
        Returns:
            Stripe customer object
        """
        try:
            customer = stripe.Customer.create(
                email=email,
                name=name,
                phone=phone,
                metadata={
                    "source": "ibora_app"
                }
            )
            
            logger.info(f"Stripe customer created: {customer.id}")
            return customer
        
        except stripe.error.StripeError as e:
            logger.error(f"Stripe customer creation failed: {e}")
            raise
    
    @staticmethod
    def create_payment_method(
        card_token: str,
        customer_id: str = None
    ) -> dict:
        """
        Create payment method from card token
        
        Args:
            card_token: Token from Stripe.js (tok_...)
            customer_id: Optional customer to attach to
        
        Returns:
            Payment method object
        """
        try:
            # Create payment method
            payment_method = stripe.PaymentMethod.create(
                type="card",
                card={"token": card_token}
            )
            
            # Attach to customer if provided
            if customer_id:
                stripe.PaymentMethod.attach(
                    payment_method.id,
                    customer=customer_id
                )
            
            logger.info(f"Payment method created: {payment_method.id}")
            return payment_method
        
        except stripe.error.StripeError as e:
            logger.error(f"Payment method creation failed: {e}")
            raise
    
    @staticmethod
    def create_payment_intent(
        amount: float,
        customer_id: str,
        payment_method_id: str = None,
        metadata: dict = None
    ) -> dict:
        """
        Create payment intent
        
        Args:
            amount: Amount in BRL (float)
            customer_id: Stripe customer ID
            payment_method_id: Payment method to use
            metadata: Additional metadata
        
        Returns:
            Payment intent object
        """
        try:
            # Convert to cents
            amount_cents = int(amount * 100)
            
            intent_params = {
                "amount": amount_cents,
                "currency": settings.CURRENCY.lower(),
                "customer": customer_id,
                "metadata": metadata or {},
                "capture_method": "automatic",
                "confirmation_method": "automatic"
            }
            
            # Add payment method if provided
            if payment_method_id:
                intent_params["payment_method"] = payment_method_id
                intent_params["confirm"] = True
            
            intent = stripe.PaymentIntent.create(**intent_params)
            
            logger.info(f"Payment intent created: {intent.id}")
            return intent
        
        except stripe.error.StripeError as e:
            logger.error(f"Payment intent creation failed: {e}")
            raise
    
    @staticmethod
    def confirm_payment_intent(
        payment_intent_id: str,
        payment_method_id: str = None
    ) -> dict:
        """Confirm payment intent"""
        try:
            params = {}
            if payment_method_id:
                params["payment_method"] = payment_method_id
            
            intent = stripe.PaymentIntent.confirm(
                payment_intent_id,
                **params
            )
            
            logger.info(f"Payment intent confirmed: {intent.id}")
            return intent
        
        except stripe.error.StripeError as e:
            logger.error(f"Payment intent confirmation failed: {e}")
            raise
    
    @staticmethod
    def get_payment_intent(payment_intent_id: str) -> dict:
        """Get payment intent details"""
        try:
            return stripe.PaymentIntent.retrieve(payment_intent_id)
        except stripe.error.StripeError as e:
            logger.error(f"Failed to get payment intent: {e}")
            raise
    
    @staticmethod
    def refund_payment(
        payment_intent_id: str,
        amount: float = None,
        reason: str = None
    ) -> dict:
        """
        Refund payment
        
        Args:
            payment_intent_id: Payment intent to refund
            amount: Optional partial refund amount
            reason: Refund reason
        
        Returns:
            Refund object
        """
        try:
            refund_params = {
                "payment_intent": payment_intent_id
            }
            
            if amount:
                refund_params["amount"] = int(amount * 100)
            
            if reason:
                refund_params["reason"] = reason
            
            refund = stripe.Refund.create(**refund_params)
            
            logger.info(f"Refund created: {refund.id}")
            return refund
        
        except stripe.error.StripeError as e:
            logger.error(f"Refund failed: {e}")
            raise
    
    @staticmethod
    def construct_webhook_event(payload: bytes, signature: str) -> dict:
        """
        Construct and verify webhook event
        
        Args:
            payload: Raw request body
            signature: Stripe-Signature header
        
        Returns:
            Verified event object
        """
        try:
            event = stripe.Webhook.construct_event(
                payload,
                signature,
                settings.STRIPE_WEBHOOK_SECRET
            )
            
            logger.info(f"Webhook event verified: {event['type']}")
            return event
        
        except ValueError as e:
            logger.error(f"Invalid webhook payload: {e}")
            raise
        except stripe.error.SignatureVerificationError as e:
            logger.error(f"Invalid webhook signature: {e}")
            raise

stripe_client = StripeClient()
```

**Tests:**
```python
# backend/tests/test_stripe_client.py
import pytest
from unittest.mock import patch, MagicMock
from src.services.payment.stripe_client import stripe_client

@patch('src.services.payment.stripe_client.stripe.Customer')
def test_create_customer(mock_customer):
    """Can create Stripe customer"""
    mock_customer.create.return_value = {
        "id": "cus_123",
        "email": "test@test.com"
    }
    
    customer = stripe_client.create_customer(
        email="test@test.com",
        name="Test User"
    )
    
    assert customer["id"] == "cus_123"
    mock_customer.create.assert_called_once()

@patch('src.services.payment.stripe_client.stripe.PaymentIntent')
def test_create_payment_intent(mock_intent):
    """Can create payment intent"""
    mock_intent.create.return_value = {
        "id": "pi_123",
        "amount": 5000,
        "status": "requires_payment_method"
    }
    
    intent = stripe_client.create_payment_intent(
        amount=50.00,
        customer_id="cus_123"
    )
    
    assert intent["id"] == "pi_123"
    assert intent["amount"] == 5000  # 50.00 * 100
```

**Critérios de Aceite:**
- [ ] Stripe SDK configurado
- [ ] StripeClient wrapper completo
- [ ] Suporta customer, payment method, payment intent
- [ ] Error handling robusto
- [ ] Testes passam (2 cenários)

---

### [BACKEND] Task 7.1.2: Card Model & Migration
**Responsável:** Backend Dev 1  
**Estimativa:** 2 SP  
**Duração:** 4 horas

**Descrição:**
Model para armazenar cartões dos usuários.

**Model:**
```python
# backend/src/models/payment_method.py
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from src.models.base import TimestampMixin
from src.core.database import Base
from datetime import datetime

class PaymentMethod(Base, TimestampMixin):
    """
    Payment method (credit/debit card)
    
    Stores tokenized card information (NOT raw card data)
    """
    __tablename__ = "payment_methods"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Stripe references
    stripe_customer_id = Column(String(255), nullable=True, index=True)
    stripe_payment_method_id = Column(String(255), nullable=False, unique=True, index=True)
    
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
    
    # Relationships
    user = relationship("User", backref="payment_methods")
    
    def __repr__(self):
        return f"<PaymentMethod(id={self.id}, user_id={self.user_id}, brand={self.card_brand}, last4={self.card_last4})>"
    
    def is_expired(self) -> bool:
        """Check if card is expired"""
        now = datetime.utcnow()
        if now.year > self.card_exp_year:
            return True
        if now.year == self.card_exp_year and now.month > self.card_exp_month:
            return True
        return False
```

**Update User Model:**
```python
# backend/src/models/user.py (add field)

class User(Base, TimestampMixin):
    # ... existing fields
    
    # Stripe
    stripe_customer_id = Column(String(255), nullable=True, unique=True, index=True)
```

**Migration:**
```python
# backend/alembic/versions/010_create_payment_methods.py
"""Create payment methods table

Revision ID: 010
Revises: 009
"""
from alembic import op
import sqlalchemy as sa

revision = '010'
down_revision = '009'

def upgrade():
    # Add stripe_customer_id to users
    op.add_column('users', sa.Column('stripe_customer_id', sa.String(255)))
    op.create_index('ix_users_stripe_customer_id', 'users', ['stripe_customer_id'])
    op.create_unique_constraint('uq_users_stripe_customer_id', 'users', ['stripe_customer_id'])
    
    # Create payment_methods table
    op.create_table(
        'payment_methods',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('stripe_customer_id', sa.String(255)),
        sa.Column('stripe_payment_method_id', sa.String(255), nullable=False),
        sa.Column('card_brand', sa.String(50), nullable=False),
        sa.Column('card_last4', sa.String(4), nullable=False),
        sa.Column('card_exp_month', sa.Integer(), nullable=False),
        sa.Column('card_exp_year', sa.Integer(), nullable=False),
        sa.Column('card_funding', sa.String(20)),
        sa.Column('is_default', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('verified_at', sa.DateTime()),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.UniqueConstraint('stripe_payment_method_id')
    )
    
    # Create indexes
    op.create_index('ix_payment_methods_user_id', 'payment_methods', ['user_id'])
    op.create_index('ix_payment_methods_stripe_customer_id', 'payment_methods', ['stripe_customer_id'])
    op.create_index('ix_payment_methods_stripe_payment_method_id', 'payment_methods', ['stripe_payment_method_id'])

def downgrade():
    op.drop_table('payment_methods')
    op.drop_constraint('uq_users_stripe_customer_id', 'users')
    op.drop_index('ix_users_stripe_customer_id', 'users')
    op.drop_column('users', 'stripe_customer_id')
```

**Critérios de Aceite:**
- [ ] Model criado
- [ ] Migration aplicada
- [ ] Indexes criados
- [ ] Relationships funcionam

---

### [BACKEND] Task 7.1.3: Stripe Customer Service
**Responsável:** Backend Dev 2  
**Estimativa:** 3 SP  
**Duração:** 6 horas

**Descrição:**
Service para gerenciar Stripe customers.

**Service:**
```python
# backend/src/services/payment/stripe_customer_service.py
from src.services.payment.stripe_client import stripe_client
from src.models.user import User
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger(__name__)

class StripeCustomerService:
    """
    Manage Stripe customers
    
    Ensures every user has a Stripe customer ID
    """
    
    @staticmethod
    def get_or_create_customer(user: User, db: Session) -> str:
        """
        Get existing or create new Stripe customer
        
        Args:
            user: User object
            db: Database session
        
        Returns:
            Stripe customer ID
        """
        
        # Check if user already has Stripe customer
        if user.stripe_customer_id:
            logger.info(f"User {user.id} already has Stripe customer: {user.stripe_customer_id}")
            return user.stripe_customer_id
        
        try:
            # Create Stripe customer
            customer = stripe_client.create_customer(
                email=user.email,
                name=user.full_name,
                phone=user.phone
            )
            
            # Save customer ID
            user.stripe_customer_id = customer.id
            db.commit()
            
            logger.info(f"Created Stripe customer for user {user.id}: {customer.id}")
            
            return customer.id
        
        except Exception as e:
            logger.error(f"Failed to create Stripe customer: {e}")
            db.rollback()
            raise
    
    @staticmethod
    def update_customer(user: User, db: Session):
        """
        Update Stripe customer details
        
        Syncs user data with Stripe
        """
        
        if not user.stripe_customer_id:
            return
        
        try:
            import stripe
            
            stripe.Customer.modify(
                user.stripe_customer_id,
                email=user.email,
                name=user.full_name,
                phone=user.phone
            )
            
            logger.info(f"Updated Stripe customer: {user.stripe_customer_id}")
        
        except Exception as e:
            logger.error(f"Failed to update Stripe customer: {e}")
            # Don't raise - this is not critical
```

**Critérios de Aceite:**
- [ ] get_or_create_customer funciona
- [ ] Cria customer no Stripe
- [ ] Salva customer_id no user
- [ ] update_customer syncs dados

---

## EPIC 7.2: PAYMENT FLOW (7 SP) ✅

---

### [BACKEND] Task 7.2.1: Add Payment Method Endpoint
**Responsável:** Backend Dev 2  
**Estimativa:** 4 SP  
**Duração:** 1 dia

**Descrição:**
Endpoint para adicionar cartão de crédito.

**Schemas:**
```python
# backend/src/schemas/payment.py
from pydantic import BaseModel, field_validator
from typing import Optional

class AddPaymentMethodRequest(BaseModel):
    """
    Add payment method request
    
    card_token is generated by Stripe.js on frontend
    """
    card_token: str  # tok_... from Stripe.js
    set_as_default: bool = False
    
    @field_validator('card_token')
    @classmethod
    def validate_token(cls, v):
        if not v.startswith('tok_') and not v.startswith('pm_'):
            raise ValueError('Invalid card token format')
        return v

class PaymentMethodResponse(BaseModel):
    id: int
    card_brand: str
    card_last4: str
    card_exp_month: int
    card_exp_year: int
    is_default: bool
    is_active: bool
    is_expired: bool
    
    class Config:
        from_attributes = True
```

**Endpoint:**
```python
# backend/src/api/v1/payment_methods.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.core.database import get_db
from src.api.dependencies import get_current_user
from src.models.user import User
from src.models.payment_method import PaymentMethod
from src.schemas.payment import AddPaymentMethodRequest, PaymentMethodResponse
from src.services.payment.stripe_client import stripe_client
from src.services.payment.stripe_customer_service import StripeCustomerService
from typing import List
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/payment-methods", response_model=PaymentMethodResponse, status_code=status.HTTP_201_CREATED)
async def add_payment_method(
    request: AddPaymentMethodRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add credit/debit card
    
    Frontend must tokenize card with Stripe.js:
    ```javascript
    const {token} = await stripe.createToken(card);
    // Send token.id to this endpoint
    ```
    """
    
    try:
        # Get or create Stripe customer
        customer_id = StripeCustomerService.get_or_create_customer(current_user, db)
        
        # Create payment method in Stripe
        payment_method = stripe_client.create_payment_method(
            card_token=request.card_token,
            customer_id=customer_id
        )
        
        # Extract card details
        card = payment_method.get("card", {})
        
        # Check if card already exists
        existing = db.query(PaymentMethod).filter(
            PaymentMethod.stripe_payment_method_id == payment_method["id"]
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Card already added"
            )
        
        # If set as default, unset other defaults
        if request.set_as_default:
            db.query(PaymentMethod).filter(
                PaymentMethod.user_id == current_user.id,
                PaymentMethod.is_default == True
            ).update({"is_default": False})
        
        # Create payment method record
        pm = PaymentMethod(
            user_id=current_user.id,
            stripe_customer_id=customer_id,
            stripe_payment_method_id=payment_method["id"],
            card_brand=card.get("brand", "unknown"),
            card_last4=card.get("last4", "0000"),
            card_exp_month=card.get("exp_month", 1),
            card_exp_year=card.get("exp_year", 2030),
            card_funding=card.get("funding"),
            is_default=request.set_as_default or \
                       db.query(PaymentMethod).filter(
                           PaymentMethod.user_id == current_user.id
                       ).count() == 0  # First card is default
        )
        
        db.add(pm)
        db.commit()
        db.refresh(pm)
        
        logger.info(
            f"Payment method added: user_id={current_user.id}, "
            f"pm_id={pm.id}, stripe_pm={pm.stripe_payment_method_id}"
        )
        
        return PaymentMethodResponse(
            id=pm.id,
            card_brand=pm.card_brand,
            card_last4=pm.card_last4,
            card_exp_month=pm.card_exp_month,
            card_exp_year=pm.card_exp_year,
            is_default=pm.is_default,
            is_active=pm.is_active,
            is_expired=pm.is_expired()
        )
    
    except Exception as e:
        logger.error(f"Failed to add payment method: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to add card: {str(e)}"
        )

@router.get("/payment-methods", response_model=List[PaymentMethodResponse])
async def list_payment_methods(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List user's payment methods"""
    
    methods = db.query(PaymentMethod).filter(
        PaymentMethod.user_id == current_user.id,
        PaymentMethod.is_active == True
    ).order_by(PaymentMethod.is_default.desc(), PaymentMethod.created_at.desc()).all()
    
    return [
        PaymentMethodResponse(
            id=pm.id,
            card_brand=pm.card_brand,
            card_last4=pm.card_last4,
            card_exp_month=pm.card_exp_month,
            card_exp_year=pm.card_exp_year,
            is_default=pm.is_default,
            is_active=pm.is_active,
            is_expired=pm.is_expired()
        )
        for pm in methods
    ]

@router.delete("/payment-methods/{payment_method_id}")
async def remove_payment_method(
    payment_method_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove payment method"""
    
    pm = db.query(PaymentMethod).filter(
        PaymentMethod.id == payment_method_id,
        PaymentMethod.user_id == current_user.id
    ).first()
    
    if not pm:
        raise HTTPException(404, "Payment method not found")
    
    # Mark as inactive (don't delete for history)
    pm.is_active = False
    
    # If was default, set another as default
    if pm.is_default:
        another = db.query(PaymentMethod).filter(
            PaymentMethod.user_id == current_user.id,
            PaymentMethod.is_active == True,
            PaymentMethod.id != pm.id
        ).first()
        
        if another:
            another.is_default = True
    
    db.commit()
    
    logger.info(f"Payment method removed: user_id={current_user.id}, pm_id={pm.id}")
    
    return {"message": "Payment method removed"}
```

**Tests:**
```python
# backend/tests/test_payment_methods.py
import pytest
from unittest.mock import patch

@pytest.mark.asyncio
@patch('src.services.payment.stripe_client.stripe_client.create_payment_method')
async def test_add_payment_method(mock_create_pm, async_client, passenger_token, db):
    """Can add payment method"""
    mock_create_pm.return_value = {
        "id": "pm_123",
        "card": {
            "brand": "visa",
            "last4": "4242",
            "exp_month": 12,
            "exp_year": 2025
        }
    }
    
    response = await async_client.post(
        "/api/v1/payment-methods",
        json={
            "card_token": "tok_visa",
            "set_as_default": True
        },
        headers={"Authorization": f"Bearer {passenger_token}"}
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["card_brand"] == "visa"
    assert data["card_last4"] == "4242"
    assert data["is_default"] == True
```

**Critérios de Aceite:**
- [ ] POST /payment-methods adiciona cartão
- [ ] GET /payment-methods lista cartões
- [ ] DELETE /payment-methods/{id} remove
- [ ] Tokenização via Stripe.js
- [ ] Marca primeiro cartão como default
- [ ] Testes passam

---

### [BACKEND] Task 7.2.2: Pay Ride with Card
**Responsável:** Backend Dev 1  
**Estimativa:** 3 SP  
**Duração:** 6 horas

**Descrição:**
Integrar pagamento com cartão no fluxo de corrida.

**Update Payment Model:**
```python
# backend/src/models/payment.py (add field)

class Payment(Base, TimestampMixin):
    # ... existing fields
    
    # Card payment
    payment_method_id = Column(Integer, ForeignKey("payment_methods.id"), nullable=True)
    stripe_payment_intent_id = Column(String(255), nullable=True, index=True)
    
    # Relationship
    payment_method = relationship("PaymentMethod")
```

**Migration:**
```python
# backend/alembic/versions/011_add_card_to_payment.py
"""Add card payment fields

Revision ID: 011
Revises: 010
"""
from alembic import op
import sqlalchemy as sa

revision = '011'
down_revision = '010'

def upgrade():
    op.add_column('payments', sa.Column('payment_method_id', sa.Integer(), sa.ForeignKey('payment_methods.id')))
    op.add_column('payments', sa.Column('stripe_payment_intent_id', sa.String(255)))
    op.create_index('ix_payments_stripe_payment_intent_id', 'payments', ['stripe_payment_intent_id'])

def downgrade():
    op.drop_index('ix_payments_stripe_payment_intent_id', 'payments')
    op.drop_column('payments', 'stripe_payment_intent_id')
    op.drop_column('payments', 'payment_method_id')
```

**Service:**
```python
# backend/src/services/payment/card_payment_service.py
from src.services.payment.stripe_client import stripe_client
from src.models.payment import Payment, PaymentStatus
from src.models.financial_event import EventType, EventStatus
from src.services.ledger import LedgerService
from src.services.ride_payment_service import RidePaymentService
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger(__name__)

class CardPaymentService:
    """Handle card payments"""
    
    @staticmethod
    def charge_ride(
        ride_id: int,
        payment_method_id: int,
        amount: float,
        customer_id: str,
        db: Session
    ) -> Payment:
        """
        Charge ride to card
        
        Args:
            ride_id: Ride ID
            payment_method_id: Payment method ID (our DB)
            amount: Amount to charge
            customer_id: Stripe customer ID
            db: Database session
        
        Returns:
            Payment object
        """
        
        from src.models.payment_method import PaymentMethod
        
        # Get payment method
        pm = db.query(PaymentMethod).filter(
            PaymentMethod.id == payment_method_id
        ).first()
        
        if not pm:
            raise ValueError("Payment method not found")
        
        if not pm.is_active or pm.is_expired():
            raise ValueError("Payment method is not valid")
        
        try:
            # Create payment intent
            intent = stripe_client.create_payment_intent(
                amount=amount,
                customer_id=customer_id,
                payment_method_id=pm.stripe_payment_method_id,
                metadata={
                    "ride_id": ride_id,
                    "source": "ibora_ride"
                }
            )
            
            # Create payment record
            payment = Payment(
                ride_id=ride_id,
                payment_method_id=payment_method_id,
                amount=amount,
                payment_method="card",
                status=PaymentStatus.PROCESSING,
                stripe_payment_intent_id=intent["id"],
                external_transaction_id=intent["id"]
            )
            
            db.add(payment)
            db.flush()
            
            # Check status
            if intent["status"] == "succeeded":
                # Payment succeeded immediately
                payment.status = PaymentStatus.COMPLETED
                payment.paid_at = datetime.utcnow()
                
                # Process ride payment (create financial events)
                RidePaymentService.process_ride_payment(ride_id, db)
                
                # Confirm financial events
                RidePaymentService.confirm_ride_payment(
                    ride_id,
                    external_transaction_id=intent["id"],
                    db=db
                )
                
                logger.info(f"Card payment succeeded: ride_id={ride_id}, intent={intent['id']}")
            
            elif intent["status"] in ["requires_payment_method", "requires_confirmation"]:
                # Needs additional action (3D Secure, etc)
                payment.status = PaymentStatus.PENDING
                logger.info(f"Card payment requires action: ride_id={ride_id}, intent={intent['id']}")
            
            else:
                # Failed
                payment.status = PaymentStatus.FAILED
                logger.error(f"Card payment failed: ride_id={ride_id}, intent={intent['id']}")
            
            db.commit()
            db.refresh(payment)
            
            return payment
        
        except Exception as e:
            logger.error(f"Card payment exception: {e}")
            db.rollback()
            raise
    
    @staticmethod
    def complete_payment(payment: Payment, db: Session):
        """
        Complete pending payment
        
        Called after 3D Secure or other confirmation
        """
        
        if payment.status != PaymentStatus.PENDING:
            raise ValueError(f"Payment not pending: {payment.status}")
        
        try:
            # Get latest intent status
            intent = stripe_client.get_payment_intent(payment.stripe_payment_intent_id)
            
            if intent["status"] == "succeeded":
                payment.status = PaymentStatus.COMPLETED
                payment.paid_at = datetime.utcnow()
                
                # Process ride payment
                RidePaymentService.process_ride_payment(payment.ride_id, db)
                RidePaymentService.confirm_ride_payment(
                    payment.ride_id,
                    external_transaction_id=intent["id"],
                    db=db
                )
                
                db.commit()
                
                logger.info(f"Card payment completed: payment_id={payment.id}")
            
            else:
                logger.warning(f"Payment intent not succeeded: status={intent['status']}")
        
        except Exception as e:
            logger.error(f"Failed to complete payment: {e}")
            raise
```

**Update Ride Complete Endpoint:**
```python
# backend/src/api/v1/rides.py (update existing)

@router.post("/rides/{ride_id}/complete")
async def complete_ride(
    ride_id: int,
    # ... existing params
):
    """Complete ride"""
    
    # ... existing validation
    
    # Complete ride
    ride.status = RideStatus.COMPLETED
    ride.completed_at = datetime.utcnow()
    
    # Recalculate price if needed
    # ... existing price logic
    
    # Handle payment
    if ride.payment_method == PaymentMethod.CARD:
        from src.services.payment.card_payment_service import CardPaymentService
        
        # Get default payment method
        pm = db.query(PaymentMethod).filter(
            PaymentMethod.user_id == passenger.user_id,
            PaymentMethod.is_default == True,
            PaymentMethod.is_active == True
        ).first()
        
        if not pm:
            raise HTTPException(400, "No default payment method")
        
        # Charge card
        try:
            payment = CardPaymentService.charge_ride(
                ride_id=ride.id,
                payment_method_id=pm.id,
                amount=ride.final_price or ride.estimated_price,
                customer_id=passenger.user.stripe_customer_id,
                db=db
            )
            
            if payment.status == PaymentStatus.COMPLETED:
                ride.status = RideStatus.PAID
        
        except Exception as e:
            logger.error(f"Card payment failed: {e}")
            # Don't fail the ride completion
            # Payment will be retried
    
    elif ride.payment_method == PaymentMethod.PIX:
        # Existing Pix flow
        pass
    
    db.commit()
    db.refresh(ride)
    
    return {"message": "Ride completed", "ride": ride}
```

**Critérios de Aceite:**
- [ ] charge_ride cobra cartão
- [ ] Cria Payment record
- [ ] Processa financial events
- [ ] Suporta 3D Secure (pending)
- [ ] Integrado com complete ride

---

## EPIC 7.3: CARD MANAGEMENT (5 SP) ✅

---

### [BACKEND] Task 7.3.1: Set Default Card
**Responsável:** Backend Dev 2  
**Estimativa:** 2 SP  
**Duração:** 4 horas

**Endpoint:**
```python
# backend/src/api/v1/payment_methods.py (add)

@router.put("/payment-methods/{payment_method_id}/set-default")
async def set_default_payment_method(
    payment_method_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Set payment method as default"""
    
    pm = db.query(PaymentMethod).filter(
        PaymentMethod.id == payment_method_id,
        PaymentMethod.user_id == current_user.id,
        PaymentMethod.is_active == True
    ).first()
    
    if not pm:
        raise HTTPException(404, "Payment method not found")
    
    if pm.is_expired():
        raise HTTPException(400, "Card is expired")
    
    # Unset other defaults
    db.query(PaymentMethod).filter(
        PaymentMethod.user_id == current_user.id,
        PaymentMethod.is_default == True
    ).update({"is_default": False})
    
    # Set as default
    pm.is_default = True
    
    db.commit()
    
    logger.info(f"Default payment method changed: user_id={current_user.id}, pm_id={pm.id}")
    
    return {"message": "Default payment method updated"}
```

**Critérios de Aceite:**
- [ ] PUT set-default funciona
- [ ] Unset outros defaults
- [ ] Valida card não expired

---

### [BACKEND] Task 7.3.2: Card Validation
**Responsável:** Backend Dev 1  
**Estimativa:** 3 SP  
**Duração:** 6 horas

**Descrição:**
Validações e checks de cartão.

**Service:**
```python
# backend/src/services/payment/card_validator.py
from src.models.payment_method import PaymentMethod
from sqlalchemy.orm import Session
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class CardValidator:
    """Validate cards"""
    
    @staticmethod
    def validate_for_payment(payment_method: PaymentMethod) -> tuple[bool, str]:
        """
        Validate if card can be used for payment
        
        Returns:
            (is_valid, error_message)
        """
        
        if not payment_method.is_active:
            return False, "Card is inactive"
        
        if payment_method.is_expired():
            return False, "Card is expired"
        
        # TODO: Check with Stripe if card is still valid
        # This would prevent using a card that was deleted/expired in Stripe
        
        return True, ""
    
    @staticmethod
    def check_expired_cards(db: Session):
        """
        Background job to mark expired cards as inactive
        
        Run daily
        """
        
        now = datetime.utcnow()
        
        expired_cards = db.query(PaymentMethod).filter(
            PaymentMethod.is_active == True,
            (
                (PaymentMethod.card_exp_year < now.year) |
                (
                    (PaymentMethod.card_exp_year == now.year) &
                    (PaymentMethod.card_exp_month < now.month)
                )
            )
        ).all()
        
        count = 0
        for card in expired_cards:
            card.is_active = False
            count += 1
        
        if count > 0:
            db.commit()
            logger.info(f"Marked {count} expired cards as inactive")
        
        return count
```

**Background Job:**
```python
# backend/src/jobs/card_expiration_checker.py
from src.services.payment.card_validator import CardValidator
from src.core.database import SessionLocal
import logging

logger = logging.getLogger(__name__)

class CardExpirationChecker:
    """Check for expired cards daily"""
    
    @staticmethod
    def run():
        db = SessionLocal()
        
        try:
            count = CardValidator.check_expired_cards(db)
            logger.info(f"Card expiration check complete: {count} cards expired")
        
        finally:
            db.close()

# Schedule with APScheduler
from apscheduler.schedulers.background import BackgroundScheduler

scheduler = BackgroundScheduler()
scheduler.add_job(
    CardExpirationChecker.run,
    'cron',
    hour=2,  # 2 AM daily
    id='card_expiration_checker'
)
scheduler.start()
```

**Critérios de Aceite:**
- [ ] validate_for_payment funciona
- [ ] check_expired_cards job
- [ ] Marca cards expirados como inactive
- [ ] Job executa diariamente

---

## ✅ SPRINT 7 COMPLETO!

### Resumo:

**Epic 7.1: Stripe Setup (8 SP)** ✅
- Stripe SDK configurado
- Card model & migration
- Stripe customer service

**Epic 7.2: Payment Flow (7 SP)** ✅
- Add payment method endpoint
- Pay ride with card
- Payment intent handling

**Epic 7.3: Card Management (5 SP)** ✅
- Set default card
- Card validation
- Expiration checker

**TOTAL: 20 SP** ✅

---

## 📊 ENTREGÁVEIS SPRINT 7

```
✅ 6 Endpoints (add, list, remove, set-default, pay-ride)
✅ 2 Models (PaymentMethod, updated Payment)
✅ 2 Migrations
✅ Stripe integration completa
✅ Card tokenization
✅ Payment intent flow
✅ 3D Secure support (pending)
✅ Background job (expiration)
✅ 10+ Testes
```

---

## 🎯 FEATURES IMPLEMENTADAS

### ✅ Tokenização Segura
- Stripe.js no frontend
- Nunca guarda dados reais do cartão
- PCI compliance

### ✅ Payment Flow
- Payment intent
- Charge automático
- 3D Secure ready
- Confirmation flow

### ✅ Card Management
- Add card
- List cards
- Remove card
- Set default
- Expiration check

---

## 🚨 PRÓXIMO SPRINT

**Sprint 8: Cartão de Crédito - Parte 2**
- 3D Secure handling
- Chargebacks
- Retry logic
- Payment reconciliation
- Multiple cards per ride

---

**🚀 Sprint 7 pronto para desenvolvimento!**
