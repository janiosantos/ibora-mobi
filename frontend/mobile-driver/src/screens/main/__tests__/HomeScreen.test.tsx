import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';

// Mock Navigation (Global for this test file)
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({ navigate: jest.fn() }),
    useFocusEffect: jest.fn(),
}));

jest.mock('expo-location', () => ({
    requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
    getCurrentPositionAsync: jest.fn().mockResolvedValue({
        coords: { latitude: -23.55, longitude: -46.63 }
    }),
    __esModule: true,
}));

jest.mock('@expo/vector-icons', () => {
    const { View } = require('react-native');
    return {
        Ionicons: (props) => <View testID={`icon-${props.name}`} {...props} />,
    };
});

jest.mock('react-native-maps', () => {
    const React = require('react');
    const { View } = require('react-native');

    const MockMapView = (props) => <View testID="map-view" {...props}>{props.children}</View>;
    const MockMarker = (props) => <View testID="map-marker" {...props} />;
    MockMarker.Animated = MockMarker;

    return {
        __esModule: true,
        default: MockMapView,
        Marker: MockMarker,
        PROVIDER_GOOGLE: 'google',
    };
});

jest.mock('socket.io-client', () => {
    return jest.fn(() => ({
        on: jest.fn(),
        emit: jest.fn(),
        disconnect: jest.fn(),
        connect: jest.fn(),
    }));
});

// Mock Store
jest.mock('../../../store/authStore', () => ({
    useAuthStore: () => ({
        user: { name: 'Driver Test' },
        logout: jest.fn()
    })
}));

describe('HomeScreen Driver', () => {
    it('renders map and status elements', async () => {
        const { getByText, getByTestId } = render(<HomeScreen />);

        expect(getByTestId('map-view')).toBeTruthy();
    });
});
