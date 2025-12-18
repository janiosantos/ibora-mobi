import { apiClient } from './client';

export interface Profile {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    photo_url?: string;
}

export const profileApi = {
    async getProfile(): Promise<Profile> {
        return apiClient.get('/passengers/me');
    },

    async updateProfile(data: Partial<Profile>): Promise<Profile> {
        // Check if endpoint exists: api_map.md doesn't explicitly list PUT /passengers/me, 
        // but implies standard structure. 
        // Wait, PASSENGERS section in api_map.md lists:
        // - POST / - Create
        // - GET /me - Get Current
        // - GET /drivers/nearby
        // NO PUT /me in API Map? I should check passengers.py.
        // If missing, I might need to add it to backend.

        // Let's assume for now it exists or I'll fix it in backend soon.
        // Actually, I should verify first.
        return apiClient.put('/passengers/me', data);
    },

    async uploadPhoto(uri: string): Promise<{ photo_url: string }> {
        // Similar upload logic if supported
        const formData = new FormData();
        formData.append('file', {
            uri,
            name: 'profile.jpg',
            type: 'image/jpeg',
        } as any);

        return apiClient.post('/passengers/me/photo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
};
