/**
 * Vehicle Type Picker Component
 * Horizontal scrollable list of vehicle types (Bike, Auto, Taxi, etc)
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme';
import { spacing, typography, borderRadius } from '../theme/tokens';
import type { VehicleType } from '../types/passenger';

interface VehicleOption {
  type: VehicleType;
  icon: string;
  label: string;
}

const VEHICLE_OPTIONS: VehicleOption[] = [
  { type: 'bike', icon: '🏍️', label: 'Bike' },
  { type: 'auto', icon: '🛺', label: 'Auto' },
  { type: 'taxi', icon: '🚕', label: 'Taxi' },
  { type: 'hover-board', icon: '🛹', label: 'Hover Board' },
  { type: 'prime-sedan', icon: '🚗', label: 'Prime Sedan' },
];

interface VehicleTypePickerProps {
  selected?: VehicleType;
  onSelect: (type: VehicleType) => void;
}

export const VehicleTypePicker: React.FC<VehicleTypePickerProps> = ({
  selected,
  onSelect,
}) => {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {VEHICLE_OPTIONS.map((option) => {
        const isSelected = selected === option.type;
        
        return (
          <TouchableOpacity
            key={option.type}
            onPress={() => onSelect(option.type)}
            style={[
              styles.option,
              {
                backgroundColor: isSelected 
                  ? colors.background.secondary 
                  : colors.background.primary,
                borderColor: isSelected 
                  ? colors.primary 
                  : colors.border.primary,
              },
            ]}
          >
            <View style={[
              styles.iconContainer,
              {
                backgroundColor: isSelected 
                  ? colors.primary + '20' 
                  : colors.background.tertiary,
              },
            ]}>
              <Text style={styles.icon}>{option.icon}</Text>
            </View>
            
            <Text
              style={[
                styles.label,
                {
                  color: isSelected 
                    ? colors.text.primary 
                    : colors.text.secondary,
                },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  option: {
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    minWidth: 80,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
});
