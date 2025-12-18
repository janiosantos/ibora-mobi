from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.services.payment.efi_client import efi_client
from app.modules.finance.models.payment import Payment, PaymentStatus
from app.modules.rides.models.ride import Ride
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class PaymentService:
    """
    Orchestrate payment processing
    """
    
    @staticmethod
    async def create_pix_payment(ride: Ride, db: AsyncSession) -> Payment:
        """
        Create Pix payment for ride
        
        Args:
            ride: Completed ride
            db: Database session
        
        Returns:
            Payment record with QR code
        """
        
        # Check if payment already exists
        result = await db.execute(select(Payment).where(Payment.ride_id == ride.id))
        existing = result.scalars().first()
        
        if existing:
            if existing.status == PaymentStatus.COMPLETED.value:
                return existing
            
            # If expired, create new one
            # Note: PaymentStatus is Enum, use value for comparison if stored as string/enum in DB 
            # or ensure compatibility. Model uses SQLEnum(PaymentStatus).
            if existing.status != PaymentStatus.EXPIRED and existing.status != PaymentStatus.EXPIRED.value:
                # Check expiration time if strictly needed, but status logic suggests reuse
                logger.warning(f"Payment already exists for ride {ride.id}")
                return existing
        
        # Generate Pix charge
        try:
            # Need passenger ID from ride or fetch passenger if lazy loaded
            # Assuming ride.passenger_id is available
            
            pix_data = efi_client.create_immediate_charge(
                amount=float(ride.final_price),
                description=f"Corrida iBora #{ride.id}",
                expiration=1800,  # 30 minutes
                additional_info={
                    'ride_id': str(ride.id),
                    'passenger_id': str(ride.passenger_id)
                }
            )
        except Exception as e:
            logger.error(f"Failed to create Pix charge: {e}")
            raise
        
        # Create payment record
        expiration_time = datetime.utcnow() + timedelta(seconds=pix_data['expiration'])
        
        payment = Payment(
            ride_id=ride.id,
            passenger_id=ride.passenger_id,
            amount=float(ride.final_price),
            payment_method="pix",
            status=PaymentStatus.PENDING,
            pix_txid=pix_data['txid'],
            pix_qrcode_image=pix_data['qrcode_image'],
            pix_qrcode_text=pix_data['qrcode_text'],
            pix_expiration=expiration_time
        )
        
        db.add(payment)
        await db.commit()
        await db.refresh(payment)
        
        logger.info(
            f"Pix payment created: payment_id={payment.id}, "
            f"txid={payment.pix_txid}, amount=R${payment.amount}"
        )
        
        return payment
    
    @staticmethod
    async def check_payment_status(payment: Payment, db: AsyncSession) -> Payment:
        """
        Check payment status with Efí
        
        Updates payment record if status changed
        """
        if payment.status == PaymentStatus.COMPLETED:
            return payment  # Already paid
        
        if payment.payment_method != "pix":
            return payment  # Only for Pix
        
        try:
            status = efi_client.get_charge_status(payment.pix_txid)
            
            if status['paid']:
                # Mark as completed
                payment.status = PaymentStatus.COMPLETED
                if status.get('paid_at'):
                     # Basic conversion, improve robust ISO parsing if needed
                     # Efi might return '2025-01-01 10:00:00'. Isoformat usually safe.
                     # We'll trust it's parseable or leave as None/String if model supported string, 
                     # but model is DateTime. Let's try ISO.
                     try:
                        payment.paid_at = datetime.fromisoformat(status['paid_at'].replace(' ', 'T'))
                     except:
                        payment.paid_at = datetime.utcnow()

                payment.external_transaction_id = status.get('end_to_end_id') # Usually in 'pix' array
                
                await db.commit()
                await db.refresh(payment)
                
                logger.info(f"Payment completed: payment_id={payment.id}")
                
                # Trigger Settlement Release (Immediate for Pix)
                from app.services.settlement_service import SettlementService
                from app.modules.finance.models.settlement import Settlement
                from app.modules.finance.models.financial_event import FinancialEvent, EventType
                
                # Find Earning Event for this Ride
                stmt = select(FinancialEvent).where(
                    FinancialEvent.ride_id == payment.ride_id,
                    FinancialEvent.event_type == EventType.RIDE_EARNING
                )
                res_event = await db.execute(stmt)
                earning_event = res_event.scalars().first()
                
                if earning_event:
                     # Find Settlement
                     stmt_stl = select(Settlement).where(Settlement.financial_event_id == earning_event.id)
                     res_stl = await db.execute(stmt_stl)
                     settlement = res_stl.scalars().first()
                     
                     if settlement:
                         await SettlementService.release_settlement(settlement, db)
                         logger.info(f"Released settlement {settlement.id} for Pix payment {payment.id}")
                
                     # Notify Users (Passenger & Driver)
                     from app.core.websocket import manager
                     from app.services.notification_service import NotificationService
                     
                     # Notify Passenger (Payment Confirmed)
                     await manager.send_personal_message({
                         "type": "PAYMENT_CONFIRMED",
                         "ride_id": str(payment.ride_id),
                         "amount": payment.amount,
                         "status": "COMPLETED"
                     }, str(payment.passenger_id))
                     
                     await NotificationService(db).create_notification(
                        user_id=payment.passenger_id,
                        title="Payment Confirmed",
                        message=f"Pix payment of R${payment.amount:.2f} confirmed.",
                        type="PAYMENT"
                     )
                     
                     # Notify Driver (Funds Received)
                     if settlement: # or use earning_event.driver_id
                         await manager.send_personal_message({
                             "type": "FUNDS_RECEIVED",
                             "ride_id": str(payment.ride_id),
                             "amount": payment.amount, # or earning amount? let's show gross for now
                             "source": "Pix"
                         }, str(settlement.driver_id))
                         
                         await NotificationService(db).create_notification(
                            user_id=settlement.driver_id,
                            title="Funds Received",
                            message=f"Received payment for Ride {payment.ride_id}.",
                            type="FINANCE"
                         )
                else:
                    logger.warning(f"No earning event found for ride {payment.ride_id} during Pix confirmation. Financial events might be missing.")
        
        except Exception as e:
            logger.error(f"Error checking payment status: {e}")
        
        return payment

    @staticmethod
    async def process_efi_webhook(payload: dict, db: AsyncSession) -> int:
        """
        Process incoming Pix webhook notification
        
        Efí sends a JSON with a list of 'pix' objects for received payments.
        Payload example: {"pix": [{"txid": "...", "valor": "...", ...}]}
        
        Returns:
            Number of payments processed/updated
        """
        events = payload.get('pix', [])
        processed_count = 0
        
        if not events:
            # Could be a challenge/verification request from Efí (empty payload or different structure)
            # Just logging it.
            logger.info("Received empty or non-standard Pix webhook payload.")
            return 0
        
        for event in events:
            txid = event.get('txid')
            if not txid:
                continue
                
            # Find payment by txid
            result = await db.execute(select(Payment).where(Payment.pix_txid == txid))
            payment = result.scalars().first()
            
            if not payment:
                logger.warning(f"Webhook received for unknown txid: {txid}")
                continue
            
            # Use existing check_status logic to update state from API (Single Source of Truth)
            # This handles 'paid' status, timestamp parsing, and idempotency
            try:
                await PaymentService.check_payment_status(payment, db)
                processed_count += 1
                logger.info(f"Processed webhook for payment {payment.id} (txid={txid})")
            except Exception as e:
                logger.error(f"Failed to process webhook for txid {txid}: {e}")
                
        return processed_count
