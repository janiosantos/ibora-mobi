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
        // Note: Backend uses OAuth2FormRequest which expects form-data usually, 
        // but FastAPIs OAuth2PasswordRequestForm can also handle JSON if configured,
        // usually we send as x-www-form-urlencoded.
        // Let's assume the client needs to send form data for strict OAuth2 compliance 
        // OR the backend accepts JSON.
        // Given the backend tests use data={...}, it's form-encoded.

        // Transforming to form-urlencoded for /auth/login (standard FastAPI security)
        const body = `username=${encodeURIComponent(credentials.email)}&password=${encodeURIComponent(credentials.password)}`;

        // We need to bypass the JSON interceptor for this specific call potentially
        // Or just send as form data string with correct header
        return apiClient.post('/auth/login/access-token', body, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    },

    // Custom endpoint for JSON login if your backend supports it, 
    // otherwise we use the standard token endpoint above.

    async getProfile(): Promise<any> {
        return apiClient.get('/drivers/me');
    },
};
