from app.modules.finance.models.payment import Payment, PaymentStatus
from app.services.payment.payment_service import PaymentService
from app.core.database import AsyncSessionLocal
from datetime import datetime, timedelta, timezone
import logging

logger = logging.getLogger(__name__)

class PaymentStatusChecker:
    """
    Background job to check payment status
    Runs every 1 minute checks payments that are:
    - Status = PENDING
    - Created < 30 min ago (before expiration)
    """
    
    @staticmethod
    async def run():
        """
        Check pending payments
        """
        # We need async session here? 
        # PaymentService methods are async: await PaymentService.check_payment_status(payment, db)
        # So this run method must be async.
        
        # We need an async session maker. 
        # Standard SessionLocal is likely synchronous in typical setups or we need AsyncSessionLocal from app.core.database
        from app.core.database import AsyncSessionLocal
        
        async with AsyncSessionLocal() as db:
            try:
                # Find pending payments created in the last 30 minutes
                # To avoid scanning infinite old payments
                cutoff_time = datetime.now(timezone.utc) - timedelta(minutes=60) # extended to 60 just in case
                
                # We need to execute a query.
                from sqlalchemy import select
                stmt = select(Payment).where(
                    Payment.status == PaymentStatus.PENDING,
                    Payment.payment_method == "pix",
                    Payment.created_at >= cutoff_time
                ).limit(100)
                
                result = await db.execute(stmt)
                payments = result.scalars().all()
                
                if payments:
                    logger.info(f"PaymentChecker: Checking {len(payments)} pending payments...")
                
                for payment in payments:
                    try:
                        # Check status
                        await PaymentService.check_payment_status(payment, db)
                        await db.commit() # Commit after each check if service doesn't commit? 
                        # PaymentService.check_payment_status seems to do commits or flushes?
                        # Let's check PaymentService.check_payment_status implementation.
                        # It usually returns updated payment. We should ensure commit happens.
                        
                    except Exception as e:
                        logger.error(f"Error checking payment {payment.id}: {e}")
                        
                # TODO: Mark expired?
                # The logic for expiration is usually handled by Efí itself (status doesn't change?)
                # Or we can mark locally if time > created + expiration.
                
            except Exception as e:
                logger.error(f"PaymentStatusChecker Job Failed: {e}")
