import React, { useEffect, useState } from 'react';
import { Polyline } from 'react-native-maps';
import { googleMapsApi } from '../api/googleMaps';

interface Props {
    origin: { lat: number; lng: number };
    destination: { lat: number; lng: number };
}

export default function RoutePolyline({ origin, destination }: Props) {
    const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);

    useEffect(() => {
        loadRoute();
    }, [origin, destination]);

    const loadRoute = async () => {
        try {
            const route = await googleMapsApi.getDirections(origin, destination);
            if (route && route.overview_polyline && route.overview_polyline.points) {
                const coordinates = decodePolyline(route.overview_polyline.points);
                setRouteCoordinates(coordinates);
            } else {
                // Fallback: Straight line
                setRouteCoordinates([
                    { latitude: origin.lat, longitude: origin.lng },
                    { latitude: destination.lat, longitude: destination.lng }
                ]);
            }
        } catch (error) {
            console.error('Error loading route:', error);
            setRouteCoordinates([
                { latitude: origin.lat, longitude: origin.lng },
                { latitude: destination.lat, longitude: destination.lng }
            ]);
        }
    };

    if (routeCoordinates.length === 0) return null;

    return (
        <>
            <Polyline
                coordinates={routeCoordinates}
                strokeColor="#007AFF"
                strokeWidth={4}
            />
        </>
    );
}

function decodePolyline(encoded: string): Array<{ latitude: number; longitude: number }> {
    if (!encoded) return [];

    const poly: any[] = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
        let b;
        let shift = 0;
        let result = 0;

        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);

        const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
        lat += dlat;

        shift = 0;
        result = 0;

        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);

        const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
        lng += dlng;

        poly.push({
            latitude: lat / 1e5,
            longitude: lng / 1e5,
        });
    }

    return poly;
}
