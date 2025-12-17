from sqlalchemy.ext.asyncio import AsyncSession
from decimal import Decimal
from uuid import UUID
import uuid

from app.services.ledger_service import LedgerService
# from app.core.config import settings
# import httpx (For real integration)

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

    async def distribute_ride_payment(self, ride_id: UUID, amount: Decimal, passenger_id: UUID, driver_user_id: UUID):
        """
        Distributes the ride payment:
        1. Debit Passenger Wallet (Liability Decrease)
        2. Credit Driver Wallet (Liability Increase) - 80%
        3. Credit Platform Revenue (Revenue Increase) - 20%
        """
        
        # Calculate shares
        platform_fee_percentage = Decimal("0.20")
        platform_fee = amount * platform_fee_percentage
        driver_amount = amount - platform_fee
        
        # 1. Accounts
        passenger_wallet = await self.ledger_service.get_or_create_account(f"User Wallet - {passenger_id}", "LIABILITY", passenger_id)
        driver_wallet = await self.ledger_service.get_or_create_account(f"User Wallet - {driver_user_id}", "LIABILITY", driver_user_id)
        platform_revenue = await self.ledger_service.get_or_create_account("Platform Revenue Account", "REVENUE")
        
        # 2. Transaction 1: Transfer from Passenger to Driver & Platform
        # Since our ledger supports 1 debit / 1 credit per atomic call, we split into TWO transactions or ONE complex if supported.
        # Current implementation supports 1 debit / 1 credit.
        # We can implement a multi-entry transaction in LedgerService or just do 2 calls.
        # Better approach for double-entry:
        # T1: Debit Passenger Wallet (Full Amount), Credit Intermediate/Settlement Account (or Driver directly then pay fee?)
        # Let's do:
        # T1: Debit Passenger, Credit Driver (Full Amount)
        # T2: Debit Driver, Credit Platform (Fee) -> This mimics "commission" being taken out.
        # OR
        # T1: Debit Passenger, Credit Platform Clearing (Asset/Liability)
        # T2: Debit Platform Clearing, Credit Driver
        # T3: Debit Platform Clearing, Credit Revenue
        
        # Simpler for this MVP:
        # T1: Debit Passenger, Credit Driver (Driver Amount)
        # T2: Debit Passenger, Credit Revenue (Fee Amount)
        
        # Transaction 1: Pay Driver Name
        await self.ledger_service.record_transaction(
            debit_account_id=passenger_wallet.id,
            credit_account_id=driver_wallet.id,
            amount=driver_amount,
            description=f"Ride {ride_id} Payment (Driver Share)",
            reference_type="RIDE_PAYMENT",
            reference_id=ride_id
        )
        
        # Transaction 2: Pay Platform Fee
        await self.ledger_service.record_transaction(
            debit_account_id=passenger_wallet.id,
            credit_account_id=platform_revenue.id,
            amount=platform_fee,
            description=f"Ride {ride_id} Platform Fee",
            reference_type="RIDE_FEE",
            reference_id=ride_id
        )
        
        return {"status": "distributed", "driver_amount": driver_amount, "platform_fee": platform_fee}

    async def process_payment_webhook(self, txid: str, amount: Decimal, user_id: UUID):
        """
        Callback when payment is confirmed.
        Records entry in Ledger.
        """
        # 1. Find or Create User Wallet Account (Liability for Platform)
        # 2. Find or Create Bank Account (Asset for Platform)
        
        # Assumption: System accounts created on startup or on demand
        wallet_name = f"User Wallet - {user_id}"
        bank_name = "Platform Main Bank Account"
        
        wallet = await self.ledger_service.get_or_create_account(wallet_name, "LIABILITY", user_id) 
        bank = await self.ledger_service.get_or_create_account(bank_name, "ASSET")
        
        # Transaction: 
        # Debit Bank (Increase Asset)
        # Credit User Wallet (Increase Liability - Platform owes user service/money)
        
        await self.ledger_service.record_transaction(
            debit_account_id=bank.id,
            credit_account_id=wallet.id,
            amount=amount,
            description=f"Topup via PIX txid {txid}",
            reference_type="TOPUP",
            reference_id=None # Could be payment record ID
        )
        
        return {"status": "processed"}
