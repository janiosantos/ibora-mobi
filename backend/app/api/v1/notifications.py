from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.core import database
from app.api import deps
from app.modules.auth.models.user import User
from app.schemas import notification as notification_schema
from app.services.notification_service import NotificationService

router = APIRouter()

@router.get("/", response_model=List[notification_schema.Notification])
async def list_notifications(
    db: AsyncSession = Depends(database.get_db),
    current_user: User = Depends(deps.get_current_user),
    skip: int = 0,
    limit: int = 50
) -> Any:
    """
    List notifications for current user.
    """
    service = NotificationService(db)
    return await service.get_user_notifications(current_user.id, limit=limit, skip=skip)

@router.post("/{notification_id}/read", response_model=notification_schema.Notification)
async def mark_notification_read(
    notification_id: str,
    db: AsyncSession = Depends(database.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Mark specific notification as read.
    """
    try:
        uuid_id = UUID(notification_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid ID")

    service = NotificationService(db)
    notification = await service.mark_as_read(uuid_id, current_user.id)
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    return notification

@router.post("/read-all", response_model=dict)
async def mark_all_read(
    db: AsyncSession = Depends(database.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Mark all notifications as read.
    """
    service = NotificationService(db)
    count = await service.mark_all_as_read(current_user.id)
    return {"status": "success", "updated": count}
