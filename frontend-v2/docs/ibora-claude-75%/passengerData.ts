/**
 * Mock Data - Passenger
 * Mock data for passenger app testing and development
 */

import type {
  Passenger,
  VehicleOption,
  Coupon,
  PaymentMethod,
  RideEstimate,
  SavedLocation,
} from '../types/passenger';

// Mock Passenger
export const mockPassenger: Passenger = {
  id: 'pass-1',
  email: 'joao.silva@email.com',
  phone: '+5533987654321',
  full_name: 'João Silva',
  avatar_url: 'https://i.pravatar.cc/150?img=12',
  rating: 4.7,
  total_trips: 89,
  wallet_balance: 150.00,
};

// Vehicle Options
export const mockVehicleOptions: VehicleOption[] = [
  {
    id: 'bike',
    name: 'Bike',
    icon: '🏍️',
    priceMultiplier: 0.8,
    estimatedTime: '5-8 min',
    capacity: 1,
  },
  {
    id: 'auto',
    name: 'Auto',
    icon: '🛺',
    priceMultiplier: 1.0,
    estimatedTime: '6-10 min',
    capacity: 3,
  },
  {
    id: 'taxi',
    name: 'Taxi',
    icon: '🚕',
    priceMultiplier: 1.2,
    estimatedTime: '8-12 min',
    capacity: 4,
  },
  {
    id: 'hover-board',
    name: 'Hover Board',
    icon: '🛹',
    priceMultiplier: 0.9,
    estimatedTime: '4-7 min',
    capacity: 1,
  },
  {
    id: 'prime-sedan',
    name: 'Prime Sedan',
    icon: '🚗',
    priceMultiplier: 1.5,
    estimatedTime: '10-15 min',
    capacity: 4,
  },
];

// Saved Locations
export const mockSavedLocations: SavedLocation[] = [
  {
    id: 'loc-1',
    label: 'Home',
    address: 'Rua das Flores, 123 - Centro',
    location: {
      lat: -18.9186,
      lng: -41.5085,
      address: 'Rua das Flores, 123 - Centro',
    },
    icon: '🏠',
  },
  {
    id: 'loc-2',
    label: 'Work',
    address: 'Av. Getúlio Vargas, 456 - Centro',
    location: {
      lat: -18.9100,
      lng: -41.5000,
      address: 'Av. Getúlio Vargas, 456 - Centro',
    },
    icon: '💼',
  },
];

// Coupons
export const mockCoupons: Coupon[] = [
  {
    id: 'coup-1',
    code: 'F5PE6T',
    title: 'test',
    description: 'Delivery 50% off',
    discount_type: 'percentage',
    discount_value: 50,
    min_amount: 50,
    max_discount: 25,
    expires_at: '2024-12-31',
    is_active: true,
  },
  {
    id: 'coup-2',
    code: 'S28TVE',
    title: 'yearly',
    description: 'Up to 10% off',
    discount_type: 'fixed',
    discount_value: 10,
    min_amount: 100,
    expires_at: '2025-08-31',
    is_active: true,
  },
  {
    id: 'coup-3',
    code: 'FIRST20',
    title: 'First Ride',
    description: '20% off your first ride',
    discount_type: 'percentage',
    discount_value: 20,
    min_amount: 30,
    max_discount: 15,
    expires_at: '2025-12-31',
    is_active: true,
  },
];

// Payment Methods
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'wallet',
    type: 'wallet',
    name: 'My Wallet',
    description: '$100.0',
    icon: '💳',
    is_default: false,
  },
  {
    id: 'card',
    type: 'card',
    name: 'Card, pay with USSD, pay with bank, pay with barter',
    description: 'Credit/Debit card',
    icon: '💳',
    is_default: false,
  },
  {
    id: 'cash',
    type: 'cash',
    name: 'Cash',
    description: 'Cash pay',
    icon: '💵',
    is_default: true,
  },
  {
    id: 'qr',
    type: 'qr',
    name: 'Pay with QR Code',
    description: 'Pay with QR Code pay',
    icon: '📱',
    is_default: false,
  },
  {
    id: 'bank',
    type: 'bank',
    name: 'Bank Account',
    description: 'Card, pay with USSD, pay with bank, pay with barter',
    icon: '🏦',
    is_default: false,
  },
];

// Ride Estimates
export const mockRideEstimates: RideEstimate[] = [
  {
    vehicle_type: 'bike',
    estimated_price: 18.50,
    estimated_distance_km: 3.2,
    estimated_duration_min: 12,
    price_per_km: 5.78,
  },
  {
    vehicle_type: 'auto',
    estimated_price: 23.00,
    estimated_distance_km: 3.2,
    estimated_duration_min: 14,
    price_per_km: 7.19,
  },
  {
    vehicle_type: 'taxi',
    estimated_price: 27.60,
    estimated_distance_km: 3.2,
    estimated_duration_min: 15,
    price_per_km: 8.63,
  },
  {
    vehicle_type: 'hover-board',
    estimated_price: 20.70,
    estimated_distance_km: 3.2,
    estimated_duration_min: 10,
    price_per_km: 6.47,
  },
  {
    vehicle_type: 'prime-sedan',
    estimated_price: 34.50,
    estimated_distance_km: 3.2,
    estimated_duration_min: 18,
    price_per_km: 10.78,
  },
];

// Mock Driver (for driver on the way)
export const mockDriver = {
  id: 'drv-1',
  user: {
    full_name: 'Raju Khatri',
    phone: '+5533912345678',
    avatar_url: 'https://i.pravatar.cc/150?img=33',
  },
  rating: 4.8,
  total_trips: 1247,
  vehicle: {
    type: 'bike',
    model: 'Honda CG 160',
    color: 'Vermelha',
    plate: 'ABC-1234',
  },
};
