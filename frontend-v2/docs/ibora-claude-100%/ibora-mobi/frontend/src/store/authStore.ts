/**
 * Auth Store
 * Global state for authentication
 */

import { create } from 'zustand';
import { authApi, driverApi } from '../api';
import type { Driver } from '../types';
import type { DriverResponse } from '../api/driver';

interface AuthState {
  // State
  isAuthenticated: boolean;
  isLoading: boolean;
  driver: Driver | null;
  error: string | null;
  
  // Actions
  login: (username: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  loadDriver: () => Promise<void>;
  setDriver: (driver: Driver | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  isAuthenticated: false,
  isLoading: false,
  driver: null,
  error: null,
  
  // Login
  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Login and get token
      await authApi.login({ username, password });
      
      // Load driver profile
      const driverResponse = await driverApi.getMe();
      
      // Convert API response to app Driver type
      const driver: Driver = {
        id: driverResponse.id,
        email: driverResponse.user.email,
        phone: driverResponse.user.phone,
        full_name: driverResponse.user.full_name,
        avatar_url: driverResponse.user.avatar_url,
        document: driverResponse.document,
        rating: driverResponse.rating,
        total_trips: driverResponse.total_trips,
        status: 'active',
        online_status: driverResponse.status === 'ONLINE' ? 'online' : 'offline',
        current_location: driverResponse.current_location,
        vehicle: {
          id: driverResponse.vehicle.id,
          type: driverResponse.vehicle.type as any,
          model: driverResponse.vehicle.model,
          color: driverResponse.vehicle.color,
          plate: driverResponse.vehicle.plate,
          year: driverResponse.vehicle.year,
          capacity: driverResponse.vehicle.capacity,
          photo_url: driverResponse.vehicle.photo_url,
          preferences: [], // Not in backend yet
        },
        wallet: {
          available_balance: 0,
          locked_balance: 0,
          credit_balance: 0,
          earnings_today: 0,
          earnings_week: 0,
          earnings_month: 0,
        },
      };
      
      set({
        isAuthenticated: true,
        driver,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },
  
  // Signup
  signup: async (data: any) => {
    set({ isLoading: true, error: null });
    
    try {
      await authApi.signup(data);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Signup failed',
        isLoading: false,
      });
      throw error;
    }
  },
  
  // Logout
  logout: async () => {
    await authApi.logout();
    set({
      isAuthenticated: false,
      driver: null,
      error: null,
    });
  },
  
  // Load driver profile
  loadDriver: async () => {
    set({ isLoading: true });
    
    try {
      const driverResponse = await driverApi.getMe();
      
      // Convert to app Driver type
      const driver: Driver = {
        id: driverResponse.id,
        email: driverResponse.user.email,
        phone: driverResponse.user.phone,
        full_name: driverResponse.user.full_name,
        avatar_url: driverResponse.user.avatar_url,
        document: driverResponse.document,
        rating: driverResponse.rating,
        total_trips: driverResponse.total_trips,
        status: 'active',
        online_status: driverResponse.status === 'ONLINE' ? 'online' : 'offline',
        current_location: driverResponse.current_location,
        vehicle: {
          id: driverResponse.vehicle.id,
          type: driverResponse.vehicle.type as any,
          model: driverResponse.vehicle.model,
          color: driverResponse.vehicle.color,
          plate: driverResponse.vehicle.plate,
          year: driverResponse.vehicle.year,
          capacity: driverResponse.vehicle.capacity,
          photo_url: driverResponse.vehicle.photo_url,
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
      };
      
      set({
        isAuthenticated: true,
        driver,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  // Set driver
  setDriver: (driver: Driver | null) => {
    set({ driver });
  },
  
  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
