from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.jobs.payment_checker import PaymentStatusChecker
import logging

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()

def start_scheduler():
    """Start the scheduler"""
    try:
        # Add tasks
        scheduler.add_job(
            PaymentStatusChecker.run,
            'interval',
            minutes=1,
            id='payment_status_checker',
            replace_existing=True
        )
        
        scheduler.start()
        logger.info("📅 Scheduler started with jobs: payment_status_checker")
        
    except Exception as e:
        logger.error(f"Failed to start scheduler: {e}")

def shutdown_scheduler():
    """Shutdown"""
    scheduler.shutdown()
