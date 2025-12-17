from fastapi import APIRouter, Depends, HTTPException
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession
from decimal import Decimal
from uuid import UUID

from app.core import database
from app.services.payment_service import PaymentService
from pydantic import BaseModel

router = APIRouter()

class WebhookMock(BaseModel):
    user_id: UUID
    amount: float
    txid: str = "mock-txid"

@router.post("/webhook/mock", status_code=200)
async def mock_payment_webhook(
    webhook_in: WebhookMock,
    db: AsyncSession = Depends(database.get_db),
) -> Any:
    """
    Mock Webhook to simulate PIX payment confirmation.
    """
    payment_service = PaymentService(db)
    result = await payment_service.process_payment_webhook(
        txid=webhook_in.txid,
        amount=Decimal(str(webhook_in.amount)),
        user_id=webhook_in.user_id
    )
    return result
