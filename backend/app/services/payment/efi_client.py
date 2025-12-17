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

    def create_immediate_charge(
        self,
        amount: float,
        description: str,
        expiration: int = 3600,  # 1 hour
        additional_info: dict = None
    ) -> dict:
        """
        Create immediate Pix charge
        """
        if not self.gn:
            raise RuntimeError("Efí client is not initialized.")

        try:
            body = {
                'calendario': {
                    'expiracao': expiration
                },
                'valor': {
                    'original': f'{amount:.2f}' # Must be string with 2 decimals
                },
                'chave': settings.EFI_PIX_KEY,
                'solicitacaoPagador': description
            }
            
            if additional_info:
                body['infoAdicionais'] = [
                    {'nome': k, 'valor': str(v)}
                    for k, v in additional_info.items()
                ]
            
            # Create charge (txid)
            response = self.gn.pix_create_immediate_charge(body=body)
            
            if 'txid' not in response:
                 raise ValueError(f"No txid in response: {response}")

            # Get QR Code
            loc_id = response['loc']['id']
            # params = {'id': loc_id} # SDK expects params as dict
            qrcode_response = self.gn.pix_generate_QRCode(params={'id': loc_id})
            
            result = {
                'txid': response['txid'],
                'location': response['loc']['location'],
                'qrcode_image': qrcode_response.get('imagemQrcode'),
                'qrcode_text': qrcode_response.get('qrcode'),
                'expiration': expiration,
                'amount': amount
            }
            
            logger.info(f"Pix charge created: txid={result['txid']}, amount=R${amount}")
            return result
        
        except Exception as e:
            logger.error(f"Error creating Pix charge: {e}")
            raise ValueError(f"Failed to create Pix charge: {str(e)}")

    def get_charge_status(self, txid: str) -> dict:
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

# Singleton instance
efi_client = EfiClient()
