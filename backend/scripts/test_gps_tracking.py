import asyncio
import httpx
import uuid
import random
import json

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
    async with httpx.AsyncClient(timeout=30.0) as client:
        print("🚀 Starting Ibora Mobi GPS Tracking Simulation...")
        
        # 1. Passenger Signup
        print("\n[1] Creating Passenger...")
        pass_email = random_email()
        pass_password = "password123"
        res = await client.post(f"{BASE_URL}/auth/signup", json={
            "email": pass_email, "password": pass_password, "phone": random_phone(), "user_type": "passenger"
        })
        if res.status_code != 200: return print(f"Error: {res.text}")
        pass_user = res.json()
        
        # Login Pass
        res = await client.post(f"{BASE_URL}/auth/login/access-token", data={"username": pass_email, "password": pass_password})
        pass_token = res.json()["access_token"]
        pass_headers = {"Authorization": f"Bearer {pass_token}"}
        
        # Profile Pass
        await client.post(f"{BASE_URL}/passengers/", headers=pass_headers, json={
            "full_name": " GPS Test Pass", "phone": pass_user["phone"], "cpf": random_cpf()
        })

        # 2. Driver Signup
        print("\n[2] Creating Driver...")
        driver_email = random_email()
        driver_password = "password123"
        res = await client.post(f"{BASE_URL}/auth/signup", json={
            "email": driver_email, "password": driver_password, "phone": random_phone(), "user_type": "driver"
        })
        driver_user = res.json()
        
        # Login Driver
        res = await client.post(f"{BASE_URL}/auth/login/access-token", data={"username": driver_email, "password": driver_password})
        driver_token = res.json()["access_token"]
        driver_headers = {"Authorization": f"Bearer {driver_token}"}
        
        # Profile Driver
        res = await client.post(f"{BASE_URL}/drivers/", headers=driver_headers, json={
            "full_name": "GPS Test Driver", "cpf": random_cpf(), "phone": driver_user["phone"],
            "cnh_number": random_cpf(), "cnh_category": "B", "cnh_expiry_date": "2030-01-01",
            "vehicle": {"license_plate": random_plate(), "brand": "Test", "model": "Car", "year": 2022, "color": "Blue"}
        })
        driver = res.json()

        # 3. Request Ride
        print("\n[3] Requesting Ride...")
        res = await client.post(f"{BASE_URL}/rides/request", headers=pass_headers, json={
            "origin_lat": -23.550520, "origin_lon": -46.633308, "origin_address": "Origin",
            "destination_lat": -23.559616, "destination_lon": -46.658755, "destination_address": "Dest"
        })
        ride = res.json()
        ride_id = ride['id']
        print(f"    Ride: {ride_id} - Status: {ride['status']}")

        # 4. Accept & Arriving & Start
        print("\n[4] Driver Activity...")
        await client.post(f"{BASE_URL}/rides/{ride_id}/accept", headers=driver_headers)
        await client.post(f"{BASE_URL}/rides/{ride_id}/arriving", headers=driver_headers)
        res = await client.post(f"{BASE_URL}/rides/{ride_id}/start", headers=driver_headers)
        ride = res.json()
        print(f"    Ride Started. Status: {ride['status']}")

        # 5. Simulate GPS Movement
        print("\n[5] Simulating Movement (capturing points)...")
        # Point 1
        print("    -> Moving to Point A")
        await client.post(f"{BASE_URL}/drivers/me/location", headers=driver_headers, json={
            "lat": -23.551000, "lon": -46.634000
        })
        await asyncio.sleep(6) # Capture cycle 5s
        
        # Point 2
        print("    -> Moving to Point B")
        await client.post(f"{BASE_URL}/drivers/me/location", headers=driver_headers, json={
            "lat": -23.552000, "lon": -46.635000
        })
        await asyncio.sleep(6)

        # 6. Finish Ride
        print("\n[6] Finishing Ride...")
        res = await client.post(f"{BASE_URL}/rides/{ride_id}/finish", headers=driver_headers)
        if res.status_code != 200:
             print(f"Failed to finish: {res.text}")
             return
        ride = res.json()
        print(f"    Finished. Polyline: {ride.get('route_polyline')}")

        # 7. Verification
        if ride.get('route_polyline'):
            print("\n✅ Verification Successful: Polyline captured!")
        else:
            print("\n❌ Verification Failed: Polyline is empty/None")

if __name__ == "__main__":
    asyncio.run(main())
