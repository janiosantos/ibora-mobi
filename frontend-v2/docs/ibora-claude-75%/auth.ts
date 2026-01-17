/**
 * Auth API Service
 * Authentication and authorization endpoints
 */

import { apiClient } from './client';
import { ENDPOINTS, createOAuth2FormData } from './config';
import type { Driver, User } from '../types';

// Request/Response Types
export interface SignupRequest {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  role: 'passenger' | 'driver';
}

export interface SignupResponse {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
}

export interface LoginRequest {
  username: string; // email or phone
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  // Note: refresh_token not in current backend, but we'll support it
  refresh_token?: string;
}

export const authApi = {
  /**
   * Create new account (Passenger or Driver)
   * POST /auth/signup
   */
  async signup(data: SignupRequest): Promise<SignupResponse> {
    return apiClient.post(ENDPOINTS.AUTH.SIGNUP, data);
  },

  /**
   * Login with email/phone and password (OAuth2)
   * POST /auth/login/access-token
   * Returns JWT access token
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const formData = createOAuth2FormData(
      credentials.username,
      credentials.password
    );
    
    const response = await apiClient.postFormData<LoginResponse>(
      ENDPOINTS.AUTH.LOGIN,
      formData
    );
    
    // Save token
    await apiClient.saveToken(response.access_token, response.refresh_token);
    
    return response;
  },

  /**
   * Logout - clear tokens
   */
  async logout(): Promise<void> {
    await apiClient.clearTokens();
  },
};
