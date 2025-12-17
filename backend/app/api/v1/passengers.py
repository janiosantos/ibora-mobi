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
