import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Platform, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { driverApi, NearbyDriver } from '../../api/driver';
import { rideApi, RideEstimate } from '../../api/ride';
import { socketService } from '../../api/socket';

import { useDriverAnimation } from '../../hooks/useDriverAnimation';
import { useMapAutoZoom } from '../../hooks/useMapAutoZoom';
import RoutePolyline from '../../components/RoutePolyline';
import { useAuthStore } from '../../store/authStore';

export default function HomeScreen({ navigation }: any) {
    const mapRef = useRef<MapView>(null);
    const insets = useSafeAreaInsets();
    const { logout } = useAuthStore();

    const handleLogout = async () => {
        Alert.alert(
            "Sair",
            "Deseja sair da conta?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sair", style: "destructive", onPress: () => logout() }
            ]
        );
    };

    const [currentLocation, setCurrentLocation] = useState<Region>({
        latitude: -23.55052,
        longitude: -46.633308,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02
    });

    const [nearbyDrivers, setNearbyDrivers] = useState<NearbyDriver[]>([]);
    const animatedDrivers = useDriverAnimation(nearbyDrivers);

    // Ride State
    const [destination, setDestination] = useState<{ lat: number; lng: number } | null>(null);
    const [estimate, setEstimate] = useState<RideEstimate | null>(null);
    const [rideStatus, setRideStatus] = useState<'IDLE' | 'ESTIMATING' | 'REQUESTING' | 'SEARCHING' | 'ACCEPTED'>('IDLE');
    const [activeRide, setActiveRide] = useState<any>(null);

    const [markersToZoom, setMarkersToZoom] = useState<any[]>([]);

    useEffect(() => {
        loadNearbyDrivers();
        const interval = setInterval(loadNearbyDrivers, 10000);
        return () => clearInterval(interval);
    }, []);

    // Socket Connection
    useFocusEffect(
        React.useCallback(() => {
            const connectSocket = async () => {
                await socketService.connect();
                socketService.on('ride_accepted', handleRideAccepted);
                socketService.on('driver_arriving', handleDriverArriving);
            };
            connectSocket();

            return () => {
                socketService.off('ride_accepted');
                socketService.off('driver_arriving');
            };
        }, [])
    );

    const handleRideAccepted = (data: any) => {
        console.log('Ride Accepted:', data);
        setRideStatus('ACCEPTED');
        setActiveRide(prev => ({ ...prev, ...data }));
        Alert.alert('Motorista Encontrado!', `O motorista ${data.driver_name || ''} aceitou sua corrida.`);
        // Navigate to tracking
        navigation.navigate('RideTracking', { rideId: data.ride_id });
    };

    const handleDriverArriving = (data: any) => {
        // Handle if needed here, or tracking screen handles it
        console.log('Driver Arriving:', data);
    };

    const loadNearbyDrivers = async () => {
        try {
            const drivers = await driverApi.getNearbyDrivers(
                currentLocation.latitude,
                currentLocation.longitude,
                5
            );
            setNearbyDrivers(drivers);
        } catch (error) {
            console.error('Error loading nearby drivers:', error);
        }
    };

    useEffect(() => {
        const markers = [];
        if (currentLocation) markers.push(currentLocation);
        if (destination) markers.push({ latitude: destination.lat, longitude: destination.lng });
        setMarkersToZoom(markers);
    }, [currentLocation, destination]);

    useMapAutoZoom(mapRef, markersToZoom);

    const handleSimulateEstimate = async () => {
        // Mock selecting a destination for demo
        const dest = {
            lat: -23.56168, // Paulista Avenue
            lng: -46.65598
        };
        setDestination(dest);
        setRideStatus('ESTIMATING');

        try {
            const est = await rideApi.estimate(
                `${currentLocation.latitude},${currentLocation.longitude}`,
                `${dest.lat},${dest.lng}`
            );
            setEstimate(est);
            setRideStatus('IDLE'); // Ready to request
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível calcular a estimativa.');
            setRideStatus('IDLE');
            setDestination(null);
        }
    };

    const handleRequestRide = async () => {
        if (!estimate || !destination) return;

        setRideStatus('REQUESTING');
        try {
            const ride = await rideApi.request(
                `${currentLocation.latitude},${currentLocation.longitude}`,
                `${destination.lat},${destination.lng}`,
                estimate.estimated_price,
                estimate.distance_km
            );
            setActiveRide(ride);
            setRideStatus('SEARCHING');
        } catch (error: any) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível solicitar a corrida.');
            setRideStatus('IDLE');
        }
    };

    const handleCancelSearch = () => {
        // TODO: Call API to cancel
        setRideStatus('IDLE');
        setDestination(null);
        setEstimate(null);
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={currentLocation}
                showsUserLocation={true}
                showsMyLocationButton={false}
            >
                {/* Nearby Drivers */}
                {nearbyDrivers.map((driver) => {
                    const animated = animatedDrivers.get(driver.id);
                    return (
                        <Marker.Animated
                            key={driver.id}
                            coordinate={{
                                latitude: animated?.lat || driver.latitude,
                                longitude: animated?.lng || driver.longitude
                            }}
                            anchor={{ x: 0.5, y: 0.5 }}
                            flat={true}
                        >
                            <View style={styles.carMarker}>
                                <Ionicons name="car" size={24} color="#000" />
                            </View>
                        </Marker.Animated>
                    );
                })}

                {/* Route Polyline */}
                {destination && (
                    <>
                        <Marker coordinate={{ latitude: destination.lat, longitude: destination.lng }} pinColor="red" />
                        <RoutePolyline
                            origin={{ lat: currentLocation.latitude, lng: currentLocation.longitude }}
                            destination={destination}
                        />
                    </>
                )}
            </MapView>

            {/* Status Feedback Layer */}
            {rideStatus === 'SEARCHING' && (
                <View style={[styles.searchingOverlay, { top: insets.top + 20 }]}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.searchingText}>Procurando motoristas...</Text>
                </View>
            )}

            {/* Bottom Card */}
            <View style={styles.bottomCard}>
                {!destination ? (
                    <>
                        <Text style={styles.greeting}>Olá, Passageiro!</Text>
                        <Text style={styles.subtext}>Para onde vamos hoje?</Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSimulateEstimate}
                            disabled={rideStatus === 'ESTIMATING'}
                        >
                            {rideStatus === 'ESTIMATING' ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Simular Destino (Paulista)</Text>
                            )}
                        </TouchableOpacity>
                    </>
                ) : (
                    // Estimation View
                    <>
                        <View style={styles.estHeader}>
                            <Text style={styles.greeting}>Confirmação</Text>
                            <Text style={styles.estPrice}>
                                R$ {estimate?.estimated_price?.toFixed(2)}
                            </Text>
                        </View>

                        <View style={styles.estDetails}>
                            <Text style={styles.estInfo}>{estimate?.distance_km?.toFixed(1)} km</Text>
                            <Text style={styles.estInfo}>{estimate?.duration_min?.toFixed(0)} min</Text>
                        </View>

                        {rideStatus === 'SEARCHING' ? (
                            <TouchableOpacity style={[styles.button, { backgroundColor: '#FF3B30' }]} onPress={handleCancelSearch}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                                <TouchableOpacity
                                    style={[styles.button, { flex: 1, backgroundColor: '#ccc' }]}
                                    onPress={handleCancelSearch}
                                >
                                    <Text style={styles.buttonText}>Voltar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, { flex: 1 }]}
                                    onPress={handleRequestRide}
                                    disabled={rideStatus === 'REQUESTING'}
                                >
                                    {rideStatus === 'REQUESTING' ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.buttonText}>Chamar Uber</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        flex: 1,
    },
    carMarker: {
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    bottomCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    greeting: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8
    },
    subtext: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    logoutButton: {
        position: 'absolute',
        right: 20,
        zIndex: 50, // Top of map
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 10,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    estHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    estPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF'
    },
    estDetails: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 15
    },
    estInfo: {
        color: '#666',
        fontSize: 14,
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8
    },
    searchingOverlay: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    searchingText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333'
    }
});
