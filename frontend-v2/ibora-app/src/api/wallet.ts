/**
 * Wallet API Service
 * Wallet balance, withdrawals, and transactions
 */

import { apiClient } from './client';
import { ENDPOINTS } from './config';

// Request/Response Types
export interface WalletResponse {
  available_balance: number;
  locked_balance: number;
  credit_balance: number;
  total_earnings: number;
  pending_withdrawals: number;
}

export interface WithdrawalRequest {
  amount: number;
  pix_key?: string;
  pix_key_type?: 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'RANDOM';
}

export interface WithdrawalResponse {
  id: string;
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  pix_key?: string;
  created_at: string;
  completed_at?: string;
}

export interface TransactionParams {
  type?: string;
  from_date?: string;
  to_date?: string;
  limit?: number;
  offset?: number;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
  ride_id?: string;
}

export const walletApi = {
  /**
   * Get wallet balance and stats
   * GET /wallet/drivers/me/wallet
   */
  async getBalance(): Promise<WalletResponse> {
    return apiClient.get(ENDPOINTS.WALLET.BALANCE);
  },

  /**
   * Request a funds withdrawal
   * POST /wallet/drivers/me/withdrawals
   */
  async requestWithdrawal(data: WithdrawalRequest): Promise<WithdrawalResponse> {
    return apiClient.post(ENDPOINTS.WALLET.WITHDRAW, data);
  },

  /**
   * Get transaction history
   * GET /wallet/drivers/me/wallet/transactions
   */
  async getTransactions(params?: TransactionParams): Promise<Transaction[]> {
    return apiClient.get(ENDPOINTS.WALLET.TRANSACTIONS, { params });
  },
};
