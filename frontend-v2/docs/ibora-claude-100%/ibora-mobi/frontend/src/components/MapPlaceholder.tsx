import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/tokens';
import { useTheme } from '../theme';

interface MapPlaceholderProps extends ViewProps {
  showRoute?: boolean;
  pickupLocation?: string;
  dropoffLocation?: string;
}

export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({
  showRoute = false,
  pickupLocation,
  dropoffLocation,
  style,
  ...props
}) => {
  const { colors: themeColors } = useTheme();
  
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.surfaceAlt,
        },
        style,
      ]}
      {...props}
    >
      {/* Map grid pattern */}
      <View style={styles.gridContainer}>
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <View key={rowIndex} style={styles.gridRow}>
            {Array.from({ length: 4 }).map((_, colIndex) => (
              <View
                key={colIndex}
                style={[
                  styles.gridCell,
                  {
                    borderColor: themeColors.border,
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
      
      {/* Map icons */}
      {showRoute ? (
        <View style={styles.routeContainer}>
          {/* Pickup marker */}
          <View style={styles.markerContainer}>
            <Ionicons name="location" size={40} color={colors.map.pickup} />
            {pickupLocation && (
              <View
                style={[
                  styles.locationLabel,
                  {
                    backgroundColor: themeColors.background,
                  },
                ]}
              >
                <Text
                  style={[styles.locationText, { color: themeColors.text.primary }]}
                  numberOfLines={1}
                >
                  {pickupLocation}
                </Text>
              </View>
            )}
          </View>
          
          {/* Route line */}
          <View style={[styles.routeLine, { backgroundColor: colors.map.route }]} />
          
          {/* Dropoff marker */}
          <View style={styles.markerContainer}>
            <Ionicons name="location" size={40} color={colors.map.dropoff} />
            {dropoffLocation && (
              <View
                style={[
                  styles.locationLabel,
                  {
                    backgroundColor: themeColors.background,
                  },
                ]}
              >
                <Text
                  style={[styles.locationText, { color: themeColors.text.primary }]}
                  numberOfLines={1}
                >
                  {dropoffLocation}
                </Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.centerIcon}>
          <Ionicons name="map-outline" size={64} color={themeColors.text.tertiary} />
          <Text style={[styles.placeholder, { color: themeColors.text.tertiary }]}>
            Mapa
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  gridContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
  },
  gridCell: {
    flex: 1,
    borderWidth: 0.5,
  },
  centerIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    fontSize: typography.fontSize.md,
    marginTop: spacing.sm,
  },
  routeContainer: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: [{ translateX: -100 }],
    alignItems: 'center',
    width: 200,
  },
  markerContainer: {
    alignItems: 'center',
    width: '100%',
  },
  locationLabel: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    maxWidth: '90%',
  },
  locationText: {
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
  },
  routeLine: {
    width: 3,
    height: 120,
    marginVertical: spacing.sm,
  },
});
