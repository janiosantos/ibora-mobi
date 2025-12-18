import { apiClient } from './client';

export interface Ride {
    id: string;
    passenger_id: string;
    driver_id?: string;
    origin_address: string;
    destination_address: string;
    status: 'REQUESTED' | 'ACCEPTED' | 'DRIVER_ARRIVING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    estimated_price: number;
    final_price?: number;
    created_at: string;
}

export const rideApi = {
    acceptRide: async (rideId: string): Promise<Ride> => {
        return apiClient.post(`/rides/${rideId}/accept`);
    },

    driverArriving: async (rideId: string) => {
        return apiClient.post(`/rides/${rideId}/arriving`);
    },

    startRide: async (rideId: string) => {
        return apiClient.post(`/rides/${rideId}/start`);
    },

    finishRide: async (rideId: string) => {
        return apiClient.post(`/rides/${rideId}/finish`);
    },

    getRideHistory: async (params?: any) => {
        return apiClient.get('/rides/history', { params });
    }
};
