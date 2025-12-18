import asyncio
import logging
import sys
import os
sys.path.append(os.getcwd())

from app.services.payment.efi_client import efi_client
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ListKeys")

async def list_keys():
    try:
        logger.info("Listing Pix Keys...")
        # SDK uses pix_list_keys(params={})
        response = efi_client.gn.pix_list_keys(params={'limit': 10})
        logger.info(f"Keys: {response}")
    except Exception as e:
        logger.error(f"List Failed: {e}")

async def main():
    await list_keys()

if __name__ == "__main__":
    asyncio.run(main())
