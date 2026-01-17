/**
 * Price Slider Component
 * Slider to adjust ride price with +/- buttons
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { spacing, typography, borderRadius } from '../theme/tokens';

interface PriceSliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  step?: number;
}

export const PriceSlider: React.FC<PriceSliderProps> = ({
  value,
  min,
  max,
  onChange,
  step = 1,
}) => {
  const { colors } = useTheme();

  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleDecrement}
        style={[
          styles.button,
          {
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          },
        ]}
        disabled={value <= min}
      >
        <Ionicons
          name="remove"
          size={24}
          color={value <= min ? colors.text.disabled : colors.text.primary}
        />
      </TouchableOpacity>

      <View style={styles.sliderContainer}>
        <Text style={[styles.value, { color: colors.text.primary }]}>
          {Math.round(value)}
        </Text>
        
        <Slider
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          value={value}
          onValueChange={onChange}
          step={step}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.border.secondary}
          thumbTintColor={colors.primary}
        />
      </View>

      <TouchableOpacity
        onPress={handleIncrement}
        style={[
          styles.button,
          {
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          },
        ]}
        disabled={value >= max}
      >
        <Ionicons
          name="add"
          size={24}
          color={value >= max ? colors.text.disabled : colors.text.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderContainer: {
    flex: 1,
    alignItems: 'center',
  },
  value: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});
