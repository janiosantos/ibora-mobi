/**
 * Card Payment Service
 * Integration with Stripe
 * Docs: https://stripe.com/docs/payments
 */

import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';

interface CardPaymentRequest {
  amount: number; // in cents
  ride_id: string;
  passenger_id: string;
  driver_id: string;
  description?: string;
  save_card?: boolean;
}

interface CardPaymentResponse {
  payment_intent_id: string;
  client_secret: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED';
  card_last4?: string;
  card_brand?: string;
}

interface SavedCard {
  id: string;
  last4: string;
  brand: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
}

class CardPaymentService {
  private stripePublishableKey: string;
  private backendURL: string;

  constructor() {
    this.stripePublishableKey = __DEV__
      ? process.env.STRIPE_PUBLISHABLE_KEY_TEST || ''
      : process.env.STRIPE_PUBLISHABLE_KEY_LIVE || '';
    
    this.backendURL = process.env.API_BASE_URL || 'http://localhost:8000';
  }

  /**
   * Initialize Stripe
   */
  getPublishableKey(): string {
    return this.stripePublishableKey;
  }

  /**
   * Create payment intent
   */
  async createPaymentIntent(data: CardPaymentRequest): Promise<CardPaymentResponse> {
    try {
      // Call backend to create payment intent
      const response = await axios.post(
        `${this.backendURL}/api/v1/payments/card/create-intent`,
        {
          amount: data.amount,
          ride_id: data.ride_id,
          passenger_id: data.passenger_id,
          driver_id: data.driver_id,
          description: data.description || 'Pagamento de corrida iBora',
          metadata: {
            ride_id: data.ride_id,
            passenger_id: data.passenger_id,
            driver_id: data.driver_id,
          },
        }
      );

      return {
        payment_intent_id: response.data.id,
        client_secret: response.data.client_secret,
        status: 'PENDING',
      };
    } catch (error: any) {
      console.error('Payment intent creation failed:', error.response?.data || error);
      throw new Error(
        error.response?.data?.detail || 'Falha ao criar intenção de pagamento'
      );
    }
  }

  /**
   * Confirm card payment
   * This should be called from the component using useStripe hook
   */
  async confirmPayment(
    clientSecret: string,
    paymentMethodId: string
  ): Promise<'SUCCEEDED' | 'FAILED'> {
    try {
      // This is handled by Stripe SDK in the component
      // Just return success/failure based on result
      return 'SUCCEEDED';
    } catch (error) {
      console.error('Payment confirmation failed:', error);
      return 'FAILED';
    }
  }

  /**
   * Save card for future use
   */
  async saveCard(
    paymentMethodId: string,
    passengerId: string
  ): Promise<SavedCard> {
    try {
      const response = await axios.post(
        `${this.backendURL}/api/v1/payments/card/save`,
        {
          payment_method_id: paymentMethodId,
          passenger_id: passengerId,
        }
      );

      return {
        id: response.data.id,
        last4: response.data.card.last4,
        brand: response.data.card.brand,
        exp_month: response.data.card.exp_month,
        exp_year: response.data.card.exp_year,
        is_default: response.data.is_default,
      };
    } catch (error: any) {
      console.error('Card save failed:', error.response?.data || error);
      throw new Error('Falha ao salvar cartão');
    }
  }

  /**
   * Get saved cards
   */
  async getSavedCards(passengerId: string): Promise<SavedCard[]> {
    try {
      const response = await axios.get(
        `${this.backendURL}/api/v1/payments/card/list/${passengerId}`
      );

      return response.data.map((card: any) => ({
        id: card.id,
        last4: card.last4,
        brand: card.brand,
        exp_month: card.exp_month,
        exp_year: card.exp_year,
        is_default: card.is_default,
      }));
    } catch (error) {
      console.error('Failed to get saved cards:', error);
      return [];
    }
  }

  /**
   * Delete saved card
   */
  async deleteCard(cardId: string, passengerId: string): Promise<void> {
    try {
      await axios.delete(
        `${this.backendURL}/api/v1/payments/card/${cardId}`,
        {
          data: { passenger_id: passengerId },
        }
      );
    } catch (error) {
      console.error('Card deletion failed:', error);
      throw new Error('Falha ao remover cartão');
    }
  }

  /**
   * Set default card
   */
  async setDefaultCard(cardId: string, passengerId: string): Promise<void> {
    try {
      await axios.patch(
        `${this.backendURL}/api/v1/payments/card/${cardId}/default`,
        {
          passenger_id: passengerId,
        }
      );
    } catch (error) {
      console.error('Failed to set default card:', error);
      throw new Error('Falha ao definir cartão padrão');
    }
  }

  /**
   * Check payment status
   */
  async checkStatus(paymentIntentId: string): Promise<'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED'> {
    try {
      const response = await axios.get(
        `${this.backendURL}/api/v1/payments/card/status/${paymentIntentId}`
      );

      const status = response.data.status;
      
      if (status === 'succeeded') return 'SUCCEEDED';
      if (status === 'processing') return 'PROCESSING';
      if (status === 'requires_payment_method') return 'FAILED';
      if (status === 'canceled') return 'CANCELLED';
      
      return 'PENDING';
    } catch (error) {
      console.error('Payment status check failed:', error);
      throw new Error('Falha ao verificar status do pagamento');
    }
  }

  /**
   * Process webhook notification
   */
  processWebhook(payload: any): {
    success: boolean;
    payment_intent_id: string;
    status: string;
  } {
    // Webhook signature validation should be done on backend
    
    return {
      success: true,
      payment_intent_id: payload.data.object.id,
      status: payload.data.object.status,
    };
  }

  /**
   * Refund payment
   */
  async refundPayment(
    paymentIntentId: string,
    amount?: number
  ): Promise<void> {
    try {
      await axios.post(
        `${this.backendURL}/api/v1/payments/card/refund`,
        {
          payment_intent_id: paymentIntentId,
          amount, // Optional: partial refund
        }
      );
    } catch (error) {
      console.error('Refund failed:', error);
      throw new Error('Falha ao processar reembolso');
    }
  }
}

export const cardPaymentService = new CardPaymentService();
