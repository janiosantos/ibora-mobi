from aiormq import connect
import json
import logging
from typing import Any
from app.core.config import settings
import aiormq
from aiormq import spec

logger = logging.getLogger(__name__)

class RabbitMQProducer:
    def __init__(self, rabbitmq_url: str):
        self.rabbitmq_url = rabbitmq_url
        self.connection = None
        self.channel = None

    async def _get_channel(self):
        if self.connection is None or self.connection.is_closed:
            self.connection = await connect(self.rabbitmq_url)
            self.channel = await self.connection.channel()
        return self.channel

    async def publish_message(self, queue_name: str, message: dict):
        try:
            channel = await self._get_channel()
            # Ensure queue exists
            await channel.queue_declare(queue=queue_name, durable=True)
            
            await channel.basic_publish(
                body=json.dumps(message).encode(),
                exchange="",
                routing_key=queue_name,
                properties=spec.Basic.Properties(delivery_mode=2)
            )
            logger.info(f"Message published to {queue_name}")
        except Exception as e:
            logger.error(f"Failed to publish message: {e}")
            raise e

    async def close(self):
        if self.connection and not self.connection.is_closed:
            await self.connection.close()

# RabbitMQ URL defaults to localhost if not in settings, usually AMQP://guest:guest@localhost/
RABBITMQ_URL = getattr(settings, "RABBITMQ_URL", "amqp://guest:guest@localhost/")
mq_producer = RabbitMQProducer(RABBITMQ_URL)

async def publish_message(queue_name: str, message: dict):
    await mq_producer.publish_message(queue_name, message)
