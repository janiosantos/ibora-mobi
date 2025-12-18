
import asyncio
import sys
import os
from sqlalchemy import select

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.database import AsyncSessionLocal
from app.modules.auth.models.user import User

async def check_user():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.email == 'user_9bcda5c8@example.com'))
        user = result.scalars().first()
        if user:
            print(f"User Found: {user.email}, Type: {user.user_type}, ID: {user.id}")
        else:
            print("User NOT Found")

if __name__ == "__main__":
    asyncio.run(check_user())
