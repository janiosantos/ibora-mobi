# Análise de Repositórios de Referência

**Data:** 14/12/2024
**Objetivo:** Extrair padrões arquiteturais aplicáveis ao backend do app estilo Uber/99

---

## 📊 Repositórios Analisados

1. **Traccar** - Sistema de rastreamento GPS
2. **Kill Bill** - Sistema de billing e pagamentos
3. **Apache Fineract** - Sistema de ledger financeiro

---

## 🎯 Principais Insights Consolidados

### 1. Rastreamento e Eventos em Tempo Real (Traccar)

#### Pipeline de Processamento
- ✅ **Chain of Responsibility Pattern**: Handlers encadeados processam cada evento
- ✅ **Cada handler tem responsabilidade única**: validação → cálculo → persistência → notificação
- ✅ **Append-only para posições**: Nunca atualiza, sempre insere novo registro

**Aplicação no projeto:**
```
LocationUpdate → ValidationHandler → DistanceHandler → ETAHandler
  → GeofenceHandler → FareHandler → DatabaseHandler → RealtimeHandler
```

#### Tempo Real
- ✅ **WebSocket com Listener Pattern**: Cada conexão registra listener
- ✅ **Broadcast Service**: Sincroniza múltiplas instâncias via Redis pub/sub
- ✅ **Cache em Grafo**: Mantém relações em memória para queries rápidas
- ✅ **Reference Counting**: Remove do cache quando não há mais referências

**Aplicação no projeto:**
- WebSocket para updates de localização motorista → passageiro
- Cache apenas de corridas ativas e motoristas disponíveis
- Broadcast de eventos: ride.accepted, driver.location.updated

#### Event Detection
- ✅ **State Transitions**: Compara estado atual vs anterior
- ✅ **Estados no Device**: Mantém estados calculados (motionState, overspeedState)
- ✅ **Callbacks assíncronos**: Não bloqueia pipeline principal

**Aplicação no projeto:**
- Detectar: chegada ao pickup, início de corrida, desvio de rota
- Estados no Driver: available, on_trip, offline

---

### 2. Controle Transacional e Idempotência (Kill Bill)

#### Consistência Transacional
- ✅ **State Machine XML**: Define estados e transições válidas
- ✅ **GlobalLocker**: Locks distribuídos (PostgreSQL/MySQL nativos ou Redis)
- ✅ **Transaction Wrapper**: Encapsula todas operações em callbacks transacionais
- ✅ **Janitor Pattern**: Reconciliação assíncrona de estados inconsistentes

**Aplicação no projeto:**
```
Estados da Corrida:
REQUESTED → SEARCHING → OFFERED → ACCEPTED → ARRIVING
  → STARTED → COMPLETED → PAYMENT_PENDING → PAID

Estados alternativos: CANCELED, EXPIRED, REFUNDED
```

**Lock Strategy:**
```python
# Aceitar corrida (ponto crítico)
with global_locker.lock(f"ride:{ride_id}"):
    ride = db.get_ride_for_update(ride_id)
    if ride.status != "OFFERED":
        raise InvalidTransition()
    if ride.accepted_driver_id is not None:
        raise RideAlreadyAccepted()

    ride.status = "ACCEPTED"
    ride.accepted_driver_id = driver_id
    db.commit()

    event_bus.post_from_transaction("ride.accepted", ride)
```

#### Idempotência
- ✅ **External Keys**: Cliente fornece chave única em cada requisição
- ✅ **Sanity Checks**: Valida se key já existe antes de processar
- ✅ **Estados intermediários**: PENDING permite retry seguro
- ✅ **Retry com mesma transaction_id**: Reutiliza se já existe

**Aplicação no projeto:**
```python
# POST /rides/{id}/accept
{
  "driver_id": "123",
  "idempotency_key": "uuid-abc-123"  # Gerado pelo cliente
}

# Sistema verifica:
# 1. Key já existe? → Retorna resultado existente
# 2. Status é PENDING? → Permite retry
# 3. Pertence à mesma conta?
```

#### Eventos Atômicos
- ✅ **postFromTransaction()**: Evento usa mesma conexão da transação
- ✅ **Commit atômico**: Evento só dispara se commit for bem-sucedido
- ✅ **Rollback cascata**: Se transação falha, evento não é publicado

**Crítico para projeto:**
```python
# ERRADO - evento pode disparar mesmo com rollback
db.update_ride(ride)
event_bus.post("ride.accepted")
db.commit()

# CORRETO - evento é atômico com transação
with db.transaction() as tx:
    tx.update_ride(ride)
    tx.post_event("ride.accepted", ride)  # Usa mesma conexão
# COMMIT aqui - evento só dispara após commit
```

#### Reconciliação (Janitor)
- ✅ **Job periódico**: Valida consistência entre sistema e gateway
- ✅ **On-demand**: Toda consulta GET invoca reconciliação
- ✅ **Correção automática**: Atualiza estado se divergir

**Aplicação no projeto:**
```python
# Janitor para pagamentos Pix
async def reconcile_pending_payments():
    pending = db.get_payments(status="PENDING", older_than="5min")
    for payment in pending:
        efi_status = efi_client.check_payment(payment.txid)
        if efi_status == "CONCLUIDA":
            # Webhook perdido! Aplicar efeito agora
            apply_payment_confirmation(payment)
```

---

### 3. Ledger Financeiro (Fineract)

#### Double-Entry Bookkeeping
- ✅ **Journal Entries sempre balanceadas**: Soma débitos = Soma créditos
- ✅ **TransactionId único**: Agrupa todos os lançamentos de uma operação
- ✅ **Imutabilidade**: Nunca deleta, sempre reverte com novos registros
- ✅ **Linked Items**: Rastreabilidade de ajustes e estornos

**Estrutura de contas sugerida:**
```
ASSETS (1xxx)
  - 1100: CAIXA
  - 1200: BANCO_CORRENTE

LIABILITIES (2xxx)
  - 2100: MOTORISTAS_A_PAGAR
  - 2200: PIX_A_RECEBER_PASSAGEIROS

INCOME (4xxx)
  - 4100: RECEITA_CORRIDAS
  - 4200: COMISSAO_PLATAFORMA

EXPENSES (5xxx)
  - 5100: COMISSAO_PIX
  - 5200: ESTORNOS
```

**Exemplo de lançamento:**
```
# Corrida completa: R$ 50,00 (comissão 20% = R$ 10)

TransactionId: "ride_123_payment"
1. Débito:  PIX_A_RECEBER_PASSAGEIROS    R$ 50,00
   Crédito: RECEITA_CORRIDAS              R$ 50,00

2. Débito:  COMISSAO_PLATAFORMA           R$ 10,00
   Crédito: MOTORISTAS_A_PAGAR            R$ 10,00

# Repasse ao motorista
TransactionId: "payout_456"
3. Débito:  MOTORISTAS_A_PAGAR            R$ 40,00
   Crédito: BANCO_CORRENTE                R$ 40,00
```

#### Running Balance
- ✅ **Cálculo assíncrono**: Job batch atualiza saldos
- ✅ **Saldo por entidade**: office_running_balance (adaptar para driver)
- ✅ **Flag de controle**: is_balance_calculated

**Aplicação no projeto:**
```python
# Saldo do motorista = soma de ledger entries
driver_balance = sum(
    entries.filter(account="MOTORISTAS_A_PAGAR", driver_id=123)
    .credit_amount - debit_amount
)

# Validação antes de payout
if driver_balance < payout_amount:
    raise InsufficientBalance()
```

#### Auditoria
- ✅ **Tabelas de histórico**: *_history para todas entidades financeiras
- ✅ **Campos de auditoria**: created_by, created_at, modified_by, modified_at
- ✅ **Rastreabilidade**: entity_type, entity_id, reference_number
- ✅ **GL Closure**: Trava período contábil após fechamento

**Aplicação no projeto:**
```sql
CREATE TABLE ledger_entries_history (
    id BIGSERIAL PRIMARY KEY,
    entry_id BIGINT NOT NULL,
    change_type VARCHAR(10), -- INSERT, UPDATE, DELETE
    account VARCHAR(50),
    amount DECIMAL(19,6),
    transaction_id VARCHAR(100),
    changed_by VARCHAR(100),
    changed_at TIMESTAMP,
    snapshot JSONB  -- Estado completo no momento da mudança
);
```

#### Reversões
- ✅ **Nunca DELETE**: Cria novos journal entries invertidos
- ✅ **Reversal ID**: Aponta para registro original
- ✅ **Flag reversed**: Marca registro como revertido

**Aplicação no projeto:**
```python
# Estorno de corrida
def refund_ride(ride_id):
    original_entries = get_ledger_entries(transaction_id=f"ride_{ride_id}")

    reversal_transaction_id = f"refund_{ride_id}_{uuid4()}"

    for entry in original_entries:
        # Inverte débito/crédito
        create_journal_entry(
            account=entry.account,
            type="DEBIT" if entry.type == "CREDIT" else "CREDIT",
            amount=entry.amount,
            transaction_id=reversal_transaction_id,
            reversal_id=entry.id
        )

    mark_entries_as_reversed(original_entries)
```

---

## 🔑 Decisões de Arquitetura Derivadas

### Controle Transacional - Accept Ride

**Abordagem escolhida:** Híbrida (PostgreSQL + Redis)

1. **PostgreSQL SELECT ... FOR UPDATE**: Lock pessimista na corrida
2. **Redis mutex**: Previne contenção no banco em alta concorrência
3. **Idempotency Key**: Cliente fornece, servidor valida

```python
async def accept_ride(ride_id: str, driver_id: str, idempotency_key: str):
    # 1. Lock distribuído (Redis) - TTL 10s
    async with redis.lock(f"ride:{ride_id}", timeout=10):

        # 2. Validar idempotência
        existing = db.get_accept_attempt(idempotency_key)
        if existing:
            if existing.status == "SUCCESS":
                return existing.result  # Retorna resultado anterior
            elif existing.status == "PENDING":
                # Retry permitido
                pass

        # 3. Transação de banco
        async with db.transaction():
            # Lock pessimista
            ride = db.execute(
                "SELECT * FROM rides WHERE id = %s FOR UPDATE",
                ride_id
            )

            # Validações
            if ride.status != "OFFERED":
                raise InvalidState()
            if ride.accepted_driver_id is not None:
                raise AlreadyAccepted()

            # Atualização
            ride.status = "ACCEPTED"
            ride.accepted_driver_id = driver_id
            ride.accepted_at = now()
            db.update(ride)

            # Registrar tentativa
            db.insert_accept_attempt({
                "idempotency_key": idempotency_key,
                "ride_id": ride_id,
                "driver_id": driver_id,
                "status": "SUCCESS"
            })

            # Evento atômico
            db.post_event("ride.accepted", {
                "ride_id": ride_id,
                "driver_id": driver_id,
                "passenger_id": ride.passenger_id
            })

        # 4. Notificação tempo real (após commit)
        await websocket_manager.broadcast(
            user_ids=[ride.passenger_id, driver_id],
            event="ride.accepted",
            data=ride.to_dict()
        )

        return ride
```

### Pix Efí - Webhook Transacional

**Fluxo completo:**

```python
# 1. Criar PaymentIntent
async def create_payment_intent(ride_id: str, amount: Decimal):
    async with db.transaction():
        payment = PaymentIntent(
            ride_id=ride_id,
            amount=amount,
            status="PENDING",
            created_at=now()
        )
        db.insert(payment)

        # Criar cobrança Pix na Efí
        efi_response = await efi_client.create_pix_charge({
            "valor": str(amount),
            "chave": CHAVE_PIX,
            "expiracao": 3600,  # 1 hora
        })

        pix_charge = PixCharge(
            payment_intent_id=payment.id,
            txid=efi_response["txid"],
            qr_code=efi_response["qrcode"],
            copy_paste=efi_response["pixCopiaECola"],
            expires_at=now() + timedelta(hours=1),
            status="ACTIVE"
        )
        db.insert(pix_charge)

        db.post_event("payment.intent.created", payment)

    return payment, pix_charge

# 2. Webhook de confirmação
async def handle_efi_webhook(webhook_data: dict):
    # Validar autenticidade (assinatura, mTLS)
    validate_webhook_signature(webhook_data)

    # Persistir webhook (sempre, mesmo que duplique)
    webhook_event = WebhookEvent(
        provider="efi",
        event_type=webhook_data["tipo"],
        txid=webhook_data["txid"],
        payload=webhook_data,
        received_at=now(),
        processed=False
    )
    db.insert(webhook_event)

    # Deduplicação por txid + e2eId
    e2e_id = webhook_data["pix"]["endToEndId"]

    async with db.transaction():
        # Lock na PixCharge
        pix_charge = db.execute(
            "SELECT * FROM pix_charges WHERE txid = %s FOR UPDATE",
            webhook_data["txid"]
        )

        if not pix_charge:
            logger.warning(f"PixCharge não encontrada: {webhook_data['txid']}")
            return

        # Verificar se já processado
        existing = db.get_financial_event(
            event_type="pix.payment.confirmed",
            external_id=e2e_id
        )
        if existing:
            logger.info(f"Pagamento já processado: {e2e_id}")
            return  # Idempotência

        # Aplicar efeito financeiro
        payment_intent = db.get(PaymentIntent, pix_charge.payment_intent_id)

        # Ledger: Passageiro pagou
        create_journal_entry(
            transaction_id=f"payment_{payment_intent.id}",
            entries=[
                {"account": "PIX_A_RECEBER", "type": "DEBIT", "amount": payment_intent.amount},
                {"account": "RECEITA_CORRIDAS", "type": "CREDIT", "amount": payment_intent.amount}
            ],
            entity_type="PAYMENT",
            entity_id=payment_intent.id,
            reference_number=e2e_id
        )

        # Atualizar status
        payment_intent.status = "CONFIRMED"
        payment_intent.confirmed_at = now()
        pix_charge.status = "COMPLETED"
        pix_charge.paid_at = now()
        db.update(payment_intent)
        db.update(pix_charge)

        # Marcar ride como PAID
        ride = db.get(Ride, payment_intent.ride_id)
        ride.status = "PAID"
        ride.paid_at = now()
        db.update(ride)

        # Registrar evento financeiro
        fin_event = FinancialEvent(
            event_type="pix.payment.confirmed",
            external_id=e2e_id,
            payment_intent_id=payment_intent.id,
            amount=payment_intent.amount,
            occurred_at=now()
        )
        db.insert(fin_event)

        # Calcular comissão e saldo motorista
        commission_rate = Decimal("0.20")  # 20%
        commission = payment_intent.amount * commission_rate
        driver_amount = payment_intent.amount - commission

        create_journal_entry(
            transaction_id=f"commission_{payment_intent.id}",
            entries=[
                {"account": "RECEITA_CORRIDAS", "type": "DEBIT", "amount": payment_intent.amount},
                {"account": "COMISSAO_PLATAFORMA", "type": "CREDIT", "amount": commission},
                {"account": "MOTORISTAS_A_PAGAR", "type": "CREDIT", "amount": driver_amount, "driver_id": ride.driver_id}
            ]
        )

        # Marcar webhook como processado
        webhook_event.processed = True
        webhook_event.processed_at = now()
        db.update(webhook_event)

        # Eventos atômicos
        db.post_event("payment.confirmed", payment_intent)
        db.post_event("ride.paid", ride)

    # Notificações tempo real (após commit)
    await websocket_manager.broadcast(
        user_ids=[ride.passenger_id, ride.driver_id],
        event="payment.confirmed",
        data={"ride_id": ride.id, "amount": payment_intent.amount}
    )

# 3. Job de expiração (webhook pode não disparar)
async def expire_pending_charges():
    expired = db.execute(
        "SELECT * FROM pix_charges WHERE status = 'ACTIVE' AND expires_at < NOW()"
    )

    for charge in expired:
        async with db.transaction():
            charge.status = "EXPIRED"
            db.update(charge)

            payment = db.get(PaymentIntent, charge.payment_intent_id)
            payment.status = "EXPIRED"
            db.update(payment)

            ride = db.get(Ride, payment.ride_id)
            ride.status = "PAYMENT_EXPIRED"
            db.update(ride)

            db.post_event("payment.expired", payment)
```

---

## 📋 Checklist de Implementação

### Controle Transacional
- [ ] Implementar GlobalLocker (Redis)
- [ ] State Machine para Ride
- [ ] SELECT ... FOR UPDATE em operações críticas
- [ ] Idempotency keys em todas APIs de mutação
- [ ] Event bus transacional (postFromTransaction)

### Ledger Financeiro
- [ ] Estrutura de contas (Chart of Accounts)
- [ ] Tabela ledger_entries (imutável)
- [ ] Tabela ledger_entries_history
- [ ] Running balance por motorista
- [ ] Validação double-entry (débitos = créditos)
- [ ] Reversões via journal entries invertidos

### Pagamentos Pix
- [ ] Integração Efí (sandbox primeiro)
- [ ] Tabelas: payment_intents, pix_charges, webhook_events
- [ ] Handler de webhook com deduplicação
- [ ] Validação de assinatura
- [ ] Job de expiração de cobranças
- [ ] Janitor para reconciliar webhooks perdidos

### Tempo Real
- [ ] WebSocket manager
- [ ] Broadcast service (Redis pub/sub)
- [ ] Cache de corridas ativas
- [ ] Pipeline de processamento de LocationUpdate
- [ ] Event detection (geofence, ETA)

### Auditoria
- [ ] Tabelas *_history para entidades críticas
- [ ] Campos: created_by, created_at, modified_by, modified_at
- [ ] Logs estruturados com request_id
- [ ] Métricas: duplicidade de webhooks, latência de aceite

---

**Próximos Passos:**
1. ✅ Análise concluída
2. 🚧 Criar documentação detalhada Item D (Accept Ride)
3. 🚧 Criar documentação detalhada Item E (Pix Webhook)
4. ⏳ Modelo de domínio completo
5. ⏳ Contratos API FastAPI
6. ⏳ Roadmap de implementação

