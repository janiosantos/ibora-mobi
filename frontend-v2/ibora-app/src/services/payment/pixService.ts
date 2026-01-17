/**
 * PIX Payment Service
 * Integration with Efí Pay (formerly Gerencianet)
 * Docs: https://dev.efipay.com.br/docs/api-pix
 */

import axios from 'axios';
import { Platform } from 'react-native';

interface PixChargeRequest {
  amount: number; // in cents
  ride_id: string;
  passenger_id: string;
  driver_id: string;
  description?: string;
}

interface PixChargeResponse {
  txid: string;
  qrcode: string; // QR Code image base64
  qrcode_text: string; // PIX copy-paste code
  expires_at: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELLED';
}

interface PixWebhookPayload {
  txid: string;
  status: 'PAID' | 'CANCELLED';
  paid_at?: string;
  payer?: {
    name: string;
    cpf: string;
  };
}

class PixPaymentService {
  private baseURL: string;
  private clientId: string;
  private clientSecret: string;
  private certificate: string;

  constructor() {
    // These should come from environment variables
    this.baseURL = __DEV__ 
      ? 'https://api-pix-h.gerencianet.com.br' // Homologation
      : 'https://api-pix.gerencianet.com.br'; // Production
    
    this.clientId = process.env.EFI_CLIENT_ID || '';
    this.clientSecret = process.env.EFI_CLIENT_SECRET || '';
    this.certificate = process.env.EFI_CERTIFICATE || '';
  }

  /**
   * Create PIX charge
   */
  async createCharge(data: PixChargeRequest): Promise<PixChargeResponse> {
    try {
      // Generate unique txid (32 chars alphanumeric)
      const txid = this.generateTxid();

      // Call backend to create PIX charge
      const response = await axios.post(
        `${this.baseURL}/v2/cob/${txid}`,
        {
          calendario: {
            expiracao: 3600, // 1 hour
          },
          valor: {
            original: (data.amount / 100).toFixed(2),
          },
          chave: this.getPixKey(), // Platform PIX key
          solicitacaoPagador: data.description || 'Pagamento de corrida iBora',
          infoAdicionais: [
            {
              nome: 'ride_id',
              valor: data.ride_id,
            },
            {
              nome: 'passenger_id',
              valor: data.passenger_id,
            },
          ],
        },
        {
          headers: this.getHeaders(),
        }
      );

      // Get QR Code
      const qrcodeResponse = await axios.get(
        `${this.baseURL}/v2/loc/${response.data.loc.id}/qrcode`,
        {
          headers: this.getHeaders(),
        }
      );

      return {
        txid,
        qrcode: qrcodeResponse.data.imagemQrcode, // base64
        qrcode_text: qrcodeResponse.data.qrcode, // copy-paste
        expires_at: new Date(Date.now() + 3600000).toISOString(),
        amount: data.amount,
        status: 'PENDING',
      };
    } catch (error: any) {
      console.error('PIX charge creation failed:', error.response?.data || error);
      throw new Error(
        error.response?.data?.mensagem || 'Falha ao criar cobrança PIX'
      );
    }
  }

  /**
   * Check PIX payment status
   */
  async checkStatus(txid: string): Promise<'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELLED'> {
    try {
      const response = await axios.get(
        `${this.baseURL}/v2/cob/${txid}`,
        {
          headers: this.getHeaders(),
        }
      );

      const status = response.data.status;
      
      // Map Efí Pay status to our status
      if (status === 'CONCLUIDA') return 'PAID';
      if (status === 'REMOVIDA_PELO_USUARIO_RECEBEDOR') return 'CANCELLED';
      if (status === 'ATIVA') {
        // Check if expired
        const expiresAt = new Date(response.data.calendario.criacao);
        expiresAt.setSeconds(expiresAt.getSeconds() + response.data.calendario.expiracao);
        
        if (expiresAt < new Date()) return 'EXPIRED';
        return 'PENDING';
      }

      return 'PENDING';
    } catch (error) {
      console.error('PIX status check failed:', error);
      throw new Error('Falha ao verificar status do pagamento');
    }
  }

  /**
   * Cancel PIX charge
   */
  async cancelCharge(txid: string): Promise<void> {
    try {
      await axios.patch(
        `${this.baseURL}/v2/cob/${txid}`,
        {
          status: 'REMOVIDA_PELO_USUARIO_RECEBEDOR',
        },
        {
          headers: this.getHeaders(),
        }
      );
    } catch (error) {
      console.error('PIX cancellation failed:', error);
      throw new Error('Falha ao cancelar cobrança PIX');
    }
  }

  /**
   * Process webhook notification
   */
  processWebhook(payload: PixWebhookPayload): {
    success: boolean;
    txid: string;
    status: string;
  } {
    // Validate webhook signature here
    
    return {
      success: true,
      txid: payload.txid,
      status: payload.status,
    };
  }

  /**
   * Generate unique transaction ID
   */
  private generateTxid(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let txid = '';
    for (let i = 0; i < 32; i++) {
      txid += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return txid;
  }

  /**
   * Get PIX key from environment
   */
  private getPixKey(): string {
    return process.env.EFI_PIX_KEY || 'pix@ibora.com.br';
  }

  /**
   * Get authorization headers
   */
  private getHeaders() {
    // In production, get OAuth token
    const token = this.getOAuthToken();
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get OAuth token (should be cached)
   */
  private getOAuthToken(): string {
    // Implementation: Call OAuth endpoint to get token
    // Cache token and refresh when expired
    return 'your_oauth_token_here';
  }
}

export const pixPaymentService = new PixPaymentService();
