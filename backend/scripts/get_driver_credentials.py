import asyncio
import sys
import os
from sqlalchemy import select

# Context Setup
sys.path.append(os.getcwd())
from app.core.database import AsyncSessionLocal
from app.modules.auth.models.user import User
from app.core.security import get_password_hash

async def get_or_create_driver():
    async with AsyncSessionLocal() as db:
        # Try to find a driver
        result = await db.execute(select(User).where(User.user_type == 'driver').limit(1))
        user = result.scalar_one_or_none()
        
        if user:
            print(f"\n✅ Found Existing Driver:")
            print(f"Email: {user.email}")
            print(f"Password: (Unknown, hopefully 'password' or '123456')")
            
            # Reset password to '123456' to be sure
            user.password_hash = get_password_hash("123456")
            await db.commit()
            print(f"🔄 Password has been reset to: 123456")
            return

        # Create one if missing
        print("\n⚠️ No driver found. Creating one...")
        new_driver = User(
            email="driver@test.com",
            password_hash=get_password_hash("123456"),
            phone="5511999999999",
            user_type="driver",
            is_active=True
        )
        db.add(new_driver)
        await db.commit()
        print(f"✅ Created New Driver:")
        print(f"Email: {new_driver.email}")
        print(f"Password: 123456")

if __name__ == "__main__":
    asyncio.run(get_or_create_driver())
