from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from datetime import datetime, timedelta, timezone
import logging

from app.services.payment.efi_client import efi_client
from app.services.ride_payment import RidePaymentService
from app.modules.finance.models.financial_event import FinancialEvent, EventStatus, EventType
# Assuming we have a PaymentIntent or similar model tracking the txid
# Looking at previous context, we might rely on metadata in FinancialEvent or a dedicated table.
# Let's assume we look for PENDING Rides or specific Payment records.

# Actually, the best place to look is 'payment_intents' or similar if it exists, 
# or look at Rides/FinancialEvents that are pending payment.

from app.modules.rides.models.ride import Ride

logger = logging.getLogger(__name__)

class ReconciliationService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.ride_payment_service = RidePaymentService(db)

from app.modules.finance.models.payment import Payment, PaymentStatus
from app.modules.rides.models.ride import Ride

    async def reconcile_lost_charges(self):
        """
        Find charges that are PENDING locally but PAID in Efí.
        This handles 'Lost Webhook' scenario.
        """
        # Find pending Pix payments created > 5 min ago
        timeout_threshold = datetime.now(timezone.utc) - timedelta(minutes=5)
        
        query = select(Payment).where(
             Payment.status == PaymentStatus.PENDING,
             Payment.payment_method == 'pix',
             Payment.created_at < timeout_threshold,
             Payment.pix_txid.is_not(None)
        ).limit(50)
        
        result = await self.db.execute(query)
        payments = result.scalars().all()
        
        count = 0
        for payment in payments:
            try:
                txid = payment.pix_txid
                
                # Check status at Efí
                status_info = efi_client.get_charge_status(txid)
                
                if status_info['paid']:
                    logger.info(f"Reconciling Payment {payment.id} (Ride {payment.ride_id}): Found PAID charge {txid}")
                    
                    # Update Payment Status
                    payment.status = PaymentStatus.COMPLETED
                    payment.paid_at = datetime.fromisoformat(status_info['paid_at'].replace('Z', '+00:00')) if status_info.get('paid_at') else datetime.now(timezone.utc)
                    await self.db.commit()
                    
                    # Need to trigger the Financial Events (Driver Earning, etc)
                    # Fetch Ride
                    ride_res = await self.db.execute(select(Ride).where(Ride.id == payment.ride_id))
                    ride = ride_res.scalars().first()
                    
                    if ride and ride.status == 'WAITING_PAYMENT':
                         # Trigger standard payment processing
                         # We need to ensure process_ride_payment doesn't try to create a NEW payment record if one exists?
                         # Or we just manually create the events here?
                         # Better to reuse service logic.
                         await self.ride_payment_service.process_ride_payment(ride, self.db)
                    
                    count += 1
                elif status_info['status'] == 'EXPIRADA': # Example status
                     # Mark as FAILED/EXPIRED?
                     pass
                    
            except Exception as e:
                logger.error(f"Error reconciling payment {payment.id}: {e}")
                
        return count
