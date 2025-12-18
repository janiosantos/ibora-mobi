import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { paymentApi, PaymentMethod } from '../../api/payment';

export default function PaymentMethodsScreen({ navigation }: any) {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadMethods = async () => {
        try {
            const data = await paymentApi.listPaymentMethods();
            setMethods(data.payment_methods);
        } catch (error) {
            console.error(error);
            // Alert.alert('Erro', 'Não foi possível carregar pagamentos');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadMethods();

        // Refresh when coming back from AddCard
        const unsubscribe = navigation.addListener('focus', () => {
            loadMethods();
        });
        return unsubscribe;
    }, [navigation]);

    const onRefresh = () => {
        setRefreshing(true);
        loadMethods();
    };

    const handleSetDefault = async (id: number) => {
        try {
            await paymentApi.setDefaultPaymentMethod(id);
            loadMethods();
        } catch (e) {
            Alert.alert('Erro', 'Falha ao definir padrão');
        }
    };

    const handleDelete = async (id: number) => {
        Alert.alert('Remover', 'Tem certeza?', [
            { text: 'Cancelar' },
            {
                text: 'Sim', onPress: async () => {
                    try {
                        await paymentApi.removePaymentMethod(id);
                        loadMethods();
                    } catch (e) {
                        Alert.alert('Erro', 'Falha ao remover');
                    }
                }
            }
        ])
    };

    const renderItem = ({ item }: { item: PaymentMethod }) => (
        <View style={styles.cardItem}>
            <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.brand || item.provider} •••• {item.last4}</Text>
                {item.is_default && <Text style={styles.defaultBadge}>Padrão</Text>}
            </View>
            <View style={styles.actions}>
                {!item.is_default && (
                    <TouchableOpacity onPress={() => handleSetDefault(item.id)} style={styles.actionBtn}>
                        <Text style={{ color: '#007AFF' }}>Definir Padrão</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
                    <Text style={{ color: 'red' }}>X</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Pagamentos</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AddCard')}>
                    <Text style={styles.addBtn}>+ Adicionar</Text>
                </TouchableOpacity>
            </View>

            {loading && !refreshing ? (
                <ActivityIndicator size="large" style={{ marginTop: 20 }} color="#007AFF" />
            ) : (
                <FlatList
                    data={methods}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={<Text style={styles.empty}>Nenhum cartão cadastrado</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    addBtn: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600'
    },
    cardItem: {
        padding: 20,
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: 15,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cardInfo: {
        flex: 1
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    defaultBadge: {
        color: 'green',
        fontSize: 12,
        marginTop: 4
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    actionBtn: {
        padding: 10
    },
    empty: {
        textAlign: 'center',
        marginTop: 40,
        color: '#999'
    }
});
