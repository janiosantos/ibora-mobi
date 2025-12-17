import asyncio
import json
import logging
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
import polyline

from app.core.redis import get_redis_client
from app.modules.rides.models.ride import Ride

logger = logging.getLogger(__name__)

class GPSTrackingService:
    _tasks = {} # ride_id -> asyncio.Task

    @classmethod
    async def start_tracking(cls, ride_id: str, driver_id: str):
        """
        Starts a background task to track the driver's location for this ride.
        """
        if ride_id in cls._tasks:
            logger.warning(f"Tracking already active for ride {ride_id}")
            return

        task = asyncio.create_task(cls._track_loop(ride_id, driver_id))
        cls._tasks[ride_id] = task
        logger.info(f"Started GPS tracking for ride {ride_id}")

    @classmethod
    async def stop_tracking(cls, ride_id: str):
        """
        Stops the tracking task.
        """
        task = cls._tasks.pop(ride_id, None)
        if task:
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass
            logger.info(f"Stopped GPS tracking for ride {ride_id}")

    @classmethod
    async def _track_loop(cls, ride_id: str, driver_id: str):
        """
        Periodically fetches driver location from Redis and stores it in a temporary Redis list.
        """
        redis = await get_redis_client()
        try:
            while True:
                # 1. Get current driver location (from Redis Geo)
                # Redis GEO key: "drivers:locations"
                # GEOPOS returns list of [lon, lat]
                positions = await redis.geopos("drivers:locations", driver_id)
                
                if positions and positions[0]:
                    lon, lat = positions[0]
                    point = {"lat": lat, "lon": lon, "ts": asyncio.get_event_loop().time()}
                    
                    # 2. Append to Ride Path List
                    path_key = f"ride:{ride_id}:path"
                    await redis.rpush(path_key, json.dumps(point))
                    # Set expire to avoid loose keys if crash
                    await redis.expire(path_key, 86400) 
                    
                await asyncio.sleep(5) # Capture every 5 seconds
        except asyncio.CancelledError:
            raise
        except Exception as e:
            logger.error(f"Error in GPS tracking for ride {ride_id}: {e}")

    @classmethod
    async def persist_path(cls, ride_id: str, db: AsyncSession):
        """
        Reads the path from Redis, encodes it to Polyline, and saves to DB.
        """
        redis = await get_redis_client()
        path_key = f"ride:{ride_id}:path"
        
        # 1. Get all points
        raw_points = await redis.lrange(path_key, 0, -1)
        if not raw_points:
            return

        points = []
        for p in raw_points:
             data = json.loads(p)
             points.append((data["lat"], data["lon"])) # Polyline expects (lat, lon)
        
        # 2. Encode
        encoded_polyline = polyline.encode(points)
        
        # 3. Update DB
        stmt = (
            update(Ride)
            .where(Ride.id == ride_id)
            .values(route_polyline=encoded_polyline)
        )
        await db.execute(stmt)
        await db.commit()
        
        # 4. Cleanup
        await redis.delete(path_key)
        logger.info(f"Persisted route polyline for ride {ride_id}")
