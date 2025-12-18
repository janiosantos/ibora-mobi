from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from datetime import datetime
from uuid import UUID
from typing import List, Optional

from app.modules.notifications.models.notification import Notification

class NotificationService:
    def __init__(self, db: AsyncSession):
        self.db = db
        
    async def create_notification(self, user_id: UUID, title: str, message: str, type: str = "INFO") -> Notification:
        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=type
        )
        self.db.add(notification)
        await self.db.commit()
        await self.db.refresh(notification)
        return notification
        
    async def get_user_notifications(self, user_id: UUID, limit: int = 50, skip: int = 0) -> List[Notification]:
        query = (
            select(Notification)
            .where(Notification.user_id == user_id)
            .order_by(desc(Notification.created_at))
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(query)
        return result.scalars().all()
        
    async def mark_as_read(self, notification_id: UUID, user_id: UUID) -> Optional[Notification]:
        query = select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == user_id
        )
        result = await self.db.execute(query)
        notification = result.scalars().first()
        
        if notification and not notification.read:
            notification.read = True
            notification.read_at = datetime.utcnow()
            self.db.add(notification)
            await self.db.commit()
            await self.db.refresh(notification)
            
        return notification
        
    async def mark_all_as_read(self, user_id: UUID) -> int:
        # Note: In asyncpg/sqlalchemy update many statements might need separate execution or specific syntax
        # But iterating is simple for MVP or using update statement
        from sqlalchemy import update
        
        stmt = (
            update(Notification)
            .where(Notification.user_id == user_id, Notification.read == False)
            .values(read=True, read_at=datetime.utcnow())
        )
        result = await self.db.execute(stmt)
        await self.db.commit()
        return result.rowcount
