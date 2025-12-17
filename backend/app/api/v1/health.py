from fastapi import APIRouter, Response, status
from app.core.database import AsyncSessionLocal
from sqlalchemy import text
from redis import asyncio as aioredis
from app.core.config import settings
from aiormq import connect as rabbitmq_connect
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check(response: Response):
    health_status = {
        "status": "ok",
        "components": {
            "postgres": "unknown",
            "redis": "unknown",
            "rabbitmq": "unknown"
        }
    }
    
    overall_healthy = True

    # 1. Postgres Check
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
            health_status["components"]["postgres"] = "up"
    except Exception as e:
        health_status["components"]["postgres"] = f"down: {str(e)}"
        overall_healthy = False

    # 2. Redis Check
    try:
        redis_url = f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}"
        redis = aioredis.from_url(redis_url, socket_timeout=3)
        await redis.ping()
        await redis.close()
        health_status["components"]["redis"] = "up"
    except Exception as e:
        health_status["components"]["redis"] = f"down: {str(e)}"
        overall_healthy = False
        
    # 3. RabbitMQ Check
    try:
        rabbitmq_url = getattr(settings, "RABBITMQ_URL", "amqp://guest:guest@localhost/")
        connection = await rabbitmq_connect(rabbitmq_url)
        await connection.close()
        health_status["components"]["rabbitmq"] = "up"
    except Exception as e:
        health_status["components"]["rabbitmq"] = f"down: {str(e)}"
        overall_healthy = False
    
    if not overall_healthy:
        health_status["status"] = "degraded"
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        
    return health_status
