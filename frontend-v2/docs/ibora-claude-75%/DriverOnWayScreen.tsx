/**
 * DriverOnWayScreen - Passenger
 * Shows driver info and location while driver is on the way to pickup
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Map, Avatar, Button } from '../../components';
import { useTheme } from '../../theme';
import { spacing, typography } from '../../theme/tokens';
import { useLocation, useRideRequest } from '../../hooks';
import { Ionicons } from '@expo/vector-icons';
import type { Ride } from '../../types';

interface DriverOnWayScreenProps {
  ride: Ride;
}

export const DriverOnWayScreen: React.FC<DriverOnWayScreenProps> = ({ ride }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { status } = useRideRequest('passenger');
  const [eta, setEta] = useState(5); // minutes
  const driver = ride.driver;

  // Navigate when driver arrives
  useEffect(() => {
    if (status === 'ARRIVED') {
      // Driver has arrived at pickup
      Alert.alert(
        'Motorista Chegou!',
        `${driver?.name} está esperando por você. Código de verificação: ${ride.pin_code}`,
        [{ text: 'OK' }]
      );
    } else if (status === 'IN_PROGRESS') {
      navigation.navigate('TripInProgress', { ride });
    }
  }, [status]);

  // Update ETA (mock - in real app, calculate from driver location)
  useEffect(() => {
    const interval = setInterval(() => {
      setEta((prev) => Math.max(0, prev - 1));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleCall = () => {
    if (driver?.phone) {
      Linking.openURL(`tel:${driver.phone}`);
    }
  };

  const handleMessage = () => {
    navigation.navigate('Chat', { rideId: ride.id });
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar Corrida',
      'Tem certeza que deseja cancelar? Uma taxa de cancelamento pode ser cobrada.',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, Cancelar',
          style: 'destructive',
          onPress: async () => {
            // Cancel ride logic
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Map with driver location */}
      <Map
        pickup={ride.pickup_location}
        dropoff={ride.dropoff_location}
        driverLocation={driver?.location}
      />

      {/* Driver Info Card */}
      <View style={styles.overlay}>
        <View style={[styles.driverCard, { backgroundColor: colors.background.primary }]}>
          {/* ETA Badge */}
          <View style={[styles.etaBadge, { backgroundColor: colors.primary }]}>
            <Ionicons name="time-outline" size={16} color="white" />
            <Text style={styles.etaText}>{eta} min</Text>
          </View>

          {/* Driver Info */}
          <View style={styles.driverInfo}>
            <Avatar
              uri={driver?.avatar_url}
              size={60}
              name={driver?.name}
            />

            <View style={styles.driverDetails}>
              <Text style={[styles.driverName, { color: colors.text.primary }]}>
                {driver?.name}
              </Text>

              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFB800" />
                <Text style={[styles.rating, { color: colors.text.secondary }]}>
                  {driver?.rating?.toFixed(1)} ({driver?.total_trips} corridas)
                </Text>
              </View>

              {/* Vehicle Info */}
              <Text style={[styles.vehicleInfo, { color: colors.text.tertiary }]}>
                {driver?.vehicle?.model} • {driver?.vehicle?.color}
              </Text>
              <Text style={[styles.licensePlate, { color: colors.text.primary }]}>
                {driver?.vehicle?.license_plate}
              </Text>
            </View>
          </View>

          {/* PIN Code */}
          <View style={[styles.pinContainer, { backgroundColor: colors.background.secondary }]}>
            <Text style={[styles.pinLabel, { color: colors.text.tertiary }]}>
              Código de Verificação
            </Text>
            <Text style={[styles.pinCode, { color: colors.primary }]}>
              {ride.pin_code || '5575'}
            </Text>
            <Text style={[styles.pinHint, { color: colors.text.tertiary }]}>
              Mostre este código ao motorista
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={handleCall}
            >
              <Ionicons name="call" size={24} color="white" />
              <Text style={styles.actionButtonText}>Ligar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.success }]}
              onPress={handleMessage}
            >
              <Ionicons name="chatbubble" size={24} color="white" />
              <Text style={styles.actionButtonText}>Mensagem</Text>
            </TouchableOpacity>
          </View>

          {/* Trip Info */}
          <View style={styles.tripInfo}>
            <View style={styles.tripInfoRow}>
              <Ionicons name="location" size={16} color={colors.success} />
              <Text
                style={[styles.tripInfoText, { color: colors.text.secondary }]}
                numberOfLines={1}
              >
                {ride.pickup_location.address}
              </Text>
            </View>

            <View style={styles.tripInfoRow}>
              <Ionicons name="location" size={16} color={colors.error} />
              <Text
                style={[styles.tripInfoText, { color: colors.text.secondary }]}
                numberOfLines={1}
              >
                {ride.dropoff_location.address}
              </Text>
            </View>
          </View>

          {/* Cancel Button */}
          <Button
            variant="ghost"
            onPress={handleCancel}
            style={styles.cancelButton}
          >
            Cancelar Corrida
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  driverCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  etaBadge: {
    position: 'absolute',
    top: -12,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    gap: spacing.xs,
  },
  etaText: {
    color: 'white',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  rating: {
    fontSize: typography.fontSize.sm,
  },
  vehicleInfo: {
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xs,
  },
  licensePlate: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  pinContainer: {
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  pinLabel: {
    fontSize: typography.fontSize.xs,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  pinCode: {
    fontSize: 48,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 8,
    marginBottom: spacing.xs,
  },
  pinHint: {
    fontSize: typography.fontSize.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
  },
  actionButtonText: {
    color: 'white',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  tripInfo: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tripInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tripInfoText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
  },
  cancelButton: {
    marginTop: spacing.sm,
  },
});
