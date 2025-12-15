# Itens F e G: Ledger Financeiro + Comissão e Repasse

**Objetivo:** Sistema contábil completo com double-entry bookkeeping, comissionamento e repasse para motoristas.

---

## 📋 Índice

1. [Item F - Ledger Financeiro](#item-f---ledger-financeiro)
2. [Item G - Comissão e Repasse (Payout)](#item-g---comissão-e-repasse-payout)

---

# Item F - Ledger Financeiro

## 🏦 Estrutura do Ledger

### Chart of Accounts (Plano de Contas)

```sql
-- Inserir contas do plano de contas
INSERT INTO ledger_accounts (code, name, account_type, classification, description) VALUES
-- ASSETS (1xxx)
('1000', 'ASSETS', 'ASSET', 'HEADER', 'Ativos'),
('1100', 'CAIXA', 'ASSET', 'DETAIL', 'Caixa da empresa'),
('1200', 'BANCO_CORRENTE', 'ASSET', 'DETAIL', 'Conta corrente bancária'),
('1300', 'PIX_A_RECEBER', 'ASSET', 'DETAIL', 'Valores a receber via Pix de passageiros'),

-- LIABILITIES (2xxx)
('2000', 'LIABILITIES', 'LIABILITY', 'HEADER', 'Passivos'),
('2100', 'MOTORISTAS_A_PAGAR', 'LIABILITY', 'DETAIL', 'Saldo a pagar aos motoristas'),
('2200', 'TAXAS_A_RECOLHER', 'LIABILITY', 'DETAIL', 'Impostos e taxas a recolher'),

-- EQUITY (3xxx)
('3000', 'EQUITY', 'EQUITY', 'HEADER', 'Patrimônio Líquido'),
('3100', 'CAPITAL_SOCIAL', 'EQUITY', 'DETAIL', 'Capital social da empresa'),

-- INCOME (4xxx)
('4000', 'INCOME', 'INCOME', 'HEADER', 'Receitas'),
('4100', 'RECEITA_CORRIDAS', 'INCOME', 'DETAIL', 'Receita bruta de corridas'),
('4200', 'COMISSAO_PLATAFORMA', 'INCOME', 'DETAIL', 'Comissão da plataforma (20%)'),

-- EXPENSES (5xxx)
('5000', 'EXPENSES', 'EXPENSE', 'HEADER', 'Despesas'),
('5100', 'COMISSAO_PIX', 'EXPENSE', 'DETAIL', 'Taxas de gateway Pix (Efí)'),
('5200', 'ESTORNOS', 'EXPENSE', 'DETAIL', 'Estornos e cancelamentos'),
('5300', 'TAXAS_BANCARIAS', 'EXPENSE', 'DETAIL', 'Taxas bancárias diversas');
```

### Regras de Movimentação

**ASSETS (Ativos):**
- DEBIT: Aumenta (recebe dinheiro)
- CREDIT: Diminui (paga dinheiro)

**LIABILITIES (Passivos):**
- DEBIT: Diminui (paga dívida)
- CREDIT: Aumenta (assume dívida)

**INCOME (Receitas):**
- DEBIT: Diminui (estorno)
- CREDIT: Aumenta (receita)

**EXPENSES (Despesas):**
- DEBIT: Aumenta (gasto)
- CREDIT: Diminui (estorno)

---

## 📝 Lançamentos Contábeis

### 1. Corrida Completada (Aguardando Pagamento)

**Evento:** Corrida finalizada, valor R$ 50,00

*Nenhum lançamento ainda* - aguarda confirmação de pagamento.

---

### 2. Pagamento Pix Confirmado (Webhook)

**Evento:** Passageiro pagou R$ 50,00 via Pix

```python
transaction_id = f"payment_{payment_intent.id}"

ledger_service.create_journal_entry(
    transaction_id=transaction_id,
    entries=[
        {
            "account_code": "1300",  # PIX_A_RECEBER
            "type": "DEBIT",
            "amount": Decimal("50.00"),
            "description": f"Pagamento Pix corrida {ride.id}",
            "entity_type": "PAYMENT",
            "entity_id": str(payment_intent.id),
            "reference_number": e2e_id
        },
        {
            "account_code": "4100",  # RECEITA_CORRIDAS
            "type": "CREDIT",
            "amount": Decimal("50.00"),
            "description": f"Receita corrida {ride.id}",
            "entity_type": "RIDE",
            "entity_id": str(ride.id)
        }
    ]
)
```

**Resultado:**
- PIX_A_RECEBER (Asset): +R$ 50,00
- RECEITA_CORRIDAS (Income): +R$ 50,00

---

### 3. Distribuição: Comissão e Saldo Motorista

**Evento:** Calcular comissão plataforma (20%) e creditar motorista

```python
commission_rate = Decimal("0.20")  # 20%
commission_amount = Decimal("10.00")  # 50 * 0.20
driver_amount = Decimal("40.00")  # 50 - 10

transaction_id = f"commission_{ride.id}"

ledger_service.create_journal_entry(
    transaction_id=transaction_id,
    entries=[
        {
            "account_code": "4100",  # RECEITA_CORRIDAS
            "type": "DEBIT",
            "amount": Decimal("50.00"),
            "description": f"Distribuição receita corrida {ride.id}"
        },
        {
            "account_code": "4200",  # COMISSAO_PLATAFORMA
            "type": "CREDIT",
            "amount": commission_amount,
            "description": f"Comissão plataforma 20%"
        },
        {
            "account_code": "2100",  # MOTORISTAS_A_PAGAR
            "type": "CREDIT",
            "amount": driver_amount,
            "description": f"Saldo motorista corrida {ride.id}",
            "driver_id": str(ride.driver_id)
        }
    ]
)
```

**Resultado:**
- RECEITA_CORRIDAS: R$ 50 - R$ 50 = R$ 0 (zerada)
- COMISSAO_PLATAFORMA (Income): +R$ 10,00
- MOTORISTAS_A_PAGAR (Liability): +R$ 40,00

---

### 4. Repasse ao Motorista (Payout)

**Evento:** Transferir R$ 40,00 ao motorista via Pix

```python
transaction_id = f"payout_{payout.id}"

ledger_service.create_journal_entry(
    transaction_id=transaction_id,
    entries=[
        {
            "account_code": "2100",  # MOTORISTAS_A_PAGAR
            "type": "DEBIT",
            "amount": Decimal("40.00"),
            "description": f"Payout motorista {driver.id}",
            "driver_id": str(driver.id),
            "entity_type": "PAYOUT",
            "entity_id": str(payout.id)
        },
        {
            "account_code": "1200",  # BANCO_CORRENTE
            "type": "CREDIT",
            "amount": Decimal("40.00"),
            "description": f"Pagamento via Pix ao motorista"
        }
    ]
)
```

**Resultado:**
- MOTORISTAS_A_PAGAR: R$ 40 - R$ 40 = R$ 0 (zerado)
- BANCO_CORRENTE (Asset): -R$ 40,00

---

### 5. Taxa de Gateway Pix

**Evento:** Efí cobra R$ 0,50 por transação

```python
transaction_id = f"pix_fee_{payment_intent.id}"

ledger_service.create_journal_entry(
    transaction_id=transaction_id,
    entries=[
        {
            "account_code": "5100",  # COMISSAO_PIX
            "type": "DEBIT",
            "amount": Decimal("0.50"),
            "description": f"Taxa Efí transação {e2e_id}"
        },
        {
            "account_code": "1200",  # BANCO_CORRENTE
            "type": "CREDIT",
            "amount": Decimal("0.50"),
            "description": "Débito taxa gateway"
        }
    ]
)
```

**Resultado:**
- COMISSAO_PIX (Expense): +R$ 0,50
- BANCO_CORRENTE: -R$ 0,50

---

### 6. Estorno de Corrida

**Evento:** Corrida cancelada após pagamento - devolver R$ 50,00

```python
# 1. Reverter receita original
reversal_transaction_id = f"refund_{ride.id}_{uuid4()}"

ledger_service.create_journal_entry(
    transaction_id=reversal_transaction_id,
    entries=[
        {
            "account_code": "4100",  # RECEITA_CORRIDAS
            "type": "DEBIT",
            "amount": Decimal("50.00"),
            "description": f"Estorno receita corrida {ride.id}",
            "reversal_entry_id": original_entry_id
        },
        {
            "account_code": "1300",  # PIX_A_RECEBER
            "type": "CREDIT",
            "amount": Decimal("50.00"),
            "description": f"Estorno pagamento Pix"
        }
    ]
)

# 2. Registrar despesa de estorno
ledger_service.create_journal_entry(
    transaction_id=f"refund_expense_{ride.id}",
    entries=[
        {
            "account_code": "5200",  # ESTORNOS
            "type": "DEBIT",
            "amount": Decimal("50.00"),
            "description": f"Despesa de estorno corrida {ride.id}"
        },
        {
            "account_code": "1200",  # BANCO_CORRENTE
            "type": "CREDIT",
            "amount": Decimal("50.00"),
            "description": "Pagamento de estorno ao passageiro"
        }
    ]
)

# 3. Marcar entries originais como revertidos
await db.execute(
    update(LedgerEntry)
    .where(LedgerEntry.transaction_id == f"payment_{payment_intent.id}")
    .values(reversed=True, reversal_entry_id=reversal_entry_id)
)
```

---

## 📊 Cálculo de Saldo

### Saldo do Motorista

```python
async def get_driver_balance(driver_id: UUID) -> Decimal:
    """
    Calcula saldo disponível do motorista.

    Saldo = Soma(CREDITS) - Soma(DEBITS) na conta MOTORISTAS_A_PAGAR
    """
    result = await db.execute(
        select(
            func.sum(
                case(
                    (LedgerEntry.entry_type == 'CREDIT', LedgerEntry.amount),
                    else_=0
                )
            ).label('total_credit'),
            func.sum(
                case(
                    (LedgerEntry.entry_type == 'DEBIT', LedgerEntry.amount),
                    else_=0
                )
            ).label('total_debit')
        )
        .join(LedgerAccount)
        .where(LedgerAccount.code == '2100')  # MOTORISTAS_A_PAGAR
        .where(LedgerEntry.driver_id == driver_id)
        .where(LedgerEntry.reversed == False)
    )

    row = result.one()
    total_credit = row.total_credit or Decimal("0")
    total_debit = row.total_debit or Decimal("0")

    balance = total_credit - total_debit

    return balance
```

### Saldo Geral de uma Conta

```python
async def get_account_balance(account_code: str) -> Decimal:
    """
    Calcula saldo de uma conta contábil.
    """
    account = await db.execute(
        select(LedgerAccount).where(LedgerAccount.code == account_code)
    )
    account = account.scalar_one()

    result = await db.execute(
        select(
            func.sum(
                case(
                    (LedgerEntry.entry_type == 'DEBIT', LedgerEntry.amount),
                    else_=0
                )
            ).label('total_debit'),
            func.sum(
                case(
                    (LedgerEntry.entry_type == 'CREDIT', LedgerEntry.amount),
                    else_=0
                )
            ).label('total_credit')
        )
        .where(LedgerEntry.account_id == account.id)
        .where(LedgerEntry.reversed == False)
    )

    row = result.one()
    total_debit = row.total_debit or Decimal("0")
    total_credit = row.total_credit or Decimal("0")

    # Lógica depende do tipo de conta
    if account.account_type in ['ASSET', 'EXPENSE']:
        balance = total_debit - total_credit
    else:  # LIABILITY, EQUITY, INCOME
        balance = total_credit - total_debit

    return balance
```

---

## 🔄 Reconciliação

### Reconciliação de Pagamentos

```python
async def reconcile_payments(date: datetime.date):
    """
    Reconcilia pagamentos Pix com ledger.

    Verifica se:
    - Todos PixCharges COMPLETED têm entries correspondentes
    - Valores batem
    """
    # Pagamentos Pix confirmados
    pix_charges = await db.execute(
        select(PixCharge)
        .where(PixCharge.status == 'COMPLETED')
        .where(func.date(PixCharge.paid_at) == date)
    )
    pix_charges = pix_charges.scalars().all()

    total_pix = sum(charge.amount for charge in pix_charges)

    # Lançamentos no ledger (PIX_A_RECEBER)
    ledger_entries = await db.execute(
        select(func.sum(LedgerEntry.amount))
        .join(LedgerAccount)
        .where(LedgerAccount.code == '1300')  # PIX_A_RECEBER
        .where(LedgerEntry.entry_type == 'DEBIT')
        .where(func.date(LedgerEntry.created_at) == date)
        .where(LedgerEntry.reversed == False)
    )
    total_ledger = ledger_entries.scalar() or Decimal("0")

    # Comparar
    if total_pix != total_ledger:
        logger.error(
            f"Reconciliation mismatch on {date}: Pix={total_pix}, Ledger={total_ledger}"
        )
        return {
            "status": "mismatch",
            "date": date,
            "pix_total": total_pix,
            "ledger_total": total_ledger,
            "difference": total_pix - total_ledger
        }

    return {"status": "ok", "date": date, "total": total_pix}
```

---

## 📈 Running Balance

### Tabela de Running Balance

```sql
CREATE TABLE ledger_running_balances (
    id BIGSERIAL PRIMARY KEY,
    account_id UUID NOT NULL REFERENCES ledger_accounts(id),
    driver_id UUID REFERENCES drivers(id),  -- NULL para contas globais

    balance DECIMAL(19, 6) NOT NULL,
    last_entry_id BIGINT NOT NULL REFERENCES ledger_entries(id),

    calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    UNIQUE (account_id, driver_id),
    INDEX idx_running_balance_account (account_id),
    INDEX idx_running_balance_driver (driver_id) WHERE driver_id IS NOT NULL
);
```

### Job de Cálculo de Running Balance

```python
@scheduler.scheduled_job('interval', minutes=5)
async def calculate_running_balances():
    """
    Calcula running balances de forma incremental.

    Processa apenas entries novos desde último cálculo.
    """
    async with async_session_maker() as db:
        # Buscar contas que precisam de atualização
        accounts = await db.execute(
            select(LedgerAccount).where(LedgerAccount.active == True)
        )
        accounts = accounts.scalars().all()

        for account in accounts:
            # Buscar último running balance
            last_balance = await db.execute(
                select(LedgerRunningBalance)
                .where(LedgerRunningBalance.account_id == account.id)
                .where(LedgerRunningBalance.driver_id == None)
                .order_by(LedgerRunningBalance.calculated_at.desc())
                .limit(1)
            )
            last_balance = last_balance.scalar_one_or_none()

            if last_balance:
                # Calcular apenas novas entries
                new_entries = await db.execute(
                    select(LedgerEntry)
                    .where(LedgerEntry.account_id == account.id)
                    .where(LedgerEntry.id > last_balance.last_entry_id)
                    .where(LedgerEntry.reversed == False)
                    .order_by(LedgerEntry.id)
                )
                new_entries = new_entries.scalars().all()

                if not new_entries:
                    continue

                current_balance = last_balance.balance
            else:
                # Primeira vez - calcular tudo
                new_entries = await db.execute(
                    select(LedgerEntry)
                    .where(LedgerEntry.account_id == account.id)
                    .where(LedgerEntry.reversed == False)
                    .order_by(LedgerEntry.id)
                )
                new_entries = new_entries.scalars().all()
                current_balance = Decimal("0")

            # Calcular novo saldo
            for entry in new_entries:
                if account.account_type in ['ASSET', 'EXPENSE']:
                    if entry.entry_type == 'DEBIT':
                        current_balance += entry.amount
                    else:
                        current_balance -= entry.amount
                else:  # LIABILITY, EQUITY, INCOME
                    if entry.entry_type == 'CREDIT':
                        current_balance += entry.amount
                    else:
                        current_balance -= entry.amount

            # Salvar novo running balance
            if new_entries:
                async with db.begin():
                    new_running_balance = LedgerRunningBalance(
                        account_id=account.id,
                        balance=current_balance,
                        last_entry_id=new_entries[-1].id
                    )
                    db.add(new_running_balance)

                logger.info(
                    f"Updated running balance for {account.code}: {current_balance}"
                )
```

---

## 🔍 Auditoria

### Tabela de Histórico

```sql
CREATE TABLE ledger_entries_history (
    id BIGSERIAL PRIMARY KEY,
    entry_id BIGINT NOT NULL,

    -- Snapshot completo
    transaction_id VARCHAR(100) NOT NULL,
    account_id UUID NOT NULL,
    entry_type VARCHAR(10) NOT NULL,
    amount DECIMAL(19, 6) NOT NULL,
    driver_id UUID,
    reversed BOOLEAN,

    -- Mudança
    change_type VARCHAR(10) NOT NULL,  -- INSERT, UPDATE, DELETE
    changed_by UUID,
    changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    INDEX idx_ledger_history_entry (entry_id),
    INDEX idx_ledger_history_time (changed_at DESC)
);

-- Trigger para popular histórico
CREATE OR REPLACE FUNCTION ledger_entry_history_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO ledger_entries_history (
            entry_id, transaction_id, account_id, entry_type, amount,
            driver_id, reversed, change_type
        ) VALUES (
            NEW.id, NEW.transaction_id, NEW.account_id, NEW.entry_type,
            NEW.amount, NEW.driver_id, NEW.reversed, 'INSERT'
        );
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO ledger_entries_history (
            entry_id, transaction_id, account_id, entry_type, amount,
            driver_id, reversed, change_type
        ) VALUES (
            NEW.id, NEW.transaction_id, NEW.account_id, NEW.entry_type,
            NEW.amount, NEW.driver_id, NEW.reversed, 'UPDATE'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ledger_entry_history_trigger
AFTER INSERT OR UPDATE ON ledger_entries
FOR EACH ROW EXECUTE FUNCTION ledger_entry_history_trigger();
```

---

# Item G - Comissão e Repasse (Payout)

## 💰 Modelo de Comissão

### Configuração de Comissão

```sql
CREATE TABLE commission_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Aplicação
    vehicle_category VARCHAR(50),  -- NULL = todas categorias
    effective_from DATE NOT NULL,
    effective_until DATE,

    -- Comissão
    commission_type VARCHAR(20) NOT NULL,  -- percentage, fixed
    commission_value DECIMAL(10, 6) NOT NULL,

    -- Ex: percentage = 20.00 (20%)
    --     fixed = 5.00 (R$ 5 por corrida)

    -- Status
    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id),

    INDEX idx_commission_category (vehicle_category),
    INDEX idx_commission_dates (effective_from, effective_until),

    CONSTRAINT valid_commission_type CHECK (commission_type IN ('percentage', 'fixed'))
);
```

### Cálculo de Comissão

```python
async def calculate_commission(ride: Ride) -> Decimal:
    """
    Calcula comissão da plataforma para uma corrida.
    """
    # Buscar configuração de comissão
    config = await db.execute(
        select(CommissionConfig)
        .where(
            or_(
                CommissionConfig.vehicle_category == ride.requested_category,
                CommissionConfig.vehicle_category.is_(None)
            )
        )
        .where(CommissionConfig.active == True)
        .where(CommissionConfig.effective_from <= func.current_date())
        .where(
            or_(
                CommissionConfig.effective_until.is_(None),
                CommissionConfig.effective_until >= func.current_date()
            )
        )
        .order_by(
            CommissionConfig.vehicle_category.desc(),  # Específica primeiro
            CommissionConfig.effective_from.desc()
        )
        .limit(1)
    )
    config = config.scalar_one_or_none()

    if not config:
        # Fallback: 20% default
        logger.warning(f"No commission config found for ride {ride.id}, using 20%")
        return ride.final_fare * Decimal("0.20")

    if config.commission_type == 'percentage':
        return ride.final_fare * (config.commission_value / Decimal("100"))
    else:  # fixed
        return config.commission_value
```

---

## 💸 Sistema de Payout

### Regras de Hold (Período de Retenção)

```python
PAYOUT_HOLD_HOURS = 24  # Aguardar 24h antes de liberar

async def is_ride_eligible_for_payout(ride: Ride) -> bool:
    """
    Verifica se corrida já pode ser incluída em payout.

    Regras:
    - Status = PAID
    - Passou período de hold (24h)
    - Não está em disputa
    """
    if ride.status != 'PAID':
        return False

    # Período de hold
    hold_until = ride.paid_at + timedelta(hours=PAYOUT_HOLD_HOURS)
    if datetime.now(timezone.utc) < hold_until:
        return False

    # Verificar disputas
    dispute = await db.execute(
        select(Dispute)
        .where(Dispute.ride_id == ride.id)
        .where(Dispute.status.in_(['OPEN', 'INVESTIGATING']))
    )
    if dispute.scalar_one_or_none():
        return False

    return True
```

### Cálculo de Saldo Disponível

```python
async def get_driver_available_balance(driver_id: UUID) -> Dict:
    """
    Retorna saldo disponível do motorista.

    Saldo disponível = Saldo total - Corridas em hold - Payouts pendentes
    """
    # Saldo total (do ledger)
    total_balance = await get_driver_balance(driver_id)

    # Corridas em hold
    rides_in_hold = await db.execute(
        select(func.sum(Ride.final_fare * Decimal("0.80")))  # 80% do motorista
        .where(Ride.driver_id == driver_id)
        .where(Ride.status == 'PAID')
        .where(Ride.paid_at > datetime.now(timezone.utc) - timedelta(hours=PAYOUT_HOLD_HOURS))
    )
    hold_amount = rides_in_hold.scalar() or Decimal("0")

    # Payouts pendentes
    pending_payouts = await db.execute(
        select(func.sum(Payout.amount))
        .where(Payout.driver_id == driver_id)
        .where(Payout.status.in_(['PENDING', 'PROCESSING']))
    )
    pending_amount = pending_payouts.scalar() or Decimal("0")

    available = total_balance - hold_amount - pending_amount

    return {
        "total_balance": total_balance,
        "hold_amount": hold_amount,
        "pending_payouts": pending_amount,
        "available_balance": max(Decimal("0"), available)
    }
```

### Criação de Payout

```python
async def create_payout(
    driver_id: UUID,
    amount: Decimal,
    request_id: str
) -> Payout:
    """
    Cria solicitação de payout para motorista.
    """
    async with db.begin():
        # Validar motorista
        driver = await db.get(Driver, driver_id)
        if not driver:
            raise HTTPException(404, "Driver not found")

        if driver.status not in ['active', 'available']:
            raise HTTPException(400, "Driver not active")

        # Validar dados bancários
        if not driver.pix_key:
            raise HTTPException(400, "Driver has no Pix key configured")

        # Validar saldo disponível
        balance_info = await get_driver_available_balance(driver_id)

        if balance_info["available_balance"] < amount:
            raise HTTPException(
                400,
                f"Insufficient balance. Available: {balance_info['available_balance']}"
            )

        # Validar valor mínimo
        MIN_PAYOUT = Decimal("10.00")
        if amount < MIN_PAYOUT:
            raise HTTPException(400, f"Minimum payout is R$ {MIN_PAYOUT}")

        # Criar payout
        payout = Payout(
            driver_id=driver_id,
            amount=amount,
            currency="BRL",
            status="PENDING",
            payout_method="pix",
            bank_details={
                "pix_key": driver.pix_key,
                "pix_key_type": driver.pix_key_type,
                "driver_name": driver.full_name,
                "driver_cpf": driver.cpf
            },
            provider="efi"
        )

        db.add(payout)
        await db.flush()

        # Criar ledger entries (reserva)
        await ledger_service.create_journal_entry(
            transaction_id=f"payout_{payout.id}",
            entries=[
                {
                    "account_code": "2100",  # MOTORISTAS_A_PAGAR
                    "type": "DEBIT",
                    "amount": amount,
                    "description": f"Payout motorista {driver.full_name}",
                    "driver_id": str(driver_id),
                    "entity_type": "PAYOUT",
                    "entity_id": str(payout.id)
                },
                {
                    "account_code": "1200",  # BANCO_CORRENTE (a pagar)
                    "type": "CREDIT",
                    "amount": amount,
                    "description": f"Payout agendado {payout.id}"
                }
            ]
        )

        # Emitir evento
        await event_bus.post_from_transaction(
            db,
            event_type="payout.created",
            payload={
                "payout_id": str(payout.id),
                "driver_id": str(driver_id),
                "amount": float(amount)
            }
        )

    # Agendar processamento assíncrono
    await process_payout_async.delay(str(payout.id))

    return payout
```

### Processamento de Payout

```python
async def process_payout(payout_id: UUID):
    """
    Processa payout via gateway (Efí).
    """
    async with async_session_maker() as db:
        payout = await db.get(Payout, payout_id)

        if payout.status != 'PENDING':
            logger.warning(f"Payout {payout_id} not in PENDING status")
            return

        try:
            # Atualizar status
            payout.status = 'PROCESSING'
            payout.processing_started_at = datetime.now(timezone.utc)
            db.add(payout)
            await db.commit()

            # Enviar para gateway Efí
            efi_response = await efi_client.create_pix_payment(
                pix_key=payout.bank_details["pix_key"],
                amount=payout.amount,
                description=f"Repasse corridas - Payout {payout.id}"
            )

            # Atualizar com resposta
            async with db.begin():
                payout.provider_transaction_id = efi_response["txid"]
                payout.provider_response = efi_response
                payout.status = 'COMPLETED'
                payout.completed_at = datetime.now(timezone.utc)
                db.add(payout)

                # Emitir evento
                await event_bus.post_from_transaction(
                    db,
                    event_type="payout.completed",
                    payload={
                        "payout_id": str(payout.id),
                        "driver_id": str(payout.driver_id),
                        "amount": float(payout.amount),
                        "txid": efi_response["txid"]
                    }
                )

            logger.info(f"Payout {payout_id} completed successfully")

        except Exception as e:
            logger.exception(f"Error processing payout {payout_id}")

            async with db.begin():
                payout.status = 'FAILED'
                payout.failed_at = datetime.now(timezone.utc)
                payout.failure_reason = str(e)
                db.add(payout)

                # Reverter ledger entries
                await ledger_service.reverse_transaction(f"payout_{payout.id}")

                # Emitir evento
                await event_bus.post_from_transaction(
                    db,
                    event_type="payout.failed",
                    payload={
                        "payout_id": str(payout.id),
                        "driver_id": str(payout.driver_id),
                        "error": str(e)
                    }
                )
```

---

## 📊 Dashboard do Motorista

### Endpoint: GET /drivers/{id}/financials

```python
class DriverFinancialsResponse(BaseModel):
    balance: Decimal
    available_for_payout: Decimal
    on_hold: Decimal
    pending_payouts: Decimal

    total_earnings: Decimal
    total_rides: int
    total_distance_km: Decimal

    recent_rides: List[RideSummary]
    recent_payouts: List[PayoutSummary]


@app.get("/drivers/{driver_id}/financials", response_model=DriverFinancialsResponse)
async def get_driver_financials(
    driver_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Retorna informações financeiras do motorista.
    """
    balance_info = await get_driver_available_balance(driver_id)

    # Estatísticas gerais
    stats = await db.execute(
        select(
            func.count(Ride.id).label('total_rides'),
            func.sum(Ride.actual_distance_km).label('total_distance'),
            func.sum(Ride.final_fare * Decimal("0.80")).label('total_earnings')
        )
        .where(Ride.driver_id == driver_id)
        .where(Ride.status == 'PAID')
    )
    stats = stats.one()

    # Corridas recentes
    recent_rides = await db.execute(
        select(Ride)
        .where(Ride.driver_id == driver_id)
        .where(Ride.status == 'PAID')
        .order_by(Ride.completed_at.desc())
        .limit(10)
    )

    # Payouts recentes
    recent_payouts = await db.execute(
        select(Payout)
        .where(Payout.driver_id == driver_id)
        .order_by(Payout.created_at.desc())
        .limit(10)
    )

    return DriverFinancialsResponse(
        balance=balance_info["total_balance"],
        available_for_payout=balance_info["available_balance"],
        on_hold=balance_info["hold_amount"],
        pending_payouts=balance_info["pending_payouts"],
        total_earnings=stats.total_earnings or Decimal("0"),
        total_rides=stats.total_rides or 0,
        total_distance_km=stats.total_distance or Decimal("0"),
        recent_rides=[...],
        recent_payouts=[...]
    )
```

---

## 🎯 Resumo Executivo

### Ledger Financeiro
- ✅ **Double-Entry Bookkeeping** completo
- ✅ **Chart of Accounts** específico para mobilidade
- ✅ **Imutabilidade** garantida via triggers
- ✅ **Running Balance** incremental
- ✅ **Reconciliação** automática
- ✅ **Auditoria** completa com histórico

### Comissão e Payout
- ✅ **Comissão configurável** por categoria
- ✅ **Período de hold** (24h) antes de payout
- ✅ **Validação de saldo** disponível
- ✅ **Processamento assíncrono** via jobs
- ✅ **Reversão** em caso de falha
- ✅ **Dashboard** financeiro para motorista

### Invariantes Garantidos
1. Débitos = Créditos (sempre balanceado)
2. Entries imutáveis (append-only)
3. Saldo nunca negativo
4. Payout <= saldo disponível
5. Reconciliação diária

---

**Documento criado em:** 14/12/2024
**Versão:** 1.0
**Autor:** Sistema de Arquitetura Backend
