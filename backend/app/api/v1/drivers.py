from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.orm import selectinload

from app.core import database
from app.modules.drivers.models.driver import Driver
from app.modules.drivers.models.vehicle import Vehicle
from app.api import deps
from app.schemas import driver as driver_schema
from app.modules.auth.models.user import User

router = APIRouter()

@router.post("/", response_model=driver_schema.Driver)
async def create_driver_profile(
    *,
    db: AsyncSession = Depends(database.get_db),
    driver_in: driver_schema.DriverCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Create new driver profile for current user (includes first vehicle).
    """
    if current_user.user_type != "driver":
        raise HTTPException(status_code=400, detail="User is not a driver")
        
    # Check if exists
    result = await db.execute(select(Driver).options(selectinload(Driver.vehicles)).where(Driver.user_id == current_user.id))
    existing = result.scalars().first()
    if existing:
        raise HTTPException(status_code=400, detail="Driver profile already exists")
    
    # Check CNH + CPF globally? (Skipping for brevity, assuming DB constraints handle uniqueness)
    
    driver = Driver(
        user_id=current_user.id,
        full_name=driver_in.full_name,
        cpf=driver_in.cpf,
        phone=driver_in.phone,
        email=current_user.email,
        cnh_number=driver_in.cnh_number,
        cnh_category=driver_in.cnh_category,
        cnh_expiry_date=driver_in.cnh_expiry_date,
        bank_code=driver_in.bank_code,
        bank_branch=driver_in.bank_branch,
        bank_account=driver_in.bank_account,
        bank_account_type=driver_in.bank_account_type,
        pix_key=driver_in.pix_key,
        pix_key_type=driver_in.pix_key_type,
        status="pending_approval"
    )
    db.add(driver)
    await db.commit() # Commit to get ID
    await db.refresh(driver)
    
    # Create Vehicle
    vehicle = Vehicle(
        driver_id=driver.id,
        license_plate=driver_in.vehicle.license_plate,
        renavam=driver_in.vehicle.renavam,
        brand=driver_in.vehicle.brand,
        model=driver_in.vehicle.model,
        year=driver_in.vehicle.year,
        color=driver_in.vehicle.color,
        category=driver_in.vehicle.category,
        seats=driver_in.vehicle.seats,
        crlv_number=driver_in.vehicle.crlv_number,
        crlv_expiry_date=driver_in.vehicle.crlv_expiry_date,
        status="pending_approval"
    )
    db.add(vehicle)
    await db.commit()
    # Re-fetch with relationships loaded
    result = await db.execute(select(Driver).options(selectinload(Driver.vehicles)).where(Driver.id == driver.id))
    driver = result.scalars().first()
    return driver

@router.get("/me", response_model=driver_schema.Driver)
async def read_driver_me(
    db: AsyncSession = Depends(database.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current driver profile.
    """
    result = await db.execute(select(Driver).where(Driver.user_id == current_user.id))
    driver = result.scalars().first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver profile not found")
    return driver
