from redis import asyncio as aioredis
from app.core.config import settings
from typing import Optional

_redis_client: Optional[aioredis.Redis] = None

async def get_redis_client() -> aioredis.Redis:
    """
    Returns a singleton Redis client instance.
    """
    global _redis_client
    if _redis_client is None:
        url = settings.REDIS_URL or f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}"
        _redis_client = aioredis.from_url(url, encoding="utf-8", decode_responses=True)
    return _redis_client
