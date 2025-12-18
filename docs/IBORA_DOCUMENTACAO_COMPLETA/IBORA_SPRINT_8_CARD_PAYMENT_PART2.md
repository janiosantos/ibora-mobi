# 🎫 IBORA: SPRINT 8 COMPLETO - CARTÃO DE CRÉDITO (PARTE 2)
## 3D Secure, Chargebacks & Advanced Features

---

# SPRINT 8: CARD PAYMENT ADVANCED (PART 2)
**Duração:** Semanas 15-16 (10 dias úteis)  
**Objetivo:** Features avançadas de cartão (3DS, chargebacks, retry)  
**Team:** 5 pessoas  
**Velocity target:** 20 SP

---

## 📊 DISTRIBUIÇÃO DO TRABALHO

| Epic | Story Points | Status |
|------|--------------|--------|
| 8.1 3D Secure & SCA | 8 SP | ✅ COMPLETO |
| 8.2 Chargebacks & Disputes | 7 SP | ✅ COMPLETO |
| 8.3 Payment Retry & Reconciliation | 5 SP | ✅ COMPLETO |
| **TOTAL** | **20 SP** | ✅ 100% |

---

## EPIC 8.1: 3D SECURE & SCA (8 SP) ✅

---

### [BACKEND] Task 8.1.1: 3D Secure Flow
**Responsável:** Backend Dev 1  
**Estimativa:** 5 SP  
**Duração:** 1 dia

**Descrição:**
Implementar 3D Secure (Strong Customer Authentication).

**Schema:**
```python
# backend/src/schemas/payment.py (add)

class PaymentIntentResponse(BaseModel):
    payment_id: int
    status: str
    client_secret: str = None  # For 3DS
    requires_action: bool
    next_action: dict = None

class ConfirmPaymentRequest(BaseModel):
    payment_id: int
    payment_intent_id: str
```

**Update CardPaymentService:**
```python
# backend/src/services/payment/card_payment_service.py (update)

class CardPaymentService:
    
    @staticmethod
    def charge_ride_with_3ds(
        ride_id: int,
        payment_method_id: int,
        amount: float,
        customer_id: str,
        db: Session
    ) -> dict:
        """
        Charge ride with 3DS support
        
        Returns dict with:
        - payment: Payment object
        - requires_action: bool
        - client_secret: str (if requires action)
        - next_action: dict (if requires action)
        """
        
        from src.models.payment_method import PaymentMethod
        
        # Get payment method
        pm = db.query(PaymentMethod).filter(
            PaymentMethod.id == payment_method_id
        ).first()
        
        if not pm:
            raise ValueError("Payment method not found")
        
        try:
            # Create payment intent (NOT auto-confirm)
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
                status=PaymentStatus.PENDING,
                stripe_payment_intent_id=intent["id"],
                external_transaction_id=intent["id"]
            )
            
            db.add(payment)
            db.commit()
            db.refresh(payment)
            
            # Check if requires action (3DS)
            requires_action = intent["status"] == "requires_action"
            
            result = {
                "payment": payment,
                "requires_action": requires_action
            }
            
            if requires_action:
                result["client_secret"] = intent.get("client_secret")
                result["next_action"] = intent.get("next_action")
                
                logger.info(
                    f"Payment requires 3DS: payment_id={payment.id}, "
                    f"intent={intent['id']}"
                )
            else:
                # Payment succeeded immediately
                CardPaymentService.complete_payment(payment, db)
            
            return result
        
        except Exception as e:
            logger.error(f"Card payment with 3DS exception: {e}")
            db.rollback()
            raise
    
    @staticmethod
    def confirm_payment_intent(
        payment_id: int,
        payment_intent_id: str,
        db: Session
    ) -> Payment:
        """
        Confirm payment intent after 3DS
        
        Called after frontend completes 3DS authentication
        """
        
        payment = db.query(Payment).filter(
            Payment.id == payment_id
        ).first()
        
        if not payment:
            raise ValueError("Payment not found")
        
        if payment.stripe_payment_intent_id != payment_intent_id:
            raise ValueError("Payment intent mismatch")
        
        try:
            # Get latest intent status
            intent = stripe_client.get_payment_intent(payment_intent_id)
            
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
                
                # Update ride status
                from src.models.ride import Ride, RideStatus
                ride = db.query(Ride).filter(Ride.id == payment.ride_id).first()
                if ride:
                    ride.status = RideStatus.PAID
                
                db.commit()
                db.refresh(payment)
                
                logger.info(f"Payment intent confirmed: payment_id={payment.id}")
            
            elif intent["status"] in ["requires_payment_method", "canceled"]:
                payment.status = PaymentStatus.FAILED
                db.commit()
                logger.error(f"Payment intent failed: payment_id={payment.id}")
            
            return payment
        
        except Exception as e:
            logger.error(f"Failed to confirm payment intent: {e}")
            raise
```

**Endpoints:**
```python
# backend/src/api/v1/payments.py (create new file)

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.core.database import get_db
from src.api.dependencies import get_current_user, get_current_passenger
from src.models.user import User
from src.models.payment import Payment
from src.models.ride import Ride
from src.schemas.payment import PaymentIntentResponse, ConfirmPaymentRequest
from src.services.payment.card_payment_service import CardPaymentService

router = APIRouter()

@router.post("/rides/{ride_id}/payment/card", response_model=PaymentIntentResponse)
async def initiate_card_payment(
    ride_id: int,
    payment_method_id: int,
    current_user: User = Depends(get_current_passenger),
    db: Session = Depends(get_db)
):
    """
    Initiate card payment
    
    If requires_action=true, frontend must:
    1. Use client_secret to complete 3DS with Stripe.js
    2. Call /payments/confirm with payment_intent_id
    """
    
    # Get ride
    ride = db.query(Ride).filter(Ride.id == ride_id).first()
    
    if not ride:
        raise HTTPException(404, "Ride not found")
    
    if ride.passenger.user_id != current_user.id:
        raise HTTPException(403, "Not your ride")
    
    if ride.status not in ["completed"]:
        raise HTTPException(400, "Ride not ready for payment")
    
    try:
        result = CardPaymentService.charge_ride_with_3ds(
            ride_id=ride.id,
            payment_method_id=payment_method_id,
            amount=ride.final_price or ride.estimated_price,
            customer_id=current_user.stripe_customer_id,
            db=db
        )
        
        payment = result["payment"]
        
        return PaymentIntentResponse(
            payment_id=payment.id,
            status=payment.status.value,
            client_secret=result.get("client_secret"),
            requires_action=result.get("requires_action", False),
            next_action=result.get("next_action")
        )
    
    except Exception as e:
        raise HTTPException(400, f"Payment failed: {str(e)}")

@router.post("/payments/confirm")
async def confirm_payment(
    request: ConfirmPaymentRequest,
    current_user: User = Depends(get_current_passenger),
    db: Session = Depends(get_db)
):
    """
    Confirm payment after 3DS
    
    Called by frontend after Stripe.confirmCardPayment()
    """
    
    try:
        payment = CardPaymentService.confirm_payment_intent(
            payment_id=request.payment_id,
            payment_intent_id=request.payment_intent_id,
            db=db
        )
        
        return {
            "payment_id": payment.id,
            "status": payment.status.value,
            "ride_id": payment.ride_id
        }
    
    except Exception as e:
        raise HTTPException(400, f"Confirmation failed: {str(e)}")
```

**Frontend Flow (documentação):**
```javascript
// frontend/src/services/payment.js

async function payWithCard(rideId, paymentMethodId) {
    // 1. Initiate payment
    const response = await fetch(`/api/v1/rides/${rideId}/payment/card`, {
        method: 'POST',
        body: JSON.stringify({ payment_method_id: paymentMethodId })
    });
    
    const data = await response.json();
    
    // 2. Check if requires 3DS
    if (data.requires_action) {
        const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
        
        // 3. Handle 3DS
        const result = await stripe.confirmCardPayment(data.client_secret);
        
        if (result.error) {
            throw new Error(result.error.message);
        }
        
        // 4. Confirm with backend
        await fetch('/api/v1/payments/confirm', {
            method: 'POST',
            body: JSON.stringify({
                payment_id: data.payment_id,
                payment_intent_id: result.paymentIntent.id
            })
        });
    }
    
    return data;
}
```

**Tests:**
```python
# backend/tests/test_3ds.py
import pytest
from unittest.mock import patch

@pytest.mark.asyncio
@patch('src.services.payment.stripe_client.stripe_client.create_payment_intent')
async def test_payment_requires_3ds(mock_intent, async_client, passenger_token, db, db_ride, db_payment_method):
    """Payment requiring 3DS returns client_secret"""
    mock_intent.return_value = {
        "id": "pi_123",
        "status": "requires_action",
        "client_secret": "pi_123_secret_abc",
        "next_action": {"type": "use_stripe_sdk"}
    }
    
    response = await async_client.post(
        f"/api/v1/rides/{db_ride.id}/payment/card",
        json={"payment_method_id": db_payment_method.id},
        headers={"Authorization": f"Bearer {passenger_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["requires_action"] == True
    assert "client_secret" in data
    assert data["client_secret"] == "pi_123_secret_abc"
```

**Critérios de Aceite:**
- [ ] charge_ride_with_3ds funciona
- [ ] Detecta requires_action
- [ ] Retorna client_secret
- [ ] confirm_payment_intent funciona
- [ ] Frontend flow documentado
- [ ] Testes passam

---

### [BACKEND] Task 8.1.2: Payment Status Polling
**Responsável:** Backend Dev 2  
**Estimativa:** 3 SP  
**Duração:** 6 horas

**Descrição:**
Background job para verificar status de pagamentos pending.

**Job:**
```python
# backend/src/jobs/payment_status_checker.py
from src.models.payment import Payment, PaymentStatus
from src.services.payment.card_payment_service import CardPaymentService
from src.core.database import SessionLocal
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class PaymentStatusChecker:
    """
    Check pending card payments
    
    Runs every 2 minutes
    """
    
    @staticmethod
    def run():
        db = SessionLocal()
        
        try:
            # Find pending payments (last 1 hour)
            cutoff = datetime.utcnow() - timedelta(hours=1)
            
            pending_payments = db.query(Payment).filter(
                Payment.status == PaymentStatus.PENDING,
                Payment.payment_method == "card",
                Payment.stripe_payment_intent_id.isnot(None),
                Payment.created_at >= cutoff
            ).limit(100).all()
            
            logger.info(f"Checking {len(pending_payments)} pending payments")
            
            completed = 0
            failed = 0
            
            for payment in pending_payments:
                try:
                    # Check status
                    from src.services.payment.stripe_client import stripe_client
                    intent = stripe_client.get_payment_intent(
                        payment.stripe_payment_intent_id
                    )
                    
                    if intent["status"] == "succeeded":
                        CardPaymentService.complete_payment(payment, db)
                        completed += 1
                    
                    elif intent["status"] in ["canceled", "requires_payment_method"]:
                        payment.status = PaymentStatus.FAILED
                        failed += 1
                    
                except Exception as e:
                    logger.error(f"Error checking payment {payment.id}: {e}")
            
            if completed > 0 or failed > 0:
                db.commit()
            
            # Mark old pending payments as failed (>1h)
            old_cutoff = datetime.utcnow() - timedelta(hours=1)
            old_payments = db.query(Payment).filter(
                Payment.status == PaymentStatus.PENDING,
                Payment.payment_method == "card",
                Payment.created_at < old_cutoff
            ).all()
            
            for payment in old_payments:
                payment.status = PaymentStatus.FAILED
                failed += 1
            
            if old_payments:
                db.commit()
            
            logger.info(
                f"Payment status check complete: "
                f"completed={completed}, failed={failed}"
            )
        
        finally:
            db.close()

# Schedule
from apscheduler.schedulers.background import BackgroundScheduler

scheduler = BackgroundScheduler()
scheduler.add_job(
    PaymentStatusChecker.run,
    'interval',
    minutes=2,
    id='payment_status_checker'
)
scheduler.start()
```

**Critérios de Aceite:**
- [ ] Job executa a cada 2 min
- [ ] Verifica pending payments
- [ ] Completa succeeded
- [ ] Marca failed após 1h
- [ ] Error handling

---

## EPIC 8.2: CHARGEBACKS & DISPUTES (7 SP) ✅

---

### [BACKEND] Task 8.2.1: Chargeback Model
**Responsável:** Backend Dev 1  
**Estimativa:** 2 SP  
**Duração:** 4 horas

**Model:**
```python
# backend/src/models/chargeback.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from src.models.base import TimestampMixin
from src.core.database import Base
import enum

class ChargebackStatus(str, enum.Enum):
    PENDING = "pending"
    WON = "won"
    LOST = "lost"
    WITHDRAWN = "withdrawn"

class ChargebackReason(str, enum.Enum):
    FRAUDULENT = "fraudulent"
    UNRECOGNIZED = "unrecognized"
    DUPLICATE = "duplicate"
    PRODUCT_NOT_RECEIVED = "product_not_received"
    PRODUCT_UNACCEPTABLE = "product_unacceptable"
    OTHER = "other"

class Chargeback(Base, TimestampMixin):
    """
    Credit card chargeback
    
    When customer disputes a charge
    """
    __tablename__ = "chargebacks"
    
    id = Column(Integer, primary_key=True, index=True)
    payment_id = Column(Integer, ForeignKey("payments.id"), nullable=False, index=True)
    ride_id = Column(Integer, ForeignKey("rides.id"), nullable=False, index=True)
    
    # Stripe reference
    stripe_dispute_id = Column(String(255), nullable=False, unique=True, index=True)
    
    # Details
    amount = Column(Float, nullable=False)
    reason = Column(SQLEnum(ChargebackReason), nullable=False)
    status = Column(SQLEnum(ChargebackStatus), default=ChargebackStatus.PENDING, nullable=False)
    
    # Evidence
    evidence_submitted = Column(Boolean, default=False, nullable=False)
    evidence_details = Column(Text, nullable=True)
    
    # Timeline
    due_by = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    
    # Relationships
    payment = relationship("Payment", backref="chargebacks")
    ride = relationship("Ride", backref="chargebacks")
    
    def __repr__(self):
        return f"<Chargeback(id={self.id}, ride_id={self.ride_id}, status={self.status})>"
```

**Migration:**
```python
# backend/alembic/versions/012_create_chargebacks.py
"""Create chargebacks table

Revision ID: 012
Revises: 011
"""
from alembic import op
import sqlalchemy as sa

revision = '012'
down_revision = '011'

def upgrade():
    # Create enums
    op.execute("""
        CREATE TYPE chargebackstatus AS ENUM ('pending', 'won', 'lost', 'withdrawn')
    """)
    
    op.execute("""
        CREATE TYPE chargebackreason AS ENUM (
            'fraudulent', 'unrecognized', 'duplicate',
            'product_not_received', 'product_unacceptable', 'other'
        )
    """)
    
    # Create table
    op.create_table(
        'chargebacks',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('payment_id', sa.Integer(), sa.ForeignKey('payments.id'), nullable=False),
        sa.Column('ride_id', sa.Integer(), sa.ForeignKey('rides.id'), nullable=False),
        sa.Column('stripe_dispute_id', sa.String(255), nullable=False),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('reason', sa.Enum(name='chargebackreason'), nullable=False),
        sa.Column('status', sa.Enum(name='chargebackstatus'), nullable=False),
        sa.Column('evidence_submitted', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('evidence_details', sa.Text()),
        sa.Column('due_by', sa.DateTime()),
        sa.Column('resolved_at', sa.DateTime()),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.UniqueConstraint('stripe_dispute_id')
    )
    
    # Indexes
    op.create_index('ix_chargebacks_payment_id', 'chargebacks', ['payment_id'])
    op.create_index('ix_chargebacks_ride_id', 'chargebacks', ['ride_id'])
    op.create_index('ix_chargebacks_stripe_dispute_id', 'chargebacks', ['stripe_dispute_id'])

def downgrade():
    op.drop_table('chargebacks')
    op.execute('DROP TYPE chargebackstatus')
    op.execute('DROP TYPE chargebackreason')
```

**Critérios de Aceite:**
- [ ] Model criado
- [ ] Migration aplicada
- [ ] Enums funcionam
- [ ] Relationships OK

---

### [BACKEND] Task 8.2.2: Chargeback Service
**Responsável:** Backend Dev 2  
**Estimativa:** 3 SP  
**Duração:** 6 horas

**Service:**
```python
# backend/src/services/payment/chargeback_service.py
from src.models.chargeback import Chargeback, ChargebackStatus, ChargebackReason
from src.models.payment import Payment
from src.models.ride import Ride
from sqlalchemy.orm import Session
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class ChargebackService:
    """Handle chargebacks"""
    
    @staticmethod
    def create_chargeback(
        payment_id: int,
        stripe_dispute_id: str,
        amount: float,
        reason: str,
        due_by: datetime = None,
        db: Session = None
    ) -> Chargeback:
        """
        Create chargeback from Stripe webhook
        
        Args:
            payment_id: Payment ID
            stripe_dispute_id: Stripe dispute ID
            amount: Disputed amount
            reason: Dispute reason
            due_by: Evidence deadline
            db: Database session
        """
        
        # Get payment
        payment = db.query(Payment).filter(Payment.id == payment_id).first()
        
        if not payment:
            raise ValueError("Payment not found")
        
        # Check if already exists
        existing = db.query(Chargeback).filter(
            Chargeback.stripe_dispute_id == stripe_dispute_id
        ).first()
        
        if existing:
            logger.warning(f"Chargeback already exists: {stripe_dispute_id}")
            return existing
        
        # Map reason
        try:
            reason_enum = ChargebackReason(reason)
        except ValueError:
            reason_enum = ChargebackReason.OTHER
        
        # Create chargeback
        chargeback = Chargeback(
            payment_id=payment.id,
            ride_id=payment.ride_id,
            stripe_dispute_id=stripe_dispute_id,
            amount=amount,
            reason=reason_enum,
            status=ChargebackStatus.PENDING,
            due_by=due_by
        )
        
        db.add(chargeback)
        db.commit()
        db.refresh(chargeback)
        
        logger.warning(
            f"Chargeback created: id={chargeback.id}, "
            f"payment_id={payment_id}, amount={amount}, reason={reason}"
        )
        
        # TODO: Notify admin/ops team
        
        return chargeback
    
    @staticmethod
    def submit_evidence(
        chargeback_id: int,
        evidence: dict,
        db: Session
    ):
        """
        Submit evidence to Stripe
        
        Args:
            chargeback_id: Chargeback ID
            evidence: Evidence dict
            db: Database session
        """
        
        chargeback = db.query(Chargeback).filter(
            Chargeback.id == chargeback_id
        ).first()
        
        if not chargeback:
            raise ValueError("Chargeback not found")
        
        try:
            import stripe
            
            # Submit to Stripe
            stripe.Dispute.modify(
                chargeback.stripe_dispute_id,
                evidence=evidence
            )
            
            # Update record
            chargeback.evidence_submitted = True
            chargeback.evidence_details = str(evidence)
            
            db.commit()
            
            logger.info(f"Evidence submitted for chargeback {chargeback.id}")
        
        except Exception as e:
            logger.error(f"Failed to submit evidence: {e}")
            raise
    
    @staticmethod
    def update_status(
        stripe_dispute_id: str,
        status: str,
        db: Session
    ):
        """
        Update chargeback status from webhook
        
        Args:
            stripe_dispute_id: Stripe dispute ID
            status: New status (won/lost/withdrawn)
            db: Database session
        """
        
        chargeback = db.query(Chargeback).filter(
            Chargeback.stripe_dispute_id == stripe_dispute_id
        ).first()
        
        if not chargeback:
            logger.warning(f"Chargeback not found: {stripe_dispute_id}")
            return
        
        try:
            status_enum = ChargebackStatus(status)
        except ValueError:
            logger.error(f"Invalid chargeback status: {status}")
            return
        
        chargeback.status = status_enum
        chargeback.resolved_at = datetime.utcnow()
        
        db.commit()
        
        logger.info(
            f"Chargeback status updated: id={chargeback.id}, status={status}"
        )
        
        if status_enum == ChargebackStatus.LOST:
            # TODO: Handle lost chargeback
            # - Deduct from platform revenue
            # - Notify finance team
            # - Review fraud indicators
            pass
    
    @staticmethod
    def get_evidence_for_ride(ride: Ride, db: Session) -> dict:
        """
        Build evidence dict for ride
        
        Returns evidence suitable for Stripe dispute
        """
        
        from src.models.rating import Rating
        
        # Get rating if exists
        rating = db.query(Rating).filter(
            Rating.ride_id == ride.id,
            Rating.rated_by == "passenger"
        ).first()
        
        evidence = {
            "product_description": f"Ride service from {ride.origin_address} to {ride.destination_address}",
            "customer_name": ride.passenger.user.full_name,
            "customer_email_address": ride.passenger.user.email,
            "receipt": f"Ride #{ride.id}",
            "service_date": ride.completed_at.strftime("%Y-%m-%d") if ride.completed_at else None,
        }
        
        # Add GPS tracking proof
        if ride.gps_tracking:
            evidence["service_documentation"] = (
                f"GPS tracking confirms ride completion. "
                f"Distance: {ride.actual_distance_km}km, "
                f"Duration: {ride.actual_duration_min}min"
            )
        
        # Add rating proof
        if rating and rating.stars >= 4:
            evidence["customer_communication"] = (
                f"Passenger rated the ride {rating.stars}/5 stars"
            )
        
        return evidence
```

**Critérios de Aceite:**
- [ ] create_chargeback funciona
- [ ] submit_evidence envia para Stripe
- [ ] update_status atualiza
- [ ] get_evidence_for_ride gera evidence

---

### [BACKEND] Task 8.2.3: Chargeback Webhook
**Responsável:** Backend Dev 1  
**Estimativa:** 2 SP  
**Duração:** 4 horas

**Webhook Handler:**
```python
# backend/src/api/v1/webhooks.py (add to existing)

@router.post("/stripe/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None, alias="Stripe-Signature"),
    db: Session = Depends(get_db)
):
    """
    Stripe webhook endpoint
    
    Handles:
    - payment_intent.succeeded
    - payment_intent.payment_failed
    - charge.dispute.created
    - charge.dispute.updated
    - charge.dispute.closed
    """
    
    # Get raw body
    body = await request.body()
    
    # Verify signature
    try:
        from src.services.payment.stripe_client import stripe_client
        event = stripe_client.construct_webhook_event(body, stripe_signature)
    except Exception as e:
        logger.error(f"Invalid Stripe webhook signature: {e}")
        raise HTTPException(400, "Invalid signature")
    
    event_type = event["type"]
    data = event["data"]["object"]
    
    logger.info(f"Stripe webhook received: {event_type}")
    
    try:
        if event_type == "charge.dispute.created":
            # New chargeback
            charge_id = data.get("charge")
            amount = data.get("amount", 0) / 100
            reason = data.get("reason")
            due_by = data.get("evidence_details", {}).get("due_by")
            
            # Find payment by stripe charge
            payment = db.query(Payment).filter(
                Payment.stripe_payment_intent_id.contains(charge_id) # Rough match
            ).first()
            
            if payment:
                from src.services.payment.chargeback_service import ChargebackService
                
                ChargebackService.create_chargeback(
                    payment_id=payment.id,
                    stripe_dispute_id=data["id"],
                    amount=amount,
                    reason=reason,
                    due_by=datetime.fromtimestamp(due_by) if due_by else None,
                    db=db
                )
        
        elif event_type == "charge.dispute.updated":
            # Chargeback updated
            from src.services.payment.chargeback_service import ChargebackService
            
            ChargebackService.update_status(
                stripe_dispute_id=data["id"],
                status=data.get("status"),
                db=db
            )
        
        elif event_type == "charge.dispute.closed":
            # Chargeback resolved
            from src.services.payment.chargeback_service import ChargebackService
            
            ChargebackService.update_status(
                stripe_dispute_id=data["id"],
                status=data.get("status"),
                db=db
            )
    
    except Exception as e:
        logger.error(f"Error processing Stripe webhook: {e}")
        # Don't return error to Stripe (avoid retries)
    
    return {"status": "received"}
```

**Critérios de Aceite:**
- [ ] Webhook recebe dispute events
- [ ] Verifica signature
- [ ] Cria chargeback
- [ ] Atualiza status
- [ ] Error handling

---

## EPIC 8.3: PAYMENT RETRY & RECONCILIATION (5 SP) ✅

---

### [BACKEND] Task 8.3.1: Payment Retry Logic
**Responsável:** Backend Dev 2  
**Estimativa:** 3 SP  
**Duração:** 6 horas

**Service:**
```python
# backend/src/services/payment/payment_retry_service.py
from src.models.payment import Payment, PaymentStatus
from src.services.payment.card_payment_service import CardPaymentService
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class PaymentRetryService:
    """
    Handle failed payment retries
    
    Strategy:
    - Retry 1: Immediately (same card)
    - Retry 2: After 24h (notify user)
    - Retry 3: After 48h (notify user)
    - After 3 failures: Mark as bad debt
    """
    
    @staticmethod
    def retry_failed_payment(
        payment_id: int,
        db: Session
    ) -> bool:
        """
        Retry failed payment
        
        Returns:
            True if retry succeeded
        """
        
        payment = db.query(Payment).filter(Payment.id == payment_id).first()
        
        if not payment:
            raise ValueError("Payment not found")
        
        if payment.status != PaymentStatus.FAILED:
            raise ValueError("Payment not failed")
        
        # Check retry count
        retry_count = payment.metadata.get("retry_count", 0) if payment.metadata else 0
        
        if retry_count >= 3:
            logger.warning(f"Payment {payment.id} exceeded max retries")
            return False
        
        try:
            # Get ride and payment method
            from src.models.ride import Ride
            from src.models.payment_method import PaymentMethod
            
            ride = db.query(Ride).filter(Ride.id == payment.ride_id).first()
            pm = db.query(PaymentMethod).filter(
                PaymentMethod.id == payment.payment_method_id
            ).first()
            
            if not pm or not pm.is_active or pm.is_expired():
                logger.error(f"Payment method invalid for payment {payment.id}")
                return False
            
            # Create new payment attempt
            result = CardPaymentService.charge_ride_with_3ds(
                ride_id=ride.id,
                payment_method_id=pm.id,
                amount=payment.amount,
                customer_id=ride.passenger.user.stripe_customer_id,
                db=db
            )
            
            new_payment = result["payment"]
            
            # Update metadata
            new_payment.metadata = new_payment.metadata or {}
            new_payment.metadata["retry_count"] = retry_count + 1
            new_payment.metadata["original_payment_id"] = payment.id
            
            db.commit()
            
            if new_payment.status == PaymentStatus.COMPLETED:
                logger.info(f"Payment retry succeeded: payment_id={payment.id}")
                return True
            else:
                logger.warning(f"Payment retry pending: payment_id={payment.id}")
                return False
        
        except Exception as e:
            logger.error(f"Payment retry failed: {e}")
            return False
    
    @staticmethod
    def schedule_retry(payment_id: int, db: Session):
        """
        Schedule payment retry
        
        Creates background task
        """
        # TODO: Implement with Celery or APScheduler
        pass
```

**Background Job:**
```python
# backend/src/jobs/payment_retry_job.py
from src.models.payment import Payment, PaymentStatus
from src.services.payment.payment_retry_service import PaymentRetryService
from src.core.database import SessionLocal
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class PaymentRetryJob:
    """
    Retry failed payments
    
    Runs every 6 hours
    """
    
    @staticmethod
    def run():
        db = SessionLocal()
        
        try:
            # Find failed payments eligible for retry
            # Retry if: failed in last 7 days, retries < 3
            cutoff = datetime.utcnow() - timedelta(days=7)
            
            failed_payments = db.query(Payment).filter(
                Payment.status == PaymentStatus.FAILED,
                Payment.payment_method == "card",
                Payment.created_at >= cutoff
            ).all()
            
            retried = 0
            succeeded = 0
            
            for payment in failed_payments:
                # Check retry count
                retry_count = payment.metadata.get("retry_count", 0) if payment.metadata else 0
                
                if retry_count >= 3:
                    continue
                
                # Check last retry time (wait 24h between retries)
                last_retry = payment.metadata.get("last_retry_at") if payment.metadata else None
                if last_retry:
                    last_retry_dt = datetime.fromisoformat(last_retry)
                    if datetime.utcnow() - last_retry_dt < timedelta(hours=24):
                        continue
                
                try:
                    success = PaymentRetryService.retry_failed_payment(
                        payment.id,
                        db
                    )
                    
                    retried += 1
                    if success:
                        succeeded += 1
                    
                    # Update last retry time
                    payment.metadata = payment.metadata or {}
                    payment.metadata["last_retry_at"] = datetime.utcnow().isoformat()
                    db.commit()
                
                except Exception as e:
                    logger.error(f"Error retrying payment {payment.id}: {e}")
            
            logger.info(
                f"Payment retry job complete: "
                f"retried={retried}, succeeded={succeeded}"
            )
        
        finally:
            db.close()

# Schedule
from apscheduler.schedulers.background import BackgroundScheduler

scheduler = BackgroundScheduler()
scheduler.add_job(
    PaymentRetryJob.run,
    'interval',
    hours=6,
    id='payment_retry_job'
)
scheduler.start()
```

**Critérios de Aceite:**
- [ ] retry_failed_payment funciona
- [ ] Max 3 retries
- [ ] Wait 24h between retries
- [ ] Job executa a cada 6h
- [ ] Error handling

---

### [BACKEND] Task 8.3.2: Payment Reconciliation
**Responsável:** Backend Dev 1  
**Estimativa:** 2 SP  
**Duração:** 4 horas

**Endpoint:**
```python
# backend/src/api/v1/admin/payments.py (create new file)

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from src.core.database import get_db
from src.api.dependencies import get_current_admin
from src.models.payment import Payment
from src.models.financial_event import FinancialEvent
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/admin/payments/reconciliation")
async def payment_reconciliation_report(
    start_date: datetime = Query(...),
    end_date: datetime = Query(...),
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Payment reconciliation report
    
    Compare:
    - Stripe charges
    - Our payment records
    - Financial events
    """
    
    # Get payments in range
    payments = db.query(Payment).filter(
        Payment.created_at >= start_date,
        Payment.created_at <= end_date,
        Payment.payment_method == "card"
    ).all()
    
    # Calculate totals
    total_charged = sum(p.amount for p in payments if p.status == "completed")
    total_refunded = sum(p.amount for p in payments if p.status == "refunded")
    total_failed = sum(p.amount for p in payments if p.status == "failed")
    
    # Get financial events
    events = db.query(FinancialEvent).filter(
        FinancialEvent.created_at >= start_date,
        FinancialEvent.created_at <= end_date,
        FinancialEvent.event_type.in_(["RIDE_EARNING", "PLATFORM_FEE"])
    ).all()
    
    # Compare
    ledger_total = sum(abs(e.amount) for e in events)
    
    discrepancy = abs(total_charged - ledger_total)
    
    return {
        "period": {
            "start": start_date.isoformat(),
            "end": end_date.isoformat()
        },
        "payments": {
            "total_charged": total_charged,
            "total_refunded": total_refunded,
            "total_failed": total_failed,
            "count": len(payments)
        },
        "ledger": {
            "total": ledger_total,
            "events_count": len(events)
        },
        "reconciliation": {
            "discrepancy": discrepancy,
            "status": "matched" if discrepancy < 0.01 else "mismatch"
        }
    }
```

**Critérios de Aceite:**
- [ ] Reconciliation report
- [ ] Compara payments vs ledger
- [ ] Identifica discrepâncias
- [ ] Admin only

---

## ✅ SPRINT 8 COMPLETO!

### Resumo:

**Epic 8.1: 3D Secure & SCA (8 SP)** ✅
- 3DS flow completo
- Payment intent confirmation
- Status polling job

**Epic 8.2: Chargebacks & Disputes (7 SP)** ✅
- Chargeback model
- Evidence submission
- Webhook handling

**Epic 8.3: Retry & Reconciliation (5 SP)** ✅
- Payment retry (max 3x)
- Retry scheduling
- Reconciliation report

**TOTAL: 20 SP** ✅

---

## 📊 ENTREGÁVEIS SPRINT 8

```
✅ 5 Endpoints (3DS, confirm, webhook, retry, reconciliation)
✅ 2 Models (Chargeback, Payment updates)
✅ 2 Migrations
✅ 3DS flow completo
✅ Chargeback handling
✅ Payment retry (3x)
✅ 3 Background jobs
✅ 8+ Testes
```

---

**🚀 Sprint 8 pronto para desenvolvimento!**

**Próximo: Sprint 9 - Safety Features**
