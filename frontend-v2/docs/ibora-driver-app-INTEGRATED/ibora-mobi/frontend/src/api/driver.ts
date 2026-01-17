/**
 * Driver API Service
 * Driver profile, status, and location endpoints
 */

import { apiClient } from './client';
import { ENDPOINTS } from './config';
import type { Driver, Vehicle, Location } from '../types';

// Request/Response Types
export interface CreateDriverRequest {
  // Driver info
  document: string;
  
  // Vehicle info
  vehicle: {
    type: string;
    model: string;
    color: string;
    plate: string;
    year: number;
    capacity: number;
    photo_url?: string;
  };
}

export interface UpdateDriverProfileRequest {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
}

export interface UpdateStatusRequest {
  status: 'ONLINE' | 'OFFLINE';
}

export interface UpdateLocationRequest {
  lat: number;
  lon: number;
}

export interface DriverResponse {
  id: string;
  user_id: string;
  document: string;
  rating: number;
  total_trips: number;
  status: 'ONLINE' | 'OFFLINE' | 'BUSY';
  current_location?: {
    lat: number;
    lng: number;
  };
  vehicle: {
    id: string;
    type: string;
    model: string;
    color: string;
    plate: string;
    year: number;
    capacity: number;
    photo_url?: string;
  };
  user: {
    id: string;
    email: string;
    phone: string;
    full_name: string;
    avatar_url?: string;
  };
}

export const driverApi = {
  /**
   * Create driver profile and vehicle
   * POST /drivers
   */
  async create(data: CreateDriverRequest): Promise<DriverResponse> {
    return apiClient.post(ENDPOINTS.DRIVERS.CREATE, data);
  },

  /**
   * Get current driver profile (includes vehicle)
   * GET /drivers/me
   */
  async getMe(): Promise<DriverResponse> {
    return apiClient.get(ENDPOINTS.DRIVERS.ME);
  },

  /**
   * Update driver profile details
   * PUT /drivers/me/profile
   */
  async updateProfile(data: UpdateDriverProfileRequest): Promise<DriverResponse> {
    return apiClient.put(ENDPOINTS.DRIVERS.UPDATE_PROFILE, data);
  },

  /**
   * Update online status (ONLINE or OFFLINE)
   * POST /drivers/me/status
   */
  async updateStatus(status: 'ONLINE' | 'OFFLINE'): Promise<{ status: string }> {
    return apiClient.post(ENDPOINTS.DRIVERS.UPDATE_STATUS, { status });
  },

  /**
   * Update GPS location
   * POST /drivers/me/location
   */
  async updateLocation(lat: number, lon: number): Promise<{ message: string }> {
    return apiClient.post(ENDPOINTS.DRIVERS.UPDATE_LOCATION, { lat, lon });
  },
};
