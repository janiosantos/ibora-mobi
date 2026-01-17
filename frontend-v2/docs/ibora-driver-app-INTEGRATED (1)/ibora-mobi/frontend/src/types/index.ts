// Domain types for iBora Driver App

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface User {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  avatar_url?: string;
}

export interface Driver extends User {
  document: string;
  vehicle: Vehicle;
  rating: number;
  total_trips: number;
  status: DriverStatus;
  online_status: 'online' | 'offline' | 'busy';
  current_location?: Location;
  wallet: DriverWallet;
}

export interface Vehicle {
  id: string;
  type: VehicleType;
  model: string;
  color: string;
  plate: string;
  year: number;
  capacity: number;
  photo_url?: string;
  preferences: VehiclePreference[];
}

export type VehicleType = 'bike' | 'auto' | 'taxi' | 'hover-board' | 'prime-sedan' | 'prime-suv';

export type VehiclePreference = 
  | 'large-luggage' 
  | 'winter-tires' 
  | 'skis-snowboards' 
  | 'bikes' 
  | 'pets';

export type DriverStatus = 
  | 'pending_approval'
  | 'active'
  | 'suspended'
  | 'inactive';

export interface DriverWallet {
  available_balance: number;
  locked_balance: number;
  credit_balance: number;
  earnings_today: number;
  earnings_week: number;
  earnings_month: number;
}

export interface Passenger extends User {
  rating: number;
  total_trips: number;
}

export interface Ride {
  id: string;
  status: RideStatus;
  passenger: Passenger;
  driver?: Driver;
  pickup: Location;
  dropoff: Location;
  estimated_price: number;
  estimated_distance_km: number;
  estimated_duration_min: number;
  actual_price?: number;
  actual_distance_km?: number;
  actual_duration_min?: number;
  payment_method: PaymentMethod;
  created_at: string;
  accepted_at?: string;
  started_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
}

export type RideStatus = 
  | 'requested'
  | 'accepted'
  | 'driver_arriving'
  | 'driver_arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PaymentMethod = 'pix' | 'card' | 'cash';

export interface RideRequest {
  id: string;
  passenger: Passenger;
  pickup: Location;
  dropoff: Location;
  estimated_price: number;
  estimated_distance_km: number;
  estimated_duration_min: number;
  price_per_km: number;
  payment_method: PaymentMethod;
  expires_at: string;
}

export interface Earnings {
  period: 'today' | 'week' | 'month';
  total_earnings: number;
  total_rides: number;
  total_hours: number;
  avg_per_ride: number;
  tips: number;
  recent_rides: EarningRide[];
}

export interface EarningRide {
  id: string;
  completed_at: string;
  origin_address: string;
  destination_address: string;
  actual_distance_km: number;
  actual_duration_min: number;
  final_price: number;
  tip?: number;
}

export interface Rating {
  id: string;
  ride_id: string;
  rating: number;
  comment?: string;
  tags: string[];
  created_at: string;
}

export interface Incentive {
  id: string;
  campaign_id: string;
  name: string;
  type: 'discount' | 'bonus' | 'free_usage' | 'partner';
  value: number;
  status: 'pending' | 'active' | 'expired' | 'consumed';
  valid_from: string;
  valid_until: string;
  description: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'DISCOUNT' | 'BONUS' | 'FREE_USAGE' | 'PARTNER';
  description: string;
  rules: Record<string, any>;
  start_at: string;
  end_at: string;
  status: 'active' | 'inactive' | 'expired';
}

export interface DriverMetrics {
  period_type: 'daily' | 'weekly' | 'monthly';
  accept_rate: number;
  completion_rate: number;
  cancel_rate: number;
  total_km: number;
  total_rides: number;
  gross_revenue: number;
  net_revenue: number;
  active_days: number;
}

export interface PartnerBenefit {
  id: string;
  partner_name: string;
  benefit_type: 'fuel' | 'parts' | 'service' | 'food';
  discount_value: number;
  description: string;
  valid_until: string;
}

// Auth types
export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: Driver;
}

export interface OTPRequest {
  phone: string;
}

export interface OTPVerification {
  phone: string;
  otp_code: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
}
