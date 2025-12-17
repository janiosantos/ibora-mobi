from sqlalchemy.ext.asyncio import AsyncSession
from app.services.ledger import LedgerService
from app.modules.finance.models.financial_event import EventType, EventStatus
from app.modules.rides.models.ride import Ride
from app.services.pricing_service import PricingService
import logging
from decimal import Decimal

logger = logging.getLogger(__name__)

class RidePaymentService:
    """
    Handle financial events for ride completion
    
    Creates 3 events:
    1. Passenger payment (debit)
    2. Driver earning (credit)
    3. Platform commission (credit to platform)
    """
    
    @staticmethod
    async def process_ride_payment(ride: Ride, db: AsyncSession) -> dict:
        """
        Process payment for completed ride
        
        Creates financial events:
        - RIDE_PAYMENT (passenger pays)
        - RIDE_EARNING (driver earns)
        - PLATFORM_COMMISSION (platform takes cut)
        
        Args:
            ride: Completed ride
            db: Database session
        
        Returns:
            {
                "payment_event_id": int,
                "earning_event_id": int,
                "commission_event_id": int,
                "total_paid": float,
                "driver_earning": float,
                "platform_commission": float
            }
        """
        
        # Validation
        if ride.status != 'COMPLETED':
             # Allow for flexible status checks if needed, but strict for now
             if ride.status not in ['COMPLETED']:
                raise ValueError(f"Ride must be COMPLETED, current status: {ride.status}")
        
        if not ride.final_price:
            raise ValueError("Ride has no final_price")
        
        if not ride.driver_id:
            raise ValueError("Ride has no driver assigned")
        
        # Calculate values using PricingService
        # PricingService returns Decimal, need to match FinancialEvent Float (or keep consistency)
        # We will cast to float for FinancialEvent as it expects Float in strict typing usually, 
        # though SQLAlchemy might handle Decimal to Float. Let's be explicit.
        
        total_price_decimal = ride.final_price
        driver_earning_decimal = PricingService.calculate_driver_earnings(total_price_decimal)
        commission_decimal = total_price_decimal - driver_earning_decimal
        
        total_price_float = float(total_price_decimal)
        driver_earning_float = float(driver_earning_decimal)
        commission_float = float(commission_decimal)
        
        # Create events
        
        # 1. Passenger payment (debit)
        # Note: Amount is negative for debit in Ledger
        payment_event = await LedgerService.create_event(
            db=db,
            event_type=EventType.RIDE_PAYMENT,
            amount=-total_price_float, 
            passenger_id=ride.passenger_id,
            ride_id=ride.id,
            description=f"Payment for ride {ride.id}",
            metadata={
                "origin": ride.origin_address,
                "destination": ride.destination_address,
                "payment_method": ride.payment_method
            }
        )
        # Note: We don't set status here, create_event defaults to PENDING which is correct.
        
        # 2. Driver earning (credit)
        earning_event = await LedgerService.create_event(
            db=db,
            event_type=EventType.RIDE_EARNING,
            amount=driver_earning_float,
            driver_id=ride.driver_id,
            ride_id=ride.id,
            description=f"Earning from ride {ride.id}",
            metadata={
                "gross_amount": total_price_float,
                "commission_amount": commission_float
            }
        )
        
        # Mark as COMPLETED for now (assuming successful payment scenario)
        # In real world, this would happen after Payment confirmation Webhook.
        # But for MVP Ride Flow, we finalize here.
        earning_event.status = EventStatus.COMPLETED
        db.add(earning_event)
        # Flush to ensure ID and status are available
        await db.flush() 
        
        # Create Settlement Hold (D+N)
        from app.services.settlement_service import SettlementService
        await SettlementService.create_settlement_for_event(earning_event, db)
        
        # 3. Platform commission (credit to platform)
        # No specific "platform_id", so we associate with the ride/driver for tracking
        commission_event = await LedgerService.create_event(
            db=db,
            event_type=EventType.PLATFORM_COMMISSION,
            amount=commission_float,
            driver_id=ride.driver_id, # Track which driver generated this commission
            ride_id=ride.id,
            description=f"Commission from ride {ride.id}",
            metadata={
                "gross_amount": total_price_float,
                "driver_earning": driver_earning_float
            }
        )
        commission_event.status = EventStatus.COMPLETED
        db.add(commission_event)
        
        logger.info(
            f"Ride payment events created: ride={ride.id} "
            f"events=[{payment_event.id}, {earning_event.id}, {commission_event.id}]"
        )
        
        return {
            "payment_event_id": payment_event.id,
            "earning_event_id": earning_event.id,
            "commission_event_id": commission_event.id,
            "total_paid": total_price_float,
            "driver_earning": driver_earning_float,
            "platform_commission": commission_float
        }
