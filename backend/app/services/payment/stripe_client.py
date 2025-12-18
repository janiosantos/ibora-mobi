import stripe
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Configure Stripe
if settings.STRIPE_SECRET_KEY:
    stripe.api_key = settings.STRIPE_SECRET_KEY
    stripe.api_version = settings.STRIPE_API_VERSION
else:
    logger.warning("STRIPE_SECRET_KEY not set. Stripe integration will not work.")

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
        
        except stripe.StripeError as e:
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
            # Note: If token is 'tok_', we generally use it to create a PaymentMethod 
            # or Customer source. Modern Stripe uses 'pm_'.
            # If front-end sends 'tok_', creating a PaymentMethod from it:
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
        
        except stripe.StripeError as e:
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
                "capture_method": "automatic"
                # "confirmation_method": "automatic" # Default
            }
            
            # Add payment method if provided
            if payment_method_id:
                intent_params["payment_method"] = payment_method_id
                intent_params["confirm"] = True
                intent_params["automatic_payment_methods"] = {
                    "enabled": True,
                    "allow_redirects": "never" # For background payments usually
                }
            
            intent = stripe.PaymentIntent.create(**intent_params)
            
            logger.info(f"Payment intent created: {intent.id}")
            return intent
        
        except stripe.StripeError as e:
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
        
        except stripe.StripeError as e:
            logger.error(f"Payment intent confirmation failed: {e}")
            raise
    
    @staticmethod
    def get_payment_intent(payment_intent_id: str) -> dict:
        """Get payment intent details"""
        try:
            return stripe.PaymentIntent.retrieve(payment_intent_id)
        except stripe.StripeError as e:
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
        
        except stripe.StripeError as e:
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
        except stripe.SignatureVerificationError as e:
            logger.error(f"Invalid webhook signature: {e}")
            raise

stripe_client = StripeClient()
