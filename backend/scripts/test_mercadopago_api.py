
import asyncio
import logging
import sys
import os
import httpx
from unittest.mock import MagicMock
from datetime import datetime, date, timedelta
from uuid import uuid4
from fastapi.testclient import TestClient

# Setup Path
sys.path.append(os.getcwd())

# Logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Mock Environment
os.environ["MERCADOPAGO_ACCESS_TOKEN"] = "TEST_TOKEN"
os.environ["MERCADOPAGO_PUBLIC_KEY"] = "TEST_KEY"

# Imports
from app.main import app
from app.core.database import AsyncSessionLocal
from app.core.security import create_access_token
from app.services.payment.mercadopago_client import mercadopago_client
from app.modules.auth.models.user import User
from app.modules.drivers.models.driver import Driver
from app.modules.passengers.models.passenger import Passenger
from app.modules.rides.models.ride import Ride
from app.modules.finance.models.payment import Payment, PaymentStatus

async def test_mercadopago_api():
    logger.info("🚀 Starting MP API Verification (End-to-End)...")
    
    # 1. Mock External MP API
    # We must mock the client methods because we can't make real calls without credential
    mercadopago_client.create_customer = MagicMock(return_value={"id": f"cust_{uuid4()}"})
    mercadopago_client.save_card = MagicMock(return_value={
        "id": f"card_{uuid4()}",
        "first_six_digits": "123456",
        "last_four_digits": "7890",
        "expiration_month": 12,
        "expiration_year": 2030,
        "payment_method": {"id": "visa", "name": "Visa"}
    })
    # Mock create_payment to return pending status initially
    mp_payment_id = str(int(uuid4().int % 100000000))
    mercadopago_client.create_payment = MagicMock(return_value={
        "id": mp_payment_id,
        "status": "in_process", 
        "status_detail": "pending_review"
    })
    
    mercadopago_client.get_payment = MagicMock(return_value={
        "id": mp_payment_id,
        "status": "approved", # Confirmed status for webhook
        "external_reference": "" # Will be filled later
    })
    
    async with AsyncSessionLocal() as db:
        try:
            # 2. Setup Data (Direct DB for dependencies)
            
            # Create Passenger User & Profile
            pass_email = f"passenger_api_{uuid4()}@test.com"
            pass_user = User(
                email=pass_email,
                password_hash="hash",
                phone=f"999{uuid4().int % 100000}",
                user_type="passenger"
            )
            db.add(pass_user)
            await db.flush()
            
            passenger = Passenger(
                user_id=pass_user.id,
                full_name="API Passenger",
                cpf=str(uuid4().int)[:11],
                phone=pass_user.phone,
                email=pass_user.email
            )
            db.add(passenger)
            await db.flush()
            
            # Create Driver User & Profile
            driver_email = f"driver_api_{uuid4()}@test.com"
            driver_user = User(
                email=driver_email,
                password_hash="hash",
                phone=f"888{uuid4().int % 100000}",
                user_type="driver"
            )
            db.add(driver_user)
            await db.flush()
            
            driver = Driver(
                user_id=driver_user.id,
                full_name="API Driver",
                cpf=str(uuid4().int)[:11],
                phone=driver_user.phone,
                email=driver_user.email,
                cnh_number=str(uuid4().int)[:10],
                cnh_category="B",
                cnh_expiry_date=date(2030,1,1)
            )
            db.add(driver) 
            await db.flush()
            
            # Create Access Token for Passenger
            access_token = create_access_token(str(pass_user.id))
            headers = {"Authorization": f"Bearer {access_token}"}
            
            await db.commit() # Commit to make data available to API (if using separate session)
            # Actually, TestClient/AsyncClient might use separate connection if not careful.
            # But since we use same database URL, it should be fine.
            
            async with httpx.AsyncClient(app=app, base_url="http://test") as client:
                
                # 3. Add Payment Method (POST /api/v1/payment-methods)
                logger.info("3. Adding Payment Method via API...")
                pm_response = await client.post(
                    "/api/v1/payment-methods",
                    headers=headers,
                    json={
                        "card_token": "tok_test_123", # Frontend token
                        "provider": "mercadopago"
                    }
                )
                
                if pm_response.status_code not in (200, 201):
                    logger.error(f"Failed to add PM: {pm_response.text}")
                    raise Exception("API Add PM Failed")
                
                pm_data = pm_response.json()
                logger.info(f"Ref API PM: {pm_data}")
                
                # 4. Create Ride (Direct DB for speed, or API if needed)
                # Let's create via DB to skip matching logic complexity
                ride_id = uuid4()
                # Update mock for webhook verification
                mercadopago_client.get_payment.return_value["external_reference"] = str(ride_id)
                
                ride = Ride(
                    id=ride_id,
                    passenger_id=passenger.id,
                    driver_id=driver.id,
                    final_price=15.50,
                    status="IN_PROGRESS", # To be finished
                    created_at=datetime.utcnow(),
                    origin_lat=-23.550520,
                    origin_lon=-46.633308,
                    origin_address="Origin",
                    destination_lat=-23.550520,
                    destination_lon=-46.633308,
                    destination_address="Destination",
                    distance_km=5.0,
                    estimated_price=15.50,
                    duration_min=15,
                    route_polyline="encoded_polyline",
                    payment_method="credit_card" # Default
                )
                db.add(ride)
                await db.commit()
                
                # 5. Finish Ride (POST /api/v1/rides/{id}/finish)
                logger.info("5. Finishing Ride via API (Triggering Payment)...")
                
                # We need to act as Driver? `finish_ride` usually requires driver auth or being the driver?
                # Let's check permissions. Assume we can impersonate driver.
                driver_token = create_access_token(str(driver_user.id))
                driver_headers = {"Authorization": f"Bearer {driver_token}"}
                
                finish_response = await client.post(
                    f"/api/v1/rides/{str(ride_id)}/finish",
                    headers=driver_headers
                )
                
                if finish_response.status_code != 200:
                    logger.error(f"Failed to finish ride: {finish_response.text}")
                    raise Exception("API Finish Ride Failed")
                
                finish_data = finish_response.json()
                logger.info(f"Finish Response: {finish_data}")
                
                # Verify Payment is PENDING (since we mocked status=in_process)
                # We need to check DB or response
                
                # 6. Simulate Webhook (POST /api/v1/payments/webhook/mercadopago)
                logger.info("6. Simulating Webhook via API...")
                webhook_response = await client.post(
                    "/api/v1/payments/webhook/mercadopago",
                    json={
                        "action": "payment.updated",
                        "data": {"id": mp_payment_id}, 
                        "type": "payment"
                    }
                )
                
                if webhook_response.status_code != 200:
                     logger.error(f"Webhook Failed: {webhook_response.text}")
                     raise Exception("API Webhook Failed")
                     
                logger.info("✅ Webhook Received OK")
                
                # 7. Verify Final State
                # Check DB for payment status
                from sqlalchemy import text
                result = await db.execute(text(f"SELECT status FROM payments WHERE external_transaction_id = '{mp_payment_id}'"))
                # status_row = result.fetchone() # Asyncpg might differ
                # Use ORM refresh logic if possible, but we need new session context or refresh
                # Just quick select
            
            # Need strict verification
            from sqlalchemy import select
            q = select(Payment).where(Payment.external_transaction_id == mp_payment_id)
            res = await db.execute(q)
            final_payment = res.scalars().first()
            
            if not final_payment:
                raise Exception("Payment record not found")
                
            logger.info(f"Final Payment Status: {final_payment.status}")
            
            if final_payment.status != PaymentStatus.COMPLETED:
                raise Exception(f"Expected COMPLETED, got {final_payment.status}")

            # Cleanup
            # Delete dependencies first
            from sqlalchemy import text
            await db.execute(text(f"DELETE FROM settlements WHERE financial_event_id IN (SELECT id FROM financial_events WHERE ride_id = '{ride_id}')"))
            await db.execute(text(f"DELETE FROM financial_events WHERE ride_id = '{ride_id}'"))
            await db.execute(text(f"DELETE FROM payments WHERE ride_id = '{ride_id}'"))
            await db.execute(text(f"DELETE FROM rides WHERE id = '{ride_id}'"))
            await db.execute(text(f"DELETE FROM driver_incentives WHERE driver_id = '{driver.id}'"))
            await db.execute(text(f"DELETE FROM driver_metrics WHERE driver_id = '{driver.id}'"))
            await db.execute(text(f"DELETE FROM driver_wallets WHERE driver_id = '{driver.id}'"))
            await db.execute(text(f"DELETE FROM drivers WHERE id = '{driver.id}'"))
            await db.execute(text(f"DELETE FROM payment_methods WHERE user_id = '{pass_user.id}'"))
            await db.execute(text(f"DELETE FROM passengers WHERE id = '{passenger.id}'"))
            await db.execute(text(f"DELETE FROM users WHERE id = '{pass_user.id}'"))
            await db.execute(text(f"DELETE FROM users WHERE id = '{driver_user.id}'"))
            await db.commit()
            
            logger.info("🎉 API Verification Successful!")
            
        except Exception as e:
            logger.error(f"❌ Test Failed: {e}")
            raise

if __name__ == "__main__":
    asyncio.run(test_mercadopago_api())
