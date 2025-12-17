import asyncio
import logging
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from datetime import datetime
import traceback

from app.core.database import AsyncSessionLocal as async_session_factory
from app.services.payout_service import PayoutService
from app.modules.finance.models.payout import Payout
from app.modules.finance.models.ledger import LedgerAccount, LedgerRunningBalance, LedgerEntry

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def process_pending_payouts():
    """
    Finds PENDING payouts and processes them.
    """
    async with async_session_factory() as session:
        payout_service = PayoutService(session)
        
        # Select pending payouts
        result = await session.execute(select(Payout.id).where(Payout.status == 'PENDING'))
        payout_ids = result.scalars().all()
        
        if payout_ids:
            logger.info(f"Found {len(payout_ids)} pending payouts. Processing...")
            
        for payout_id in payout_ids:
            try:
                await payout_service.process_payout(payout_id)
                logger.info(f"Processed payout {payout_id}")
            except Exception as e:
                logger.error(f"Error processing payout {payout_id}: {e}")
                # traceback.print_exc()

async def update_running_balances():
    """
    Updates running balances for active accounts.
    """
    async with async_session_factory() as session:
        # 1. Find active Driver Liability accounts (2100-%)
        # For MVP, just updating all 2100 accounts modified recently?
        # Or iterate all drivers.
        
        # Let's simple check all accounts with entries since last run? 
        # For MVP, iterate all active ledger accounts with code starting '2100'
        
        result = await session.execute(
            select(LedgerAccount).where(LedgerAccount.code.like('2100-%'))
        )
        accounts = result.scalars().all()
        
        for account in accounts:
            # Check latest running balance
            # For this demo, we just print/log. Real impl updates LedgerRunningBalance table.
            pass

async def main():
    logger.info("Starting Financial Worker...")
    while True:
        try:
            await process_pending_payouts()
            # await update_running_balances()
        except Exception as e:
            logger.error(f"Worker Error: {e}")
            traceback.print_exc()
            
        await asyncio.sleep(10) # Poll every 10s

if __name__ == "__main__":
    asyncio.run(main())
