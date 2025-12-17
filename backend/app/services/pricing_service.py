from typing import Tuple
from decimal import Decimal

class PricingService:
    BASE_PRICE = Decimal("5.00")
    PRICE_PER_KM = Decimal("2.00")
    PRICE_PER_MIN = Decimal("0.50")
    MIN_PRICE = Decimal("7.00")

    @classmethod
    def calculate_price(
        cls, 
        distance_meters: float, 
        duration_seconds: float,
        category: str = "standard"
    ) -> Decimal:
        """
        Calculate ride price based on distance (meters) and duration (seconds).
        """
        distance_km = Decimal(distance_meters) / Decimal(1000)
        duration_min = Decimal(duration_seconds) / Decimal(60)

        price = (
            cls.BASE_PRICE + 
            (distance_km * cls.PRICE_PER_KM) + 
            (duration_min * cls.PRICE_PER_MIN)
        )

        return max(price, cls.MIN_PRICE).quantize(Decimal("0.01"))

    @classmethod
    def calculate_driver_earnings(cls, total_price: Decimal) -> Decimal:
        """
        Calculate driver earnings (e.g. 80% of total price).
        This logic might eventually move to CommissionService.
        """
        commission_rate = Decimal("0.20") # 20% commission
        return (total_price * (1 - commission_rate)).quantize(Decimal("0.01"))
