import asyncio
from datetime import datetime, timezone
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal
from app.services.payment.payment_service import PaymentService
from app.modules.finance.models.payment import Payment, PaymentStatus
from app.modules.rides.models.ride import Ride
from app.modules.drivers.models.driver import Driver
from app.modules.passengers.models.passenger import Passenger
from app.modules.auth.models.user import User
from app.core.config import settings
from unittest.mock import MagicMock, patch

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def verify_pix_flow():
    """
    Verify Pix Payment Flow
    1. Setup Ride (Completed)
    2. Create Pix Payment
    3. Verify Payment Record
    4. Mock Payment Payment at Efi
    5. Check Status
    """
    
    # Mock settings and EfiClient for the test
    # We need to patch EfiClient used in PaymentService
    
    with patch('app.services.payment.efi_client.EfiClient') as MockEfiClient:
        # Check if PaymentService uses the instance 'efi_client'
        # It does: from app.services.payment.efi_client import efi_client
        # We need to patch that specific instance
        
        async with AsyncSessionLocal() as db:
             with patch('app.services.payment.payment_service.efi_client') as mock_client:
                # Setup Mock Responses
                mock_client.create_immediate_charge.return_value = {
                    'txid': 'test_txid_pix_123',
                    'location': 'pix.example.com',
                    'qrcode_image': 'base64...',
                    'qrcode_text': '000201...',
                    'expiration': 3600,
                    'amount': 50.00
                }
                
                mock_client.get_charge_status.return_value = {
                    'txid': 'test_txid_pix_123',
                    'status': 'CONCLUIDA',
                    'paid': True,
                    'amount': 50.00,
                    'paid_at': '2025-01-01 10:00:00'
                }

                logger.info("🚀 Starting Pix Payment Verification...")
                
                # 1. get a ride (or create one)
                # For simplicity, let's look for a completed ride or create a dummy one
                from uuid import uuid4
                
                passenger_id = uuid4()
                driver_id = uuid4()
                ride_id = uuid4()
                
                # Create dummy entities if needed, but for PaymentService we mainly need ride object 
                # passing foreign keys might fail if we don't insert passenger/driver.
                # Let's insert real dummy records.
                
                # User/Passenger
                user = User(
                    email=f"test_pix_{uuid4()}@example.com", 
                    password_hash="hash", 
                    phone=f"119{str(uuid4().int)[:8]}", # Unique phone
                    user_type="passenger"
                )
                db.add(user)
                await db.flush()
                
                passenger = Passenger(
                    id=passenger_id, 
                    user_id=user.id,
                    full_name="Pix Tester",
                    email=user.email,
                    phone=user.phone
                )
                db.add(passenger)
                
                # Driver
                driver_user = User(
                    email=f"driver_pix_{uuid4()}@example.com",
                    password_hash="hash",
                    phone=f"118{str(uuid4().int)[:8]}", # Unique phone
                    user_type="driver"
                )
                db.add(driver_user)
                await db.flush()
                
                from datetime import date
                driver = Driver(
                    id=driver_id, 
                    user_id=driver_user.id, 
                    full_name="Driver Pix",
                    email=driver_user.email,
                    phone=driver_user.phone,
                    cpf=f"111222333{str(uuid4().int)[:2]}", 
                    cnh_number=f"CNH{str(uuid4().int)[:8]}",
                    cnh_category="B",
                    cnh_expiry_date=date(2030, 1, 1),
                    status="active",
                    approval_status="approved"
                )
                db.add(driver)
                
                # Ride
                ride = Ride(
                    id=ride_id,
                    passenger_id=passenger_id,
                    driver_id=driver_id,
                    origin_lat=-23.550520,
                    origin_lon=-46.633308,
                    origin_address="Praça da Sé, São Paulo - SP",
                    destination_lat=-23.550520,
                    destination_lon=-46.633308,
                    destination_address="Av. Paulista, São Paulo - SP",
                    distance_km=10.0,
                    duration_min=20,
                    estimated_price=50.00,
                    final_price=50.00,
                    status="COMPLETED",
                    created_at=datetime.now(timezone.utc),
                    completed_at=datetime.now(timezone.utc)
                )
                db.add(ride)
                await db.commit()
                
                logger.info(f"✅ Created Mock Ride: {ride_id}")
                
                # 2. Create Pix Payment
                logger.info("💳 Creating Pix Payment...")
                payment = await PaymentService.create_pix_payment(ride, db)
                
                assert payment.status == PaymentStatus.PENDING
                assert payment.pix_txid == 'test_txid_pix_123'
                assert payment.amount == 50.00
                logger.info("✅ Payment Created Successfully (PENDING)")
                
                # 3. Check Status (Simulate paying)
                logger.info("🔄 Checking Payment Status (Simulating Payment)...")
                updated_payment = await PaymentService.check_payment_status(payment, db)
                
                assert updated_payment.status == PaymentStatus.COMPLETED
                logger.info("✅ Payment Status Updated to COMPLETED")
                
                # Cleanup (Optional)
                # await db.delete(payment)
                # await db.delete(ride)
                # ...
                
                logger.info("🎉 Pix Payment Flow VERIFIED!")

if __name__ == "__main__":
    asyncio.run(verify_pix_flow())
