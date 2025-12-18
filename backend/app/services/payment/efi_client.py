from gerencianet import Gerencianet
from app.core.config import settings
import logging
import os

logger = logging.getLogger(__name__)

class EfiClient:
    """
    Efí Bank (Pix) API client
    Wrapper around gerencianet SDK
    """
    
    def __init__(self):
        """Initialize Efí client with credentials"""
        
        # Determine strictness: if in production, raise error if credentials missing
        # For dev, we might allow lenient initialization but actions will fail
        
        self.credentials = {
            'client_id': settings.EFI_CLIENT_ID,
            'client_secret': settings.EFI_CLIENT_SECRET,
            'certificate': settings.EFI_CERTIFICATE_PATH,
            'sandbox': settings.EFI_SANDBOX
        }
        
        self.gn = None
        try:
            # Validate basic requirements to attempt initialization
            if all([settings.EFI_CLIENT_ID, settings.EFI_CLIENT_SECRET, settings.EFI_CERTIFICATE_PATH]):
                self.gn = Gerencianet(self.credentials)
                logger.info(f"Efí client initialized (sandbox={settings.EFI_SANDBOX})")
            else:
                logger.warning("Efí client NOT initialized: Missing credentials or certificate path.")
        except Exception as e:
            logger.error(f"Failed to initialize Efí client: {e}")

    async def create_evp_key(self) -> str:
        """Create a random EVP key"""
        if not self.gn:
            raise RuntimeError("Efí client is not initialized.")
        try:
             response = self.gn.pix_create_evp()
             logger.info(f"Create EVP Response: {response}")
             key = response.get('chave')
             settings.EFI_PIX_KEY = key # Update simplified
             logger.info(f"Created EVP Key: {key}")
             return key
        except Exception as e:
             logger.error(f"Error creating EVP key: {e}")
             raise e

    async def create_pix_charge(
        self,
        value: float,
        payer: dict = None,
        txid: str = None,
        expiration: int = 3600
    ) -> dict:
        """
        Create immediate Pix charge
        """
        if not self.gn:
            raise RuntimeError("Efí client is not initialized.")

        try:
            # Use dynamically set key if available, else settings
            current_key = settings.EFI_PIX_KEY or await self.create_evp_key()
            
            body = {
                'calendario': {
                    'expiracao': expiration
                },
                'valor': {
                    'original': f'{value:.2f}'
                },
                'chave': current_key,
                'solicitacaoPagador': "Charge"
            }
            
            if payer:
                body['devedor'] = payer

            logger.info(f"Creating Pix Charge with key {current_key}...")
            
            # Run blocking call in executor? 
            # ideally: await asyncio.to_thread(self.gn.pix_create_immediate_charge, body=body)
            # For this quick fix, just async def (still blocking but works with await).
            
            response = self.gn.pix_create_immediate_charge(body=body)
            
            if 'txid' not in response:
                 raise ValueError(f"No txid in response: {response}")

            loc_id = response['loc']['id']
            qrcode_response = self.gn.pix_generate_QRCode(params={'id': loc_id})
            
            result = {
                'txid': response['txid'],
                'location': response['loc']['location'],
                'qrcode_image': qrcode_response.get('imagemQrcode'),
                'qrcode_text': qrcode_response.get('qrcode'),
                'expiration': expiration,
                'amount': value
            }
            
            logger.info(f"Pix charge created: txid={result['txid']}, amount=R${value}")
            return result
        
        except Exception as e:
            logger.error(f"Error creating Pix charge: {e}")
            raise ValueError(f"Failed to create Pix charge: {str(e)}")

    async def get_charge_status(self, txid: str) -> dict:
        """Get charge status"""
        if not self.gn:
           raise RuntimeError("Efí client is not initialized.")
            
        try:
            response = self.gn.pix_detail_charge(params={'txid': txid})
            
            paid = response['status'] == 'CONCLUIDA'
            
            result = {
                'txid': txid,
                'status': response['status'],
                'paid': paid,
                'amount': float(response['valor']['original']),
                'paid_at': response.get('pix', [{}])[0].get('horario') if paid else None
            }
            return result
            
        except Exception as e:
            logger.error(f"Error getting charge status for txid={txid}: {e}")
            raise ValueError(f"Failed to get charge status: {str(e)}")

    async def send_pix_transfer(
        self,
        amount: float,
        pix_key: str,
        description: str = "Payout"
    ) -> dict:
        """
        Send Pix transfer to a key
        """
        if not self.gn:
            raise RuntimeError("Efí client is not initialized.")
            
        try:
            # Use dynamically set key if available, else settings
            current_key = settings.EFI_PIX_KEY or await self.create_evp_key()
            if not current_key and settings.EFI_SANDBOX:
                 current_key = "efipay@sejaefi.com.br" # Fallback for sandbox

            body = {
                'valor': f'{amount:.2f}',
                'pagador': {
                    'chave': current_key
                },
                'favorecido': {
                    'chave': pix_key
                }
            }
            
            # Generate idEnvio if not provided within description or separately?
            # It's usually a unique ID for idempotency.
            import secrets
            id_envio = secrets.token_hex(16) # 32 chars
            
            # Send Pix
            # SDK expects params={'idEnvio': ...}, body={...}
            response = self.gn.pix_send(
                params={'idEnvio': id_envio},
                body=body
            )
            logger.info(f"Payout Response: {response}")
            
            if 'e2eId' not in response:
                 # Some endpoints return e2eId, others might return txid?
                 # Transfer usually returns e2eId.
                 pass
                 
            result = {
                'e2eId': response.get('e2eId'),
                'id_envio': id_envio,
                'status': response.get('status', 'SENT'),
                'amount': amount,
                'paid_at': response.get('horario')
            }
            
            logger.info(f"Pix transfer sent: amount=R${amount} key={pix_key} e2eId={result.get('e2eId')}")
            return result
            
        except Exception as e:
            logger.error(f"Error sending Pix transfer: {e}")
            raise ValueError(f"Failed to send Pix: {str(e)}")

# Singleton instance
efi_client = EfiClient()
