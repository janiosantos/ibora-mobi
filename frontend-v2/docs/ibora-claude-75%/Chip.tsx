import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors, spacing, radius, typography } from '../theme/tokens';
import { useTheme } from '../theme';

export type ChipVariant = 'filled' | 'outlined' | 'ghost';

interface ChipProps {
  label: string;
  selected?: boolean;
  variant?: ChipVariant;
  icon?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  variant = 'outlined',
  icon,
  onPress,
  disabled = false,
}) => {
  const { colors: themeColors } = useTheme();
  
  const getBackgroundColor = () => {
    if (disabled) return themeColors.surface;
    if (variant === 'filled' || selected) return colors.primary;
    if (variant === 'outlined') return 'transparent';
    return themeColors.surface;
  };
  
  const getTextColor = () => {
    if (disabled) return themeColors.text.disabled;
    if (variant === 'filled' || selected) return '#FFFFFF';
    return themeColors.text.primary;
  };
  
  const getBorderColor = () => {
    if (disabled) return themeColors.border;
    if (selected) return colors.primary;
    if (variant === 'outlined') return colors.primary;
    return 'transparent';
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
      ]}
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.7}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        style={[
          styles.label,
          {
            color: getTextColor(),
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1.5,
    gap: spacing.xs,
  },
  icon: {
    width: 20,
    height: 20,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
});
