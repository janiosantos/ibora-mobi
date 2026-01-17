import React from 'react';
import { View, Text, Image, StyleSheet, ViewProps } from 'react-native';
import { colors, layout, typography } from '../theme/tokens';
import { useTheme } from '../theme';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps extends ViewProps {
  size?: AvatarSize;
  source?: { uri: string } | number;
  name?: string;
  badge?: 'online' | 'offline' | 'busy';
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  source,
  name,
  badge,
  style,
  ...props
}) => {
  const { colors: themeColors } = useTheme();
  const avatarSize = layout.avatarSize[size];
  
  const getInitials = (fullName?: string): string => {
    if (!fullName) return '?';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return fullName[0].toUpperCase();
  };
  
  const getBadgeColor = () => {
    switch (badge) {
      case 'online':
        return colors.success;
      case 'offline':
        return colors.light.text.disabled;
      case 'busy':
        return colors.warning;
      default:
        return 'transparent';
    }
  };
  
  return (
    <View
      style={[
        styles.container,
        {
          width: avatarSize,
          height: avatarSize,
        },
        style,
      ]}
      {...props}
    >
      {source ? (
        <Image
          source={source}
          style={[
            styles.image,
            {
              width: avatarSize,
              height: avatarSize,
            },
          ]}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: avatarSize,
              height: avatarSize,
              backgroundColor: colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.initials,
              {
                fontSize: avatarSize * 0.4,
              },
            ]}
          >
            {getInitials(name)}
          </Text>
        </View>
      )}
      
      {badge && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: getBadgeColor(),
              width: avatarSize * 0.3,
              height: avatarSize * 0.3,
              borderColor: themeColors.background,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    borderRadius: 9999,
  },
  placeholder: {
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.bold,
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 9999,
    borderWidth: 2,
  },
});
