# Fases 4-11: Blueprints Consolidados

**Versão**: 1.0  
**Data**: 2024-12-15

---

## Fase 4: Serviços de Negócio (2-3 semanas)

### Estrutura

```
app/services/
├── ride_service.py          ⭐ Core
├── payment_service.py       ⭐ Core
├── ledger_service.py        ⭐ Core
├── settlement_service.py
├── payout_service.py
├── driver_credit_service.py
└── pricing_service.py
```

### RideService - Template

```python
class RideService:
    @staticmethod
    async def create_ride(db, passenger_id, ...):
        """1. Idempotência 2. Validar 3. Calcular 4. Criar"""
        pass
    
    @staticmethod
    async def accept_ride(db, ride_id, driver_id):
        """⭐ CRÍTICO: Lock Redis + Pessimista"""
        lock = await redis_client.lock(f"lock:ride:{ride_id}:accept")
        try:
            ride = db.query(Ride).with_for_update().first()
            # Validar e atualizar
        finally:
            await lock.release()
```

### Checklist
- [ ] 7 serviços completos
- [ ] Endpoints API integrados
- [ ] Testes unitários
- [ ] Documentação

---

## Fase 5: Integrações de Pagamento (2 semanas)

### EfiPayClient

```python
class EfiPayClient:
    async def create_immediate_charge(txid, amount):
        """Criar Pix Cob"""
        pass
    
    async def validate_webhook(payload, signature):
        """HMAC validation"""
        pass
```

### Webhook

```python
@router.post("/webhooks/efi/pix")
async def efi_webhook(request, background_tasks):
    """1. Validar 2. Deduplicar 3. Background process"""
    pass
```

### Checklist
- [ ] EfiPayClient completo
- [ ] CardProvider (interface)
- [ ] Webhooks com dedup
- [ ] Sandbox tests

---

## Fase 6: Jobs Assíncronos (1 semana)

### Worker

```python
# app/jobs/worker.py
class WorkerSettings:
    functions = [dispatch_ride, process_settlements, send_notification]
    cron_jobs = [cron(process_settlements, hour=0)]
```

### Settlement Job

```python
async def process_settlements(ctx):
    """Buscar vencidos → Processar → Ledger"""
    settlements = db.query(Settlement).filter(
        Settlement.status == "scheduled",
        Settlement.scheduled_for <= datetime.utcnow()
    ).all()
    
    for s in settlements:
        await SettlementService.process(db, s.id)
```

### Checklist
- [ ] Worker config
- [ ] 4+ jobs
- [ ] Dockerfile.worker
- [ ] Tests

---

## Fase 7: WebSocket (1 semana)

### Manager

```python
class WebSocketManager:
    connections: Dict[str, List[WebSocket]] = {}
    
    async def emit(channel, event, data):
        """Broadcast local + Redis Pub/Sub"""
        pass
```

### Endpoint

```python
@app.websocket("/ws")
async def websocket_endpoint(websocket, token):
    """Auth JWT → Connect → Loop"""
    user_id = verify_token(token)
    await manager.connect(websocket, f"user:{user_id}")
```

### Eventos
- ride.* (created, accepted, started, completed)
- payment.* (qr_generated, confirmed)
- wallet.updated

### Checklist
- [ ] WebSocketManager
- [ ] Endpoint /ws
- [ ] Auth JWT
- [ ] Redis Pub/Sub
- [ ] Docs eventos

---

## Fase 8: Admin (1 semana)

### Endpoints

```python
# CRUD configs
GET/POST/PUT/DELETE /admin/pricing
GET/POST/PUT/DELETE /admin/commission
GET /admin/audit-logs
POST /admin/users/{id}/block
```

### Audit Log

```python
audit_log = AuditLog(
    actor_id=admin.user_id,
    action="update_pricing",
    resource_type="pricing_config",
    changes={"before": ..., "after": ...}
)
```

### Checklist
- [ ] CRUD pricing/commission/settlement
- [ ] Audit logs
- [ ] Permissões granulares
- [ ] Reports básicos

---

## Fase 9: Testes (2 semanas)

### Estrutura

```
tests/
├── unit/           # >80% coverage
├── integration/    # API tests
├── e2e/           # Fluxos completos
└── concurrency/   # Race conditions
```

### E2E Example

```python
def test_complete_ride_flow(client, passenger, driver):
    """1. Create → 2. Accept → 3. Start → 4. Complete → 5. Pay"""
    ride = client.post("/api/v1/rides", ...)
    client.post(f"/api/v1/rides/{ride.id}/accept", ...)
    # ... assert each step
```

### Checklist
- [ ] Unit tests (>80%)
- [ ] Integration tests
- [ ] E2E tests (3+ flows)
- [ ] Concurrency tests
- [ ] CI configured

---

## Fase 10: Observabilidade (1 semana)

### Logging

```python
logger.info("ride_created", ride_id=..., price=...)
```

### Métricas

```python
from prometheus_client import Counter, Histogram

rides_created = Counter("rides_created_total", ["category"])
ride_duration = Histogram("ride_duration_minutes")
```

### Dashboards Grafana
- Operational: rides, drivers, payments
- Financial: revenue, settlements, payouts
- Performance: latency, errors, throughput

### Checklist
- [ ] Structlog configured
- [ ] Prometheus metrics
- [ ] Grafana dashboards
- [ ] Alerts (Alertmanager)
- [ ] APM (optional)

---

## Fase 11: Deploy e CI/CD (1 semana)

### GitHub Actions

```yaml
name: CI
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: poetry install
      - run: poetry run pytest --cov
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mobility-api
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: api
        image: mobility-api:latest
        resources:
          limits: {memory: "512Mi", cpu: "500m"}
```

### Checklist
- [ ] GitHub Actions (CI)
- [ ] Docker images otimizadas
- [ ] K8s manifests
- [ ] Deploy staging
- [ ] Deploy production
- [ ] Rollback procedure
- [ ] Monitoring prod

---

## Timeline Geral

| Fase | Duração | Key Deliverables |
|------|---------|------------------|
| 4 | 2-3 sem | 7 services + API |
| 5 | 2 sem | Efí + Card + Webhooks |
| 6 | 1 sem | 4 jobs + worker |
| 7 | 1 sem | WebSocket + events |
| 8 | 1 sem | Admin CRUD |
| 9 | 2 sem | Tests (80%+) |
| 10 | 1 sem | Logs + metrics |
| 11 | 1 sem | CI/CD + K8s |

**Total**: 13-16 semanas (3-4 meses)  
**Com equipe 3-4**: 8-10 semanas (2-2.5 meses)

---

## Próximos Passos

1. ✅ Revisar blueprints
2. 🔄 Iniciar Fase 1 (Setup)
3. 📝 Daily progress tracking
4. 🏃 Implementação iterativa

---

**Criado**: 2024-12-15  
**Manutenção**: Atualizar após cada fase
