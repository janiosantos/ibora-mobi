/**
 * Payment Method Selector Component
 * Radio list of payment methods (Wallet, Card, Cash, QR, Bank)
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../theme';
import { spacing, typography, borderRadius } from '../theme/tokens';
import type { PaymentMethod } from '../types/passenger';

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selected?: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

const getPaymentIcon = (type: string) => {
  const icons: Record<string, string> = {
    wallet: '💳',
    card: '💳',
    cash: '💵',
    qr: '📱',
    bank: '🏦',
  };
  return icons[type] || '💳';
};

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  methods,
  selected,
  onSelect,
}) => {
  const { colors } = useTheme();

  return (
    <ScrollView style={styles.container}>
      {methods.map((method) => {
        const isSelected = selected?.id === method.id;
        
        return (
          <TouchableOpacity
            key={method.id}
            onPress={() => onSelect(method)}
            style={[
              styles.method,
              {
                backgroundColor: isSelected 
                  ? colors.primary + '10' 
                  : colors.background.primary,
                borderColor: isSelected 
                  ? colors.primary 
                  : colors.border.primary,
              },
            ]}
          >
            <View style={styles.content}>
              <View style={[
                styles.icon,
                { backgroundColor: colors.background.secondary },
              ]}>
                <Text style={styles.iconText}>
                  {getPaymentIcon(method.type)}
                </Text>
              </View>

              <View style={styles.info}>
                <Text style={[styles.name, { color: colors.text.primary }]}>
                  {method.name}
                </Text>
                <Text style={[styles.description, { color: colors.text.secondary }]}>
                  {method.description}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.radio,
                {
                  borderColor: isSelected ? colors.primary : colors.border.secondary,
                  backgroundColor: isSelected ? colors.primary : 'transparent',
                },
              ]}
            >
              {isSelected && (
                <View style={[styles.radioInner, { backgroundColor: colors.background.primary }]} />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    marginBottom: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 28,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.fontSize.sm,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
  },
});
