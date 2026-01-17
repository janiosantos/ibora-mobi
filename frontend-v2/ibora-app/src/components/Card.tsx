import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { spacing, radius, shadows } from '../theme/tokens';
import { useTheme } from '../theme';

export type CardVariant = 'default' | 'elevated' | 'outlined';

interface CardProps extends ViewProps {
  variant?: CardVariant;
  padding?: number;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = spacing.base,
  children,
  style,
  ...props
}) => {
  const { colors } = useTheme();
  
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: colors.background,
          padding,
        },
        variant === 'elevated' && shadows.md,
        variant === 'outlined' && {
          borderWidth: 1,
          borderColor: colors.border,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
  },
});
