import { apiClient } from './client';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    user: {
        id: number;
        email: string;
        full_name: string;
        role: string;
    };
}

export const authApi = {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const body = `username=${encodeURIComponent(credentials.email)}&password=${encodeURIComponent(credentials.password)}`;

        return apiClient.post('/auth/login/access-token', body, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    },

    async getProfile(): Promise<any> {
        return apiClient.get('/passengers/me');
    },
};
