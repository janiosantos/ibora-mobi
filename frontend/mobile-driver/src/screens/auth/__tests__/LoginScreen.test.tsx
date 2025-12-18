import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';

// Mocks
jest.mock('@react-navigation/native', () => {
    return {
        useNavigation: () => ({
            navigate: jest.fn(),
        }),
    };
});

jest.mock('../../../store/authStore', () => ({
    useAuthStore: () => ({
        login: jest.fn(),
        isLoading: false
    })
}));

describe('LoginScreen Driver', () => {
    it('renders correctly', () => {
        const { getByPlaceholderText, getByText } = render(<LoginScreen />);

        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByPlaceholderText('Senha')).toBeTruthy();
        expect(getByText('Entrar')).toBeTruthy();
    });
});
