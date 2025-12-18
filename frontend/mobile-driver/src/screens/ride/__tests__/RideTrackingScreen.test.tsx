import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RideTrackingScreen from '../RideTrackingScreen';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
    useRoute: () => ({
        params: { rideId: '123' }
    })
}));

// Mock Maps
jest.mock('react-native-maps', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        __esModule: true,
        default: (props) => <View testID="map-view" {...props}>{props.children}</View>,
        Marker: (props) => <View testID="map-marker" {...props} />,
        Polyline: (props) => <View testID="map-polyline" {...props} />,
        PROVIDER_GOOGLE: 'google',
    };
});

jest.mock('../../../store/rideStore', () => ({
    useRideStore: () => ({
        ride: {
            id: '123',
            status: 'ACCEPTED',
            passenger: { name: 'Passenger Test' },
            origin: { latitude: 0, longitude: 0 },
            destination: { latitude: 0, longitude: 0 }
        },
        acceptRide: jest.fn(),
        startRide: jest.fn(),
        completeRide: jest.fn(),
    })
}));

describe('RideTrackingScreen', () => {
    it('renders ride details', () => {
        const routeMock = { params: { rideId: '123' } };
        const { getByText, getByTestId } = render(<RideTrackingScreen route={routeMock} />);
        expect(getByText('Passageiro (Mock)')).toBeTruthy();
    });
});
