
import asyncio
import logging
import sys
import os
import httpx
from uuid import uuid4
from datetime import date, datetime

# Setup Path
sys.path.append(os.getcwd())

# Logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Imports
from app.main import app
from app.core.database import AsyncSessionLocal
from app.core.security import create_access_token
from app.modules.auth.models.user import User
from app.modules.drivers.models.driver import Driver
from app.modules.passengers.models.passenger import Passenger
from app.modules.rides.models.ride import Ride

# REAL CREDENTIALS (SENSITIVE)
# In a real scenario, these come from env or user input.
# User provided specific test card:
# TEST_CARD = {
#     "card_number": "5031433215406351",
#     "security_code": "123",
#     "expiration_month": 11,
#     "expiration_year": 2030,
#     "cardholder": {
#         "name": "Test User",
#         "identification": {
#             "type": "CPF",
#             "number": "19119119100"
#         }
#     }
# }
TEST_CARD = {
    "card_number": "5502090000000003",
    "security_code": "123",
    "expiration_month": 11,
    "expiration_year": 2030,
    "cardholder": {
        "name": "APRO",
        "identification": {
            "type": "CPF",
            "number": "19119119100"
        }
    }
}

async def get_real_card_token(public_key: str):
    """
    Simulates the Frontend generating a Secure Card Token via MP API.
    """
    url = f"https://api.mercadopago.com/v1/card_tokens?public_key={public_key}"
    async with httpx.AsyncClient() as client:
        # Note: MP API expects this structure
        payload = {
            "card_number": TEST_CARD["card_number"],
            "security_code": TEST_CARD["security_code"],
            "expiration_month": TEST_CARD["expiration_month"],
            "expiration_year": TEST_CARD["expiration_year"],
            "cardholder": TEST_CARD["cardholder"]
        }
        logger.info(f"Generating Token for Card ending in {TEST_CARD['card_number'][-4:]}...")
        response = await client.post(url, json=payload)
        
        if response.status_code not in (200, 201):
            logger.error(f"Failed to tokenize card: {response.text}")
            raise Exception("Card Tokenization Failed")
            
        data = response.json()
        token = data["id"]
        logger.info(f"✅ Card Token Generated: {token}")
        return token

async def test_real_flow():
    # Ensure Env is set (or warn)
    from app.core.config import settings
    mp_access_token = settings.MERCADOPAGO_ACCESS_TOKEN
    mp_public_key = settings.MERCADOPAGO_PUBLIC_KEY
    
    if not mp_access_token or not mp_public_key:
        logger.error("❌ MERCADOPAGO_ACCESS_TOKEN or MERCADOPAGO_PUBLIC_KEY not set in environment.")
        logger.error("Please export them before running this script.")
        return

    logger.info("🚀 Starting Real Sandbox Flow Verification...")

    # 1. Get Real Token
    try:
        card_token = await get_real_card_token(mp_public_key)
    except Exception as e:
        logger.error(f"Cannot proceed without card token: {e}")
        return

    async with AsyncSessionLocal() as db:
        try:
            # 2. Setup DB Data (Passenger, Driver)
            # Use simple alpha email for MP first_name compatibility
            import random
            import string
            suffix = ''.join(random.choices(string.ascii_lowercase, k=8))
            pass_email = f"passenger{suffix}@test.com"
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
                full_name="Real Passenger",
                cpf=str(uuid4().int)[:11],
                phone=pass_user.phone,
                email=pass_user.email
            )
            db.add(passenger)
            await db.flush()
            
            driver_suffix = ''.join(random.choices(string.ascii_lowercase, k=8))
            driver_email = f"driver{driver_suffix}@test.com"
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
                full_name="Real Driver",
                cpf=str(uuid4().int)[:11],
                phone=driver_user.phone,
                email=driver_user.email,
                cnh_number=str(uuid4().int)[:10],
                cnh_category="B",
                cnh_expiry_date=date(2030,1,1)
            )
            db.add(driver) 
            await db.flush()
            await db.commit()

            # Create Token
            access_token = create_access_token(str(pass_user.id))
            headers = {"Authorization": f"Bearer {access_token}"}
            
            async with httpx.AsyncClient(app=app, base_url="http://test") as client:
                
                # 3. Add Payment Method (Using Real Token)
                logger.info("3. Adding Payment Method (Real Token)...")
                pm_response = await client.post(
                    "/api/v1/payment-methods",
                    headers=headers,
                    json={
                        "card_token": card_token,
                        "provider": "mercadopago"
                    }
                )
                
                if pm_response.status_code not in (200, 201):
                    logger.error(f"Failed to add PM: {pm_response.text}")
                    raise Exception("Add PM Failed")
                
                pm_id = pm_response.json()["id"]
                logger.info(f"✅ PM Added: ID {pm_id}")

                # 4. Create Ride
                ride_id = uuid4()
                ride = Ride(
                    id=ride_id,
                    passenger_id=passenger.id,
                    driver_id=driver.id,
                    status="IN_PROGRESS",
                    created_at=datetime.utcnow(),
                    origin_lat=-23.55, origin_lon=-46.63, origin_address="A",
                    destination_lat=-23.56, destination_lon=-46.64, destination_address="B",
                    distance_km=2.0, estimated_price=10.00,
                    final_price=5.00, # Small amount for test
                    payment_method="contract" 
                )
                db.add(ride)
                await db.commit()

                # 5. Finish Ride -> Triggers Real Payment
                logger.info("4. Finishing Ride (Triggering Real Payment)...")
                driver_token = create_access_token(str(driver_user.id))
                driver_headers = {"Authorization": f"Bearer {driver_token}"}
                
                finish_res = await client.post(
                    f"/api/v1/rides/{str(ride_id)}/finish",
                    headers=driver_headers
                )
                
                if finish_res.status_code != 200:
                    logger.error(f"Finish Ride Failed: {finish_res.text}")
                    raise Exception("Finish Failed")
                    
                finish_data = finish_res.json()
                logger.info(f"✅ Ride Finished. Data: {finish_data}")
                
        except Exception as e:
            logger.error(f"❌ Test Failed: {e}")
        finally:
            # Cleanup
            logger.info("Cleaning up...")
            from sqlalchemy import text
            if 'ride_id' in locals():
                await db.execute(text(f"DELETE FROM payments WHERE ride_id = '{ride_id}'")) 
                await db.execute(text(f"DELETE FROM rides WHERE id = '{ride_id}'"))
            if 'pass_user' in locals():
                 await db.execute(text(f"DELETE FROM payment_methods WHERE user_id = '{pass_user.id}'"))
            if 'driver' in locals():
                await db.execute(text(f"DELETE FROM drivers WHERE id = '{driver.id}'"))
            if 'passenger' in locals():
                await db.execute(text(f"DELETE FROM passengers WHERE id = '{passenger.id}'"))
            if 'pass_user' in locals():
                await db.execute(text(f"DELETE FROM users WHERE id = '{pass_user.id}'"))
            if 'driver_user' in locals():
                await db.execute(text(f"DELETE FROM users WHERE id = '{driver_user.id}'"))
            await db.commit()
            logger.info("Cleanup Complete.")

if __name__ == "__main__":
    asyncio.run(test_real_flow())
