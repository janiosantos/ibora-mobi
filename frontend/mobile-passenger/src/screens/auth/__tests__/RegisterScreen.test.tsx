import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '../RegisterScreen';

// Mocks
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

// Mock api directly as the component uses it
jest.mock('../../../api/auth', () => ({
    authApi: {
        signup: jest.fn().mockResolvedValue({})
    }
}));
import { authApi } from '../../../api/auth';

describe('RegisterScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all input fields', () => {
        const navigationMock = { goBack: mockGoBack, navigate: mockNavigate };
        const { getByPlaceholderText, getByText } = render(<RegisterScreen navigation={navigationMock} />);

        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByPlaceholderText('Telefone (apenas números)')).toBeTruthy();
        expect(getByPlaceholderText('Senha')).toBeTruthy();
        expect(getByText('Cadastrar')).toBeTruthy();
    });

    it('calls signup with correct data on submit', async () => {
        const navigationMock = { goBack: mockGoBack, navigate: mockNavigate };
        const { getByPlaceholderText, getByText } = render(<RegisterScreen navigation={navigationMock} />);

        fireEvent.changeText(getByPlaceholderText('Email'), 'john@example.com');
        fireEvent.changeText(getByPlaceholderText('Telefone (apenas números)'), '11999999999');
        fireEvent.changeText(getByPlaceholderText('Senha'), 'password123');

        fireEvent.press(getByText('Cadastrar'));

        await waitFor(() => {
            expect(authApi.signup).toHaveBeenCalledWith({
                email: 'john@example.com',
                password: 'password123',
                phone: '11999999999',
                user_type: 'passenger'
            });
        });
    });

    it('navigates back on link press', () => {
        const navigationMock = { goBack: mockGoBack, navigate: mockNavigate };
        const { getByText } = render(<RegisterScreen navigation={navigationMock} />);

        fireEvent.press(getByText('Já tem uma conta? Entrar'));

        expect(mockGoBack).toHaveBeenCalled();
    });
});
