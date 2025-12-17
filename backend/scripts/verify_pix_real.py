import asyncio
from datetime import datetime, timezone, date
import logging
import os
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal
from app.services.payment.payment_service import PaymentService
from app.modules.finance.models.payment import Payment, PaymentStatus
from app.modules.rides.models.ride import Ride
from app.modules.drivers.models.driver import Driver
from app.modules.passengers.models.passenger import Passenger
from app.modules.auth.models.user import User
from app.core.config import settings
import uuid

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def verify_pix_flow_real():
    """
    Verify Pix Payment Flow with REAL Efí Homologation.
    """
    logger.info("🚀 Starting REAL Pix Payment Verification (Homologation)...")

    async with AsyncSessionLocal() as db:
        # 1. Create Data
        passenger_id = int(uuid.uuid4().int >> 64) # Use int ID for this project schema if needed, but schema says Integer? 
        # Actually standard schema usually uses Integer with autoincrement, let's let DB handle IDs if possible or use random ints.
        # But wait, IDs are Integers. Let's act like we are creating new users.
        
        # Helper to create unique email/phone
        uid = str(uuid.uuid4())[:8]
        
        # Passenger
        p_user = User(
            email=f"p_{uid}@test.com", password_hash="hash", phone=f"119{uid}", user_type="passenger"
        )
        db.add(p_user)
        await db.flush()
        
        passenger = Passenger(user_id=p_user.id, full_name="Test Passenger", email=p_user.email, phone=p_user.phone)
        db.add(passenger)
        await db.flush()
        
        # Driver
        d_user = User(
            email=f"d_{uid}@test.com", password_hash="hash", phone=f"118{uid}", user_type="driver"
        )
        db.add(d_user)
        await db.flush()

        driver = Driver(
            user_id=d_user.id, full_name="Test Driver", email=d_user.email, phone=d_user.phone,
            cpf=f"123{uid}00", cnh_number=f"CNH{uid}", cnh_category="B", cnh_expiry_date=date(2030,1,1),
            status="active"
        )
        db.add(driver)
        await db.flush()
        
        # Ride
        ride = Ride(
            passenger_id=passenger.id,
            driver_id=driver.id,
            origin_lat=-23.55, origin_lon=-46.63, origin_address="Origin",
            destination_lat=-23.56, destination_lon=-46.64, destination_address="Dest",
            distance_km=5.0, duration_min=15,
            # HOMOLOGATION VALUE: 5.00 triggers a return (devolução) webhook scenario but is successfully created.
            # HOMOLOGATION VALUE: 1.00 is a normal success.
            # Let's use 1.00 to verify SUCCESS flow suitable for automated check.
            estimated_price=1.00, 
            final_price=1.00,
            status="COMPLETED",
            created_at=datetime.now(timezone.utc),
            completed_at=datetime.now(timezone.utc)
        )
        db.add(ride)
        await db.commit()
        await db.refresh(ride)
        
        logger.info(f"✅ Created Ride {ride.id} with price R$ {ride.final_price}")
        
        # 2. Create Pix Charge (Real Call)
        logger.info("💳 Calling Efí API to create Pix Charge...")
        try:
            payment = await PaymentService.create_pix_payment(ride, db)
            logger.info(f"✅ Payment Created! TXID: {payment.pix_txid}")
            logger.info(f"QR Code: {payment.pix_qrcode_text}")
            
            # 3. Check Status
            logger.info("🔄 Checking Status (Should be PENDING initially)...")
            await PaymentService.check_payment_status(payment, db)
            logger.info(f"Current Status: {payment.status}")
            
            if payment.status == PaymentStatus.PENDING:
                logger.info("✅ Status is PENDING as expected (since we haven't paid).")
            
            logger.info("⚠️ To fully verify COMPLETED, you must pay the QR Code in the Homologation Environment or wait for webhook simulation.")
            
        except Exception as e:
            logger.error(f"❌ Failed to create Pix: {e}")
            raise

if __name__ == "__main__":
    asyncio.run(verify_pix_flow_real())
