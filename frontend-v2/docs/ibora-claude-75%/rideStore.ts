/**
 * Ride Store
 * Global state for rides (current ride, history, requests)
 */

import { create } from 'zustand';
import { rideApi, wsService, WSEventType } from '../api';
import type { Ride, RideRequest } from '../types';
import type { RideResponse } from '../api/rides';

interface RideState {
  // State
  currentRide: Ride | null;
  incomingRequest: RideRequest | null;
  rideHistory: Ride[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  acceptRide: (rideId: string) => Promise<void>;
  arriving: (rideId: string) => Promise<void>;
  startRide: (rideId: string) => Promise<void>;
  finishRide: (rideId: string) => Promise<void>;
  confirmCashPayment: (rideId: string) => Promise<void>;
  loadHistory: () => Promise<void>;
  setIncomingRequest: (request: RideRequest | null) => void;
  setCurrentRide: (ride: Ride | null) => void;
  clearError: () => void;
}

// Convert API RideResponse to app Ride type
const convertRideResponse = (response: RideResponse): Ride => ({
  id: response.id,
  status: response.status as any,
  passenger: response.passenger ? {
    id: response.passenger.id,
    email: '',
    phone: response.passenger.user.phone,
    full_name: response.passenger.user.full_name,
    avatar_url: response.passenger.user.avatar_url,
    rating: response.passenger.rating,
    total_trips: response.passenger.total_trips,
  } : {} as any,
  driver: response.driver ? {
    id: response.driver.id,
    email: '',
    phone: response.driver.user.phone,
    full_name: response.driver.user.full_name,
    avatar_url: response.driver.user.avatar_url,
    document: '',
    rating: response.driver.rating,
    total_trips: response.driver.total_trips,
    status: 'active',
    online_status: 'online',
    vehicle: {
      id: '',
      type: response.driver.vehicle.type as any,
      model: response.driver.vehicle.model,
      color: response.driver.vehicle.color,
      plate: response.driver.vehicle.plate,
      year: 0,
      capacity: 0,
      preferences: [],
    },
    wallet: {
      available_balance: 0,
      locked_balance: 0,
      credit_balance: 0,
      earnings_today: 0,
      earnings_week: 0,
      earnings_month: 0,
    },
  } : undefined,
  pickup: {
    lat: response.origin.lat,
    lng: response.origin.lng,
    address: response.origin.address,
  },
  dropoff: {
    lat: response.destination.lat,
    lng: response.destination.lng,
    address: response.destination.address,
  },
  estimated_price: response.estimated_price,
  estimated_distance_km: response.estimated_distance_km,
  estimated_duration_min: response.estimated_duration_min,
  actual_price: response.actual_price,
  actual_distance_km: response.actual_distance_km,
  actual_duration_min: response.actual_duration_min,
  payment_method: response.payment_method as any,
  created_at: response.created_at,
  accepted_at: response.accepted_at,
  started_at: response.started_at,
  completed_at: response.completed_at,
  cancelled_at: response.cancelled_at,
});

export const useRideStore = create<RideState>((set, get) => ({
  // Initial state
  currentRide: null,
  incomingRequest: null,
  rideHistory: [],
  isLoading: false,
  error: null,
  
  // Accept ride
  acceptRide: async (rideId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await rideApi.accept(rideId);
      const ride = convertRideResponse(response);
      
      set({
        currentRide: ride,
        incomingRequest: null,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to accept ride',
        isLoading: false,
      });
      throw error;
    }
  },
  
  // Signal arrival
  arriving: async (rideId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await rideApi.arriving(rideId);
      const ride = convertRideResponse(response);
      
      set({
        currentRide: ride,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update status',
        isLoading: false,
      });
      throw error;
    }
  },
  
  // Start ride
  startRide: async (rideId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await rideApi.start(rideId);
      const ride = convertRideResponse(response);
      
      set({
        currentRide: ride,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to start ride',
        isLoading: false,
      });
      throw error;
    }
  },
  
  // Finish ride
  finishRide: async (rideId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await rideApi.finish(rideId);
      const ride = convertRideResponse(response);
      
      set({
        currentRide: ride,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to finish ride',
        isLoading: false,
      });
      throw error;
    }
  },
  
  // Confirm cash payment
  confirmCashPayment: async (rideId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await rideApi.confirmCashPayment(rideId);
      const ride = convertRideResponse(response);
      
      set({
        currentRide: ride,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to confirm payment',
        isLoading: false,
      });
      throw error;
    }
  },
  
  // Load ride history
  loadHistory: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await rideApi.getHistory();
      const rides = response.map(convertRideResponse);
      
      set({
        rideHistory: rides,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to load history',
        isLoading: false,
      });
      throw error;
    }
  },
  
  // Set incoming request (from WebSocket)
  setIncomingRequest: (request: RideRequest | null) => {
    set({ incomingRequest: request });
  },
  
  // Set current ride
  setCurrentRide: (ride: Ride | null) => {
    set({ currentRide: ride });
  },
  
  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
