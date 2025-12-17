from typing import List, Dict
from fastapi import WebSocket

import json
import asyncio
import logging
from typing import List, Dict, Optional
from fastapi import WebSocket, WebSocketDisconnect
from redis import asyncio as aioredis
from app.core.config import settings

logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        # Maps user_id -> list of websockets
        self.active_connections: Dict[str, List[WebSocket]] = {}
        # Maps user_id -> role ("driver", "passenger")
        self.user_roles: Dict[str, str] = {}
        
        # Redis Pub/Sub for distributed broadcasting
        self.redis_url = f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}"
        self.pubsub_client = None

    async def connect(self, websocket: WebSocket, user_id: str, role: str):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        self.user_roles[user_id] = role
        logger.info(f"User {user_id} ({role}) connected.")

    def disconnect(self, websocket: WebSocket, user_id: str):
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
                if user_id in self.user_roles:
                    del self.user_roles[user_id]
        logger.info(f"User {user_id} disconnected.")

    async def send_personal_message(self, message: dict, user_id: str):
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"Error sending personal message to {user_id}: {e}")

    async def broadcast_to_drivers(self, message: dict):
        """
        Broadcasts a message to all connected drivers.
        In a distributed setup, this should act as a proxy to Redis Pub/Sub if called from a worker,
        OR iterate over local connections if called within the API process that has the connections.
        
        Given we want a distributed system with a Worker, the Worker publishes to Redis,
        and the API subscribes to Redis and calls this method locally.
        
        However, for simplicity in the 'Manager' which lives in API memory:
        This method will iterate LOCALLY. The Redis Listener calls THIS method.
        """
        for user_id, websockets in self.active_connections.items():
            if self.user_roles.get(user_id) == 'driver':
                 for ws in websockets:
                    try:
                        await ws.send_json(message)
                    except Exception as e:
                        logger.error(f"Error broadcasting to driver {user_id}: {e}")

    # --- Redis Integration ---
    async def startup(self):
        """Starts the Redis Listener loop."""
        self.redis = aioredis.from_url(self.redis_url, encoding="utf-8", decode_responses=True)
        self.pubsub = self.redis.pubsub()
        await self.pubsub.subscribe("ride_notifications")
        asyncio.create_task(self._redis_listener())
        logger.info("Redis Pub/Sub listener started.")

    async def _redis_listener(self):
        """Listens for messages from Redis and broadcasts them locally."""
        try:
            async for message in self.pubsub.listen():
                if message["type"] == "message":
                    data = json.loads(message["data"])
                    # Decide what to do based on message type
                    msg_type = data.get("type")
                    
                    if msg_type == "NEW_RIDE":
                         # Worker said "New Ride available", notify all local drivers
                         await self.broadcast_to_drivers(data)
                    elif msg_type == "RIDE_UPDATE":
                        # Targeted update (e.g. for Passenger)
                        target_user_id = data.get("target_user_id")
                        if target_user_id:
                            await self.send_personal_message(data, target_user_id)

        except Exception as e:
            logger.error(f"Redis listener error: {e}")

manager = ConnectionManager()
