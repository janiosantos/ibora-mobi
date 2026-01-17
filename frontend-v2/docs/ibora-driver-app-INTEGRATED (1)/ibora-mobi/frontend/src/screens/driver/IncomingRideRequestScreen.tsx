import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, Avatar, MapPlaceholder, BottomSheet } from '../../components';
import { colors, spacing, typography, radius } from '../../theme/tokens';
import { useTheme } from '../../theme';
import { mockRideRequests } from '../../mock/data';
import type { RideRequest } from '../../types';

const { width } = Dimensions.get('window');

export const IncomingRideRequestScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const { colors: themeColors } = useTheme();
  const [rideRequest] = useState<RideRequest>(mockRideRequests[0]);
  const [timeLeft, setTimeLeft] = useState(30);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-reject on timeout
          navigation.goBack();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleAccept = () => {
    navigation.replace('DriveToPickup');
  };
  
  const handleReject = () => {
    navigation.goBack();
  };
  
  return (
    <View style={styles.container}>
      {/* Map */}
      <MapPlaceholder
        showRoute
        pickupLocation={rideRequest.pickup.address}
        dropoffLocation={rideRequest.dropoff.address}
      />
      
      {/* Top bar */}
      <SafeAreaView style={styles.topBar}>
        <TouchableOpacity
          style={[styles.cancelButton, { backgroundColor: themeColors.background }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color={themeColors.text.primary} />
          <Text style={[styles.cancelText, { color: themeColors.text.primary }]}>
            Cancel
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
      
      {/* Bottom sheet with ride details */}
      <View style={styles.bottomContainer}>
        <View style={[styles.sheet, { backgroundColor: themeColors.background }]}>
          {/* Passenger Info */}
          <View style={styles.passengerSection}>
            <View style={styles.passengerHeader}>
              <Avatar
                size="lg"
                name={rideRequest.passenger.full_name}
                badge="online"
              />
              <View style={styles.passengerInfo}>
                <Text style={[styles.passengerName, { color: themeColors.text.primary }]}>
                  {rideRequest.passenger.full_name}
                </Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={16} color={colors.warning} />
                  <Text style={[styles.ratingText, { color: themeColors.text.secondary }]}>
                    {rideRequest.passenger.rating.toFixed(1)}({rideRequest.passenger.total_trips})
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Trip Details */}
          <View style={styles.tripDetails}>
            {/* Pickup */}
            <View style={styles.locationRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="location" size={20} color={colors.map.pickup} />
              </View>
              <Text
                style={[styles.locationText, { color: themeColors.text.primary }]}
                numberOfLines={1}
              >
                {rideRequest.pickup.address}
              </Text>
            </View>
            
            {/* Dropoff */}
            <View style={styles.locationRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="location" size={20} color={colors.map.dropoff} />
              </View>
              <Text
                style={[styles.locationText, { color: themeColors.text.primary }]}
                numberOfLines={1}
              >
                {rideRequest.dropoff.address}
              </Text>
            </View>
          </View>
          
          {/* Price and Distance */}
          <View style={styles.priceSection}>
            <View style={styles.priceCard}>
              <Text style={[styles.price, { color: themeColors.text.primary }]}>
                ${rideRequest.estimated_price.toFixed(2)}
              </Text>
              <View style={styles.priceDetails}>
                <Text style={[styles.priceDetail, { color: themeColors.text.secondary }]}>
                  ${rideRequest.price_per_km.toFixed(2)}/Km
                </Text>
                <Text style={[styles.priceDetail, { color: colors.success }]}>
                  {rideRequest.estimated_distance_km.toFixed(1)} km
                </Text>
              </View>
            </View>
            
            <View style={[styles.paymentBadge, { backgroundColor: colors.transparent.primary }]}>
              <Ionicons name="card-outline" size={16} color={colors.primary} />
              <Text style={[styles.paymentText, { color: colors.primary }]}>
                Payment by card
              </Text>
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actions}>
            <Button
              variant="primary"
              size="large"
              fullWidth
              onPress={handleAccept}
              style={{ backgroundColor: colors.success }}
            >
              Accept For ${rideRequest.estimated_price.toFixed(2)}
            </Button>
            
            <Button
              variant="danger"
              size="large"
              fullWidth
              onPress={handleReject}
            >
              Reject
            </Button>
          </View>
          
          {/* Timer */}
          <View style={styles.timerContainer}>
            <Text style={[styles.timerText, { color: themeColors.text.tertiary }]}>
              Auto-reject in {timeLeft}s
            </Text>
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
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    gap: spacing.xs,
  },
  cancelText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.base,
  },
  passengerSection: {
    marginBottom: spacing.base,
  },
  passengerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ratingText: {
    fontSize: typography.fontSize.sm,
  },
  tripDetails: {
    marginBottom: spacing.base,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
  },
  locationText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
  },
  priceSection: {
    marginBottom: spacing.base,
  },
  priceCard: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  price: {
    fontSize: typography.fontSize.huge,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  priceDetails: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  priceDetail: {
    fontSize: typography.fontSize.base,
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    gap: spacing.xs,
  },
  paymentText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  actions: {
    gap: spacing.md,
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  timerText: {
    fontSize: typography.fontSize.sm,
  },
});
