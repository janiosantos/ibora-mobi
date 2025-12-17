import asyncio
import json
from aiormq import connect
from redis import asyncio as aioredis
from app.core.config import settings
from app.core.logging import get_logger, configure_logging

logger = get_logger(__name__)

RABBITMQ_URL = getattr(settings, "RABBITMQ_URL", "amqp://guest:guest@localhost/")
QUEUE_NAME = "new_rides_available"
REDIS_URL = f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}"

async def on_new_ride_message(message):
    """Callback triggered when a new ride message is received."""
    try:
        data = json.loads(message.body.decode())
        logger.info("Worker received new ride", ride_id=data.get("ride_id"))

        # --- Business Logic / Processing ---
        # Here you could calculate additional ETAs, filter drivers, etc.
        # For now, we forward to the Redis Pub/Sub so the API can notify WebSockets.
        
        notification = {
            "type": "NEW_RIDE",
            "ride_id": data.get("ride_id"),
            "origin": data.get("origin"),
            "destination": data.get("destination"),
            "price": data.get("price")
        }
        
        # Publish to Redis
        redis = aioredis.from_url(REDIS_URL)
        await redis.publish("ride_notifications", json.dumps(notification))
        await redis.close()
        
        logger.info("Published notification to Redis", ride_id=data.get("ride_id"))

        # Acknowledge message
        await message.channel.basic_ack(message.delivery.delivery_tag)
        
    except Exception as e:
        logger.error("Error processing message", error=str(e))
        # Optionally reject or nack
        # await message.channel.basic_nack(message.delivery.delivery_tag)

async def consume_rides_queue():
    """Connects to RabbitMQ and starts consuming."""
    logger.info("Connecting to RabbitMQ...")
    connection = await connect(RABBITMQ_URL)
    channel = await connection.channel()

    # Ensure queue exists
    await channel.queue_declare(queue=QUEUE_NAME, durable=True)
    
    # Start consuming
    await channel.basic_consume(QUEUE_NAME, on_new_ride_message)
    logger.info("Worker started consuming...")

    # Keep running
    await asyncio.Future()

if __name__ == "__main__":
    configure_logging()
    try:
        asyncio.run(consume_rides_queue())
    except KeyboardInterrupt:
        logger.info("Worker stopped")
