from typing import Any, Dict, Optional, Tuple
import googlemaps
from app.core.config import settings
from datetime import datetime

class MapsService:
    _client: Optional[googlemaps.Client] = None

    @classmethod
    def get_client(cls) -> googlemaps.Client:
        if cls._client is None:
            if settings.GOOGLE_MAPS_API_KEY:
                cls._client = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)
            else:
                # If no key, we might mock or raise warning. 
                # For now, let's allow it to be None and fail gracefully on calls or mock.
                pass
        return cls._client

    @classmethod
    async def get_distance_duration(
        cls, origin: str | Tuple[float, float], destination: str | Tuple[float, float]
    ) -> Tuple[Optional[float], Optional[float]]:
        """
        Calculates distance (in meters) and duration (in seconds) between two points.
        """
        client = cls.get_client()
        if not client:
            # Mock fallback if no API key (for development without billing)
            # Calculate linear distance? Or just return mock.
            # Let's return mock values for MVP if key is missing to unblock dev.
            # Assuming ~5km, 10 min
            print("WARNING: Google Maps API Key not set. Using mock distance/duration.")
            return 5000.0, 600.0

        try:
            # directions is more comprehensive but distance_matrix is simpler for A->B
            matrix = client.distance_matrix(
                origins=[origin],
                destinations=[destination],
                mode="driving",
                units="metric"
            )

            if matrix['status'] == 'OK':
                element = matrix['rows'][0]['elements'][0]
                if element['status'] == 'OK':
                    distance_value = element['distance']['value'] # meters
                    duration_value = element['duration']['value'] # seconds
                    return float(distance_value), float(duration_value)
        except Exception as e:
            print(f"Error calling Google Maps API: {e}")
            pass

        return None, None

    @classmethod
    async def get_directions(
        cls, origin: str | Tuple[float, float], destination: str | Tuple[float, float]
    ) -> Optional[Dict]:
        """
        Get full directions/route data.
        """
        client = cls.get_client()
        if not client:
             print("WARNING: Google Maps API Key not set. Returning None for directions.")
             return None

        try:
            directions_result = client.directions(
                origin,
                destination,
                mode="driving",
                units="metric",
                alternatives=False
            )
            if directions_result:
                return directions_result[0] # Return first route
        except Exception as e:
            print(f"Error getting directions: {e}")
        
        return None

    @classmethod
    async def reverse_geocode(cls, lat: float, lng: float) -> Optional[str]:
        """
        Get address from lat/lng.
        """
        client = cls.get_client()
        if not client:
            return "Mock Address, 123"

        try:
            results = client.reverse_geocode((lat, lng))
            if results:
                return results[0]['formatted_address']
        except Exception as e:
            print(f"Error reverse geocoding: {e}")
            
        return None
