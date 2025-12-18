import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '../RegisterScreen';

// Mocks
const mockSignup = jest.fn();
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
    return {
        useNavigation: () => ({
            navigate: mockNavigate,
            goBack: mockGoBack
        }),
    };
});

// The component imports authApi directly
// The component imports authApi directly
jest.mock('../../../api/auth', () => ({
    authApi: {
        signup: jest.fn().mockResolvedValue({})
    }
}));
import { authApi } from '../../../api/auth';

describe('RegisterScreen Driver', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all input fields', () => {
        const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByPlaceholderText('Telefone (apenas números)')).toBeTruthy();
        expect(getByPlaceholderText('Senha')).toBeTruthy();
        expect(getByText('Cadastrar')).toBeTruthy();
    });

    it('calls signup with correct data on submit', async () => {
        const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

        fireEvent.changeText(getByPlaceholderText('Email'), 'driver@example.com');
        fireEvent.changeText(getByPlaceholderText('Telefone (apenas números)'), '11988888888');
        fireEvent.changeText(getByPlaceholderText('Senha'), 'secretpass');

        fireEvent.press(getByText('Cadastrar'));

        await waitFor(() => {
            expect(authApi.signup).toHaveBeenCalledWith({
                email: 'driver@example.com',
                password: 'secretpass',
                phone: '11988888888',
                user_type: 'driver'
            });
        });
    });
});
