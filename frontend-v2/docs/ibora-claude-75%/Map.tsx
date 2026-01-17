/**
 * Real Map Component
 * Google Maps / Mapbox integration with fallback to placeholder
 * Install: npm install react-native-maps
 */

import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../theme';
import type { Location } from '../types';

// Try to import react-native-maps, fallback to placeholder if not installed
let MapView: any;
let Marker: any;
let Polyline: any;
let PROVIDER_GOOGLE: any;

try {
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
  Polyline = maps.Polyline;
  PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
} catch (e) {
  // react-native-maps not installed, will use placeholder
  console.log('react-native-maps not installed, using placeholder');
}

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface MapProps {
  pickup?: Location;
  dropoff?: Location;
  currentLocation?: Location;
  driverLocation?: Location;
  route?: Location[];
  onRegionChange?: (region: Region) => void;
  showsUserLocation?: boolean;
  followsUserLocation?: boolean;
}

export const Map: React.FC<MapProps> = ({
  pickup,
  dropoff,
  currentLocation,
  driverLocation,
  route,
  onRegionChange,
  showsUserLocation = true,
  followsUserLocation = false,
}) => {
  const { colors } = useTheme();
  const mapRef = useRef<any>(null);

  // If react-native-maps is not installed, show placeholder
  if (!MapView) {
    const { MapPlaceholder } = require('./MapPlaceholder');
    return (
      <MapPlaceholder
        showRoute={!!(pickup && dropoff)}
        pickupLocation={pickup?.address}
        dropoffLocation={dropoff?.address}
      />
    );
  }

  // Determine initial region
  const initialRegion: Region = {
    latitude: currentLocation?.lat || driverLocation?.lat || pickup?.lat || -18.9186,
    longitude: currentLocation?.lng || driverLocation?.lng || pickup?.lng || -41.5085,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // Auto-fit map to show all markers when they change
  useEffect(() => {
    if (!mapRef.current) return;

    const coordinates = [
      pickup && { latitude: pickup.lat, longitude: pickup.lng },
      dropoff && { latitude: dropoff.lat, longitude: dropoff.lng },
      driverLocation && { latitude: driverLocation.lat, longitude: driverLocation.lng },
    ].filter(Boolean) as { latitude: number; longitude: number }[];

    if (coordinates.length > 1) {
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
          animated: true,
        });
      }, 500);
    }
  }, [pickup, dropoff, driverLocation]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation={showsUserLocation}
        showsMyLocationButton
        showsCompass
        showsScale
        followsUserLocation={followsUserLocation}
        onRegionChangeComplete={onRegionChange}
        mapType="standard"
      >
        {/* Pickup Marker (Green) */}
        {pickup && (
          <Marker
            coordinate={{ latitude: pickup.lat, longitude: pickup.lng }}
            title="Pickup"
            description={pickup.address}
          >
            <View style={[styles.markerContainer, { backgroundColor: '#22C55E' }]}>
              <View style={styles.markerInner} />
            </View>
          </Marker>
        )}

        {/* Dropoff Marker (Red) */}
        {dropoff && (
          <Marker
            coordinate={{ latitude: dropoff.lat, longitude: dropoff.lng }}
            title="Dropoff"
            description={dropoff.address}
          >
            <View style={[styles.markerContainer, { backgroundColor: '#EF4444' }]}>
              <View style={styles.markerInner} />
            </View>
          </Marker>
        )}

        {/* Driver Location Marker (Car icon) */}
        {driverLocation && (
          <Marker
            coordinate={{ latitude: driverLocation.lat, longitude: driverLocation.lng }}
            title="Driver"
            anchor={{ x: 0.5, y: 0.5 }}
            flat
          >
            <View style={[styles.driverMarker, { backgroundColor: colors.primary }]}>
              <View style={styles.carIcon} />
            </View>
          </Marker>
        )}

        {/* Route Polyline */}
        {route && route.length > 1 && (
          <Polyline
            coordinates={route.map(loc => ({ latitude: loc.lat, longitude: loc.lng }))}
            strokeColor={colors.primary}
            strokeWidth={4}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  markerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  driverMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  carIcon: {
    width: 16,
    height: 10,
    backgroundColor: 'white',
    borderRadius: 2,
  },
});
