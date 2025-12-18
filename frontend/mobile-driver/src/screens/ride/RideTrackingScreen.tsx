import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { rideApi, Ride } from '../../api/ride';

type RideStatus = 'ACCEPTED' | 'DRIVER_ARRIVING' | 'IN_PROGRESS' | 'COMPLETED';

export default function RideTrackingScreen({ route, navigation }: any) {
    const { rideId } = route.params;
    const insets = useSafeAreaInsets();
    const [status, setStatus] = useState<RideStatus>('ACCEPTED');
    const [rideData, setRideData] = useState<Ride | null>(null);

    // TODO: Poll or listen to socket for updates? 
    // Driver drives the state, so local state + optimistic updates is fine usually.

    useEffect(() => {
        // Load initial ride data if needed, or rely on passed params
        // For now let's assume we can fetch it or just use state
    }, []);

    const handleAction = async () => {
        try {
            if (status === 'ACCEPTED') {
                await rideApi.driverArriving(rideId);
                setStatus('DRIVER_ARRIVING');
                Alert.alert('Status', 'Passageiro notificado que você chegou!');
            } else if (status === 'DRIVER_ARRIVING') {
                await rideApi.startRide(rideId);
                setStatus('IN_PROGRESS');
                Alert.alert('Status', 'Corrida iniciada! Boa viagem.');
            } else if (status === 'IN_PROGRESS') {
                await rideApi.finishRide(rideId);
                setStatus('COMPLETED');
                Alert.alert('Sucesso', 'Corrida finalizada!', [
                    { text: 'OK', onPress: () => navigation.navigate('Home') }
                ]);
            }
        } catch (error: any) {
            Alert.alert('Erro', error.response?.data?.detail || 'Erro ao atualizar status');
        }
    };

    const openNavigation = () => {
        // Mock open Waze/Google Maps
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${-23.55052},${-46.633308}`; // TODO: Use actual coords
        const label = 'Destino';
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });

        if (url) Linking.openURL(url);
    };

    const getButtonText = () => {
        switch (status) {
            case 'ACCEPTED': return 'AVISAR QUE CHEGUEI';
            case 'DRIVER_ARRIVING': return 'INICIAR CORRIDA';
            case 'IN_PROGRESS': return 'FINALIZAR CORRIDA';
            default: return '...';
        }
    };

    const getButtonColor = () => {
        switch (status) {
            case 'IN_PROGRESS': return '#F44336'; // Red for finish
            default: return '#007AFF';
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
                {/* Markers & Polyline would go here */}
            </MapView>

            <TouchableOpacity style={[styles.navButton, { top: insets.top + 10 }]} onPress={openNavigation}>
                <Ionicons name="navigate-circle" size={40} color="#007AFF" />
            </TouchableOpacity>

            <View style={[styles.bottomCard, { paddingBottom: insets.bottom + 20 }]}>
                <Text style={styles.statusTitle}>
                    {status === 'ACCEPTED' && 'A caminho do passageiro'}
                    {status === 'DRIVER_ARRIVING' && 'Aguardando passageiro'}
                    {status === 'IN_PROGRESS' && 'Em viagem ao destino'}
                </Text>

                <View style={styles.passengerInfo}>
                    <Ionicons name="person-circle" size={50} color="#ccc" />
                    <View style={{ marginLeft: 15 }}>
                        <Text style={styles.passengerName}>Passageiro (Mock)</Text>
                        <Text style={styles.rating}>⭐ 5.0</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.mainButton, { backgroundColor: getButtonColor() }]}
                    onPress={handleAction}
                >
                    <Text style={styles.buttonText}>{getButtonText()}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    navButton: {
        position: 'absolute',
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 25,
        elevation: 5
    },
    bottomCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 10,
    },
    statusTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    passengerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 12,
    },
    passengerName: {
        fontSize: 18,
        fontWeight: '600',
    },
    rating: {
        color: '#FBC02D',
        marginTop: 4,
    },
    mainButton: {
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
