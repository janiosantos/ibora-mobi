/**
 * useRideRequest Hook
 * Manages complete ride flow for both driver and passenger
 * Coordinates WebSocket events and API calls
 */

import { useState, useEffect, useCallback } from 'react';
import { rideApi } from '../api/rides';
import { wsService, WSEventType } from '../api/websocket';
import type { Ride, Location } from '../types';

export type RideStatus = 
  | 'IDLE'
  | 'REQUESTING' // Passenger: waiting for driver
  | 'DRIVER_ASSIGNED' // Passenger: driver accepted
  | 'DRIVER_ARRIVING' // Driver on the way
  | 'ARRIVED' // Driver arrived at pickup
  | 'IN_PROGRESS' // Trip started
  | 'COMPLETED' // Trip finished
  | 'CANCELLED';

interface RideRequestData {
  pickup: Location;
  dropoff: Location;
  vehicleType?: string;
  paymentMethod?: string;
  offeredPrice?: number;
}

export const useRideRequest = (userType: 'driver' | 'passenger') => {
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const [status, setStatus] = useState<RideStatus>('IDLE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen to WebSocket events
  useEffect(() => {
    const handleNewRideRequest = (data: any) => {
      if (userType === 'driver') {
        setCurrentRide(data.ride);
        setStatus('REQUESTING');
      }
    };

    const handleRideAccepted = (data: any) => {
      if (userType === 'passenger') {
        setCurrentRide(data.ride);
        setStatus('DRIVER_ASSIGNED');
      }
    };

    const handleDriverArriving = (data: any) => {
      setCurrentRide(prev => prev ? { ...prev, ...data.ride } : data.ride);
      setStatus('DRIVER_ARRIVING');
    };

    const handleRideStarted = (data: any) => {
      setCurrentRide(prev => prev ? { ...prev, ...data.ride } : data.ride);
      setStatus('IN_PROGRESS');
    };

    const handleRideCompleted = (data: any) => {
      setCurrentRide(prev => prev ? { ...prev, ...data.ride } : data.ride);
      setStatus('COMPLETED');
    };

    const handleRideCancelled = (data: any) => {
      setCurrentRide(null);
      setStatus('CANCELLED');
      setError(data.reason || 'Ride was cancelled');
    };

    // Subscribe to events
    const unsubscribeNewRequest = wsService.on(WSEventType.NEW_RIDE_REQUEST, handleNewRideRequest);
    const unsubscribeAccepted = wsService.on(WSEventType.RIDE_ACCEPTED, handleRideAccepted);
    const unsubscribeArriving = wsService.on(WSEventType.DRIVER_ARRIVING, handleDriverArriving);
    const unsubscribeStarted = wsService.on(WSEventType.RIDE_STARTED, handleRideStarted);
    const unsubscribeCompleted = wsService.on(WSEventType.RIDE_COMPLETED, handleRideCompleted);
    const unsubscribeCancelled = wsService.on(WSEventType.RIDE_CANCELLED, handleRideCancelled);

    return () => {
      unsubscribeNewRequest();
      unsubscribeAccepted();
      unsubscribeArriving();
      unsubscribeStarted();
      unsubscribeCompleted();
      unsubscribeCancelled();
    };
  }, [userType]);

  // Passenger: Request a ride
  const requestRide = useCallback(async (data: RideRequestData) => {
    if (userType !== 'passenger') {
      throw new Error('Only passengers can request rides');
    }

    setLoading(true);
    setError(null);

    try {
      const estimate = await rideApi.estimate({
        pickup_lat: data.pickup.lat,
        pickup_lng: data.pickup.lng,
        dropoff_lat: data.dropoff.lat,
        dropoff_lng: data.dropoff.lng,
      });

      // In real implementation, this would create a ride request
      // For now, we'll simulate it
      setStatus('REQUESTING');
      setCurrentRide({
        id: `ride-${Date.now()}`,
        pickup_location: data.pickup,
        dropoff_location: data.dropoff,
        status: 'PENDING',
        estimated_price: estimate.estimated_price,
        estimated_distance_km: estimate.estimated_distance_km,
        estimated_duration_min: estimate.estimated_duration_min,
        created_at: new Date().toISOString(),
      } as any);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request ride');
      return false;
    } finally {
      setLoading(false);
    }
  }, [userType]);

  // Driver: Accept a ride
  const acceptRide = useCallback(async (rideId: string) => {
    if (userType !== 'driver') {
      throw new Error('Only drivers can accept rides');
    }

    setLoading(true);
    setError(null);

    try {
      const ride = await rideApi.accept(rideId);
      setCurrentRide(ride);
      setStatus('DRIVER_ASSIGNED');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept ride');
      return false;
    } finally {
      setLoading(false);
    }
  }, [userType]);

  // Driver: Signal arriving
  const signalArriving = useCallback(async () => {
    if (!currentRide) return false;

    setLoading(true);
    setError(null);

    try {
      const ride = await rideApi.arriving(currentRide.id);
      setCurrentRide(ride);
      setStatus('ARRIVED');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to signal arriving');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentRide]);

  // Driver: Start ride
  const startRide = useCallback(async () => {
    if (!currentRide) return false;

    setLoading(true);
    setError(null);

    try {
      const ride = await rideApi.start(currentRide.id);
      setCurrentRide(ride);
      setStatus('IN_PROGRESS');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start ride');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentRide]);

  // Driver: Finish ride
  const finishRide = useCallback(async () => {
    if (!currentRide) return false;

    setLoading(true);
    setError(null);

    try {
      const ride = await rideApi.finish(currentRide.id);
      setCurrentRide(ride);
      setStatus('COMPLETED');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to finish ride');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentRide]);

  // Both: Cancel ride
  const cancelRide = useCallback(async (reason?: string) => {
    if (!currentRide) return false;

    setLoading(true);
    setError(null);

    try {
      // API call to cancel ride
      // await rideApi.cancel(currentRide.id, reason);
      setCurrentRide(null);
      setStatus('CANCELLED');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel ride');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentRide]);

  // Reset state
  const reset = useCallback(() => {
    setCurrentRide(null);
    setStatus('IDLE');
    setError(null);
    setLoading(false);
  }, []);

  return {
    currentRide,
    status,
    loading,
    error,
    requestRide, // Passenger
    acceptRide, // Driver
    signalArriving, // Driver
    startRide, // Driver
    finishRide, // Driver
    cancelRide, // Both
    reset,
  };
};
