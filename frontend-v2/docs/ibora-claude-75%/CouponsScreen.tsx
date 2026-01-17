/**
 * Coupons Screen
 * List of available coupons to apply
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CouponCard } from '../../components';
import { spacing, typography } from '../../theme/tokens';
import { useTheme } from '../../theme';
import { mockCoupons } from '../../mock/passengerData';
import type { Coupon } from '../../types/passenger';

export const CouponsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const handleApply = (coupon: Coupon) => {
    setAppliedCoupon(coupon);
    // Navigate back or update parent state
    setTimeout(() => {
      navigation.goBack();
    }, 500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
          All coupons
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Coupons List */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.section, { color: colors.text.primary }]}>
          Best Coupon
        </Text>

        {mockCoupons.map((coupon) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            onApply={handleApply}
            isApplied={appliedCoupon?.id === coupon.id}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: spacing.lg,
  },
  section: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.lg,
  },
});
