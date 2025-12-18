import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from passlib.context import CryptContext

from app.core.config import settings
from app.modules.auth.models.user import User
from app.modules.passengers.models.passenger import Passenger
from app.core import database

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def seed_passenger():
    engine = create_async_engine(settings.SQLALCHEMY_DATABASE_URI, echo=True)
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    async with async_session() as session:
        print("Seeding test passenger...")

        # Test Data
        email = "ana@test.com"
        password = "password123"
        phone = "11999990000"
        name = "Ana"
        
        # Check if user exists
        stmt = select(User).where(User.email == email)
        result = await session.execute(stmt)
        user = result.scalar_one_or_none()
        
        if user:
            print(f"User {email} already exists.")
        else:
            # Create User
            user = User(
                email=email,
                phone=phone,
                password_hash=pwd_context.hash(password),
                user_type="passenger",
                status="active",
                email_verified=True,
                phone_verified=True
            )
            session.add(user)
            await session.commit()
            print(f"Created User: {email}")
            
        # Check if Passenger profile exists
        stmt = select(Passenger).where(Passenger.user_id == user.id)
        result = await session.execute(stmt)
        passenger = result.scalar_one_or_none()
        
        if passenger:
            print(f"Passenger profile for {name} already exists.")
        else:
            passenger = Passenger(
                user_id=user.id,
                full_name=name,
                email=email,
                phone=phone,
                status="active"
            )
            session.add(passenger)
            await session.commit()
            print(f"Created Passenger Profile: {name}")

if __name__ == "__main__":
    asyncio.run(seed_passenger())
