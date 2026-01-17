/**
 * WaitingDriverScreen - Passenger
 * Shows while waiting for a driver to accept the ride request
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Map, Button } from '../../components';
import { useTheme } from '../../theme';
import { spacing, typography } from '../../theme/tokens';
import { useRideRequest } from '../../hooks';
import type { Location } from '../../types';

interface WaitingDriverScreenProps {
  pickup: Location;
  dropoff: Location;
  estimatedPrice: number;
}

export const WaitingDriverScreen: React.FC<WaitingDriverScreenProps> = ({
  pickup,
  dropoff,
  estimatedPrice,
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { currentRide, status, cancelRide } = useRideRequest('passenger');
  const [searchingDots, setSearchingDots] = useState('');
  const pulseAnim = new Animated.Value(1);

  // Animate searching text
  useEffect(() => {
    const interval = setInterval(() => {
      setSearchingDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Pulse animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();

    return () => pulse.stop();
  }, []);

  // Navigate when driver accepts
  useEffect(() => {
    if (status === 'DRIVER_ASSIGNED' && currentRide?.driver) {
      navigation.navigate('DriverOnWay', { ride: currentRide });
    }
  }, [status, currentRide]);

  const handleCancel = () => {
    Alert.alert(
      'Cancelar Solicitação',
      'Tem certeza que deseja cancelar esta solicitação de corrida?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, Cancelar',
          style: 'destructive',
          onPress: async () => {
            await cancelRide('Cancelled by passenger');
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Map */}
      <Map
        pickup={pickup}
        dropoff={dropoff}
      />

      {/* Overlay Content */}
      <View style={styles.overlay}>
        {/* Searching Animation */}
        <View style={[styles.searchingCard, { backgroundColor: colors.background.primary }]}>
          <Animated.View
            style={[
              styles.iconContainer,
              {
                backgroundColor: colors.primary + '20',
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Text style={styles.icon}>🔍</Text>
          </Animated.View>

          <Text style={[styles.searchingText, { color: colors.text.primary }]}>
            Procurando motorista{searchingDots}
          </Text>

          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Aguarde enquanto encontramos o motorista perfeito para você
          </Text>

          {/* Progress Indicators */}
          <View style={styles.progressContainer}>
            <View style={styles.progressItem}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.progressText, { color: colors.text.tertiary }]}>
                Analisando motoristas próximos
              </Text>
            </View>
          </View>

          {/* Ride Info */}
          <View style={[styles.rideInfo, { backgroundColor: colors.background.secondary }]}>
            <View style={styles.rideInfoRow}>
              <Text style={[styles.rideInfoLabel, { color: colors.text.secondary }]}>
                Origem
              </Text>
              <Text
                style={[styles.rideInfoValue, { color: colors.text.primary }]}
                numberOfLines={1}
              >
                {pickup.address}
              </Text>
            </View>

            <View style={styles.rideInfoRow}>
              <Text style={[styles.rideInfoLabel, { color: colors.text.secondary }]}>
                Destino
              </Text>
              <Text
                style={[styles.rideInfoValue, { color: colors.text.primary }]}
                numberOfLines={1}
              >
                {dropoff.address}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.rideInfoRow}>
              <Text style={[styles.rideInfoLabel, { color: colors.text.secondary }]}>
                Preço Oferecido
              </Text>
              <Text
                style={[
                  styles.priceValue,
                  { color: colors.success, fontWeight: typography.fontWeight.bold },
                ]}
              >
                R$ {estimatedPrice.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Cancel Button */}
          <Button
            variant="ghost"
            onPress={handleCancel}
            style={styles.cancelButton}
          >
            Cancelar Solicitação
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  searchingCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 40,
  },
  searchingText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  progressContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressText: {
    fontSize: typography.fontSize.sm,
  },
  rideInfo: {
    width: '100%',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  rideInfoRow: {
    marginBottom: spacing.sm,
  },
  rideInfoLabel: {
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.xs,
  },
  rideInfoValue: {
    fontSize: typography.fontSize.md,
  },
  priceValue: {
    fontSize: typography.fontSize.xl,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: spacing.sm,
  },
  cancelButton: {
    width: '100%',
  },
});
