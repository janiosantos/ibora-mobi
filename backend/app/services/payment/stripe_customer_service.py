from app.services.payment.stripe_client import stripe_client
from app.modules.auth.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
import logging

logger = logging.getLogger(__name__)

class StripeCustomerService:
    """
    Manage Stripe customers
    
    Ensures every user has a Stripe customer ID
    """
    
    @staticmethod
    async def get_or_create_customer(user: User, db: AsyncSession) -> str:
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
            # logger.info(f"User {user.id} already has Stripe customer: {user.stripe_customer_id}")
            return user.stripe_customer_id
        
        try:
            # Create Stripe customer
            # We assume user.full_name exists, otherwise fallback? 
            # User model likely has name or full_name? In previous views I saw password_hash etc.
            # I should verify User model fields. In `app/modules/auth/models/user.py` I saw:
            # email, phone... I didn't see explicit 'name' or 'full_name' in the lines I viewed (1-35).
            # I must check if User has name. If not, use email.
            
            customer_name = getattr(user, 'full_name', user.email)
            
            customer = stripe_client.create_customer(
                email=user.email,
                name=customer_name,
                phone=user.phone
            )
            
            # Save customer ID
            user.stripe_customer_id = customer.id
            db.add(user) # Should be attached, but just in case
            await db.commit()
            
            logger.info(f"Created Stripe customer for user {user.id}: {customer.id}")
            
            return customer.id
        
        except Exception as e:
            logger.error(f"Failed to create Stripe customer: {e}")
            # Do NOT rollback if session handles it? Fastapi DB dependency usually handles transaction.
            # But here we committed. If create_customer fails, we didn't commit anything.
            # If commit fails, session rolls back?
            raise
    
    @staticmethod
    async def update_customer(user: User, db: AsyncSession):
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
                name=getattr(user, 'full_name', user.email),
                phone=user.phone
            )
            
            logger.info(f"Updated Stripe customer: {user.stripe_customer_id}")
        
        except Exception as e:
            logger.error(f"Failed to update Stripe customer: {e}")
            # Don't raise - this is not critical
