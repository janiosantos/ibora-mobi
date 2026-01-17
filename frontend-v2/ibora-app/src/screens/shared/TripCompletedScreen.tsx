/**
 * TripCompletedScreen - Universal
 * Shows trip summary and payment for both Driver and Passenger
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Avatar } from '../../components';
import { useTheme } from '../../theme';
import { spacing, typography } from '../../theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import type { Ride } from '../../types';

interface TripCompletedScreenProps {
  ride: Ride;
  userType: 'driver' | 'passenger';
}

export const TripCompletedScreen: React.FC<TripCompletedScreenProps> = ({
  ride,
  userType,
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [selectedPayment, setSelectedPayment] = useState(ride.payment_method || 'cash');

  const otherUser = userType === 'driver' ? ride.passenger : ride.driver;

  // Calculate breakdown
  const breakdown = {
    basePrice: ride.estimated_price || 25.0,
    distanceCharge: (ride.actual_distance_km || 5.2) * 2.5,
    timeCharge: (ride.actual_duration_min || 15) * 0.5,
    platformFee: 3.0,
    weatherSurcharge: 1.17,
    total: ride.final_price || 36.17,
  };

  const handleContinue = () => {
    if (userType === 'passenger') {
      // Passenger rates driver
      navigation.navigate('Rating', { ride, ratingType: 'driver' });
    } else {
      // Driver rates passenger
      navigation.navigate('Rating', { ride, ratingType: 'passenger' });
    }
  };

  const handlePaymentChange = (method: string) => {
    setSelectedPayment(method);
  };

  const paymentMethods = [
    { id: 'cash', name: 'Dinheiro', icon: 'cash-outline' },
    { id: 'pix', name: 'PIX', icon: 'logo-bitcoin' },
    { id: 'card', name: 'Cartão', icon: 'card-outline' },
    { id: 'wallet', name: 'Carteira', icon: 'wallet-outline' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      contentContainerStyle={styles.content}
    >
      {/* Success Icon */}
      <View style={[styles.successIcon, { backgroundColor: colors.success + '20' }]}>
        <Ionicons name="checkmark-circle" size={80} color={colors.success} />
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: colors.text.primary }]}>
        {userType === 'driver' ? 'Corrida Finalizada!' : 'Você Chegou!'}
      </Text>

      <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
        {userType === 'driver'
          ? 'Obrigado por completar esta viagem'
          : 'Esperamos que tenha tido uma ótima viagem'}
      </Text>

      {/* Other User Info */}
      <View style={[styles.userCard, { backgroundColor: colors.background.secondary }]}>
        <Avatar
          uri={otherUser?.avatar_url}
          size={60}
          name={otherUser?.name}
        />
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text.primary }]}>
            {userType === 'driver' ? 'Passageiro' : 'Motorista'}
          </Text>
          <Text style={[styles.userNameValue, { color: colors.text.primary }]}>
            {otherUser?.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFB800" />
            <Text style={[styles.rating, { color: colors.text.secondary }]}>
              {otherUser?.rating?.toFixed(1)}
            </Text>
          </View>
        </View>
      </View>

      {/* Trip Summary */}
      <View style={[styles.summaryCard, { backgroundColor: colors.background.secondary }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Resumo da Viagem
        </Text>

        <View style={styles.summaryRow}>
          <View style={styles.locationDot} style={{ backgroundColor: colors.success }} />
          <Text style={[styles.locationText, { color: colors.text.secondary }]} numberOfLines={1}>
            {ride.pickup_location.address}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.locationDot} style={{ backgroundColor: colors.error }} />
          <Text style={[styles.locationText, { color: colors.text.secondary }]} numberOfLines={1}>
            {ride.dropoff_location.address}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Ionicons name="navigate-outline" size={20} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
              {ride.actual_distance_km?.toFixed(1) || '5.2'} km
            </Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
              {ride.actual_duration_min || 15} min
            </Text>
          </View>
        </View>
      </View>

      {/* Price Breakdown */}
      <View style={[styles.breakdownCard, { backgroundColor: colors.background.secondary }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Detalhes do Pagamento
        </Text>

        <View style={styles.breakdownRow}>
          <Text style={[styles.breakdownLabel, { color: colors.text.secondary }]}>
            Tarifa Base
          </Text>
          <Text style={[styles.breakdownValue, { color: colors.text.primary }]}>
            R$ {breakdown.basePrice.toFixed(2)}
          </Text>
        </View>

        <View style={styles.breakdownRow}>
          <Text style={[styles.breakdownLabel, { color: colors.text.secondary }]}>
            Distância ({ride.actual_distance_km?.toFixed(1)}km × R$2,50)
          </Text>
          <Text style={[styles.breakdownValue, { color: colors.text.primary }]}>
            R$ {breakdown.distanceCharge.toFixed(2)}
          </Text>
        </View>

        <View style={styles.breakdownRow}>
          <Text style={[styles.breakdownLabel, { color: colors.text.secondary }]}>
            Tempo ({ride.actual_duration_min}min × R$0,50)
          </Text>
          <Text style={[styles.breakdownValue, { color: colors.text.primary }]}>
            R$ {breakdown.timeCharge.toFixed(2)}
          </Text>
        </View>

        <View style={styles.breakdownRow}>
          <Text style={[styles.breakdownLabel, { color: colors.text.secondary }]}>
            Taxa da Plataforma
          </Text>
          <Text style={[styles.breakdownValue, { color: colors.text.primary }]}>
            R$ {breakdown.platformFee.toFixed(2)}
          </Text>
        </View>

        <View style={styles.breakdownRow}>
          <Text style={[styles.breakdownLabel, { color: colors.text.secondary }]}>
            Adicional Clima
          </Text>
          <Text style={[styles.breakdownValue, { color: colors.text.primary }]}>
            R$ {breakdown.weatherSurcharge.toFixed(2)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.breakdownRow}>
          <Text style={[styles.totalLabel, { color: colors.text.primary }]}>
            Total
          </Text>
          <Text style={[styles.totalValue, { color: colors.success }]}>
            R$ {breakdown.total.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Payment Method (Passenger Only) */}
      {userType === 'passenger' && (
        <View style={[styles.paymentCard, { backgroundColor: colors.background.secondary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Método de Pagamento
          </Text>

          <View style={styles.paymentMethods}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethod,
                  {
                    backgroundColor: colors.background.primary,
                    borderColor:
                      selectedPayment === method.id ? colors.primary : colors.border,
                    borderWidth: selectedPayment === method.id ? 2 : 1,
                  },
                ]}
                onPress={() => handlePaymentChange(method.id)}
              >
                <Ionicons
                  name={method.icon as any}
                  size={24}
                  color={selectedPayment === method.id ? colors.primary : colors.text.secondary}
                />
                <Text
                  style={[
                    styles.paymentMethodText,
                    {
                      color:
                        selectedPayment === method.id ? colors.primary : colors.text.secondary,
                    },
                  ]}
                >
                  {method.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Driver Earnings (Driver Only) */}
      {userType === 'driver' && (
        <View style={[styles.earningsCard, { backgroundColor: colors.success + '20' }]}>
          <Ionicons name="cash-outline" size={32} color={colors.success} />
          <View style={styles.earningsText}>
            <Text style={[styles.earningsLabel, { color: colors.text.secondary }]}>
              Você Ganhou
            </Text>
            <Text style={[styles.earningsValue, { color: colors.success }]}>
              R$ {(breakdown.total * 0.8).toFixed(2)}
            </Text>
            <Text style={[styles.earningsHint, { color: colors.text.tertiary }]}>
              Disponível para saque em 7 dias
            </Text>
          </View>
        </View>
      )}

      {/* Continue Button */}
      <Button
        onPress={handleContinue}
        style={styles.continueButton}
      >
        {userType === 'passenger' ? 'Avaliar Motorista' : 'Avaliar Passageiro'}
      </Button>

      {/* Skip Button */}
      <Button
        variant="ghost"
        onPress={() => navigation.navigate('Home')}
        style={styles.skipButton}
      >
        Pular Avaliação
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
    paddingTop: spacing['2xl'],
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.xs,
  },
  userNameValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rating: {
    fontSize: typography.fontSize.sm,
  },
  summaryCard: {
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  locationText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: spacing.md,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  breakdownCard: {
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  breakdownLabel: {
    fontSize: typography.fontSize.sm,
    flex: 1,
  },
  breakdownValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  totalLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  totalValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  paymentCard: {
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  paymentMethods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 8,
    gap: spacing.sm,
    minWidth: '48%',
  },
  paymentMethodText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  earningsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  earningsText: {
    flex: 1,
  },
  earningsLabel: {
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xs,
  },
  earningsValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  earningsHint: {
    fontSize: typography.fontSize.xs,
  },
  continueButton: {
    marginBottom: spacing.sm,
  },
  skipButton: {
    marginBottom: spacing.xl,
  },
});
