from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.services.payment.payment_service import PaymentService
from app.api.deps import get_current_user
from app.modules.finance.models.payment import Payment, PaymentStatus
from app.modules.rides.models.ride import Ride
from app.modules.auth.models.user import User
from app.modules.passengers.models.passenger import Passenger
from typing import Any
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/rides/{ride_id}/payment/pix", status_code=status.HTTP_201_CREATED)
async def create_pix_payment(
    ride_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Generate Pix QR Code for ride payment
    """
    
    # Get ride
    # ride_id is UUID string in URL
    try:
        from uuid import UUID
        ride_uuid = UUID(ride_id)
    except ValueError:
        raise HTTPException(400, "Invalid ride ID format")

    result = await db.execute(select(Ride).where(Ride.id == ride_uuid))
    ride = result.scalars().first()
    
    if not ride:
        raise HTTPException(404, "Ride not found")
    
    # Verify passenger owns ride
    result = await db.execute(select(Passenger).where(Passenger.user_id == current_user.id))
    passenger = result.scalars().first()
    
    if not passenger:
        raise HTTPException(403, "Passenger profile not found")

    if str(ride.passenger_id) != str(passenger.id):
        raise HTTPException(403, "Not authorized to pay for this ride")
    
    # Verify ride is completed
    if ride.status != 'COMPLETED':
        # If it's already PAID, return info?
        if ride.status == 'PAID':
             raise HTTPException(400, "Ride already paid")
        raise HTTPException(400, f"Ride must be completed to pay (current status: {ride.status})")
    
    # Create payment
    try:
        payment = await PaymentService.create_pix_payment(ride, db)
    except Exception as e:
        logger.error(f"Payment creation error: {e}")
        raise HTTPException(500, f"Failed to create payment: {str(e)}")
    
    return {
        "payment_id": payment.id,
        "amount": payment.amount,
        "qrcode_image": payment.pix_qrcode_image,
        "qrcode_text": payment.pix_qrcode_text,
        "expires_at": payment.pix_expiration.isoformat() if payment.pix_expiration else None
    }

@router.get("/payments/{payment_id}/status")
async def get_payment_status(
    payment_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Check payment status
    """
    
    result = await db.execute(select(Payment).where(Payment.id == payment_id))
    payment = result.scalars().first()
    
    if not payment:
        raise HTTPException(404, "Payment not found")
    
    # Verify ownership (Passenger who made payment)
    result = await db.execute(select(Passenger).where(Passenger.user_id == current_user.id))
    passenger = result.scalars().first()
    
    if not passenger or str(payment.passenger_id) != str(passenger.id):
        raise HTTPException(403, "Not authorized to access this payment")
    
    # Check status (Live check)
    updated_payment = await PaymentService.check_payment_status(payment, db)
    
    return {
        "status": updated_payment.status.value if hasattr(updated_payment.status, 'value') else updated_payment.status,
        "paid": updated_payment.status == PaymentStatus.COMPLETED or updated_payment.status == 'completed',
        "paid_at": updated_payment.paid_at.isoformat() if updated_payment.paid_at else None
    }

@router.post("/payments/webhook/pix", include_in_schema=False)
async def pix_webhook_handler(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Webhook handler for Efí Pix notifications.
    URL to register in Efí: https://api.iboramobi.com/api/v1/payments/webhook/pix
    """
    try:
        payload = await request.json()
        logger.info(f"Received Webhook Payload: {payload}")
        
        updated_count = await PaymentService.process_efi_webhook(payload, db)
        
        return {"status": "ok", "processed": updated_count}
    except Exception as e:
        logger.error(f"Webhook processing error: {e}")
        return {"status": "error", "message": str(e)}

@router.post("/payments/webhook/mercadopago", include_in_schema=False)
async def mercadopago_webhook_handler(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Webhook handler for Mercado Pago notifications.
    """
    try:
        payload = await request.json()
        logger.info(f"Received MP Webhook: {payload}")
        
        from app.services.payment.mercadopago_service import MercadoPagoService
        await MercadoPagoService.process_webhook(payload, db)
        
        return {"status": "ok"}
    except Exception as e:
        logger.error(f"MP Webhook error: {e}")
        return {"status": "error", "message": str(e)}
