import asyncio
import httpx
import uuid
import random
from datetime import date

# Config
BASE_URL = "http://localhost:7000/api/v1"

# Data Gen
def random_email():
    return f"user_{uuid.uuid4().hex[:8]}@example.com"

def random_cpf():
    return "".join([str(random.randint(0, 9)) for _ in range(11)])

def random_phone():
    return "".join([str(random.randint(0, 9)) for _ in range(11)])

def random_plate():
    letters = "".join(random.choices("ABCDEFGHIJKLMNOPQRSTUVWXYZ", k=3))
    numbers = "".join(random.choices("0123456789", k=4))
    return f"{letters}{numbers}"

async def main():
    async with httpx.AsyncClient() as client:
        print("🚀 Starting Ibora Mobi Ride Arriving Simulation...")
        
        # 1. Passenger Signup
        print("\n[1] Creating Passenger...")
        pass_email = random_email()
        pass_password = "password123"
        
        # User
        res = await client.post(f"{BASE_URL}/auth/signup", json={
            "email": pass_email,
            "password": pass_password,
            "phone": random_phone(),
            "user_type": "passenger"
        })
        if res.status_code != 200:
            print(f"Failed to create passenger user: {res.text}")
            return
        pass_user = res.json()
        print(f"    Passenger User Created: {pass_user['email']}")
        
        # Login
        res = await client.post(f"{BASE_URL}/auth/login/access-token", data={
            "username": pass_email,
            "password": pass_password
        })
        pass_token = res.json()["access_token"]
        pass_headers = {"Authorization": f"Bearer {pass_token}"}
        
        # Profile
        res = await client.post(f"{BASE_URL}/passengers/", headers=pass_headers, json={
            "full_name": "John Doe Passenger",
            "phone": pass_user["phone"],
            "cpf": random_cpf()
        })
        passenger = res.json()
        print(f"    Passenger Profile Created: {passenger['id']}")

        # 2. Driver Signup
        print("\n[2] Creating Driver...")
        driver_email = random_email()
        driver_password = "password123"
        
        # User
        res = await client.post(f"{BASE_URL}/auth/signup", json={
            "email": driver_email,
            "password": driver_password,
            "phone": random_phone(),
            "user_type": "driver"
        })
        driver_user = res.json()
        
        # Login
        res = await client.post(f"{BASE_URL}/auth/login/access-token", data={
            "username": driver_email,
            "password": driver_password
        })
        driver_token = res.json()["access_token"]
        driver_headers = {"Authorization": f"Bearer {driver_token}"}
        
        # Profile + Vehicle
        res = await client.post(f"{BASE_URL}/drivers/", headers=driver_headers, json={
            "full_name": "Jane Driver",
            "cpf": random_cpf(),
            "phone": driver_user["phone"],
            "cnh_number": random_cpf(), 
            "cnh_category": "B",
            "cnh_expiry_date": "2030-01-01",
            "vehicle": {
                "license_plate": random_plate(),
                "brand": "Toyota",
                "model": "Corolla",
                "year": 2022,
                "color": "White"
            }
        })
        driver = res.json()
        print(f"    Driver Profile Created: {driver['id']}")

        # 3. Request Ride
        print("\n[3] Requesting Ride...")
        res = await client.post(f"{BASE_URL}/rides/request", headers=pass_headers, json={
            "origin_lat": -23.550520,
            "origin_lon": -46.633308,
            "origin_address": "Praça da Sé, SP",
            "destination_lat": -23.559616,
            "destination_lon": -46.658755,
            "destination_address": "Av. Paulista, SP",
            "payment_method": "pix"
        })
        ride = res.json()
        ride_id = ride['id']
        print(f"    Ride Requested: {ride_id}")
        print(f"    Status: {ride['status']}")

        # 4. Accept Ride
        print("\n[4] Accepting Ride (Driver)...")
        res = await client.post(f"{BASE_URL}/rides/{ride_id}/accept", headers=driver_headers)
        if res.status_code != 200:
            print(f"Failed to accept ride: {res.text}")
            return
        ride = res.json()
        print(f"    Ride Accepted by: {driver['full_name']}")
        print(f"    Status: {ride['status']}")
        
        # 4.5 Driver Arriving
        print("\n[4.5] Driver Arriving...")
        res = await client.post(f"{BASE_URL}/rides/{ride_id}/arriving", headers=driver_headers)
        if res.status_code != 200:
             print(f"Failed to signal arriving: {res.text}")
             return
        arriving_data = res.json()
        print(f"    [ARIV] Status: {arriving_data['status']}")
        print(f"    [ARIV] ETA: {arriving_data['eta_seconds']}s")
        
        if arriving_data['status'] != 'DRIVER_ARRIVING':
            print("❌ Error: Status should be DRIVER_ARRIVING")
            return

        # 5. Start Ride
        print("\n[5] Starting Ride...")
        res = await client.post(f"{BASE_URL}/rides/{ride_id}/start", headers=driver_headers)
        if res.status_code != 200:
            print(f"Failed to start ride: {res.text}")
            return
        ride = res.json()
        print(f"    Ride Started at: {ride['started_at']}")
        print(f"    Status: {ride['status']}")
        
        if ride['status'] not in ['STARTED', 'IN_PROGRESS']:
             print(f"❌ Error: Status should be IN_PROGRESS/STARTED, got {ride['status']}")
             return

        print("\n✅ Verification Successful!")

if __name__ == "__main__":
    asyncio.run(main())
