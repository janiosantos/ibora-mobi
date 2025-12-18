import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { rideApi } from '../../api/ride';
import { socketService } from '../../api/socket';

export default function RideTrackingScreen({ route, navigation }: any) {
    const { rideId } = route.params;
    const insets = useSafeAreaInsets();
    const [status, setStatus] = useState<string>('ACCEPTED');
    const [driverLocation, setDriverLocation] = useState<any>(null);

    useEffect(() => {
        // Subscribe to socket updates for this ride
        socketService.on('driver_arriving', () => setStatus('DRIVER_ARRIVING'));
        socketService.on('ride_started', () => setStatus('IN_PROGRESS'));
        socketService.on('ride_completed', handleRideCompleted);
        socketService.on('driver_location', (loc) => setDriverLocation(loc));

        return () => {
            // Cleanup listeners if specific
        };
    }, []);

    const handleRideCompleted = () => {
        setStatus('COMPLETED');
        Alert.alert('Chegamos!', 'Sua corrida foi finalizada.', [
            { text: 'Avaliar', onPress: () => navigation.navigate('Home') }
        ]);
    };

    const getStatusText = () => {
        switch (status) {
            case 'ACCEPTED': return 'Motorista a caminho';
            case 'DRIVER_ARRIVING': return 'Motorista chegando!';
            case 'IN_PROGRESS': return 'Em viagem';
            case 'COMPLETED': return 'Finalizada';
            default: return 'Aguarde...';
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: -23.55052,
                    longitude: -46.633308,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                {/* Driver Marker */}
                {driverLocation && (
                    <Marker coordinate={driverLocation}>
                        <View style={styles.carMarker}>
                            <Ionicons name="car" size={24} color="#000" />
                        </View>
                    </Marker>
                )}
            </MapView>

            <View style={[styles.bottomCard, { paddingBottom: insets.bottom + 20 }]}>
                <Text style={styles.statusTitle}>{getStatusText()}</Text>

                <View style={styles.driverInfo}>
                    <View style={styles.driverAvatar}>
                        <Ionicons name="person" size={30} color="#fff" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.driverName}>Motorista Teste</Text>
                        <Text style={styles.vehicleInfo}>Chevrolet Onix • ABC-1234</Text>
                    </View>
                    <View style={styles.ratingBox}>
                        <Text style={styles.ratingText}>5.0 ★</Text>
                    </View>
                </View>

                <View style={styles.estInfo}>
                    <Text style={styles.etaText}>Chegada em 5 min</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    carMarker: {
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 20,
        elevation: 5
    },
    bottomCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 10
    },
    statusTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333'
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginBottom: 20
    },
    driverAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center'
    },
    driverName: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    vehicleInfo: {
        color: '#666',
        marginTop: 2
    },
    ratingBox: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8
    },
    ratingText: {
        fontWeight: 'bold',
        fontSize: 12
    },
    estInfo: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 15,
        alignItems: 'center'
    },
    etaText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600'
    }
});
