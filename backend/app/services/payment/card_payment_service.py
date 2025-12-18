from app.services.payment.stripe_client import stripe_client
from app.modules.finance.models.payment import Payment, PaymentStatus
from app.modules.finance.models.payment_method import PaymentMethod
from app.services.ride_payment import RidePaymentService
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class CardPaymentService:
    """Handle card payments"""
    
    @staticmethod
    @staticmethod
    async def charge_ride(
        ride, # Expects Ride object
        payment_method_id: int,
        amount: float,
        customer_id: str,
        passenger_id: str,
        db: AsyncSession
    ) -> Payment:
        """
        Charge ride to card
        
        Args:
            ride: Ride object
            payment_method_id: Payment method ID (our DB)
            amount: Amount to charge
            customer_id: Stripe customer ID
            passenger_id: Passenger ID (for payment record)
            db: Database session
        """
        
        # Get payment method
        stmt = select(PaymentMethod).where(PaymentMethod.id == payment_method_id)
        result = await db.execute(stmt)
        pm = result.scalars().first()
        
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
                    "ride_id": str(ride.id),
                    "source": "ibora_ride"
                }
            )
            
            # Create payment record
            payment = Payment(
                ride_id=ride.id,
                passenger_id=passenger_id, 
                payment_method_id=payment_method_id,
                amount=amount,
                payment_method="credit_card",
                status=PaymentStatus.PROCESSING,
                stripe_payment_intent_id=intent["id"],
                external_transaction_id=intent["id"]
            )
            
            db.add(payment)
            await db.flush() # Flush to get ID if needed, but we used async session
            
            # Check status
            if intent["status"] == "succeeded":
                # Payment succeeded immediately
                payment.status = PaymentStatus.COMPLETED
                payment.paid_at = datetime.utcnow()
                
                # Process ride payment (create financial events)
                # Use the passed ride object, do NOT access payment.ride (triggers async lazy load)
                payment_info = await RidePaymentService.process_ride_payment(ride, db)
                
                # Link events to payment
                payment.payment_event_id = payment_info["payment_event_id"]
                payment.earning_event_id = payment_info["earning_event_id"]
                payment.commission_event_id = payment_info["commission_event_id"]
                
                logger.info(f"Card payment succeeded: ride_id={ride.id}, intent={intent['id']}")
            
            elif intent["status"] in ["requires_payment_method", "requires_confirmation", "requires_action"]:
                # Needs additional action (3D Secure, etc)
                payment.status = PaymentStatus.PENDING # Or a specific status like REQUIRES_ACTION
                logger.info(f"Card payment requires action: ride_id={ride_id}, intent={intent['id']}")
            
            else:
                # Failed
                payment.status = PaymentStatus.FAILED
                logger.error(f"Card payment failed: ride_id={ride_id}, intent={intent['id']}")
            
            await db.commit()
            await db.refresh(payment)
            
            return payment
        
        except Exception as e:
            logger.error(f"Card payment exception: {e}")
            # db.rollback() # Handled by caller usually
            raise
    
    @staticmethod
    async def complete_payment(payment: Payment, db: AsyncSession):
        """
        Complete pending payment
        
        Called after 3D Secure or other confirmation
        """
        
        if payment.status != PaymentStatus.PENDING and payment.status != PaymentStatus.PROCESSING:
             # It might be processing if created above
             pass
        
        try:
            # Get latest intent status
            intent = stripe_client.get_payment_intent(payment.stripe_payment_intent_id)
            
            if intent["status"] == "succeeded":
                payment.status = PaymentStatus.COMPLETED
                payment.paid_at = datetime.utcnow()
                
                # Process ride payment
                payment_info = await RidePaymentService.process_ride_payment(payment.ride, db)
                 # Link events to payment
                payment.payment_event_id = payment_info["payment_event_id"]
                payment.earning_event_id = payment_info["earning_event_id"]
                payment.commission_event_id = payment_info["commission_event_id"]
                
                await db.commit()
                
                logger.info(f"Card payment completed: payment_id={payment.id}")
            
            else:
                logger.warning(f"Payment intent not succeeded: status={intent['status']}")
        
        except Exception as e:
            logger.error(f"Failed to complete payment: {e}")
            raise
