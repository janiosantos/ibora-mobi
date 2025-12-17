from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from decimal import Decimal
from uuid import UUID
import uuid

from app.services.ledger_service import LedgerService
# from app.core.config import settings
# import httpx (For real integration)
from app.core.logging import get_logger
from app.modules.incentives.models.campaign import Campaign, DriverIncentive, CampaignType

logger = get_logger(__name__)

class PaymentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.ledger_service = LedgerService(db)

    async def create_pix_charge(self, amount: Decimal, user_id: UUID) -> dict:
        """
        Creates a dynamic PIX QR Code (Mock).
        In real life, calls Efí/Gerencianet API.
        """
        txid = str(uuid.uuid4().hex)
        # Mock Response from Gateway
        return {
            "txid": txid,
            "qrcode": "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913Ibora Mobi6008Brasilia62070503***6304E2CA",
            "amount": float(amount),
            "status": "PENDING"
        }

    async def distribute_ride_payment(self, ride_id: UUID, amount: Decimal, passenger_id: UUID, driver_user_id: UUID, driver_id: UUID):
        """
        Distributes the ride payment following Blueprint Item F - Step 3.
        Entries:
        - Debit 4100 RECEITA_CORRIDAS (Full Amount) - clearing the temporary revenue booking
        - Credit 4200 COMISSAO_PLATAFORMA (20%)
        - Credit 2100 MOTORISTAS_A_PAGAR (80%)
        
        Prerequisite: The ride revenue should have been booked to 4100 already (e.g. at payment confirmation).
        If not, we verify the flow. 
        Blueprint Step 2 (Webhook) -> Credits 4100.
        Blueprint Step 3 (Distribution) -> Debits 4100, Credits Splits.
        """
        
        
        # Calculate shares
        platform_fee_percentage = Decimal("0.20")
        
        # Check for active commission discount
        # Join DriverIncentive and Campaign to filter by Campaign type and date
        stmt = (
            select(DriverIncentive)
            .join(Campaign)
            .where(
                DriverIncentive.driver_id == driver_id,
                Campaign.type == CampaignType.COMMISSION_DISCOUNT,
                Campaign.enabled == True,
                Campaign.start_date <= datetime.utcnow(),
                Campaign.end_date >= datetime.utcnow()
            )
        )
        result = await self.db.execute(stmt)
        incentive = result.scalars().first()

        if incentive:
            # Assuming reward_amount represents the discount (e.g. 0.05 for 5%)
            discount = incentive.reward_amount
            platform_fee_percentage -= discount
            if platform_fee_percentage < 0:
                platform_fee_percentage = Decimal("0.00")
            
            logger.info(
                "commission_discount_applied", 
                driver_id=str(driver_id), 
                discount=float(discount), 
                new_rate=float(platform_fee_percentage)
            )

        platform_fee = amount * platform_fee_percentage
        driver_amount = amount - platform_fee
        
        logger.info(
            "distributing_payment",
            ride_id=str(ride_id),
            total_amount=float(amount),
            driver_amount=float(driver_amount),
            platform_fee=float(platform_fee),
            driver_id=str(driver_id),
            rate=float(platform_fee_percentage)
        )
        
        # 1. Ensure Accounts Exist with correct Blueprint Codes
        # 4100 - RECEITA_CORRIDAS (Income)
        revenue_account = await self.ledger_service.get_or_create_account(
            name="Receita de Corridas",
            type="REVENUE",
            code="4100",
            classification="DETAIL",
            description="Receita bruta de corridas"
        )
        
        # 4200 - COMISSAO_PLATAFORMA (Income)
        commission_account = await self.ledger_service.get_or_create_account(
            name="Comissão Plataforma",
            type="REVENUE",
            code="4200",
            classification="DETAIL",
            description="Comissão da plataforma (20%)"
        )
        
        # 2100 - MOTORISTAS_A_PAGAR (Liability)
        # Note: This is a SUMMARY account or specific driver account? 
        # Blueprint implies a general account 2100 but breakdown by driver_id.
        # Our Ledger implementation supports specific accounts or usage of `entity_id`.
        # Ideally: One Account 2100, but broken down by Analysis (which we don't strictly have).
        # OR: Separate accounts "Motorista a Pagar - {DriverID}" mapped to parent 2100.
        # Given MVP, let's create a specific account for the driver but maybe use a suffix or just use the generic one + entity_id (if added support).
        # Current LedgerService support `get_or_create_account` by name/code. 
        # Let's use specific account per driver for easy balance check, but code needs to be unique.
        # So Driver Account Code = "2100-{driver_id_short}"
        
        driver_code = f"2100-{str(driver_id)[:8]}"
        driver_payable = await self.ledger_service.get_or_create_account(
            name=f"Motorista a Pagar - {driver_id}",
            type="LIABILITY",
            code=driver_code,
            user_id=driver_user_id,
            classification="DETAIL",
            description="Saldo a pagar ao motorista"
        )
        
        # Transaction ID
        tx_id = f"dist_{ride_id}"
        
        # Prepare Entries
        entries = [
            {
                "account_id": revenue_account.id,
                "entry_type": "DEBIT",
                "amount": amount,
                "description": f"Distribuição receita corrida {ride_id}",
                "reference_type": "RIDE_DISTRIBUTION",
                "reference_id": ride_id
            },
            {
                "account_id": commission_account.id,
                "entry_type": "CREDIT",
                "amount": platform_fee,
                "description": "Comissão plataforma 20%",
                "reference_type": "RIDE_DISTRIBUTION",
                "reference_id": ride_id
            },
            {
                "account_id": driver_payable.id,
                "entry_type": "CREDIT",
                "amount": driver_amount,
                "description": f"Saldo motorista corrida {ride_id}",
                "reference_type": "RIDE_DISTRIBUTION",
                "reference_id": ride_id
            }
        ]
        
        await self.ledger_service.create_journal_entry(tx_id, entries)
        
        return {"status": "distributed", "driver_amount": driver_amount, "platform_fee": platform_fee}


    async def process_payment_webhook(self, txid: str, amount: Decimal, user_id: UUID, ride_id: UUID = None):
        """
        Callback when payment is confirmed (Blueprint Step 2).
        Debits 1300 PIX_A_RECEBER (Asset)
        Credits 4100 RECEITA_CORRIDAS (Income)
        """
        
        # 1300 - PIX_A_RECEBER
        pix_asset = await self.ledger_service.get_or_create_account(
            name="Pix a Receber",
            type="ASSET",
            code="1300",
            classification="DETAIL",
            description="Valores a receber via Pix"
        )
        
        # 4100 - RECEITA_CORRIDAS
        revenue_account = await self.ledger_service.get_or_create_account(
            name="Receita de Corridas",
            type="REVENUE",
            code="4100",
            classification="DETAIL",
            description="Receita bruta de corridas"
        )

        entries = [
            {
                "account_id": pix_asset.id,
                "entry_type": "DEBIT",
                "amount": amount,
                "description": f"Pagamento Pix txid {txid}",
                "reference_type": "PAYMENT",
                # "reference_id": ride_id # If we have it
            },
            {
                "account_id": revenue_account.id,
                "entry_type": "CREDIT",
                "amount": amount,
                "description": f"Receita corrida (Pre-booking)",
                "reference_type": "PAYMENT",
                # "reference_id": ride_id
            }
        ]
        
        await self.ledger_service.create_journal_entry(f"pay_{txid}", entries)
        
        return {"status": "processed"}
