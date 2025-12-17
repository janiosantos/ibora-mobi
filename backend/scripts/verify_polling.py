
import asyncio
from datetime import datetime, timedelta, timezone, date
import logging
from unittest.mock import MagicMock, patch
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal
from app.jobs.payment_checker import PaymentStatusChecker
from app.modules.finance.models.payment import Payment, PaymentStatus
from app.modules.rides.models.ride import Ride
from app.modules.auth.models.user import User
from app.modules.passengers.models.passenger import Passenger
from app.modules.drivers.models.driver import Driver
from app.core.config import settings
import uuid

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def verify_polling_logic():
    """
    Verify PaymentStatusChecker logic:
    1. Create Pending Payment
    2. Run Checker (mocking EfiClient to say 'COMPLETED')
    3. Assert Payment Status in DB is COMPLETED
    """
    logger.info("🚀 Starting Payment Polling Verification...")
    
    async with AsyncSessionLocal() as db:
        # 1. Setup Data
        uid = str(uuid.uuid4())[:8]
        user = User(email=f"poll_{uid}@test.com", password_hash="hash", phone=f"119{uid}", user_type="passenger")
        db.add(user)
        await db.flush()
        
        passenger = Passenger(user_id=user.id, full_name="Poll Tester", email=user.email, phone=user.phone)
        db.add(passenger)
        
        # Driver
        d_user = User(email=f"d_poll_{uid}@test.com", password_hash="hash", phone=f"118{uid}", user_type="driver")
        db.add(d_user)
        await db.flush()
        driver = Driver(user_id=d_user.id, full_name="Poll Driver", email=d_user.email, phone=d_user.phone, status="active", cpf=f"111{uid}", cnh_number=f"CNH{uid}", cnh_category="B", cnh_expiry_date=date(2030,1,1))
        db.add(driver)
        await db.flush()

        ride = Ride(
            passenger_id=passenger.id, driver_id=driver.id,
            origin_lat=0, origin_lon=0, origin_address="A", destination_lat=0, destination_lon=0, destination_address="B",
            distance_km=1, duration_min=1, estimated_price=10.0, final_price=10.0, status="COMPLETED",
            created_at=datetime.now(timezone.utc), completed_at=datetime.now(timezone.utc)
        )
        db.add(ride)
        await db.flush()
        
        # Create PENDING Payment (mock txid)
        payment = Payment(
            ride_id=ride.id,
            passenger_id=passenger.id,
            amount=10.0,
            status=PaymentStatus.PENDING,
            payment_method="pix",
            pix_txid=f"txid_poll_{uid}",
            pix_qrcode_text="qrcode",
            pix_expiration=datetime.now(timezone.utc) + timedelta(minutes=60)
        )
        db.add(payment)
        await db.commit()
        await db.refresh(payment)
        
        logger.info(f"✅ Created Pending Payment: {payment.id} (txid={payment.pix_txid})")
        
        # 2. Run Checker with Mock
        # We need to patch EfiClient.get_charge_status used by PaymentService
        
        with patch('app.services.payment.efi_client.EfiClient.get_charge_status') as mock_status:
            # Configure Mock to return COMPLETED
            mock_status.return_value = {
                'txid': payment.pix_txid,
                'status': 'CONCLUIDA',
                'paid': True,
                'amount': 10.00,
                'paid_at': '2025-01-01 12:00:00'
            }
            
            logger.info("🕵️ Running PaymentStatusChecker...")
            await PaymentStatusChecker.run()
            
            # 3. Verify
            await db.refresh(payment)
            logger.info(f"Updated Status: {payment.status}")
            
            if payment.status == PaymentStatus.COMPLETED:
                logger.info("✅ Payment updated to COMPLETED by Polling Job!")
            else:
                logger.error(f"❌ Payment status mismatch: {payment.status}")
                exit(1)

if __name__ == "__main__":
    asyncio.run(verify_polling_logic())
