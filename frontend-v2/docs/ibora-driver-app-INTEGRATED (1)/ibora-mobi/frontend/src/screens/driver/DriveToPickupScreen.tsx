import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, Avatar, MapPlaceholder } from '../../components';
import { colors, spacing, typography, radius } from '../../theme/tokens';
import { useTheme } from '../../theme';
import { mockActiveRide } from '../../mock/data';

export const DriveToPickupScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const { colors: themeColors } = useTheme();
  const [ride] = useState(mockActiveRide);
  const [timer, setTimer] = useState({ minutes: 0, seconds: 9, totalSeconds: 580 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        const newTotal = prev.totalSeconds + 1;
        return {
          minutes: Math.floor(newTotal / 60),
          seconds: newTotal % 60,
          totalSeconds: newTotal,
        };
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const formatTime = () => {
    const mins = String(timer.minutes).padStart(2, '0');
    const secs = String(timer.seconds).padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  const handleArrived = () => {
    navigation.replace('StartRide');
  };
  
  return (
    <View style={styles.container}>
      {/* Map */}
      <MapPlaceholder
        showRoute
        pickupLocation={ride.pickup.address}
        dropoffLocation={ride.dropoff.address}
      />
      
      {/* Top bar */}
      <SafeAreaView style={styles.topBar}>
        <View style={[styles.headerCard, { backgroundColor: themeColors.background }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={themeColors.text.primary} />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={[styles.headerTitle, { color: themeColors.text.primary }]}>
              Drive to pickup
            </Text>
            <Text style={[styles.headerSubtitle, { color: themeColors.text.secondary }]}>
              Please don't be late
            </Text>
          </View>
          
          <View style={styles.timer}>
            <Text style={[styles.timerText, { color: colors.primary }]}>
              00:{formatTime()}
            </Text>
          </View>
          
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color={themeColors.text.primary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      
      {/* Navigate button */}
      <View style={styles.navigateButton}>
        <TouchableOpacity
          style={[styles.navButton, { backgroundColor: colors.dark.background }]}
        >
          <Ionicons name="navigate" size={20} color="#FFFFFF" />
          <Text style={styles.navText}>Navigate</Text>
        </TouchableOpacity>
      </View>
      
      {/* Bottom sheet with passenger details */}
      <View style={styles.bottomContainer}>
        <View style={[styles.sheet, { backgroundColor: themeColors.background }]}>
          {/* Passenger Info */}
          <View style={styles.passengerSection}>
            <View style={styles.passengerHeader}>
              <Avatar
                size="lg"
                name={ride.passenger.full_name}
                badge="online"
              />
              <View style={styles.passengerInfo}>
                <Text style={[styles.passengerName, { color: themeColors.text.primary }]}>
                  {ride.passenger.full_name}
                </Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={16} color={colors.map.pickup} />
                  <Text
                    style={[styles.locationText, { color: themeColors.text.secondary }]}
                    numberOfLines={2}
                  >
                    {ride.pickup.address}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Price */}
          <View style={styles.priceSection}>
            <Text style={[styles.price, { color: themeColors.text.primary }]}>
              ${ride.estimated_price.toFixed(2)}
            </Text>
          </View>
          
          {/* Contact Buttons */}
          <View style={styles.contactButtons}>
            <TouchableOpacity
              style={[
                styles.contactButton,
                { backgroundColor: colors.transparent.primary },
              ]}
            >
              <Ionicons name="call" size={24} color={colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.contactButton,
                { backgroundColor: colors.transparent.primary },
              ]}
              onPress={() => navigation.navigate('Chat')}
            >
              <Ionicons name="chatbubble" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          {/* Action Button */}
          <Button
            variant="primary"
            size="large"
            fullWidth
            onPress={handleArrived}
          >
            I'm here
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
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    gap: spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.sm,
  },
  timer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  timerText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  navigateButton: {
    position: 'absolute',
    left: spacing.base,
    bottom: 300,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    gap: spacing.xs,
  },
  navText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
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
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  locationText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
  },
  priceSection: {
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  price: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.base,
  },
  contactButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
});
