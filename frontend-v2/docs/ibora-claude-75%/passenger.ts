/**
 * Passenger App Types
 * TypeScript interfaces for passenger-specific features
 */

import type { User, Location, Driver, Ride } from './index';

// Vehicle Types
export type VehicleType = 
  | 'bike' 
  | 'auto' 
  | 'taxi' 
  | 'hover-board' 
  | 'prime-sedan'
  | 'prime-suv';

export interface VehicleOption {
  id: VehicleType;
  name: string;
  icon: string; // emoji or icon name
  priceMultiplier: number; // 1.0 = base price
  estimatedTime: string;
  capacity: number;
}

// Passenger Profile
export interface Passenger extends User {
  rating: number;
  total_trips: number;
  favorite_locations?: SavedLocation[];
  payment_methods?: PaymentMethod[];
  wallet_balance?: number;
}

// Saved Locations
export interface SavedLocation {
  id: string;
  label: string; // "Home", "Work", etc
  address: string;
  location: Location;
  icon?: string;
}

// Ride Request
export interface RideRequest {
  pickup: Location;
  dropoff: Location;
  stops?: Location[]; // Multiple stops
  vehicle_type: VehicleType;
  payment_method: 'wallet' | 'card' | 'cash' | 'qr' | 'bank';
  offered_price?: number; // If passenger wants to set custom price
  coupon_code?: string;
  auto_book_nearest?: boolean;
  special_instructions?: string;
}

// Ride Estimate
export interface RideEstimate {
  vehicle_type: VehicleType;
  estimated_price: number;
  estimated_distance_km: number;
  estimated_duration_min: number;
  price_per_km: number;
  surge_multiplier?: number;
}

// Coupon
export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_amount: number;
  max_discount?: number;
  expires_at: string;
  is_active: boolean;
  terms?: string;
}

// Payment Method
export interface PaymentMethod {
  id: string;
  type: 'wallet' | 'card' | 'cash' | 'qr' | 'bank';
  name: string;
  description: string;
  icon: string;
  is_default?: boolean;
  // Card specific
  card_last_four?: string;
  card_brand?: string;
  // Bank specific
  account_number?: string;
  bank_name?: string;
}

// Driver Match (when ride is accepted)
export interface DriverMatch {
  driver: Driver;
  ride: Ride;
  estimated_arrival_min: number;
  pickup_pin?: string; // 4-6 digit PIN for verification
  current_location?: Location;
  distance_to_pickup_km?: number;
}

// Trip Status for Passenger
export type PassengerTripStatus = 
  | 'requesting' // Searching for driver
  | 'driver_assigned' // Driver accepted
  | 'driver_arriving' // Driver on the way to pickup
  | 'driver_arrived' // Driver at pickup
  | 'in_progress' // Trip started
  | 'completed' // Trip finished
  | 'cancelled';

// Ride Breakdown (for payment screen)
export interface RideBreakdown {
  base_fare: number;
  distance_charge: number;
  time_charge: number;
  surge_charge?: number;
  platform_fee: number;
  discount?: number;
  taxes: number;
  total: number;
}

// Rating Data
export interface DriverRating {
  ride_id: string;
  driver_id: string;
  rating: number; // 1-5
  tags?: string[]; // ["Comfortable ride", "Professional", etc]
  comment?: string;
}

// Notification Settings
export interface NotificationPreferences {
  ride_updates: boolean;
  offers_and_news: boolean;
  driver_messages: boolean;
}

// Passenger State (for store)
export interface PassengerState {
  passenger: Passenger | null;
  currentRideRequest: RideRequest | null;
  currentRide: Ride | null;
  driverMatch: DriverMatch | null;
  rideEstimates: RideEstimate[];
  availableCoupons: Coupon[];
  appliedCoupon: Coupon | null;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
}
