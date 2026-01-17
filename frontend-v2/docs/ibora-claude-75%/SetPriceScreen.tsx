/**
 * Set Price Screen
 * Adjust ride price, select payment method, and apply coupons
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  MapPlaceholder,
  PriceSlider,
  Button,
} from '../../components';
import { spacing, typography, borderRadius } from '../../theme/tokens';
import { useTheme } from '../../theme';

export const SetPriceScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const [price, setPrice] = useState(90);
  const [autoBook, setAutoBook] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('Cash');
  const [appliedCoupon, setAppliedCoupon] = useState('test');

  const handleBook = () => {
    // Navigate to waiting screen or trigger ride request
    navigation.navigate('WaitingDriver');
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Map Background */}
      <MapPlaceholder
        pickup={{ lat: -18.9186, lng: -41.5085 }}
        dropoff={{ lat: -18.9100, lng: -41.5000 }}
      />

      {/* Back Button */}
      <SafeAreaView style={styles.backButton} edges={['top', 'left']}>
        <TouchableOpacity
          onPress={handleCancel}
          style={[styles.iconButton, { backgroundColor: colors.background.primary }]}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Price Sheet */}
      <View style={[styles.sheet, { backgroundColor: colors.background.primary }]}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Set your price
        </Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          💡 Raise the fare, increase your chances.
        </Text>

        {/* Price Slider */}
        <PriceSlider
          value={price}
          min={20}
          max={200}
          onChange={setPrice}
          step={1}
        />

        {/* Auto Book */}
        <View style={[styles.option, { backgroundColor: colors.background.secondary }]}>
          <View style={styles.optionContent}>
            <Text style={styles.optionIcon}>🔄</Text>
            <Text style={[styles.optionText, { color: colors.text.primary }]}>
              Automatically book the nearest{'\n'}driver for (${price})
            </Text>
          </View>
          <Switch
            value={autoBook}
            onValueChange={setAutoBook}
            trackColor={{ false: colors.border.secondary, true: colors.primary }}
            thumbColor={colors.background.primary}
          />
        </View>

        {/* Payment Method */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('PaymentMethod')}
        >
          <View style={styles.rowContent}>
            <Text style={styles.rowIcon}>💵</Text>
            <Text style={[styles.rowText, { color: colors.text.primary }]}>
              {selectedPayment}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>

        {/* Coupon */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('Coupons')}
        >
          <View style={styles.rowContent}>
            <Text style={styles.rowIcon}>🎟️</Text>
            <Text style={[styles.rowText, { color: colors.text.primary }]}>
              {appliedCoupon ? appliedCoupon : 'Coupon'}
            </Text>
          </View>
          {appliedCoupon && (
            <Text style={[styles.appliedBadge, { color: colors.success }]}>
              Coupon applied
            </Text>
          )}
          <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>

        {/* Action Buttons */}
        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={handleBook}
        >
          Book for ${price}
        </Button>

        <Button
          variant="ghost"
          size="large"
          fullWidth
          onPress={handleCancel}
        >
          Cancel Request
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: spacing.md,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  optionIcon: {
    fontSize: 24,
  },
  optionText: {
    fontSize: typography.fontSize.sm,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  rowIcon: {
    fontSize: 20,
  },
  rowText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  appliedBadge: {
    fontSize: typography.fontSize.xs,
    marginRight: spacing.sm,
  },
});
