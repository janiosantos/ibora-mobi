/**
 * PixPaymentScreen
 * Shows PIX QR Code and payment instructions
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Button } from '../../components';
import { useTheme } from '../../theme';
import { spacing, typography } from '../../theme/tokens';
import { pixPaymentService } from '../../services/payment/pixService';
import { Ionicons } from '@expo/vector-icons';
import type { Ride } from '../../types';

interface PixPaymentScreenProps {
  ride: Ride;
  amount: number;
}

export const PixPaymentScreen: React.FC<PixPaymentScreenProps> = ({
  ride,
  amount,
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState<string>('');
  const [qrCodeText, setQrCodeText] = useState<string>('');
  const [txid, setTxid] = useState<string>('');
  const [status, setStatus] = useState<'PENDING' | 'PAID' | 'EXPIRED'>('PENDING');
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour

  useEffect(() => {
    createPixCharge();
  }, []);

  // Check payment status every 3 seconds
  useEffect(() => {
    if (status === 'PENDING' && txid) {
      const interval = setInterval(async () => {
        try {
          const newStatus = await pixPaymentService.checkStatus(txid);
          setStatus(newStatus);
          
          if (newStatus === 'PAID') {
            clearInterval(interval);
            handlePaymentSuccess();
          } else if (newStatus === 'EXPIRED') {
            clearInterval(interval);
            handlePaymentExpired();
          }
        } catch (error) {
          console.error('Status check failed:', error);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [status, txid]);

  // Countdown timer
  useEffect(() => {
    if (status === 'PENDING') {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setStatus('EXPIRED');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [status]);

  const createPixCharge = async () => {
    try {
      setLoading(true);
      
      const charge = await pixPaymentService.createCharge({
        amount: Math.round(amount * 100), // Convert to cents
        ride_id: ride.id,
        passenger_id: ride.passenger_id,
        driver_id: ride.driver_id,
        description: `Corrida iBora - ${ride.id}`,
      });

      setQrCode(charge.qrcode);
      setQrCodeText(charge.qrcode_text);
      setTxid(charge.txid);
    } catch (error: any) {
      Alert.alert('Erro', error.message);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    Clipboard.setString(qrCodeText);
    Alert.alert('Copiado!', 'Código PIX copiado para a área de transferência');
  };

  const handlePaymentSuccess = () => {
    Alert.alert(
      'Pagamento Confirmado!',
      'Seu pagamento foi processado com sucesso',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Rating', { ride }),
        },
      ]
    );
  };

  const handlePaymentExpired = () => {
    Alert.alert(
      'QR Code Expirado',
      'O tempo para pagamento expirou. Por favor, gere um novo QR Code.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Gerar Novo',
          onPress: () => {
            setStatus('PENDING');
            setTimeRemaining(3600);
            createPixCharge();
          },
        },
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background.primary }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
          Gerando QR Code PIX...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Pagamento PIX
        </Text>
        <Text style={[styles.amount, { color: colors.success }]}>
          R$ {amount.toFixed(2)}
        </Text>
      </View>

      {/* Timer */}
      <View style={[styles.timerCard, { backgroundColor: colors.background.secondary }]}>
        <Ionicons name="time-outline" size={24} color={colors.primary} />
        <View style={styles.timerText}>
          <Text style={[styles.timerLabel, { color: colors.text.tertiary }]}>
            Tempo restante
          </Text>
          <Text style={[styles.timerValue, { color: colors.text.primary }]}>
            {formatTime(timeRemaining)}
          </Text>
        </View>
      </View>

      {/* QR Code */}
      <View style={[styles.qrcodeCard, { backgroundColor: colors.background.secondary }]}>
        {status === 'PAID' ? (
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={80} color={colors.success} />
            <Text style={[styles.successText, { color: colors.success }]}>
              Pagamento Confirmado!
            </Text>
          </View>
        ) : status === 'EXPIRED' ? (
          <View style={styles.expiredContainer}>
            <Ionicons name="close-circle" size={80} color={colors.error} />
            <Text style={[styles.expiredText, { color: colors.error }]}>
              QR Code Expirado
            </Text>
          </View>
        ) : (
          <>
            <Image
              source={{ uri: `data:image/png;base64,${qrCode}` }}
              style={styles.qrcode}
              resizeMode="contain"
            />
            
            <Text style={[styles.instruction, { color: colors.text.secondary }]}>
              Escaneie o QR Code com o aplicativo do seu banco
            </Text>
          </>
        )}
      </View>

      {/* PIX Code */}
      {status === 'PENDING' && (
        <View style={[styles.codeCard, { backgroundColor: colors.background.secondary }]}>
          <Text style={[styles.codeLabel, { color: colors.text.tertiary }]}>
            Ou pague com PIX Copia e Cola
          </Text>
          
          <TouchableOpacity
            style={[styles.codeContainer, { backgroundColor: colors.background.primary }]}
            onPress={handleCopyCode}
          >
            <Text
              style={[styles.codeText, { color: colors.text.primary }]}
              numberOfLines={2}
            >
              {qrCodeText}
            </Text>
            <Ionicons name="copy-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <Text style={[styles.instructionsTitle, { color: colors.text.primary }]}>
          Como Pagar:
        </Text>
        
        <View style={styles.instructionItem}>
          <Text style={styles.instructionNumber}>1</Text>
          <Text style={[styles.instructionText, { color: colors.text.secondary }]}>
            Abra o aplicativo do seu banco
          </Text>
        </View>

        <View style={styles.instructionItem}>
          <Text style={styles.instructionNumber}>2</Text>
          <Text style={[styles.instructionText, { color: colors.text.secondary }]}>
            Escolha pagar com PIX
          </Text>
        </View>

        <View style={styles.instructionItem}>
          <Text style={styles.instructionNumber}>3</Text>
          <Text style={[styles.instructionText, { color: colors.text.secondary }]}>
            Escaneie o QR Code ou cole o código
          </Text>
        </View>

        <View style={styles.instructionItem}>
          <Text style={styles.instructionNumber}>4</Text>
          <Text style={[styles.instructionText, { color: colors.text.secondary }]}>
            Confirme o pagamento
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {status === 'EXPIRED' && (
          <Button
            onPress={() => {
              setStatus('PENDING');
              setTimeRemaining(3600);
              createPixCharge();
            }}
          >
            Gerar Novo QR Code
          </Button>
        )}
        
        <Button
          variant="ghost"
          onPress={() => navigation.goBack()}
        >
          Voltar
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  amount: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
  },
  timerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  timerText: {
    flex: 1,
  },
  timerLabel: {
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xs,
  },
  timerValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  qrcodeCard: {
    padding: spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  qrcode: {
    width: 250,
    height: 250,
    marginBottom: spacing.md,
  },
  instruction: {
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  successText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing.md,
  },
  expiredContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  expiredText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing.md,
  },
  codeCard: {
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  codeLabel: {
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 8,
    gap: spacing.sm,
  },
  codeText: {
    flex: 1,
    fontSize: typography.fontSize.xs,
    fontFamily: 'monospace',
  },
  instructionsCard: {
    marginBottom: spacing.lg,
  },
  instructionsTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.md,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E5E5',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  instructionText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
  },
  actions: {
    gap: spacing.sm,
  },
});
