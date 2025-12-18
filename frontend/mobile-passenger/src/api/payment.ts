import { apiClient } from './client';

export interface PaymentMethod {
    id: number;
    type: string;
    provider: string;
    brand?: string;
    last4?: string;
    is_default: boolean;
    is_expired?: boolean;
}

export const paymentApi = {
    async listPaymentMethods(): Promise<{ payment_methods: PaymentMethod[] }> {
        return apiClient.get('/payment-methods');
    },

    async addCard(token: string): Promise<PaymentMethod> {
        return apiClient.post('/payment-methods', {
            type: 'card',
            provider: 'mercadopago', // Defaulting to MP as per recent backend work
            card_token: token,
            is_default: true
        });
    },

    async removePaymentMethod(id: number): Promise<void> {
        return apiClient.delete(`/payment-methods/${id}`);
    },

    async setDefaultPaymentMethod(id: number): Promise<void> {
        return apiClient.put(`/payment-methods/${id}/set-default`);
    }
};
