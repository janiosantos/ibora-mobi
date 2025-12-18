import { useEffect } from 'react';
import MapView from 'react-native-maps';

export const useMapAutoZoom = (
    mapRef: React.RefObject<MapView | null>,
    markers: Array<{ latitude: number; longitude: number }>
) => {
    useEffect(() => {
        if (markers.length === 0 || !mapRef.current) return;

        // Animate to fit
        mapRef.current.fitToCoordinates(markers, {
            edgePadding: {
                top: 100,
                right: 50,
                bottom: 300, // More space for bottom cards
                left: 50,
            },
            animated: true,
        });
    }, [markers]); // Dependency on markers changing
};
