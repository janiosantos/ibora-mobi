import asyncio
import sys
import os
import logging
from decimal import Decimal
from datetime import datetime
from uuid import uuid4

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '../'))

from app.core.database import AsyncSessionLocal
from app.api.v1.rides import confirm_cash_payment
from app.modules.auth.models.user import User
from app.modules.drivers.models.driver import Driver
from app.modules.rides.models.ride import Ride
from app.modules.finance.models.wallet import DriverWallet
from app.modules.finance.models.payment import Payment
from app.modules.finance.models.settlement import Settlement, SettlementStatus
from sqlalchemy import select, delete

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def main():
    logger.info("Starting Cash Payment Verification...")
    
    async with AsyncSessionLocal() as db:
        try:
            # 1. Setup Data
            # Generate Random Phones
            driver_phone = f"119{uuid4().int % 100000000:08d}"
            passenger_phone = f"119{uuid4().int % 100000000:08d}"

            # Create User (Driver)
            driver_user = User(
                id=uuid4(),
                email=f"driver_cash_{uuid4().hex[:6]}@test.com",
                phone=driver_phone,
                password_hash="hash",
                user_type="driver"
            )
            db.add(driver_user)
            
            # Create Driver Profile
            driver = Driver(
                id=uuid4(),
                user_id=driver_user.id,
                full_name="Driver Cash Test",
                cpf=f"123{uuid4().hex[:8]}", # Mock CPF
                phone=driver_phone,
                email=driver_user.email,
                cnh_number=f"CNH{uuid4().hex[:8]}",
                cnh_category="B",
                cnh_expiry_date=datetime.now().date()
            )
            db.add(driver)
            
            # Create Wallet for Driver
            wallet = DriverWallet(
                driver_id=driver.id,
                total_balance=0.0,
                available_balance=0.0,
                held_balance=0.0
            )
            db.add(wallet)

            # Create User (Passenger)
            passenger_user = User(
                id=uuid4(),
                email=f"passenger_{uuid4().hex[:6]}@test.com",
                phone=passenger_phone,
                password_hash="hash",
                user_type="passenger"
            )
            db.add(passenger_user)

            # Create Passenger Profile
            from app.modules.passengers.models.passenger import Passenger
            passenger = Passenger(
                id=uuid4(),
                user_id=passenger_user.id,
                full_name="Passenger Test",
                phone=passenger_phone,
                email=passenger_user.email
            )
            db.add(passenger)
            
            # Create Ride (Completed, Cash)
            ride = Ride(
                id=uuid4(),
                passenger_id=passenger.id, 
                driver_id=driver.id,
                origin_lat=-23.55,
                origin_lon=-46.63,
                origin_address="Origin",
                destination_lat=-23.56,
                destination_lon=-46.64,
                destination_address="Dest",
                status="COMPLETED",
                payment_method="cash",
                final_price=Decimal("50.00"),
                estimated_price=Decimal("50.00"),
                distance_km=10.0
            )
            db.add(ride)
            
            await db.commit()
            
            logger.info(f"Created Ride {ride.id} with price 50.00 (Cash)")
            
            # 2. Call Endpoint Logic directly (mocking dependencies)
            # We call the function confirm_cash_payment directly essentially
            # ideally we'd use httpx to call API, but calling function is faster for integration unit test
            
            logger.info("Calling confirm_cash_payment...")
            
            response = await confirm_cash_payment(
                ride_id=str(ride.id),
                db=db,
                current_user=driver_user
            )
            
            logger.info(f"Response: {response}")
            
            # 3. Verify
            # Payment Created
            res = await db.execute(select(Payment).where(Payment.ride_id == ride.id))
            payment = res.scalars().first()
            assert payment is not None
            logger.info(f"Payment Status: {payment.status} (Type: {type(payment.status)})")
            
            from app.modules.finance.models.payment import PaymentStatus
            if isinstance(payment.status, PaymentStatus):
                assert payment.status == PaymentStatus.COMPLETED
            else:
                assert payment.status == "COMPLETED"
                
            logger.info("✅ Payment record verified")
            
            # Settlement Released
            res = await db.execute(select(Settlement).where(Settlement.financial_event_id == payment.earning_event_id))
            settlement = res.scalars().first()
            assert settlement is not None
            assert settlement.status == SettlementStatus.COMPLETED
            logger.info(f"✅ Settlement status: {settlement.status} (Expected COMPLETED)")
            
            # Wallet Balance
            # Driver gets 80% of 50.00 (Standard) = 40.00
            # Wallet should have 40.00 in AVAILABLE (balance)
            
            await db.refresh(wallet)
            logger.info(f"Wallet Balance: {wallet.available_balance} (Total: {wallet.total_balance})")
            
            assert float(wallet.available_balance) == 40.00
            logger.info("✅ Wallet balance verified (40.00)")
            
        except Exception as e:
            logger.error(f"❌ Test Failed: {e}")
            import traceback
            traceback.print_exc()
            raise e
        finally:
            # Cleanup
            # await db.execute(delete(Ride).where(Ride.id == ride.id))
            # await db.execute(delete(Driver).where(Driver.id == driver.id))
            # await db.execute(delete(User).where(User.id == driver_user.id))
            # await db.commit()
            pass

if __name__ == "__main__":
    asyncio.run(main())
