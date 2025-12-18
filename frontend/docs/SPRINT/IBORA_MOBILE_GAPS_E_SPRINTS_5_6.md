# 📱 IBORA MOBILE: ANÁLISE DE GAPS & SPRINTS 5-6
## Features Faltantes nos Apps React Native

---

# ⚠️ ANÁLISE CRÍTICA: O QUE FALTA

## Comparação Backend vs Mobile Atual

```
╔════════════════════════════════════════════════════════════╗
║  FEATURE                      │ BACKEND │ MOBILE │ GAP   ║
╠════════════════════════════════════════════════════════════╣
║  Auth & Login                 │   ✅    │   ✅   │  -    ║
║  Online/Offline (Driver)      │   ✅    │   ✅   │  -    ║
║  Request Ride                 │   ✅    │   ✅   │  -    ║
║  Accept/Reject Ride           │   ✅    │   ✅   │  -    ║
║  Track Ride                   │   ✅    │   ✅   │  -    ║
║  Rating                       │   ✅    │   ✅   │  -    ║
║  WebSocket Real-time          │   ✅    │   ✅   │  -    ║
╠════════════════════════════════════════════════════════════╣
║  Payment Methods              │   ✅    │   ❌   │  🚨  ║
║  Wallet Management            │   ✅    │   ❌   │  🚨  ║
║  Withdrawal (Saque)           │   ✅    │   ❌   │  🚨  ║
║  Scheduled Rides              │   ✅    │   ❌   │  🚨  ║
║  Promo Codes                  │   ✅    │   ❌   │  🚨  ║
║  Favorite Places (CRUD)       │   ✅    │   ❌   │  🚨  ║
║  Ride History Complete        │   ✅    │   ⚠️   │  🚨  ║
║  Profile Management           │   ✅    │   ⚠️   │  🚨  ║
║  Category Application         │   ✅    │   ❌   │  🚨  ║
║  Safety Features (SOS)        │   ✅    │   ❌   │  🚨  ║
║  Share Trip                   │   ✅    │   ❌   │  🚨  ║
║  Support/Help Center          │   ✅    │   ❌   │  🚨  ║
║  Notifications List           │   ✅    │   ❌   │  🚨  ║
║  Settings & Preferences       │   ✅    │   ❌   │  🚨  ║
║  PDF Receipts                 │   ✅    │   ❌   │  🚨  ║
║  Corporate Account            │   ✅    │   ❌   │  🚨  ║
╚════════════════════════════════════════════════════════════╝

LEGENDA:
✅ Implementado completo
⚠️ Implementado parcial
❌ Não implementado
🚨 GAP crítico
```

---

# 🚨 GAPS CRÍTICOS (15 features faltando)

## MOTORISTA - 7 Gaps

### 1. ❌ **Wallet Management**
```
Faltando:
├─ Ver saldo disponível
├─ Ver saldo bloqueado (D+N)
├─ Ver saldo em uso (crédito)
├─ Histórico de transações
└─ Detalhamento por tipo
```

### 2. ❌ **Withdrawal (Saque)**
```
Faltando:
├─ Solicitar saque (mín R$ 50)
├─ Ver saques pendentes
├─ Histórico de saques
└─ Cadastrar chave Pix
```

### 3. ❌ **Category Application**
```
Faltando:
├─ Ver categorias disponíveis
├─ Aplicar para categoria
├─ Ver status da aplicação
└─ Requisitos por categoria
```

### 4. ❌ **Profile Management**
```
Faltando:
├─ Editar perfil
├─ Upload foto
├─ Documentos (CNH, CRLV)
├─ Dados do veículo
└─ Mudar senha
```

### 5. ❌ **Safety Features**
```
Faltando:
├─ Botão SOS (emergência)
├─ Share trip (compartilhar corrida)
└─ Audio recording toggle
```

### 6. ❌ **Support/Help**
```
Faltando:
├─ Central de ajuda
├─ FAQ
├─ Abrir ticket
└─ Chat com suporte
```

### 7. ❌ **Settings**
```
Faltando:
├─ Notificações (toggle)
├─ Som/Vibração
├─ Navegação preferida (Waze/Google)
├─ Voice commands
└─ Privacidade
```

---

## PASSAGEIRO - 8 Gaps

### 1. ❌ **Payment Methods**
```
Faltando:
├─ Listar métodos de pagamento
├─ Adicionar cartão (Stripe)
├─ Adicionar Pix
├─ Selecionar método default
├─ Remover método
└─ Apple Pay / Google Pay
```

### 2. ❌ **Scheduled Rides**
```
Faltando:
├─ Agendar corrida (até 30 dias)
├─ Listar corridas agendadas
├─ Cancelar agendamento
└─ Editar agendamento
```

### 3. ❌ **Promo Codes**
```
Faltando:
├─ Campo para inserir código
├─ Validar código
├─ Ver desconto aplicado
└─ Meu código de referral
```

### 4. ❌ **Favorite Places (CRUD)**
```
Faltando:
├─ Adicionar favorito
├─ Editar favorito
├─ Remover favorito
└─ Quick request (1-tap)
```

### 5. ❌ **Ride History Complete**
```
Faltando:
├─ Filtros (data, status)
├─ Ver detalhes completos
├─ Rota no mapa
├─ PDF receipt download
└─ Repetir corrida
```

### 6. ❌ **Profile Management**
```
Faltando:
├─ Editar perfil
├─ Upload foto
├─ Preferências de corrida
├─ Mudar senha
└─ CPF para nota fiscal
```

### 7. ❌ **Safety Features**
```
Faltando:
├─ Botão SOS
├─ Share trip (tempo real)
├─ Trusted contacts
└─ Trip following link
```

### 8. ❌ **Support/Help**
```
Faltando:
├─ Central de ajuda
├─ FAQ
├─ Relatar problema
├─ Lost items
└─ Chat com suporte
```

---

# 📊 COBERTURA ATUAL

```
Backend:     100% (24 sprints) ✅
Mobile:       60% (4 sprints)  ⚠️

Faltam:      40% (2 sprints)  ❌
```

---

# 🎯 SOLUÇÃO: SPRINTS MOBILE 5-6

Vou criar **2 sprints adicionais** para cobrir os 40% faltantes:

- **Sprint Mobile 5:** Payments, Wallet & Profile (20 SP)
- **Sprint Mobile 6:** Advanced Features (Scheduled, Promo, Safety, Support) (18 SP)

**Total adicional:** 38 SP | 4 semanas

---

# SPRINT MOBILE 5: PAYMENTS, WALLET & PROFILE (20 SP) ✅

## 🎯 OBJETIVO
Sistema completo de pagamentos, wallet do motorista, e gestão de perfil.

---

## 5.1 PAYMENT METHODS SCREEN - PASSAGEIRO (5 SP)

```typescript
// mobile-passenger/src/screens/main/PaymentMethodsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { paymentApi } from '../../api/payment';

interface PaymentMethod {
  id: number;
  type: 'card' | 'pix' | 'cash';
  last4?: string;
  brand?: string;
  is_default: boolean;
}

export default function PaymentMethodsScreen({ navigation }: any) {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadPaymentMethods();
  }, []);
  
  const loadPaymentMethods = async () => {
    try {
      const data = await paymentApi.listPaymentMethods();
      setMethods(data.payment_methods);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSetDefault = async (methodId: number) => {
    try {
      await paymentApi.setDefaultPaymentMethod(methodId);
      loadPaymentMethods();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível definir como padrão');
    }
  };
  
  const handleRemove = (methodId: number) => {
    Alert.alert(
      'Remover método',
      'Deseja realmente remover este método de pagamento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await paymentApi.removePaymentMethod(methodId);
              loadPaymentMethods();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível remover');
            }
          },
        },
      ]
    );
  };
  
  const getMethodIcon = (type: string): any => {
    switch (type) {
      case 'card': return 'card-outline';
      case 'pix': return 'qr-code-outline';
      case 'cash': return 'cash-outline';
      default: return 'wallet-outline';
    }
  };
  
  const renderMethod = ({ item }: { item: PaymentMethod }) => (
    <View style={styles.methodCard}>
      <View style={styles.methodIcon}>
        <Ionicons name={getMethodIcon(item.type)} size={32} color="#007AFF" />
      </View>
      
      <View style={styles.methodInfo}>
        <Text style={styles.methodType}>
          {item.type === 'card' && `${item.brand} •••• ${item.last4}`}
          {item.type === 'pix' && 'Pix'}
          {item.type === 'cash' && 'Dinheiro'}
        </Text>
        {item.is_default && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Padrão</Text>
          </View>
        )}
      </View>
      
      <View style={styles.methodActions}>
        {!item.is_default && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetDefault(item.id)}
          >
            <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
          </TouchableOpacity>
        )}
        
        {item.type !== 'cash' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleRemove(item.id)}
          >
            <Ionicons name="trash-outline" size={24} color="#F44336" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Métodos de Pagamento</Text>
      </View>
      
      {/* Payment Methods List */}
      <FlatList
        data={methods}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMethod}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum método cadastrado</Text>
          </View>
        }
      />
      
      {/* Add Payment Method Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddPaymentMethod')}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Adicionar Método</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  methodIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 25,
  },
  methodInfo: {
    flex: 1,
    marginLeft: 16,
  },
  methodType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  defaultBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  methodActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

---

## 5.2 ADD CARD SCREEN (Stripe) (3 SP)

```typescript
// mobile-passenger/src/screens/payments/AddCardScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { paymentApi } from '../../api/payment';

export default function AddCardScreen({ navigation }: any) {
  const { createToken } = useStripe();
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const handleAddCard = async () => {
    if (!cardDetails?.complete) {
      Alert.alert('Erro', 'Preencha os dados do cartão');
      return;
    }
    
    setLoading(true);
    try {
      // Create token with Stripe
      const { token, error } = await createToken({
        type: 'Card',
      });
      
      if (error) {
        Alert.alert('Erro', error.message);
        return;
      }
      
      // Send token to backend
      await paymentApi.addCard(token!.id);
      
      Alert.alert('Sucesso', 'Cartão adicionado!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.detail || 'Não foi possível adicionar o cartão');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Adicionar Cartão</Text>
        <Text style={styles.subtitle}>
          Seus dados estão protegidos com criptografia de ponta a ponta
        </Text>
        
        {/* Stripe Card Field */}
        <View style={styles.cardFieldContainer}>
          <CardField
            postalCodeEnabled={false}
            onCardChange={(details) => setCardDetails(details)}
            style={styles.cardField}
          />
        </View>
        
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleAddCard}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Adicionando...' : 'Adicionar Cartão'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.securityInfo}>
          <Text style={styles.securityText}>
            🔒 Pagamento seguro via Stripe
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 32,
  },
  cardFieldContainer: {
    marginBottom: 24,
  },
  cardField: {
    height: 50,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  securityInfo: {
    marginTop: 24,
    alignItems: 'center',
  },
  securityText: {
    fontSize: 14,
    color: '#666',
  },
});
```

---

## 5.3 WALLET SCREEN - MOTORISTA (4 SP)

```typescript
// mobile-driver/src/screens/main/WalletScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { walletApi } from '../../api/wallet';

export default function WalletScreen({ navigation }: any) {
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    loadWallet();
  }, []);
  
  const loadWallet = async () => {
    try {
      const [walletData, txData] = await Promise.all([
        walletApi.getWallet(),
        walletApi.getTransactions({ limit: 20 }),
      ]);
      
      setWallet(walletData);
      setTransactions(txData.transactions);
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    loadWallet();
  };
  
  const getTransactionIcon = (type: string): any => {
    switch (type) {
      case 'RIDE_EARNING': return 'arrow-down-circle';
      case 'WITHDRAWAL': return 'arrow-up-circle';
      case 'COMMISSION': return 'remove-circle';
      case 'INCENTIVE': return 'gift';
      default: return 'swap-horizontal';
    }
  };
  
  const getTransactionColor = (type: string): string => {
    switch (type) {
      case 'RIDE_EARNING':
      case 'INCENTIVE':
        return '#4CAF50';
      case 'WITHDRAWAL':
      case 'COMMISSION':
        return '#F44336';
      default:
        return '#666';
    }
  };
  
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Balance Cards */}
      <View style={styles.balanceContainer}>
        {/* Available Balance */}
        <View style={[styles.balanceCard, styles.balanceCardMain]}>
          <Text style={styles.balanceLabel}>Saldo Disponível</Text>
          <Text style={styles.balanceValue}>
            R$ {wallet?.available_balance?.toFixed(2) || '0.00'}
          </Text>
          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={() => navigation.navigate('Withdrawal')}
            disabled={!wallet || wallet.available_balance < 50}
          >
            <Text style={styles.withdrawButtonText}>Sacar</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {/* Other Balances */}
        <View style={styles.balanceRow}>
          <View style={styles.balanceCardSmall}>
            <Ionicons name="time-outline" size={24} color="#FF9800" />
            <Text style={styles.balanceSmallLabel}>Bloqueado (D+2)</Text>
            <Text style={styles.balanceSmallValue}>
              R$ {wallet?.blocked_balance?.toFixed(2) || '0.00'}
            </Text>
          </View>
          
          <View style={styles.balanceCardSmall}>
            <Ionicons name="wallet-outline" size={24} color="#2196F3" />
            <Text style={styles.balanceSmallLabel}>Crédito de Uso</Text>
            <Text style={styles.balanceSmallValue}>
              R$ {wallet?.credit_balance?.toFixed(2) || '0.00'}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            R$ {wallet?.total_earnings_month?.toFixed(2) || '0.00'}
          </Text>
          <Text style={styles.statLabel}>Ganhos este mês</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            R$ {wallet?.total_withdrawn?.toFixed(2) || '0.00'}
          </Text>
          <Text style={styles.statLabel}>Total sacado</Text>
        </View>
      </View>
      
      {/* Transactions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transações Recentes</Text>
        
        {transactions.map((tx) => (
          <TouchableOpacity
            key={tx.id}
            style={styles.transactionCard}
            onPress={() => navigation.navigate('TransactionDetail', { id: tx.id })}
          >
            <View style={[
              styles.transactionIcon,
              { backgroundColor: `${getTransactionColor(tx.event_type)}20` }
            ]}>
              <Ionicons
                name={getTransactionIcon(tx.event_type)}
                size={24}
                color={getTransactionColor(tx.event_type)}
              />
            </View>
            
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionType}>{tx.description}</Text>
              <Text style={styles.transactionDate}>
                {new Date(tx.created_at).toLocaleDateString('pt-BR')}
              </Text>
            </View>
            
            <Text
              style={[
                styles.transactionAmount,
                { color: getTransactionColor(tx.event_type) }
              ]}
            >
              {tx.amount >= 0 ? '+' : ''}R$ {Math.abs(tx.amount).toFixed(2)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  balanceContainer: {
    padding: 16,
  },
  balanceCard: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 12,
  },
  balanceCardMain: {
    minHeight: 160,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  balanceValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 12,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  withdrawButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  balanceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  balanceCardSmall: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  balanceSmallLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  balanceSmallValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

---

## 5.4 WITHDRAWAL SCREEN (3 SP)

```typescript
// mobile-driver/src/screens/wallet/WithdrawalScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { walletApi } from '../../api/wallet';

export default function WithdrawalScreen({ navigation }: any) {
  const [availableBalance, setAvailableBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadWallet();
  }, []);
  
  const loadWallet = async () => {
    try {
      const wallet = await walletApi.getWallet();
      setAvailableBalance(wallet.available_balance);
      setPixKey(wallet.pix_key || '');
    } catch (error) {
      console.error('Error loading wallet:', error);
    }
  };
  
  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);
    
    if (!withdrawAmount || withdrawAmount < 50) {
      Alert.alert('Erro', 'Valor mínimo para saque é R$ 50,00');
      return;
    }
    
    if (withdrawAmount > availableBalance) {
      Alert.alert('Erro', 'Saldo insuficiente');
      return;
    }
    
    if (!pixKey) {
      Alert.alert('Erro', 'Cadastre uma chave Pix primeiro');
      return;
    }
    
    Alert.alert(
      'Confirmar Saque',
      `Sacar R$ ${withdrawAmount.toFixed(2)} para a chave Pix:\n${pixKey}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            setLoading(true);
            try {
              await walletApi.requestWithdrawal(withdrawAmount, pixKey);
              
              Alert.alert(
                'Saque solicitado!',
                'O valor será transferido em até 1 dia útil',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            } catch (error: any) {
              Alert.alert(
                'Erro',
                error.response?.data?.detail || 'Não foi possível solicitar o saque'
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Available Balance */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo Disponível</Text>
          <Text style={styles.balanceValue}>
            R$ {availableBalance.toFixed(2)}
          </Text>
        </View>
        
        {/* Amount Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Valor do Saque</Text>
          <View style={styles.amountInput}>
            <Text style={styles.currency}>R$</Text>
            <TextInput
              style={styles.amountValue}
              placeholder="0,00"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
          <Text style={styles.hint}>Valor mínimo: R$ 50,00</Text>
          
          {/* Quick Amount Buttons */}
          <View style={styles.quickAmounts}>
            {[50, 100, 200, availableBalance].map((value, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickAmountButton}
                onPress={() => setAmount(value.toFixed(2))}
              >
                <Text style={styles.quickAmountText}>
                  {index === 3 ? 'Tudo' : `R$ ${value}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Pix Key */}
        <View style={styles.section}>
          <Text style={styles.label}>Chave Pix</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua chave Pix"
            value={pixKey}
            onChangeText={setPixKey}
            autoCapitalize="none"
          />
          <Text style={styles.hint}>CPF, email, telefone ou chave aleatória</Text>
        </View>
        
        {/* Info */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
          <Text style={styles.infoText}>
            O saque será processado em até 1 dia útil. Você receberá uma notificação quando o valor for transferido.
          </Text>
        </View>
        
        {/* Withdraw Button */}
        <TouchableOpacity
          style={[styles.withdrawButton, loading && styles.withdrawButtonDisabled]}
          onPress={handleWithdraw}
          disabled={loading}
        >
          <Text style={styles.withdrawButtonText}>
            {loading ? 'Processando...' : 'Solicitar Saque'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  balanceCard: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  balanceValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  currency: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 8,
  },
  amountValue: {
    flex: 1,
    fontSize: 32,
    fontWeight: 'bold',
  },
  hint: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  quickAmounts: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#007AFF',
    lineHeight: 20,
  },
  withdrawButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  withdrawButtonDisabled: {
    opacity: 0.6,
  },
  withdrawButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

---

## 5.5 PROFILE MANAGEMENT (5 SP)

```typescript
// mobile-driver/src/screens/profile/EditProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { profileApi } from '../../api/profile';

export default function EditProfileScreen({ navigation }: any) {
  const [profile, setProfile] = useState<any>({});
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadProfile();
  }, []);
  
  const loadProfile = async () => {
    try {
      const data = await profileApi.getProfile();
      setProfile(data);
      setImage(data.photo_url);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };
  
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de permissão para acessar suas fotos');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  const handleSave = async () => {
    setLoading(true);
    try {
      // Upload photo if changed
      if (image && !image.startsWith('http')) {
        await profileApi.uploadPhoto(image);
      }
      
      // Update profile
      await profileApi.updateProfile(profile);
      
      Alert.alert('Sucesso', 'Perfil atualizado!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.detail || 'Não foi possível atualizar o perfil');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="person" size={60} color="#ccc" />
              </View>
            )}
            <View style={styles.photoEditButton}>
              <Ionicons name="camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.photoHint}>Toque para alterar a foto</Text>
        </View>
        
        {/* Form Fields */}
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              value={profile.full_name}
              onChangeText={(text) => setProfile({ ...profile, full_name: text })}
              placeholder="Seu nome"
            />
          </View>
          
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={profile.email}
              onChangeText={(text) => setProfile({ ...profile, email: text })}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.field}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              value={profile.phone}
              onChangeText={(text) => setProfile({ ...profile, phone: text })}
              placeholder="(00) 00000-0000"
              keyboardType="phone-pad"
            />
          </View>
          
          {/* Vehicle Info (Driver only) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Veículo</Text>
            
            <View style={styles.field}>
              <Text style={styles.label}>Modelo</Text>
              <TextInput
                style={styles.input}
                value={profile.vehicle_model}
                onChangeText={(text) => setProfile({ ...profile, vehicle_model: text })}
                placeholder="Ex: Honda Civic"
              />
            </View>
            
            <View style={styles.field}>
              <Text style={styles.label}>Placa</Text>
              <TextInput
                style={styles.input}
                value={profile.vehicle_plate}
                onChangeText={(text) => setProfile({ ...profile, vehicle_plate: text })}
                placeholder="ABC-1234"
                autoCapitalize="characters"
              />
            </View>
            
            <View style={styles.field}>
              <Text style={styles.label}>Cor</Text>
              <TextInput
                style={styles.input}
                value={profile.vehicle_color}
                onChangeText={(text) => setProfile({ ...profile, vehicle_color: text })}
                placeholder="Ex: Prata"
              />
            </View>
            
            <View style={styles.field}>
              <Text style={styles.label}>Ano</Text>
              <TextInput
                style={styles.input}
                value={profile.vehicle_year?.toString()}
                onChangeText={(text) => setProfile({ ...profile, vehicle_year: parseInt(text) || null })}
                placeholder="2020"
                keyboardType="number-pad"
              />
            </View>
          </View>
        </View>
        
        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    paddingTop: 60,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  photoHint: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  section: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

---

**Continua Sprint Mobile 6...**

🎊 Sprint Mobile 5 completo! Quer que eu continue com o **Sprint Mobile 6** (Scheduled, Promo, Safety, Support)?
