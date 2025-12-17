from app.modules.rides.models.ride import Ride
from fastapi import HTTPException

class RideStatus:
    REQUESTED = "REQUESTED"
    SEARCHING = "SEARCHING"
    OFFERED = "OFFERED"
    ACCEPTED = "ACCEPTED"
    DRIVER_ARRIVING = "DRIVER_ARRIVING"
    ARRIVED = "ARRIVED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class RideStateMachine:
    """
    Manages state transitions for a Ride
    """
    
    VALID_TRANSITIONS = {
        RideStatus.REQUESTED: [RideStatus.SEARCHING, RideStatus.CANCELLED],
        RideStatus.SEARCHING: [RideStatus.OFFERED, RideStatus.CANCELLED], # Or back to REQUESTED if no drivers?
        RideStatus.OFFERED: [RideStatus.ACCEPTED, RideStatus.SEARCHING, RideStatus.CANCELLED],
        RideStatus.ACCEPTED: [RideStatus.DRIVER_ARRIVING, RideStatus.CANCELLED],
        RideStatus.DRIVER_ARRIVING: [RideStatus.IN_PROGRESS, RideStatus.CANCELLED],
        RideStatus.IN_PROGRESS: [RideStatus.COMPLETED, RideStatus.CANCELLED], # Can verify cancellation rules later
        RideStatus.COMPLETED: [], # Terminal
        RideStatus.CANCELLED: []  # Terminal
    }

    @classmethod
    def transition(cls, ride: Ride, new_status: str) -> Ride:
        """
        Transition ride to new status if valid
        """
        current_status = ride.status
        
        # Helper for direct transitions or flexible logic
        if new_status not in cls.VALID_TRANSITIONS.get(current_status, []):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid state transition from {current_status} to {new_status}"
            )
            
        ride.status = new_status
        return ride
