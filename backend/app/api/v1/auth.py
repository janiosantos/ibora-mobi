from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import security
from app.core import database
from app.core.config import settings
from app.modules.auth.models.user import User
from app.schemas import token as token_schema
from app.schemas import user as user_schema

# CRUD Utils (Simplificado aqui, ideal mover para services/)
from sqlalchemy import select, or_

router = APIRouter()

async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(select(User).where(User.email == email))
    return result.scalars().first()

async def create_user(db: AsyncSession, user: user_schema.UserCreate):
    db_user = User(
        email=user.email,
        phone=user.phone,
        user_type=user.user_type,
        password_hash=security.get_password_hash(user.password),
        status="active"
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

@router.post("/signup", response_model=user_schema.User)
async def create_user_signup(
    user_in: user_schema.UserCreate,
    db: AsyncSession = Depends(database.get_db),
) -> Any:
    """
    Create new user without the need to be logged in.
    """
    user = await get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = await create_user(db, user=user_in)
    return user

@router.post("/login/access-token", response_model=token_schema.Token)
async def login_access_token(
    db: AsyncSession = Depends(database.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    # Authenticate
    user = await get_user_by_email(db, email=form_data.username)
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if user.status != "active":
         raise HTTPException(status_code=400, detail="Inactive user")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }
