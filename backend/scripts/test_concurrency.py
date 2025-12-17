import asyncio
import httpx
import uuid

BASE_URL = "http://localhost:7000/api/v1"

# Credenciais de teste
DRIVER_A_EMAIL = f"driverA_{uuid.uuid4().hex[:6]}@test.com"
DRIVER_B_EMAIL = f"driverB_{uuid.uuid4().hex[:6]}@test.com"
PASSENGER_EMAIL = f"pass_{uuid.uuid4().hex[:6]}@test.com"
PASSWORD = "password123"

async def create_user(client, email, type):
    res = await client.post(f"{BASE_URL}/auth/signup", json={
        "email": email,
        "password": PASSWORD,
        "phone": str(uuid.uuid4().int)[:11],
        "user_type": type
    })
    if res.status_code != 200:
        # Try login if exists
        pass
    
    # Login to get token
    res = await client.post(f"{BASE_URL}/auth/login/access-token", data={
        "username": email,
        "password": PASSWORD
    })
    return res.json()["access_token"]

async def create_profile(client, token, type, full_name):
    headers = {"Authorization": f"Bearer {token}"}
    if type == "driver":
        await client.post(f"{BASE_URL}/drivers/", headers=headers, json={
            "full_name": full_name,
            "cpf": str(uuid.uuid4().int)[:11],
            "phone": "5511999999999",
            "vehicle": {
                "plate": f"ABC{uuid.uuid4().hex[:4].upper()}",
                "model": "Test Car",
                "color": "White"
            }
        })
    else:
        await client.post(f"{BASE_URL}/passengers/", headers=headers, json={
            "full_name": full_name,
            "phone": "5511999999999",
            "cpf": str(uuid.uuid4().int)[:11]
        })

async def main():
    async with httpx.AsyncClient(timeout=30.0) as client:
        print("🔧 Setting up users...")
        token_pa = await create_user(client, PASSENGER_EMAIL, "passenger")
        token_da = await create_user(client, DRIVER_A_EMAIL, "driver")
        token_db = await create_user(client, DRIVER_B_EMAIL, "driver")
        
        await create_profile(client, token_pa, "passenger", "Passenger Test")
        await create_profile(client, token_da, "driver", "Driver A")
        await create_profile(client, token_db, "driver", "Driver B")
        
        print("🚗 Requesting Ride...")
        res = await client.post(f"{BASE_URL}/rides/request", headers={"Authorization": f"Bearer {token_pa}"}, json={
            "origin_address": "Rua A",
            "destination_address": "Rua B",
            "origin_lat": -23.550520,
            "origin_lon": -46.633308,
            "destination_lat": -23.550520,
            "destination_lon": -46.633308,
            "payment_method": "pix"
        })
        if res.status_code != 200:
            print(f"Failed to request ride: {res.text}")
            return
        ride_id = res.json()["id"]
        print(f"    Ride ID: {ride_id}")
        
        print("⚡ RACING: Driver A vs Driver B accepting simultaneously...")
        
        async def accept_ride(name, token):
            print(f"    -> {name} sending accept...")
            r = await client.post(f"{BASE_URL}/rides/{ride_id}/accept", headers={"Authorization": f"Bearer {token}"})
            print(f"    <- {name} finished: {r.status_code}")
            return r.status_code

        # Gather results
        results = await asyncio.gather(
            accept_ride("Driver A", token_da),
            accept_ride("Driver B", token_db)
        )
        
        print(f"🏁 Results: {results}")
        
        # Verification
        success_count = results.count(200)
        failure_count = results.count(400) + results.count(409)
        
        if success_count == 1:
            print("✅ TEST PASSED: Only one driver accepted the ride.")
        elif success_count > 1:
            print("❌ TEST FAILED: Multiple drivers accepted the ride! (Race Condition)")
        else:
            print("❌ TEST FAILED: No driver accepted the ride.")

if __name__ == "__main__":
    asyncio.run(main())
