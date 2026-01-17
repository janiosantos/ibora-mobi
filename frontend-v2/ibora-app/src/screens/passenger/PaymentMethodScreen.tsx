/**
 * Payment Method Screen
 * Select payment method for ride
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaymentMethodSelector, Button } from '../../components';
import { spacing, typography } from '../../theme/tokens';
import { useTheme } from '../../theme';
import { mockPaymentMethods } from '../../mock/passengerData';
import type { PaymentMethod } from '../../types/passenger';

export const PaymentMethodScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const [selected, setSelected] = useState<PaymentMethod>(mockPaymentMethods[2]); // Cash default

  const handleContinue = () => {
    // Save selected payment method and go back
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Payment Getway Method
        </Text>
      </View>

      {/* Payment Methods */}
      <PaymentMethodSelector
        methods={mockPaymentMethods}
        selected={selected}
        onSelect={setSelected}
      />

      {/* Continue Button */}
      <View style={styles.footer}>
        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={handleContinue}
        >
          CONTINUE
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  footer: {
    padding: spacing.lg,
  },
});
