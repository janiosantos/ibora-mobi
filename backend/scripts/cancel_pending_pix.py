
import asyncio
import sys
import os
from sqlalchemy import select, update

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.database import AsyncSessionLocal
from app.modules.finance.models.payment import Payment, PaymentStatus

async def cancel_pending_pix():
    async with AsyncSessionLocal() as db:
        print("🔍 Searching for PENDING Pix payments...")
        
        # 1. Find Pending Pix Payments
        stmt = select(Payment).where(
            Payment.status == PaymentStatus.PENDING,
            Payment.payment_method == "pix"
        )
        result = await db.execute(stmt)
        payments = result.scalars().all()
        
        if not payments:
            print("✅ No pending Pix payments found.")
            return

        print(f"⚠️ Found {len(payments)} pending Pix payments.")
        
        # 2. Update to FAILED
        # We set to FAILED so the background job (PaymentStatusChecker) ignores them
        # The job looks for PENDING status.
        
        update_stmt = update(Payment).where(
            Payment.status == PaymentStatus.PENDING,
            Payment.payment_method == "pix"
        ).values(
            status=PaymentStatus.FAILED,
            failed_at=func.now() if 'func' in globals() else None 
            # Note: func needs import or we can just skip failed_at or allow DB default if handled?
            # Let's just update status.
        )
        
        # Re-doing with simpler loop or correct bulk update with func
        from sqlalchemy.sql import func
        
        update_stmt = update(Payment).where(
            Payment.status == PaymentStatus.PENDING,
            Payment.payment_method == "pix"
        ).values(
            status=PaymentStatus.FAILED,
            failed_at=func.now()
        )
        
        await db.execute(update_stmt)
        await db.commit()
        
        print(f"✅ Cancelled {len(payments)} payments. Job should stop flooding API.")

if __name__ == "__main__":
    asyncio.run(cancel_pending_pix())
