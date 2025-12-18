import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native';
import { paymentApi } from '../../api/payment';

export default function AddCardScreen({ navigation }: any) {
    const [token, setToken] = useState(''); // Simulating token generation
    const [loading, setLoading] = useState(false);

    const handleAddCard = async () => {
        if (!token) {
            // In a real app, we would integrate Stripe/MP SDK here to generate token
            // For now, we simulate by asking user to paste a "token" (standard MP Test Token)
            Alert.alert('Erro', 'Token inválido');
            return;
        }

        setLoading(true);
        try {
            await paymentApi.addCard(token);
            Alert.alert('Sucesso', 'Cartão adicionado!');
            navigation.goBack();
        } catch (error: any) {
            console.error(error);
            Alert.alert('Erro', error.response?.data?.detail || 'Erro ao adicionar cartão');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Adicionar Cartão</Text>
            <Text style={styles.subtitle}>
                Para fins de teste, insira um Token de Cartão válido (Mercado Pago).
                Em produção, usaremos o MP Mobile SDK para ler o cartão.
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Cole o Card Token aqui"
                value={token}
                onChangeText={setToken}
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleAddCard}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar Cartão</Text>}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        fontSize: 16
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center'
    },
    buttonDisabled: {
        opacity: 0.6
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    }
});
