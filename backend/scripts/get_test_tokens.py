import asyncio
import httpx
from uuid import uuid4

BASE_URL = "http://localhost:7000/api/v1"

async def get_or_create_user(client, email, password, user_type):
    print(f"--- Processing {user_type.upper()} ({email}) ---")
    
    # Try Login first
    print(f"Attempting login...")
    res = await client.post(f"{BASE_URL}/auth/login/access-token", data={
        "username": email,
        "password": password
    })
    
    if res.status_code == 200:
        token = res.json()["access_token"]
        print(f"✅ Login successful.")
        return token
    
    print(f"Login failed (User might not exist). Creating user...")
    # Signup
    res = await client.post(f"{BASE_URL}/auth/signup", json={
        "email": email,
        "password": password,
        "phone": f"119{str(uuid4().int)[:8]}",
        "user_type": user_type
    })
    
    if res.status_code != 200:
        print(f"❌ Failed to create user: {res.text}")
        return None
        
    print(f"User created. Logging in...")
    # Login again
    res = await client.post(f"{BASE_URL}/auth/login/access-token", data={
        "username": email,
        "password": password
    })
    
    if res.status_code == 200:
        token = res.json()["access_token"]
        print(f"✅ Login successful.")
        
        # Create Profile if needed
        headers = {"Authorization": f"Bearer {token}"}
        if user_type == "passenger":
             await client.post(f"{BASE_URL}/passengers/", headers=headers, json={
                "full_name": "Test Passenger",
                "phone": "11999999999",
                "cpf": "12345678901"
            })
        elif user_type == "driver":
             await client.post(f"{BASE_URL}/drivers/", headers=headers, json={
                "full_name": "Test Driver",
                "cpf": "10987654321",
                "phone": "11988888888",
                "cnh_number": "12312312312",
                "cnh_category": "B",
                "cnh_expiry_date": "2030-01-01",
                "vehicle": {
                    "license_plate": "TST1234",
                    "brand": "Fiat",
                    "model": "Uno",
                    "year": 2020,
                    "color": "Silver"
                }
            })
            
        return token
    else:
        print(f"❌ Failed to login after creation: {res.text}")
        return None

async def main():
    async with httpx.AsyncClient() as client:
        pass_token = await get_or_create_user(client, "passenger@test.com", "password123", "passenger")
        driver_token = await get_or_create_user(client, "driver@test.com", "password123", "driver")
        
        print("\n\n" + "="*50)
        print("🎫 POSTMAN CREDENTIALS")
        print("="*50)
        print(f"USER: passenger@test.com / password123")
        print(f"TOKEN: {pass_token}")
        print("-" * 50)
        print(f"USER: driver@test.com / password123")
        print(f"TOKEN: {driver_token}")
        print("="*50)

if __name__ == "__main__":
    asyncio.run(main())
