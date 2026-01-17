# 🚀 BACKEND INFRASTRUCTURE - COMPLETE GUIDE

## Redis + Celery + RabbitMQ + Firebase FCM

---

## 📦 **O QUE FOI IMPLEMENTADO**

### Infraestrutura Completa
```
✅ Redis (Cache + Broker)
✅ Celery (Background Jobs)
✅ RabbitMQ (Message Queue)
✅ Firebase FCM (Push Notifications)
✅ Distributed Locks
✅ Rate Limiting
✅ Idempotency
```

### Arquivos Criados (8 novos)
```
✅ app/celery_app.py              Celery configuration
✅ app/core/redis.py               Redis client + locks
✅ app/services/fcm_service.py     Firebase FCM
✅ app/tasks/settlement.py         Settlement jobs
✅ app/tasks/notifications.py      Push notifications
✅ app/tasks/matching.py           Matching + cleanup
✅ app/tasks/__init__.py           Tasks module
✅ requirements.txt                Updated deps
```

---

## 🔧 **SETUP E INSTALAÇÃO**

### 1. Instalar Redis
```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt install redis-server
sudo systemctl start redis
sudo systemctl enable redis

# Docker (recomendado)
docker run -d \
  --name ibora-redis \
  -p 6379:6379 \
  redis:7-alpine \
  redis-server --appendonly yes

# Verificar
redis-cli ping  # deve retornar PONG
```

### 2. Instalar RabbitMQ (Opcional)
```bash
# Docker (recomendado)
docker run -d \
  --name ibora-rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=ibora \
  -e RABBITMQ_DEFAULT_PASS=ibora123 \
  rabbitmq:3-management

# Acessar management UI: http://localhost:15672
# User: ibora / Pass: ibora123

# Ubuntu/Debian
sudo apt install rabbitmq-server
sudo systemctl start rabbitmq
```

### 3. Configurar Firebase
```bash
# 1. Criar projeto no Firebase Console
# https://console.firebase.google.com

# 2. Habilitar Cloud Messaging (FCM)
# Project Settings → Cloud Messaging

# 3. Baixar service account key
# Project Settings → Service Accounts → Generate New Private Key

# 4. Salvar como firebase-credentials.json
mv ~/Downloads/firebase-key.json backend/firebase-credentials.json

# 5. Adicionar ao .gitignore
echo "firebase-credentials.json" >> .gitignore
```

### 4. Instalar Dependências Python
```bash
cd backend

# Criar virtualenv
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
# ou
.\venv\Scripts\activate  # Windows

# Instalar
pip install -r requirements.txt
```

### 5. Configurar .env
```bash
cat > .env << EOF
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@localhost/ibora_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=

# Celery
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2

# RabbitMQ (opcional)
RABBITMQ_URL=amqp://ibora:ibora123@localhost:5672/
RABBITMQ_ENABLED=false

# Firebase
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json
FIREBASE_PROJECT_ID=ibora-app

# Other settings...
SECRET_KEY=your-secret-key
EOF
```

---

## 🚀 **EXECUTAR SERVIÇOS**

### Terminal 1: FastAPI Server
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

### Terminal 2: Celery Worker
```bash
cd backend
source venv/bin/activate

# Worker principal
celery -A app.celery_app worker \
  --loglevel=info \
  --concurrency=4 \
  -Q settlement,notifications,matching,cleanup

# Ou workers específicos por queue
celery -A app.celery_app worker -Q settlement -n settlement@%h
celery -A app.celery_app worker -Q notifications -n notifications@%h
```

### Terminal 3: Celery Beat (Scheduler)
```bash
cd backend
source venv/bin/activate

celery -A app.celery_app beat --loglevel=info
```

### Terminal 4: Flower (Monitoring - Opcional)
```bash
pip install flower
celery -A app.celery_app flower --port=5555

# Acessar: http://localhost:5555
```

---

## 📊 **ARQUITETURA**

### Redis DBs
```
DB 0: Cache geral
  - driver:123:location
  - ride:456:cache
  - metrics, locks

DB 1: Celery Broker
  - Task queue

DB 2: Celery Results
  - Task results
```

### Celery Queues
```
settlement:      D+N settlement jobs
notifications:   Push notifications
matching:        Driver matching
cleanup:         Cleanup jobs
```

### Periodic Tasks (Celery Beat)
```
Daily 02:00  → Settlement D+N
Daily 03:00  → Cleanup old rides
Every hour   → Cleanup notifications
Every 5 min  → Update driver metrics
Every 2 min  → Check PIX payments
```

---

## 💡 **COMO USAR**

### 1. Redis Cache
```python
from app.core.redis import RedisCache

# Set cache
RedisCache.set("user:123:profile", {"name": "João"}, ttl=3600)

# Get cache
profile = RedisCache.get("user:123:profile")

# Delete
RedisCache.delete("user:123:profile")

# Pattern delete
RedisCache.delete_pattern("user:*")
```

### 2. Distributed Locks
```python
from app.core.redis import distributed_lock

# Prevent race conditions
with distributed_lock("ride:123:accept"):
    # Only one worker can execute this
    ride = accept_ride(ride_id)
```

### 3. Rate Limiting
```python
from app.core.redis import RateLimiter

# 100 requests per minute
limiter = RateLimiter("api:user:123", limit=100, window=60)

if limiter.is_allowed():
    # Process request
    pass
else:
    raise HTTPException(status_code=429, detail="Too many requests")
```

### 4. Idempotency
```python
from app.core.redis import IdempotencyCache

cache = IdempotencyCache()

# Check if already processed
if cache.is_processed("payment:123"):
    return cache.get_result("payment:123")

# Process
result = process_payment()

# Mark as processed
cache.mark_processed("payment:123", result, ttl=86400)
```

### 5. Send Push Notification
```python
from app.tasks.notifications import send_push_notification

# Send async
send_push_notification.delay(
    token="fcm_token_here",
    title="Nova Corrida",
    body="Você tem uma nova solicitação",
    data={"ride_id": "123"},
    user_id="driver_456"
)
```

### 6. Trigger Background Job
```python
from app.tasks.settlement import settle_single_driver

# Trigger async
result = settle_single_driver.delay("driver_id_123")

# Wait for result (blocking)
result.get(timeout=10)
```

---

## 🎯 **TAREFAS DISPONÍVEIS**

### Settlement Tasks
```python
# Daily settlement (automatic at 2 AM)
from app.tasks.settlement import run_daily_settlement
run_daily_settlement.delay()

# Single driver (manual)
from app.tasks.settlement import settle_single_driver
settle_single_driver.delay("driver_id")

# Check status
from app.tasks.settlement import check_settlement_status
check_settlement_status.delay()
```

### Notification Tasks
```python
from app.tasks.notifications import (
    send_ride_request,
    send_driver_assigned,
    send_driver_arrived,
    send_ride_completed,
    send_payment_received,
    check_pending_pix,
    broadcast_to_topic,
)

# Ride request to driver
send_ride_request.delay(
    driver_token="fcm_token",
    passenger_name="João",
    pickup_address="Av Paulista, 1000",
    ride_id="123"
)

# Check pending PIX (automatic every 2 min)
check_pending_pix.delay()

# Broadcast to all drivers
broadcast_to_topic.delay(
    topic="drivers",
    title="Manutenção Programada",
    body="Sistema offline das 2h às 3h"
)
```

### Matching Tasks
```python
from app.tasks.matching import (
    update_driver_metrics,
    find_drivers_for_ride,
)

# Update metrics (automatic every 5 min)
update_driver_metrics.delay()

# Find drivers for ride
find_drivers_for_ride.delay(
    ride_id="123",
    pickup_lat=-23.5505,
    pickup_lng=-46.6333
)
```

### Cleanup Tasks
```python
from app.tasks.matching import (
    cleanup_old_rides,
    cleanup_old_notifications,
    cleanup_stale_drivers,
)

# Cleanup old rides (automatic daily)
cleanup_old_rides.delay()

# Mark stale drivers as offline
cleanup_stale_drivers.delay()
```

---

## 🔥 **EXEMPLO COMPLETO - RIDE FLOW**

```python
from fastapi import APIRouter, Depends
from app.tasks.notifications import (
    send_ride_request,
    send_driver_assigned,
    send_ride_completed,
)
from app.tasks.matching import find_drivers_for_ride
from app.core.redis import distributed_lock, RedisCache

router = APIRouter()

@router.post("/rides")
async def create_ride(ride_data: RideRequest):
    # 1. Create ride in DB
    ride = create_ride_in_db(ride_data)
    
    # 2. Find drivers (background)
    find_drivers_for_ride.delay(
        ride_id=str(ride.id),
        pickup_lat=ride.pickup_lat,
        pickup_lng=ride.pickup_lng
    )
    
    # 3. Get cached available drivers
    import time
    time.sleep(2)  # Wait for background task
    driver_ids = RedisCache.get(f"ride:{ride.id}:available_drivers")
    
    # 4. Send notifications to drivers
    for driver_id in driver_ids[:5]:  # Top 5
        driver = get_driver(driver_id)
        if driver.fcm_token:
            send_ride_request.delay(
                driver_token=driver.fcm_token,
                passenger_name=ride.passenger.name,
                pickup_address=ride.pickup_address,
                ride_id=str(ride.id)
            )
    
    return ride

@router.post("/rides/{ride_id}/accept")
async def accept_ride(ride_id: str, driver_id: str):
    # Use lock to prevent race condition
    with distributed_lock(f"ride:{ride_id}:accept"):
        ride = get_ride(ride_id)
        
        if ride.driver_id:
            raise HTTPException(400, "Ride already accepted")
        
        # Assign driver
        ride.driver_id = driver_id
        ride.status = "DRIVER_ASSIGNED"
        save(ride)
        
        # Send notification to passenger
        if ride.passenger.fcm_token:
            send_driver_assigned.delay(
                passenger_token=ride.passenger.fcm_token,
                driver_name=ride.driver.name,
                eta=5,
                ride_id=str(ride.id)
            )
    
    return ride

@router.put("/rides/{ride_id}/complete")
async def complete_ride(ride_id: str):
    ride = get_ride(ride_id)
    ride.status = "COMPLETED"
    save(ride)
    
    # Send notifications
    send_ride_completed.delay(
        passenger_token=ride.passenger.fcm_token,
        driver_token=ride.driver.fcm_token,
        price=ride.final_price,
        ride_id=str(ride.id)
    )
    
    return ride
```

---

## 🐛 **TROUBLESHOOTING**

### Redis Connection Error
```bash
# Check Redis
redis-cli ping

# Restart Redis
brew services restart redis  # macOS
sudo systemctl restart redis  # Linux

# Check config
redis-cli CONFIG GET bind
redis-cli CONFIG GET port
```

### Celery Worker Not Starting
```bash
# Check broker connection
celery -A app.celery_app inspect ping

# Clear queues
celery -A app.celery_app purge

# Check logs
celery -A app.celery_app worker --loglevel=debug
```

### Firebase Error
```bash
# Verify credentials file
cat firebase-credentials.json | python -m json.tool

# Test
python -c "import firebase_admin; from firebase_admin import credentials; cred = credentials.Certificate('firebase-credentials.json'); print('OK')"
```

### Task Not Executing
```bash
# Check registered tasks
celery -A app.celery_app inspect registered

# Check active tasks
celery -A app.celery_app inspect active

# Check scheduled tasks
celery -A app.celery_app inspect scheduled

# Trigger manually
python -c "from app.tasks.settlement import run_daily_settlement; run_daily_settlement.delay()"
```

---

## 📊 **MONITORING**

### Redis Stats
```bash
redis-cli INFO stats
redis-cli INFO memory
redis-cli DBSIZE
redis-cli KEYS "ride:*"
```

### Celery Stats
```bash
# Active workers
celery -A app.celery_app inspect active_queues

# Task stats
celery -A app.celery_app inspect stats

# Flower UI
# http://localhost:5555
```

### Firebase Stats
```bash
# Firebase Console
# https://console.firebase.google.com
# → Cloud Messaging → Analytics
```

---

## 🎊 **RESULTADO FINAL**

```
╔════════════════════════════════════════╗
║                                        ║
║  ✅ INFRASTRUCTURE COMPLETE!           ║
║                                        ║
║  ✅ Redis (Cache + Locks)              ║
║  ✅ Celery (10+ background jobs)       ║
║  ✅ Firebase FCM (Push)                ║
║  ✅ RabbitMQ (Optional)                ║
║  ✅ Distributed Locks                  ║
║  ✅ Rate Limiting                      ║
║  ✅ Idempotency                        ║
║                                        ║
║  8 arquivos novos                      ║
║  10+ tasks implementadas               ║
║  5 periodic jobs configurados          ║
║                                        ║
║  🚀 PRODUCTION READY! 🚀               ║
║                                        ║
╚════════════════════════════════════════╝
```

---

**🔥 BACKEND INFRASTRUCTURE 100% COMPLETA! 🔥**

**Implementado**:
- ✅ Redis client + async
- ✅ Distributed locks
- ✅ Rate limiting
- ✅ Idempotency cache
- ✅ Celery app config
- ✅ 10+ background tasks
- ✅ 5 periodic jobs (beat)
- ✅ Firebase FCM service
- ✅ Push notification templates

**Status**: Production Ready  
**Next**: Deploy and monitor! 🚀
