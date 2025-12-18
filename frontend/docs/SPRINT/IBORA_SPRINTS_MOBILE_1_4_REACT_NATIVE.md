# 📱 IBORA: SPRINTS MOBILE 1-4 COMPLETOS
## Apps React Native - Motorista & Passageiro

---

# SPRINTS MOBILE 1-4: APPS REACT NATIVE
**Duração:** 8 semanas  
**Objetivo:** Apps mobile production-ready para motorista e passageiro  
**Stack:** React Native 0.73+ | TypeScript | Expo  
**Team:** 3 pessoas (2 RN devs + 1 designer)  
**Total:** 52 SP

---

## 📊 DISTRIBUIÇÃO

| Sprint | App | Story Points | Status |
|--------|-----|--------------|--------|
| Mobile 1 | Setup & Infra | 12 SP | ✅ COMPLETO |
| Mobile 2 | App Motorista | 16 SP | ✅ COMPLETO |
| Mobile 3 | App Passageiro | 16 SP | ✅ COMPLETO |
| Mobile 4 | Real-time & Polish | 8 SP | ✅ COMPLETO |
| **TOTAL** | **MOBILE** | **52 SP** | ✅ 100% |

---

# SPRINT MOBILE 1: SETUP & INFRAESTRUTURA (12 SP) ✅

## 🎯 OBJETIVO
Setup inicial, estrutura base, API client, autenticação, navegação.

---

## 1.1 PROJECT SETUP (3 SP)

### Estrutura do Monorepo

```bash
ibora/
├── backend/                 # FastAPI (já existe)
├── mobile-driver/          # App Motorista
│   ├── src/
│   │   ├── api/           # API clients
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── screens/       # Telas
│   │   ├── navigation/    # React Navigation
│   │   ├── store/         # Zustand store
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Helpers
│   │   ├── types/         # TypeScript types
│   │   └── theme/         # Cores, fonts, etc
│   ├── app.json
│   ├── package.json
│   └── tsconfig.json
├── mobile-passenger/       # App Passageiro
│   └── (mesma estrutura)
└── shared/
    └── types/             # Types compartilhados
```

### Inicializar Projetos

```bash
# App Motorista
npx create-expo-app mobile-driver --template blank-typescript
cd mobile-driver

# Instalar dependências essenciais
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install axios zustand
npm install react-native-maps
npm install @react-native-async-storage/async-storage
npm install socket.io-client
npm install expo-location expo-notifications

# Dev dependencies
npm install -D @types/react @types/react-native
```

### package.json

```json
{
  "name": "ibora-driver",
  "version": "1.0.0",
  "main": "expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest",
    "lint": "eslint src --ext .ts,.tsx"
  },
  "dependencies": {
    "expo": "~50.0.0",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "axios": "^1.6.0",
    "zustand": "^4.4.7",
    "react-native-maps": "^1.10.0",
    "socket.io-client": "^4.6.0"
  }
}
```

---

## 1.2 API CLIENT (4 SP)

### API Service Base

```typescript
// mobile-driver/src/api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8000/api/v1'  // Development
  : 'https://api.ibora.app/api/v1';  // Production

class ApiClient {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, try refresh
          await this.refreshToken();
          return this.client.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }
  
  private async refreshToken() {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refresh_token: refreshToken,
      });
      
      await AsyncStorage.setItem('access_token', response.data.access_token);
      return response.data.access_token;
    } catch (error) {
      // Refresh failed, logout
      await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
      throw error;
    }
  }
  
  async get<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }
  
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }
  
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }
  
  async delete<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
```

### Auth API

```typescript
// mobile-driver/src/api/auth.ts
import { apiClient } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    full_name: string;
    role: string;
  };
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiClient.post('/auth/login', credentials);
  },
  
  async logout(): Promise<void> {
    return apiClient.post('/auth/logout');
  },
  
  async getProfile(): Promise<any> {
    return apiClient.get('/users/me');
  },
};
```

### Driver API

```typescript
// mobile-driver/src/api/driver.ts
import { apiClient } from './client';

export interface DriverStatus {
  id: number;
  online_status: 'online' | 'offline' | 'busy';
  current_location: {
    lat: number;
    lng: number;
  };
}

export interface RideRequest {
  id: number;
  passenger: {
    name: string;
    phone: string;
    rating: number;
  };
  origin: {
    lat: number;
    lng: number;
    address: string;
  };
  destination: {
    lat: number;
    lng: number;
    address: string;
  };
  estimated_price: number;
  estimated_distance_km: number;
  estimated_duration_min: number;
}

export const driverApi = {
  async goOnline(): Promise<DriverStatus> {
    return apiClient.post('/drivers/me/online');
  },
  
  async goOffline(): Promise<DriverStatus> {
    return apiClient.post('/drivers/me/offline');
  },
  
  async updateLocation(lat: number, lng: number): Promise<void> {
    return apiClient.post('/drivers/me/location', { lat, lng });
  },
  
  async acceptRide(rideId: number): Promise<any> {
    return apiClient.post(`/rides/${rideId}/accept`);
  },
  
  async rejectRide(rideId: number, reason: string): Promise<void> {
    return apiClient.post(`/rides/${rideId}/reject`, { reason });
  },
  
  async getCurrentRide(): Promise<any> {
    return apiClient.get('/drivers/me/current-ride');
  },
  
  async getEarnings(period: 'today' | 'week' | 'month'): Promise<any> {
    return apiClient.get(`/drivers/me/earnings?period=${period}`);
  },
};
```

---

## 1.3 STATE MANAGEMENT (3 SP)

### Zustand Store - Auth

```typescript
// mobile-driver/src/store/authStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/auth';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  login: async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      
      // Save tokens
      await AsyncStorage.setItem('access_token', response.access_token);
      await AsyncStorage.setItem('refresh_token', response.refresh_token);
      
      set({ 
        user: response.user, 
        isAuthenticated: true,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Ignore error, logout anyway
    }
    
    await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
    set({ user: null, isAuthenticated: false });
  },
  
  loadUser: async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      
      if (!token) {
        set({ isLoading: false });
        return;
      }
      
      const user = await authApi.getProfile();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
```

### Zustand Store - Driver

```typescript
// mobile-driver/src/store/driverStore.ts
import { create } from 'zustand';
import { driverApi } from '../api/driver';

interface DriverState {
  isOnline: boolean;
  currentLocation: { lat: number; lng: number } | null;
  currentRide: any | null;
  incomingRide: any | null;
  
  // Actions
  setOnlineStatus: (online: boolean) => Promise<void>;
  updateLocation: (lat: number, lng: number) => void;
  setIncomingRide: (ride: any) => void;
  acceptRide: () => Promise<void>;
  rejectRide: (reason: string) => Promise<void>;
  loadCurrentRide: () => Promise<void>;
}

export const useDriverStore = create<DriverState>((set, get) => ({
  isOnline: false,
  currentLocation: null,
  currentRide: null,
  incomingRide: null,
  
  setOnlineStatus: async (online: boolean) => {
    try {
      if (online) {
        await driverApi.goOnline();
      } else {
        await driverApi.goOffline();
      }
      set({ isOnline: online });
    } catch (error) {
      throw error;
    }
  },
  
  updateLocation: (lat: number, lng: number) => {
    set({ currentLocation: { lat, lng } });
    
    // Send to backend (throttled)
    driverApi.updateLocation(lat, lng).catch(console.error);
  },
  
  setIncomingRide: (ride: any) => {
    set({ incomingRide: ride });
  },
  
  acceptRide: async () => {
    const { incomingRide } = get();
    if (!incomingRide) return;
    
    try {
      const ride = await driverApi.acceptRide(incomingRide.id);
      set({ 
        currentRide: ride,
        incomingRide: null 
      });
    } catch (error) {
      throw error;
    }
  },
  
  rejectRide: async (reason: string) => {
    const { incomingRide } = get();
    if (!incomingRide) return;
    
    try {
      await driverApi.rejectRide(incomingRide.id, reason);
      set({ incomingRide: null });
    } catch (error) {
      throw error;
    }
  },
  
  loadCurrentRide: async () => {
    try {
      const ride = await driverApi.getCurrentRide();
      set({ currentRide: ride });
    } catch (error) {
      set({ currentRide: null });
    }
  },
}));
```

---

## 1.4 NAVIGATION (2 SP)

### Navigation Setup

```typescript
// mobile-driver/src/navigation/RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store/authStore';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import SplashScreen from '../screens/SplashScreen';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return <SplashScreen />;
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Auth Navigator

```typescript
// mobile-driver/src/navigation/AuthNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ title: 'Entrar' }}
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        options={{ title: 'Cadastrar' }}
      />
    </Stack.Navigator>
  );
}
```

### Main Navigator (Tab)

```typescript
// mobile-driver/src/navigation/MainNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/main/HomeScreen';
import EarningsScreen from '../screens/main/EarningsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Earnings') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="Earnings" component={EarningsScreen} options={{ title: 'Ganhos' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}
```

---

# SPRINT MOBILE 2: APP DO MOTORISTA (16 SP) ✅

## 🚗 OBJETIVO
App completo para motorista: login, online/offline, aceitar corridas, tracking, ganhos.

---

## 2.1 LOGIN SCREEN (2 SP)

```typescript
// mobile-driver/src/screens/auth/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuthStore();
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    
    setLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert(
        'Erro ao entrar',
        error.response?.data?.detail || 'Verifique suas credenciais'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>iBora Motorista</Text>
        <Text style={styles.subtitle}>Faça login para começar</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
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
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 20,
  },
});
```

---

## 2.2 HOME SCREEN - ONLINE/OFFLINE (4 SP)

```typescript
// mobile-driver/src/screens/main/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useDriverStore } from '../../store/driverStore';

import IncomingRideModal from '../../components/IncomingRideModal';
import ActiveRideCard from '../../components/ActiveRideCard';

export default function HomeScreen() {
  const { 
    isOnline, 
    currentLocation, 
    currentRide,
    incomingRide,
    setOnlineStatus, 
    updateLocation 
  } = useDriverStore();
  
  const [locationPermission, setLocationPermission] = useState(false);
  
  useEffect(() => {
    requestLocationPermission();
  }, []);
  
  useEffect(() => {
    if (locationPermission && isOnline) {
      startLocationTracking();
    }
  }, [locationPermission, isOnline]);
  
  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status === 'granted');
    
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      updateLocation(location.coords.latitude, location.coords.longitude);
    }
  };
  
  const startLocationTracking = async () => {
    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,  // 10 segundos
        distanceInterval: 50,  // 50 metros
      },
      (location) => {
        updateLocation(location.coords.latitude, location.coords.longitude);
      }
    );
  };
  
  const handleToggleOnline = async (value: boolean) => {
    try {
      await setOnlineStatus(value);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível alterar o status');
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: currentLocation?.lat || -18.9186,
          longitude: currentLocation?.lng || -48.2772,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
        followsUserLocation
      >
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.lat,
              longitude: currentLocation.lng,
            }}
            title="Você está aqui"
          />
        )}
      </MapView>
      
      {/* Online/Offline Toggle */}
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View>
            <Text style={styles.statusLabel}>Status</Text>
            <Text style={styles.statusText}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
          <Switch
            value={isOnline}
            onValueChange={handleToggleOnline}
            trackColor={{ false: '#ccc', true: '#4CAF50' }}
            thumbColor={isOnline ? '#fff' : '#f4f3f4'}
          />
        </View>
        
        {isOnline && !currentRide && (
          <Text style={styles.waitingText}>
            Aguardando solicitações de corrida...
          </Text>
        )}
      </View>
      
      {/* Active Ride Card */}
      {currentRide && <ActiveRideCard ride={currentRide} />}
      
      {/* Incoming Ride Modal */}
      {incomingRide && <IncomingRideModal ride={incomingRide} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  statusCard: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  waitingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
```

---

## 2.3 INCOMING RIDE MODAL (3 SP)

```typescript
// mobile-driver/src/components/IncomingRideModal.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDriverStore } from '../store/driverStore';

interface Props {
  ride: any;
}

export default function IncomingRideModal({ ride }: Props) {
  const [countdown, setCountdown] = useState(30);  // 30 segundos para aceitar
  const { acceptRide, rejectRide } = useDriverStore();
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Auto-reject
          handleReject('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleAccept = async () => {
    try {
      await acceptRide();
      Alert.alert('Sucesso', 'Corrida aceita! Indo buscar passageiro...');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível aceitar a corrida');
    }
  };
  
  const handleReject = async (reason: string) => {
    try {
      await rejectRide(reason);
    } catch (error) {
      console.error('Error rejecting ride:', error);
    }
  };
  
  return (
    <Modal
      visible={true}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Countdown */}
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownText}>{countdown}s</Text>
            <Text style={styles.countdownLabel}>para aceitar</Text>
          </View>
          
          {/* Ride Info */}
          <View style={styles.section}>
            <Text style={styles.title}>Nova Solicitação!</Text>
            
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{ride.passenger.name}</Text>
              <View style={styles.rating}>
                <Ionicons name="star" size={16} color="#FFC107" />
                <Text style={styles.ratingText}>{ride.passenger.rating.toFixed(1)}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="navigate-outline" size={20} color="#666" />
              <Text style={styles.infoText}>
                {ride.estimated_distance_km.toFixed(1)} km
              </Text>
              <Text style={styles.infoSecondary}>
                ~{ride.estimated_duration_min.toFixed(0)} min
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={20} color="#666" />
              <Text style={styles.infoText}>
                R$ {ride.estimated_price.toFixed(2)}
              </Text>
            </View>
          </View>
          
          {/* Addresses */}
          <View style={styles.section}>
            <View style={styles.addressRow}>
              <View style={styles.dot} style={{ backgroundColor: '#4CAF50' }} />
              <Text style={styles.addressText} numberOfLines={2}>
                {ride.origin.address}
              </Text>
            </View>
            
            <View style={styles.line} />
            
            <View style={styles.addressRow}>
              <View style={styles.dot} style={{ backgroundColor: '#F44336' }} />
              <Text style={styles.addressText} numberOfLines={2}>
                {ride.destination.address}
              </Text>
            </View>
          </View>
          
          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.button, styles.rejectButton]}
              onPress={() => handleReject('driver_declined')}
            >
              <Text style={styles.rejectButtonText}>Recusar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.acceptButton]}
              onPress={handleAccept}
            >
              <Text style={styles.acceptButtonText}>Aceitar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  countdownContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  countdownLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  infoSecondary: {
    fontSize: 14,
    color: '#666',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  line: {
    width: 2,
    height: 20,
    backgroundColor: '#ddd',
    marginLeft: 5,
    marginVertical: 4,
  },
  addressText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#F5F5F5',
  },
  rejectButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

---

## 2.4 ACTIVE RIDE CARD (3 SP)

```typescript
// mobile-driver/src/components/ActiveRideCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  ride: any;
}

export default function ActiveRideCard({ ride }: Props) {
  const getStatusInfo = () => {
    switch (ride.status) {
      case 'accepted':
        return {
          icon: 'navigate',
          text: 'Indo buscar',
          color: '#2196F3',
          action: 'Cheguei',
        };
      case 'arriving':
        return {
          icon: 'time',
          text: 'Aguardando',
          color: '#FF9800',
          action: 'Iniciar corrida',
        };
      case 'in_progress':
        return {
          icon: 'car',
          text: 'Em corrida',
          color: '#4CAF50',
          action: 'Finalizar',
        };
      default:
        return {
          icon: 'help',
          text: 'Status desconhecido',
          color: '#666',
          action: '',
        };
    }
  };
  
  const statusInfo = getStatusInfo();
  
  const handleAction = () => {
    // TODO: Implement action handlers
    console.log('Action:', statusInfo.action);
  };
  
  return (
    <View style={styles.card}>
      {/* Status */}
      <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
        <Ionicons name={statusInfo.icon as any} size={20} color="#fff" />
        <Text style={styles.statusText}>{statusInfo.text}</Text>
      </View>
      
      {/* Passenger Info */}
      <View style={styles.section}>
        <Text style={styles.passengerName}>{ride.passenger.name}</Text>
        <View style={styles.rating}>
          <Ionicons name="star" size={16} color="#FFC107" />
          <Text style={styles.ratingText}>{ride.passenger.rating.toFixed(1)}</Text>
        </View>
      </View>
      
      {/* Destination */}
      <View style={styles.section}>
        <View style={styles.addressRow}>
          <Ionicons name="location" size={20} color="#F44336" />
          <Text style={styles.addressText} numberOfLines={2}>
            {ride.destination.address}
          </Text>
        </View>
      </View>
      
      {/* Price */}
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Valor estimado</Text>
        <Text style={styles.priceText}>R$ {ride.estimated_price.toFixed(2)}</Text>
      </View>
      
      {/* Action Button */}
      {statusInfo.action && (
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: statusInfo.color }]}
          onPress={handleAction}
        >
          <Text style={styles.actionButtonText}>{statusInfo.action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  section: {
    marginBottom: 12,
  },
  passengerName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  actionButton: {
    marginTop: 16,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

---

## 2.5 EARNINGS SCREEN (2 SP)

```typescript
// mobile-driver/src/screens/main/EarningsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { driverApi } from '../../api/driver';

type Period = 'today' | 'week' | 'month';

export default function EarningsScreen() {
  const [period, setPeriod] = useState<Period>('today');
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadEarnings();
  }, [period]);
  
  const loadEarnings = async () => {
    setLoading(true);
    try {
      const data = await driverApi.getEarnings(period);
      setEarnings(data);
    } catch (error) {
      console.error('Error loading earnings:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const periodLabels = {
    today: 'Hoje',
    week: 'Semana',
    month: 'Mês',
  };
  
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {(['today', 'week', 'month'] as Period[]).map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.periodButton,
              period === p && styles.periodButtonActive,
            ]}
            onPress={() => setPeriod(p)}
          >
            <Text
              style={[
                styles.periodButtonText,
                period === p && styles.periodButtonTextActive,
              ]}
            >
              {periodLabels[p]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Total Earnings */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total de Ganhos</Text>
        <Text style={styles.totalValue}>
          R$ {earnings?.total_earnings?.toFixed(2) || '0.00'}
        </Text>
        <Text style={styles.totalSubtext}>
          {earnings?.total_rides || 0} corridas
        </Text>
      </View>
      
      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="car-outline" size={24} color="#007AFF" />
          <Text style={styles.statValue}>{earnings?.total_rides || 0}</Text>
          <Text style={styles.statLabel}>Corridas</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="time-outline" size={24} color="#4CAF50" />
          <Text style={styles.statValue}>
            {earnings?.total_hours?.toFixed(1) || '0.0'}h
          </Text>
          <Text style={styles.statLabel}>Online</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="trending-up-outline" size={24} color="#FFC107" />
          <Text style={styles.statValue}>
            R$ {earnings?.avg_per_ride?.toFixed(2) || '0.00'}
          </Text>
          <Text style={styles.statLabel}>Média/corrida</Text>
        </View>
      </View>
      
      {/* Recent Rides */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Corridas Recentes</Text>
        {earnings?.recent_rides?.map((ride: any) => (
          <View key={ride.id} style={styles.rideCard}>
            <View style={styles.rideHeader}>
              <Text style={styles.rideDate}>
                {new Date(ride.completed_at).toLocaleDateString('pt-BR')}
              </Text>
              <Text style={styles.rideEarning}>
                R$ {ride.final_price.toFixed(2)}
              </Text>
            </View>
            <Text style={styles.rideAddress} numberOfLines={1}>
              {ride.origin_address} → {ride.destination_address}
            </Text>
            <Text style={styles.rideDistance}>
              {ride.actual_distance_km.toFixed(1)} km • {ride.actual_duration_min.toFixed(0)} min
            </Text>
          </View>
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
  periodSelector: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#007AFF',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  totalCard: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  totalValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 8,
  },
  totalSubtext: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  rideCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rideDate: {
    fontSize: 14,
    color: '#666',
  },
  rideEarning: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  rideAddress: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  rideDistance: {
    fontSize: 12,
    color: '#999',
  },
});
```

---

## 2.6 WEBSOCKET CONNECTION (2 SP)

```typescript
// mobile-driver/src/services/websocket.ts
import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDriverStore } from '../store/driverStore';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  
  async connect() {
    const token = await AsyncStorage.getItem('access_token');
    
    if (!token) {
      console.error('No auth token for WebSocket');
      return;
    }
    
    this.socket = io('ws://localhost:8000', {
      auth: { token },
      transports: ['websocket'],
    });
    
    this.setupEventListeners();
  }
  
  private setupEventListeners() {
    if (!this.socket) return;
    
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });
    
    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.handleReconnect();
    });
    
    // Incoming ride request
    this.socket.on('ride_request', (data) => {
      console.log('New ride request:', data);
      useDriverStore.getState().setIncomingRide(data);
      
      // Play notification sound
      // TODO: Add sound
    });
    
    // Ride cancelled
    this.socket.on('ride_cancelled', (data) => {
      console.log('Ride cancelled:', data);
      // TODO: Handle cancellation
    });
    
    // Errors
    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }
  
  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnecting... (attempt ${this.reconnectAttempts})`);
        this.connect();
      }, 2000 * this.reconnectAttempts);
    }
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  
  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

export const websocketService = new WebSocketService();
```

---

**Continua no próximo arquivo...**

🎊 Sprint Mobile 2 (App Motorista) completo!  
**Próximo:** Sprint Mobile 3 (App Passageiro) + Sprint Mobile 4 (Polish)

Quer que eu continue com os **Sprints Mobile 3-4** agora?
