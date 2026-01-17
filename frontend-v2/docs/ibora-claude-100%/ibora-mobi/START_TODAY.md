# ⚡ QUICK START - Começar HOJE

## 🎯 **OBJETIVO**
Ter o mapa real funcionando no Driver App nas próximas **4 horas**.

---

## ☕ **PRIMEIRA HORA - Setup**

### Minuto 0-15: Configurar Google Maps API

```bash
# 1. Ir para: https://console.cloud.google.com/
# 2. Criar novo projeto: "iBora Production"
# 3. Habilitar APIs:
#    - Maps SDK for Android
#    - Maps SDK for iOS
#    - Places API
#    - Directions API
#    - Distance Matrix API
#    - Geocoding API
```

**Criar API Keys:**
```
Android Key: AIzaSy... (com restrição de app bundle)
iOS Key: AIzaSy... (com restrição de bundle ID)
Browser Key: AIzaSy... (para desenvolvimento web)
```

**Anotar as keys** em lugar seguro (LastPass/1Password).

---

### Minuto 15-30: Instalar Dependências

```bash
cd ibora-mobi/frontend

# Instalar react-native-maps
npm install react-native-maps

# iOS: Instalar pods
cd ios && pod install && cd ..

# Android: Já configurado automaticamente
```

**Se usar Expo (recomendado):**
```bash
npx expo install react-native-maps
```

---

### Minuto 30-45: Configurar API Keys

**iOS (`ios/iboraMobi/AppDelegate.mm`):**
```objc
#import <GoogleMaps/GoogleMaps.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSServices provideAPIKey:@"SUA_IOS_API_KEY_AQUI"];
  
  // ... resto do código
}

@end
```

**Android (`android/app/src/main/AndroidManifest.xml`):**
```xml
<application>
  <!-- ... -->
  
  <meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="SUA_ANDROID_API_KEY_AQUI"/>
    
</application>
```

**React Native Config (`.env`):**
```env
GOOGLE_MAPS_API_KEY_ANDROID=AIzaSy...
GOOGLE_MAPS_API_KEY_IOS=AIzaSy...
```

---

### Minuto 45-60: Testar Instalação

```bash
# iOS
npm run ios

# Android
npm run android
```

**Verificar:**
- [ ] App abre sem crash
- [ ] Sem erros de build
- [ ] Console limpo

---

## 🗺️ **SEGUNDA HORA - Implementar Mapa**

### Minuto 60-90: Criar MapView Component

**Criar arquivo: `src/components/MapView.tsx`**

```typescript
import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import type { Location } from '../types';

interface MapViewProps {
  pickup?: Location;
  dropoff?: Location;
  driverLocation?: Location;
  onRegionChange?: (region: any) => void;
}

export const Map: React.FC<MapViewProps> = ({
  pickup,
  dropoff,
  driverLocation,
  onRegionChange,
}) => {
  const initialRegion = {
    latitude: pickup?.lat || driverLocation?.lat || -18.9186,
    longitude: pickup?.lng || driverLocation?.lng || -41.5085,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={initialRegion}
      showsUserLocation
      showsMyLocationButton
      onRegionChangeComplete={onRegionChange}
    >
      {pickup && (
        <Marker
          coordinate={{ latitude: pickup.lat, longitude: pickup.lng }}
          title="Pickup"
          pinColor="green"
        />
      )}

      {dropoff && (
        <Marker
          coordinate={{ latitude: dropoff.lat, longitude: dropoff.lng }}
          title="Dropoff"
          pinColor="red"
        />
      )}

      {driverLocation && (
        <Marker
          coordinate={{
            latitude: driverLocation.lat,
            longitude: driverLocation.lng,
          }}
          title="Your Location"
        >
          <View style={styles.driverMarker}>
            <Text style={styles.driverIcon}>🚗</Text>
          </View>
        </Marker>
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  driverMarker: {
    backgroundColor: '#5B51FF',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  driverIcon: {
    fontSize: 20,
  },
});
```

---

### Minuto 90-105: Exportar Componente

**Atualizar `src/components/index.ts`:**
```typescript
export * from './MapView';
// ... outros exports
```

---

### Minuto 105-120: Substituir MapPlaceholder

**Editar `src/screens/driver/HomeScreen.tsx`:**

```typescript
// ANTES
import { MapPlaceholder } from '../../components';

<MapPlaceholder
  pickup={mockLocation}
  dropoff={mockDestination}
/>

// DEPOIS
import { Map } from '../../components';
import { useState, useEffect } from 'react';

export const HomeScreen = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  
  useEffect(() => {
    // TODO: Get real GPS location
    setCurrentLocation({
      lat: -18.9186,
      lng: -41.5085,
      address: 'Current Location',
    });
  }, []);

  return (
    <View style={styles.container}>
      <Map
        driverLocation={currentLocation}
        pickup={incomingRequest?.pickup}
        dropoff={incomingRequest?.dropoff}
      />
      
      {/* ... resto da tela */}
    </View>
  );
};
```

---

## 📍 **TERCEIRA HORA - GPS Real**

### Minuto 120-140: Instalar expo-location

```bash
npx expo install expo-location

# Adicionar permissões

# iOS (ios/iboraMobi/Info.plist)
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to show you nearby ride requests</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>We need your location to track your rides</string>
<key>NSLocationAlwaysUsageDescription</key>
<string>We need your location even when the app is closed</string>

# Android (android/app/src/main/AndroidManifest.xml)
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
```

---

### Minuto 140-165: Criar Hook de Location

**Criar arquivo: `src/hooks/useLocation.ts`**

```typescript
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import type { Location as LocationType } from '../types';

export const useLocation = (enabled: boolean = false) => {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      try {
        // Request permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          setLoading(false);
          return;
        }

        // Get current location once
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setLocation({
          lat: currentLocation.coords.latitude,
          lng: currentLocation.coords.longitude,
          address: '', // Will be filled by reverse geocoding
        });
        setLoading(false);

        // Watch location changes (every 5 seconds)
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000, // 5 seconds
            distanceInterval: 10, // 10 meters
          },
          (newLocation) => {
            setLocation({
              lat: newLocation.coords.latitude,
              lng: newLocation.coords.longitude,
              address: '',
            });
          }
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get location');
        setLoading(false);
      }
    })();

    return () => {
      subscription?.remove();
    };
  }, [enabled]);

  return { location, error, loading };
};
```

---

### Minuto 165-180: Usar Hook no HomeScreen

**Atualizar `src/screens/driver/HomeScreen.tsx`:**

```typescript
import { useLocation } from '../../hooks/useLocation';
import { useDriverStore } from '../../store';

export const HomeScreen = () => {
  const { driver } = useDriverStore();
  const isOnline = driver?.status === 'ONLINE';
  
  // Get real GPS location when online
  const { location, error } = useLocation(isOnline);

  useEffect(() => {
    if (location && isOnline) {
      // Send location to backend
      driverApi.updateLocation(location.lat, location.lng);
    }
  }, [location, isOnline]);

  return (
    <View style={styles.container}>
      <Map
        driverLocation={location || undefined}
        pickup={incomingRequest?.pickup}
        dropoff={incomingRequest?.dropoff}
      />
      
      {error && (
        <Text style={styles.error}>GPS Error: {error}</Text>
      )}
      
      {/* ... resto da tela */}
    </View>
  );
};
```

---

## 🔔 **QUARTA HORA - Push Notifications Básicas**

### Minuto 180-200: Configurar Firebase

```bash
# 1. Ir para: https://console.firebase.google.com/
# 2. Criar projeto: "iBora"
# 3. Adicionar app iOS
# 4. Adicionar app Android
# 5. Baixar:
#    - google-services.json (Android)
#    - GoogleService-Info.plist (iOS)
```

**Colocar arquivos nos lugares corretos:**
```bash
# Android
cp google-services.json android/app/

# iOS
cp GoogleService-Info.plist ios/iboraMobi/
```

---

### Minuto 200-220: Instalar expo-notifications

```bash
npx expo install expo-notifications expo-device expo-constants
```

---

### Minuto 220-240: Criar Serviço de Notificações

**Criar arquivo: `src/services/notifications.ts`**

```typescript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  async requestPermission(): Promise<boolean> {
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    return true;
  },

  async getToken(): Promise<string | null> {
    try {
      const token = await Notifications.getExpoPushTokenAsync();
      console.log('Push token:', token.data);
      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  },

  onNotification(callback: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(callback);
  },

  onNotificationResponse(callback: (response: Notifications.NotificationResponse) => void) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  },

  async sendLocalNotification(title: string, body: string, data?: any) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null, // Send immediately
    });
  },
};
```

---

## ✅ **CHECKLIST - FIM DAS 4 HORAS**

### Você deve ter:
- [x] Google Maps API key configurado
- [x] Mapa real funcionando no app
- [x] GPS tracking em tempo real
- [x] Localização sendo enviada para backend
- [x] Push notifications configurado (básico)
- [x] App rodando sem erros

### Teste Final:
```bash
# 1. Abrir app
# 2. Fazer login
# 3. Toggle online
# 4. Ver seu marcador no mapa
# 5. Andar com o celular
# 6. Ver marcador se movendo
```

**SE TUDO FUNCIONAR: PARABÉNS! 🎉**

---

## 📅 **RESTO DO DIA**

### Tarde (4h adicionais)

#### Hora 5: Melhorar UI do Mapa
```typescript
// Adicionar:
- [ ] Botão de centralizar no usuário
- [ ] Zoom controls
- [ ] Traffic layer
- [ ] Customizar markers
```

#### Hora 6: Background Location (iOS)
```typescript
// Adicionar em Info.plist:
<key>UIBackgroundModes</key>
<array>
  <string>location</string>
  <string>remote-notification</string>
</array>
```

#### Hora 7: Otimizar Bateria
```typescript
// Ajustar accuracy baseado no status:
const accuracy = isOnline 
  ? Location.Accuracy.High 
  : Location.Accuracy.Low;
```

#### Hora 8: Testar e Documentar
- [ ] Testar em iOS
- [ ] Testar em Android
- [ ] Documentar problemas encontrados
- [ ] Commit e push

---

## 🚀 **PRÓXIMOS DIAS**

### Dia 2: Rota e Direções
```bash
# Instalar
npm install react-native-maps-directions

# Adicionar Polyline entre pickup e dropoff
# Calcular ETA
# Mostrar distância
```

### Dia 3: SignupScreen
```bash
# Copiar código do PASSENGER_APP_GUIDE.md
# Ajustar para Driver
# Integrar com API
# Testar fluxo completo
```

### Dia 4: OnboardingScreen
```bash
# Tutorial em 3 slides
# Solicitar permissões
# Explicar como funciona
```

### Dia 5: ProfileScreen
```bash
# Ver/editar perfil
# Upload de foto
# Documentos
# Configurações
```

---

## 🐛 **TROUBLESHOOTING COMUM**

### Mapa não aparece (iOS)
```bash
# Verificar:
1. API key está correto em AppDelegate.mm
2. Pod install foi executado
3. Rebuild o app (limpar cache)

# Solução:
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### Mapa não aparece (Android)
```bash
# Verificar:
1. API key está correto em AndroidManifest.xml
2. SHA-1 fingerprint está correto no console
3. API está habilitada

# Solução:
cd android
./gradlew clean
cd ..
npm run android
```

### GPS não funciona
```bash
# Verificar:
1. Permissões concedidas
2. Location services habilitado no device
3. Usando device físico (não simulador)
4. No iOS: Location sempre permitido

# Solução:
- Deletar app e reinstalar
- Verificar permissões no Settings
```

### Push não chega
```bash
# Verificar:
1. Device físico (não emulador)
2. google-services.json correto
3. Firebase configurado corretamente

# Solução:
- Testar com Expo Go primeiro
- Verificar token no console do Firebase
```

---

## 💡 **DICAS PRO**

### Performance
```typescript
// Usar useMemo para markers
const markers = useMemo(() => {
  return [pickup, dropoff, driver].filter(Boolean);
}, [pickup, dropoff, driver]);
```

### Debugging
```typescript
// Log de location updates
useEffect(() => {
  console.log('Location updated:', location);
}, [location]);
```

### Battery
```typescript
// Reduzir updates quando em background
const [appState, setAppState] = useState(AppState.currentState);

useEffect(() => {
  const subscription = AppState.addEventListener('change', (nextAppState) => {
    if (appState === 'active' && nextAppState.match(/inactive|background/)) {
      // App went to background - reduce GPS frequency
    }
    setAppState(nextAppState);
  });

  return () => subscription.remove();
}, [appState]);
```

---

## 📞 **PRECISA DE AJUDA?**

### Google Maps não funciona?
- Docs: https://github.com/react-native-maps/react-native-maps
- Stack Overflow: https://stackoverflow.com/questions/tagged/react-native-maps

### expo-location problemas?
- Docs: https://docs.expo.dev/versions/latest/sdk/location/
- Forum: https://forums.expo.dev/

### Firebase setup?
- Docs: https://rnfirebase.io/
- Console: https://console.firebase.google.com/

---

## 🎯 **META DO DIA**

**Ao final do dia você deve ter:**

✅ Mapa real funcionando  
✅ GPS tracking em tempo real  
✅ Localização enviada para backend  
✅ Push notifications básico configurado  
✅ App rodando sem crashes  
✅ Commit feito no Git  

**Se conseguiu tudo isso: VOCÊ ESTÁ NO CAMINHO CERTO! 🚀**

**Amanhã: Continue na Week 1 do roadmap!**

---

**IMPORTANTE: Não tente fazer tudo de uma vez!**

**Foque em fazer o mapa funcionar HOJE.**
**Amanhã você faz o resto.**

**Boa sorte! 💪**

---

## 📝 **COMANDOS ÚTEIS**

```bash
# Limpar cache
npm start -- --reset-cache

# Rebuild completo iOS
cd ios && pod deintegrate && pod install && cd ..
npm run ios

# Rebuild completo Android
cd android && ./gradlew clean && cd ..
npm run android

# Ver logs
# iOS
npx react-native log-ios

# Android
npx react-native log-android

# Verificar tipos TypeScript
npx tsc --noEmit

# Run tests
npm test
```

---

**AGORA VAI E FAZ ACONTECER! 🔥**
