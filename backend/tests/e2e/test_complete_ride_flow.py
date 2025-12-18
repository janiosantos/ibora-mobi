import pytest
from httpx import AsyncClient
from app.main import app
from app.core.config import settings
from uuid import uuid4

# Use strict asyncio mode
pytestmark = pytest.mark.asyncio

@pytest.fixture
def anyio_backend():
    return 'asyncio'

async def test_complete_ride_flow():
    """
    Test the complete ride flow from request to payment confirmation.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        
        # 1. Setup - Mobile Passenger
        passenger_email = f"pass_e2e_{uuid4().hex[:6]}@test.com"
        passenger_phone = f"119{uuid4().int % 100000000:08d}"
        
        # Register
        res = await ac.post(f"{settings.API_V1_STR}/auth/register", json={
            "email": passenger_email,
            "password": "password",
            "user_type": "passenger",
            "phone": passenger_phone
        })
        assert res.status_code in [200, 201]
        
        # Login
        res = await ac.post(f"{settings.API_V1_STR}/auth/login/access-token", data={
            "username": passenger_email,
            "password": "password"
        })
        assert res.status_code == 200
        passenger_token = res.json()["access_token"]
        passenger_headers = {"Authorization": f"Bearer {passenger_token}"}
        
        # Create Passenger Profile
        res = await ac.post(f"{settings.API_V1_STR}/passengers/", json={
            "full_name": "Passenger E2E",
            "cpf": f"123{uuid4().hex[:8]}",
            "phone": passenger_phone,
            "default_payment_method": "cash",
            "favorite_addresses": []
        }, headers=passenger_headers)
        assert res.status_code in [200, 201]
        
        # 2. Setup - Driver
        driver_email = f"driver_e2e_{uuid4().hex[:6]}@test.com"
        driver_phone = f"119{uuid4().int % 100000000:08d}"
        
        res = await ac.post(f"{settings.API_V1_STR}/auth/register", json={
            "email": driver_email,
            "password": "password",
            "user_type": "driver",
            "phone": driver_phone
        })
        assert res.status_code in [200, 201]
        
        res = await ac.post(f"{settings.API_V1_STR}/auth/login/access-token", data={
            "username": driver_email,
            "password": "password"
        })
        assert res.status_code == 200
        driver_token = res.json()["access_token"]
        driver_headers = {"Authorization": f"Bearer {driver_token}"}
        
        # Create Driver Profile
        res = await ac.post(f"{settings.API_V1_STR}/drivers/", json={
            "full_name": "Driver E2E",
            "cpf": f"123{uuid4().hex[:8]}", # Mock
            "phone": driver_phone,
            "cnh_number": f"CNH{uuid4().hex[:8]}",
            "cnh_category": "B",
            "cnh_expiry_date": "2030-01-01",
            "vehicle": {
                "license_plate": "ABC-1234",
                "renavam": "123456",
                "brand": "Fiat",
                "model": "Uno",
                "year": 2020,
                "color": "White",
                "category": "standard",
                "seats": 4,
                "crlv_number": "123",
                "crlv_expiry_date": "2030-01-01"
            }
        }, headers=driver_headers)
        assert res.status_code in [200, 201]

        # 3. Request Ride (Passenger)
        res = await ac.post(f"{settings.API_V1_STR}/rides/request", json={
            "origin_address": "Origin",
            "origin_lat": -23.55,
            "origin_lon": -46.63,
            "destination_address": "Dest",
            "destination_lat": -23.56,
            "destination_lon": -46.64,
            "category": "standard",
            "payment_method": "cash"
        }, headers=passenger_headers)
        assert res.status_code == 200
        ride_data = res.json()
        ride_id = ride_data["id"]
        
        # 4. Accept Ride (Driver)
        res = await ac.post(f"{settings.API_V1_STR}/rides/{ride_id}/accept", headers=driver_headers)
        assert res.status_code == 200
        assert res.json()["status"] == "ACCEPTED"
        
        # 5. Arriving
        res = await ac.post(f"{settings.API_V1_STR}/rides/{ride_id}/arriving", headers=driver_headers)
        assert res.status_code == 200
        
        # 6. Start
        res = await ac.post(f"{settings.API_V1_STR}/rides/{ride_id}/start", headers=driver_headers)
        assert res.status_code == 200
        assert res.json()["status"] == "IN_PROGRESS"
        
        # 7. Finish
        res = await ac.post(f"{settings.API_V1_STR}/rides/{ride_id}/finish", headers=driver_headers)
        assert res.status_code == 200
        assert res.json()["status"] == "COMPLETED"
        
        # 8. Confirm Payment (Cash)
        res = await ac.post(f"{settings.API_V1_STR}/rides/{ride_id}/confirm-cash-payment", headers=driver_headers)
        assert res.status_code == 200
        assert res.json()["status"] == "confirmed"
        
        # 9. Check History
        res = await ac.get(f"{settings.API_V1_STR}/rides/history", headers=passenger_headers)
        assert res.status_code == 200
        history = res.json()
        assert len(history) >= 1
        assert history[0]["id"] == ride_id
        
        # 10. Check Admin Report (Optional, needs admin token)
