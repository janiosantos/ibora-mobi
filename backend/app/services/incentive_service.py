from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
from uuid import UUID
from datetime import datetime
from typing import Optional, List
from decimal import Decimal

from app.modules.incentives.models.campaign import Campaign, DriverMetric, DriverIncentive, CampaignType
from app.modules.finance.models import LedgerAccount
from app.services.ledger_service import LedgerService

class IncentiveService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.ledger_service = LedgerService(db)

    async def create_campaign(self, name: str, start_date: datetime, end_date: datetime, type: CampaignType, rules: dict) -> Campaign:
        campaign = Campaign(
            name=name,
            start_date=start_date,
            end_date=end_date,
            type=type,
            rules=rules
        )
        self.db.add(campaign)
        await self.db.commit()
        await self.db.refresh(campaign)
        return campaign

    async def track_ride_event(self, driver_id: UUID, event_type: str, ride_value: float = 0.0, ride_km: float = 0.0):
        """
        Updates daily metrics for the driver.
        event_type: 'accepted', 'completed', 'cancelled'
        """
        today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Get or create Metric for today
        result = await self.db.execute(
            select(DriverMetric).where(
                DriverMetric.driver_id == driver_id,
                DriverMetric.date == today
            )
        )
        metric = result.scalars().first()
        
        if not metric:
            metric = DriverMetric(
                driver_id=driver_id, 
                date=today,
                rides_accepted=0,
                rides_completed=0,
                rides_cancelled=0,
                total_km=Decimal(0),
                total_earnings=Decimal(0)
            )
            self.db.add(metric)
        
        # Ensure values are Decimal
        d_value = Decimal(str(ride_value)) if not isinstance(ride_value, Decimal) else ride_value
        d_km = Decimal(str(ride_km)) if not isinstance(ride_km, Decimal) else ride_km

        if event_type == "accepted":
            metric.rides_accepted += 1
        elif event_type == "completed":
            metric.rides_completed += 1
            metric.total_earnings = (metric.total_earnings or Decimal(0)) + d_value
            metric.total_km = (metric.total_km or Decimal(0)) + d_km
        elif event_type == "cancelled":
            metric.rides_cancelled += 1
            
        await self.db.commit()
        await self.db.refresh(metric)
        
        # Check eligibility for active campaigns
        if event_type == "completed":
            await self.check_campaign_eligibility(driver_id, metric)

    async def check_campaign_eligibility(self, driver_id: UUID, metric: DriverMetric):
        """
        Checks if driver meets criteria for any active campaign.
        """
        now = datetime.utcnow()
        result = await self.db.execute(
            select(Campaign).where(
                Campaign.enabled == True,
                Campaign.start_date <= now,
                Campaign.end_date >= now
            )
        )
        campaigns = result.scalars().all()
        
        for campaign in campaigns:
            # Check if incentive record exists
            res_inc = await self.db.execute(
                select(DriverIncentive).where(
                    DriverIncentive.driver_id == driver_id,
                    DriverIncentive.campaign_id == campaign.id
                )
            )
            incentive = res_inc.scalars().first()
            
            if not incentive:
                # Initialize Incentive Tracker
                target = int(campaign.rules.get("target_count", 0))
                reward_val = campaign.rules.get("reward_amount", 0.0)
                reward = Decimal(str(reward_val))
                
                incentive = DriverIncentive(
                    driver_id=driver_id,
                    campaign_id=campaign.id,
                    target_value=target,
                    reward_amount=reward,
                    current_value=0
                )
                self.db.add(incentive)
            
            if incentive.achieved:
                continue
                
            # Logic per type
            if campaign.type == CampaignType.TARGET_RIDE_COUNT:
                # Update progress
                # Note: Simplification - we are counting TODAY's rides. Real implementation needs global count during campaign period.
                # For MVP, we assume Daily Campaigns logic or cumulative.
                # Let's verify cumulative by querying total completed rides in period.
                
                # Fetch total rides in period (Simplified to incrementing)
                incentive.current_value += 1
                
                if incentive.current_value >= incentive.target_value:
                     incentive.achieved = True
                     incentive.achieved_at = datetime.utcnow()
                     await self.payout_incentive(incentive)
                     
            await self.db.commit()

    async def payout_incentive(self, incentive: DriverIncentive):
        """
        Pay the driver via Ledger.
        """
        if incentive.paid:
            return

        # Credit Driver Wallet
        # Debit Platform Expense (Incentives)
        
        description = f"Reward for Campaign {incentive.campaign_id}"
        
        # 1. Driver Wallet (Liability)
        driver_code = f"2100-{str(incentive.driver_id)[:8]}"
        driver_payable = await self.ledger_service.get_or_create_account(
            name=f"Motorista a Pagar - {incentive.driver_id}",
            type="LIABILITY",
            code=driver_code,
            user_id=incentive.driver_id,
            classification="DETAIL",
            description="Saldo a pagar ao motorista"
        )
        
        # 2. Incentive Expense (Expense)
        # Using 5400 for Incentives (Extending the 5xxx series)
        incentive_expense = await self.ledger_service.get_or_create_account(
            name="Despesas com Incentivos",
            type="EXPENSE",
            code="5400",
            classification="DETAIL",
            description="Pagamento de bônus e incentivos"
        )
        
        # Transaction: Debit Expense (Increase Expense), Credit Liability (Increase User Balance)
        await self.ledger_service.record_transaction(
             amount=incentive.reward_amount, # Should be Decimal now
             debit_account_id=incentive_expense.id,
             credit_account_id=driver_payable.id,
             description=description,
             reference_type="INCENTIVE",
             reference_id=incentive.id
        )

        incentive.paid = True
        incentive.paid_at = datetime.utcnow()
