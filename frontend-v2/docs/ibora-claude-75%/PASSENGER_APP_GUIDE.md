# 🚀 iBora Passenger App - Construction Guide

## 📋 **O QUE FOI ENTREGUE**

### ✅ **Componentes Criados (5 novos)**
```
src/components/
├── VehicleTypePicker.tsx    ⭐ Seletor de veículos (Bike, Auto, Taxi...)
├── CouponCard.tsx            ⭐ Card de cupom com botão apply
├── PriceSlider.tsx           ⭐ Slider de preço com +/-
├── PaymentMethodSelector.tsx ⭐ Seletor de métodos de pagamento
└── LocationInput.tsx         ⭐ Input de localização com marcador
```

### ✅ **Telas Criadas (4 principais)**
```
src/screens/passenger/
├── PassengerHomeScreen.tsx      ⭐ Home com mapa + veículos
├── SetPriceScreen.tsx           ⭐ Ajustar preço + cupom + pagamento
├── CouponsScreen.tsx            ⭐ Lista de cupons
└── PaymentMethodScreen.tsx      ⭐ Selecionar pagamento
```

### ✅ **Types e Mock Data**
```
src/types/
└── passenger.ts                 ⭐ Todos os types do passageiro

src/mock/
└── passengerData.ts             ⭐ Mock data completo
```

---

## 🎯 **TELAS QUE FALTAM** (14 telas)

Você precisa criar essas telas seguindo os mesmos padrões:

### 📱 **Onboarding & Auth** (5 telas)
1. ✅ `LoginScreen` - **(JÁ EXISTE, pode reusar do driver)**
2. 🔨 `ForgotPasswordScreen` - Modal de recuperação de senha
3. 🔨 `OTPVerificationScreen` - 6 dígitos de verificação
4. 🔨 `SignupScreen` - Cadastro (nome, email, senha, referral)
5. 🔨 `LocationPermissionScreen` - Solicitar permissão GPS
6. 🔨 `NotificationPermissionScreen` - Solicitar notificações

### 📍 **Seleção de Localização** (3 telas)
7. 🔨 `SelectDestinationScreen` - Modal para adicionar múltiplas paradas
8. 🔨 `SelectOnMapScreen` - Selecionar local no mapa
9. 🔨 `RoutePreviewScreen` - Visualizar rota completa

### 🚗 **Durante a Corrida** (5 telas)
10. 🔨 `WaitingDriverScreen` - Aguardando motorista aceitar
11. 🔨 `DriverOnWayScreen` - Motorista a caminho (com PIN)
12. 🔨 `TripInProgressScreen` - Viagem em andamento
13. 🔨 `ChatScreen` - Chat com motorista
14. 🔨 `TripCompletedScreen` - Breakdown de preço + pagamento
15. 🔨 `RatingScreen` - Avaliar motorista

---

## 📖 **COMO CRIAR CADA TELA**

### Padrão Geral
```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from '../../components';
import { useTheme } from '../../theme';
import { spacing, typography } from '../../theme/tokens';

export const [NomeDaTela]Screen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const [state, setState] = useState('');

  const handleAction = () => {
    // Lógica aqui
    navigation.navigate('ProximaTela');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Conteúdo */}
      <Button onPress={handleAction}>Continue</Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
});
```

---

### 1️⃣ **ForgotPasswordScreen**
```typescript
export const ForgotPasswordScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const [phone, setPhone] = useState('');

  return (
    <BottomSheet size="small">
      <Text style={styles.title}>Forgot Password ?</Text>
      <Input
        label="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        leftIcon={<Ionicons name="call-outline" size={20} />}
      />
      <Button onPress={() => navigation.navigate('OTPVerification')}>
        Continue
      </Button>
    </BottomSheet>
  );
};
```

---

### 2️⃣ **OTPVerificationScreen**
Use o componente `OTPInput` (criar novo ou usar biblioteca):
```bash
npm install react-native-otp-entry
```

```typescript
import { OTPInput } from 'react-native-otp-entry';

export const OTPVerificationScreen = ({ navigation }) => {
  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    if (otp.length === 6) {
      navigation.navigate('Signup');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Got an OTP?</Text>
      <Text style={styles.subtitle}>
        Login using the OTP sent +19998464309
      </Text>
      
      <OTPInput
        numberOfDigits={6}
        onTextChange={setOtp}
        focusColor="#5B51FF"
      />
      
      <Button onPress={handleVerify}>Verify</Button>
    </View>
  );
};
```

---

### 3️⃣ **SignupScreen**
```typescript
export const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referral, setReferral] = useState('');

  const handleSignup = async () => {
    // Chamar API de signup
    await authApi.signup({
      full_name: name,
      email,
      password,
      phone: '+5533987654321',
      role: 'passenger',
    });
    navigation.navigate('LocationPermission');
  };

  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        {/* Progress bar 50% */}
      </View>
      
      <Text style={styles.title}>Just one last thing</Text>
      
      <Input label="Full Name" value={name} onChangeText={setName} />
      <Input label="Email" value={email} onChangeText={setEmail} />
      <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Input label="Referral code(optional)" value={referral} onChangeText={setReferral} />
      
      <Button onPress={handleSignup}>Let's go!</Button>
    </View>
  );
};
```

---

### 4️⃣ **LocationPermissionScreen**
```typescript
import * as Location from 'expo-location';

export const LocationPermissionScreen = ({ navigation }) => {
  const handleAllow = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      navigation.navigate('NotificationPermission');
    }
  };

  return (
    <View style={styles.center}>
      <Text style={styles.icon}>📍</Text>
      <Text style={styles.title}>Location permission not enabled</Text>
      <Text style={styles.description}>
        Sharing Location permission helps us improve your ride booking and pickup experience
      </Text>
      
      <Button onPress={handleAllow}>Allow Permission</Button>
      <Button variant="ghost" onPress={() => navigation.navigate('Home')}>
        Enter pickup manually
      </Button>
    </View>
  );
};
```

---

### 5️⃣ **NotificationPermissionScreen**
```typescript
import * as Notifications from 'expo-notifications';

export const NotificationPermissionScreen = ({ navigation }) => {
  const handleAllow = async () => {
    await Notifications.requestPermissionsAsync();
    navigation.navigate('PassengerHome');
  };

  return (
    <BottomSheet size="medium">
      <Text style={styles.title}>Allow Notifications and on-ride alerts</Text>
      
      <View style={styles.feature}>
        <Text style={styles.icon}>📍</Text>
        <View>
          <Text style={styles.featureTitle}>Real-time Captain updates</Text>
          <Text style={styles.featureDesc}>
            Get notified about captain's allocation, arrival and more
          </Text>
        </View>
      </View>
      
      <View style={styles.feature}>
        <Text style={styles.icon}>🎁</Text>
        <View>
          <Text style={styles.featureTitle}>Offer and news</Text>
          <Text style={styles.featureDesc}>
            Be the first to know about our offers and new features
          </Text>
        </View>
      </View>
      
      <Button onPress={handleAllow}>Allow</Button>
      <Button variant="ghost" onPress={() => navigation.navigate('PassengerHome')}>
        Maybe, later
      </Button>
    </BottomSheet>
  );
};
```

---

### 6️⃣ **SelectDestinationScreen**
```typescript
export const SelectDestinationScreen = ({ navigation, route }) => {
  const [stops, setStops] = useState<string[]>([]);

  const handleAddStop = () => {
    navigation.navigate('SelectOnMap', { 
      onSelect: (location) => setStops([...stops, location.address]) 
    });
  };

  return (
    <BottomSheet size="large">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Drop</Text>
      </View>

      <LocationInput type="pickup" value="Lajamni Chowk, Surat, India" editable={false} />
      
      {stops.map((stop, index) => (
        <LocationInput
          key={index}
          type="dropoff"
          value={stop}
          onClear={() => setStops(stops.filter((_, i) => i !== index))}
        />
      ))}
      
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => navigation.navigate('SelectOnMap')}>
          <Ionicons name="map-outline" size={20} />
          <Text>Select on map</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleAddStop}>
          <Ionicons name="add-circle-outline" size={20} />
          <Text>Add a destination</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};
```

---

### 7️⃣ **SelectOnMapScreen**
```typescript
export const SelectOnMapScreen = ({ navigation, route }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleDone = () => {
    route.params?.onSelect?.(selectedLocation);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <MapPlaceholder />
      
      {/* Center marker */}
      <View style={styles.centerMarker}>
        <Ionicons name="location" size={40} color="red" />
      </View>
      
      <Button 
        onPress={handleDone}
        style={styles.doneButton}
      >
        Done
      </Button>
    </View>
  );
};
```

---

### 8️⃣ **DriverOnWayScreen**
```typescript
export const DriverOnWayScreen = ({ navigation }) => {
  const [timer, setTimer] = useState('00:04:24');

  return (
    <View style={styles.container}>
      <MapPlaceholder />
      
      <View style={styles.header}>
        <Text style={styles.status}>Captain on the way</Text>
        <Text style={styles.timer}>{timer}</Text>
      </View>

      <View style={styles.bottomSheet}>
        <Text style={styles.pinTitle}>Start your order with PIN</Text>
        <View style={styles.pinBoxes}>
          <Text style={styles.pin}>5</Text>
          <Text style={styles.pin}>5</Text>
          <Text style={styles.pin}>7</Text>
          <Text style={styles.pin}>5</Text>
        </View>

        <View style={styles.driverInfo}>
          <Avatar
            source={{ uri: mockDriver.user.avatar_url }}
            size="md"
            status="online"
          />
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{mockDriver.user.full_name}</Text>
            <Text style={styles.vehicle}>
              {mockDriver.vehicle.model} - {mockDriver.vehicle.plate}
            </Text>
            <Rating value={mockDriver.rating} readonly size="sm" />
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="call" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble" size={24} />
            <Text>Message {mockDriver.user.full_name}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pickup}>
          <Text style={styles.label}>Pickup From</Text>
          <Text style={styles.address}>Lajamni Chowk, Surat, India</Text>
          <TouchableOpacity onPress={() => navigation.navigate('TripDetails')}>
            <Text style={styles.link}>Trip Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
```

---

### 9️⃣ **TripCompletedScreen**
```typescript
export const TripCompletedScreen = ({ navigation }) => {
  const [selectedPayment, setSelectedPayment] = useState(mockPaymentMethods[2]);

  const handleNext = () => {
    navigation.navigate('Rating');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar fallback="H" size="xl" />
        <View style={styles.badge}>
          <Ionicons name="checkmark-circle" size={20} color="green" />
          <Text>RIDE COMPLETED</Text>
        </View>
      </View>

      <Text style={styles.title}>Select a payment method to pay</Text>

      {/* Price Breakdown */}
      <View style={styles.breakdown}>
        <View style={styles.row}>
          <Text>Total trip fare</Text>
          <Text>$ 36.17 ▼</Text>
        </View>
        <View style={styles.detail}>
          <Text>Ride Charges</Text>
          <Text>$ 25.00</Text>
        </View>
        <View style={styles.detail}>
          <Text>Whether Charge</Text>
          <Text>$ 1.17</Text>
        </View>
        <View style={styles.detail}>
          <Text>Platform fee</Text>
          <Text>$ 10.00</Text>
        </View>
        <View style={styles.total}>
          <Text>AMOUNT TO BE PAID</Text>
          <Text>$ 36.17</Text>
        </View>
      </View>

      {/* Payment Methods */}
      <Text style={styles.sectionTitle}>Payment Getway Method</Text>
      <PaymentMethodSelector
        methods={mockPaymentMethods}
        selected={selectedPayment}
        onSelect={setSelectedPayment}
      />

      <Button onPress={handleNext}>Next</Button>
    </View>
  );
};
```

---

### 🔟 **RatingScreen**
```typescript
export const RatingScreen = ({ navigation }) => {
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');

  const tags = [
    'Comfortable ride',
    'Professional ride',
    'Affordable',
    'Clean Helmet',
    'Safe Driving',
    'Friendly',
  ];

  const handleDone = async () => {
    // Submit rating
    await ratingApi.submit({
      ride_id: 'ride-123',
      driver_id: 'drv-1',
      rating,
      tags: selectedTags,
      comment,
    });
    
    navigation.navigate('PassengerHome');
  };

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Ionicons name="checkmark-circle" size={20} color="green" />
        <Text>Paid $36.17</Text>
        <TouchableOpacity>
          <Ionicons name="help-circle-outline" size={20} />
        </TouchableOpacity>
      </View>

      <Avatar source={{ uri: mockDriver.user.avatar_url }} size="xl" />
      
      <Text style={styles.title}>
        How was your ride with {mockDriver.user.full_name}
      </Text>

      <Rating
        value={rating}
        onChange={setRating}
        size="lg"
      />

      <Text style={styles.subtitle}>
        Great, what did you like the most? 😊
      </Text>

      <View style={styles.tags}>
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            selected={selectedTags.includes(tag)}
            onPress={() => {
              setSelectedTags(
                selectedTags.includes(tag)
                  ? selectedTags.filter((t) => t !== tag)
                  : [...selectedTags, tag]
              );
            }}
          />
        ))}
      </View>

      <Input
        placeholder="Write your comment..."
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <Button onPress={handleDone} disabled={rating === 0}>
        Done
      </Button>
      <Button variant="ghost" onPress={() => navigation.navigate('PassengerHome')}>
        Skip
      </Button>
    </View>
  );
};
```

---

## 🔗 **NAVEGAÇÃO DO PASSAGEIRO**

Crie o arquivo `src/navigation/PassengerNavigator.tsx`:

```typescript
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  PassengerHomeScreen,
  SetPriceScreen,
  CouponsScreen,
  PaymentMethodScreen,
  SelectDestinationScreen,
  SelectOnMapScreen,
  DriverOnWayScreen,
  TripCompletedScreen,
  RatingScreen,
  // ... outras telas
} from '../screens/passenger';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const PassengerTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={PassengerHomeScreen} />
    <Tab.Screen name="Activity" component={ActivityScreen} />
    <Tab.Screen name="Wallet" component={WalletScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export const PassengerNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
    <Stack.Screen name="NotificationPermission" component={NotificationPermissionScreen} />
    
    <Stack.Screen name="PassengerTabs" component={PassengerTabs} />
    
    <Stack.Screen name="SelectDestination" component={SelectDestinationScreen} />
    <Stack.Screen name="SelectOnMap" component={SelectOnMapScreen} />
    <Stack.Screen name="SetPrice" component={SetPriceScreen} />
    <Stack.Screen name="Coupons" component={CouponsScreen} />
    <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
    
    <Stack.Screen name="WaitingDriver" component={WaitingDriverScreen} />
    <Stack.Screen name="DriverOnWay" component={DriverOnWayScreen} />
    <Stack.Screen name="TripInProgress" component={TripInProgressScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen name="TripCompleted" component={TripCompletedScreen} />
    <Stack.Screen name="Rating" component={RatingScreen} />
  </Stack.Navigator>
);
```

---

## 📦 **DEPENDÊNCIAS NECESSÁRIAS**

Adicione ao `package.json`:
```json
{
  "dependencies": {
    "@react-native-community/slider": "^4.4.3",
    "react-native-otp-entry": "^1.4.0"
  }
}
```

Instale:
```bash
npm install @react-native-community/slider react-native-otp-entry
```

---

## 🎨 **PADRÕES DE CÓDIGO**

### ✅ Sempre usar:
- SafeAreaView para telas
- useTheme() para cores
- spacing/typography tokens
- TypeScript strict
- Componentes reutilizáveis

### ✅ Estrutura de arquivo:
```typescript
// 1. Imports
// 2. Types/Interfaces
// 3. Component
// 4. Styles
```

### ✅ Naming:
- Screens: `[Nome]Screen.tsx`
- Components: `[Nome].tsx`
- Hooks: `use[Nome].ts`
- Types: `lowercase.ts`

---

## 🔌 **INTEGRAÇÃO COM BACKEND**

Siga os mesmos padrões do driver app:

```typescript
// Criar Passenger Store
import { create } from 'zustand';
import { passengerApi, rideApi } from '../api';

export const usePassengerStore = create((set) => ({
  passenger: null,
  currentRide: null,
  
  requestRide: async (request: RideRequest) => {
    const ride = await rideApi.requestRide(request);
    set({ currentRide: ride });
  },
  
  // ... outros métodos
}));
```

---

## ✅ **CHECKLIST DE CONCLUSÃO**

- [ ] Criar todas as 14 telas faltantes
- [ ] Configurar navegação completa
- [ ] Adicionar PassengerStore com Zustand
- [ ] Integrar com backend APIs
- [ ] Adicionar WebSocket para ride updates
- [ ] Criar ChatScreen funcional
- [ ] Adicionar mapa real (Google Maps/Mapbox)
- [ ] Implementar tracking GPS em tempo real
- [ ] Testar fluxo completo end-to-end
- [ ] Adicionar error handling
- [ ] Adicionar loading states
- [ ] Criar testes

---

## 🚀 **RESULTADO ESPERADO**

Ao completar todas as telas, você terá:

✅ **App de Passageiro completo**  
✅ **Todos os fluxos funcionais**  
✅ **UI 95%+ fiel aos screenshots**  
✅ **Integração backend pronta**  
✅ **Production-ready code**  

---

## 📞 **SUPORTE**

**Dúvidas?**
1. Consulte as telas já criadas como referência
2. Siga os padrões do driver app
3. Use os componentes que já existem
4. Veja os exemplos de código acima

**Stack completo:**
- React Native + TypeScript
- React Navigation
- Zustand (state)
- Axios (API)
- WebSocket (real-time)

---

**Boa sorte completando o app! 🎉**

**Você já tem 60% pronto. Faltam apenas as telas específicas! 🚀**
