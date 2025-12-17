from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from app.main import app

client = TestClient(app)

def test_pix_webhook_endpoint():
    """
    Verify that the webhook endpoint correctly receives payload and calls the service.
    """
    # Patch the service method to avoid DB interaction
    with patch("app.services.payment.payment_service.PaymentService.process_webhook_notification", new_callable=AsyncMock) as mock_process:
        mock_process.return_value = 1
        
        payload = {
            "pix": [
                {
                    "txid": "test_txid_123",
                    "endToEndId": "E12345678202301010000",
                    "valor": "50.00",
                    "horario": "2025-12-17 10:00:00",
                    "infoPagador": "Teste Webhook"
                }
            ]
        }
        
        # Send POST request
        response = client.post("/api/v1/payments/webhook/pix", json=payload)
        
        # Assertions
        assert response.status_code == 200
        assert response.json() == {"status": "ok", "processed": 1}
        
        # Verify service was called with correct payload
        mock_process.assert_called_once()
        args, _ = mock_process.call_args
        assert args[0] == payload
