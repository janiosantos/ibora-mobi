/**
 * API Configuration
 * Base URLs and common settings for API requests
 */

// Environment-based API URL
export const API_CONFIG = {
  // Development
  DEV: {
    BASE_URL: 'http://localhost:8000/api/v1',
    WS_URL: 'ws://localhost:8000/api/v1/ws',
    TIMEOUT: 30000,
  },
  
  // Production
  PROD: {
    BASE_URL: 'https://api.ibora.app/api/v1',
    WS_URL: 'wss://api.ibora.app/api/v1/ws',
    TIMEOUT: 30000,
  },
};

// Get current environment config
const ENV = __DEV__ ? 'DEV' : 'PROD';
export const API_BASE_URL = API_CONFIG[ENV].BASE_URL;
export const WS_URL = API_CONFIG[ENV].WS_URL;
export const API_TIMEOUT = API_CONFIG[ENV].TIMEOUT;

// API Endpoints
export const ENDPOINTS = {
  // Auth
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login/access-token',
  },
  
  // Drivers
  DRIVERS: {
    CREATE: '/drivers',
    ME: '/drivers/me',
    UPDATE_PROFILE: '/drivers/me/profile',
    UPDATE_STATUS: '/drivers/me/status',
    UPDATE_LOCATION: '/drivers/me/location',
  },
  
  // Rides
  RIDES: {
    HISTORY: '/rides/history',
    ESTIMATE: '/rides/estimate',
    REQUEST: '/rides/request',
    ACCEPT: (rideId: string) => `/rides/${rideId}/accept`,
    ARRIVING: (rideId: string) => `/rides/${rideId}/arriving`,
    START: (rideId: string) => `/rides/${rideId}/start`,
    FINISH: (rideId: string) => `/rides/${rideId}/finish`,
    CONFIRM_CASH: (rideId: string) => `/rides/${rideId}/confirm-cash-payment`,
  },
  
  // Wallet
  WALLET: {
    BALANCE: '/wallet/drivers/me/wallet',
    WITHDRAW: '/wallet/drivers/me/withdrawals',
    TRANSACTIONS: '/wallet/drivers/me/wallet/transactions',
  },
};

// HTTP Headers
export const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// OAuth2 Login Form Data
export const createOAuth2FormData = (username: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  formData.append('grant_type', 'password');
  return formData;
};
