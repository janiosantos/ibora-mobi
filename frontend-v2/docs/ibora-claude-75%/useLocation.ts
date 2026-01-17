/**
 * useLocation Hook
 * GPS tracking with expo-location
 * Install: npx expo install expo-location
 */

import { useState, useEffect, useRef } from 'react';
import type { Location } from '../types';

// Try to import expo-location, gracefully handle if not installed
let Location: any;
try {
  Location = require('expo-location');
} catch (e) {
  console.log('expo-location not installed');
}

export interface UseLocationOptions {
  enabled?: boolean;
  accuracy?: 'low' | 'balanced' | 'high' | 'best';
  updateInterval?: number; // milliseconds
  distanceInterval?: number; // meters
}

export const useLocation = (options: UseLocationOptions = {}) => {
  const {
    enabled = false,
    accuracy = 'high',
    updateInterval = 5000, // 5 seconds
    distanceInterval = 10, // 10 meters
  } = options;

  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');
  
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled || !Location) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const setupLocation = async () => {
      try {
        // Request permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (!isMounted) return;
        
        if (status !== 'granted') {
          setPermissionStatus('denied');
          setError('Permission to access location was denied');
          setLoading(false);
          return;
        }

        setPermissionStatus('granted');

        // Get current location once
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: getAccuracyLevel(accuracy),
        });

        if (!isMounted) return;

        setLocation({
          lat: currentLocation.coords.latitude,
          lng: currentLocation.coords.longitude,
          address: '', // Will be filled by reverse geocoding if needed
        });
        setLoading(false);

        // Watch location changes
        subscriptionRef.current = await Location.watchPositionAsync(
          {
            accuracy: getAccuracyLevel(accuracy),
            timeInterval: updateInterval,
            distanceInterval,
          },
          (newLocation) => {
            if (!isMounted) return;
            
            setLocation({
              lat: newLocation.coords.latitude,
              lng: newLocation.coords.longitude,
              address: '',
            });
          }
        );
      } catch (err) {
        if (!isMounted) return;
        
        setError(err instanceof Error ? err.message : 'Failed to get location');
        setLoading(false);
      }
    };

    setupLocation();

    return () => {
      isMounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }
    };
  }, [enabled, accuracy, updateInterval, distanceInterval]);

  const requestPermission = async () => {
    if (!Location) {
      setError('Location service not available');
      return false;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status === 'granted' ? 'granted' : 'denied');
      return status === 'granted';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request permission');
      return false;
    }
  };

  const requestBackgroundPermission = async () => {
    if (!Location) return false;

    try {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      return status === 'granted';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request background permission');
      return false;
    }
  };

  return {
    location,
    error,
    loading,
    permissionStatus,
    requestPermission,
    requestBackgroundPermission,
  };
};

function getAccuracyLevel(accuracy: string) {
  if (!Location) return undefined;
  
  switch (accuracy) {
    case 'low':
      return Location.Accuracy?.Low;
    case 'balanced':
      return Location.Accuracy?.Balanced;
    case 'high':
      return Location.Accuracy?.High;
    case 'best':
      return Location.Accuracy?.BestForNavigation;
    default:
      return Location.Accuracy?.High;
  }
}
