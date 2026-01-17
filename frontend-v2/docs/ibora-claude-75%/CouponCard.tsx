/**
 * Coupon Card Component
 * Display coupon information with apply button
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme';
import { spacing, typography, borderRadius } from '../theme/tokens';
import { Button } from './Button';
import type { Coupon } from '../types/passenger';

interface CouponCardProps {
  coupon: Coupon;
  onApply?: (coupon: Coupon) => void;
  isApplied?: boolean;
}

export const CouponCard: React.FC<CouponCardProps> = ({
  coupon,
  onApply,
  isApplied,
}) => {
  const { colors } = useTheme();

  const formatDiscount = () => {
    if (coupon.discount_type === 'percentage') {
      return `${coupon.discount_value}% off`;
    }
    return `$${coupon.discount_value} off`;
  };

  const formatExpiry = (date: string) => {
    const expiryDate = new Date(date);
    return expiryDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background.primary,
          borderColor: isApplied ? colors.success : colors.border.primary,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            {coupon.title}
          </Text>
          <View style={[styles.badge, { backgroundColor: colors.warning + '20' }]}>
            <Text style={styles.badgeIcon}>✂️</Text>
          </View>
        </View>

        <Text style={[styles.description, { color: colors.text.secondary }]}>
          {formatDiscount()}
        </Text>

        <View style={styles.details}>
          <Text style={[styles.detailText, { color: colors.text.tertiary }]}>
            Coupon Code: <Text style={styles.code}>{coupon.code}</Text>
          </Text>
          <Text style={[styles.detailText, { color: colors.text.tertiary }]}>
            Coupon Amount: ${coupon.discount_value}
          </Text>
          <Text style={[styles.detailText, { color: colors.text.tertiary }]}>
            Minimum Amount: ${coupon.min_amount}
          </Text>
          <Text style={[styles.detailText, { color: colors.text.tertiary }]}>
            Ex Date: {formatExpiry(coupon.expires_at)}
          </Text>
        </View>

        {onApply && (
          <Button
            variant={isApplied ? 'secondary' : 'outline'}
            size="small"
            onPress={() => onApply(coupon)}
            disabled={isApplied}
          >
            {isApplied ? 'Applied' : 'Apply coupons'}
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  content: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    flex: 1,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIcon: {
    fontSize: 24,
  },
  description: {
    fontSize: typography.fontSize.base,
  },
  details: {
    gap: spacing.xs,
  },
  detailText: {
    fontSize: typography.fontSize.sm,
  },
  code: {
    fontWeight: typography.fontWeight.bold,
    color: '#5B51FF',
  },
});
