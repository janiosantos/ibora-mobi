from app.modules.finance.models.payment_method import PaymentMethod
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class CardValidator:
    """Validate cards"""
    
    @staticmethod
    def validate_for_payment(payment_method: PaymentMethod) -> tuple[bool, str]:
        """
        Validate if card can be used for payment
        
        Returns:
            (is_valid, error_message)
        """
        
        if not payment_method.is_active:
            return False, "Card is inactive"
        
        if payment_method.is_expired():
            return False, "Card is expired"
        
        return True, ""
