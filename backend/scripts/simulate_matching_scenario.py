import asyncio
import logging
import random
from uuid import uuid4
from datetime import datetime

import sys
import os
sys.path.append(os.getcwd())

from unittest.mock import AsyncMock, patch

# Mock RabbitMQ to avoid connection errors in simulation context
import app.core.rabbitmq
app.core.rabbitmq.publish_message = AsyncMock()

from app.main import app
from httpx import AsyncClient, ASGITransport
from app.core.config import settings

# Logging Setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("Simulation")

# Mock Data
PASSENGER_LOCATION = (-23.5505, -46.6333) # Sao Paulo
RADIUS_KM = 3.0

def generate_random_location(center_lat, center_lon, radius_km):
    # Rough approximation: 1 deg lat = 111km, 1 deg lon = 111km * cos(lat)
    r = radius_km / 111.0
    u = random.random()
    v = random.random()
    w = r * (u ** 0.5)
    t = 2 * 3.14159 * v
    x = w * 0.9 # cos(0)ish
    y = w * 0.9 # sin
    
    # Simple randomize
    lat_offset = (random.random() - 0.5) * (radius_km / 111.0) * 2
    lon_offset = (random.random() - 0.5) * (radius_km / 111.0) * 2
    
    return center_lat + lat_offset, center_lon + lon_offset

async def create_user_and_driver(client, index):
    phone = f"1198{random.randint(10000000, 99999999)}"
    email = f"sim_driver_{uuid4().hex[:6]}@sim.com"
    pwd = "password"
    
    # Register
    r = await client.post(f"{settings.API_V1_STR}/auth/signup", json={
        "email": email, "password": pwd, "user_type": "driver", "phone": phone
    })
    if r.status_code not in [200, 201]:
        logger.error(f"Failed to register driver {index}: {r.text}")
        return None

    # Login
    r = await client.post(f"{settings.API_V1_STR}/auth/login/access-token", data={"username": email, "password": pwd})
    token = r.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Profile
    r = await client.post(f"{settings.API_V1_STR}/drivers/", json={
        "full_name": f"Sim Driver {index}",
        "cpf": f"123{random.randint(10000000, 99999999)}",
        "phone": phone,
        "cnh_number": f"CNH{random.randint(10000000, 99999999)}",
        "cnh_category": "B",
        "cnh_expiry_date": "2030-01-01",
        "vehicle": {
            "license_plate": f"SIM-{random.randint(1000, 9999)}",
            "renavam": "123456",
            "brand": "Fiat", "model": "Mobi", "year": 2022, "color": "White", "category": "standard",
            "seats": 4, "crlv_number": "123", "crlv_expiry_date": "2030-01-01"
        }
    }, headers=headers)
    
    # Start Online
    await client.post(f"{settings.API_V1_STR}/drivers/me/status", json={"status": "online"}, headers=headers)
    
    # Set Location
    lat, lon = generate_random_location(PASSENGER_LOCATION[0], PASSENGER_LOCATION[1], RADIUS_KM)
    await client.post(f"{settings.API_V1_STR}/drivers/me/location", json={"latitude": lat, "longitude": lon}, headers=headers)
    
    logger.info(f"Created Driver {index} at {lat:.4f}, {lon:.4f}")
    return {"token": token, "headers": headers, "id": r.json()["id"], "lat": lat, "lon": lon}

async def create_passenger(client, index):
    phone = f"1197{random.randint(10000000, 99999999)}"
    email = f"sim_pass_{uuid4().hex[:6]}@sim.com"
    pwd = "password"
    
    r = await client.post(f"{settings.API_V1_STR}/auth/signup", json={
        "email": email, "password": pwd, "user_type": "passenger", "phone": phone
    })
    
    r = await client.post(f"{settings.API_V1_STR}/auth/login/access-token", data={"username": email, "password": pwd})
    token = r.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    await client.post(f"{settings.API_V1_STR}/passengers/", json={
        "full_name": f"Sim Pass {index}", "cpf": f"321{random.randint(10000000, 99999999)}", "phone": phone,
        "default_payment_method": "cash", "favorite_addresses": []
    }, headers=headers)
    
    return {"headers": headers}

async def run_ride_flow(client, passenger, driver_pool):
    # Request
    r = await client.post(f"{settings.API_V1_STR}/rides/request", json={
        "origin_lat": PASSENGER_LOCATION[0],
        "origin_lon": PASSENGER_LOCATION[1],
        "origin_address": "Sim Origin",
        "destination_lat": PASSENGER_LOCATION[0] + 0.01,
        "destination_lon": PASSENGER_LOCATION[1] + 0.01,
        "destination_address": "Sim Dest",
        "category": "standard",
        "payment_method": "cash"
    }, headers=passenger["headers"])
    
    if r.status_code != 200:
        logger.error(f"Ride request failed: {r.text}")
        return
        
    ride_id = r.json()["id"]
    logger.info(f"Ride {ride_id} requested.")
    
    # Simulate Matching: Pick a random driver from pool to accept
    # In real world, driver gets notification. Here we verify logic by checking if driver CAN accept.
    driver = random.choice(driver_pool)
    
    # Check nearby (Verification step)
    # verify_r = await client.get(f"{settings.API_V1_STR}/passengers/drivers/nearby?latitude={PASSENGER_LOCATION[0]}&longitude={PASSENGER_LOCATION[1]}&radius=4.0", headers=passenger["headers"])
    # logger.info(f"Nearby drivers found: {len(verify_r.json())}")
    
    # Accept
    r = await client.post(f"{settings.API_V1_STR}/rides/{ride_id}/accept", headers=driver["headers"])
    if r.status_code == 200:
        logger.info(f"Ride {ride_id} ACCEPTED by Driver ID {driver['id']}")
    else:
        logger.error(f"Ride accept failed: {r.text}")
        return

    # Arriving -> Start -> Finish
    await client.post(f"{settings.API_V1_STR}/rides/{ride_id}/arriving", headers=driver["headers"])
    await client.post(f"{settings.API_V1_STR}/rides/{ride_id}/start", headers=driver["headers"])
    await client.post(f"{settings.API_V1_STR}/rides/{ride_id}/finish", headers=driver["headers"])
    
    # Pay
    await client.post(f"{settings.API_V1_STR}/rides/{ride_id}/confirm-cash-payment", headers=driver["headers"])
    logger.info(f"Ride {ride_id} COMPLETED and PAID.")

async def main():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        logger.info("Starting Simulation...")
        
        # 1. Create Drivers
        drivers = []
        for i in range(5):
            d = await create_user_and_driver(client, i)
            if d: drivers.append(d)
            
        # 2. Check Matching Visibility
        # Create one passenger just to check nearby
        p_check = await create_passenger(client, 99)
        r = await client.get(f"{settings.API_V1_STR}/passengers/drivers/nearby?latitude={PASSENGER_LOCATION[0]}&longitude={PASSENGER_LOCATION[1]}&radius=5.0", headers=p_check["headers"])
        logger.info(f"Passenger sees {len(r.json())} drivers nearby (Expected ~5).")
        
        # 3. Concurrent Rides
        tasks = []
        for i in range(3):
            p = await create_passenger(client, i)
            tasks.append(run_ride_flow(client, p, drivers))
            
        await asyncio.gather(*tasks)
        logger.info("Simulation Finished.")

if __name__ == "__main__":
    asyncio.run(main())
