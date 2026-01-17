/**
 * Rides API Service
 * Ride requests, updates, and history
 */

import { apiClient } from './client';
import { ENDPOINTS } from './config';
import type { Ride, Location } from '../types';

// Request/Response Types
export interface EstimateRequest {
  origin: {
    lat: number;
    lng: number;
  };
  destination: {
    lat: number;
    lng: number;
  };
}

export interface EstimateResponse {
  estimated_price: number;
  estimated_distance_km: number;
  estimated_duration_min: number;
  price_per_km: number;
}

export interface RideHistoryParams {
  status?: string;
  from_date?: string;
  to_date?: string;
  limit?: number;
  offset?: number;
}

export interface RideResponse {
  id: string;
  status: string;
  passenger_id: string;
  driver_id?: string;
  origin: {
    lat: number;
    lng: number;
    address: string;
  };
  destination: {
    lat: number;
    lng: number;
    address: string;
  };
  estimated_price: number;
  estimated_distance_km: number;
  estimated_duration_min: number;
  actual_price?: number;
  actual_distance_km?: number;
  actual_duration_min?: number;
  payment_method: string;
  created_at: string;
  accepted_at?: string;
  started_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  passenger?: {
    id: string;
    user: {
      full_name: string;
      phone: string;
      avatar_url?: string;
    };
    rating: number;
    total_trips: number;
  };
  driver?: {
    id: string;
    user: {
      full_name: string;
      phone: string;
      avatar_url?: string;
    };
    rating: number;
    total_trips: number;
    vehicle: {
      type: string;
      model: string;
      color: string;
      plate: string;
    };
  };
}

export const rideApi = {
  /**
   * Get ride history
   * GET /rides/history
   */
  async getHistory(params?: RideHistoryParams): Promise<RideResponse[]> {
    return apiClient.get(ENDPOINTS.RIDES.HISTORY, { params });
  },

  /**
   * Get price/distance estimate
   * POST /rides/estimate
   */
  async estimate(data: EstimateRequest): Promise<EstimateResponse> {
    return apiClient.post(ENDPOINTS.RIDES.ESTIMATE, data);
  },

  /**
   * Accept a ride request (Driver only)
   * POST /rides/{ride_id}/accept
   */
  async accept(rideId: string): Promise<RideResponse> {
    return apiClient.post(ENDPOINTS.RIDES.ACCEPT(rideId));
  },

  /**
   * Signal arrival at pickup location (Driver only)
   * POST /rides/{ride_id}/arriving
   */
  async arriving(rideId: string): Promise<RideResponse> {
    return apiClient.post(ENDPOINTS.RIDES.ARRIVING(rideId));
  },

  /**
   * Start the ride (passenger onboard)
   * POST /rides/{ride_id}/start
   */
  async start(rideId: string): Promise<RideResponse> {
    return apiClient.post(ENDPOINTS.RIDES.START(rideId));
  },

  /**
   * Finish the ride (destination reached)
   * POST /rides/{ride_id}/finish
   */
  async finish(rideId: string): Promise<RideResponse> {
    return apiClient.post(ENDPOINTS.RIDES.FINISH(rideId));
  },

  /**
   * Confirm receipt of cash payment (Driver only)
   * POST /rides/{ride_id}/confirm-cash-payment
   */
  async confirmCashPayment(rideId: string): Promise<RideResponse> {
    return apiClient.post(ENDPOINTS.RIDES.CONFIRM_CASH(rideId));
  },
};
