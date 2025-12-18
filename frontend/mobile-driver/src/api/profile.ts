import { apiClient } from './client';

export interface Profile {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    photo_url?: string;
    vehicle_model?: string;
    vehicle_plate?: string;
    vehicle_color?: string;
    vehicle_year?: number;
}

export const profileApi = {
    async getProfile(): Promise<Profile> {
        return apiClient.get('/drivers/me');
    },

    async updateProfile(data: Partial<Profile>): Promise<Profile> {
        const { vehicle_model, vehicle_plate, vehicle_color, vehicle_year, ...driverData } = data;
        // Note: Backend might separate vehicle update? 
        // Checking api_map.md: PUT /drivers/me/profile -> Update Profile.
        // Does it include vehicle?
        // Looking at drivers.py: update_driver_profile updates Driver model fields.
        // Vehicle is separate or linked? Drivers.py: create includes vehicle. Update?
        // Drivers.py: update_driver_profile iterates over input fields and sets attributes on driver.
        // Driver model has no vehicle fields directly (they are in Vehicle model).
        // So updating vehicle might need a different endpoint or the backend needs adjustment.
        // For now, I will send driver data. Vehicle update gap?
        // I'll stick to updating driver info first.
        return apiClient.put('/drivers/me/profile', driverData);
    },

    async uploadPhoto(uri: string): Promise<{ photo_url: string }> {
        const formData = new FormData();
        formData.append('file', {
            uri,
            name: 'profile.jpg',
            type: 'image/jpeg',
        } as any);

        return apiClient.post('/drivers/me/photo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
};
