/**
 * Wallet Store
 * Global state for wallet (balance, transactions, withdrawals)
 */

import { create } from 'zustand';
import { walletApi } from '../api';
import type { WalletResponse, Transaction, WithdrawalRequest } from '../api/wallet';

interface WalletState {
  // State
  balance: WalletResponse | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadBalance: () => Promise<void>;
  loadTransactions: () => Promise<void>;
  requestWithdrawal: (data: WithdrawalRequest) => Promise<void>;
  clearError: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  // Initial state
  balance: null,
  transactions: [],
  isLoading: false,
  error: null,
  
  // Load balance
  loadBalance: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const balance = await walletApi.getBalance();
      
      set({
        balance,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to load balance',
        isLoading: false,
      });
      throw error;
    }
  },
  
  // Load transactions
  loadTransactions: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const transactions = await walletApi.getTransactions();
      
      set({
        transactions,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to load transactions',
        isLoading: false,
      });
      throw error;
    }
  },
  
  // Request withdrawal
  requestWithdrawal: async (data: WithdrawalRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      await walletApi.requestWithdrawal(data);
      
      // Reload balance after withdrawal
      const balance = await walletApi.getBalance();
      
      set({
        balance,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to request withdrawal',
        isLoading: false,
      });
      throw error;
    }
  },
  
  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
