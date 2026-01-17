/**
 * TripInProgressScreen - Universal
 * Shows trip in progress for both Driver and Passenger
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Map, Button } from '../../components';
import { useTheme } from '../../theme';
import { spacing, typography } from '../../theme/tokens';
import { useLocation, useRideRequest } from '../../hooks';
import { Ionicons } from '@expo/vector-icons';
import type { Ride } from '../../types';

interface TripInProgressScreenProps {
  ride: Ride;
  userType: 'driver' | 'passenger';
}

export const TripInProgressScreen: React.FC<TripInProgressScreenProps> = ({
  ride,
  userType,
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { location } = useLocation({ enabled: userType === 'driver' });
  const { status, finishRide } = useRideRequest(userType);
  
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentDistance, setCurrentDistance] = useState(0);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate distance (mock - in real app, use GPS)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDistance((prev) => prev + 0.1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Navigate when trip completes
  useEffect(() => {
    if (status === 'COMPLETED') {
      navigation.navigate('TripCompleted', { ride });
    }
  }, [status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinish = async () => {
    if (userType !== 'driver') return;

    Alert.alert(
      'Finalizar Corrida',
      'Confirma que chegou ao destino?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, Finalizar',
          onPress: async () => {
            await finishRide();
          },
        },
      ]
    );
  };

  const handleEmergency = () => {
    Alert.alert(
      'Emergência',
      'Deseja ligar para a emergência (190)?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Ligar 190',
          style: 'destructive',
          onPress: () => {
            // Linking.openURL('tel:190');
          },
        },
      ]
    );
  };

  const handleChat = () => {
    navigation.navigate('Chat', { rideId: ride.id });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Map */}
      <Map
        pickup={ride.pickup_location}
        dropoff={ride.dropoff_location}
        driverLocation={userType === 'driver' ? location : ride.driver?.location}
        route={ride.route}
        followsUserLocation={userType === 'driver'}
      />

      {/* Trip Info Overlay */}
      <View style={styles.topOverlay}>
        {/* Timer & Distance Card */}
        <View style={[styles.statsCard, { backgroundColor: colors.background.primary }]}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
              {formatTime(elapsedTime)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.tertiary }]}>
              Tempo
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Ionicons name="navigate-outline" size={20} color={colors.success} />
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
              {currentDistance.toFixed(1)} km
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.tertiary }]}>
              Distância
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Ionicons name="cash-outline" size={20} color={colors.warning} />
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
              R$ {ride.final_price?.toFixed(2) || ride.estimated_price?.toFixed(2)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.tertiary }]}>
              Preço
            </Text>
          </View>
        </View>

        {/* Emergency Button */}
        <TouchableOpacity
          style={[styles.emergencyButton, { backgroundColor: colors.error }]}
          onPress={handleEmergency}
        >
          <Ionicons name="warning" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Bottom Card */}
      <View style={styles.bottomOverlay}>
        <View style={[styles.bottomCard, { backgroundColor: colors.background.primary }]}>
          {/* Destination Info */}
          <View style={styles.destinationInfo}>
            <View style={styles.destinationIcon}>
              <Ionicons name="location" size={24} color={colors.error} />
            </View>
            <View style={styles.destinationText}>
              <Text style={[styles.destinationLabel, { color: colors.text.tertiary }]}>
                Destino
              </Text>
              <Text
                style={[styles.destinationAddress, { color: colors.text.primary }]}
                numberOfLines={2}
              >
                {ride.dropoff_location.address}
              </Text>
            </View>
          </View>

          {/* ETA */}
          <View style={[styles.etaContainer, { backgroundColor: colors.background.secondary }]}>
            <Text style={[styles.etaLabel, { color: colors.text.tertiary }]}>
              Chegada Estimada
            </Text>
            <Text style={[styles.etaValue, { color: colors.primary }]}>
              {Math.max(0, Math.floor((ride.estimated_duration_min || 10) - elapsedTime / 60))} min
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {/* Chat Button */}
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={handleChat}
            >
              <Ionicons name="chatbubble-outline" size={24} color="white" />
            </TouchableOpacity>

            {/* Finish Button (Driver Only) */}
            {userType === 'driver' && (
              <Button
                onPress={handleFinish}
                style={styles.finishButton}
              >
                Finalizar Corrida
              </Button>
            )}

            {/* Info Button (Passenger Only) */}
            {userType === 'passenger' && (
              <View style={styles.passengerInfo}>
                <Ionicons name="information-circle" size={20} color={colors.primary} />
                <Text style={[styles.passengerInfoText, { color: colors.text.secondary }]}>
                  Seu motorista está a caminho do destino
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingTop: spacing.xl + 20,
  },
  statsCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: spacing.sm,
  },
  emergencyButton: {
    position: 'absolute',
    top: spacing.xl + 20,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  bottomCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  destinationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  destinationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinationText: {
    flex: 1,
  },
  destinationLabel: {
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.xs,
  },
  destinationAddress: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  etaLabel: {
    fontSize: typography.fontSize.sm,
  },
  etaValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishButton: {
    flex: 1,
  },
  passengerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  passengerInfoText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
  },
});
