/**
 * Location Input Component
 * Input field with location marker icon (green for pickup, red for dropoff)
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { spacing, typography, borderRadius, layout } from '../theme/tokens';

interface LocationInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  type: 'pickup' | 'dropoff';
  onClear?: () => void;
  onPress?: () => void;
  editable?: boolean;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChangeText,
  placeholder,
  type,
  onClear,
  onPress,
  editable = true,
}) => {
  const { colors } = useTheme();
  
  const markerColor = type === 'pickup' ? colors.success : colors.danger;
  const markerIcon = type === 'pickup' ? 'location' : 'location';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
          },
        ]}
      >
        <View style={[styles.marker, { backgroundColor: markerColor }]}>
          <Ionicons name={markerIcon} size={16} color={colors.background.primary} />
        </View>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.tertiary}
          style={[
            styles.input,
            {
              color: colors.text.primary,
            },
          ]}
          editable={editable && !onPress}
        />

        {value && onClear && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    height: layout.inputHeight,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: spacing.md,
  },
  marker: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.base,
    height: '100%',
  },
  clearButton: {
    padding: spacing.xs,
  },
});
