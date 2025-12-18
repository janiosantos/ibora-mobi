import { apiClient } from './client';

export interface NearbyDriver {
    id: string;
    latitude: number;
    longitude: number;
    distance_km: number;
    vehicle_model?: string;
    vehicle_plate?: string;
    heading?: number; // Optional, assumed 0 if missing
}

export const driverApi = {
    async getNearbyDrivers(lat: number, lng: number, radius_km: number = 2.0): Promise<NearbyDriver[]> {
        return apiClient.get(`/passengers/drivers/nearby`, {
            params: {
                latitude: lat,
                longitude: lng,
                radius: radius_km
            }
        });
    }
};
