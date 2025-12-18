import { apiClient } from './client';

export interface RideEstimate {
    estimated_price: number;
    distance_km: number;
    duration_min: number;
    route_polyline: string;
}

export interface Ride {
    id: string;
    status: string;
    driver_id?: string;
    estimated_price: number;
    created_at: string;
}

export const rideApi = {
    estimate: async (origin: string, destination: string): Promise<RideEstimate> => {
        return apiClient.post('/rides/estimate', {
            origin_address: origin,
            destination_address: destination,
            service_type: 'standard' // Default
        });
    },

    request: async (origin: string, destination: string, price: number, distance: number): Promise<Ride> => {
        return apiClient.post('/rides/request', {
            origin_address: origin,
            destination_address: destination,
            estimated_price: price,
            distance_km: distance,
            payment_method: 'cash' // Default for MVP, can update later
        });
    },

    getRide: async (rideId: string): Promise<Ride> => {
        // We lack a direct GET /rides/{id} in my memory, but usually history or detail endpoint exists
        // If not, we rely on history or socket updates.
        // Let's assume there is one or we use history filtered.
        // Actually, let's use the history endpoint for now or just rely on socket.
        throw new Error('Get Ride Endpoint not verified yet');
    }
};
