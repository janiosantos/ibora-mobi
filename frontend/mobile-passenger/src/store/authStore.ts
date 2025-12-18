import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/auth';

interface User {
    id: number;
    email: string;
    full_name: string;
    role: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    login: async (email: string, password: string) => {
        try {
            const response = await authApi.login({ email, password });

            await AsyncStorage.setItem('access_token', response.access_token);

            const user = await authApi.getProfile();

            set({
                user: user,
                isAuthenticated: true,
                isLoading: false
            });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        await AsyncStorage.removeItem('access_token');
        set({ user: null, isAuthenticated: false });
    },

    loadUser: async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');

            if (!token) {
                set({ isLoading: false });
                return;
            }

            const user = await authApi.getProfile();
            set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            await AsyncStorage.removeItem('access_token');
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },
}));
