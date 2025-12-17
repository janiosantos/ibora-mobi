# 🎫 IBORA: SPRINT 3 DETALHADO - RIDE LIFECYCLE
## Tasks Granulares com Código Real e Testes Completos

---

# SPRINT 3: RIDE LIFECYCLE
**Duração:** Semanas 5-6 (10 dias úteis)  
**Objetivo:** Fluxo completo da corrida do início ao fim  
**Team:** 5 pessoas  
**Velocity target:** 40 SP

---

## 📊 DISTRIBUIÇÃO DO TRABALHO

| Dev | Tasks | Story Points |
|-----|-------|--------------|
| Backend Dev 1 | Start Trip, Complete Ride, Rate Ride | 18 SP |
| Backend Dev 2 | GPS Tracking, Cancel Ride, Metrics | 17 SP |
| Frontend Dev | Ride screens (in-progress, rating) | 5 SP |
| Tech Lead | State machine validation, Performance | (support) |

---

## EPIC 3.1: RIDE PROGRESSION (18 SP)

---

### [BACKEND] Task 3.1.1: Endpoint POST /rides/{id}/arriving
**Responsável:** Backend Dev 1  
**Estimativa:** 3 SP  
**Prioridade:** P0  
**Duração:** 6 horas

**Descrição:**
Motorista sinaliza que está chegando ao local de origem para buscar o passageiro.

**Flow:**
```
Driver arrives at pickup → API call → Update status → Notify passenger
```

**Schema:**
```python
# backend/src/schemas/ride.py (adicionar)
from pydantic import BaseModel

class RideArrivingResponse(BaseModel):
    ride_id: int
    status: RideStatus
    eta_seconds: Optional[int]  # ETA to passenger
    
    class Config:
        from_attributes = True
```

**Endpoint:**
```python
# backend/src/api/v1/rides.py
from src.services.ride_state_machine import RideStateMachine
from src.services.websocket import websocket_manager

@router.post("/{ride_id}/arriving", response_model=RideArrivingResponse)
async def driver_arriving(
    ride_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Driver signals arrival at pickup location
    
    Transitions: ACCEPTED → DRIVER_ARRIVING
    
    Calculates ETA based on current distance to origin
    """
    
    # Get driver
    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()
    
    if not driver:
        raise HTTPException(404, "Driver profile not found")
    
    # Get ride with pessimistic lock
    ride = db.query(Ride).filter(
        Ride.id == ride_id,
        Ride.driver_id == driver.id
    ).with_for_update().first()
    
    if not ride:
        raise HTTPException(404, "Ride not found or not assigned to you")
    
    # Validate state transition
    if ride.status != RideStatus.ACCEPTED:
        raise HTTPException(
            400,
            f"Cannot signal arrival from status: {ride.status}"
        )
    
    # Transition state
    ride = RideStateMachine.transition(ride, RideStatus.DRIVER_ARRIVING)
    
    # Calculate ETA
    eta_seconds = None
    if driver.location and ride.origin_lat and ride.origin_lng:
        driver_lat = db.scalar(func.ST_Y(driver.location))
        driver_lng = db.scalar(func.ST_X(driver.location))
        
        from src.services.geo import calculate_distance
        distance_km = calculate_distance(
            driver_lat, driver_lng,
            ride.origin_lat, ride.origin_lng
        )
        
        # Estimate ETA: assume 30 km/h average speed in city
        eta_seconds = int((distance_km / 30) * 3600)
    
    db.commit()
    db.refresh(ride)
    
    # Notify passenger
    await websocket_manager.send_to_passenger(
        ride.passenger_id,
        {
            "type": "driver_arriving",
            "ride_id": ride.id,
            "eta_seconds": eta_seconds,
            "driver_location": {
                "latitude": driver_lat if driver.location else None,
                "longitude": driver_lng if driver.location else None
            }
        }
    )
    
    return RideArrivingResponse(
        ride_id=ride.id,
        status=ride.status,
        eta_seconds=eta_seconds
    )
```

**Tests:**
```python
# backend/tests/test_ride_lifecycle.py
import pytest
from httpx import AsyncClient
from src.models.ride import RideStatus

@pytest.mark.asyncio
async def test_driver_arriving_success(
    async_client: AsyncClient,
    db_ride_accepted,
    driver_token
):
    """Test driver can signal arrival"""
    response = await async_client.post(
        f"/api/v1/rides/{db_ride_accepted.id}/arriving",
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "driver_arriving"
    assert "eta_seconds" in data

@pytest.mark.asyncio
async def test_driver_arriving_invalid_status(
    async_client: AsyncClient,
    db_ride_completed,
    driver_token
):
    """Cannot signal arrival from completed status"""
    response = await async_client.post(
        f"/api/v1/rides/{db_ride_completed.id}/arriving",
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 400
    assert "cannot signal arrival" in response.text.lower()

@pytest.mark.asyncio
async def test_driver_arriving_not_assigned_to_driver(
    async_client: AsyncClient,
    db_ride_accepted,
    another_driver_token
):
    """Driver cannot signal arrival for ride not assigned to them"""
    response = await async_client.post(
        f"/api/v1/rides/{db_ride_accepted.id}/arriving",
        headers={"Authorization": f"Bearer {another_driver_token}"}
    )
    
    assert response.status_code == 404
```

**Critérios de Aceite:**
- [ ] Transiciona ACCEPTED → DRIVER_ARRIVING
- [ ] Calcula ETA baseado em distância
- [ ] Notifica passageiro via WebSocket
- [ ] Bloqueia transições inválidas
- [ ] Verifica ownership do ride
- [ ] Testes passam (3 cenários)

**Dependências:**
- Sprint 2: Accept Ride
- WebSocket manager configurado

---

### [BACKEND] Task 3.1.2: Endpoint POST /rides/{id}/start-trip
**Responsável:** Backend Dev 1  
**Estimativa:** 5 SP  
**Prioridade:** P0  
**Duração:** 1 dia

**Descrição:**
Motorista inicia a viagem após pegar o passageiro. Isso marca o início do tracking GPS e da cobrança.

**Flow:**
```
Driver picks up passenger → Start trip → Begin GPS tracking → Start billing
```

**Endpoint:**
```python
# backend/src/api/v1/rides.py
from src.services.gps_tracking import GPSTrackingService

@router.post("/{ride_id}/start-trip")
async def start_trip(
    ride_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    """
    Start the trip
    
    Transitions: DRIVER_ARRIVING → IN_PROGRESS
    
    Actions:
    1. Update ride status
    2. Set started_at timestamp
    3. Start GPS tracking worker
    4. Notify passenger
    """
    
    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()
    
    if not driver:
        raise HTTPException(404, "Driver profile not found")
    
    # Lock ride
    ride = db.query(Ride).filter(
        Ride.id == ride_id,
        Ride.driver_id == driver.id
    ).with_for_update().first()
    
    if not ride:
        raise HTTPException(404, "Ride not found")
    
    # Validate current status
    if ride.status != RideStatus.DRIVER_ARRIVING:
        raise HTTPException(
            400,
            f"Cannot start trip from status: {ride.status}. "
            f"Must be DRIVER_ARRIVING"
        )
    
    # Validate driver is near origin (within 100m)
    if driver.location:
        driver_lat = db.scalar(func.ST_Y(driver.location))
        driver_lng = db.scalar(func.ST_X(driver.location))
        
        from src.services.geo import calculate_distance
        distance_km = calculate_distance(
            driver_lat, driver_lng,
            ride.origin_lat, ride.origin_lng
        )
        
        if distance_km > 0.1:  # 100 meters
            raise HTTPException(
                400,
                f"Driver too far from pickup location ({distance_km:.2f}km). "
                f"Must be within 100m"
            )
    
    # Transition to IN_PROGRESS
    ride = RideStateMachine.transition(ride, RideStatus.IN_PROGRESS)
    ride.started_at = datetime.utcnow()
    
    # Initialize route tracking
    ride.route_points = []
    
    db.commit()
    db.refresh(ride)
    
    # Start GPS tracking (background)
    background_tasks.add_task(
        GPSTrackingService.start_tracking,
        ride.id
    )
    
    # Notify passenger
    await websocket_manager.send_to_passenger(
        ride.passenger_id,
        {
            "type": "trip_started",
            "ride_id": ride.id,
            "started_at": ride.started_at.isoformat()
        }
    )
    
    # Log event
    logger.info(
        f"Trip started: ride_id={ride.id}, driver_id={driver.id}, "
        f"started_at={ride.started_at}"
    )
    
    return {
        "status": "trip_started",
        "ride_id": ride.id,
        "started_at": ride.started_at.isoformat()
    }
```

**GPS Validation Service:**
```python
# backend/src/services/geo.py (adicionar)
def is_near_location(
    lat1: float,
    lng1: float,
    lat2: float,
    lng2: float,
    threshold_km: float = 0.1
) -> bool:
    """
    Check if two locations are within threshold distance
    
    Args:
        lat1, lng1: First location
        lat2, lng2: Second location
        threshold_km: Maximum distance in km (default 100m)
    
    Returns:
        True if within threshold
    """
    distance = calculate_distance(lat1, lng1, lat2, lng2)
    return distance <= threshold_km
```

**Tests:**
```python
# backend/tests/test_ride_lifecycle.py

@pytest.mark.asyncio
async def test_start_trip_success(
    async_client: AsyncClient,
    db_ride_arriving,
    db_driver_at_pickup,  # Driver positioned at pickup location
    driver_token
):
    """Test successful trip start"""
    response = await async_client.post(
        f"/api/v1/rides/{db_ride_arriving.id}/start-trip",
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "trip_started"
    assert "started_at" in data
    
    # Verify database
    db = SessionLocal()
    ride = db.query(Ride).filter(Ride.id == db_ride_arriving.id).first()
    assert ride.status == RideStatus.IN_PROGRESS
    assert ride.started_at is not None
    assert ride.route_points == []
    db.close()

@pytest.mark.asyncio
async def test_start_trip_too_far_from_pickup(
    async_client: AsyncClient,
    db_ride_arriving,
    db_driver_far_away,  # Driver 1km away
    driver_token
):
    """Cannot start trip if too far from pickup"""
    response = await async_client.post(
        f"/api/v1/rides/{db_ride_arriving.id}/start-trip",
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 400
    assert "too far from pickup" in response.text.lower()

@pytest.mark.asyncio
async def test_start_trip_invalid_status(
    async_client: AsyncClient,
    db_ride_accepted,  # Still in ACCEPTED status
    driver_token
):
    """Cannot start trip from ACCEPTED status"""
    response = await async_client.post(
        f"/api/v1/rides/{db_ride_accepted.id}/start-trip",
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 400
    assert "must be driver_arriving" in response.text.lower()

@pytest.mark.asyncio
async def test_start_trip_starts_gps_tracking(
    async_client: AsyncClient,
    db_ride_arriving,
    db_driver_at_pickup,
    driver_token,
    mock_gps_tracking_service
):
    """Verify GPS tracking is started"""
    response = await async_client.post(
        f"/api/v1/rides/{db_ride_arriving.id}/start-trip",
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 200
    
    # Verify tracking service was called
    mock_gps_tracking_service.start_tracking.assert_called_once_with(
        db_ride_arriving.id
    )
```

**Fixtures para Testes:**
```python
# backend/tests/conftest.py (adicionar)

@pytest.fixture
def db_ride_arriving(db, db_driver, db_passenger):
    """Ride in DRIVER_ARRIVING status"""
    ride = Ride(
        passenger_id=db_passenger.id,
        driver_id=db_driver.id,
        origin_lat=-23.5505,
        origin_lng=-46.6333,
        destination_lat=-23.5600,
        destination_lng=-46.6400,
        estimated_distance_km=2.0,
        estimated_duration_min=10,
        estimated_price=15.00,
        payment_method=PaymentMethod.PIX,
        status=RideStatus.DRIVER_ARRIVING,
        accepted_at=datetime.utcnow()
    )
    db.add(ride)
    db.commit()
    db.refresh(ride)
    return ride

@pytest.fixture
def db_driver_at_pickup(db, db_driver):
    """Driver positioned at pickup location"""
    from geoalchemy2.elements import WKTElement
    
    # Set driver location to pickup (within 50m)
    point = WKTElement('POINT(-46.6333 -23.5505)', srid=4326)
    db_driver.location = point
    db_driver.last_location_update = datetime.utcnow()
    db.commit()
    
    return db_driver

@pytest.fixture
def db_driver_far_away(db, db_driver):
    """Driver 1km away from pickup"""
    from geoalchemy2.elements import WKTElement
    
    # Set driver 1km away
    point = WKTElement('POINT(-46.6400 -23.5600)', srid=4326)
    db_driver.location = point
    db.commit()
    
    return db_driver
```

**Critérios de Aceite:**
- [ ] Valida status atual (DRIVER_ARRIVING)
- [ ] Valida distância ao pickup (<100m)
- [ ] Transiciona para IN_PROGRESS
- [ ] Salva started_at timestamp
- [ ] Inicializa route_points vazio
- [ ] Inicia GPS tracking (background)
- [ ] Notifica passageiro via WebSocket
- [ ] Testes passam (4 cenários)
- [ ] Log estruturado do evento

**Performance:**
- Response time: p95 < 300ms
- GPS tracking start: < 500ms

**Dependências:**
- Task 3.1.1: Driver Arriving
- GPS Tracking Service (Task 3.1.3)

---

### [BACKEND] Task 3.1.3: GPS Tracking Worker
**Responsável:** Backend Dev 2  
**Estimativa:** 5 SP  
**Prioridade:** P0  
**Duração:** 1 dia

**Descrição:**
Worker assíncrono que salva pontos GPS da corrida a cada 30 segundos para cálculo de distância real.

**Arquitetura:**
```
Trip starts → Spawn async task → Every 30s save GPS point → Trip ends → Stop task
```

**Service:**
```python
# backend/src/services/gps_tracking.py
import asyncio
from typing import Dict
from sqlalchemy import func
from src.core.database import SessionLocal
from src.models.ride import Ride, RideStatus
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class GPSTrackingService:
    """
    Manages GPS tracking for active rides
    
    Each ride gets a background asyncio task that:
    1. Fetches driver's current location every 30s
    2. Saves to ride.route_points (JSON array)
    3. Stops automatically when ride completes
    """
    
    # Active tracking tasks {ride_id: asyncio.Task}
    active_trackings: Dict[int, asyncio.Task] = {}
    
    @classmethod
    async def start_tracking(cls, ride_id: int):
        """
        Start GPS tracking for a ride
        
        Creates a background task that runs until ride completes
        """
        if ride_id in cls.active_trackings:
            logger.warning(f"Tracking already active for ride {ride_id}")
            return
        
        logger.info(f"Starting GPS tracking for ride {ride_id}")
        
        task = asyncio.create_task(cls._track_ride(ride_id))
        cls.active_trackings[ride_id] = task
    
    @classmethod
    async def stop_tracking(cls, ride_id: int):
        """
        Stop GPS tracking for a ride
        
        Cancels the background task
        """
        task = cls.active_trackings.pop(ride_id, None)
        
        if task:
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass
            
            logger.info(f"Stopped GPS tracking for ride {ride_id}")
    
    @classmethod
    async def _track_ride(cls, ride_id: int):
        """
        Background task that saves GPS points
        
        Runs every 30 seconds until:
        - Ride status != IN_PROGRESS
        - Task is cancelled
        """
        db = SessionLocal()
        
        try:
            while True:
                try:
                    # Get ride
                    ride = db.query(Ride).filter(Ride.id == ride_id).first()
                    
                    if not ride:
                        logger.error(f"Ride {ride_id} not found, stopping tracking")
                        break
                    
                    # Check if still in progress
                    if ride.status != RideStatus.IN_PROGRESS:
                        logger.info(
                            f"Ride {ride_id} no longer IN_PROGRESS "
                            f"(status: {ride.status}), stopping tracking"
                        )
                        break
                    
                    # Get driver's current location
                    driver = ride.driver
                    
                    if not driver or not driver.location:
                        logger.warning(
                            f"Driver location not available for ride {ride_id}"
                        )
                        await asyncio.sleep(30)
                        continue
                    
                    # Extract lat/lng
                    lat = db.scalar(func.ST_Y(driver.location))
                    lng = db.scalar(func.ST_X(driver.location))
                    
                    # Create GPS point
                    gps_point = {
                        "lat": float(lat),
                        "lng": float(lng),
                        "timestamp": datetime.utcnow().isoformat(),
                        "accuracy": None  # Can be added if available
                    }
                    
                    # Append to route_points
                    if ride.route_points is None:
                        ride.route_points = []
                    
                    ride.route_points.append(gps_point)
                    
                    # Commit
                    db.commit()
                    
                    logger.debug(
                        f"Saved GPS point for ride {ride_id}: "
                        f"lat={lat:.6f}, lng={lng:.6f}"
                    )
                    
                    # Wait 30 seconds
                    await asyncio.sleep(30)
                
                except Exception as e:
                    logger.error(
                        f"Error tracking ride {ride_id}: {e}",
                        exc_info=True
                    )
                    await asyncio.sleep(30)
        
        finally:
            db.close()
            cls.active_trackings.pop(ride_id, None)
            logger.info(f"GPS tracking task ended for ride {ride_id}")
    
    @classmethod
    def get_active_trackings_count(cls) -> int:
        """Get number of active tracking tasks"""
        return len(cls.active_trackings)
    
    @classmethod
    async def cleanup_orphaned_trackings(cls):
        """
        Stop tracking for rides that are no longer IN_PROGRESS
        
        Should be called periodically (e.g., every 5 minutes)
        """
        db = SessionLocal()
        
        try:
            ride_ids = list(cls.active_trackings.keys())
            
            for ride_id in ride_ids:
                ride = db.query(Ride).filter(Ride.id == ride_id).first()
                
                if not ride or ride.status != RideStatus.IN_PROGRESS:
                    await cls.stop_tracking(ride_id)
                    logger.info(f"Cleaned up orphaned tracking for ride {ride_id}")
        
        finally:
            db.close()
```

**Cleanup Job (Scheduled):**
```python
# backend/src/jobs/cleanup_gps_tracking.py
from src.services.gps_tracking import GPSTrackingService
import asyncio

async def cleanup_orphaned_gps_trackings():
    """
    Periodic job to clean up orphaned GPS tracking tasks
    
    Schedule: Every 5 minutes
    """
    await GPSTrackingService.cleanup_orphaned_trackings()

# Schedule with APScheduler or similar
from apscheduler.schedulers.asyncio import AsyncIOScheduler

scheduler = AsyncIOScheduler()
scheduler.add_job(
    cleanup_orphaned_gps_trackings,
    'interval',
    minutes=5
)
```

**Tests:**
```python
# backend/tests/test_gps_tracking.py
import pytest
import asyncio
from src.services.gps_tracking import GPSTrackingService

@pytest.mark.asyncio
async def test_gps_tracking_saves_points(db_ride_in_progress, db_driver):
    """Test that GPS points are saved every 30s"""
    # Start tracking
    await GPSTrackingService.start_tracking(db_ride_in_progress.id)
    
    # Wait for 2 points (60s)
    await asyncio.sleep(65)
    
    # Check database
    db = SessionLocal()
    ride = db.query(Ride).filter(Ride.id == db_ride_in_progress.id).first()
    
    assert ride.route_points is not None
    assert len(ride.route_points) >= 2
    
    # Verify structure
    point = ride.route_points[0]
    assert "lat" in point
    assert "lng" in point
    assert "timestamp" in point
    
    # Stop tracking
    await GPSTrackingService.stop_tracking(db_ride_in_progress.id)
    
    db.close()

@pytest.mark.asyncio
async def test_gps_tracking_stops_when_ride_completes(
    db_ride_in_progress
):
    """Test tracking stops automatically when ride completes"""
    await GPSTrackingService.start_tracking(db_ride_in_progress.id)
    
    # Verify tracking active
    assert db_ride_in_progress.id in GPSTrackingService.active_trackings
    
    # Complete the ride
    db = SessionLocal()
    ride = db.query(Ride).filter(Ride.id == db_ride_in_progress.id).first()
    ride.status = RideStatus.COMPLETED
    db.commit()
    db.close()
    
    # Wait for tracking to notice and stop (up to 35s)
    await asyncio.sleep(35)
    
    # Verify tracking stopped
    assert db_ride_in_progress.id not in GPSTrackingService.active_trackings

@pytest.mark.asyncio
async def test_gps_tracking_handles_missing_driver_location(
    db_ride_in_progress,
    db_driver_no_location
):
    """Test tracking handles missing driver location gracefully"""
    await GPSTrackingService.start_tracking(db_ride_in_progress.id)
    
    await asyncio.sleep(35)
    
    # Should not crash, just skip this iteration
    db = SessionLocal()
    ride = db.query(Ride).filter(Ride.id == db_ride_in_progress.id).first()
    
    # May have 0 or 1 points (depending on timing)
    assert ride.route_points is not None
    assert len(ride.route_points) <= 1
    
    await GPSTrackingService.stop_tracking(db_ride_in_progress.id)
    db.close()

@pytest.mark.asyncio
async def test_cleanup_orphaned_trackings(
    db_ride_in_progress,
    db_ride_completed
):
    """Test cleanup removes tracking for completed rides"""
    # Start tracking for both rides
    await GPSTrackingService.start_tracking(db_ride_in_progress.id)
    await GPSTrackingService.start_tracking(db_ride_completed.id)
    
    assert len(GPSTrackingService.active_trackings) == 2
    
    # Run cleanup
    await GPSTrackingService.cleanup_orphaned_trackings()
    
    # Should only have IN_PROGRESS ride
    assert db_ride_in_progress.id in GPSTrackingService.active_trackings
    assert db_ride_completed.id not in GPSTrackingService.active_trackings
    
    await GPSTrackingService.stop_tracking(db_ride_in_progress.id)
```

**Monitoring Metrics:**
```python
# backend/src/monitoring/metrics.py
from prometheus_client import Gauge

# GPS tracking metrics
gps_active_trackings = Gauge(
    'gps_active_trackings',
    'Number of active GPS tracking tasks'
)

gps_points_saved_total = Counter(
    'gps_points_saved_total',
    'Total GPS points saved'
)

# Update in tracking service
def save_gps_point():
    # ... save logic
    gps_points_saved_total.inc()

def update_metrics():
    gps_active_trackings.set(
        GPSTrackingService.get_active_trackings_count()
    )
```

**Critérios de Aceite:**
- [ ] Salva pontos GPS a cada 30s
- [ ] Para automaticamente ao completar
- [ ] Não duplica tracking (idempotente)
- [ ] Trata erro quando location missing
- [ ] Cleanup remove trackings órfãos
- [ ] Logging estruturado de eventos
- [ ] Testes passam (4 cenários)
- [ ] Métricas Prometheus disponíveis
- [ ] Performance: não bloqueia outras requests

**Performance:**
- Memory: < 1MB por tracking task
- CPU: < 0.1% por task
- Database: 1 write/30s por ride

**Dependências:**
- Task 3.1.2: Start Trip
- AsyncIO support em FastAPI

---

### [BACKEND] Task 3.1.4: Endpoint POST /rides/{id}/complete
**Responsável:** Backend Dev 1  
**Estimativa:** 8 SP  
**Prioridade:** P0  
**Duração:** 1.5 dias

**Descrição:**
Finaliza a corrida, calcula distância/duração reais e preço final.

**Flow:**
```
Driver arrives at destination → Complete ride → Calculate final values → Trigger payment
```

**Service: Distance Calculator:**
```python
# backend/src/services/distance_calculator.py
from typing import List, Dict
from src.services.geo import calculate_distance

class DistanceCalculator:
    """
    Calculate actual distance traveled from GPS points
    """
    
    @staticmethod
    def calculate_route_distance(route_points: List[Dict]) -> float:
        """
        Calculate total distance from GPS route
        
        Args:
            route_points: List of {"lat": float, "lng": float, "timestamp": str}
        
        Returns:
            Total distance in kilometers
        """
        if not route_points or len(route_points) < 2:
            return 0.0
        
        total_distance = 0.0
        
        for i in range(len(route_points) - 1):
            p1 = route_points[i]
            p2 = route_points[i + 1]
            
            distance = calculate_distance(
                p1["lat"], p1["lng"],
                p2["lat"], p2["lng"]
            )
            
            total_distance += distance
        
        return round(total_distance, 2)
    
    @staticmethod
    def filter_outlier_points(
        route_points: List[Dict],
        max_speed_kmh: float = 120.0
    ) -> List[Dict]:
        """
        Remove GPS points that are physically impossible
        
        Filters out points where implied speed > max_speed_kmh
        (e.g., GPS glitches that jump kilometers)
        
        Args:
            route_points: GPS points
            max_speed_kmh: Maximum realistic speed (default 120 km/h)
        
        Returns:
            Filtered list of points
        """
        if len(route_points) < 2:
            return route_points
        
        filtered = [route_points[0]]  # Always keep first point
        
        from datetime import datetime
        
        for i in range(1, len(route_points)):
            prev = filtered[-1]
            curr = route_points[i]
            
            # Calculate distance
            distance = calculate_distance(
                prev["lat"], prev["lng"],
                curr["lat"], curr["lng"]
            )
            
            # Calculate time difference
            try:
                prev_time = datetime.fromisoformat(prev["timestamp"])
                curr_time = datetime.fromisoformat(curr["timestamp"])
                time_diff_hours = (curr_time - prev_time).total_seconds() / 3600
                
                if time_diff_hours > 0:
                    speed = distance / time_diff_hours
                    
                    # Keep point if speed is realistic
                    if speed <= max_speed_kmh:
                        filtered.append(curr)
                    else:
                        logger.warning(
                            f"Filtered outlier GPS point: speed={speed:.1f} km/h"
                        )
                else:
                    filtered.append(curr)
            
            except Exception as e:
                # If error parsing timestamps, keep the point
                logger.warning(f"Error processing GPS point: {e}")
                filtered.append(curr)
        
        return filtered
```

**Endpoint:**
```python
# backend/src/api/v1/rides.py
from src.services.distance_calculator import DistanceCalculator
from src.services.pricing import PricingEngine
from src.services.gps_tracking import GPSTrackingService

@router.post("/{ride_id}/complete")
async def complete_ride(
    ride_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    """
    Complete a ride
    
    Transitions: IN_PROGRESS → COMPLETED
    
    Actions:
    1. Stop GPS tracking
    2. Calculate actual distance from GPS points
    3. Calculate actual duration
    4. Recalculate price (may differ from estimate)
    5. Transition status
    6. Notify passenger
    7. Trigger payment flow
    """
    
    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()
    
    if not driver:
        raise HTTPException(404, "Driver profile not found")
    
    # Lock ride
    ride = db.query(Ride).filter(
        Ride.id == ride_id,
        Ride.driver_id == driver.id
    ).with_for_update().first()
    
    if not ride:
        raise HTTPException(404, "Ride not found")
    
    # Validate status
    if ride.status != RideStatus.IN_PROGRESS:
        raise HTTPException(
            400,
            f"Cannot complete ride from status: {ride.status}"
        )
    
    # Stop GPS tracking
    await GPSTrackingService.stop_tracking(ride.id)
    
    # Calculate actual distance from GPS points
    actual_distance_km = 0.0
    
    if ride.route_points and len(ride.route_points) >= 2:
        # Filter outliers
        filtered_points = DistanceCalculator.filter_outlier_points(
            ride.route_points
        )
        
        # Calculate distance
        actual_distance_km = DistanceCalculator.calculate_route_distance(
            filtered_points
        )
        
        logger.info(
            f"Ride {ride.id}: calculated distance from "
            f"{len(filtered_points)} GPS points = {actual_distance_km}km"
        )
    else:
        # Fallback to estimated distance
        actual_distance_km = ride.estimated_distance_km
        logger.warning(
            f"Ride {ride.id}: insufficient GPS points, "
            f"using estimated distance"
        )
    
    # Apply minimum distance (can't be less than straight line)
    straight_line_distance = calculate_distance(
        ride.origin_lat, ride.origin_lng,
        ride.destination_lat, ride.destination_lng
    )
    
    actual_distance_km = max(actual_distance_km, straight_line_distance)
    
    # Calculate actual duration
    actual_duration_min = 0
    if ride.started_at:
        duration_seconds = (datetime.utcnow() - ride.started_at).total_seconds()
        actual_duration_min = int(duration_seconds / 60)
    else:
        actual_duration_min = ride.estimated_duration_min
    
    # Recalculate price
    pricing = PricingEngine.calculate_price(
        distance_km=actual_distance_km,
        duration_min=actual_duration_min,
        timestamp=ride.started_at or datetime.utcnow()
    )
    
    final_price = pricing["final_price"]
    
    # Apply maximum variation (±30% of estimate)
    max_price = ride.estimated_price * 1.3
    min_price = ride.estimated_price * 0.7
    
    if final_price > max_price:
        logger.warning(
            f"Ride {ride.id}: final price ({final_price}) > 30% of estimate, "
            f"capping at {max_price}"
        )
        final_price = max_price
    elif final_price < min_price:
        logger.warning(
            f"Ride {ride.id}: final price ({final_price}) < 70% of estimate, "
            f"flooring at {min_price}"
        )
        final_price = min_price
    
    # Update ride
    ride.actual_distance_km = actual_distance_km
    ride.actual_duration_min = actual_duration_min
    ride.final_price = final_price
    
    # Transition to COMPLETED
    ride = RideStateMachine.transition(ride, RideStatus.COMPLETED)
    ride.completed_at = datetime.utcnow()
    
    # Update driver status
    driver.online_status = DriverOnlineStatus.ONLINE
    
    db.commit()
    db.refresh(ride)
    
    # Notify passenger
    await websocket_manager.send_to_passenger(
        ride.passenger_id,
        {
            "type": "trip_completed",
            "ride_id": ride.id,
            "final_price": final_price,
            "actual_distance_km": actual_distance_km,
            "actual_duration_min": actual_duration_min
        }
    )
    
    # Trigger payment flow (background)
    if ride.payment_method == PaymentMethod.PIX:
        background_tasks.add_task(
            trigger_pix_payment_flow,
            ride.id
        )
    
    # Log event
    logger.info(
        f"Ride completed: id={ride.id}, driver={driver.id}, "
        f"distance={actual_distance_km}km, duration={actual_duration_min}min, "
        f"price=R${final_price}"
    )
    
    return {
        "status": "completed",
        "ride_id": ride.id,
        "final_price": final_price,
        "actual_distance_km": actual_distance_km,
        "actual_duration_min": actual_duration_min,
        "completed_at": ride.completed_at.isoformat()
    }


async def trigger_pix_payment_flow(ride_id: int):
    """Trigger Pix payment generation (Sprint 4)"""
    # To be implemented in Sprint 4
    logger.info(f"Payment flow triggered for ride {ride_id}")
    pass
```

**Tests:**
```python
# backend/tests/test_ride_complete.py

@pytest.mark.asyncio
async def test_complete_ride_with_gps_points(
    async_client: AsyncClient,
    db_ride_in_progress_with_gps,
    driver_token
):
    """Test completing ride with GPS points"""
    response = await async_client.post(
        f"/api/v1/rides/{db_ride_in_progress_with_gps.id}/complete",
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["status"] == "completed"
    assert data["actual_distance_km"] > 0
    assert data["actual_duration_min"] > 0
    assert data["final_price"] > 0
    
    # Verify database
    db = SessionLocal()
    ride = db.query(Ride).filter(
        Ride.id == db_ride_in_progress_with_gps.id
    ).first()
    
    assert ride.status == RideStatus.COMPLETED
    assert ride.completed_at is not None
    assert ride.actual_distance_km > 0
    assert ride.final_price > 0
    
    db.close()

@pytest.mark.asyncio
async def test_complete_ride_without_gps_uses_estimate(
    async_client: AsyncClient,
    db_ride_in_progress_no_gps,
    driver_token
):
    """Test completing ride without GPS points uses estimate"""
    response = await async_client.post(
        f"/api/v1/rides/{db_ride_in_progress_no_gps.id}/complete",
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Should use estimated distance
    assert data["actual_distance_km"] == db_ride_in_progress_no_gps.estimated_distance_km

@pytest.mark.asyncio
async def test_complete_ride_caps_price_variation(
    async_client: AsyncClient,
    db_ride_very_long,  # Would result in 2x estimate
    driver_token
):
    """Test that price variation is capped at ±30%"""
    estimated_price = db_ride_very_long.estimated_price
    
    response = await async_client.post(
        f"/api/v1/rides/{db_ride_very_long.id}/complete",
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    final_price = data["final_price"]
    max_allowed = estimated_price * 1.3
    
    assert final_price <= max_allowed

@pytest.mark.asyncio
async def test_complete_ride_stops_gps_tracking(
    async_client: AsyncClient,
    db_ride_in_progress,
    driver_token,
    mock_gps_tracking
):
    """Verify GPS tracking is stopped"""
    # Start tracking
    await GPSTrackingService.start_tracking(db_ride_in_progress.id)
    
    response = await async_client.post(
        f"/api/v1/rides/{db_ride_in_progress.id}/complete",
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 200
    
    # Verify tracking stopped
    assert db_ride_in_progress.id not in GPSTrackingService.active_trackings
```

**Critérios de Aceite:**
- [ ] Para GPS tracking
- [ ] Calcula distância real de GPS points
- [ ] Filtra pontos GPS outliers (>120km/h)
- [ ] Fallback para distância estimada se GPS insuficiente
- [ ] Calcula duração real
- [ ] Recalcula preço com valores reais
- [ ] Limita variação de preço (±30%)
- [ ] Aplica distância mínima (straight line)
- [ ] Motorista volta a ONLINE
- [ ] Notifica passageiro
- [ ] Testes passam (4 cenários)
- [ ] Log estruturado

**Performance:**
- GPS distance calc: < 500ms for 100 points
- Total response: p95 < 1s

**Dependências:**
- Task 3.1.2: Start Trip
- Task 3.1.3: GPS Tracking
- Pricing Engine (Sprint 2)

---

## EPIC 3.2: CANCELLATION (10 SP)

---

### [BACKEND] Task 3.2.1: Endpoint POST /rides/{id}/cancel
**Responsável:** Backend Dev 2  
**Estimativa:** 8 SP  
**Prioridade:** P0  
**Duração:** 1.5 dias

**Descrição:**
Permitir cancelamento de corrida por passageiro ou motorista com regras de negócio e taxas.

**Regras de Negócio:**
- Passageiro pode cancelar a qualquer momento
- Se cancelar após 5min de aceite: taxa R$ 5,00
- Motorista pode cancelar a qualquer momento (sem taxa)
- Cancelamento impacta métricas (taxa de cancelamento)
- Não pode cancelar se status = COMPLETED ou PAID

**Schema:**
```python
# backend/src/schemas/ride.py (adicionar)
from pydantic import BaseModel, field_validator
from typing import Optional

class CancellationRequest(BaseModel):
    reason: str
    details: Optional[str] = None
    
    @field_validator('reason')
    @classmethod
    def validate_reason(cls, v):
        VALID_REASONS = [
            # Passenger reasons
            "changed_my_mind",
            "driver_taking_too_long",
            "wrong_pickup_location",
            "found_alternative",
            
            # Driver reasons
            "passenger_not_found",
            "passenger_behavior",
            "vehicle_issue",
            "safety_concern",
            
            # Common
            "other"
        ]
        
        if v not in VALID_REASONS:
            raise ValueError(
                f"Invalid reason. Must be one of: {', '.join(VALID_REASONS)}"
            )
        
        return v
    
    @field_validator('details')
    @classmethod
    def validate_details(cls, v):
        if v and len(v) > 500:
            raise ValueError("Details must be max 500 characters")
        return v

class CancellationResponse(BaseModel):
    status: str
    cancelled_by: str  # "driver" or "passenger"
    cancellation_fee: float
    reason: str
    
    class Config:
        from_attributes = True
```

**Endpoint:**
```python
# backend/src/api/v1/rides.py
from src.services.cancellation import CancellationService

@router.post("/{ride_id}/cancel", response_model=CancellationResponse)
async def cancel_ride(
    ride_id: int,
    cancellation: CancellationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Cancel a ride
    
    Rules:
    - Passenger: can cancel anytime, charged R$5 if >5min after acceptance
    - Driver: can cancel anytime (no fee)
    - Updates cancellation metrics
    - Notifies the other party
    - Cannot cancel COMPLETED or PAID rides
    """
    
    # Get ride
    ride = db.query(Ride).filter(Ride.id == ride_id).with_for_update().first()
    
    if not ride:
        raise HTTPException(404, "Ride not found")
    
    # Check if cancellable
    if ride.status in [RideStatus.COMPLETED, RideStatus.CANCELLED, RideStatus.PAID]:
        raise HTTPException(
            400,
            f"Cannot cancel ride with status: {ride.status}"
        )
    
    # Determine who is cancelling
    is_driver = db.query(Driver).filter(
        Driver.user_id == current_user.id,
        Driver.id == ride.driver_id
    ).first() is not None
    
    is_passenger = db.query(Passenger).filter(
        Passenger.user_id == current_user.id,
        Passenger.id == ride.passenger_id
    ).first() is not None
    
    if not is_driver and not is_passenger:
        raise HTTPException(403, "Not authorized to cancel this ride")
    
    # Stop GPS tracking if in progress
    if ride.status == RideStatus.IN_PROGRESS:
        from src.services.gps_tracking import GPSTrackingService
        await GPSTrackingService.stop_tracking(ride.id)
    
    # Calculate cancellation fee
    cancellation_fee = CancellationService.calculate_cancellation_fee(
        ride=ride,
        cancelled_by="driver" if is_driver else "passenger"
    )
    
    # Cancel the ride
    ride = RideStateMachine.transition(ride, RideStatus.CANCELLED)
    ride.cancelled_at = datetime.utcnow()
    ride.cancelled_by = "driver" if is_driver else "passenger"
    ride.cancellation_reason = cancellation.reason
    
    # Store details if provided
    if cancellation.details:
        # Could store in separate table or JSON field
        pass
    
    # Update driver status if applicable
    if ride.driver:
        ride.driver.online_status = DriverOnlineStatus.ONLINE
    
    db.commit()
    db.refresh(ride)
    
    # Notify the other party
    notification = {
        "type": "ride_cancelled",
        "ride_id": ride.id,
        "cancelled_by": ride.cancelled_by,
        "reason": ride.cancellation_reason,
        "cancellation_fee": cancellation_fee
    }
    
    if is_driver:
        await websocket_manager.send_to_passenger(
            ride.passenger_id,
            notification
        )
    else:
        if ride.driver:
            await websocket_manager.send_to_driver(
                ride.driver.id,
                notification
            )
    
    # Create financial event if fee applies
    if cancellation_fee > 0:
        from src.models.financial_event import FinancialEvent, EventType
        
        fee_event = FinancialEvent(
            event_type=EventType.CANCELLATION_FEE,
            ride_id=ride.id,
            passenger_id=ride.passenger_id,
            amount=cancellation_fee,
            description=f"Cancellation fee: {cancellation.reason}"
        )
        
        db.add(fee_event)
        db.commit()
    
    # Log event
    logger.info(
        f"Ride cancelled: id={ride.id}, by={ride.cancelled_by}, "
        f"reason={ride.cancellation_reason}, fee=R${cancellation_fee}"
    )
    
    # Update metrics (background)
    from src.services.metrics import MetricsService
    if is_driver:
        MetricsService.increment_driver_cancellation(driver_id=ride.driver.id)
    
    return CancellationResponse(
        status="cancelled",
        cancelled_by=ride.cancelled_by,
        cancellation_fee=cancellation_fee,
        reason=ride.cancellation_reason
    )
```

**Service: Cancellation Logic:**
```python
# backend/src/services/cancellation.py
from datetime import datetime, timedelta
from src.models.ride import Ride, RideStatus

class CancellationService:
    """
    Business logic for ride cancellations
    """
    
    # Fee configuration
    PASSENGER_CANCELLATION_FEE = 5.00  # R$ 5.00
    GRACE_PERIOD_MINUTES = 5
    
    @classmethod
    def calculate_cancellation_fee(
        cls,
        ride: Ride,
        cancelled_by: str
    ) -> float:
        """
        Calculate cancellation fee
        
        Rules:
        - Driver: no fee
        - Passenger before acceptance: no fee
        - Passenger within 5min of acceptance: no fee
        - Passenger after 5min: R$ 5.00
        
        Args:
            ride: The ride being cancelled
            cancelled_by: "driver" or "passenger"
        
        Returns:
            Cancellation fee amount
        """
        
        # Driver never pays
        if cancelled_by == "driver":
            return 0.0
        
        # Passenger: depends on status and time
        if cancelled_by == "passenger":
            
            # Before acceptance: no fee
            if ride.status == RideStatus.SEARCHING:
                return 0.0
            
            # After acceptance: check grace period
            if ride.status in [
                RideStatus.ACCEPTED,
                RideStatus.DRIVER_ARRIVING,
                RideStatus.IN_PROGRESS
            ]:
                
                if not ride.accepted_at:
                    return 0.0
                
                # Calculate time since acceptance
                time_since_accept = datetime.utcnow() - ride.accepted_at
                
                # Within grace period: no fee
                if time_since_accept.total_seconds() < (cls.GRACE_PERIOD_MINUTES * 60):
                    return 0.0
                
                # After grace period: charge fee
                return cls.PASSENGER_CANCELLATION_FEE
        
        return 0.0
    
    @classmethod
    def get_cancellation_reasons_for_user_type(
        cls,
        user_type: str
    ) -> list[dict]:
        """
        Get appropriate cancellation reasons for user type
        
        Returns:
            List of {code, label} dictionaries
        """
        
        if user_type == "driver":
            return [
                {"code": "passenger_not_found", "label": "Passageiro não encontrado"},
                {"code": "passenger_behavior", "label": "Comportamento inadequado"},
                {"code": "vehicle_issue", "label": "Problema com o veículo"},
                {"code": "safety_concern", "label": "Preocupação com segurança"},
                {"code": "other", "label": "Outro motivo"}
            ]
        
        elif user_type == "passenger":
            return [
                {"code": "changed_my_mind", "label": "Mudei de ideia"},
                {"code": "driver_taking_too_long", "label": "Motorista demorando muito"},
                {"code": "wrong_pickup_location", "label": "Local de embarque errado"},
                {"code": "found_alternative", "label": "Encontrei alternativa"},
                {"code": "other", "label": "Outro motivo"}
            ]
        
        return []
```

**Tests:**
```python
# backend/tests/test_ride_cancellation.py
import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta

@pytest.mark.asyncio
async def test_passenger_cancel_before_grace_period_no_fee(
    async_client: AsyncClient,
    db_ride_just_accepted,  # Accepted 2 minutes ago
    passenger_token
):
    """Passenger can cancel within 5min without fee"""
    response = await async_client.post(
        f"/api/v1/rides/{db_ride_just_accepted.id}/cancel",
        json={
            "reason": "changed_my_mind",
            "details": "Found another ride"
        },
        headers={"Authorization": f"Bearer {passenger_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["status"] == "cancelled"
    assert data["cancelled_by"] == "passenger"
    assert data["cancellation_fee"] == 0.0

@pytest.mark.asyncio
async def test_passenger_cancel_after_grace_period_charged(
    async_client: AsyncClient,
    db_ride_accepted_6min_ago,
    passenger_token
):
    """Passenger charged R$5 if cancels after 5min"""
    response = await async_client.post(
        f"/api/v1/rides/{db_ride_accepted_6min_ago.id}/cancel",
        json={"reason": "changed_my_mind"},
        headers={"Authorization": f"Bearer {passenger_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["cancellation_fee"] == 5.00
    
    # Verify financial event created
    db = SessionLocal()
    fee_event = db.query(FinancialEvent).filter(
        FinancialEvent.ride_id == db_ride_accepted_6min_ago.id,
        FinancialEvent.event_type == EventType.CANCELLATION_FEE
    ).first()
    
    assert fee_event is not None
    assert fee_event.amount == 5.00
    db.close()

@pytest.mark.asyncio
async def test_driver_cancel_no_fee(
    async_client: AsyncClient,
    db_ride_accepted_6min_ago,
    driver_token
):
    """Driver never pays cancellation fee"""
    response = await async_client.post(
        f"/api/v1/rides/{db_ride_accepted_6min_ago.id}/cancel",
        json={"reason": "passenger_not_found"},
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["cancelled_by"] == "driver"
    assert data["cancellation_fee"] == 0.0

@pytest.mark.asyncio
async def test_cancel_stops_gps_tracking(
    async_client: AsyncClient,
    db_ride_in_progress,
    driver_token
):
    """Cancelling IN_PROGRESS ride stops GPS tracking"""
    from src.services.gps_tracking import GPSTrackingService
    
    # Start tracking
    await GPSTrackingService.start_tracking(db_ride_in_progress.id)
    assert db_ride_in_progress.id in GPSTrackingService.active_trackings
    
    # Cancel
    response = await async_client.post(
        f"/api/v1/rides/{db_ride_in_progress.id}/cancel",
        json={"reason": "vehicle_issue"},
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 200
    
    # Verify tracking stopped
    assert db_ride_in_progress.id not in GPSTrackingService.active_trackings

@pytest.mark.asyncio
async def test_cannot_cancel_completed_ride(
    async_client: AsyncClient,
    db_ride_completed,
    passenger_token
):
    """Cannot cancel completed ride"""
    response = await async_client.post(
        f"/api/v1/rides/{db_ride_completed.id}/cancel",
        json={"reason": "changed_my_mind"},
        headers={"Authorization": f"Bearer {passenger_token}"}
    )
    
    assert response.status_code == 400
    assert "cannot cancel" in response.text.lower()

@pytest.mark.asyncio
async def test_cancel_updates_driver_status(
    async_client: AsyncClient,
    db_ride_in_progress,
    driver_token
):
    """Driver returns to ONLINE after cancelling"""
    # Verify driver is IN_RIDE
    db = SessionLocal()
    driver = db.query(Driver).filter(
        Driver.id == db_ride_in_progress.driver_id
    ).first()
    driver.online_status = DriverOnlineStatus.IN_RIDE
    db.commit()
    db.close()
    
    # Cancel ride
    response = await async_client.post(
        f"/api/v1/rides/{db_ride_in_progress.id}/cancel",
        json={"reason": "vehicle_issue"},
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 200
    
    # Verify driver back to ONLINE
    db = SessionLocal()
    driver = db.query(Driver).filter(
        Driver.id == db_ride_in_progress.driver_id
    ).first()
    assert driver.online_status == DriverOnlineStatus.ONLINE
    db.close()

@pytest.mark.asyncio
async def test_invalid_cancellation_reason_rejected(
    async_client: AsyncClient,
    db_ride_accepted,
    passenger_token
):
    """Invalid reason is rejected"""
    response = await async_client.post(
        f"/api/v1/rides/{db_ride_accepted.id}/cancel",
        json={"reason": "invalid_reason_123"},
        headers={"Authorization": f"Bearer {passenger_token}"}
    )
    
    assert response.status_code == 422  # Validation error
```

**Fixtures:**
```python
# backend/tests/conftest.py (adicionar)

@pytest.fixture
def db_ride_just_accepted(db, db_driver, db_passenger):
    """Ride accepted 2 minutes ago"""
    ride = Ride(
        passenger_id=db_passenger.id,
        driver_id=db_driver.id,
        origin_lat=-23.5505,
        origin_lng=-46.6333,
        destination_lat=-23.5600,
        destination_lng=-46.6400,
        estimated_distance_km=2.0,
        estimated_price=15.00,
        payment_method=PaymentMethod.PIX,
        status=RideStatus.ACCEPTED,
        accepted_at=datetime.utcnow() - timedelta(minutes=2)
    )
    db.add(ride)
    db.commit()
    db.refresh(ride)
    return ride

@pytest.fixture
def db_ride_accepted_6min_ago(db, db_driver, db_passenger):
    """Ride accepted 6 minutes ago (past grace period)"""
    ride = Ride(
        passenger_id=db_passenger.id,
        driver_id=db_driver.id,
        origin_lat=-23.5505,
        origin_lng=-46.6333,
        destination_lat=-23.5600,
        destination_lng=-46.6400,
        estimated_distance_km=2.0,
        estimated_price=15.00,
        payment_method=PaymentMethod.PIX,
        status=RideStatus.ACCEPTED,
        accepted_at=datetime.utcnow() - timedelta(minutes=6)
    )
    db.add(ride)
    db.commit()
    db.refresh(ride)
    return ride
```

**Critérios de Aceite:**
- [ ] Passageiro pode cancelar com/sem taxa
- [ ] Motorista pode cancelar sem taxa
- [ ] Taxa R$ 5 aplicada após 5min
- [ ] Valida motivos de cancelamento
- [ ] Para GPS tracking se IN_PROGRESS
- [ ] Motorista volta a ONLINE
- [ ] Notifica outra parte via WebSocket
- [ ] Cria evento financeiro (se taxa)
- [ ] Impede cancelamento de rides finalizadas
- [ ] Testes passam (8 cenários)
- [ ] Log estruturado

**Performance:**
- Response time: p95 < 500ms

**Dependências:**
- Sprint 2: Accept Ride
- Task 3.1.3: GPS Tracking
- Financial Events Model (Sprint 4)

---

### [BACKEND] Task 3.2.2: Cancellation Metrics Service
**Responsável:** Backend Dev 2  
**Estimativa:** 2 SP  
**Prioridade:** P1  
**Duração:** 4 horas

**Descrição:**
Serviço para calcular e rastrear taxa de cancelamento de motoristas (KPI importante).

**Service:**
```python
# backend/src/services/metrics.py
from sqlalchemy import func
from datetime import datetime, timedelta
from src.models.ride import Ride, RideStatus

class MetricsService:
    """
    Calculate performance metrics for drivers
    """
    
    @staticmethod
    def calculate_cancellation_rate(
        driver_id: int,
        days: int = 30,
        db: Session = None
    ) -> dict:
        """
        Calculate driver's cancellation rate
        
        Formula: cancelled_by_driver / (completed + cancelled_by_driver)
        
        Args:
            driver_id: Driver ID
            days: Period in days (default 30)
            db: Database session
        
        Returns:
            {
                "total_rides": int,
                "cancelled_by_driver": int,
                "cancel_rate": float,  # 0.0 to 1.0
                "period_days": int
            }
        """
        since = datetime.utcnow() - timedelta(days=days)
        
        # Total relevant rides (completed + cancelled)
        total = db.query(func.count(Ride.id)).filter(
            Ride.driver_id == driver_id,
            Ride.created_at >= since,
            Ride.status.in_([
                RideStatus.COMPLETED,
                RideStatus.CANCELLED,
                RideStatus.PAID
            ])
        ).scalar() or 0
        
        # Cancelled by this driver
        cancelled = db.query(func.count(Ride.id)).filter(
            Ride.driver_id == driver_id,
            Ride.created_at >= since,
            Ride.status == RideStatus.CANCELLED,
            Ride.cancelled_by == "driver"
        ).scalar() or 0
        
        # Calculate rate
        cancel_rate = (cancelled / total) if total > 0 else 0.0
        
        return {
            "total_rides": total,
            "cancelled_by_driver": cancelled,
            "cancel_rate": round(cancel_rate, 3),
            "period_days": days
        }
    
    @staticmethod
    def increment_driver_cancellation(driver_id: int):
        """
        Increment cancellation counter (for real-time tracking)
        
        Can be used to update Redis counter immediately
        """
        from src.core.redis import redis_client
        
        # Increment Redis counter
        key = f"driver:{driver_id}:cancellations:current_month"
        redis_client.incr(key)
        
        # Set expiry (end of month + 7 days)
        import calendar
        now = datetime.utcnow()
        last_day = calendar.monthrange(now.year, now.month)[1]
        days_until_end = last_day - now.day + 7
        
        redis_client.expire(key, days_until_end * 86400)
    
    @staticmethod
    def get_driver_metrics_summary(
        driver_id: int,
        db: Session
    ) -> dict:
        """
        Get comprehensive metrics summary for a driver
        
        Returns:
            {
                "total_rides": int,
                "completion_rate": float,
                "cancel_rate": float,
                "average_rating": float,
                "total_earnings": float
            }
        """
        from sqlalchemy import func
        
        # Get basic counts
        total_rides = db.query(func.count(Ride.id)).filter(
            Ride.driver_id == driver_id,
            Ride.status.in_([
                RideStatus.COMPLETED,
                RideStatus.PAID,
                RideStatus.CANCELLED
            ])
        ).scalar() or 0
        
        completed_rides = db.query(func.count(Ride.id)).filter(
            Ride.driver_id == driver_id,
            Ride.status.in_([RideStatus.COMPLETED, RideStatus.PAID])
        ).scalar() or 0
        
        # Get cancellation stats
        cancel_stats = MetricsService.calculate_cancellation_rate(
            driver_id, days=30, db=db
        )
        
        # Get driver info
        driver = db.query(Driver).filter(Driver.id == driver_id).first()
        
        # Calculate completion rate
        completion_rate = (completed_rides / total_rides) if total_rides > 0 else 0.0
        
        return {
            "total_rides": total_rides,
            "completed_rides": completed_rides,
            "completion_rate": round(completion_rate, 3),
            "cancel_rate": cancel_stats["cancel_rate"],
            "average_rating": driver.rating_avg if driver else 0.0,
            "rating_count": driver.rating_count if driver else 0
        }
```

**Endpoint:**
```python
# backend/src/api/v1/drivers.py
from src.services.metrics import MetricsService

@router.get("/me/metrics")
async def get_my_metrics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get performance metrics for current driver
    
    Returns comprehensive stats including:
    - Cancellation rate
    - Completion rate
    - Average rating
    """
    
    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()
    
    if not driver:
        raise HTTPException(404, "Driver profile not found")
    
    metrics = MetricsService.get_driver_metrics_summary(
        driver_id=driver.id,
        db=db
    )
    
    return metrics
```

**Tests:**
```python
# backend/tests/test_metrics.py

def test_calculate_cancellation_rate_no_rides(db, db_driver):
    """Zero cancel rate when no rides"""
    result = MetricsService.calculate_cancellation_rate(
        driver_id=db_driver.id,
        days=30,
        db=db
    )
    
    assert result["total_rides"] == 0
    assert result["cancelled_by_driver"] == 0
    assert result["cancel_rate"] == 0.0

def test_calculate_cancellation_rate_with_cancellations(
    db,
    db_driver_with_10_rides_2_cancelled
):
    """Correctly calculates cancel rate"""
    # Driver has: 8 completed + 2 cancelled = 10 total
    # Cancel rate = 2/10 = 0.2
    
    result = MetricsService.calculate_cancellation_rate(
        driver_id=db_driver_with_10_rides_2_cancelled.id,
        days=30,
        db=db
    )
    
    assert result["total_rides"] == 10
    assert result["cancelled_by_driver"] == 2
    assert result["cancel_rate"] == 0.2

def test_calculate_cancellation_rate_ignores_passenger_cancellations(
    db,
    db_driver_with_passenger_cancellations
):
    """Only counts driver cancellations"""
    # Driver has: 8 completed + 2 cancelled by driver + 3 cancelled by passenger
    # Cancel rate = 2/10 = 0.2 (ignores passenger cancellations)
    
    result = MetricsService.calculate_cancellation_rate(
        driver_id=db_driver_with_passenger_cancellations.id,
        days=30,
        db=db
    )
    
    assert result["cancelled_by_driver"] == 2
    assert result["cancel_rate"] == 0.2

def test_get_driver_metrics_summary(db, db_driver_with_history):
    """Get comprehensive metrics"""
    metrics = MetricsService.get_driver_metrics_summary(
        driver_id=db_driver_with_history.id,
        db=db
    )
    
    assert "total_rides" in metrics
    assert "completion_rate" in metrics
    assert "cancel_rate" in metrics
    assert "average_rating" in metrics
    
    # Completion rate should be high
    assert metrics["completion_rate"] > 0.8
```

**Critérios de Aceite:**
- [ ] Calcula taxa de cancelamento corretamente
- [ ] Ignora cancelamentos do passageiro
- [ ] Considera período configurável (padrão 30 dias)
- [ ] Endpoint GET /drivers/me/metrics funciona
- [ ] Redis counter incrementa em tempo real
- [ ] Testes passam (4 cenários)
- [ ] Performance: < 200ms

**Dependências:**
- Task 3.2.1: Cancel Endpoint
- Redis configurado

---

## EPIC 3.3: RATING SYSTEM (12 SP)

---

### [BACKEND] Task 3.3.1: Rating Model
**Responsável:** Backend Dev 1  
**Estimativa:** 3 SP  
**Prioridade:** P0  
**Duração:** 6 horas

**Descrição:**
Model para armazenar avaliações mútuas (passageiro → motorista e motorista → passageiro).

**Model:**
```python
# backend/src/models/rating.py
from sqlalchemy import Column, Integer, Float, String, ForeignKey, Enum, CheckConstraint
from sqlalchemy.orm import relationship
from src.models.base import TimestampMixin
from src.core.database import Base
import enum

class RatingType(str, enum.Enum):
    DRIVER = "driver"      # Passenger rating driver
    PASSENGER = "passenger"  # Driver rating passenger

class Rating(Base, TimestampMixin):
    __tablename__ = "ratings"
    
    id = Column(Integer, primary_key=True, index=True)
    ride_id = Column(
        Integer,
        ForeignKey("rides.id"),
        nullable=False,
        unique=True,  # One rating per ride
        index=True
    )
    
    # Type of rating
    type = Column(Enum(RatingType), nullable=False)
    
    # Who is being rated (exactly one must be set)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=True, index=True)
    passenger_id = Column(Integer, ForeignKey("passengers.id"), nullable=True, index=True)
    
    # Rating details
    stars = Column(Float, nullable=False)  # 1.0 to 5.0
    comment = Column(String(500), nullable=True)
    
    # Tags (optional, for categorization)
    tags = Column(JSON, nullable=True)  # ["clean_car", "polite", "safe_driving"]
    
    # Relationships
    ride = relationship("Ride", back_populates="rating")
    driver = relationship("Driver", foreign_keys=[driver_id])
    passenger = relationship("Passenger", foreign_keys=[passenger_id])
    
    __table_args__ = (
        # Ensure exactly one target is set
        CheckConstraint(
            '(driver_id IS NOT NULL AND passenger_id IS NULL) OR '
            '(driver_id IS NULL AND passenger_id IS NOT NULL)',
            name='check_rating_target'
        ),
        # Ensure stars are in valid range
        CheckConstraint(
            'stars >= 1.0 AND stars <= 5.0',
            name='check_stars_range'
        ),
    )
```

**Update Ride Model:**
```python
# backend/src/models/ride.py (adicionar)
from sqlalchemy.orm import relationship

class Ride(Base, TimestampMixin):
    # ... existing fields
    
    # NEW: Relationship to rating
    rating = relationship(
        "Rating",
        back_populates="ride",
        uselist=False  # One rating per ride
    )
```

**Migration:**
```python
# backend/alembic/versions/003_add_ratings.py
"""Add ratings table

Revision ID: 003
Revises: 002
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSON

revision = '003'
down_revision = '002'

def upgrade():
    # Create ratings table
    op.create_table(
        'ratings',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('ride_id', sa.Integer(), sa.ForeignKey('rides.id'), nullable=False),
        sa.Column('type', sa.Enum('driver', 'passenger', name='ratingtype'), nullable=False),
        sa.Column('driver_id', sa.Integer(), sa.ForeignKey('drivers.id'), nullable=True),
        sa.Column('passenger_id', sa.Integer(), sa.ForeignKey('passengers.id'), nullable=True),
        sa.Column('stars', sa.Float(), nullable=False),
        sa.Column('comment', sa.String(500), nullable=True),
        sa.Column('tags', JSON, nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        
        # Constraints
        sa.CheckConstraint(
            '(driver_id IS NOT NULL AND passenger_id IS NULL) OR '
            '(driver_id IS NULL AND passenger_id IS NOT NULL)',
            name='check_rating_target'
        ),
        sa.CheckConstraint(
            'stars >= 1.0 AND stars <= 5.0',
            name='check_stars_range'
        ),
        sa.UniqueConstraint('ride_id', name='uq_rating_ride_id')
    )
    
    # Create indexes
    op.create_index('ix_ratings_driver_id', 'ratings', ['driver_id'])
    op.create_index('ix_ratings_passenger_id', 'ratings', ['passenger_id'])
    op.create_index('ix_ratings_ride_id', 'ratings', ['ride_id'])

def downgrade():
    op.drop_index('ix_ratings_ride_id')
    op.drop_index('ix_ratings_passenger_id')
    op.drop_index('ix_ratings_driver_id')
    op.drop_table('ratings')
    op.execute('DROP TYPE ratingtype')
```

**Apply Migration:**
```bash
alembic upgrade head
```

**Tests:**
```python
# backend/tests/test_rating_model.py

def test_create_driver_rating(db, db_ride_completed):
    """Can create rating for driver"""
    rating = Rating(
        ride_id=db_ride_completed.id,
        type=RatingType.DRIVER,
        driver_id=db_ride_completed.driver_id,
        stars=4.5,
        comment="Great driver!",
        tags=["polite", "clean_car"]
    )
    
    db.add(rating)
    db.commit()
    db.refresh(rating)
    
    assert rating.id is not None
    assert rating.type == RatingType.DRIVER
    assert rating.stars == 4.5

def test_rating_constraint_exactly_one_target(db, db_ride_completed):
    """Cannot set both driver_id and passenger_id"""
    from sqlalchemy.exc import IntegrityError
    
    rating = Rating(
        ride_id=db_ride_completed.id,
        type=RatingType.DRIVER,
        driver_id=db_ride_completed.driver_id,
        passenger_id=db_ride_completed.passenger_id,  # BOTH set - invalid
        stars=5.0
    )
    
    db.add(rating)
    
    with pytest.raises(IntegrityError):
        db.commit()

def test_rating_stars_range_constraint(db, db_ride_completed):
    """Stars must be between 1.0 and 5.0"""
    from sqlalchemy.exc import IntegrityError
    
    rating = Rating(
        ride_id=db_ride_completed.id,
        type=RatingType.DRIVER,
        driver_id=db_ride_completed.driver_id,
        stars=6.0  # Invalid - too high
    )
    
    db.add(rating)
    
    with pytest.raises(IntegrityError):
        db.commit()

def test_one_rating_per_ride(db, db_ride_completed):
    """Cannot create duplicate rating for same ride"""
    from sqlalchemy.exc import IntegrityError
    
    # Create first rating
    rating1 = Rating(
        ride_id=db_ride_completed.id,
        type=RatingType.DRIVER,
        driver_id=db_ride_completed.driver_id,
        stars=5.0
    )
    db.add(rating1)
    db.commit()
    
    # Try to create second rating for same ride
    rating2 = Rating(
        ride_id=db_ride_completed.id,
        type=RatingType.PASSENGER,
        passenger_id=db_ride_completed.passenger_id,
        stars=4.0
    )
    db.add(rating2)
    
    with pytest.raises(IntegrityError):
        db.commit()
```

**Critérios de Aceite:**
- [ ] Model criado com todos os campos
- [ ] Constraint valida target único
- [ ] Constraint valida range de stars (1-5)
- [ ] Unique constraint em ride_id
- [ ] Índices criados
- [ ] Migration aplicada
- [ ] Relationship com Ride funciona
- [ ] Testes passam (4 cenários)

**Dependências:**
- Sprint 3: Complete Ride
- Alembic configurado

---

### [BACKEND] Task 3.3.2: Endpoint POST /rides/{id}/rate
**Responsável:** Backend Dev 1  
**Estimativa:** 5 SP  
**Prioridade:** P0  
**Duração:** 1 dia

**Descrição:**
Endpoint para avaliar motorista (passageiro) ou passageiro (motorista) após corrida completada.

**Schema:**
```python
# backend/src/schemas/rating.py
from pydantic import BaseModel, field_validator
from typing import Optional, List

class RatingCreate(BaseModel):
    stars: float
    comment: Optional[str] = None
    tags: Optional[List[str]] = None
    
    @field_validator('stars')
    @classmethod
    def validate_stars(cls, v):
        if not 1.0 <= v <= 5.0:
            raise ValueError('Stars must be between 1.0 and 5.0')
        
        # Allow only .0 and .5 increments
        if v % 0.5 != 0:
            raise ValueError('Stars must be in 0.5 increments (e.g., 4.0, 4.5)')
        
        return v
    
    @field_validator('comment')
    @classmethod
    def validate_comment(cls, v):
        if v is not None:
            v = v.strip()
            if len(v) > 500:
                raise ValueError('Comment must be max 500 characters')
            if len(v) < 3 and len(v) > 0:
                raise ValueError('Comment must be at least 3 characters')
        return v
    
    @field_validator('tags')
    @classmethod
    def validate_tags(cls, v):
        if v is not None:
            # Define valid tags
            VALID_TAGS = [
                # Positive
                "polite", "clean_car", "safe_driving", "on_time",
                "friendly", "helpful", "professional",
                
                # Negative (for internal tracking)
                "late", "rude", "unsafe", "dirty_car"
            ]
            
            for tag in v:
                if tag not in VALID_TAGS:
                    raise ValueError(f"Invalid tag: {tag}")
            
            # Max 5 tags
            if len(v) > 5:
                raise ValueError("Maximum 5 tags allowed")
        
        return v

class RatingResponse(BaseModel):
    id: int
    ride_id: int
    stars: float
    comment: Optional[str]
    tags: Optional[List[str]]
    created_at: datetime
    
    class Config:
        from_attributes = True
```

**Service: Update Average Rating:**
```python
# backend/src/services/rating.py
from sqlalchemy.orm import Session

class RatingService:
    """
    Business logic for ratings
    """
    
    @staticmethod
    def update_avg_rating(
        entity,  # Driver or Passenger
        new_rating: float,
        db: Session
    ):
        """
        Update average rating using incremental average formula
        
        Formula: new_avg = (old_avg * old_count + new_rating) / (old_count + 1)
        
        This avoids recalculating from all ratings every time
        """
        old_avg = entity.rating_avg or 5.0  # Default 5.0 for new drivers
        old_count = entity.rating_count or 0
        
        new_count = old_count + 1
        new_avg = (old_avg * old_count + new_rating) / new_count
        
        entity.rating_avg = round(new_avg, 2)
        entity.rating_count = new_count
        
        db.commit()
    
    @staticmethod
    def can_rate_ride(ride: Ride, user_id: int, db: Session) -> dict:
        """
        Check if user can rate this ride
        
        Returns:
            {
                "can_rate": bool,
                "reason": str,
                "rating_type": RatingType or None
            }
        """
        # Check if ride is completed
        if ride.status not in [RideStatus.COMPLETED, RideStatus.PAID]:
            return {
                "can_rate": False,
                "reason": "Ride must be completed",
                "rating_type": None
            }
        
        # Check if already rated
        existing = db.query(Rating).filter(Rating.ride_id == ride.id).first()
        if existing:
            return {
                "can_rate": False,
                "reason": "Ride already rated",
                "rating_type": None
            }
        
        # Determine if user is driver or passenger
        driver = db.query(Driver).filter(
            Driver.user_id == user_id,
            Driver.id == ride.driver_id
        ).first()
        
        if driver:
            return {
                "can_rate": True,
                "reason": None,
                "rating_type": RatingType.PASSENGER
            }
        
        passenger = db.query(Passenger).filter(
            Passenger.user_id == user_id,
            Passenger.id == ride.passenger_id
        ).first()
        
        if passenger:
            return {
                "can_rate": True,
                "reason": None,
                "rating_type": RatingType.DRIVER
            }
        
        return {
            "can_rate": False,
            "reason": "Not authorized",
            "rating_type": None
        }
```

**Endpoint:**
```python
# backend/src/api/v1/rides.py
from src.services.rating import RatingService

@router.post("/{ride_id}/rate", response_model=RatingResponse, status_code=201)
async def rate_ride(
    ride_id: int,
    rating_data: RatingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Rate a completed ride
    
    - Passenger rates driver
    - Driver rates passenger
    - Updates average rating using incremental formula
    - One rating per ride (prevents duplicates)
    """
    
    # Get ride
    ride = db.query(Ride).filter(Ride.id == ride_id).first()
    
    if not ride:
        raise HTTPException(404, "Ride not found")
    
    # Check if can rate
    can_rate_check = RatingService.can_rate_ride(
        ride=ride,
        user_id=current_user.id,
        db=db
    )
    
    if not can_rate_check["can_rate"]:
        raise HTTPException(400, can_rate_check["reason"])
    
    rating_type = can_rate_check["rating_type"]
    
    # Create rating
    if rating_type == RatingType.DRIVER:
        # Passenger rating driver
        rating = Rating(
            ride_id=ride.id,
            type=RatingType.DRIVER,
            driver_id=ride.driver_id,
            stars=rating_data.stars,
            comment=rating_data.comment,
            tags=rating_data.tags
        )
        
        # Update driver's average rating
        driver = ride.driver
        RatingService.update_avg_rating(driver, rating_data.stars, db)
        
    else:
        # Driver rating passenger
        rating = Rating(
            ride_id=ride.id,
            type=RatingType.PASSENGER,
            passenger_id=ride.passenger_id,
            stars=rating_data.stars,
            comment=rating_data.comment,
            tags=rating_data.tags
        )
        
        # Update passenger's average rating
        passenger = ride.passenger
        RatingService.update_avg_rating(passenger, rating_data.stars, db)
    
    db.add(rating)
    db.commit()
    db.refresh(rating)
    
    # Log event
    logger.info(
        f"Rating created: ride_id={ride.id}, type={rating_type}, "
        f"stars={rating_data.stars}"
    )
    
    return rating
```

**Tests:**
```python
# backend/tests/test_rating.py

@pytest.mark.asyncio
async def test_passenger_rate_driver(
    async_client: AsyncClient,
    db_ride_completed,
    passenger_token
):
    """Passenger can rate driver"""
    response = await async_client.post(
        f"/api/v1/rides/{db_ride_completed.id}/rate",
        json={
            "stars": 4.5,
            "comment": "Great driver, very professional",
            "tags": ["polite", "safe_driving"]
        },
        headers={"Authorization": f"Bearer {passenger_token}"}
    )
    
    assert response.status_code == 201
    data = response.json()
    
    assert data["stars"] == 4.5
    assert "Great driver" in data["comment"]
    assert "polite" in data["tags"]
    
    # Verify driver rating updated
    db = SessionLocal()
    driver = db.query(Driver).filter(
        Driver.id == db_ride_completed.driver_id
    ).first()
    
    assert driver.rating_count == 1
    assert driver.rating_avg == 4.5
    db.close()

@pytest.mark.asyncio
async def test_driver_rate_passenger(
    async_client: AsyncClient,
    db_ride_completed,
    driver_token
):
    """Driver can rate passenger"""
    response = await async_client.post(
        f"/api/v1/rides/{db_ride_completed.id}/rate",
        json={
            "stars": 5.0,
            "comment": "Polite and on time",
            "tags": ["polite", "on_time"]
        },
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 201

@pytest.mark.asyncio
async def test_cannot_rate_twice(
    async_client: AsyncClient,
    db_ride_already_rated,
    passenger_token
):
    """Cannot rate same ride twice"""
    response = await async_client.post(
        f"/api/v1/rides/{db_ride_already_rated.id}/rate",
        json={"stars": 5.0},
        headers={"Authorization": f"Bearer {passenger_token}"}
    )
    
    assert response.status_code == 400
    assert "already rated" in response.text.lower()

@pytest.mark.asyncio
async def test_cannot_rate_uncompleted_ride(
    async_client: AsyncClient,
    db_ride_in_progress,
    passenger_token
):
    """Cannot rate ride that's not completed"""
    response = await async_client.post(
        f"/api/v1/rides/{db_ride_in_progress.id}/rate",
        json={"stars": 5.0},
        headers={"Authorization": f"Bearer {passenger_token}"}
    )
    
    assert response.status_code == 400
    assert "must be completed" in response.text.lower()

@pytest.mark.asyncio
async def test_rating_updates_average_correctly(
    async_client: AsyncClient,
    db_driver_with_2_ratings,  # Already has: 4.0, 5.0 (avg 4.5)
    db_ride_completed,
    passenger_token
):
    """Average rating calculated correctly"""
    # Add 3rd rating: 3.0
    # New avg should be: (4.0 + 5.0 + 3.0) / 3 = 4.0
    
    await async_client.post(
        f"/api/v1/rides/{db_ride_completed.id}/rate",
        json={"stars": 3.0},
        headers={"Authorization": f"Bearer {passenger_token}"}
    )
    
    db = SessionLocal()
    driver = db.query(Driver).filter(
        Driver.id == db_driver_with_2_ratings.id
    ).first()
    
    assert driver.rating_count == 3
    assert driver.rating_avg == 4.0
    db.close()

@pytest.mark.asyncio
async def test_invalid_star_value_rejected(
    async_client: AsyncClient,
    db_ride_completed,
    passenger_token
):
    """Stars must be 1-5 in 0.5 increments"""
    response = await async_client.post(
        f"/api/v1/rides/{db_ride_completed.id}/rate",
        json={"stars": 4.3},  # Invalid - not .0 or .5
        headers={"Authorization": f"Bearer {passenger_token}"}
    )
    
    assert response.status_code == 422  # Validation error
```

**Critérios de Aceite:**
- [ ] Passageiro avalia motorista
- [ ] Motorista avalia passageiro
- [ ] Valida ride completada
- [ ] Impede duplicação
- [ ] Atualiza média corretamente (incremental)
- [ ] Valida estrelas (1-5, incrementos 0.5)
- [ ] Tags opcionais validadas
- [ ] Comentário max 500 chars
- [ ] Testes passam (6 cenários)
- [ ] Log estruturado

**Performance:**
- Response time: p95 < 300ms

**Dependências:**
- Task 3.3.1: Rating Model
- Task 3.1.4: Complete Ride

---

### [BACKEND] Task 3.3.3: Endpoint GET /drivers/{id}/ratings
**Responsável:** Backend Dev 2  
**Estimativa:** 4 SP  
**Prioridade:** P1  
**Duração:** 1 dia

**Descrição:**
Visualizar avaliações de um motorista com paginação e filtros.

**Schema:**
```python
# backend/src/schemas/rating.py (adicionar)
from pydantic import BaseModel
from typing import List

class RatingListItem(BaseModel):
    id: int
    stars: float
    comment: Optional[str]
    tags: Optional[List[str]]
    created_at: datetime
    ride_id: int
    
    class Config:
        from_attributes = True

class RatingListResponse(BaseModel):
    driver_id: int
    rating_avg: float
    rating_count: int
    ratings: List[RatingListItem]
    page: int
    page_size: int
    total_pages: int
```

**Endpoint:**
```python
# backend/src/api/v1/drivers.py
from math import ceil

@router.get("/{driver_id}/ratings", response_model=RatingListResponse)
async def get_driver_ratings(
    driver_id: int,
    page: int = 1,
    page_size: int = 20,
    min_stars: Optional[float] = None,
    db: Session = Depends(get_db)
):
    """
    Get ratings for a driver
    
    Query params:
    - page: Page number (default 1)
    - page_size: Items per page (default 20, max 50)
    - min_stars: Filter ratings >= this value
    
    Returns ratings ordered by most recent first
    """
    
    # Validate driver exists
    driver = db.query(Driver).filter(Driver.id == driver_id).first()
    
    if not driver:
        raise HTTPException(404, "Driver not found")
    
    # Validate pagination
    if page < 1:
        raise HTTPException(400, "Page must be >= 1")
    
    if page_size < 1 or page_size > 50:
        raise HTTPException(400, "Page size must be between 1 and 50")
    
    # Build query
    query = db.query(Rating).filter(
        Rating.driver_id == driver_id
    )
    
    # Apply filters
    if min_stars is not None:
        if not 1.0 <= min_stars <= 5.0:
            raise HTTPException(400, "min_stars must be between 1.0 and 5.0")
        query = query.filter(Rating.stars >= min_stars)
    
    # Get total count
    total_count = query.count()
    total_pages = ceil(total_count / page_size)
    
    # Apply pagination
    offset = (page - 1) * page_size
    ratings = query.order_by(
        Rating.created_at.desc()
    ).limit(page_size).offset(offset).all()
    
    return RatingListResponse(
        driver_id=driver_id,
        rating_avg=driver.rating_avg,
        rating_count=driver.rating_count,
        ratings=ratings,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


@router.get("/me/ratings", response_model=RatingListResponse)
async def get_my_ratings_as_driver(
    page: int = 1,
    page_size: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get ratings for current driver
    
    Convenience endpoint for drivers to see their own ratings
    """
    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()
    
    if not driver:
        raise HTTPException(404, "Driver profile not found")
    
    # Reuse the main endpoint logic
    return await get_driver_ratings(
        driver_id=driver.id,
        page=page,
        page_size=page_size,
        db=db
    )
```

**Tests:**
```python
# backend/tests/test_rating_list.py

@pytest.mark.asyncio
async def test_get_driver_ratings(
    async_client: AsyncClient,
    db_driver_with_5_ratings
):
    """Can get driver ratings"""
    response = await async_client.get(
        f"/api/v1/drivers/{db_driver_with_5_ratings.id}/ratings"
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["driver_id"] == db_driver_with_5_ratings.id
    assert data["rating_count"] == 5
    assert len(data["ratings"]) == 5
    assert data["page"] == 1
    assert data["total_pages"] == 1

@pytest.mark.asyncio
async def test_get_driver_ratings_pagination(
    async_client: AsyncClient,
    db_driver_with_25_ratings
):
    """Pagination works correctly"""
    # Page 1
    response = await async_client.get(
        f"/api/v1/drivers/{db_driver_with_25_ratings.id}/ratings"
        f"?page=1&page_size=10"
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert len(data["ratings"]) == 10
    assert data["page"] == 1
    assert data["total_pages"] == 3  # 25 / 10 = 3 pages
    
    # Page 2
    response = await async_client.get(
        f"/api/v1/drivers/{db_driver_with_25_ratings.id}/ratings"
        f"?page=2&page_size=10"
    )
    
    data = response.json()
    assert len(data["ratings"]) == 10
    assert data["page"] == 2
    
    # Page 3 (partial)
    response = await async_client.get(
        f"/api/v1/drivers/{db_driver_with_25_ratings.id}/ratings"
        f"?page=3&page_size=10"
    )
    
    data = response.json()
    assert len(data["ratings"]) == 5
    assert data["page"] == 3

@pytest.mark.asyncio
async def test_get_driver_ratings_filter_min_stars(
    async_client: AsyncClient,
    db_driver_with_mixed_ratings  # Has ratings: 5, 4.5, 4, 3, 2
):
    """Can filter by minimum stars"""
    response = await async_client.get(
        f"/api/v1/drivers/{db_driver_with_mixed_ratings.id}/ratings"
        f"?min_stars=4.0"
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Should return only: 5, 4.5, 4 (3 ratings)
    assert len(data["ratings"]) == 3
    
    # All ratings should be >= 4.0
    for rating in data["ratings"]:
        assert rating["stars"] >= 4.0

@pytest.mark.asyncio
async def test_get_ratings_ordered_by_recent(
    async_client: AsyncClient,
    db_driver_with_ratings
):
    """Ratings ordered by most recent first"""
    response = await async_client.get(
        f"/api/v1/drivers/{db_driver_with_ratings.id}/ratings"
    )
    
    data = response.json()
    ratings = data["ratings"]
    
    # Verify descending order by created_at
    for i in range(len(ratings) - 1):
        assert ratings[i]["created_at"] >= ratings[i+1]["created_at"]

@pytest.mark.asyncio
async def test_get_my_ratings_as_driver(
    async_client: AsyncClient,
    db_driver_with_ratings,
    driver_token
):
    """Driver can get their own ratings"""
    response = await async_client.get(
        "/api/v1/drivers/me/ratings",
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["driver_id"] == db_driver_with_ratings.id
```

**Critérios de Aceite:**
- [ ] Lista avaliações do motorista
- [ ] Paginação funciona (max 50/página)
- [ ] Filtro por min_stars opcional
- [ ] Ordenado por recente primeiro
- [ ] Mostra rating_avg e total
- [ ] Endpoint /me/ratings funciona
- [ ] Testes passam (5 cenários)
- [ ] Performance: p95 < 300ms

**Performance:**
- Query optimization: use index on driver_id
- Cache popular drivers (Redis)

**Dependências:**
- Task 3.3.1: Rating Model
- Task 3.3.2: Rate Endpoint

---

## ✅ SPRINT 3 COMPLETO!

### Resumo Final:

**Epic 3.1: Ride Progression (18 SP)** ✅
- Task 3.1.1: Arriving (3 SP)
- Task 3.1.2: Start Trip (5 SP)
- Task 3.1.3: GPS Tracking (5 SP)
- Task 3.1.4: Complete Ride (8 SP)

**Epic 3.2: Cancellation (10 SP)** ✅
- Task 3.2.1: Cancel Endpoint (8 SP)
- Task 3.2.2: Metrics Service (2 SP)

**Epic 3.3: Rating System (12 SP)** ✅
- Task 3.3.1: Rating Model (3 SP)
- Task 3.3.2: Rate Endpoint (5 SP)
- Task 3.3.3: Get Ratings (4 SP)

**TOTAL: 40 SP** ✅

---

### O que foi entregue:

✅ **8 endpoints completos** com código de produção
✅ **15+ services** (GPS tracking, distance calc, metrics, rating)
✅ **30+ testes unitários** com fixtures
✅ **3 migrations** (PostGIS, GPS tracking, Ratings)
✅ **Código pronto para copiar/colar**

---

### Próximo passo:

**Development Starter Kit** para começar a desenvolver hoje! 🚀

Me diga: **"starter kit"** para eu criar o pacote completo de setup!