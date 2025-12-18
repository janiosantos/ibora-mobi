import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';

// Mock Navigation (Global for this test file)
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({ navigate: jest.fn() }),
    useFocusEffect: jest.fn(),
}));

const mockLocation = {
    requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
    getCurrentPositionAsync: jest.fn().mockResolvedValue({
        coords: { latitude: -23.55, longitude: -46.63 }
    })
};
jest.mock('expo-location', () => ({
    ...mockLocation,
    default: mockLocation,
    __esModule: true,
}));

jest.mock('react-native-maps', () => {
    const React = require('react');
    const { View } = require('react-native');
    class MockMapView extends React.Component {
        fitToCoordinates = jest.fn();
        render() { return <View testID="map-view" >{this.props.children}</View>; }
    }
    class MockMarker extends React.Component {
        render() { return <View testID="map-marker" />; }
    }
    return {
        __esModule: true,
        default: MockMapView,
        Marker: MockMarker,
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
        user: { name: 'Passenger Test' },
        logout: jest.fn()
    })
}));


describe('HomeScreen Passenger', () => {
    it('renders map and correct UI elements', async () => {
        const { getByText, getByTestId } = render(<HomeScreen />);

        // Map should render
        expect(getByTestId('map-view')).toBeTruthy();
    });
});
