import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Switch, Alert, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { socketService } from '../../api/socket';
import { rideApi } from '../../api/ride'; // Need to create/ensure this exists
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.01; // Close zoom for driver
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function HomeScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const mapRef = useRef<MapView>(null);
    const { logout } = useAuthStore();

    const [isOnline, setIsOnline] = useState(false);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [rideRequest, setRideRequest] = useState<any>(null); // Incoming ride request

    // Initial Location & Permissions
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão negada', 'Precisamos de sua localização para trabalhar.');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    // Socket Connection Management
    useFocusEffect(
        React.useCallback(() => {
            const connectSocket = async () => {
                await socketService.connect();
                socketService.on('new_ride_request', handleNewRideRequest);
            };
            connectSocket();

            return () => {
                socketService.off('new_ride_request');
                // Don't disconnect on blur, only on logout usually, but for resource saving maybe?
                // Better keep connected if we want background updates (though that needs more work)
            };
        }, [])
    );

    const handleNewRideRequest = (data: any) => {
        console.log('New Ride Request:', data);
        setRideRequest(data);
    };

    const toggleOnlineStatus = async () => {
        // Optimistic update
        const newStatus = !isOnline;
        setIsOnline(newStatus);

        // TODO: Call API to update status in backend
        try {
            if (newStatus) {
                // If going online, ensure we send location
                if (location) {
                    // await driverApi.updateLocation(...)
                }
            }
        } catch (error) {
            console.error(error);
            setIsOnline(!newStatus); // Revert
            Alert.alert('Erro', 'Não foi possível alterar status');
        }
    };

    const handleAcceptRide = async () => {
        if (!rideRequest) return;

        try {
            await rideApi.acceptRide(rideRequest.ride_id);
            setRideRequest(null);
            navigation.navigate('RideTracking', { rideId: rideRequest.ride_id });
        } catch (error: any) {
            Alert.alert('Erro', error.response?.data?.detail || 'Erro ao aceitar corrida');
            setRideRequest(null);
        }
    };

    const handleRejectRide = () => {
        setRideRequest(null);
        // TODO: Notify backend so it finds another driver
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                showsUserLocation
                showsMyLocationButton={false} // Custom button below
                initialRegion={{
                    latitude: -23.55052,
                    longitude: -46.633308, // Sao Paulo default
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }}
                region={location ? {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                } : undefined}
            >
                {/* Driver Marker (Custom if needed, or rely on showsUserLocation) */}
            </MapView>

            {/* Top Status Bar */}
            <View style={[styles.statusBar, { top: insets.top + 10 }]}>
                <View style={[styles.statusIndicator, { backgroundColor: isOnline ? '#4CAF50' : '#757575' }]} />
                <Text style={styles.statusText}>{isOnline ? 'VOCÊ ESTÁ ONLINE' : 'VOCÊ ESTÁ OFFLINE'}</Text>
                <Switch
                    value={isOnline}
                    onValueChange={toggleOnlineStatus}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isOnline ? '#007AFF' : '#f4f3f4'}
                />
                <TouchableOpacity onPress={logout} style={{ marginLeft: 15 }}>
                    <Ionicons name="log-out-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Ride Request Modal/Card */}
            {rideRequest && (
                <View style={styles.requestCard}>
                    <Text style={styles.requestTitle}>Nova Solicitação!</Text>

                    <View style={styles.requestInfo}>
                        <View style={styles.routeRow}>
                            <Ionicons name="ellipse" size={12} color="green" />
                            <Text style={styles.addressText} numberOfLines={1}>{rideRequest.origin || 'Origem'}</Text>
                        </View>
                        <View style={styles.routeLine} />
                        <View style={styles.routeRow}>
                            <Ionicons name="location" size={12} color="red" />
                            <Text style={styles.addressText} numberOfLines={1}>{rideRequest.destination || 'Destino'}</Text>
                        </View>
                    </View>

                    <View style={styles.requestStats}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Ganho Est.</Text>
                            <Text style={styles.statValue}>R$ {rideRequest.price?.toFixed(2)}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Distância</Text>
                            <Text style={styles.statValue}>{rideRequest.distance?.toFixed(1)} km</Text>
                        </View>
                    </View>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.rejectButton} onPress={handleRejectRide}>
                            <Text style={styles.rejectText}>Recusar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptRide}>
                            <Text style={styles.acceptText}>ACEITAR CORRIDA</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    statusBar: {
        position: 'absolute',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 10,
    },
    statusIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 10,
        color: '#333',
    },
    requestCard: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
        zIndex: 20,
    },
    requestTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 15,
    },
    requestInfo: {
        marginBottom: 20,
    },
    routeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    routeLine: {
        height: 20,
        width: 1,
        backgroundColor: '#ccc',
        marginLeft: 5,
        marginBottom: 5,
    },
    addressText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#555',
        flex: 1,
    },
    requestStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 10,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#777',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 15,
    },
    rejectButton: {
        flex: 1,
        backgroundColor: '#ffebee',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    rejectText: {
        color: '#d32f2f',
        fontSize: 16,
        fontWeight: 'bold',
    },
    acceptButton: {
        flex: 2,
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    acceptText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
