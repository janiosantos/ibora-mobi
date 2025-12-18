import httpx
import asyncio

async def test_login():
    url = "http://localhost:8000/api/v1/auth/login/access-token"
    # Note: OAuth2 form data, NOT json
    payload = {
        "username": "user_9bcda5c8@example.com",
        "password": "123456"
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    
    print(f"POST {url}")
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.post(url, data=payload, headers=headers)
            print(f"Status: {resp.status_code}")
            if resp.status_code == 200:
                print("✅ Login SUCCESS")
                print(resp.json())
            else:
                print("❌ Login FAILED")
                print(resp.text)
        except Exception as e:
            print(f"Connection Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_login())
