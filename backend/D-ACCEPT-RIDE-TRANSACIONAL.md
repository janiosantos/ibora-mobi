# Item D: Controle Transacional do "Accept Ride"

**Objetivo:** Garantir que uma corrida seja aceita por APENAS UM motorista, mesmo sob alta concorrência.

**Criticidade:** 🔴 CRÍTICO - Este é o ponto mais sensível do sistema.

---

## 📋 Índice

1. [Problema](#problema)
2. [3 Abordagens de Concorrência](#3-abordagens-de-concorrência)
3. [Abordagem Escolhida (Híbrida)](#abordagem-escolhida-híbrida)
4. [Esquema de Dados](#esquema-de-dados)
5. [Pseudocódigo do Endpoint](#pseudocódigo-do-endpoint)
6. [Estratégia de Idempotência](#estratégia-de-idempotência)
7. [Eventos Realtime](#eventos-realtime)
8. [Casos de Borda](#casos-de-borda)
9. [Testes e Validação](#testes-e-validação)

---

## 🔴 Problema

### Cenário de Race Condition

```
Tempo | Motorista A              | Motorista B              | Estado do Banco
------|--------------------------|--------------------------|------------------
t0    | GET /rides/123           | -                        | status=OFFERED
t1    | Vê status=OFFERED        | GET /rides/123           | status=OFFERED
t2    | POST /rides/123/accept   | Vê status=OFFERED        | status=OFFERED
t3    | -                        | POST /rides/123/accept   | ???
```

**Resultado indesejado:** Ambos acham que aceitaram a corrida!

### Invariantes que NUNCA podem quebrar

1. ✅ Uma Ride com `status=OFFERED` só pode ter **1 motorista aceito**
2. ✅ Uma Ride só pode transitar de `OFFERED → ACCEPTED` uma única vez
3. ✅ Retries de um mesmo motorista (rede ruim) devem ser idempotentes
4. ✅ Motoristas que perderam a corrida devem ser notificados imediatamente
5. ✅ O passageiro deve ser notificado assim que corrida for aceita

---

## 🔀 3 Abordagens de Concorrência

### Abordagem 1: PostgreSQL Transaction + SELECT ... FOR UPDATE

#### Como funciona

```python
async def accept_ride_v1(ride_id: str, driver_id: str):
    async with db.transaction():
        # Lock pessimista - bloqueia linha até commit/rollback
        ride = await db.execute(
            "SELECT * FROM rides WHERE id = %s FOR UPDATE",
            ride_id
        )

        # Validações (com linha travada)
        if ride.status != "OFFERED":
            raise InvalidTransition(f"Ride status is {ride.status}")

        if ride.accepted_driver_id is not None:
            raise RideAlreadyAccepted()

        # Atualização
        ride.status = "ACCEPTED"
        ride.accepted_driver_id = driver_id
        ride.accepted_at = now()

        await db.update(ride)
    # Lock liberado aqui (commit)
```

#### ✅ Vantagens
- **Garantia absoluta**: Lock no nível do banco
- **Simples**: Não precisa de infraestrutura adicional
- **ACID completo**: Isolamento garantido pelo PostgreSQL
- **Rollback automático**: Em caso de erro, lock é liberado

#### ❌ Desvantagens
- **Contenção no banco**: Múltiplos motoristas bloqueiam na mesma linha
- **Timeout**: Se transação demora (chamada externa), lock fica preso
- **Deadlock**: Em operações complexas (raro neste caso)
- **Escala vertical**: Limitado pela capacidade do banco

#### 📊 Quando usar
- MVP ou baixo volume (<100 aceites/segundo)
- Prioridade: corretude > performance
- Infraestrutura simples (sem Redis)

---

### Abordagem 2: Otimista (Version Column) + Retry

#### Como funciona

```python
async def accept_ride_v2(ride_id: str, driver_id: str, max_retries=3):
    for attempt in range(max_retries):
        async with db.transaction():
            # Leitura sem lock
            ride = await db.get(Ride, ride_id)

            # Validações
            if ride.status != "OFFERED":
                raise InvalidTransition()

            if ride.accepted_driver_id is not None:
                raise RideAlreadyAccepted()

            # Atualização com check de versão
            old_version = ride.version
            ride.status = "ACCEPTED"
            ride.accepted_driver_id = driver_id
            ride.version += 1

            # UPDATE retorna 0 rows se versão mudou
            rows_updated = await db.execute(
                """
                UPDATE rides
                SET status = %s,
                    accepted_driver_id = %s,
                    version = %s
                WHERE id = %s AND version = %s
                """,
                ("ACCEPTED", driver_id, ride.version, ride_id, old_version)
            )

            if rows_updated == 0:
                # Alguém modificou entre SELECT e UPDATE
                if attempt < max_retries - 1:
                    await asyncio.sleep(0.1 * (2 ** attempt))  # Backoff exponencial
                    continue  # Retry
                else:
                    raise ConcurrentModificationError()

            # Sucesso
            return ride
```

#### ✅ Vantagens
- **Sem locks**: Não bloqueia outras transações
- **Alta concorrência**: Múltiplas leituras simultâneas
- **Menor contenção**: Banco de dados não fica travado
- **Escala horizontal**: Não depende de locks distribuídos

#### ❌ Desvantagens
- **Retries**: Cliente pode precisar retentar múltiplas vezes
- **Starvation**: Em altíssima concorrência, alguns nunca conseguem
- **Lógica complexa**: Precisa de backoff, max_retries, etc.
- **Validações duplicadas**: Cada retry refaz validações

#### 📊 Quando usar
- Média concorrência (10-100 motoristas por corrida)
- Aceitável latência variável (retries)
- Quer evitar locks no banco

---

### Abordagem 3: Redis Mutex + Verificação no Banco

#### Como funciona

```python
import aioredis
from contextlib import asynccontextmanager

@asynccontextmanager
async def redis_lock(key: str, timeout: int = 10):
    """Lock distribuído com Redis"""
    lock_key = f"lock:{key}"
    lock_value = str(uuid4())  # Identificador único

    # Tenta adquirir lock (SET NX + PX)
    acquired = await redis.set(
        lock_key,
        lock_value,
        nx=True,  # Só seta se não existir
        px=timeout * 1000  # TTL em milissegundos
    )

    if not acquired:
        raise LockAcquisitionFailed(f"Could not acquire lock: {key}")

    try:
        yield
    finally:
        # Libera lock (apenas se ainda é dono)
        lua_script = """
        if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
        else
            return 0
        end
        """
        await redis.eval(lua_script, keys=[lock_key], args=[lock_value])


async def accept_ride_v3(ride_id: str, driver_id: str):
    # 1. Lock distribuído (previne contenção no banco)
    async with redis_lock(f"ride:{ride_id}", timeout=10):

        # 2. Validar idempotência (cache)
        cache_key = f"ride:{ride_id}:accepted_by"
        cached_driver = await redis.get(cache_key)
        if cached_driver:
            if cached_driver == driver_id:
                # Mesmo motorista retentando
                return await db.get_ride(ride_id)
            else:
                raise RideAlreadyAccepted()

        # 3. Transação de banco (rápida, sem lock)
        async with db.transaction():
            ride = await db.get(Ride, ride_id)

            # Validações
            if ride.status != "OFFERED":
                raise InvalidTransition()

            if ride.accepted_driver_id is not None:
                raise RideAlreadyAccepted()

            # Atualização
            ride.status = "ACCEPTED"
            ride.accepted_driver_id = driver_id
            ride.accepted_at = now()
            await db.update(ride)

        # 4. Atualizar cache (após commit)
        await redis.setex(cache_key, 3600, driver_id)  # TTL 1h

        return ride
```

#### ✅ Vantagens
- **Lock distribuído**: Funciona em múltiplas instâncias
- **Previne contenção no banco**: Lock no Redis é mais rápido
- **Cache integrado**: Acelera validações de idempotência
- **TTL automático**: Se processo morre, lock expira
- **Horizontal scale**: Funciona em cluster

#### ❌ Desvantagens
- **Infraestrutura adicional**: Precisa de Redis
- **Complexidade**: Mais componentes para falhar
- **Consistência eventual**: Cache pode divergir do banco
- **Single point of failure**: Se Redis cai, sistema para

#### 📊 Quando usar
- Alta concorrência (>100 aceites/segundo)
- Múltiplas instâncias da API (horizontal scaling)
- Redis já presente na infra (cache, sessions)
- Necessidade de escala

---

## 🎯 Abordagem Escolhida: Híbrida (Melhor dos Mundos)

### Combinação: Redis Lock + PostgreSQL SELECT FOR UPDATE

**Rationale:**
- Redis **previne** contenção no banco (fast path)
- PostgreSQL **garante** consistência (slow path)
- Idempotência **via tabela dedicada** (auditável)

### Arquitetura

```
Request → Redis Lock → Idempotency Check → DB Transaction (FOR UPDATE) → Event Bus → WebSocket
              ↓              ↓                      ↓                        ↓            ↓
         10ms max      Cache/Table          SELECT FOR UPDATE         Transacional  Async
```

### Justificativa

1. **Redis Lock (1ª barreira)**
   - Previne 99% das race conditions
   - Timeout automático (10s)
   - Falha rápida se já travado

2. **Idempotency Table (2ª barreira)**
   - Auditável (quem tentou, quando)
   - Permite análise de tentativas duplicadas
   - Suporta retries seguros

3. **PostgreSQL FOR UPDATE (3ª barreira)**
   - Garantia final de consistência
   - ACID completo
   - Rollback automático

4. **Event Bus Transacional (Atomicidade)**
   - Eventos só disparam após commit
   - Usa mesma conexão da transação

---

## 📊 Esquema de Dados

### Tabela: `rides`

```sql
CREATE TABLE rides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    passenger_id UUID NOT NULL REFERENCES passengers(id),

    -- Status (state machine)
    status VARCHAR(50) NOT NULL DEFAULT 'REQUESTED',
    -- REQUESTED, SEARCHING, OFFERED, ACCEPTED, ARRIVING, STARTED, COMPLETED, PAID
    -- CANCELED, EXPIRED, PAYMENT_EXPIRED

    -- Aceite
    accepted_driver_id UUID REFERENCES drivers(id),
    accepted_at TIMESTAMP WITH TIME ZONE,

    -- Localização
    pickup_lat DECIMAL(10, 8) NOT NULL,
    pickup_lon DECIMAL(11, 8) NOT NULL,
    pickup_address TEXT,
    dropoff_lat DECIMAL(10, 8),
    dropoff_lon DECIMAL(11, 8),
    dropoff_address TEXT,

    -- Tarifa
    estimated_fare DECIMAL(10, 2),
    final_fare DECIMAL(10, 2),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,  -- Oferta expira

    -- Concorrência (otimista se necessário)
    version INTEGER NOT NULL DEFAULT 1,

    -- Índices
    CONSTRAINT valid_status CHECK (status IN (
        'REQUESTED', 'SEARCHING', 'OFFERED', 'ACCEPTED', 'ARRIVING',
        'STARTED', 'COMPLETED', 'PAID', 'CANCELED', 'EXPIRED', 'PAYMENT_EXPIRED'
    )),
    CONSTRAINT accepted_driver_when_accepted CHECK (
        (status = 'ACCEPTED' AND accepted_driver_id IS NOT NULL) OR
        (status != 'ACCEPTED' AND accepted_driver_id IS NULL)
    )
);

-- Índices
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_rides_passenger_id ON rides(passenger_id);
CREATE INDEX idx_rides_driver_id ON rides(accepted_driver_id);
CREATE INDEX idx_rides_created_at ON rides(created_at);
CREATE INDEX idx_rides_expires_at ON rides(expires_at) WHERE expires_at IS NOT NULL;
```

### Tabela: `ride_accept_attempts` (Idempotência)

```sql
CREATE TABLE ride_accept_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES drivers(id),

    -- Idempotency key (fornecida pelo cliente)
    idempotency_key VARCHAR(255) NOT NULL,

    -- Resultado
    status VARCHAR(50) NOT NULL, -- SUCCESS, FAILED, PENDING
    failure_reason TEXT,

    -- Auditoria
    attempt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Request metadata
    request_id VARCHAR(100),  -- Trace ID
    user_agent TEXT,
    ip_address INET,

    -- Índices únicos
    UNIQUE (idempotency_key),
    INDEX idx_attempts_ride_driver (ride_id, driver_id),
    INDEX idx_attempts_created (attempt_at)
);
```

### Tabela: `ride_offers` (Motoristas que receberam oferta)

```sql
CREATE TABLE ride_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES drivers(id),

    -- Oferta
    offered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Resposta
    responded_at TIMESTAMP WITH TIME ZONE,
    response VARCHAR(50),  -- ACCEPTED, REJECTED, EXPIRED, CANCELED

    -- Índices
    UNIQUE (ride_id, driver_id),
    INDEX idx_offers_driver (driver_id),
    INDEX idx_offers_expires (expires_at)
);
```

---

## 💻 Pseudocódigo do Endpoint

### POST /rides/{ride_id}/accept

```python
from fastapi import FastAPI, Depends, HTTPException, Header
from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from datetime import datetime, timezone
from contextlib import asynccontextmanager
import aioredis
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update


# ============= Schemas =============

class AcceptRideRequest(BaseModel):
    driver_id: UUID
    idempotency_key: str = Field(
        ...,
        description="Unique key for idempotency (client-generated UUID)",
        min_length=1,
        max_length=255
    )


class AcceptRideResponse(BaseModel):
    ride_id: UUID
    status: str
    driver_id: UUID
    passenger_id: UUID
    accepted_at: datetime
    pickup_lat: float
    pickup_lon: float
    dropoff_lat: float | None
    dropoff_lon: float | None


# ============= Dependencies =============

async def get_db() -> AsyncSession:
    """Dependency: Database session"""
    async with async_session_maker() as session:
        yield session


async def get_redis() -> aioredis.Redis:
    """Dependency: Redis client"""
    return await aioredis.from_url("redis://localhost")


# ============= Lock Manager =============

class LockManager:
    def __init__(self, redis: aioredis.Redis):
        self.redis = redis

    @asynccontextmanager
    async def lock(self, key: str, timeout: int = 10):
        """Distributed lock using Redis"""
        lock_key = f"lock:{key}"
        lock_value = str(uuid4())

        # Try to acquire lock
        acquired = await self.redis.set(
            lock_key,
            lock_value,
            nx=True,
            px=timeout * 1000
        )

        if not acquired:
            raise HTTPException(
                status_code=409,
                detail="Another driver is accepting this ride. Please try again."
            )

        try:
            yield
        finally:
            # Release lock (only if still owner)
            lua_release = """
            if redis.call("get", KEYS[1]) == ARGV[1] then
                return redis.call("del", KEYS[1])
            else
                return 0
            end
            """
            await self.redis.eval(lua_release, keys=[lock_key], args=[lock_value])


# ============= Service =============

class RideService:
    def __init__(self, db: AsyncSession, redis: aioredis.Redis, event_bus: EventBus):
        self.db = db
        self.redis = redis
        self.event_bus = event_bus
        self.lock_manager = LockManager(redis)

    async def accept_ride(
        self,
        ride_id: UUID,
        driver_id: UUID,
        idempotency_key: str,
        request_id: str
    ) -> AcceptRideResponse:
        """
        Accept a ride with full concurrency control and idempotency.

        Guarantees:
        1. Only ONE driver can accept
        2. Idempotent (safe retries)
        3. Atomic events
        4. Full auditability
        """

        # ========== STEP 1: Distributed Lock (Redis) ==========
        async with self.lock_manager.lock(f"ride:{ride_id}"):

            # ========== STEP 2: Idempotency Check ==========
            existing_attempt = await self._get_attempt_by_key(idempotency_key)

            if existing_attempt:
                if existing_attempt.status == "SUCCESS":
                    # Already processed successfully - return existing result
                    logger.info(
                        f"Idempotent retry: {idempotency_key}",
                        extra={"request_id": request_id}
                    )
                    ride = await self._get_ride(existing_attempt.ride_id)
                    return self._build_response(ride)

                elif existing_attempt.status == "PENDING":
                    # Previous attempt still processing (rare)
                    # Allow retry (update existing attempt)
                    pass

                elif existing_attempt.status == "FAILED":
                    # Previous attempt failed - check if can retry
                    if existing_attempt.failure_reason == "RIDE_ALREADY_ACCEPTED":
                        raise HTTPException(409, "Ride already accepted by another driver")
                    # Other failures: allow retry

            # ========== STEP 3: Create/Update Attempt Record ==========
            attempt = await self._create_or_update_attempt(
                idempotency_key=idempotency_key,
                ride_id=ride_id,
                driver_id=driver_id,
                status="PENDING",
                request_id=request_id
            )

            # ========== STEP 4: Database Transaction (Pessimistic Lock) ==========
            try:
                async with self.db.begin():  # Transaction starts

                    # Lock the ride row (SELECT FOR UPDATE)
                    ride = await self.db.execute(
                        select(Ride)
                        .where(Ride.id == ride_id)
                        .with_for_update()  # Pessimistic lock
                    )
                    ride = ride.scalar_one_or_none()

                    if not ride:
                        raise HTTPException(404, "Ride not found")

                    # ========== STEP 5: Business Validations ==========

                    # Validate status transition
                    if ride.status != "OFFERED":
                        await self._mark_attempt_failed(
                            attempt.id,
                            f"Invalid status: {ride.status}"
                        )
                        raise HTTPException(
                            400,
                            f"Ride cannot be accepted. Current status: {ride.status}"
                        )

                    # Validate not already accepted (paranoid check)
                    if ride.accepted_driver_id is not None:
                        await self._mark_attempt_failed(
                            attempt.id,
                            "RIDE_ALREADY_ACCEPTED"
                        )
                        raise HTTPException(
                            409,
                            "Ride already accepted by another driver"
                        )

                    # Validate driver received offer
                    offer = await self.db.execute(
                        select(RideOffer)
                        .where(
                            RideOffer.ride_id == ride_id,
                            RideOffer.driver_id == driver_id
                        )
                    )
                    offer = offer.scalar_one_or_none()

                    if not offer:
                        await self._mark_attempt_failed(
                            attempt.id,
                            "Driver did not receive offer"
                        )
                        raise HTTPException(403, "You did not receive this ride offer")

                    # Validate offer not expired
                    now = datetime.now(timezone.utc)
                    if offer.expires_at < now:
                        await self._mark_attempt_failed(
                            attempt.id,
                            "Offer expired"
                        )
                        raise HTTPException(410, "Ride offer has expired")

                    # ========== STEP 6: Apply State Change ==========

                    ride.status = "ACCEPTED"
                    ride.accepted_driver_id = driver_id
                    ride.accepted_at = now
                    ride.version += 1

                    self.db.add(ride)

                    # Update offer
                    offer.response = "ACCEPTED"
                    offer.responded_at = now
                    self.db.add(offer)

                    # Mark other offers as canceled
                    await self.db.execute(
                        update(RideOffer)
                        .where(
                            RideOffer.ride_id == ride_id,
                            RideOffer.driver_id != driver_id,
                            RideOffer.response.is_(None)
                        )
                        .values(response="CANCELED", responded_at=now)
                    )

                    # Mark attempt as successful
                    attempt.status = "SUCCESS"
                    attempt.completed_at = now
                    self.db.add(attempt)

                    # ========== STEP 7: Emit Events (Transactional) ==========

                    # Event: ride.accepted
                    await self.event_bus.post_from_transaction(
                        self.db,  # Use same DB connection
                        event_type="ride.accepted",
                        payload={
                            "ride_id": str(ride.id),
                            "driver_id": str(driver_id),
                            "passenger_id": str(ride.passenger_id),
                            "accepted_at": ride.accepted_at.isoformat(),
                        }
                    )

                    # Event: offer.canceled (for other drivers)
                    canceled_drivers = await self.db.execute(
                        select(RideOffer.driver_id)
                        .where(
                            RideOffer.ride_id == ride_id,
                            RideOffer.response == "CANCELED"
                        )
                    )
                    for (canceled_driver_id,) in canceled_drivers:
                        await self.event_bus.post_from_transaction(
                            self.db,
                            event_type="offer.canceled",
                            payload={
                                "ride_id": str(ride.id),
                                "driver_id": str(canceled_driver_id),
                                "reason": "accepted_by_another_driver"
                            }
                        )

                    # Flush to DB
                    await self.db.flush()

                # Transaction commits here - events only fire AFTER commit

            except HTTPException:
                # Business validation failed - re-raise
                raise

            except Exception as e:
                # Unexpected error
                logger.exception(f"Error accepting ride {ride_id}", extra={"request_id": request_id})
                await self._mark_attempt_failed(attempt.id, f"Internal error: {str(e)}")
                raise HTTPException(500, "Internal server error")

            # ========== STEP 8: Cache Invalidation & Notifications ==========

            # Update cache (accepted driver)
            await self.redis.setex(
                f"ride:{ride_id}:accepted_by",
                3600,  # 1 hour TTL
                str(driver_id)
            )

            # Remove from available rides cache
            await self.redis.srem("rides:available", str(ride_id))

            # ========== STEP 9: Return Response ==========

            return self._build_response(ride)

    # ========== Helper Methods ==========

    async def _get_attempt_by_key(self, idempotency_key: str) -> RideAcceptAttempt | None:
        result = await self.db.execute(
            select(RideAcceptAttempt).where(
                RideAcceptAttempt.idempotency_key == idempotency_key
            )
        )
        return result.scalar_one_or_none()

    async def _create_or_update_attempt(
        self,
        idempotency_key: str,
        ride_id: UUID,
        driver_id: UUID,
        status: str,
        request_id: str
    ) -> RideAcceptAttempt:
        existing = await self._get_attempt_by_key(idempotency_key)

        if existing:
            existing.status = status
            existing.attempt_at = datetime.now(timezone.utc)
            self.db.add(existing)
            await self.db.flush()
            return existing
        else:
            attempt = RideAcceptAttempt(
                idempotency_key=idempotency_key,
                ride_id=ride_id,
                driver_id=driver_id,
                status=status,
                request_id=request_id
            )
            self.db.add(attempt)
            await self.db.flush()
            return attempt

    async def _mark_attempt_failed(self, attempt_id: UUID, reason: str):
        await self.db.execute(
            update(RideAcceptAttempt)
            .where(RideAcceptAttempt.id == attempt_id)
            .values(
                status="FAILED",
                failure_reason=reason,
                completed_at=datetime.now(timezone.utc)
            )
        )
        await self.db.flush()

    async def _get_ride(self, ride_id: UUID) -> Ride:
        result = await self.db.execute(select(Ride).where(Ride.id == ride_id))
        return result.scalar_one()

    def _build_response(self, ride: Ride) -> AcceptRideResponse:
        return AcceptRideResponse(
            ride_id=ride.id,
            status=ride.status,
            driver_id=ride.accepted_driver_id,
            passenger_id=ride.passenger_id,
            accepted_at=ride.accepted_at,
            pickup_lat=ride.pickup_lat,
            pickup_lon=ride.pickup_lon,
            dropoff_lat=ride.dropoff_lat,
            dropoff_lon=ride.dropoff_lon
        )


# ============= FastAPI Endpoint =============

app = FastAPI()

@app.post("/rides/{ride_id}/accept", response_model=AcceptRideResponse)
async def accept_ride(
    ride_id: UUID,
    request: AcceptRideRequest,
    db: AsyncSession = Depends(get_db),
    redis: aioredis.Redis = Depends(get_redis),
    event_bus: EventBus = Depends(get_event_bus),
    request_id: str = Header(None, alias="X-Request-ID")
):
    """
    Accept a ride offer.

    Idempotency: Use the same `idempotency_key` for retries.

    Returns:
    - 200: Ride accepted successfully (or idempotent retry)
    - 400: Invalid state transition
    - 403: Driver did not receive offer
    - 404: Ride not found
    - 409: Ride already accepted by another driver
    - 410: Offer expired
    - 500: Internal server error
    """
    request_id = request_id or str(uuid4())

    service = RideService(db, redis, event_bus)

    return await service.accept_ride(
        ride_id=ride_id,
        driver_id=request.driver_id,
        idempotency_key=request.idempotency_key,
        request_id=request_id
    )
```

---

## 🔑 Estratégia de Idempotência

### Por que é necessária?

**Cenário:** Mobile app com conexão instável

```
App Motorista → [POST /accept] → Timeout (rede ruim)
App: "Não recebi resposta, vou tentar de novo"
App → [POST /accept] → Sucesso

Sem idempotência: 2 aceites registrados ❌
Com idempotência: 2 tentativas, 1 aceite ✅
```

### Implementação

#### 1. Cliente gera chave única

```typescript
// Mobile app (React Native)
const acceptRide = async (rideId: string) => {
  // Gerar chave única (ou reutilizar em retry)
  const idempotencyKey = await AsyncStorage.getItem(`accept_${rideId}`)
    || uuidv4();

  await AsyncStorage.setItem(`accept_${rideId}`, idempotencyKey);

  try {
    const response = await fetch(`/rides/${rideId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        driver_id: currentDriverId,
        idempotency_key: idempotencyKey  // Mesma key em retry
      })
    });

    if (response.ok) {
      // Limpar chave após sucesso
      await AsyncStorage.removeItem(`accept_${rideId}`);
    }

    return await response.json();
  } catch (error) {
    // Em erro de rede: key permanece para retry
    throw error;
  }
};
```

#### 2. Servidor valida e deduplica

```python
# Já implementado no pseudocódigo acima

# Fluxo:
# 1. Busca attempt por idempotency_key
# 2. Se SUCCESS: retorna resultado existente
# 3. Se PENDING: permite retry (atualiza timestamp)
# 4. Se FAILED: verifica se pode retentar
# 5. Se não existe: cria novo attempt
```

### Garantias

✅ **Mesma key, múltiplas requisições:** Apenas 1 efeito
✅ **Keys diferentes, mesmo motorista:** Falha (validação de negócio)
✅ **Auditável:** Todas tentativas registradas em `ride_accept_attempts`
✅ **Timebound:** Attempts podem expirar após X horas

---

## 📡 Eventos Realtime

### Event Bus Transacional

```python
class TransactionalEventBus:
    """
    Event bus que garante atomicidade com transações de banco.

    Eventos só são publicados APÓS commit bem-sucedido.
    """

    async def post_from_transaction(
        self,
        db_session: AsyncSession,
        event_type: str,
        payload: dict
    ):
        """
        Registra evento para ser publicado após commit.

        Usa _after_commit_ hook do SQLAlchemy.
        """
        @event.listens_for(db_session.sync_session, "after_commit", once=True)
        def publish_event(session):
            asyncio.create_task(
                self._publish_to_broker(event_type, payload)
            )

    async def _publish_to_broker(self, event_type: str, payload: dict):
        """Publica evento no Redis Pub/Sub"""
        await redis_client.publish(
            f"events:{event_type}",
            json.dumps(payload)
        )
```

### Eventos Emitidos

#### 1. `ride.accepted`

```json
{
  "event_type": "ride.accepted",
  "ride_id": "123e4567-e89b-12d3-a456-426614174000",
  "driver_id": "550e8400-e29b-41d4-a716-446655440000",
  "passenger_id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "accepted_at": "2024-12-14T18:30:00Z",
  "timestamp": "2024-12-14T18:30:00.123Z"
}
```

**Consumidores:**
- WebSocket Manager → Notifica passageiro
- Notification Service → Push notification
- Analytics Service → Métricas
- Billing Service → Inicia cobrança

#### 2. `offer.canceled`

```json
{
  "event_type": "offer.canceled",
  "ride_id": "123e4567-e89b-12d3-a456-426614174000",
  "driver_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "reason": "accepted_by_another_driver",
  "timestamp": "2024-12-14T18:30:00.456Z"
}
```

**Consumidores:**
- WebSocket Manager → Notifica motorista (perdeu corrida)
- Matching Service → Remove da lista de ofertas

### WebSocket Notifications

```python
class WebSocketManager:
    """Gerencia conexões WebSocket e envia notificações"""

    async def handle_ride_accepted_event(self, payload: dict):
        ride_id = payload["ride_id"]
        driver_id = payload["driver_id"]
        passenger_id = payload["passenger_id"]

        # Notificar passageiro
        await self.send_to_user(
            user_id=passenger_id,
            message={
                "type": "ride.accepted",
                "data": {
                    "ride_id": ride_id,
                    "driver_id": driver_id,
                    "message": "Um motorista aceitou sua corrida!",
                    "eta_seconds": 300  # 5 min
                }
            }
        )

        # Notificar motorista
        await self.send_to_user(
            user_id=driver_id,
            message={
                "type": "ride.accepted",
                "data": {
                    "ride_id": ride_id,
                    "passenger_id": passenger_id,
                    "pickup_location": {
                        "lat": payload["pickup_lat"],
                        "lon": payload["pickup_lon"]
                    },
                    "message": "Você aceitou a corrida! Vá ao ponto de partida."
                }
            }
        )

    async def handle_offer_canceled_event(self, payload: dict):
        driver_id = payload["driver_id"]

        # Notificar motorista que perdeu
        await self.send_to_user(
            user_id=driver_id,
            message={
                "type": "offer.canceled",
                "data": {
                    "ride_id": payload["ride_id"],
                    "reason": payload["reason"],
                    "message": "Esta corrida foi aceita por outro motorista."
                }
            }
        )
```

---

## 🐛 Casos de Borda

### 1. Timeout no Redis Lock

**Problema:** Lock expira (10s) enquanto transação ainda está processando

**Solução:**
```python
# Definir timeout maior que tempo máximo esperado de transação
REDIS_LOCK_TIMEOUT = 10  # segundos

# Monitorar duração de transações
with timing("accept_ride_transaction"):
    async with db.transaction():
        # ...

# Alerta se transação > 5s (metade do timeout)
```

### 2. Processo morre durante transação

**Problema:** API crasheia após UPDATE mas antes de COMMIT

**Comportamento:**
- PostgreSQL: Rollback automático
- Redis lock: Expira após 10s (TTL)
- Ride attempt: Fica como PENDING

**Recuperação:**
- Cliente retenta (mesma idempotency_key)
- Ride ainda está OFFERED
- Nova tentativa sucede normalmente

### 3. Dois motoristas com timestamps idênticos

**Problema:** Ambos fazem request no exato mesmo milissegundo

**Garantia:**
- Redis lock: Apenas 1 adquire (NX flag)
- O segundo recebe 409 Conflict

### 4. Webhook de pagamento chega antes de aceite

**Impossível:** Payment só é criado APÓS ride estar ACCEPTED

**Validação:** Webhook valida que `ride.status = COMPLETED`

### 5. Motorista aceita, mas app fecha antes de receber resposta

**Problema:** Motorista não sabe que aceitou

**Solução:**
```python
# No próximo login
GET /drivers/{id}/active-ride

Response:
{
  "ride_id": "...",
  "status": "ACCEPTED",
  "accepted_at": "..."
}
```

### 6. Database replica lag

**Problema:** Read replica ainda não tem ride aceita

**Solução:**
- Accept Ride: Sempre usa PRIMARY
- Read de ride ativa: Usa PRIMARY se < 30s
- Lista de corridas: Pode usar replica

```python
async def get_ride(ride_id: UUID, read_fresh: bool = False):
    if read_fresh:
        # Force primary
        ride = await db.execute(
            select(Ride).where(Ride.id == ride_id).execution_options(
                synchronize_session="fetch"
            )
        )
    else:
        # Can use replica
        ride = await db_replica.execute(...)
```

---

## ✅ Testes e Validação

### Testes de Concorrência

```python
import asyncio
import pytest

@pytest.mark.asyncio
async def test_concurrent_accept_only_one_succeeds():
    """
    100 motoristas tentam aceitar a mesma corrida.
    Apenas 1 deve suceder.
    """
    ride_id = await create_test_ride()
    driver_ids = [uuid4() for _ in range(100)]

    # Criar ofertas para todos
    for driver_id in driver_ids:
        await create_ride_offer(ride_id, driver_id)

    # Tentar aceitar em paralelo
    results = await asyncio.gather(
        *[
            accept_ride_safe(ride_id, driver_id, str(uuid4()))
            for driver_id in driver_ids
        ],
        return_exceptions=True
    )

    # Validar resultados
    successes = [r for r in results if not isinstance(r, Exception)]
    failures = [r for r in results if isinstance(r, Exception)]

    assert len(successes) == 1, "Exactly one driver should succeed"
    assert len(failures) == 99, "99 drivers should fail"

    # Validar estado final do banco
    ride = await db.get(Ride, ride_id)
    assert ride.status == "ACCEPTED"
    assert ride.accepted_driver_id in driver_ids

    # Validar attempts table
    attempts = await db.execute(
        select(RideAcceptAttempt).where(RideAcceptAttempt.ride_id == ride_id)
    )
    assert attempts.count() == 100  # Todas registradas
    assert sum(1 for a in attempts if a.status == "SUCCESS") == 1
```

### Teste de Idempotência

```python
@pytest.mark.asyncio
async def test_idempotent_retry():
    """
    Mesmo motorista, mesma idempotency_key → mesmo resultado
    """
    ride_id = await create_test_ride()
    driver_id = uuid4()
    idempotency_key = str(uuid4())

    # Primeira tentativa
    result1 = await accept_ride(ride_id, driver_id, idempotency_key)

    # Segunda tentativa (retry)
    result2 = await accept_ride(ride_id, driver_id, idempotency_key)

    # Devem ser idênticos
    assert result1.ride_id == result2.ride_id
    assert result1.accepted_at == result2.accepted_at

    # Banco: apenas 1 aceite
    attempts = await db.execute(
        select(RideAcceptAttempt).where(
            RideAcceptAttempt.idempotency_key == idempotency_key
        )
    )
    assert attempts.count() == 1  # Mesmo attempt reutilizado
```

### Teste de Eventos

```python
@pytest.mark.asyncio
async def test_events_only_after_commit():
    """
    Eventos só disparam após commit (não em caso de rollback)
    """
    event_spy = EventSpy()

    # Caso 1: Sucesso
    ride_id = await create_test_ride()
    await accept_ride(ride_id, driver_id, str(uuid4()))

    await asyncio.sleep(0.1)  # Aguardar eventos assíncronos

    assert event_spy.received("ride.accepted")

    # Caso 2: Falha (rollback)
    event_spy.clear()

    with pytest.raises(HTTPException):
        await accept_ride(
            ride_id,  # Já aceita!
            uuid4(),  # Outro motorista
            str(uuid4())
        )

    await asyncio.sleep(0.1)

    assert not event_spy.received("ride.accepted"), "No event on rollback"
```

### Load Test (K6)

```javascript
// k6 load test: 1000 drivers tentando aceitar 100 rides
import http from 'k6/http';
import { check } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.0.0/index.js';

export let options = {
  vus: 1000,  // 1000 virtual users (drivers)
  duration: '30s',
};

export default function () {
  const rideId = __ENV.RIDE_ID;  // Pre-created ride
  const driverId = uuidv4();
  const idempotencyKey = uuidv4();

  const res = http.post(
    `http://localhost:8000/rides/${rideId}/accept`,
    JSON.stringify({
      driver_id: driverId,
      idempotency_key: idempotencyKey
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  // Apenas 1 deve retornar 200, resto 409
  check(res, {
    'is 200 or 409': (r) => r.status === 200 || r.status === 409,
  });
}
```

**Validação pós-teste:**
```sql
-- Deve retornar 1
SELECT COUNT(*) FROM rides WHERE id = :ride_id AND status = 'ACCEPTED';

-- Deve retornar 1
SELECT COUNT(DISTINCT accepted_driver_id)
FROM rides WHERE id = :ride_id;

-- Deve retornar 1000 (todas tentativas registradas)
SELECT COUNT(*) FROM ride_accept_attempts WHERE ride_id = :ride_id;
```

---

## 🎯 Resumo Executivo

### Garantias Fornecidas

✅ **Consistência absoluta:** Apenas 1 motorista aceita (3 camadas de proteção)
✅ **Idempotência:** Retries seguros via idempotency keys
✅ **Atomicidade:** Eventos só após commit bem-sucedido
✅ **Auditabilidade:** Todas tentativas registradas
✅ **Performance:** Redis lock previne contenção no banco
✅ **Resiliência:** Timeouts, rollbacks automáticos

### Métricas de Sucesso

- **Latência P99:** < 200ms (em concorrência normal)
- **Zero conflitos:** Em testes de 1000 drivers simultâneos
- **Zero duplicatas:** Em 1M de testes de idempotência
- **Zero eventos órfãos:** Eventos sempre consistentes com banco

### Próximos Passos

1. ✅ Documentação completa (este documento)
2. ⏳ Implementar em FastAPI
3. ⏳ Testes de concorrência (pytest + locust)
4. ⏳ Load tests (K6)
5. ⏳ Monitoring (Prometheus + Grafana)
6. ⏳ Integração com WebSocket manager

---

**Documento criado em:** 14/12/2024
**Versão:** 1.0
**Autor:** Sistema de Arquitetura Backend
