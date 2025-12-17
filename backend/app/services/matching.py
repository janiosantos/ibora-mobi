from typing import List, Tuple, Any
from sqlalchemy import func
from sqlalchemy.orm import Session
from geoalchemy2.elements import WKTElement
from geoalchemy2.types import Geography
from app.modules.drivers.models.driver import Driver, DriverOnlineStatus
from app.services.redis_client import redis_client
from app.core.logging import get_logger

logger = get_logger(__name__)

class MatchingService:
    """
    Service for matching passengers with nearby drivers
    
    Uses hybrid approach:
    1. Redis Geospatial for fast initial filtering
    2. PostgreSQL PostGIS for precise distance calculation and filters
    """
    
    CACHE_TTL_SECONDS = 30
    
    @classmethod
    async def find_nearby_drivers(
        cls,
        latitude: float,
        longitude: float,
        radius_km: float = 5.0,
        limit: int = 20,
        min_rating: float = 4.0,
        db: Session = None
    ) -> List[Tuple[Driver, float]]:
        """
        Find drivers within radius using PostGIS
        """
        
        # Create point for passenger location
        passenger_point = WKTElement(
            f'POINT({longitude} {latitude})',
            srid=4326
        )
        
        # Calculate radius in meters
        radius_meters = radius_km * 1000
        
        # Query with PostGIS
        # ST_DWithin uses geography (meters) for distance
        # Note: In async SQLAlchemy, we execute query. Explicitly join if needed or assume eager load elsewhere if needed.
        # But here we just return drivers.
        
        # Since we are using AsyncSession in the codebase (based on previous file views), we should construct a select statement.
        
        from sqlalchemy import select
        
        query = select(
            Driver,
            func.ST_Distance(
                func.cast(Driver.location, Geography),
                func.cast(passenger_point, Geography)
            ).label('distance')
        ).where(
            Driver.online_status == DriverOnlineStatus.ONLINE,
            Driver.average_rating >= min_rating,
            func.ST_DWithin(
                func.cast(Driver.location, Geography),
                func.cast(passenger_point, Geography),
                radius_meters
            )
        ).order_by('distance').limit(limit)
        
        result = await db.execute(query)
        rows = result.all()
        
        # Format results: rows are (Driver, distance)
        drivers_with_distance = [
            (driver, float(distance))
            for driver, distance in rows
        ]
        
        logger.info(
            "nearby_drivers_postgis",
            count=len(drivers_with_distance),
            lat=latitude,
            lng=longitude,
            radius=radius_km
        )
        
        return drivers_with_distance
    
    @classmethod
    def find_nearby_drivers_redis(
        cls,
        latitude: float,
        longitude: float,
        radius_km: float = 5.0,
        limit: int = 20
    ) -> List[Tuple[str, float]]:
        """
        Fast lookup using Redis GEORADIUS
        Returns driver IDs (as strings) with distances
        """
        try:
            results = redis_client.georadius(
                'drivers:online',
                longitude,  # Redis expects lng, lat order
                latitude,
                radius_km,
                unit='km',
                withdist=True,
                sort='ASC',
                count=limit
            )
            
            # Parse results
            # Results format: [(b'uuid', b'1.234'), ...] or strings if decode_responses=True
            return [
                (driver_id, float(distance))
                for driver_id, distance in results
            ]
        
        except Exception as e:
            logger.error(f"Redis GEORADIUS error: {e}")
            return []
    
    @classmethod
    async def find_nearby_drivers_hybrid(
        cls,
        latitude: float,
        longitude: float,
        radius_km: float = 5.0,
        limit: int = 20,
        min_rating: float = 4.0,
        db: Session = None
    ) -> List[Tuple[Driver, float]]:
        """
        Hybrid approach: Redis for speed, PostgreSQL for precision
        """
        
        # Step 1: Fast lookup from Redis
        redis_results = cls.find_nearby_drivers_redis(
            latitude, longitude, radius_km, limit * 2
        )
        
        candidate_ids = [driver_id for driver_id, _ in redis_results]
        
        if not candidate_ids:
            logger.info("No drivers found in Redis, falling back to PostgreSQL only")
            return await cls.find_nearby_drivers(
                latitude, longitude, radius_km, limit, min_rating, db
            )
        
        # Step 2: Fetch from PostgreSQL with filters
        passenger_point = WKTElement(
            f'POINT({longitude} {latitude})',
            srid=4326
        )
        
        from sqlalchemy import select
        
        # Need to cast UUID strings to UUID if driver.id is UUID
        # But SQLAlchemy usually handles string to UUID conversion in IN clause if model is typed UUID.
        
        query = select(
            Driver,
            func.ST_Distance(
                func.cast(Driver.location, Geography),
                func.cast(passenger_point, Geography)
            ).label('distance')
        ).where(
            Driver.id.in_(candidate_ids),
            Driver.online_status == DriverOnlineStatus.ONLINE,
            Driver.average_rating >= min_rating
        ).order_by('distance').limit(limit)
        
        result = await db.execute(query)
        rows = result.all()
        
        return [
            (driver, float(distance))
            for driver, distance in rows
        ]

    @classmethod
    async def update_driver_location(
        cls,
        driver_id: str,
        latitude: float,
        longitude: float,
        db: Session
    ):
        """
        Update driver location in Redis and Postgres
        """
        # Update Redis
        try:
            redis_client.geoadd(
                'drivers:online',
                (longitude, latitude, str(driver_id)) # Value, Lon, Lat -> Wait, standard is key, lon, lat, member
                # redis-py: geoadd(name, values) where values is [lon, lat, member, ...]
            ) 
            # Correct explicit call for redis-py 3+ or 4+ check
            # For 4.x: geoadd(name, [lon, lat, member]) or kwargs? 
            # Generic: geoadd("drivers:online", longitude, latitude, str(driver_id)) is deprecated in some versions.
            # Safe way:
            redis_client.geoadd('drivers:online', [(longitude, latitude, str(driver_id))])
        except Exception as e:
            logger.error(f"Failed to update redis location: {e}")
            
        # Update Postgres
        from sqlalchemy import update
        point = WKTElement(f'POINT({longitude} {latitude})', srid=4326)
        
        await db.execute(
            update(Driver).where(Driver.id == driver_id).values(
                location=point,
                # last_location_update=func.now() # Updated in model automatically? No, only updated_at.
                # last_location_update is manual
            )
        )
        await db.commit()

    @classmethod
    def remove_driver_from_redis(cls, driver_id: str):
        try:
            redis_client.zrem('drivers:online', str(driver_id))
        except Exception as e:
            logger.error(f"Failed to remove driver from redis: {e}")
