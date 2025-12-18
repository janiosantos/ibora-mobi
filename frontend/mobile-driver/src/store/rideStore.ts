import { create } from 'zustand';

interface RideState {
    ride: any | null;
    isLoading: boolean;
    error: string | null;
    requestRide: (data: any) => Promise<void>;
    acceptRide: (rideId: string) => Promise<void>;
    startRide: (rideId: string) => Promise<void>;
    completeRide: (rideId: string) => Promise<void>;
}

export const useRideStore = create<RideState>((set) => ({
    ride: null,
    isLoading: false,
    error: null,
    requestRide: async (data) => { },
    acceptRide: async (rideId) => { },
    startRide: async (rideId) => { },
    completeRide: async (rideId) => { },
}));
