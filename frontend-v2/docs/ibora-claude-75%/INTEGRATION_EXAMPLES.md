# 🎯 Exemplos Práticos - Integração Backend

## 1. Exemplo: Atualizar HomeScreen para usar API real

**Arquivo**: `src/screens/driver/HomeScreen.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Alert } from 'react-native';
import { driverApi, wsService, WSEventType } from '../../api';
import { useAuthStore, useRideStore } from '../../store';
import { useWalletStore } from '../../store';

export const HomeScreen = ({ navigation }) => {
  const { driver } = useAuthStore();
  const { setIncomingRequest } = useRideStore();
  const { balance, loadBalance } = useWalletStore();
  const [isOnline, setIsOnline] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Load wallet when component mounts
  useEffect(() => {
    loadBalance();
  }, []);
  
  // WebSocket connection when online
  useEffect(() => {
    if (isOnline) {
      connectWebSocket();
    } else {
      wsService.disconnect();
    }
    
    return () => wsService.disconnect();
  }, [isOnline]);
  
  const connectWebSocket = async () => {
    try {
      await wsService.connect();
      
      // Listen for ride requests
      wsService.on(WSEventType.NEW_RIDE_REQUEST, (event) => {
        const request = event.data;
        setIncomingRequest(request);
        navigation.navigate('IncomingRideRequest');
      });
      
      console.log('✅ WebSocket connected, listening for rides...');
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      Alert.alert('Erro', 'Falha ao conectar ao servidor de corridas');
    }
  };
  
  const handleToggleOnline = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    
    try {
      const newStatus = !isOnline;
      
      // Update status on backend
      await driverApi.updateStatus(newStatus ? 'ONLINE' : 'OFFLINE');
      
      setIsOnline(newStatus);
      
      Alert.alert(
        'Status Atualizado',
        newStatus 
          ? 'Você está online! Aguardando corridas...' 
          : 'Você está offline'
      );
    } catch (error: any) {
      Alert.alert(
        'Erro', 
        error.response?.data?.detail || 'Não foi possível atualizar o status'
      );
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <View>
      {/* ... Avatar and driver info ... */}
      
      {/* Earnings from real API */}
      <View style={styles.earnings}>
        <Text>Disponível: R$ {balance?.available_balance.toFixed(2) || '0.00'}</Text>
        <Text>Bloqueado: R$ {balance?.locked_balance.toFixed(2) || '0.00'}</Text>
      </View>
      
      {/* Online/Offline toggle */}
      <View style={styles.toggleSection}>
        <Text>
          {isOnline ? 'Você está online' : 'Você está offline'}
        </Text>
        <Switch 
          value={isOnline} 
          onValueChange={handleToggleOnline}
          disabled={isUpdating}
        />
      </View>
      
      {isOnline && (
        <Text style={styles.status}>
          🟢 Procurando corridas próximas...
        </Text>
      )}
    </View>
  );
};
```

---

## 2. Exemplo: Atualizar IncomingRideRequestScreen

```typescript
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useRideStore } from '../../store';

export const IncomingRideRequestScreen = ({ navigation }) => {
  const { incomingRequest, acceptRide } = useRideStore();
  const [isAccepting, setIsAccepting] = useState(false);
  
  if (!incomingRequest) {
    navigation.goBack();
    return null;
  }
  
  const handleAccept = async () => {
    setIsAccepting(true);
    
    try {
      // Accept ride via API
      await acceptRide(incomingRequest.id);
      
      // Navigate to drive to pickup
      navigation.replace('DriveToPickup');
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.response?.data?.detail || 'Não foi possível aceitar a corrida'
      );
    } finally {
      setIsAccepting(false);
    }
  };
  
  const handleReject = () => {
    navigation.goBack();
  };
  
  return (
    <View>
      {/* ... ride request UI ... */}
      
      <Button 
        onPress={handleAccept} 
        loading={isAccepting}
      >
        Aceitar - R$ {incomingRequest.estimated_price.toFixed(2)}
      </Button>
      
      <Button 
        onPress={handleReject}
        variant="danger"
        disabled={isAccepting}
      >
        Rejeitar
      </Button>
    </View>
  );
};
```

---

## 3. Exemplo: Atualizar DriveToPickupScreen

```typescript
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { useRideStore } from '../../store';
import { driverApi, rideApi } from '../../api';

export const DriveToPickupScreen = ({ navigation }) => {
  const { currentRide, arriving } = useRideStore();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Update location every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const location = await Location.getCurrentPositionAsync({});
        await driverApi.updateLocation(
          location.coords.latitude,
          location.coords.longitude
        );
      } catch (error) {
        console.error('Failed to update location:', error);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleArrived = async () => {
    if (!currentRide) return;
    
    setIsUpdating(true);
    
    try {
      // Signal arrival via API
      await arriving(currentRide.id);
      
      // Navigate to start ride screen
      navigation.replace('StartRide');
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.response?.data?.detail || 'Não foi possível atualizar o status'
      );
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <View>
      {/* ... map and UI ... */}
      
      <Button 
        onPress={handleArrived}
        loading={isUpdating}
      >
        Cheguei
      </Button>
    </View>
  );
};
```

---

## 4. Exemplo: Atualizar StartRideScreen

```typescript
import { useRideStore } from '../../store';

export const StartRideScreen = ({ navigation }) => {
  const { currentRide, startRide } = useRideStore();
  const [isStarting, setIsStarting] = useState(false);
  
  const handleStart = async () => {
    if (!currentRide) return;
    
    setIsStarting(true);
    
    try {
      await startRide(currentRide.id);
      navigation.replace('TripInProgress');
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.detail || 'Falha ao iniciar');
    } finally {
      setIsStarting(false);
    }
  };
  
  return (
    <Button onPress={handleStart} loading={isStarting}>
      Iniciar Corrida
    </Button>
  );
};
```

---

## 5. Exemplo: Atualizar TripInProgressScreen

```typescript
import { useRideStore } from '../../store';

export const TripInProgressScreen = ({ navigation }) => {
  const { currentRide, finishRide } = useRideStore();
  const [isFinishing, setIsFinishing] = useState(false);
  
  const handleFinish = async () => {
    if (!currentRide) return;
    
    setIsFinishing(true);
    
    try {
      await finishRide(currentRide.id);
      navigation.replace('TripCompleted');
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.detail || 'Falha ao finalizar');
    } finally {
      setIsFinishing(false);
    }
  };
  
  return (
    <Button onPress={handleFinish} loading={isFinishing}>
      Finalizar Corrida
    </Button>
  );
};
```

---

## 6. Exemplo: Atualizar TripCompletedScreen (Cash Payment)

```typescript
import { useRideStore } from '../../store';

export const TripCompletedScreen = ({ navigation }) => {
  const { currentRide, confirmCashPayment } = useRideStore();
  const [isConfirming, setIsConfirming] = useState(false);
  
  const handleConfirmCash = async () => {
    if (!currentRide || currentRide.payment_method !== 'cash') return;
    
    setIsConfirming(true);
    
    try {
      await confirmCashPayment(currentRide.id);
      navigation.navigate('Rating');
    } catch (error: any) {
      Alert.alert('Erro', 'Falha ao confirmar pagamento');
    } finally {
      setIsConfirming(false);
    }
  };
  
  return (
    <View>
      {currentRide?.payment_method === 'cash' && (
        <Button onPress={handleConfirmCash} loading={isConfirming}>
          Confirmar Recebimento em Dinheiro
        </Button>
      )}
      
      {currentRide?.payment_method !== 'cash' && (
        <Button onPress={() => navigation.navigate('Rating')}>
          Continuar
        </Button>
      )}
    </View>
  );
};
```

---

## 7. Exemplo: Atualizar EarningsScreen

```typescript
import { useEffect } from 'react';
import { useWalletStore, useRideStore } from '../../store';

export const EarningsScreen = () => {
  const { balance, transactions, loadBalance, loadTransactions } = useWalletStore();
  const { rideHistory, loadHistory } = useRideStore();
  
  useEffect(() => {
    // Load data when screen opens
    loadBalance();
    loadTransactions();
    loadHistory();
  }, []);
  
  return (
    <View>
      {/* Balance from real API */}
      <Text>Disponível: R$ {balance?.available_balance.toFixed(2)}</Text>
      <Text>Bloqueado: R$ {balance?.locked_balance.toFixed(2)}</Text>
      <Text>Crédito: R$ {balance?.credit_balance.toFixed(2)}</Text>
      
      {/* Transactions from real API */}
      <FlatList
        data={transactions}
        renderItem={({ item }) => (
          <View>
            <Text>{item.description}</Text>
            <Text>R$ {item.amount.toFixed(2)}</Text>
          </View>
        )}
      />
      
      {/* Recent rides from real API */}
      <FlatList
        data={rideHistory}
        renderItem={({ item }) => (
          <View>
            <Text>{item.pickup.address} → {item.dropoff.address}</Text>
            <Text>R$ {item.actual_price?.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
};
```

---

## 8. Exemplo: Criar WalletScreen (Novo)

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { useWalletStore } from '../../store';
import { Button, Input } from '../../components';

export const WalletScreen = () => {
  const { balance, loadBalance, requestWithdrawal } = useWalletStore();
  const [amount, setAmount] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  
  useEffect(() => {
    loadBalance();
  }, []);
  
  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);
    
    // Validation
    if (!withdrawAmount || withdrawAmount < 50) {
      Alert.alert('Erro', 'Saque mínimo de R$ 50,00');
      return;
    }
    
    if (!balance || withdrawAmount > balance.available_balance) {
      Alert.alert('Erro', 'Saldo insuficiente');
      return;
    }
    
    if (!pixKey) {
      Alert.alert('Erro', 'Informe uma chave PIX');
      return;
    }
    
    setIsWithdrawing(true);
    
    try {
      await requestWithdrawal({
        amount: withdrawAmount,
        pix_key: pixKey,
        pix_key_type: 'PHONE', // Detectar automaticamente
      });
      
      Alert.alert(
        'Sucesso',
        `Saque de R$ ${withdrawAmount.toFixed(2)} solicitado!`
      );
      
      // Clear form
      setAmount('');
      setPixKey('');
      
      // Reload balance
      await loadBalance();
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.response?.data?.detail || 'Não foi possível solicitar o saque'
      );
    } finally {
      setIsWithdrawing(false);
    }
  };
  
  return (
    <View>
      <Text>Saldo Disponível</Text>
      <Text>R$ {balance?.available_balance.toFixed(2) || '0.00'}</Text>
      
      <Text>Saldo Bloqueado (D+N)</Text>
      <Text>R$ {balance?.locked_balance.toFixed(2) || '0.00'}</Text>
      
      <Input
        label="Valor do Saque"
        placeholder="Mínimo R$ 50,00"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      
      <Input
        label="Chave PIX"
        placeholder="Email, telefone ou CPF"
        value={pixKey}
        onChangeText={setPixKey}
      />
      
      <Button 
        onPress={handleWithdraw}
        loading={isWithdrawing}
        disabled={!amount || !pixKey}
      >
        Solicitar Saque
      </Button>
    </View>
  );
};
```

---

## 9. Exemplo: Hook customizado para localização

```typescript
// src/hooks/useLocation.ts
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { driverApi } from '../api';

export const useLocationTracking = (enabled: boolean, interval = 5000) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!enabled) return;
    
    let intervalId: NodeJS.Timeout;
    
    const startTracking = async () => {
      try {
        // Request permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setError('Permission denied');
          return;
        }
        
        // Start interval
        intervalId = setInterval(async () => {
          try {
            const loc = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.High,
            });
            
            setLocation(loc);
            
            // Update backend
            await driverApi.updateLocation(
              loc.coords.latitude,
              loc.coords.longitude
            );
          } catch (err) {
            console.error('Failed to get location:', err);
          }
        }, interval);
      } catch (err) {
        setError('Failed to start tracking');
      }
    };
    
    startTracking();
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [enabled, interval]);
  
  return { location, error };
};

// Uso:
function MyScreen() {
  const [isOnline, setIsOnline] = useState(false);
  const { location } = useLocationTracking(isOnline, 5000);
  
  return <View>...</View>;
}
```

---

## 10. Exemplo: Error Boundary para capturar erros globais

```typescript
// src/components/ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';
import { View, Text, Button } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Enviar para serviço de monitoramento (Sentry, etc)
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Algo deu errado</Text>
          <Text>{this.state.error?.message}</Text>
          <Button
            title="Tentar novamente"
            onPress={() => this.setState({ hasError: false })}
          />
        </View>
      );
    }
    
    return this.props.children;
  }
}

// Uso em App.tsx:
<ErrorBoundary>
  <RootNavigator />
</ErrorBoundary>
```

---

**Esses exemplos cobrem 90% dos casos de uso da integração backend! 🚀**
