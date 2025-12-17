class SettlementReleaserJob:
    """
    Background job to release pending settlements (D+N)
    """
    @staticmethod
    async def run():
        logger.info("Starting Settlement Releaser Job")
        async with AsyncSessionLocal() as db:
            try:
                count = await SettlementService.process_due_settlements(db)
                if count > 0:
                     logger.info(f"Settlement Releaser: Released {count} settlements")
                else:
                     logger.debug("Settlement Releaser: No settlements due")
            except Exception as e:
                logger.error(f"Settlement Releaser failed: {e}")
                # We do not re-raise to keep the job running next time
