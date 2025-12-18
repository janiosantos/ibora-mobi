import asyncio
import logging
import sys
import os
sys.path.append(os.getcwd())

from app.services.payment.efi_client import efi_client

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("EfiSandbox")

async def test_create_charge():
    """
    Test creating a Pix charge (QR Code) for R$ 1.00 (Success Range)
    """
    try:
        logger.info("Testing Pix Charge (Cobrança)...")
        # txid must be valid (Alphanumeric, 26-35)
        txid = "TestCharge" + str(id(object()))
        
        # Create Immediate Charge
        result = await efi_client.create_pix_charge(
            txid=None, # Let Efi generate or provide one? API usually generates if POST /cob
            value=1.00, # R$ 1.00 -> Confirmed in Sandbox
            payer={
               "cpf": "12345678909",
               "nome": "Test Payer"
            }
        )
        logger.info(f"Charge Created: {result}")
        if 'txid' in result:
             logger.info(f"QR Code Text: {result.get('qrcode_text')}")
             logger.info(f"QR Code Link: {result.get('location')}")
             
    except Exception as e:
        logger.error(f"Charge Failed: {e}")

async def test_send_pix():
    """
    Test sending a Pix (Payout) to efipay@sejaefi.com.br
    """
    try:
        logger.info("Testing Pix Transfer (Payout)...")
        # Rules: 0.01 - 10.00 confirmed. Key: efipay@sejaefi.com.br
        
        result = await efi_client.send_pix_transfer(
            amount=1.00,
            pix_key="efipay@sejaefi.com.br",
            description="Test Sandbox Payout"
        )
        logger.info(f"Payout Result: {result}")
        
    except Exception as e:
        logger.error(f"Payout Failed: {e}")

async def main():
    await test_create_charge()
    await test_send_pix()

if __name__ == "__main__":
    # Fix import path
    import sys
    import os
    sys.path.append(os.getcwd())
    
    # Check settings
    from app.core.config import settings
    logger.info(f"Using Cert: {settings.EFI_CERTIFICATE_PATH}")
    logger.info(f"Client ID: {settings.EFI_CLIENT_ID[:5]}...")
    
    asyncio.run(main())
