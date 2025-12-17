from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core import database
from app.modules.passengers.models.passenger import Passenger
from app.modules.auth.models.user import User
from app.schemas import passenger as passenger_schema
from app.api import deps # Precisamos criar dependencias de user atual

router = APIRouter()

# TODO: Mover para deps.py
from app.core import security
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login/access-token")

async def get_current_user(
    db: AsyncSession = Depends(database.get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[security.ALGORITHM])
        token_data = payload.get("sub")
        if token_data is None:
            raise HTTPException(status_code=403, detail="Could not validate credentials")
    except (JWTError, ValueError):
        raise HTTPException(status_code=403, detail="Could not validate credentials")
        
    result = await db.execute(select(User).where(User.id == token_data))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=passenger_schema.Passenger)
async def create_passenger_profile(
    *,
    db: AsyncSession = Depends(database.get_db),
    passenger_in: passenger_schema.PassengerCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Create new passenger profile for current user.
    """
    if current_user.user_type != "passenger":
        raise HTTPException(status_code=400, detail="User is not a passenger")
        
    # Check if exists
    result = await db.execute(select(Passenger).where(Passenger.user_id == current_user.id))
    existing = result.scalars().first()
    if existing:
        raise HTTPException(status_code=400, detail="Passenger profile already exists")
        
    passenger = Passenger(
        user_id=current_user.id,
        full_name=passenger_in.full_name,
        cpf=passenger_in.cpf,
        phone=passenger_in.phone,
        email=current_user.email, # Inherit from user
        default_payment_method=passenger_in.default_payment_method,
        favorite_addresses=passenger_in.favorite_addresses,
        status="active"
    )
    db.add(passenger)
    await db.commit()
    await db.refresh(passenger)
    return passenger

@router.get("/me", response_model=passenger_schema.Passenger)
async def read_passenger_me(
    db: AsyncSession = Depends(database.get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get current passenger profile.
    """
    result = await db.execute(select(Passenger).where(Passenger.user_id == current_user.id))
    passenger = result.scalars().first()
    if not passenger:
        raise HTTPException(status_code=404, detail="Passenger profile not found")
    return passenger

from app.schemas.driver import Driver as DriverSchema
# Or we can create a lightweight schema for map display (id, lat, lon, heading, vehicle_type)
from pydantic import BaseModel

class NearbyDriverResponse(BaseModel):
    id: str
    latitude: float
    longitude: float
    distance_km: float
    vehicle_model: str | None = None
    vehicle_plate: str | None = None

@router.get("/drivers/nearby", response_model=List[NearbyDriverResponse])
async def get_nearby_drivers(
    latitude: float,
    longitude: float,
    radius: float = 2.0,
    db: AsyncSession = Depends(database.get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get nearby drivers for map display.
    """
    from app.services.matching import MatchingService
    from geoalchemy2.shape import to_shape
    
    # Use matching service
    drivers_with_dist = await MatchingService.find_nearby_drivers_hybrid(
        latitude=latitude,
        longitude=longitude,
        radius_km=radius,
        db=db
    )
    
    response = []
    
    # We need to load vehicles if we want to show vehicle info.
    # The find_nearby_drivers query didn't eager load vehicles.
    # But usually map only needs location. Let's return basic info.
    
    for driver, dist in drivers_with_dist:
        # Convert WKBElement to point
        # if using geoalchemy2, driver.location is WKBElement or str
        # We need to extract lat/lon from driver.location
        
        # In PostGIS, driver.location is a geometry object.
        # If we selected it directly, we might need to process it.
        # But MatchingService select might return the object.
        
        # To make it safer, let's parse it.
        # to_shape(driver.location) gives a shapely object
        
        try:
            shape = to_shape(driver.location)
            d_lat = shape.y
            d_lon = shape.x
        except Exception:
            # Fallback if it's None or something else
             continue

        # Simple vehicle info (first vehicle)
        # We might need to fetch vehicle or rely on relationship being lazy loaded (async issue if not loaded)
        # For MVP let's skip vehicle details or assume frontend just needs location dots.
        
        response.append(NearbyDriverResponse(
            id=str(driver.id),
            latitude=d_lat,
            longitude=d_lon,
            distance_km=dist / 1000.0 # dist is in meters from ST_Distance with geography
        ))
        
    return response
