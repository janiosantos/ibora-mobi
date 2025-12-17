from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select, desc
from app.modules.finance.models.financial_event import FinancialEvent, EventType, EventStatus
from datetime import datetime
import logging
from typing import Optional, Dict

logger = logging.getLogger(__name__)

class LedgerService:
    """
    Service for managing the append-only Financial Ledger.
    """
    
    @staticmethod
    async def create_event(
        db: AsyncSession,
        event_type: EventType,
        amount: float,
        description: str,
        passenger_id: Optional[str] = None,
        driver_id: Optional[str] = None,
        ride_id: Optional[str] = None,
        metadata: Optional[Dict] = None,
        external_transaction_id: Optional[str] = None
    ) -> FinancialEvent:
        """
        Records a new financial event (PENDING by default).
        """
        event = FinancialEvent(
            event_type=event_type,
            amount=amount,
            description=description,
            passenger_id=passenger_id,
            driver_id=driver_id,
            ride_id=ride_id,
            metadata_info=metadata,
            external_transaction_id=external_transaction_id,
            status=EventStatus.PENDING
        )
        db.add(event)
        await db.flush() # Generate ID but don't commit yet
        await db.refresh(event)
        logger.info(f"Created financial event {event.id}: {event_type} {amount}")
        return event

    @staticmethod
    async def complete_event(db: AsyncSession, event_id: int) -> FinancialEvent:
        """
        Marks an event as COMPLETED.
        """
        query = select(FinancialEvent).where(FinancialEvent.id == event_id)
        result = await db.execute(query)
        event = result.scalar_one_or_none()
        
        if not event:
            raise ValueError(f"Event {event_id} not found")
            
        if event.status != EventStatus.PENDING:
            raise ValueError(f"Event {event_id} cannot be completed (current status: {event.status})")
            
        event.status = EventStatus.COMPLETED
        event.completed_at = datetime.utcnow()
        await db.flush()
        await db.refresh(event)
        logger.info(f"Completed financial event {event.id}")
        return event
        
    @staticmethod
    async def fail_event(db: AsyncSession, event_id: int, reason: str) -> FinancialEvent:
        """
        Marks an event as FAILED.
        """
        query = select(FinancialEvent).where(FinancialEvent.id == event_id)
        result = await db.execute(query)
        event = result.scalar_one_or_none()
        
        if not event:
            raise ValueError(f"Event {event_id} not found")
            
        if event.status != EventStatus.PENDING:
             raise ValueError(f"Event {event_id} cannot be failed (current status: {event.status})")

        event.status = EventStatus.FAILED
        event.failed_at = datetime.utcnow()
        if not event.metadata_info:
            event.metadata_info = {}
        event.metadata_info["failure_reason"] = reason
        
        await db.flush()
        await db.refresh(event)
        logger.warning(f"Failed financial event {event.id}: {reason}")
        return event

    @staticmethod
    async def reverse_event(db: AsyncSession, original_event_id: int, reason: str) -> FinancialEvent:
        """
        Reverses a COMPLETED event by creating a new offsetting event.
        Returns the NEW reversal event.
        """
        query = select(FinancialEvent).where(FinancialEvent.id == original_event_id)
        result = await db.execute(query)
        original_event = result.scalar_one_or_none()
        
        if not original_event:
            raise ValueError(f"Event {original_event_id} not found")
            
        if original_event.status != EventStatus.COMPLETED:
            raise ValueError(f"Event {original_event_id} cannot be reversed (must be COMPLETED)")
            
        if original_event.reversed_by_event_id:
             raise ValueError(f"Event {original_event_id} is already reversed")

        # Create reversal event (opposite amount)
        reversal_event = FinancialEvent(
            event_type=EventType.REVERSAL,
            amount=-original_event.amount, # Invert sign
            description=f"Reversal of event {original_event.id}: {reason}",
            passenger_id=original_event.passenger_id,
            driver_id=original_event.driver_id,
            ride_id=original_event.ride_id,
            reverses_event_id=original_event.id,
            status=EventStatus.COMPLETED, # Reversals are usually immediate
            completed_at=datetime.utcnow(),
            metadata_info={"reason": reason}
        )
        db.add(reversal_event)
        await db.flush()
        await db.refresh(reversal_event)
        
        # Link original event to reversal
        original_event.reversed_by_event_id = reversal_event.id
        # original_event.status = EventStatus.REVERSED  <-- Don't change status, just link. Append-only.
        
        logger.info(f"Reversed event {original_event.id} with {reversal_event.id}")
        return reversal_event

    @staticmethod
    async def get_driver_balance(db: AsyncSession, driver_id: str) -> float:
        """
        Calculates driver balance by summing all COMPLETED events for this driver.
        """
        query = select(func.sum(FinancialEvent.amount)).where(
            FinancialEvent.driver_id == driver_id,
            FinancialEvent.status == EventStatus.COMPLETED
        )
        result = await db.execute(query)
        balance = result.scalar()
        return balance or 0.0

    @staticmethod
    async def get_passenger_balance(db: AsyncSession, passenger_id: str) -> float:
        """
        Calculates passenger balance (e.g. prepaid credits).
        """
        query = select(func.sum(FinancialEvent.amount)).where(
            FinancialEvent.passenger_id == passenger_id,
            FinancialEvent.status == EventStatus.COMPLETED
        )
        result = await db.execute(query)
        balance = result.scalar()
        return balance or 0.0
