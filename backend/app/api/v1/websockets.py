from typing import Annotated
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query, status
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.websocket import manager
from app.core.config import settings
from app.core import security, database
from app.modules.auth.models.user import User

router = APIRouter()

async def get_current_user_ws(
    token: Annotated[str, Query()],
    db: AsyncSession = Depends(database.get_db)
) -> User:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[security.ALGORITHM])
        token_data = payload.get("sub")
        if token_data is None:
            raise WebSocketDisconnect(code=status.WS_1008_POLICY_VIOLATION)
    except (JWTError, ValueError):
        raise WebSocketDisconnect(code=status.WS_1008_POLICY_VIOLATION)
        
    result = await db.execute(select(User).where(User.id == token_data))
    user = result.scalars().first()
    if not user:
        raise WebSocketDisconnect(code=status.WS_1008_POLICY_VIOLATION)
    return user

@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    role: str = Query("passenger"),
    current_user: User = Depends(get_current_user_ws)
):
    await manager.connect(websocket, str(current_user.id), role)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo logic or command logic here
            # For now, just keep connection alive and maybe echo
            await manager.send_personal_message({"message": "Server received: " + data}, str(current_user.id))
    except WebSocketDisconnect:
        manager.disconnect(websocket, str(current_user.id))
