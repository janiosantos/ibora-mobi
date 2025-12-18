import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { walletApi, Wallet, Transaction } from '../../api/wallet';

export default function WalletScreen({ navigation }: any) {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const [walletData, txData] = await Promise.all([
                walletApi.getWallet(),
                walletApi.getTransactions({ limit: 10 })
            ]);
            setWallet(walletData);
            setTransactions(txData.transactions);
        } catch (error) {
            console.error('Failed to load wallet data', error);
            // alert('Erro ao carregar carteira');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const formatCurrency = (value: number | string | undefined) => {
        if (value === undefined || value === null) return '0.00';
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return isNaN(num) ? '0.00' : num.toFixed(2);
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Carteira</Text>
            </View>

            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Saldo Disponível</Text>
                <Text style={styles.balanceValue}>
                    R$ {formatCurrency(wallet?.available_balance)}
                </Text>

                <View style={styles.divider} />

                <View style={styles.secondaryBalanceRow}>
                    <View>
                        <Text style={styles.secondaryLabel}>Bloqueado (D+N)</Text>
                        <Text style={styles.secondaryValue}>R$ {formatCurrency(wallet?.blocked_balance)}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.withdrawButton}
                        onPress={() => navigation.navigate('Withdraw')}
                    >
                        <Text style={styles.withdrawText}>Sacar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Últimas Transações</Text>
                {transactions.length === 0 ? (
                    <Text style={styles.emptyText}>Nenhuma transação recente</Text>
                ) : (
                    transactions.map(tx => (
                        <View key={tx.id} style={styles.transactionItem}>
                            <View style={styles.txInfo}>
                                <Text style={styles.txDesc}>{tx.description}</Text>
                                <Text style={styles.txDate}>{new Date(tx.created_at).toLocaleDateString()}</Text>
                            </View>
                            <Text style={[
                                styles.txAmount,
                                Number(tx.amount) > 0 ? styles.positive : styles.negative
                            ]}>
                                {Number(tx.amount) > 0 ? '+' : ''} R$ {formatCurrency(Math.abs(Number(tx.amount)))}
                            </Text>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333'
    },
    balanceCard: {
        margin: 20,
        padding: 20,
        backgroundColor: '#007AFF', // Or a gradient
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 6
    },
    balanceLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '600'
    },
    balanceValue: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        marginVertical: 10
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginVertical: 15
    },
    secondaryBalanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    secondaryLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12
    },
    secondaryValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600'
    },
    withdrawButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        justifyContent: 'center'
    },
    withdrawText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15
    },
    transactionItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2
    },
    txInfo: {
        flex: 1
    },
    txDesc: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500'
    },
    txDate: {
        fontSize: 12,
        color: '#999',
        marginTop: 4
    },
    txAmount: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    positive: {
        color: '#4CAF50'
    },
    negative: {
        color: '#F44336'
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 20
    }
});
