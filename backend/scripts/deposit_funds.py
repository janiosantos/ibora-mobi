
import asyncio
import sys
import os
from decimal import Decimal
from datetime import datetime, timezone
from sqlalchemy import select

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.database import AsyncSessionLocal
from app.modules.auth.models.user import User
from app.modules.drivers.models.driver import Driver
from app.modules.passengers.models.passenger import Passenger
from app.modules.rides.models.ride import Ride
from app.modules.finance.models.financial_event import FinancialEvent, EventType, EventStatus
from app.services.wallet_service import WalletService

async def deposit_funds():
    target_email = "user_9bcda5c8@example.com"
    amount = Decimal("100.00")
    
    async with AsyncSessionLocal() as db:
        print(f"🔍 Searching for user: {target_email}")
        
        # 1. Find User
        result = await db.execute(select(User).where(User.email == target_email))
        user = result.scalars().first()
        
        if not user:
            print("❌ User not found!")
            return

        print(f"✅ User found: {user.id} ({user.user_type})")
        
        # 2. Find Driver Profile
        result = await db.execute(select(Driver).where(Driver.user_id == user.id))
        driver = result.scalars().first()
        
        if not driver:
            print("❌ Driver profile not found!")
            return
            
        print(f"✅ Driver profile found: {driver.id}")
        
        # 3. Check Initial Balance
        wallet = await WalletService.update_wallet(driver.id, db)
        print(f"💰 Initial Balance: R$ {wallet.available_balance}")
        
        # 4. Create Deposit Event
        # We use WALLET_DEPOSIT to represent an injection of funds
        event = FinancialEvent(
            event_type=EventType.WALLET_DEPOSIT,
            amount=float(amount),
            driver_id=driver.id,
            description="Depósito de Teste (Manual)",
            status=EventStatus.COMPLETED,
            created_at=datetime.now(timezone.utc),
            currency="BRL"
        )
        db.add(event)
        await db.commit()
        await db.refresh(event)
        
        print(f"📝 Created Financial Event: {event.id} (R$ {amount})")
        
        # 5. Update Wallet
        wallet = await WalletService.update_wallet(driver.id, db)
        print(f"💰 New Balance: R$ {wallet.available_balance}")
        
        print("🎉 Deposit Successful!")

if __name__ == "__main__":
    asyncio.run(deposit_funds())
