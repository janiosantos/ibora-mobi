import asyncio
import sys
import os
from sqlalchemy import text

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.database import AsyncSessionLocal as async_session_factory

async def main():
    print("Fixing Alembic Version...")
    async with async_session_factory() as session:
        # Check current version
        res = await session.execute(text("SELECT version_num FROM alembic_version"))
        current = res.scalar()
        print(f"Current version: {current}")
        
        if current == 'fb7d29d4937e':
            print("Reverting to a0ead8c9850d")
            await session.execute(text("UPDATE alembic_version SET version_num = 'a0ead8c9850d'"))
            await session.commit()
            print("Fixed.")
        else:
            print("No fix needed or unknown version.")

if __name__ == "__main__":
    asyncio.run(main())
