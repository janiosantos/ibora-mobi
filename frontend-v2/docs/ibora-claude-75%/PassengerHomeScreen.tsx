/**
 * Passenger Home Screen
 * Main screen with map, vehicle selection, and ride request
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  MapPlaceholder,
  VehicleTypePicker,
  LocationInput,
  Button,
} from '../../components';
import { spacing, typography } from '../../theme/tokens';
import { useTheme } from '../../theme';
import type { VehicleType } from '../../types/passenger';
import { mockVehicleOptions } from '../../mock/passengerData';

export const PassengerHomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('auto');
  const [pickup, setPickup] = useState('Lajamni Chowk, Surat, India');
  const [dropoff, setDropoff] = useState('');
  const [stops, setStops] = useState<string[]>([]);

  const handleFindDriver = () => {
    if (!dropoff) {
      alert('Please enter a destination');
      return;
    }
    navigation.navigate('SetPrice');
  };

  const handleAddStop = () => {
    navigation.navigate('SelectDestination');
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapPlaceholder
        pickup={{ lat: -18.9186, lng: -41.5085 }}
        dropoff={dropoff ? { lat: -18.9100, lng: -41.5000 } : undefined}
      />

      {/* Header Overlay */}
      <SafeAreaView style={styles.header} edges={['top']}>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: colors.background.primary }]}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu" size={24} color={colors.text.primary} />
        </TouchableOpacity>

        <View style={[styles.locationBadge, { backgroundColor: colors.background.primary }]}>
          <Ionicons name="location" size={16} color={colors.success} />
          <Text style={[styles.locationText, { color: colors.text.secondary }]}>
            Your Current Location
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: colors.background.primary }]}
        >
          <Ionicons name="locate" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Bottom Sheet */}
      <View style={[styles.bottomSheet, { backgroundColor: colors.background.primary }]}>
        <View style={styles.handle} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Vehicle Type Picker */}
          <VehicleTypePicker
            selected={selectedVehicle}
            onSelect={setSelectedVehicle}
          />

          {/* Location Inputs */}
          <View style={styles.locationSection}>
            <LocationInput
              value={pickup}
              onChangeText={setPickup}
              placeholder="Pickup location"
              type="pickup"
              onPress={() => navigation.navigate('SelectLocation', { type: 'pickup' })}
            />

            <LocationInput
              value={dropoff}
              onChangeText={setDropoff}
              placeholder="To"
              type="dropoff"
              onClear={() => setDropoff('')}
              onPress={() => navigation.navigate('SelectLocation', { type: 'dropoff' })}
            />

            {stops.length > 0 && (
              <TouchableOpacity
                style={styles.stopsButton}
                onPress={() => navigation.navigate('ManageStops')}
              >
                <Ionicons name="location" size={20} color={colors.danger} />
                <Text style={[styles.stopsText, { color: colors.text.primary }]}>
                  {stops.length} route stops
                </Text>
                <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Offer Fare */}
          <TouchableOpacity
            style={styles.offerFare}
            onPress={() => navigation.navigate('SetPrice')}
          >
            <Ionicons name="cash-outline" size={20} color={colors.text.secondary} />
            <Text style={[styles.offerText, { color: colors.text.secondary }]}>
              Offer your fare
            </Text>
          </TouchableOpacity>

          {/* Find Driver Button */}
          <Button
            variant="primary"
            size="large"
            fullWidth
            onPress={handleFindDriver}
          >
            Find a driver
          </Button>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  locationBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 22,
    gap: spacing.xs,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  locationText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: spacing.xl,
    maxHeight: '60%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#DEDEDE',
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: spacing.md,
  },
  locationSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  stopsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stopsText: {
    flex: 1,
    fontSize: typography.fontSize.base,
  },
  offerFare: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  offerText: {
    fontSize: typography.fontSize.base,
  },
});
