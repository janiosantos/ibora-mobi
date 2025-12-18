import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Default to Android Emulator IP, can be overridden
// Hard-coding LAN IP for physical device testing
import Constants from 'expo-constants';

const getBaseUrl = () => {
    // If running in Expo Go, try to get the host IP dynamically
    if (Constants.expoConfig?.hostUri) {
        const host = Constants.expoConfig.hostUri.split(':')[0];
        // If using Expo Tunnel (ngrok/admin), the backend is NOT on that tunnel + port 8000.
        // We must use the LAN IP in that case.
        if (!host.includes('exp.direct') && !host.includes('ngrok') && !host.includes('tunnel')) {
            return `http://${host}:8000/api/v1`;
        }
    }
    // Fallback for Emulator or if constant is missing or using Tunnel
    // Hardcoded to current host IP: 192.168.223.21
    return 'http://192.168.223.21:8000/api/v1';
};

const API_BASE_URL = getBaseUrl();

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor - add auth token
        this.client.interceptors.request.use(
            async (config) => {
                const token = await AsyncStorage.getItem('access_token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor - handle errors
        this.client.interceptors.response.use(
            (response) => response,
            async (error) => {
                // Here we could handle 401 token refresh if implemented
                return Promise.reject(error);
            }
        );
    }

    async get<T>(url: string, config?: AxiosRequestConfig) {
        const response = await this.client.get<T>(url, config);
        return response.data;
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
        const response = await this.client.post<T>(url, data, config);
        return response.data;
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
        const response = await this.client.put<T>(url, data, config);
        return response.data;
    }

    async delete<T>(url: string, config?: AxiosRequestConfig) {
        const response = await this.client.delete<T>(url, config);
        return response.data;
    }
}

export const apiClient = new ApiClient();
