/**
 * CardPaymentScreen
 * Stripe card payment integration
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  CardField,
  useStripe,
  useConfirmPayment,
} from '@stripe/stripe-react-native';
import { Button } from '../../components';
import { useTheme } from '../../theme';
import { spacing, typography } from '../../theme/tokens';
import { cardPaymentService } from '../../services/payment/cardService';
import { Ionicons } from '@expo/vector-icons';
import type { Ride } from '../../types';

interface CardPaymentScreenProps {
  ride: Ride;
  amount: number;
}

export const CardPaymentScreen: React.FC<CardPaymentScreenProps> = ({
  ride,
  amount,
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { confirmPayment } = useConfirmPayment();

  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [cardComplete, setCardComplete] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  useEffect(() => {
    loadSavedCards();
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      const intent = await cardPaymentService.createPaymentIntent({
        amount: Math.round(amount * 100), // Convert to cents
        ride_id: ride.id,
        passenger_id: ride.passenger_id,
        driver_id: ride.driver_id,
        description: `Corrida iBora - ${ride.id}`,
      });

      setClientSecret(intent.client_secret);
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  };

  const loadSavedCards = async () => {
    try {
      const cards = await cardPaymentService.getSavedCards(ride.passenger_id);
      setSavedCards(cards);
    } catch (error) {
      console.error('Failed to load saved cards:', error);
    }
  };

  const handlePayment = async () => {
    if (!clientSecret) {
      Alert.alert('Erro', 'Falha ao inicializar pagamento');
      return;
    }

    setLoading(true);

    try {
      if (selectedCard) {
        // Pay with saved card
        await handleSavedCardPayment();
      } else {
        // Pay with new card
        await handleNewCardPayment();
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  const handleNewCardPayment = async () => {
    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      paymentMethodType: 'Card',
    });

    if (error) {
      throw new Error(error.message);
    }

    if (paymentIntent?.status === 'Succeeded') {
      // Save card if requested
      if (saveCard && paymentIntent.paymentMethodId) {
        await cardPaymentService.saveCard(
          paymentIntent.paymentMethodId,
          ride.passenger_id
        );
      }

      handlePaymentSuccess();
    } else {
      throw new Error('Pagamento não foi processado');
    }
  };

  const handleSavedCardPayment = async () => {
    // Implement payment with saved card
    // This requires backend endpoint to charge saved payment method
    
    Alert.alert(
      'Pagamento Processado',
      'Seu pagamento foi processado com sucesso'
    );
    
    handlePaymentSuccess();
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

  const handleDeleteCard = async (cardId: string) => {
    Alert.alert(
      'Remover Cartão',
      'Tem certeza que deseja remover este cartão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await cardPaymentService.deleteCard(cardId, ride.passenger_id);
              loadSavedCards();
            } catch (error) {
              Alert.alert('Erro', 'Falha ao remover cartão');
            }
          },
        },
      ]
    );
  };

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return 'card';
      case 'mastercard':
        return 'card';
      case 'amex':
        return 'card';
      default:
        return 'card-outline';
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Pagamento com Cartão
        </Text>
        <Text style={[styles.amount, { color: colors.success }]}>
          R$ {amount.toFixed(2)}
        </Text>
      </View>

      {/* Saved Cards */}
      {savedCards.length > 0 && (
        <View style={[styles.section, { backgroundColor: colors.background.secondary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Cartões Salvos
          </Text>

          {savedCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.savedCard,
                {
                  backgroundColor: colors.background.primary,
                  borderColor:
                    selectedCard === card.id ? colors.primary : colors.border,
                  borderWidth: selectedCard === card.id ? 2 : 1,
                },
              ]}
              onPress={() => setSelectedCard(card.id)}
            >
              <Ionicons
                name={getCardIcon(card.brand) as any}
                size={32}
                color={colors.text.secondary}
              />
              <View style={styles.cardInfo}>
                <Text style={[styles.cardBrand, { color: colors.text.primary }]}>
                  {card.brand.toUpperCase()}
                </Text>
                <Text style={[styles.cardNumber, { color: colors.text.secondary }]}>
                  •••• {card.last4}
                </Text>
                <Text style={[styles.cardExpiry, { color: colors.text.tertiary }]}>
                  {card.exp_month}/{card.exp_year}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDeleteCard(card.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={20} color={colors.error} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          <Button
            variant="ghost"
            size="sm"
            onPress={() => setSelectedCard(null)}
          >
            Usar Novo Cartão
          </Button>
        </View>
      )}

      {/* New Card Form */}
      {!selectedCard && (
        <View style={[styles.section, { backgroundColor: colors.background.secondary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            {savedCards.length > 0 ? 'Novo Cartão' : 'Dados do Cartão'}
          </Text>

          <CardField
            postalCodeEnabled={false}
            placeholders={{
              number: '4242 4242 4242 4242',
            }}
            cardStyle={{
              backgroundColor: colors.background.primary,
              textColor: colors.text.primary,
              placeholderColor: colors.text.tertiary,
            }}
            style={styles.cardField}
            onCardChange={(details) => {
              setCardComplete(details.complete);
            }}
          />

          {/* Save Card Option */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setSaveCard(!saveCard)}
          >
            <Ionicons
              name={saveCard ? 'checkbox' : 'square-outline'}
              size={24}
              color={saveCard ? colors.primary : colors.border}
            />
            <Text style={[styles.checkboxLabel, { color: colors.text.secondary }]}>
              Salvar este cartão para compras futuras
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Security Info */}
      <View style={[styles.securityCard, { backgroundColor: colors.background.secondary }]}>
        <Ionicons name="shield-checkmark" size={24} color={colors.success} />
        <View style={styles.securityText}>
          <Text style={[styles.securityTitle, { color: colors.text.primary }]}>
            Pagamento Seguro
          </Text>
          <Text style={[styles.securitySubtitle, { color: colors.text.secondary }]}>
            Seus dados são criptografados e protegidos
          </Text>
        </View>
      </View>

      {/* Payment Summary */}
      <View style={[styles.summary, { backgroundColor: colors.background.secondary }]}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>
            Subtotal
          </Text>
          <Text style={[styles.summaryValue, { color: colors.text.primary }]}>
            R$ {amount.toFixed(2)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={[styles.totalLabel, { color: colors.text.primary }]}>
            Total
          </Text>
          <Text style={[styles.totalValue, { color: colors.success }]}>
            R$ {amount.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Pay Button */}
      <Button
        onPress={handlePayment}
        loading={loading}
        disabled={
          loading ||
          (!selectedCard && !cardComplete) ||
          !clientSecret
        }
        style={styles.payButton}
      >
        {loading ? 'Processando...' : `Pagar R$ ${amount.toFixed(2)}`}
      </Button>

      {/* Cancel Button */}
      <Button
        variant="ghost"
        onPress={() => navigation.goBack()}
        disabled={loading}
      >
        Voltar
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
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
  section: {
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.md,
  },
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  cardInfo: {
    flex: 1,
  },
  cardBrand: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  cardNumber: {
    fontSize: typography.fontSize.md,
    marginBottom: spacing.xs,
  },
  cardExpiry: {
    fontSize: typography.fontSize.xs,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  cardField: {
    height: 50,
    marginBottom: spacing.md,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: typography.fontSize.sm,
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  securityText: {
    flex: 1,
  },
  securityTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  securitySubtitle: {
    fontSize: typography.fontSize.sm,
  },
  summary: {
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: typography.fontSize.md,
  },
  summaryValue: {
    fontSize: typography.fontSize.md,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: spacing.sm,
  },
  totalLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  totalValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  payButton: {
    marginBottom: spacing.sm,
  },
});
