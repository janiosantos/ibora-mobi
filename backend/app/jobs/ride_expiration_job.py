import logging
from datetime import datetime, timedelta
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal
from app.modules.rides.models.ride import Ride
from app.services.ride_state_machine import RideStateMachine, RideStatus
from app.core.websocket import manager
from app.services.notification_service import NotificationService

logger = logging.getLogger(__name__)

class RideExpirationJob:
    @staticmethod
    async def run():
        """
        Periodically checks for rides that have been in REQUESTED state for too long.
        """
        async with AsyncSessionLocal() as db:
            await RideExpirationJob._check_expired_rides(db)

    @staticmethod
    async def _check_expired_rides(db: AsyncSession):
        # Config: Timeout in minutes (e.g., 5 minutes)
        TIMEOUT_MINUTES = 5
        cutoff_time = datetime.utcnow() - timedelta(minutes=TIMEOUT_MINUTES)
        
        # Query rides that are REQUESTED and older than cutoff
        stmt = select(Ride).where(
            Ride.status == RideStatus.REQUESTED,
            Ride.created_at < cutoff_time
        )
        
        result = await db.execute(stmt)
        expired_rides = result.scalars().all()
        
        if not expired_rides:
            return

        logger.info(f"Found {len(expired_rides)} expired rides to cancel.")

        for ride in expired_rides:
            try:
                logger.info(f"Expiring ride {ride.id} (created at {ride.created_at})")
                
                # Transition to CANCELLED
                RideStateMachine.transition(ride, RideStatus.CANCELLED)
                ride.cancelled_at = datetime.utcnow()
                
                # Notify Passenger
                await RideExpirationJob._notify_passenger(ride, db)
                
            except Exception as e:
                logger.error(f"Failed to expire ride {ride.id}: {e}")
                
        await db.commit()

    @staticmethod
    async def _notify_passenger(ride: Ride, db: AsyncSession):
        from app.modules.passengers.models.passenger import Passenger
        
        # Load passenger user_id
        # We need the user_id to send WebSocket message
        stmt = select(Passenger).where(Passenger.id == ride.passenger_id)
        res = await db.execute(stmt)
        passenger = res.scalars().first()
        
        if passenger:
            # WebSocket Notification
            await manager.send_personal_message({
                "type": "RIDE_CANCELLED",
                "ride_id": str(ride.id),
                "reason": "timeout",
                "message": "Nenhum motorista encontrado. Tente novamente."
            }, str(passenger.user_id))
            
            # Persistent Notification
            await NotificationService(db).create_notification(
                user_id=passenger.user_id,
                title="Corrida Cancelada",
                message="Não encontramos motoristas disponíveis na sua região. Tente novamente mais tarde.",
                type="RIDE_CANCELLED"
            )
