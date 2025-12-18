import mercadopago
from app.core.config import settings
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

class MercadoPagoClient:
    def __init__(self):
        if settings.MERCADOPAGO_ACCESS_TOKEN:
            self.sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
        else:
            self.sdk = None
            logger.warning("MERCADOPAGO_ACCESS_TOKEN not set")

    def create_customer(self, email: str, first_name: str = None, last_name: str = None, phone: str = None) -> Dict[str, Any]:
        """Create a customer in Mercado Pago"""
        if not self.sdk:
            raise ValueError("Mercado Pago SDK not initialized")
            
        data = {"email": email}
        if first_name: data["first_name"] = first_name
        if last_name: data["last_name"] = last_name
        if phone: data["phone"] = {"area_code": "", "number": phone} # Basic phone handling
        
        # Check if customer exists first? MP allows duplicates often, but let's assume we just create new one
        # There is a search API but for simplicity we rely on creating new or catching errors
        # Ideally we search by email first.
        
        search_result = self.sdk.customer().search(filters={"email": email})
        if search_result["status"] == 200 and search_result["response"]["results"]:
             return search_result["response"]["results"][0]

        result = self.sdk.customer().create(data)
        if result["status"] == 201:
            return result["response"]
        else:
            logger.error(f"Failed to create MP customer: {result}")
            raise Exception(f"Failed to create MP customer: {result['response']}")

    def save_card(self, customer_id: str, token: str) -> Dict[str, Any]:
        """Save a card (created via frontend token) to a customer"""
        if not self.sdk:
            raise ValueError("Mercado Pago SDK not initialized")

        data = {"token": token}
        result = self.sdk.card().create(customer_id, data)
        
        if result["status"] == 200 or result["status"] == 201:
            return result["response"]
        else:
            logger.error(f"Failed to save card to MP customer {customer_id}: {result}")
            raise Exception(f"Failed to save card: {result['response']}")

    def create_payment(self, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a payment (charge)"""
        if not self.sdk:
             raise ValueError("Mercado Pago SDK not initialized")
             
        # Ensure we have idempotency key if passed in headers usually, but SDK handles basic request
        request_options = {"headers": {"X-Idempotency-Key": payment_data.get("external_reference", "")}}
        
        result = self.sdk.payment().create(payment_data, request_options)
        
        if result["status"] == 201 or result["status"] == 200:
            return result["response"]
        else:
             logger.error(f"Failed to create MP payment: {result}")
             raise Exception(f"Failed to create MP payment: {result['response']}")

    def get_payment(self, payment_id: str) -> Dict[str, Any]:
        if not self.sdk:
             raise ValueError("Mercado Pago SDK not initialized")
        
        result = self.sdk.payment().get(payment_id)
        if result["status"] == 200:
            return result["response"]
        else:
            raise Exception(f"Failed to get payment: {result['response']}")

mercadopago_client = MercadoPagoClient()
