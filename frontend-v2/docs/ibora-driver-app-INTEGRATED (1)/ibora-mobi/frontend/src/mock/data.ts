import {
  Driver,
  Passenger,
  Ride,
  RideRequest,
  Earnings,
  Incentive,
  Campaign,
  PartnerBenefit,
} from '../types';

// Mock Driver
export const mockDriver: Driver = {
  id: 'driver-1',
  email: 'motorista@ibora.com',
  phone: '+5533987654321',
  full_name: 'Carlos Silva',
  avatar_url: undefined,
  document: '123.456.789-00',
  rating: 4.8,
  total_trips: 1247,
  status: 'active',
  online_status: 'offline',
  current_location: {
    lat: -18.9186,
    lng: -41.5085,
    address: 'Teófilo Otoni, MG',
  },
  vehicle: {
    id: 'vehicle-1',
    type: 'taxi',
    model: 'Fiat Argo',
    color: 'Prata',
    plate: 'ABC-1234',
    year: 2022,
    capacity: 4,
    preferences: ['large-luggage', 'pets'],
  },
  wallet: {
    available_balance: 234.50,
    locked_balance: 150.00,
    credit_balance: 50.00,
    earnings_today: 0,
    earnings_week: 1250.00,
    earnings_month: 4580.00,
  },
};

// Mock Passengers
export const mockPassengers: Passenger[] = [
  {
    id: 'passenger-1',
    email: 'priya@example.com',
    phone: '+5533912345678',
    full_name: 'Priya',
    rating: 3.0,
    total_trips: 45,
  },
  {
    id: 'passenger-2',
    email: 'joao@example.com',
    phone: '+5533998765432',
    full_name: 'João Santos',
    rating: 4.5,
    total_trips: 120,
  },
];

// Mock Ride Requests
export const mockRideRequests: RideRequest[] = [
  {
    id: 'request-1',
    passenger: mockPassengers[0],
    pickup: {
      lat: -18.9186,
      lng: -41.5085,
      address: 'Lajamni Chowk, Surat, India',
    },
    dropoff: {
      lat: -18.9100,
      lng: -41.5000,
      address: 'AR Mall and Multiplex opp. panvelpoint, Mota Varachha, Surat',
    },
    estimated_price: 73.50,
    estimated_distance_km: 2.1,
    estimated_duration_min: 8,
    price_per_km: 35.00,
    payment_method: 'card',
    expires_at: new Date(Date.now() + 30000).toISOString(),
  },
];

// Mock Active Ride
export const mockActiveRide: Ride = {
  id: 'ride-1',
  status: 'accepted',
  passenger: mockPassengers[0],
  driver: mockDriver,
  pickup: {
    lat: -18.9186,
    lng: -41.5085,
    address: 'Lajamni Chowk, Surat, India',
  },
  dropoff: {
    lat: -18.9100,
    lng: -41.5000,
    address: 'AR Mall and Multiplex, Mota Varachha',
  },
  estimated_price: 73.50,
  estimated_distance_km: 2.1,
  estimated_duration_min: 8,
  payment_method: 'card',
  created_at: new Date(Date.now() - 120000).toISOString(),
  accepted_at: new Date(Date.now() - 60000).toISOString(),
};

// Mock Completed Rides
export const mockCompletedRides: Ride[] = [
  {
    id: 'ride-250',
    status: 'completed',
    passenger: mockPassengers[0],
    driver: mockDriver,
    pickup: {
      lat: -18.9186,
      lng: -41.5085,
      address: 'Lajamni Chowk, Surat, India',
    },
    dropoff: {
      lat: -18.9100,
      lng: -41.5000,
      address: 'AR Mall and Multiplex opp. panvelpoint, Mot...',
    },
    estimated_price: 73.50,
    estimated_distance_km: 2.1,
    estimated_duration_min: 8,
    actual_price: 106.95,
    actual_distance_km: 2.3,
    actual_duration_min: 12,
    payment_method: 'card',
    created_at: '2024-11-19T06:17:00Z',
    accepted_at: '2024-11-19T06:17:30Z',
    started_at: '2024-11-19T06:18:00Z',
    completed_at: '2024-11-19T06:30:00Z',
  },
];

// Mock Earnings
export const mockEarnings: Earnings = {
  period: 'today',
  total_earnings: 106.95,
  total_rides: 1,
  total_hours: 0.02,
  avg_per_ride: 106.95,
  tips: 0,
  recent_rides: [
    {
      id: 'ride-250',
      completed_at: '2024-11-19T06:30:00Z',
      origin_address: 'Lajamni Chowk, Surat, India',
      destination_address: 'AR Mall and Multiplex, opp. panvelpoint, Mot...',
      actual_distance_km: 2.3,
      actual_duration_min: 12,
      final_price: 106.95,
      tip: 0,
    },
  ],
};

// Mock Incentives
export const mockIncentives: Incentive[] = [
  {
    id: 'incentive-1',
    campaign_id: 'campaign-1',
    name: 'Motorista Ouro',
    type: 'discount',
    value: 3,
    status: 'active',
    valid_from: new Date(Date.now() - 86400000 * 5).toISOString(),
    valid_until: new Date(Date.now() + 86400000 * 25).toISOString(),
    description: 'Comissão reduzida em 3% por 30 dias',
  },
  {
    id: 'incentive-2',
    campaign_id: 'campaign-2',
    name: 'Bônus de Meta',
    type: 'bonus',
    value: 200,
    status: 'pending',
    valid_from: new Date().toISOString(),
    valid_until: new Date(Date.now() + 86400000 * 7).toISOString(),
    description: 'Bônus de R$ 200 ao bater meta mensal',
  },
];

// Mock Campaigns
export const mockCampaigns: Campaign[] = [
  {
    id: 'campaign-1',
    name: 'Motorista Ouro',
    type: 'DISCOUNT',
    description: 'Qualidade operacional',
    rules: {
      accept_rate: 0.9,
      completion_rate: 0.95,
      min_rides: 50,
    },
    start_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    end_at: new Date(Date.now() + 86400000 * 60).toISOString(),
    status: 'active',
  },
  {
    id: 'campaign-2',
    name: 'Top Caixa',
    type: 'BONUS',
    description: 'Faturamento mensal',
    rules: {
      gross_revenue: 5000,
      min_rides: 100,
    },
    start_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    end_at: new Date(Date.now() + 86400000 * 45).toISOString(),
    status: 'active',
  },
];

// Mock Partner Benefits
export const mockPartnerBenefits: PartnerBenefit[] = [
  {
    id: 'benefit-1',
    partner_name: 'Posto Ipiranga',
    benefit_type: 'fuel',
    discount_value: 15,
    description: '15% de desconto em combustível',
    valid_until: new Date(Date.now() + 86400000 * 90).toISOString(),
  },
  {
    id: 'benefit-2',
    partner_name: 'AutoPeças Pro',
    benefit_type: 'parts',
    discount_value: 20,
    description: '20% de desconto em autopeças',
    valid_until: new Date(Date.now() + 86400000 * 60).toISOString(),
  },
];

// Mock data export
export const mockData = {
  driver: mockDriver,
  passengers: mockPassengers,
  rideRequests: mockRideRequests,
  activeRide: mockActiveRide,
  completedRides: mockCompletedRides,
  earnings: mockEarnings,
  incentives: mockIncentives,
  campaigns: mockCampaigns,
  partnerBenefits: mockPartnerBenefits,
};
