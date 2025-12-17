import sys
import os
import unittest
from unittest.mock import MagicMock, patch

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Mock settings before importing app.services.payment.efi_client
# because it imports settings at module level
with patch('app.core.config.settings') as mock_settings:
    mock_settings.EFI_CLIENT_ID = "client_id"
    mock_settings.EFI_CLIENT_SECRET = "client_secret"
    mock_settings.EFI_CERTIFICATE_PATH = "cert_path"
    mock_settings.EFI_SANDBOX = True
    mock_settings.EFI_PIX_KEY = "pix_key"
    
    from app.services.payment.efi_client import EfiClient

class TestEfiClient(unittest.TestCase):

    @patch('app.services.payment.efi_client.Gerencianet')
    def test_create_immediate_charge_success(self, mock_gn_class):
        # Setup Mock
        mock_gn_instance = MagicMock()
        mock_gn_class.return_value = mock_gn_instance
        
        mock_gn_instance.pix_create_immediate_charge.return_value = {
            'txid': 'test_txid_123',
            'loc': {'id': 100, 'location': 'pix.example.com/qr/123'}
        }
        
        mock_gn_instance.pix_generate_qrcode.return_value = {
            'imagemQrcode': 'base64img',
            'qrcode': '000201...'
        }
        
        # Test
        client = EfiClient()
        # Manually inject gn because __init__ might fail if we don't patch settings properly globally
        # But we imported EfiClient after mocking settings, let's see if __init__ picked it up.
        # Actually EfiClient.__init__ accesses settings.EFI_* which are properties of the prompt-patch. 
        # But `from app.core.config import settings` in the module might have captured the original object.
        # We'll see. If fails, we can inject client.gn manually.
        
        # Ensure client initialized
        if not client.gn:
            client.gn = mock_gn_instance
            
        result = client.create_immediate_charge(
            amount=50.00,
            description="Test Charge"
        )
        
        # Assertions
        self.assertEqual(result['txid'], 'test_txid_123')
        self.assertEqual(result['amount'], 50.00)
        self.assertEqual(result['qrcode_text'], '000201...')
        
        # Verify calls
        mock_gn_instance.pix_create_immediate_charge.assert_called_once()
        args, kwargs = mock_gn_instance.pix_create_immediate_charge.call_args
        self.assertEqual(kwargs['body']['valor']['original'], '50.00')

    @patch('app.services.payment.efi_client.Gerencianet')
    def test_get_charge_status_paid(self, mock_gn_class):
         # Setup Mock
        mock_gn_instance = MagicMock()
        mock_gn_class.return_value = mock_gn_instance
        
        mock_gn_instance.pix_detail_charge.return_value = {
            'txid': 'test_txid_123',
            'status': 'CONCLUIDA',
            'valor': {'original': '50.00'},
            'pix': [{'horario': '2025-01-01 10:00:00'}]
        }
        
        client = EfiClient()
        if not client.gn:
            client.gn = mock_gn_instance
            
        result = client.get_charge_status('test_txid_123')
        
        self.assertTrue(result['paid'])
        self.assertEqual(result['status'], 'CONCLUIDA')
        self.assertEqual(result['amount'], 50.00)

if __name__ == '__main__':
    unittest.main()
