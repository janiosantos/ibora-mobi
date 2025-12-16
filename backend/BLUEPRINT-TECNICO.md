# 🏗️ BLUEPRINT TÉCNICO - Backend App Estilo Uber/99

**Versão:** 1.0
**Data:** 14/12/2024
**Autor:** Sistema de Arquitetura Backend

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Stack Tecnológica](#stack-tecnológica)
4. [Modelo de Dados](#modelo-de-dados)
5. [Fluxos Críticos](#fluxos-críticos)
6. [APIs e Endpoints](#apis-e-endpoints)
7. [Segurança](#segurança)
8. [Observabilidade](#observabilidade)
9. [Infraestrutura](#infraestrutura)
10. [Roadmap de Implementação](#roadmap-de-implementação)
11. [Checklist de Implementação](#checklist-de-implementação)

---

# Visão Geral

## Objetivo

Backend completo para aplicativo de mobilidade estilo Uber/99 com:
- ✅ Sistema de corridas transacional
- ✅ Pagamentos via Pix (Efí)
- ✅ Ledger financeiro completo
- ✅ Repasse para motoristas
- ✅ Tempo real (WebSocket)

## Características Principais

### Consistência Transacional
- **Accept Ride:** Lock híbrido (Redis + PostgreSQL) garante aceite único
- **Webhooks:** Deduplicação por e2eId (End-to-End ID)
- **Ledger:** Double-entry bookkeeping com imutabilidade

### Segurança Financeira
- Idempotência em todas operações críticas
- Auditoria completa (audit trail)
- Reconciliação automática de pagamentos
- Reversões via ledger (não DELETE)

### Escalabilidade
- Stateless API (horizontal scaling)
- Cache distribuído (Redis)
- Event-driven architecture (Pub/Sub)
- Particionamento de dados históricos

---

# Arquitetura do Sistema

## Diagrama de Arquitetura Completo

```mermaid
graph TB
    subgraph "Frontend Apps"
        PassengerApp[App Passageiro<br/>React Native]
        DriverApp[App Motorista<br/>React Native]
        AdminPanel[Admin Panel<br/>React]
    end

    subgraph "API Gateway"
        LB[Load Balancer<br/>Nginx/ALB]
        WAF[WAF<br/>Cloudflare]
    end

    subgraph "Backend Services"
        API1[FastAPI Instance 1]
        API2[FastAPI Instance 2]
        APIN[FastAPI Instance N]

        WSManager[WebSocket Manager]

        subgraph "Workers"
            CeleryWorker1[Celery Worker<br/>Payouts]
            CeleryWorker2[Celery Worker<br/>Janitor]
            CeleryWorker3[Celery Worker<br/>Notifications]
        end
    end

    subgraph "Message Broker"
        RedisPS[Redis Pub/Sub<br/>Events]
        RedisBroker[Redis<br/>Celery Broker]
    end

    subgraph "Databases"
        PGPrimary[(PostgreSQL<br/>Primary)]
        PGReplica1[(PostgreSQL<br/>Replica 1)]
        PGReplica2[(PostgreSQL<br/>Replica 2)]

        RedisCache[(Redis<br/>Cache)]
    end

    subgraph "External Services"
        Efi[Efí<br/>Pagamentos Pix]
    end

    subgraph "Observability"
        Prometheus[Prometheus]
        Grafana[Grafana]
        ELK[ELK Stack]
        Sentry[Sentry]
    end

    PassengerApp -->|HTTPS| WAF
    DriverApp -->|HTTPS| WAF
    AdminPanel -->|HTTPS| WAF

    WAF --> LB
    LB --> API1
    LB --> API2
    LB --> APIN

    PassengerApp -.WebSocket.-> WSManager
    DriverApp -.WebSocket.-> WSManager

    API1 --> PGPrimary
    API2 --> PGPrimary
    APIN --> PGPrimary

    API1 -.Read.-> PGReplica1
    API2 -.Read.-> PGReplica2

    API1 --> RedisCache
    API2 --> RedisCache
    APIN --> RedisCache

    API1 -->|Publish| RedisPS
    API2 -->|Publish| RedisPS
    APIN -->|Publish| RedisPS

    RedisPS -->|Subscribe| WSManager
    RedisPS -->|Subscribe| CeleryWorker1
    RedisPS -->|Subscribe| CeleryWorker2

    API1 -->|Jobs| RedisBroker
    RedisBroker --> CeleryWorker1
    RedisBroker --> CeleryWorker2
    RedisBroker --> CeleryWorker3

    CeleryWorker1 --> PGPrimary
    CeleryWorker2 --> PGPrimary

    API1 <-->|OAuth2+mTLS| Efi
    Efi -->|Webhook| LB

    CeleryWorker1 <-->|Pix Transfer| Efi

    API1 --> Prometheus
    API2 --> Prometheus
    Prometheus --> Grafana

    API1 --> ELK
    API2 --> ELK

    API1 --> Sentry
    API2 --> Sentry

    PGPrimary -.Replication.-> PGReplica1
    PGPrimary -.Replication.-> PGReplica2
```

## Padrões Arquiteturais

### Event-Driven Architecture
- **Event Bus:** Redis Pub/Sub para eventos internos
- **Async Processing:** Celery para jobs pesados
- **WebSocket:** Tempo real para apps

### CQRS (Command Query Responsibility Segregation)
- **Write:** Primary database (PostgreSQL)
- **Read:** Replicas (alta disponibilidade)
- **Cache:** Redis para queries frequentes

### Microservices-Ready
- **Stateless API:** Múltiplas instâncias
- **Service Discovery:** Load balancer
- **Resiliência:** Circuit breakers, retries

---

# Stack Tecnológica

## Backend

### Core
```yaml
Framework: FastAPI 0.104+
Linguagem: Python 3.11+
ASGI Server: Uvicorn
ORM: SQLAlchemy 2.0 (async)
Migrations: Alembic
Validação: Pydantic v2
```

### Async Runtime
```yaml
Event Loop: asyncio
HTTP Client: httpx
Database Driver: asyncpg (PostgreSQL)
Redis Client: aioredis
```

## Databases

### Relacional
```yaml
Database: PostgreSQL 15+
Replicação: Streaming Replication
Backup: pg_dump + WAL archiving
Particionamento: Por data (location_updates, ledger_entries)
```

### Cache & Session
```yaml
Cache: Redis 7+ (Cluster mode)
Persistence: AOF + RDB
Eviction: allkeys-lru
TTL: Variável por tipo de dado
```

### Message Broker
```yaml
Broker: Redis (Fase 1-3) → Kafka (Fase 4)
Queue: Celery
Backend: Redis
```

## Infraestrutura

### Containers
```yaml
Runtime: Docker 24+
Orchestration: Docker Compose (dev) → Kubernetes (prod)
Registry: Docker Hub / AWS ECR
```

### Cloud (AWS como exemplo)
```yaml
Compute: ECS Fargate / EKS
Database: RDS PostgreSQL (Multi-AZ)
Cache: ElastiCache Redis (Cluster)
Storage: S3 (backups, logs)
CDN: CloudFront
DNS: Route53
Load Balancer: ALB (Application Load Balancer)
```

## Observability

### Logs
```yaml
Format: JSON estruturado
Aggregation: ELK Stack / CloudWatch Logs
Retention: 90 dias
```

### Métricas
```yaml
Collector: Prometheus
Visualization: Grafana
Alerting: AlertManager / PagerDuty
```

### Tracing
```yaml
Framework: OpenTelemetry
Backend: Jaeger / AWS X-Ray
Sampling: 10% em produção
```

### Error Tracking
```yaml
Service: Sentry
Integração: SDK Python
Alertas: Slack, Email
```

## Segurança

### Autenticação
```yaml
Método: JWT (RS256)
Access Token: 15 minutos
Refresh Token: 7 dias
Storage: Redis (blacklist)
```

### Secrets Management
```yaml
Service: AWS Secrets Manager / HashiCorp Vault
Rotation: Automática (30 dias)
Acesso: IAM roles
```

### SSL/TLS
```yaml
Certificados: Let's Encrypt / ACM
Protocolo: TLS 1.3
Cipher Suites: Modern
```

### WAF
```yaml
Service: Cloudflare / AWS WAF
Rules: OWASP Top 10
Rate Limiting: Por IP e User
```

---

# Modelo de Dados

## Entidades Principais

### 1. Core Entities

```python
# User (base para todos usuários)
User:
  - id: UUID (PK)
  - email: String (UNIQUE)
  - phone: String (UNIQUE)
  - password_hash: String
  - user_type: Enum (passenger, driver, admin)
  - status: Enum (active, suspended, banned)

# Passenger
Passenger:
  - id: UUID (PK)
  - user_id: UUID (FK → users) (UNIQUE)
  - full_name: String
  - cpf: String (UNIQUE)
  - average_rating: Decimal(3,2)
  - total_rides: Integer

# Driver
Driver:
  - id: UUID (PK)
  - user_id: UUID (FK → users) (UNIQUE)
  - full_name: String
  - cpf: String (UNIQUE)
  - cnh_number: String (UNIQUE)
  - pix_key: String
  - current_lat: Decimal(10,8)
  - current_lon: Decimal(11,8)
  - current_ride_id: UUID (FK → rides)
  - status: Enum (available, on_trip, offline)
  - online: Boolean
  - average_rating: Decimal(3,2)

# Vehicle
Vehicle:
  - id: UUID (PK)
  - driver_id: UUID (FK → drivers)
  - license_plate: String (UNIQUE)
  - brand: String
  - model: String
  - year: Integer
  - category: Enum (standard, comfort, premium, xl)
  - status: Enum (active, inactive)
```

### 2. Ride Entities

```python
# Ride (corrida)
Ride:
  - id: UUID (PK)
  - passenger_id: UUID (FK → passengers)
  - driver_id: UUID (FK → drivers)
  - status: Enum (12 estados - ver state machine)
  - pickup_lat/lon: Decimal
  - dropoff_lat/lon: Decimal
  - estimated_fare: Decimal(10,2)
  - final_fare: Decimal(10,2)
  - created_at: Timestamp
  - accepted_at: Timestamp
  - started_at: Timestamp
  - completed_at: Timestamp
  - version: Integer (optimistic locking)

# RideOffer (ofertas para motoristas)
RideOffer:
  - id: UUID (PK)
  - ride_id: UUID (FK → rides)
  - driver_id: UUID (FK → drivers)
  - offered_at: Timestamp
  - expires_at: Timestamp
  - response: Enum (ACCEPTED, REJECTED, EXPIRED)
  - responded_at: Timestamp
  UNIQUE(ride_id, driver_id)

# RideAcceptAttempt (idempotência)
RideAcceptAttempt:
  - id: UUID (PK)
  - ride_id: UUID (FK → rides)
  - driver_id: UUID (FK → drivers)
  - idempotency_key: String (UNIQUE)
  - status: Enum (SUCCESS, FAILED, PENDING)
  - failure_reason: Text
  - attempt_at: Timestamp
```

### 3. Payment Entities

```python
# PaymentIntent
PaymentIntent:
  - id: UUID (PK)
  - ride_id: UUID (FK → rides)
  - amount: Decimal(10,2)
  - status: Enum (PENDING, CONFIRMED, EXPIRED, REFUNDED)
  - payment_method: String (default: 'pix')
  - created_at: Timestamp
  - confirmed_at: Timestamp
  - expires_at: Timestamp

# PixCharge
PixCharge:
  - id: UUID (PK)
  - payment_intent_id: UUID (FK → payment_intents)
  - txid: String (UNIQUE) - Efí transaction ID
  - e2e_id: String (UNIQUE) - End-to-End ID (SPB)
  - qr_code: Text - Base64 image
  - pix_copy_paste: Text - Código copia e cola
  - amount: Decimal(10,2)
  - status: Enum (ACTIVE, COMPLETED, EXPIRED)
  - expires_at: Timestamp
  - paid_at: Timestamp

# WebhookEvent
WebhookEvent:
  - id: UUID (PK)
  - provider: String (default: 'efi')
  - event_type: String
  - txid: String
  - e2e_id: String
  - payload: JSONB
  - payload_hash: String (SHA256) - deduplicação
  - processed: Boolean
  - processed_at: Timestamp
  - received_at: Timestamp
```

### 4. Ledger Entities

```python
# LedgerAccount (Chart of Accounts)
LedgerAccount:
  - id: UUID (PK)
  - code: String (UNIQUE) - Ex: "1300", "4200"
  - name: String - Ex: "PIX_A_RECEBER"
  - account_type: Enum (ASSET, LIABILITY, INCOME, EXPENSE)
  - classification: Enum (HEADER, DETAIL)
  - active: Boolean

# LedgerEntry (imutável)
LedgerEntry:
  - id: BigSerial (PK)
  - transaction_id: String - Agrupa débitos/créditos
  - account_id: UUID (FK → ledger_accounts)
  - entry_type: Enum (DEBIT, CREDIT)
  - amount: Decimal(19,6)
  - driver_id: UUID (FK → drivers) - opcional
  - entity_type: String - Ex: "PAYMENT", "PAYOUT"
  - entity_id: String
  - reference_number: String - Ex: e2eId
  - description: Text
  - reversed: Boolean
  - reversal_entry_id: BigInt (FK → ledger_entries)
  - transaction_date: Date
  - created_at: Timestamp

# FinancialEvent (deduplicação)
FinancialEvent:
  - id: UUID (PK)
  - event_type: String - Ex: "payment.confirmed"
  - ride_id: UUID (FK → rides)
  - payment_intent_id: UUID (FK → payment_intents)
  - amount: Decimal(10,2)
  - external_id: String (UNIQUE) - e2eId
  - occurred_at: Timestamp
  - metadata: JSONB
```

### 5. Payout Entities

```python
# Payout
Payout:
  - id: UUID (PK)
  - driver_id: UUID (FK → drivers)
  - amount: Decimal(10,2)
  - status: Enum (PENDING, PROCESSING, COMPLETED, FAILED)
  - payout_method: String (default: 'pix')
  - bank_details: JSONB - snapshot dos dados bancários
  - provider: String - Ex: 'efi'
  - provider_transaction_id: String
  - provider_response: JSONB
  - created_at: Timestamp
  - completed_at: Timestamp
  - failed_at: Timestamp
  - failure_reason: Text
```

### 6. Audit Entities

```python
# AuditLog
AuditLog:
  - id: BigSerial (PK)
  - action: String - Ex: "approve_driver"
  - entity_type: String
  - entity_id: String
  - user_id: UUID (FK → users)
  - user_type: String
  - changes: JSONB - before/after
  - ip_address: INET
  - user_agent: Text
  - request_id: String
  - occurred_at: Timestamp
```

## Relacionamentos

```mermaid
erDiagram
    User ||--o| Passenger : has
    User ||--o| Driver : has
    Driver ||--o{ Vehicle : owns
    Passenger ||--o{ Ride : requests
    Driver ||--o{ Ride : accepts
    Ride ||--o{ RideOffer : has
    Ride ||--o| PaymentIntent : has
    PaymentIntent ||--|| PixCharge : has
    Ride ||--o{ LocationUpdate : has
    Driver ||--o{ LocationUpdate : has
    Driver ||--o{ LedgerEntry : has
    LedgerAccount ||--o{ LedgerEntry : has
    Driver ||--o{ Payout : receives
```

## Índices Críticos

```sql
-- Rides
CREATE INDEX idx_rides_status_created ON rides(status, created_at);
CREATE INDEX idx_rides_driver ON rides(driver_id) WHERE driver_id IS NOT NULL;
CREATE INDEX idx_rides_pickup_location ON rides(pickup_lat, pickup_lon);

-- RideOffer
CREATE UNIQUE INDEX idx_offers_ride_driver ON ride_offers(ride_id, driver_id);
CREATE INDEX idx_offers_expires ON ride_offers(expires_at) WHERE response IS NULL;

-- RideAcceptAttempt
CREATE UNIQUE INDEX idx_accept_idempotency ON ride_accept_attempts(idempotency_key);

-- PixCharge
CREATE UNIQUE INDEX idx_pix_txid ON pix_charges(txid);
CREATE UNIQUE INDEX idx_pix_e2e_id ON pix_charges(e2e_id) WHERE e2e_id IS NOT NULL;

-- LedgerEntry
CREATE INDEX idx_ledger_transaction ON ledger_entries(transaction_id);
CREATE INDEX idx_ledger_driver ON ledger_entries(driver_id) WHERE driver_id IS NOT NULL;
CREATE INDEX idx_ledger_date ON ledger_entries(transaction_date);

-- FinancialEvent
CREATE UNIQUE INDEX idx_financial_external_id ON financial_events(external_id);

-- WebhookEvent
CREATE INDEX idx_webhook_hash ON webhook_events(payload_hash);
CREATE INDEX idx_webhook_processed ON webhook_events(processed, received_at);
```

---

# Fluxos Críticos

## Fluxo 1: Criação e Aceite de Corrida

```mermaid
sequenceDiagram
    participant P as App Passageiro
    participant API as Backend API
    participant DB as PostgreSQL
    participant Redis as Redis
    participant D as App Motorista
    participant WS as WebSocket

    P->>API: POST /rides
    API->>DB: INSERT ride (status=REQUESTED)
    API->>DB: UPDATE ride (status=SEARCHING)
    API-->>P: 201 Created {ride_id, status}

    Note over API: Buscar motoristas próximos
    API->>DB: SELECT drivers WHERE online=true AND ST_Distance(...)

    API->>DB: INSERT ride_offers (múltiplos motoristas)
    API->>DB: UPDATE ride (status=OFFERED)
    API->>WS: Broadcast "ride.offered" → motoristas
    WS-->>D: Notificação de nova corrida

    D->>API: POST /rides/{id}/accept {idempotency_key}

    Note over API: 3 Camadas de Proteção
    API->>Redis: LOCK ride:{id} (TTL 10s)
    API->>DB: SELECT * FROM ride_accept_attempts WHERE idempotency_key=?

    alt Idempotency key já existe (SUCCESS)
        API-->>D: 200 OK (resultado anterior)
    else Nova tentativa
        API->>DB: BEGIN TRANSACTION
        API->>DB: SELECT * FROM rides WHERE id=? FOR UPDATE

        alt Status != OFFERED
            API->>DB: ROLLBACK
            API-->>D: 400 Bad Request
        else Status = OFFERED
            API->>DB: UPDATE rides SET status=ACCEPTED, driver_id=?
            API->>DB: UPDATE ride_offers SET response=ACCEPTED
            API->>DB: INSERT ride_accept_attempts (SUCCESS)
            API->>DB: COMMIT (eventos disparados APÓS commit)
            API->>Redis: UNLOCK ride:{id}

            API->>WS: Broadcast "ride.accepted" → passageiro + motorista
            API->>WS: Broadcast "offer.canceled" → outros motoristas

            API-->>D: 200 OK {ride}
            WS-->>P: "Motorista aceitou sua corrida!"
        end
    end
```

## Fluxo 2: Pagamento Pix (Cobrança + Webhook)

```mermaid
sequenceDiagram
    participant D as App Motorista
    participant API as Backend API
    participant DB as PostgreSQL
    participant Efi as Efí (Gateway)
    participant P as App Passageiro
    participant WS as WebSocket
    participant Ledger as Ledger Service

    D->>API: POST /rides/{id}/complete
    API->>DB: UPDATE ride (status=COMPLETED, final_fare=50.00)
    API-->>D: 200 OK

    API->>DB: INSERT payment_intents (amount=50.00, status=PENDING)
    API->>Efi: PUT /v2/cob/{txid} (criar cobrança Pix)
    Efi-->>API: {txid, qrcode, pixCopiaECola}
    API->>DB: INSERT pix_charges (txid, qr_code, expires_at)
    API->>WS: Event "payment.intent.created"
    WS-->>P: QR Code + Copia e Cola

    Note over P: Passageiro paga via app do banco
    P->>Efi: Pagamento Pix (50.00)

    Efi->>API: POST /webhooks/efi/pix {txid, pix: [{endToEndId, valor}]}

    Note over API: Handler de Webhook (transacional)
    API->>DB: INSERT webhook_events (payload, hash)

    API->>DB: BEGIN TRANSACTION
    API->>DB: SELECT * FROM pix_charges WHERE txid=? FOR UPDATE

    API->>DB: SELECT * FROM financial_events WHERE external_id=e2eId

    alt e2eId já existe (duplicado)
        API->>DB: UPDATE webhook_events SET processed=true
        API->>DB: COMMIT
        API-->>Efi: 200 OK (idempotente)
    else Novo pagamento
        Note over Ledger: Aplicar efeito financeiro
        Ledger->>DB: INSERT ledger_entries (transaction_id=payment_xxx)
        Note over Ledger: Débito: PIX_A_RECEBER 50.00
        Note over Ledger: Crédito: RECEITA_CORRIDAS 50.00

        Ledger->>DB: INSERT ledger_entries (transaction_id=commission_xxx)
        Note over Ledger: Débito: RECEITA_CORRIDAS 50.00
        Note over Ledger: Crédito: COMISSAO_PLATAFORMA 10.00
        Note over Ledger: Crédito: MOTORISTAS_A_PAGAR 40.00 (driver_id)

        API->>DB: UPDATE payment_intents SET status=CONFIRMED
        API->>DB: UPDATE pix_charges SET status=COMPLETED, e2e_id=?
        API->>DB: UPDATE rides SET status=PAID
        API->>DB: INSERT financial_events (external_id=e2eId)
        API->>DB: UPDATE webhook_events SET processed=true

        API->>DB: COMMIT (eventos disparados após)

        API->>WS: Event "payment.confirmed"
        WS-->>P: "Pagamento confirmado!"
        WS-->>D: "Pagamento recebido!"

        API-->>Efi: 200 OK
    end
```

## Fluxo 3: Repasse (Payout) ao Motorista

```mermaid
sequenceDiagram
    participant D as App Motorista
    participant API as Backend API
    participant DB as PostgreSQL
    participant Ledger as Ledger Service
    participant Worker as Celery Worker
    participant Efi as Efí (Gateway)

    D->>API: GET /drivers/{id}/financials
    API->>Ledger: get_driver_available_balance(driver_id)
    Ledger->>DB: SELECT SUM(amount) FROM ledger_entries WHERE driver_id=? AND account='MOTORISTAS_A_PAGAR'
    Ledger-->>API: {available_balance: 120.00, on_hold: 40.00}
    API-->>D: {available: 80.00}

    D->>API: POST /payouts {amount: 80.00}

    API->>DB: BEGIN TRANSACTION
    API->>Ledger: Validar saldo disponível >= 80.00

    alt Saldo insuficiente
        API->>DB: ROLLBACK
        API-->>D: 400 Bad Request
    else Saldo OK
        API->>DB: INSERT payouts (status=PENDING, amount=80.00)

        Ledger->>DB: INSERT ledger_entries (transaction_id=payout_xxx)
        Note over Ledger: Débito: MOTORISTAS_A_PAGAR 80.00
        Note over Ledger: Crédito: BANCO_CORRENTE 80.00

        API->>DB: COMMIT

        API->>Worker: Enqueue job: process_payout(payout_id)
        API-->>D: 201 Created {payout_id, status: PENDING}

        Worker->>DB: UPDATE payouts SET status=PROCESSING
        Worker->>Efi: POST /pix/pagamentos (transferência)

        alt Sucesso
            Efi-->>Worker: {txid, status: CONCLUIDA}
            Worker->>DB: UPDATE payouts SET status=COMPLETED, provider_transaction_id=txid
            Worker->>D: Notificação: "Repasse realizado!"
        else Falha
            Efi-->>Worker: Erro
            Worker->>DB: UPDATE payouts SET status=FAILED
            Worker->>Ledger: reverse_transaction(payout_xxx)
            Note over Ledger: Reverter ledger entries
            Worker->>D: Notificação: "Repasse falhou"
        end
    end
```

## Fluxo 4: Reconciliação (Janitor)

```mermaid
sequenceDiagram
    participant Job as Janitor Job
    participant DB as PostgreSQL
    participant Efi as Efí (Gateway)
    participant API as Backend API

    Note over Job: Executa a cada 5 minutos

    Job->>DB: SELECT * FROM pix_charges WHERE status=ACTIVE AND created_at < NOW() - INTERVAL '5 minutes'

    loop Para cada cobrança
        Job->>Efi: GET /v2/cob/{txid}
        Efi-->>Job: {status: CONCLUIDA, pix: [...]}

        alt Status = CONCLUIDA (webhook perdido!)
            Job->>API: apply_payment_confirmation(txid, pix_data)
            Note over API: Simular webhook perdido
            API->>DB: BEGIN TRANSACTION
            API->>DB: Aplicar efeito financeiro (ledger)
            API->>DB: UPDATE payment_intents, pix_charges, rides
            API->>DB: COMMIT

            Job->>DB: UPDATE metrics (webhooks_missed_total)
            Job->>API: Alert: "Webhook perdido detectado!"
        else Status = ATIVA
            Note over Job: Ainda aguardando pagamento
        end
    end
```

---

# APIs e Endpoints

## Autenticação

```http
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
```

## Corridas

```http
POST   /rides                    # Criar corrida
GET    /rides/{id}               # Detalhes da corrida
POST   /rides/{id}/accept        # Aceitar corrida (motorista)
POST   /rides/{id}/cancel        # Cancelar corrida
POST   /rides/{id}/start         # Iniciar corrida
POST   /rides/{id}/complete      # Finalizar corrida
GET    /rides/active             # Corridas ativas do usuário
GET    /rides/history            # Histórico de corridas
```

## Pagamentos

```http
POST   /payments/intent          # Criar intenção de pagamento
GET    /rides/{id}/payment       # Info de pagamento da corrida
POST   /webhooks/efi/pix         # Webhook Efí (interno)
```

## Motorista

```http
GET    /drivers/{id}/financials  # Situação financeira
POST   /drivers/{id}/location    # Atualizar localização
GET    /drivers/{id}/balance     # Saldo disponível
POST   /payouts                  # Solicitar repasse
GET    /payouts                  # Listar repasses
GET    /payouts/{id}             # Detalhes do repasse
```

## Admin

```http
GET    /admin/drivers/pending    # Motoristas aguardando aprovação
POST   /admin/drivers/{id}/approve
POST   /admin/drivers/{id}/reject
GET    /admin/rides/stats        # Estatísticas de corridas
GET    /admin/financials/report  # Relatório financeiro
GET    /audit/logs               # Logs de auditoria
```

## Tempo Real

```
WebSocket: /ws/{token}
```

### Eventos WebSocket

**Cliente → Servidor:**
```json
{"type": "ping"}
```

**Servidor → Cliente:**
```json
{"type": "pong"}

{"type": "ride.accepted", "data": {...}}
{"type": "driver.location.updated", "data": {...}}
{"type": "payment.confirmed", "data": {...}}
```

---

# Segurança

## Autenticação e Autorização

### JWT Structure

```json
{
  "sub": "user_id",
  "type": "passenger|driver|admin",
  "exp": 1234567890,
  "iat": 1234567890
}
```

### Token Flow

1. **Login:** `POST /auth/login` → Access Token + Refresh Token
2. **Request:** `Authorization: Bearer {access_token}`
3. **Refresh:** `POST /auth/refresh` → Novo Access Token
4. **Logout:** Token adicionado à blacklist (Redis)

### Middleware de Autenticação

```python
@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    if request.url.path.startswith("/auth"):
        return await call_next(request)

    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        return JSONResponse({"error": "Unauthorized"}, status_code=401)

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["RS256"])
        request.state.user_id = payload["sub"]
        request.state.user_type = payload["type"]
    except JWTError:
        return JSONResponse({"error": "Invalid token"}, status_code=401)

    return await call_next(request)
```

## Rate Limiting

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/rides/{id}/accept")
@limiter.limit("5/minute")  # Máximo 5 tentativas por minuto
async def accept_ride(...):
    pass
```

## Validação de Entrada

```python
from pydantic import BaseModel, Field, validator

class CreateRideRequest(BaseModel):
    pickup_lat: float = Field(..., ge=-90, le=90)
    pickup_lon: float = Field(..., ge=-180, le=180)

    @validator('pickup_lat', 'pickup_lon')
    def validate_coordinates(cls, v):
        if v == 0:
            raise ValueError("Invalid coordinates")
        return v
```

## SQL Injection Prevention

```python
# ✅ CORRETO - Parametrized query
result = await db.execute(
    select(Ride).where(Ride.id == ride_id)
)

# ❌ ERRADO - String concatenation
query = f"SELECT * FROM rides WHERE id = '{ride_id}'"
```

## Secrets Management

```python
import boto3
from functools import lru_cache

@lru_cache()
def get_secret(secret_name: str) -> dict:
    """Busca secret do AWS Secrets Manager"""
    client = boto3.client('secretsmanager')
    response = client.get_secret_value(SecretId=secret_name)
    return json.loads(response['SecretString'])

# Uso
efi_credentials = get_secret("prod/efi/credentials")
```

---

# Observabilidade

## Logs Estruturados

```python
import logging
import json
from contextvars import ContextVar

request_id_var: ContextVar[str] = ContextVar('request_id', default='')

logger.info("Ride accepted", extra={
    "request_id": request_id_var.get(),
    "ride_id": str(ride.id),
    "driver_id": str(driver.id),
    "passenger_id": str(ride.passenger_id),
    "duration_ms": 150
})

# Output:
{
  "timestamp": "2024-12-14T18:30:00Z",
  "level": "INFO",
  "message": "Ride accepted",
  "request_id": "abc-123",
  "ride_id": "...",
  "driver_id": "...",
  "passenger_id": "...",
  "duration_ms": 150
}
```

## Métricas Principais

```python
from prometheus_client import Counter, Histogram, Gauge

# Contadores
rides_created = Counter("rides_created_total", "Total de corridas", ["category"])
rides_accepted = Counter("rides_accepted_total", "Corridas aceitas")
rides_canceled = Counter("rides_canceled_total", "Corridas canceladas", ["reason"])
payments_confirmed = Counter("payments_confirmed_total", "Pagamentos confirmados")
webhooks_missed = Counter("webhooks_missed_total", "Webhooks perdidos")

# Histogramas
ride_accept_duration = Histogram(
    "ride_accept_duration_seconds",
    "Tempo para aceitar corrida"
)
payment_delay = Histogram(
    "payment_confirmation_delay_seconds",
    "Delay confirmação pagamento"
)

# Gauges
active_rides = Gauge("active_rides", "Corridas ativas")
drivers_online = Gauge("drivers_online", "Motoristas online")
drivers_available = Gauge("drivers_available", "Motoristas disponíveis")
```

## Dashboards Grafana

### Dashboard: Overview
- Total de corridas (hoje, semana, mês)
- Taxa de aceite (%)
- Taxa de cancelamento (%)
- Tempo médio de corrida
- Receita total

### Dashboard: Operational
- Latência P50, P95, P99 por endpoint
- Taxa de erro por endpoint
- Requests/segundo
- Motoristas online vs disponíveis
- Corridas ativas

### Dashboard: Financial
- Pagamentos confirmados (R$/hora)
- Payouts processados (R$/dia)
- Comissão da plataforma
- Webhooks perdidos
- Reconciliações pendentes

### Dashboard: SLOs
- Uptime (target: 99.9%)
- Latência P95 < 500ms
- Taxa de erro < 1%
- Webhook processing < 2s

## Alertas Críticos

```yaml
# Alta taxa de cancelamento
- alert: HighRideCancellationRate
  expr: rate(rides_canceled_total[5m]) / rate(rides_created_total[5m]) > 0.3
  severity: warning

# Poucos motoristas
- alert: NoDriversAvailable
  expr: drivers_available < 5
  severity: critical

# Webhooks perdidos
- alert: WebhooksMissed
  expr: increase(webhooks_missed_total[15m]) > 0
  severity: critical

# Payouts falhando
- alert: HighPayoutFailureRate
  expr: rate(payouts_failed[10m]) / rate(payouts_created[10m]) > 0.1
  severity: critical
```

---

# Infraestrutura

## Ambiente de Desenvolvimento

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://user:pass@postgres:5432/ibora
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: ibora
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    volumes:
      - redis_data:/data

  celery:
    build: .
    command: celery -A app.tasks worker -l info
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
  redis_data:
```

## Ambiente de Produção (AWS)

### Compute
- **ECS Fargate:** 3+ tasks (API) com auto-scaling
- **Target Group:** Health check `/health`
- **ALB:** HTTPS, SSL termination, WAF

### Database
- **RDS PostgreSQL:** Multi-AZ, 2 read replicas
- **Instance:** db.r6g.xlarge (4 vCPU, 32 GB)
- **Backup:** Automated, 7 days retention
- **Encryption:** At rest + in transit

### Cache
- **ElastiCache Redis:** Cluster mode, 3 shards
- **Node:** cache.r6g.large
- **Eviction:** allkeys-lru
- **Persistence:** AOF

### Storage
- **S3:** Backups, logs, assets
- **CloudFront:** CDN para assets estáticos

### Networking
- **VPC:** Privada para database/cache
- **Subnets:** Públicas (ALB) + Privadas (API, DB)
- **Security Groups:** Least privilege

### Monitoring
- **CloudWatch:** Logs, métricas básicas
- **Prometheus:** Métricas detalhadas
- **Grafana:** Dashboards
- **Sentry:** Error tracking

## CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: pytest tests/ --cov
      - name: Check coverage
        run: coverage report --fail-under=80

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker image
        run: docker build -t ibora-api:${{ github.sha }} .
      - name: Push to ECR
        run: |
          aws ecr get-login-password | docker login --username AWS --password-stdin
          docker push ibora-api:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Update ECS service
        run: |
          aws ecs update-service --cluster ibora-prod --service api --force-new-deployment
```

---

# Roadmap de Implementação

## Fase 1: MVP Seguro (30 dias)

### Semana 1-2: Infraestrutura e Core
- [ ] Setup PostgreSQL + Redis
- [ ] Setup FastAPI + Alembic
- [ ] Models: User, Passenger, Driver, Vehicle
- [ ] Autenticação JWT
- [ ] Docker Compose

### Semana 3: Sistema de Corridas
- [ ] Models: Ride, RideOffer, RideAcceptAttempt
- [ ] Endpoint: POST /rides
- [ ] Endpoint: POST /rides/{id}/accept (lock híbrido)
- [ ] State machine
- [ ] Testes de concorrência

### Semana 4: Pagamentos Pix
- [ ] Models: PaymentIntent, PixCharge, WebhookEvent
- [ ] Integração Efí (sandbox)
- [ ] Endpoint: POST /payments/intent
- [ ] Endpoint: POST /webhooks/efi/pix
- [ ] Job de expiração

### Entrega Fase 1
- ✅ Aceite de corrida 100% transacional
- ✅ Pagamento Pix funcional
- ✅ Ledger básico operando
- ✅ Testes passando (>80% coverage)

## Fase 2: Payout + Auditoria (30 dias)

### Semana 1: Ledger Completo
- [ ] Chart of Accounts
- [ ] Running balance
- [ ] Tabelas de histórico

### Semana 2: Sistema de Payout
- [ ] Model: Payout
- [ ] Cálculo de saldo disponível
- [ ] Endpoint: POST /payouts
- [ ] Worker: process_payout

### Semana 3: Janitor e Reconciliação
- [ ] Job: reconcile_pix_charges
- [ ] Job: expire_pix_charges
- [ ] Alertas de webhooks perdidos

### Semana 4: Auditoria
- [ ] Audit trail completo
- [ ] Relatórios financeiros
- [ ] Dashboard admin

### Entrega Fase 2
- ✅ Payouts funcionando
- ✅ Janitor reconciliando
- ✅ Auditoria completa

## Fase 3: Antifraude (30 dias)

### Semana 1-2: Detecção
- [ ] Rate limiting
- [ ] Score de confiança
- [ ] Rotas suspeitas
- [ ] Múltiplos cancelamentos

### Semana 3: Validações
- [ ] Verificação de CPF
- [ ] Verificação de CNH
- [ ] KYC completo

### Semana 4: Limites
- [ ] Limite de payout/dia
- [ ] Limite de valor/corrida
- [ ] Geofencing

### Entrega Fase 3
- ✅ Fraudes detectadas (>80%)
- ✅ KYC implementado
- ✅ Limites operando

## Fase 4: Escala (30 dias)

### Semana 1: Message Broker
- [ ] Migrar para Kafka
- [ ] Dead letter queue
- [ ] Retry automático

### Semana 2: Particionamento
- [ ] Particionamento de location_updates
- [ ] Particionamento de ledger_entries
- [ ] Arquivamento de dados antigos

### Semana 3: Cache e Performance
- [ ] Cache distribuído avançado
- [ ] Query optimization
- [ ] Connection pooling

### Semana 4: Observabilidade Avançada
- [ ] Tracing distribuído (Jaeger)
- [ ] Dashboards completos
- [ ] SLOs definidos

### Entrega Fase 4
- ✅ 10,000+ corridas/dia
- ✅ Latência P99 < 500ms
- ✅ Uptime > 99.9%

---

# Checklist de Implementação

## Database Setup
- [ ] PostgreSQL instalado e configurado
- [ ] Alembic setup (migrations)
- [ ] Primeira migration (users, passengers, drivers)
- [ ] Seeds de desenvolvimento
- [ ] Backup configurado

## Core API
- [ ] FastAPI app estruturado
- [ ] Middleware de autenticação
- [ ] Middleware de request ID
- [ ] Error handling global
- [ ] CORS configurado
- [ ] Health check endpoint

## Modelos SQLAlchemy
- [ ] Base model com timestamps
- [ ] User, Passenger, Driver, Vehicle
- [ ] Ride, RideOffer, RideAcceptAttempt
- [ ] PaymentIntent, PixCharge, WebhookEvent
- [ ] LedgerAccount, LedgerEntry, FinancialEvent
- [ ] Payout, AuditLog

## Schemas Pydantic
- [ ] Request/Response models
- [ ] Validações customizadas
- [ ] Serializers

## Autenticação
- [ ] JWT generation/validation
- [ ] Refresh token flow
- [ ] Password hashing (bcrypt)
- [ ] Token blacklist (Redis)

## Endpoints - Rides
- [ ] POST /rides
- [ ] GET /rides/{id}
- [ ] POST /rides/{id}/accept
- [ ] POST /rides/{id}/cancel
- [ ] POST /rides/{id}/start
- [ ] POST /rides/{id}/complete

## Endpoints - Payments
- [ ] POST /payments/intent
- [ ] GET /rides/{id}/payment
- [ ] POST /webhooks/efi/pix

## Endpoints - Payout
- [ ] GET /drivers/{id}/financials
- [ ] POST /payouts
- [ ] GET /payouts

## Integração Efí
- [ ] OAuth 2.0 client
- [ ] mTLS configurado
- [ ] Criar cobrança Pix
- [ ] Consultar status
- [ ] Transferência Pix (payout)

## Ledger Service
- [ ] create_journal_entry()
- [ ] validate_double_entry()
- [ ] get_account_balance()
- [ ] get_driver_balance()
- [ ] reverse_transaction()

## Jobs Celery
- [ ] expire_pix_charges
- [ ] reconcile_pix_charges
- [ ] process_payout
- [ ] calculate_running_balances

## WebSocket
- [ ] Connection Manager
- [ ] Event Bus (Redis Pub/Sub)
- [ ] Event Subscriber
- [ ] Handlers (ride.accepted, location.updated, etc)

## Observabilidade
- [ ] Logs estruturados (JSON)
- [ ] Prometheus metrics
- [ ] Grafana dashboards
- [ ] Alertas configurados
- [ ] Sentry integrado

## Testes
- [ ] Unit tests (>80% coverage)
- [ ] Integration tests
- [ ] Testes de concorrência
- [ ] Testes de idempotência
- [ ] Load tests (K6/Locust)

## Segurança
- [ ] Rate limiting
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] HTTPS enforced
- [ ] Secrets management
- [ ] WAF configurado

## Deploy
- [ ] Docker images
- [ ] docker-compose.yml
- [ ] Kubernetes manifests (prod)
- [ ] CI/CD pipeline
- [ ] Staging environment
- [ ] Production environment

## Documentação
- [ ] README.md
- [ ] API docs (Swagger/OpenAPI)
- [ ] Deployment guide
- [ ] Troubleshooting guide

---

# Conclusão

Este blueprint técnico fornece uma visão completa e pragmática para implementação do backend do app estilo Uber/99.

## Características-Chave

✅ **Consistência Transacional:** Lock híbrido (Redis + PostgreSQL)
✅ **Idempotência:** Em todas operações críticas
✅ **Ledger Financeiro:** Double-entry bookkeeping completo
✅ **Observabilidade:** Logs, métricas, alertas, tracing
✅ **Escalabilidade:** Horizontal scaling, cache distribuído
✅ **Segurança:** JWT, rate limiting, WAF, auditoria completa

## Tempo de Implementação

- **Fase 1 (MVP):** 30 dias
- **Fase 2 (Payout):** 30 dias
- **Fase 3 (Antifraude):** 30 dias
- **Fase 4 (Escala):** 30 dias
- **Total:** 120 dias (~4 meses)

## Próximos Passos

1. ✅ Revisar este blueprint
2. ⏳ Criar repositório Git
3. ⏳ Setup ambiente de desenvolvimento
4. ⏳ Iniciar Fase 1: MVP Seguro

---

**Referências:**
- Todos os documentos de arquitetura em `backend/*.md`
- PROMPT.md para requisitos completos
- PROGRESSO.md para acompanhamento

**Contato:**
- Issues: GitHub
- Documentação: `/docs`

---

**Blueprint Técnico - Versão 1.0**
**Gerado em:** 14/12/2024
**Backend App Estilo Uber/99**
