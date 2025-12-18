import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { walletApi } from '../../api/wallet';

export default function WithdrawalScreen({ navigation }: any) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState<number | null>(null);

    useEffect(() => {
        // Refresh balance on mount
        loadBalance();
    }, []);

    const loadBalance = async () => {
        try {
            const wallet = await walletApi.getWallet();
            setBalance(wallet.available_balance);
        } catch (e) {
            console.log("Error loading balance");
        }
    };

    const handleWithdraw = async () => {
        const value = parseFloat(amount.replace(',', '.'));
        if (isNaN(value) || value <= 0) {
            Alert.alert('Erro', 'Insira um valor válido');
            return;
        }

        if (balance !== null && value > balance) {
            Alert.alert('Erro', 'Saldo insuficiente');
            return;
        }

        setLoading(true);
        try {
            await walletApi.requestWithdrawal(value);
            Alert.alert('Sucesso', 'Solicitação de saque enviada!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            console.error(error);
            let msg = 'Erro ao processar saque';
            if (error.response?.data?.detail) {
                const detail = error.response.data.detail;
                if (typeof detail === 'string') {
                    msg = detail;
                } else if (Array.isArray(detail)) {
                    msg = detail.map((e: any) => e.msg).join('\n');
                } else {
                    msg = JSON.stringify(detail);
                }
            }
            Alert.alert('Erro', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Solicitar Saque</Text>

                {balance !== null && (
                    <Text style={styles.subtitle}>
                        Disponível: R$ {balance.toFixed(2)}
                    </Text>
                )}

                <Text style={styles.label}>Valor do Saque (R$)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    autoFocus
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleWithdraw}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Confirmar Saque</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
        marginTop: 40
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333'
    },
    subtitle: {
        fontSize: 16,
        color: '#007AFF',
        marginBottom: 30,
        fontWeight: '600'
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        height: 55,
        justifyContent: 'center'
    },
    buttonDisabled: {
        opacity: 0.6
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600'
    }
});
