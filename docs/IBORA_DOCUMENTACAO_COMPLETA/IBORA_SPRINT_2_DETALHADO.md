# 🎫 IBORA: SPRINT 2 DETALHADO - GEOLOCATION & MATCHING
## Tasks Granulares com Código Real

---

# SPRINT 2: GEOLOCATION & MATCHING CORE
**Duração:** Semanas 3-4 (10 dias úteis)  
**Objetivo:** Sistema de localização e matching funcionando  
**Team:** 5 pessoas  
**Velocity target:** 40 SP

---

## 📊 DISTRIBUIÇÃO DO TRABALHO

| Dev | Tasks | Story Points |
|-----|-------|--------------|
| Backend Dev 1 | PostGIS, Driver Status, Request Ride, Accept Ride | 21 SP |
| Backend Dev 2 | Query Nearby, Maps API, Pricing Engine | 19 SP |
| Frontend Dev | Driver App (status, location updates) | (paralelo) |
| Tech Lead | Code review, Redis setup, Performance | (support) |

---

## EPIC 2.1: GEOLOCALIZAÇÃO (13 SP)

---

### [BACKEND] Task 2.1.1: Setup PostGIS Extension
**Responsável:** Backend Dev 1  
**Estimativa:** 2 SP  
**Prioridade:** P0 (bloqueante)  
**Duração:** 4 horas

**Descrição:**
Habilitar extensão PostGIS no PostgreSQL RDS para queries geoespaciais.

**Pré-requisitos:**
- PostgreSQL 15+ instalado
- Acesso superuser ao banco
- Alembic configurado

**Passos:**

1. **Conectar no RDS:**
```bash
psql -h ibora-db.xxxxx.us-east-1.rds.amazonaws.com -U postgres -d ibora
```

2. **Habilitar PostGIS:**
```sql
-- Verificar versão PostgreSQL
SELECT version();

-- Instalar PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Verificar instalação
SELECT PostGIS_Version();
-- Deve retornar algo como: "3.3 USE_GEOS=1 USE_PROJ=1..."

-- Testar funcionalidade básica
SELECT ST_Distance(
    ST_MakePoint(-46.6333, -23.5505),  -- São Paulo
    ST_MakePoint(-43.1729, -22.9068)   -- Rio de Janeiro
);
-- Deve retornar distância em graus
```

3. **Criar Migration Alembic:**
```python
# backend/alembic/versions/002_add_postgis.py
"""Add PostGIS extension and location column

Revision ID: 002
Revises: 001
Create Date: 2024-12-17
"""
from alembic import op
import sqlalchemy as sa
from geoalchemy2 import Geometry

# revision identifiers
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None

def upgrade():
    # Enable PostGIS
    op.execute('CREATE EXTENSION IF NOT EXISTS postgis')
    
    # Add location column to drivers table
    op.add_column(
        'drivers',
        sa.Column('location', Geometry('POINT', srid=4326), nullable=True)
    )
    
    # Add last_location_update column
    op.add_column(
        'drivers',
        sa.Column('last_location_update', sa.DateTime(), nullable=True)
    )
    
    # Create GIST index for spatial queries
    op.execute(
        'CREATE INDEX idx_drivers_location ON drivers USING GIST (location)'
    )
    
    # Add online_status column
    op.add_column(
        'drivers',
        sa.Column(
            'online_status',
            sa.Enum('offline', 'online', 'in_ride', name='driveronlinestatus'),
            server_default='offline',
            nullable=False
        )
    )

def downgrade():
    op.drop_index('idx_drivers_location', table_name='drivers')
    op.drop_column('drivers', 'online_status')
    op.drop_column('drivers', 'last_location_update')
    op.drop_column('drivers', 'location')
    op.execute('DROP EXTENSION IF EXISTS postgis')
```

4. **Aplicar Migration:**
```bash
cd backend
alembic upgrade head

# Verificar
alembic current
# Deve mostrar: 002 (head)
```

5. **Atualizar Model:**
```python
# backend/src/models/driver.py
from geoalchemy2 import Geometry
from sqlalchemy import Column, Enum, DateTime
import enum

class DriverOnlineStatus(str, enum.Enum):
    OFFLINE = "offline"
    ONLINE = "online"
    IN_RIDE = "in_ride"

class Driver(Base, TimestampMixin):
    __tablename__ = "drivers"
    
    # ... existing fields
    
    # NEW: Geolocation
    location = Column(Geometry('POINT', srid=4326), nullable=True)
    last_location_update = Column(DateTime, nullable=True)
    online_status = Column(
        Enum(DriverOnlineStatus),
        default=DriverOnlineStatus.OFFLINE,
        nullable=False
    )
```

6. **Testar Query Geoespacial:**
```python
# backend/tests/test_postgis.py
from sqlalchemy import func
from geoalchemy2.elements import WKTElement

def test_postgis_distance(db):
    # Create test driver with location
    driver = Driver(
        user_id=1,
        cpf="12345678901",
        cnh_number="12345678",
        vehicle_plate="ABC1234",
        vehicle_model="Gol",
        vehicle_year=2020,
        vehicle_color="Branco"
    )
    
    # Set location (São Paulo)
    point = WKTElement('POINT(-46.6333 -23.5505)', srid=4326)
    driver.location = point
    
    db.add(driver)
    db.commit()
    
    # Query distance
    test_point = WKTElement('POINT(-46.6400 -23.5600)', srid=4326)
    
    distance = db.query(
        func.ST_Distance(
            func.ST_Transform(driver.location, 4326),
            func.ST_Transform(test_point, 4326)
        )
    ).scalar()
    
    assert distance is not None
    assert distance < 10000  # Less than 10km
```

**Critérios de Aceite:**
- [ ] PostGIS instalado sem erros
- [ ] Extensão retorna versão correta
- [ ] Migration aplicada com sucesso
- [ ] Coluna `location` tipo Geometry(POINT)
- [ ] Índice GIST criado
- [ ] Query ST_Distance funciona
- [ ] Teste unitário passa
- [ ] Code review aprovado

**Riscos:**
- RDS pode não ter PostGIS pré-instalado (solução: habilitar via console AWS)
- SRID 4326 é WGS84 (lat/lng padrão)

**Dependências:**
- Sprint 1: Driver Model criado
- PostgreSQL 15+ RDS provisionado

**Outputs:**
- Migration `002_add_postgis.py`
- Model atualizado com `location`
- Teste `test_postgis.py`
- Documentação no Wiki

---

### [BACKEND] Task 2.1.2: Driver Online/Offline Status
**Responsável:** Backend Dev 1  
**Estimativa:** 5 SP  
**Prioridade:** P0  
**Duração:** 1 dia

**Descrição:**
Implementar sistema de status online do motorista com atualização de localização.

**Arquitetura:**
```
Driver App → API (POST /drivers/me/status)
                ↓
          Update PostgreSQL
                ↓
          Update Redis Geo Index
                ↓
          Return Success
```

**Schema:**
```python
# backend/src/schemas/driver.py
from pydantic import BaseModel, field_validator
from src.models.driver import DriverOnlineStatus

class DriverStatusUpdate(BaseModel):
    status: DriverOnlineStatus
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    
    @field_validator('latitude')
    @classmethod
    def validate_latitude(cls, v):
        if v is not None and not -90 <= v <= 90:
            raise ValueError('Latitude must be between -90 and 90')
        return v
    
    @field_validator('longitude')
    @classmethod
    def validate_longitude(cls, v):
        if v is not None and not -180 <= v <= 180:
            raise ValueError('Longitude must be between -180 and 180')
        return v

class LocationUpdate(BaseModel):
    latitude: float
    longitude: float
    accuracy: Optional[float] = None  # in meters
    
    @field_validator('accuracy')
    @classmethod
    def validate_accuracy(cls, v):
        if v is not None and v < 0:
            raise ValueError('Accuracy must be positive')
        return v
```

**Endpoint 1: Update Status**
```python
# backend/src/api/v1/drivers.py
from fastapi import APIRouter, Depends, HTTPException
from geoalchemy2.elements import WKTElement
from src.core.redis import redis_client
from datetime import datetime

router = APIRouter()

@router.post("/me/status", status_code=200)
async def update_driver_status(
    status_update: DriverStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update driver online status
    
    When going ONLINE:
    - Must provide latitude/longitude
    - Added to Redis geospatial index
    
    When going OFFLINE:
    - Removed from Redis index
    - Cannot have active rides
    """
    
    # Get driver
    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()
    
    if not driver:
        raise HTTPException(404, "Driver profile not found")
    
    if driver.status != DriverStatus.ACTIVE:
        raise HTTPException(
            403, 
            f"Cannot go online. Driver status: {driver.status}"
        )
    
    # Validate status transition
    new_status = status_update.status
    
    # Check if has active ride
    active_ride = db.query(Ride).filter(
        Ride.driver_id == driver.id,
        Ride.status.in_([
            RideStatus.ACCEPTED,
            RideStatus.DRIVER_ARRIVING,
            RideStatus.IN_PROGRESS
        ])
    ).first()
    
    if new_status == DriverOnlineStatus.OFFLINE and active_ride:
        raise HTTPException(
            400,
            "Cannot go offline with active ride"
        )
    
    # Update location if provided
    if status_update.latitude and status_update.longitude:
        point = WKTElement(
            f'POINT({status_update.longitude} {status_update.latitude})',
            srid=4326
        )
        driver.location = point
        driver.last_location_update = datetime.utcnow()
    
    # Update status
    old_status = driver.online_status
    driver.online_status = new_status
    
    db.commit()
    
    # Update Redis geospatial index
    if new_status == DriverOnlineStatus.ONLINE:
        if not (status_update.latitude and status_update.longitude):
            raise HTTPException(
                400,
                "Latitude and longitude required to go online"
            )
        
        # Add to Redis geo index
        redis_client.geoadd(
            'drivers:online',
            status_update.longitude,
            status_update.latitude,
            driver.id
        )
        
        # Set TTL metadata (for cleanup)
        redis_client.setex(
            f'driver:online:{driver.id}',
            300,  # 5 min TTL
            datetime.utcnow().isoformat()
        )
    
    elif new_status == DriverOnlineStatus.OFFLINE:
        # Remove from Redis
        redis_client.zrem('drivers:online', driver.id)
        redis_client.delete(f'driver:online:{driver.id}')
    
    return {
        "status": "updated",
        "old_status": old_status,
        "new_status": new_status,
        "location_updated": status_update.latitude is not None
    }
```

**Endpoint 2: Update Location (High Frequency)**
```python
@router.post("/me/location", status_code=200)
async def update_driver_location(
    location: LocationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update driver location
    
    Called frequently (every 5-10 seconds) by driver app
    Optimized for performance:
    - Only updates if moved > 50m
    - Updates Redis immediately
    - Updates PostgreSQL in batch (background)
    """
    
    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()
    
    if not driver:
        raise HTTPException(404, "Driver profile not found")
    
    if driver.online_status == DriverOnlineStatus.OFFLINE:
        raise HTTPException(400, "Driver is offline")
    
    # Filter by accuracy (ignore imprecise locations)
    if location.accuracy and location.accuracy > 50:
        return {
            "status": "ignored",
            "reason": "accuracy_too_low",
            "accuracy": location.accuracy
        }
    
    # Check if moved significantly (>50m)
    moved_enough = True
    if driver.location:
        # Calculate distance from last location
        last_lat = db.scalar(func.ST_Y(driver.location))
        last_lng = db.scalar(func.ST_X(driver.location))
        
        from src.services.geo import calculate_distance
        distance = calculate_distance(
            last_lat, last_lng,
            location.latitude, location.longitude
        )
        
        moved_enough = distance > 0.05  # 50 meters
    
    if not moved_enough:
        return {
            "status": "ignored",
            "reason": "not_moved_enough"
        }
    
    # Update Redis (fast)
    redis_client.geoadd(
        'drivers:online',
        location.longitude,
        location.latitude,
        driver.id
    )
    
    # Update PostgreSQL (can be batched)
    point = WKTElement(
        f'POINT({location.longitude} {location.latitude})',
        srid=4326
    )
    driver.location = point
    driver.last_location_update = datetime.utcnow()
    
    db.commit()
    
    return {
        "status": "updated",
        "timestamp": driver.last_location_update.isoformat()
    }
```

**Service Helper:**
```python
# backend/src/services/geo.py
from math import radians, sin, cos, sqrt, atan2

def calculate_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """
    Calculate distance between two points using Haversine formula
    
    Args:
        lat1, lng1: Point 1 (degrees)
        lat2, lng2: Point 2 (degrees)
    
    Returns:
        Distance in kilometers
    """
    R = 6371  # Earth radius in km
    
    lat1, lng1, lat2, lng2 = map(radians, [lat1, lng1, lat2, lng2])
    
    dlat = lat2 - lat1
    dlng = lng2 - lng1
    
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlng/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    
    distance = R * c
    return distance
```

**Redis Structure:**
```redis
# Geospatial index (sorted set)
Key: drivers:online
Type: zset (geohash as score)
Members: driver_id
Commands:
  GEOADD drivers:online -46.6333 -23.5505 123
  GEORADIUS drivers:online -46.6400 -23.5600 5 km
  ZREM drivers:online 123

# Metadata (TTL for cleanup)
Key: driver:online:{driver_id}
Type: string
Value: ISO timestamp
TTL: 300 seconds (5 min)
```

**Tests:**
```python
# backend/tests/test_driver_status.py
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_go_online_success(async_client, db_driver, driver_token):
    response = await async_client.post(
        "/api/v1/drivers/me/status",
        json={
            "status": "online",
            "latitude": -23.5505,
            "longitude": -46.6333
        },
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["new_status"] == "online"
    assert data["location_updated"] is True
    
    # Verify Redis
    result = redis_client.geopos('drivers:online', db_driver.id)
    assert result is not None

@pytest.mark.asyncio
async def test_go_online_without_location_fails(async_client, driver_token):
    response = await async_client.post(
        "/api/v1/drivers/me/status",
        json={"status": "online"},
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 400
    assert "latitude and longitude required" in response.text.lower()

@pytest.mark.asyncio
async def test_update_location_filters_low_accuracy(
    async_client, db_driver_online, driver_token
):
    response = await async_client.post(
        "/api/v1/drivers/me/location",
        json={
            "latitude": -23.5600,
            "longitude": -46.6400,
            "accuracy": 100  # Too low
        },
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ignored"
    assert data["reason"] == "accuracy_too_low"

@pytest.mark.asyncio
async def test_update_location_ignores_small_movements(
    async_client, db_driver_online, driver_token
):
    # Update once
    await async_client.post(
        "/api/v1/drivers/me/location",
        json={"latitude": -23.5505, "longitude": -46.6333},
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    # Try to update with tiny movement (10m)
    response = await async_client.post(
        "/api/v1/drivers/me/location",
        json={"latitude": -23.5506, "longitude": -46.6333},
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ignored"
    assert data["reason"] == "not_moved_enough"
```

**Critérios de Aceite:**
- [ ] Motorista pode ficar online/offline
- [ ] Localização obrigatória para online
- [ ] Impede offline com corrida ativa
- [ ] Redis geospatial atualizado
- [ ] Filtra locations com baixa accuracy (>50m)
- [ ] Ignora movimentos < 50m
- [ ] Performance: p95 < 100ms
- [ ] Todos os testes passam (8 testes)

**Performance Targets:**
- Update status: < 200ms (p95)
- Update location: < 100ms (p95)
- Throughput: 100 req/s

**Dependências:**
- Task 2.1.1: PostGIS Setup
- Redis configurado com geospatial support

---

[Continua com as outras 10+ tasks do Sprint 2 com o mesmo nível de detalhe...]

**Deseja que eu continue com TODAS as tasks do Sprint 2 neste nível de detalhe?**

Ou prefere que eu:
1. Siga para Sprint 3 com mesmo nível de detalhe?
2. Crie um "Sprint Starter Kit" com setup completo (Docker Compose + seed data)?
3. Crie os testes E2E completos de ponta a ponta?

Me avise! 🚀