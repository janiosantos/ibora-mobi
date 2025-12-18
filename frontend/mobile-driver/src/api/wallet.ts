import { apiClient } from './client';

export interface Wallet {
    id: number;
    driver_id: string;
    available_balance: number;
    blocked_balance: number;
    currency: string;
}

export interface Transaction {
    id: number;
    wallet_id: number;
    amount: number;
    balance_after: number;
    transaction_type: string;
    description: string;
    reference_id: string;
    created_at: string;
}

export interface WalletResponse {
    wallet: Wallet;
    transactions: Transaction[];
}

export const walletApi = {
    async getWallet(): Promise<Wallet> {
        const data = await apiClient.get<any>('/wallet/drivers/me/wallet');
        return {
            ...data,
            available_balance: parseFloat(data.available_balance),
            blocked_balance: parseFloat(data.blocked_balance),
        };
    },

    async getTransactions(params?: { limit?: number; offset?: number }): Promise<{ transactions: Transaction[], total: number }> {
        const data = await apiClient.get<any>('/wallet/drivers/me/wallet/transactions', { params });
        const transactions = data.transactions.map((tx: any) => ({
            ...tx,
            amount: parseFloat(tx.amount),
            balance_after: tx.balance_after ? parseFloat(tx.balance_after) : 0,
        }));
        return { transactions, total: data.total };
    },

    async requestWithdrawal(amount: number, pixKey: string = 'test@example.com', pixKeyType: string = 'email'): Promise<any> {
        return apiClient.post('/wallet/drivers/me/withdrawals', {
            amount,
            pix_key: pixKey,
            pix_key_type: pixKeyType
        });
    }
};
