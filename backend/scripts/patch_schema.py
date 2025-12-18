import asyncio
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../'))

from sqlalchemy import text
from app.core.database import AsyncSessionLocal

async def main():
    print("Patching database schema...")
    async with AsyncSessionLocal() as session:
        await session.execute(text("ALTER TABLE rides ADD COLUMN IF NOT EXISTS cash_confirmed_by_driver BOOLEAN DEFAULT FALSE;"))
        await session.execute(text("ALTER TABLE rides ADD COLUMN IF NOT EXISTS cash_confirmed_at TIMESTAMP WITH TIME ZONE;"))
        
        # Create Notifications Table
        await session.execute(text("""
            CREATE TABLE IF NOT EXISTS notifications (
                id UUID PRIMARY KEY,
                user_id UUID NOT NULL REFERENCES users(id),
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                type VARCHAR(50) DEFAULT 'INFO',
                read BOOLEAN DEFAULT FALSE,
                read_at TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
            );
        """))
        await session.execute(text("CREATE INDEX IF NOT EXISTS ix_notifications_user_id ON notifications(user_id);"))
        
        await session.commit()
    print("Database patched.")

if __name__ == "__main__":
    asyncio.run(main())
