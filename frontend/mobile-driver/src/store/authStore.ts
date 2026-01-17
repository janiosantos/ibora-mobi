import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
    user: any | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    login: async (data) => {
        set({ isLoading: true, error: null });
        try {
            // Import api here to avoid circular dev cycle issues if any (though unlikely here)
            const { authApi } = require('../api/auth');

            // 1. Get Token
            const response = await authApi.login(data);
            const { access_token } = response;

            // 2. Get User Profile (Backend doesn't return full user on login usually, needs fetch)
            // But let's check authApi.login return type. It returns user object if modified?
            // The interface says it returns user. Let's assume backend might or we fetch 'me'.
            // Actually standard OAuth returns access_token. Let's fetch /me.

            // Store token first to allow requests
            await AsyncStorage.setItem('driver_token', access_token);

            // We need to set the token in client or just rely on storage? 
            // Better to set it in state immediately.
            set({ token: access_token });

            // 3. Fetch Profile
            const driver = await authApi.getProfile();

            await AsyncStorage.setItem('driver_user', JSON.stringify(driver));

            set({
                user: driver,
                isAuthenticated: true,
                isLoading: false
            });

        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.detail || 'Erro ao realizar login';
            set({ error: msg, isLoading: false });
            throw error;
        }
    },
    register: async (data) => {
        // Implementation for register
    },
    logout: async () => {
        await AsyncStorage.removeItem('driver_token');
        await AsyncStorage.removeItem('driver_user');
        set({ user: null, token: null, isAuthenticated: false });
    },
    loadUser: async () => {
        set({ isLoading: true });
        try {
            const token = await AsyncStorage.getItem('driver_token');
            const userStr = await AsyncStorage.getItem('driver_user');

            if (token && userStr) {
                set({
                    token,
                    user: JSON.parse(userStr),
                    isAuthenticated: true
                });
            }
        } catch (e) {
            console.error('Failed to load user', e);
        } finally {
            set({ isLoading: false });
        }
    }
}));
