import { useRef, useEffect } from 'react';
import { Animated, Platform } from 'react-native';
import { NearbyDriver } from '../api/driver';

// Helper to check if using native driver (maps usually support it for marker coords?)
// Actually, MapView.Marker coordinate prop usually takes raw values, but if we use Animated.View
// or Marker.Animated, we can use Animated.Value.
// react-native-maps supports Marker.Animated which takes AnimatedRegion or Animated.ValueXY.
// But here I'll use simple Animated.Value for lat/lng to be flexible.

export const useDriverAnimation = (drivers: NearbyDriver[]) => {
    const animatedDrivers = useRef<Map<string, { lat: Animated.Value; lng: Animated.Value }>>(new Map());

    // Clean up old drivers
    useEffect(() => {
        const currentIds = new Set(drivers.map(d => d.id));
        for (const [id] of animatedDrivers.current) {
            if (!currentIds.has(id)) {
                animatedDrivers.current.delete(id);
            }
        }
    }, [drivers]);

    useEffect(() => {
        drivers.forEach(driver => {
            if (!animatedDrivers.current.has(driver.id)) {
                // New driver - add
                animatedDrivers.current.set(driver.id, {
                    lat: new Animated.Value(driver.latitude),
                    lng: new Animated.Value(driver.longitude),
                });
            } else {
                // Existing driver - animate
                const animated = animatedDrivers.current.get(driver.id);
                if (animated) {
                    Animated.parallel([
                        Animated.timing(animated.lat, {
                            toValue: driver.latitude,
                            duration: 5000, // Animate over 5 seconds (until next poll?)
                            useNativeDriver: false, // Coordinate doesn't support native driver usually
                        }),
                        Animated.timing(animated.lng, {
                            toValue: driver.longitude,
                            duration: 5000,
                            useNativeDriver: false,
                        }),
                    ]).start();
                }
            }
        });
    }, [drivers]);

    return animatedDrivers.current;
};
