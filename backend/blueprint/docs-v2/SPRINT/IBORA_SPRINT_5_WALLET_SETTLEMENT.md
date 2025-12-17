# 🎫 IBORA: SPRINT 5 COMPLETO - WALLET & SETTLEMENT
## Tasks Granulares com Código Real Production-Ready

---

# SPRINT 5: WALLET & SETTLEMENT (D+N)
**Duração:** Semanas 9-10 (10 dias úteis)  
**Objetivo:** Sistema de carteira e repasse D+N funcionando  
**Team:** 5 pessoas  
**Velocity target:** 38 SP

---

## 📊 DISTRIBUIÇÃO DO TRABALHO

| Epic | Story Points | Status |
|------|--------------|--------|
| 5.1 Driver Wallet | 13 SP | ✅ COMPLETO |
| 5.2 D+N Settlement | 15 SP | ✅ COMPLETO |
| 5.3 Payout Integration | 10 SP | ✅ COMPLETO |
| **TOTAL** | **38 SP** | ✅ 100% |

---

## EPIC 5.1: DRIVER WALLET (13 SP) ✅

---

### [BACKEND] Task 5.1.1: Wallet Model & Balance Calculation
**Responsável:** Backend Dev 1  
**Estimativa:** 5 SP  
**Prioridade:** P0  
**Duração:** 1 dia

**Descrição:**
Criar modelo de wallet do motorista com múltiplos tipos de saldo.

**Conceitos:**
```
1. Total Balance = SUM(all completed events)
2. Held Balance = Events in D+N hold
3. Available Balance = Total - Held - Blocked
4. Blocked Balance = Disputes, chargebacks
5. Credit Balance = Pre-paid usage credit
```

**Model:**
```python
# backend/src/models/wallet.py
from sqlalchemy import Column, Integer, Float, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from src.models.base import TimestampMixin
from src.core.database import Base

class DriverWallet(Base, TimestampMixin):
    """
    Driver wallet
    
    Tracks different balance types:
    - total_balance: All earnings
    - held_balance: D+N settlement hold
    - blocked_balance: Disputes, chargebacks
    - available_balance: Can withdraw
    - credit_balance: Pre-paid usage credit
    """
    __tablename__ = "driver_wallets"
    
    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"), unique=True, nullable=False, index=True)
    
    # Balance fields (in BRL)
    total_balance = Column(Float, default=0.0, nullable=False)
    held_balance = Column(Float, default=0.0, nullable=False)
    blocked_balance = Column(Float, default=0.0, nullable=False)
    available_balance = Column(Float, default=0.0, nullable=False)
    credit_balance = Column(Float, default=0.0, nullable=False)
    
    # Withdrawal limits
    minimum_withdrawal = Column(Float, default=50.0, nullable=False)  # R$ 50.00
    
    # Stats
    total_earned = Column(Float, default=0.0, nullable=False)
    total_withdrawn = Column(Float, default=0.0, nullable=False)
    
    # Relationships
    driver = relationship("Driver", back_populates="wallet")
    
    # Constraints
    __table_args__ = (
        CheckConstraint('total_balance >= 0', name='check_total_balance_positive'),
        CheckConstraint('held_balance >= 0', name='check_held_balance_positive'),
        CheckConstraint('blocked_balance >= 0', name='check_blocked_balance_positive'),
        CheckConstraint('available_balance >= 0', name='check_available_balance_positive'),
        CheckConstraint('credit_balance >= 0', name='check_credit_balance_positive'),
    )
    
    def __repr__(self):
        return f"<DriverWallet(driver_id={self.driver_id}, available={self.available_balance})>"
```

**Migration:**
```python
# backend/alembic/versions/008_add_driver_wallets.py
"""Add driver wallets

Revision ID: 008
"""
from alembic import op
import sqlalchemy as sa

revision = '008'
down_revision = '007'

def upgrade():
    op.create_table(
        'driver_wallets',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('driver_id', sa.Integer(), sa.ForeignKey('drivers.id'), nullable=False),
        sa.Column('total_balance', sa.Float(), nullable=False, server_default='0'),
        sa.Column('held_balance', sa.Float(), nullable=False, server_default='0'),
        sa.Column('blocked_balance', sa.Float(), nullable=False, server_default='0'),
        sa.Column('available_balance', sa.Float(), nullable=False, server_default='0'),
        sa.Column('credit_balance', sa.Float(), nullable=False, server_default='0'),
        sa.Column('minimum_withdrawal', sa.Float(), nullable=False, server_default='50.0'),
        sa.Column('total_earned', sa.Float(), nullable=False, server_default='0'),
        sa.Column('total_withdrawn', sa.Float(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.UniqueConstraint('driver_id'),
        sa.CheckConstraint('total_balance >= 0', name='check_total_balance_positive'),
        sa.CheckConstraint('held_balance >= 0', name='check_held_balance_positive'),
        sa.CheckConstraint('blocked_balance >= 0', name='check_blocked_balance_positive'),
        sa.CheckConstraint('available_balance >= 0', name='check_available_balance_positive'),
        sa.CheckConstraint('credit_balance >= 0', name='check_credit_balance_positive')
    )
    
    op.create_index('ix_driver_wallets_driver_id', 'driver_wallets', ['driver_id'])

def downgrade():
    op.drop_table('driver_wallets')
```

**Service:**
```python
# backend/src/services/wallet_service.py
from src.models.wallet import DriverWallet
from src.services.ledger import LedgerService
from src.models.financial_event import EventType, EventStatus
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger(__name__)

class WalletService:
    """
    Manage driver wallet
    """
    
    @staticmethod
    def get_or_create_wallet(driver_id: int, db: Session) -> DriverWallet:
        """
        Get driver wallet or create if doesn't exist
        """
        wallet = db.query(DriverWallet).filter(
            DriverWallet.driver_id == driver_id
        ).first()
        
        if not wallet:
            wallet = DriverWallet(driver_id=driver_id)
            db.add(wallet)
            db.commit()
            db.refresh(wallet)
            
            logger.info(f"Wallet created for driver {driver_id}")
        
        return wallet
    
    @staticmethod
    def calculate_balances(driver_id: int, db: Session) -> dict:
        """
        Calculate all balance types from financial events
        
        Returns:
            {
                "total_balance": float,
                "held_balance": float,
                "blocked_balance": float,
                "available_balance": float,
                "credit_balance": float
            }
        """
        
        # Get all earnings (RIDE_EARNING, INCENTIVE_BONUS, ADJUSTMENT_CREDIT)
        earnings_types = [
            EventType.RIDE_EARNING,
            EventType.INCENTIVE_BONUS,
            EventType.ADJUSTMENT_CREDIT,
            EventType.WALLET_DEPOSIT
        ]
        
        earnings = LedgerService.get_balance(
            driver_id=driver_id,
            db=db,
            include_pending=False
        )
        
        # Get withdrawals (negative events)
        withdrawals_types = [
            EventType.WALLET_WITHDRAWAL,
            EventType.ADJUSTMENT_DEBIT,
            EventType.PAYOUT_COMPLETED
        ]
        
        # Calculate held balance (events in D+N hold)
        from src.models.settlement import Settlement, SettlementStatus
        from sqlalchemy import func
        
        held_balance = db.query(
            func.sum(Settlement.amount)
        ).filter(
            Settlement.driver_id == driver_id,
            Settlement.status.in_([
                SettlementStatus.PENDING,
                SettlementStatus.PROCESSING
            ])
        ).scalar() or 0.0
        
        # Calculate blocked balance (disputes, chargebacks)
        # TODO: Implement in Sprint 7+
        blocked_balance = 0.0
        
        # Calculate credit balance (pre-paid usage)
        credit_events = db.query(FinancialEvent).filter(
            FinancialEvent.driver_id == driver_id,
            FinancialEvent.event_type == EventType.INCENTIVE_CREDIT,
            FinancialEvent.status == EventStatus.COMPLETED
        ).all()
        
        credit_balance = sum(e.amount for e in credit_events)
        
        # Total balance
        total_balance = earnings
        
        # Available balance
        available_balance = total_balance - held_balance - blocked_balance
        available_balance = max(0.0, available_balance)  # Never negative
        
        return {
            "total_balance": round(total_balance, 2),
            "held_balance": round(held_balance, 2),
            "blocked_balance": round(blocked_balance, 2),
            "available_balance": round(available_balance, 2),
            "credit_balance": round(credit_balance, 2)
        }
    
    @staticmethod
    def update_wallet(driver_id: int, db: Session) -> DriverWallet:
        """
        Recalculate and update wallet balances
        
        Should be called after financial events
        """
        wallet = WalletService.get_or_create_wallet(driver_id, db)
        
        balances = WalletService.calculate_balances(driver_id, db)
        
        # Update wallet
        wallet.total_balance = balances["total_balance"]
        wallet.held_balance = balances["held_balance"]
        wallet.blocked_balance = balances["blocked_balance"]
        wallet.available_balance = balances["available_balance"]
        wallet.credit_balance = balances["credit_balance"]
        
        db.commit()
        db.refresh(wallet)
        
        logger.info(
            f"Wallet updated: driver_id={driver_id}, "
            f"available=R${wallet.available_balance}"
        )
        
        return wallet
    
    @staticmethod
    def can_withdraw(
        driver_id: int,
        amount: float,
        db: Session
    ) -> tuple[bool, str]:
        """
        Check if driver can withdraw amount
        
        Returns:
            (can_withdraw, reason)
        """
        wallet = WalletService.get_or_create_wallet(driver_id, db)
        
        # Check minimum
        if amount < wallet.minimum_withdrawal:
            return False, f"Minimum withdrawal is R${wallet.minimum_withdrawal}"
        
        # Check available balance
        if amount > wallet.available_balance:
            return False, f"Insufficient balance (available: R${wallet.available_balance})"
        
        # Check if driver has pending withdrawals
        pending_withdrawals = db.query(FinancialEvent).filter(
            FinancialEvent.driver_id == driver_id,
            FinancialEvent.event_type.in_([
                EventType.WALLET_WITHDRAWAL,
                EventType.PAYOUT_PROCESSING
            ]),
            FinancialEvent.status == EventStatus.PENDING
        ).count()
        
        if pending_withdrawals > 0:
            return False, "You have pending withdrawals"
        
        return True, ""
```

**Endpoint:**
```python
# backend/src/api/v1/wallet.py
from fastapi import APIRouter, Depends, HTTPException
from src.services.wallet_service import WalletService
from src.models.driver import Driver

router = APIRouter()

@router.get("/drivers/me/wallet")
async def get_my_wallet(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get driver wallet
    
    Returns:
        {
            "total_balance": float,
            "held_balance": float,
            "blocked_balance": float,
            "available_balance": float,
            "credit_balance": float,
            "minimum_withdrawal": float,
            "can_withdraw": bool
        }
    """
    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()
    
    if not driver:
        raise HTTPException(404, "Driver profile not found")
    
    # Update wallet balances
    wallet = WalletService.update_wallet(driver.id, db)
    
    # Check if can withdraw minimum amount
    can_withdraw, _ = WalletService.can_withdraw(
        driver.id,
        wallet.minimum_withdrawal,
        db
    )
    
    return {
        "total_balance": wallet.total_balance,
        "held_balance": wallet.held_balance,
        "blocked_balance": wallet.blocked_balance,
        "available_balance": wallet.available_balance,
        "credit_balance": wallet.credit_balance,
        "minimum_withdrawal": wallet.minimum_withdrawal,
        "can_withdraw": can_withdraw,
        "stats": {
            "total_earned": wallet.total_earned,
            "total_withdrawn": wallet.total_withdrawn
        }
    }
```

**Tests:**
```python
# backend/tests/test_wallet_service.py
import pytest
from src.services.wallet_service import WalletService

def test_get_or_create_wallet(db, db_driver):
    """Creates wallet if doesn't exist"""
    wallet = WalletService.get_or_create_wallet(db_driver.id, db)
    
    assert wallet.driver_id == db_driver.id
    assert wallet.total_balance == 0.0

def test_calculate_balances(db, db_driver_with_earnings):
    """Calculates balances correctly"""
    balances = WalletService.calculate_balances(
        db_driver_with_earnings.id,
        db
    )
    
    assert balances["total_balance"] > 0
    assert balances["available_balance"] >= 0

def test_can_withdraw_minimum(db, db_driver):
    """Checks minimum withdrawal"""
    wallet = WalletService.get_or_create_wallet(db_driver.id, db)
    
    can, reason = WalletService.can_withdraw(
        db_driver.id,
        30.00,  # Below minimum R$ 50
        db
    )
    
    assert can is False
    assert "minimum" in reason.lower()

def test_can_withdraw_insufficient_balance(db, db_driver):
    """Checks available balance"""
    can, reason = WalletService.can_withdraw(
        db_driver.id,
        1000.00,  # More than available
        db
    )
    
    assert can is False
    assert "insufficient" in reason.lower()
```

**Critérios de Aceite:**
- [ ] Wallet model criado
- [ ] Migration aplicada
- [ ] Constraints (positive balances)
- [ ] WalletService calcula balances
- [ ] Distingue total/held/blocked/available
- [ ] Endpoint GET /wallet retorna balances
- [ ] can_withdraw valida regras
- [ ] Testes passam (4 cenários)

---

### [BACKEND] Task 5.1.2: Withdrawal Request
**Responsável:** Backend Dev 1  
**Estimativa:** 5 SP  
**Duração:** 1 dia

**Descrição:**
Endpoint para motorista solicitar saque.

**Schema:**
```python
# backend/src/schemas/wallet.py
from pydantic import BaseModel, field_validator

class WithdrawalRequest(BaseModel):
    amount: float
    pix_key: str
    pix_key_type: str  # "cpf", "cnpj", "email", "phone", "random"
    
    @field_validator('amount')
    @classmethod
    def validate_amount(cls, v):
        if v <= 0:
            raise ValueError('Amount must be positive')
        if v < 50.0:
            raise ValueError('Minimum withdrawal is R$ 50.00')
        return v
    
    @field_validator('pix_key')
    @classmethod
    def validate_pix_key(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Pix key is required')
        return v.strip()

class WithdrawalResponse(BaseModel):
    id: int
    amount: float
    status: str
    pix_key: str
    created_at: str
    estimated_completion: str  # When it will be processed
    
    class Config:
        from_attributes = True
```

**Endpoint:**
```python
# backend/src/api/v1/wallet.py

@router.post("/drivers/me/withdrawals")
async def request_withdrawal(
    withdrawal: WithdrawalRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Request withdrawal
    
    Creates WALLET_WITHDRAWAL event (PENDING)
    Actual payout happens in background job
    
    Returns:
        Withdrawal details
    """
    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()
    
    if not driver:
        raise HTTPException(404, "Driver profile not found")
    
    # Check if can withdraw
    can_withdraw, reason = WalletService.can_withdraw(
        driver.id,
        withdrawal.amount,
        db
    )
    
    if not can_withdraw:
        raise HTTPException(400, reason)
    
    # Create withdrawal event
    event = LedgerService.create_event(
        event_type=EventType.WALLET_WITHDRAWAL,
        amount=-withdrawal.amount,  # Negative (debit)
        driver_id=driver.id,
        description=f"Withdrawal request: R${withdrawal.amount}",
        status=EventStatus.PENDING,
        metadata={
            "pix_key": withdrawal.pix_key,
            "pix_key_type": withdrawal.pix_key_type
        },
        db=db
    )
    
    # Update wallet (reduce available balance)
    WalletService.update_wallet(driver.id, db)
    
    # Schedule payout (background)
    from src.jobs.payout_processor import PayoutProcessor
    PayoutProcessor.schedule_payout(event.id)
    
    logger.info(
        f"Withdrawal requested: driver_id={driver.id}, "
        f"amount=R${withdrawal.amount}, event_id={event.id}"
    )
    
    return {
        "id": event.id,
        "amount": withdrawal.amount,
        "status": "pending",
        "pix_key": withdrawal.pix_key,
        "created_at": event.created_at.isoformat(),
        "estimated_completion": (event.created_at + timedelta(hours=2)).isoformat()
    }

@router.get("/drivers/me/withdrawals")
async def get_my_withdrawals(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get withdrawal history
    """
    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()
    
    if not driver:
        raise HTTPException(404, "Driver profile not found")
    
    # Get withdrawals
    query = db.query(FinancialEvent).filter(
        FinancialEvent.driver_id == driver.id,
        FinancialEvent.event_type.in_([
            EventType.WALLET_WITHDRAWAL,
            EventType.PAYOUT_COMPLETED,
            EventType.PAYOUT_FAILED
        ])
    )
    
    total = query.count()
    
    offset = (page - 1) * page_size
    events = query.order_by(
        FinancialEvent.created_at.desc()
    ).limit(page_size).offset(offset).all()
    
    withdrawals = [
        {
            "id": e.id,
            "amount": abs(e.amount),
            "status": e.status.value,
            "pix_key": e.metadata.get("pix_key") if e.metadata else None,
            "created_at": e.created_at.isoformat(),
            "completed_at": e.completed_at.isoformat() if e.completed_at else None
        }
        for e in events
    ]
    
    return {
        "withdrawals": withdrawals,
        "page": page,
        "page_size": page_size,
        "total": total
    }
```

**Tests:**
```python
# backend/tests/test_withdrawal.py

@pytest.mark.asyncio
async def test_request_withdrawal_success(
    async_client,
    db_driver_with_balance,
    driver_token
):
    """Driver can request withdrawal"""
    response = await async_client.post(
        "/api/v1/wallet/drivers/me/withdrawals",
        json={
            "amount": 100.00,
            "pix_key": "12345678909",
            "pix_key_type": "cpf"
        },
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["amount"] == 100.00
    assert data["status"] == "pending"
    assert "pix_key" in data

@pytest.mark.asyncio
async def test_request_withdrawal_below_minimum_fails(
    async_client,
    driver_token
):
    """Cannot withdraw below minimum"""
    response = await async_client.post(
        "/api/v1/wallet/drivers/me/withdrawals",
        json={
            "amount": 30.00,  # Below R$ 50
            "pix_key": "12345678909",
            "pix_key_type": "cpf"
        },
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 400
    assert "minimum" in response.text.lower()

@pytest.mark.asyncio
async def test_request_withdrawal_insufficient_balance_fails(
    async_client,
    db_driver,
    driver_token
):
    """Cannot withdraw more than available"""
    response = await async_client.post(
        "/api/v1/wallet/drivers/me/withdrawals",
        json={
            "amount": 1000.00,
            "pix_key": "12345678909",
            "pix_key_type": "cpf"
        },
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 400
    assert "insufficient" in response.text.lower()
```

**Critérios de Aceite:**
- [ ] POST /withdrawals solicita saque
- [ ] Valida saldo disponível
- [ ] Valida mínimo R$ 50
- [ ] Cria WALLET_WITHDRAWAL event
- [ ] Atualiza wallet
- [ ] GET /withdrawals retorna histórico
- [ ] Testes passam (3 cenários)

---

### [BACKEND] Task 5.1.3: Wallet Transaction History
**Responsável:** Backend Dev 2  
**Estimativa:** 3 SP  
**Duração:** 6 horas

**Descrição:**
Endpoint para visualizar histórico completo da wallet.

**Endpoint:**
```python
# backend/src/api/v1/wallet.py

@router.get("/drivers/me/wallet/transactions")
async def get_wallet_transactions(
    transaction_type: str = Query(None),  # "earning", "withdrawal", "all"
    start_date: datetime = Query(None),
    end_date: datetime = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get wallet transaction history
    
    Query params:
    - transaction_type: Filter by type
    - start_date, end_date: Date range
    - page, page_size: Pagination
    
    Returns:
        Paginated transaction list
    """
    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()
    
    if not driver:
        raise HTTPException(404, "Driver profile not found")
    
    # Build query
    query = db.query(FinancialEvent).filter(
        FinancialEvent.driver_id == driver.id,
        FinancialEvent.status == EventStatus.COMPLETED
    )
    
    # Filter by type
    if transaction_type == "earning":
        query = query.filter(
            FinancialEvent.event_type.in_([
                EventType.RIDE_EARNING,
                EventType.INCENTIVE_BONUS,
                EventType.ADJUSTMENT_CREDIT
            ])
        )
    elif transaction_type == "withdrawal":
        query = query.filter(
            FinancialEvent.event_type.in_([
                EventType.WALLET_WITHDRAWAL,
                EventType.PAYOUT_COMPLETED
            ])
        )
    
    # Date filters
    if start_date:
        query = query.filter(FinancialEvent.created_at >= start_date)
    if end_date:
        query = query.filter(FinancialEvent.created_at <= end_date)
    
    # Count
    total = query.count()
    
    # Paginate
    offset = (page - 1) * page_size
    events = query.order_by(
        FinancialEvent.created_at.desc()
    ).limit(page_size).offset(offset).all()
    
    # Format
    transactions = [
        {
            "id": e.id,
            "type": e.event_type.value,
            "amount": e.amount,
            "description": e.description,
            "ride_id": e.ride_id,
            "created_at": e.created_at.isoformat(),
            "metadata": e.metadata
        }
        for e in events
    ]
    
    # Get current balance
    wallet = WalletService.get_or_create_wallet(driver.id, db)
    
    return {
        "current_balance": wallet.available_balance,
        "transactions": transactions,
        "page": page,
        "page_size": page_size,
        "total": total
    }
```

**Critérios de Aceite:**
- [ ] Endpoint retorna histórico completo
- [ ] Filtros funcionam (type, date)
- [ ] Paginação funciona
- [ ] Mostra balance atual
- [ ] Performance: p95 < 300ms

---

## EPIC 5.2: D+N SETTLEMENT (15 SP) ✅

---

### [BACKEND] Task 5.2.1: Settlement Model & Hold Mechanism
**Responsável:** Backend Dev 1  
**Estimativa:** 6 SP  
**Prioridade:** P0  
**Duração:** 1 dia

**Descrição:**
Implementar modelo de settlement (repasse D+N) com hold/release.

**Conceito D+N:**
```
D+0 = Imediato (alto risco)
D+1 = 1 dia útil (padrão mercado)
D+2 = 2 dias úteis (iBora padrão)
D+7 = 7 dias (conservador)

Exemplo D+2:
- Corrida paga Segunda 10h → Repasse Quarta 10h
- Corrida paga Sexta 18h → Repasse Terça 10h (pula fim de semana)
```

**Model:**
```python
# backend/src/models/settlement.py
from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, Enum as SQLEnum, Date
from sqlalchemy.orm import relationship
from src.models.base import TimestampMixin
from src.core.database import Base
import enum

class SettlementStatus(str, enum.Enum):
    PENDING = "pending"        # Waiting for D+N
    PROCESSING = "processing"  # Payout initiated
    COMPLETED = "completed"    # Paid
    FAILED = "failed"          # Payout failed

class Settlement(Base, TimestampMixin):
    """
    Settlement record (D+N hold and release)
    
    Represents money held for D+N days before becoming available
    """
    __tablename__ = "settlements"
    
    id = Column(Integer, primary_key=True, index=True)
    
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=False, index=True)
    earning_event_id = Column(Integer, ForeignKey("financial_events.id"), nullable=False, unique=True)
    
    # Amount details
    amount = Column(Float, nullable=False)
    hold_days = Column(Integer, nullable=False)  # D+N value
    
    # Dates
    held_at = Column(DateTime, nullable=False)
    release_date = Column(Date, nullable=False, index=True)  # When it becomes available
    released_at = Column(DateTime, nullable=True)
    
    # Status
    status = Column(SQLEnum(SettlementStatus), default=SettlementStatus.PENDING, nullable=False, index=True)
    
    # Related events
    hold_event_id = Column(Integer, ForeignKey("financial_events.id"), nullable=True)
    release_event_id = Column(Integer, ForeignKey("financial_events.id"), nullable=True)
    
    # Relationships
    driver = relationship("Driver")
    earning_event = relationship("FinancialEvent", foreign_keys=[earning_event_id])
    hold_event = relationship("FinancialEvent", foreign_keys=[hold_event_id])
    release_event = relationship("FinancialEvent", foreign_keys=[release_event_id])
```

**Migration:**
```python
# backend/alembic/versions/009_add_settlements.py
"""Add settlements table

Revision ID: 009
"""
from alembic import op
import sqlalchemy as sa

revision = '009'
down_revision = '008'

def upgrade():
    op.execute("""
        CREATE TYPE settlementstatus AS ENUM ('pending', 'processing', 'completed', 'failed')
    """)
    
    op.create_table(
        'settlements',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('driver_id', sa.Integer(), sa.ForeignKey('drivers.id'), nullable=False),
        sa.Column('earning_event_id', sa.Integer(), sa.ForeignKey('financial_events.id'), nullable=False),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('hold_days', sa.Integer(), nullable=False),
        sa.Column('held_at', sa.DateTime(), nullable=False),
        sa.Column('release_date', sa.Date(), nullable=False),
        sa.Column('released_at', sa.DateTime()),
        sa.Column('status', sa.Enum(name='settlementstatus'), nullable=False),
        sa.Column('hold_event_id', sa.Integer(), sa.ForeignKey('financial_events.id')),
        sa.Column('release_event_id', sa.Integer(), sa.ForeignKey('financial_events.id')),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.UniqueConstraint('earning_event_id')
    )
    
    op.create_index('ix_settlements_driver_id', 'settlements', ['driver_id'])
    op.create_index('ix_settlements_release_date', 'settlements', ['release_date'])
    op.create_index('ix_settlements_status', 'settlements', ['status'])

def downgrade():
    op.drop_table('settlements')
    op.execute('DROP TYPE settlementstatus')
```

**Service:**
```python
# backend/src/services/settlement_service.py
from src.models.settlement import Settlement, SettlementStatus
from src.services.ledger import LedgerService
from src.models.financial_event import EventType, EventStatus
from datetime import datetime, timedelta, date
import logging

logger = logging.getLogger(__name__)

class SettlementService:
    """
    Manage D+N settlement
    """
    
    DEFAULT_HOLD_DAYS = 2  # D+2
    
    @staticmethod
    def calculate_release_date(
        from_date: datetime,
        hold_days: int
    ) -> date:
        """
        Calculate release date (skip weekends)
        
        Args:
            from_date: Start date
            hold_days: Number of business days to hold
        
        Returns:
            Release date
        """
        current = from_date.date()
        days_added = 0
        
        while days_added < hold_days:
            current += timedelta(days=1)
            
            # Skip weekends
            if current.weekday() < 5:  # Monday=0, Sunday=6
                days_added += 1
        
        return current
    
    @staticmethod
    def create_hold(
        earning_event_id: int,
        driver_id: int,
        amount: float,
        hold_days: int = None,
        db = None
    ) -> Settlement:
        """
        Create settlement hold for earning
        
        Args:
            earning_event_id: Financial event ID (RIDE_EARNING)
            driver_id: Driver ID
            amount: Amount to hold
            hold_days: D+N value (default 2)
            db: Database session
        
        Returns:
            Settlement record
        """
        hold_days = hold_days or SettlementService.DEFAULT_HOLD_DAYS
        
        # Calculate release date
        held_at = datetime.utcnow()
        release_date = SettlementService.calculate_release_date(
            held_at,
            hold_days
        )
        
        # Create hold event
        hold_event = LedgerService.create_event(
            event_type=EventType.SETTLEMENT_HOLD,
            amount=amount,
            driver_id=driver_id,
            description=f"D+{hold_days} settlement hold",
            status=EventStatus.COMPLETED,
            metadata={
                "earning_event_id": earning_event_id,
                "hold_days": hold_days,
                "release_date": release_date.isoformat()
            },
            db=db
        )
        
        # Create settlement record
        settlement = Settlement(
            driver_id=driver_id,
            earning_event_id=earning_event_id,
            amount=amount,
            hold_days=hold_days,
            held_at=held_at,
            release_date=release_date,
            status=SettlementStatus.PENDING,
            hold_event_id=hold_event.id
        )
        
        db.add(settlement)
        db.commit()
        db.refresh(settlement)
        
        logger.info(
            f"Settlement hold created: settlement_id={settlement.id}, "
            f"amount=R${amount}, release_date={release_date}"
        )
        
        return settlement
    
    @staticmethod
    def release_settlement(settlement: Settlement, db) -> Settlement:
        """
        Release settlement (make funds available)
        
        Creates SETTLEMENT_RELEASE event
        """
        if settlement.status != SettlementStatus.PENDING:
            raise ValueError(f"Cannot release settlement with status: {settlement.status}")
        
        # Create release event
        release_event = LedgerService.create_event(
            event_type=EventType.SETTLEMENT_RELEASE,
            amount=settlement.amount,
            driver_id=settlement.driver_id,
            description=f"D+{settlement.hold_days} settlement released",
            status=EventStatus.COMPLETED,
            metadata={
                "settlement_id": settlement.id,
                "earning_event_id": settlement.earning_event_id
            },
            db=db
        )
        
        # Update settlement
        settlement.status = SettlementStatus.COMPLETED
        settlement.released_at = datetime.utcnow()
        settlement.release_event_id = release_event.id
        
        db.commit()
        db.refresh(settlement)
        
        logger.info(
            f"Settlement released: settlement_id={settlement.id}, "
            f"amount=R${settlement.amount}"
        )
        
        return settlement
    
    @staticmethod
    def get_pending_settlements(db, release_date: date = None) -> list:
        """
        Get settlements ready to release
        
        Args:
            db: Database session
            release_date: Filter by release date (default today)
        
        Returns:
            List of settlements
        """
        release_date = release_date or date.today()
        
        settlements = db.query(Settlement).filter(
            Settlement.status == SettlementStatus.PENDING,
            Settlement.release_date <= release_date
        ).all()
        
        return settlements
```

**Update Ride Payment Flow:**
```python
# backend/src/services/ride_payment.py (update)

@staticmethod
def process_ride_payment(ride: Ride, db) -> dict:
    """
    Process payment with D+N settlement
    """
    # ... existing payment event creation
    
    # NEW: Create settlement hold
    from src.services.settlement_service import SettlementService
    
    settlement = SettlementService.create_hold(
        earning_event_id=earning_event.id,
        driver_id=ride.driver_id,
        amount=driver_earning,
        hold_days=2,  # D+2
        db=db
    )
    
    result["settlement_id"] = settlement.id
    result["release_date"] = settlement.release_date.isoformat()
    
    return result
```

**Tests:**
```python
# backend/tests/test_settlement.py

def test_calculate_release_date_skips_weekend():
    """Release date skips weekend"""
    # Friday
    friday = datetime(2024, 1, 5, 10, 0)  # Friday
    
    # D+2 from Friday = Tuesday (skip Sat, Sun)
    release = SettlementService.calculate_release_date(friday, 2)
    
    assert release.weekday() == 1  # Tuesday

def test_create_hold(db, db_driver, db_earning_event):
    """Creates settlement hold"""
    settlement = SettlementService.create_hold(
        earning_event_id=db_earning_event.id,
        driver_id=db_driver.id,
        amount=50.00,
        hold_days=2,
        db=db
    )
    
    assert settlement.status == SettlementStatus.PENDING
    assert settlement.amount == 50.00
    assert settlement.hold_days == 2

def test_release_settlement(db, db_settlement_pending):
    """Releases settlement"""
    settlement = SettlementService.release_settlement(
        db_settlement_pending,
        db
    )
    
    assert settlement.status == SettlementStatus.COMPLETED
    assert settlement.released_at is not None
    assert settlement.release_event_id is not None
```

**Critérios de Aceite:**
- [ ] Settlement model criado
- [ ] Migration aplicada
- [ ] create_hold funciona
- [ ] Calcula release_date (skip weekends)
- [ ] release_settlement funciona
- [ ] Cria HOLD e RELEASE events
- [ ] Integrado com ride payment
- [ ] Testes passam (3 cenários)

---

### [BACKEND] Task 5.2.2: Settlement Release Job
**Responsável:** Backend Dev 2  
**Estimativa:** 5 SP  
**Duração:** 1 dia

**Descrição:**
Job para liberar settlements automaticamente no D+N.

**Job:**
```python
# backend/src/jobs/settlement_releaser.py
from src.services.settlement_service import SettlementService
from src.services.wallet_service import WalletService
from src.core.database import SessionLocal
from datetime import date
import logging

logger = logging.getLogger(__name__)

class SettlementReleaser:
    """
    Background job to release settlements
    
    Runs every hour
    Releases settlements where release_date <= today
    """
    
    @staticmethod
    def run():
        """
        Release pending settlements
        """
        db = SessionLocal()
        
        try:
            today = date.today()
            
            # Get settlements to release
            settlements = SettlementService.get_pending_settlements(db, today)
            
            logger.info(f"Found {len(settlements)} settlements to release")
            
            released_count = 0
            failed_count = 0
            
            for settlement in settlements:
                try:
                    # Release settlement
                    SettlementService.release_settlement(settlement, db)
                    
                    # Update driver wallet
                    WalletService.update_wallet(settlement.driver_id, db)
                    
                    released_count += 1
                
                except Exception as e:
                    logger.error(
                        f"Failed to release settlement {settlement.id}: {e}"
                    )
                    failed_count += 1
            
            logger.info(
                f"Settlement release complete: "
                f"released={released_count}, failed={failed_count}"
            )
        
        finally:
            db.close()

# Schedule with APScheduler
from apscheduler.schedulers.background import BackgroundScheduler

scheduler = BackgroundScheduler()
scheduler.add_job(
    SettlementReleaser.run,
    'cron',
    hour='*/1',  # Every hour
    id='settlement_releaser'
)
scheduler.start()
```

**Monitoring:**
```python
# backend/src/services/monitoring.py
from prometheus_client import Gauge, Counter

# Metrics
settlements_pending = Gauge(
    'settlements_pending_total',
    'Number of pending settlements'
)

settlements_released = Counter(
    'settlements_released_total',
    'Total settlements released'
)

settlements_failed = Counter(
    'settlements_failed_total',
    'Total settlements that failed to release'
)
```

**Critérios de Aceite:**
- [ ] Job executa a cada hora
- [ ] Libera settlements do dia
- [ ] Atualiza wallets
- [ ] Log estruturado
- [ ] Métricas Prometheus
- [ ] Error handling robusto

---

## EPIC 5.3: PAYOUT INTEGRATION (10 SP) ✅

[Continua na próxima parte...]

Sprint 5 está ficando grande. Vou criar Sprint 6 em arquivo separado.

Quer que eu continue completando Sprint 5 e crie Sprint 6?
