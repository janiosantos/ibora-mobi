# 🧪 GUIA COMPLETO DE TESTES - iBora

## 📋 **ESTRUTURA DE TESTES**

```
frontend/
├── __tests__/
│   ├── unit/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   ├── integration/
│   │   ├── flows/
│   │   └── api/
│   └── e2e/
│       ├── driver/
│       └── passenger/
```

---

## ⚙️ **SETUP INICIAL**

### Instalar Dependências

```bash
# Jest + React Native Testing Library
npm install --save-dev @testing-library/react-native @testing-library/jest-native jest

# Detox (E2E)
npm install --save-dev detox detox-cli

# Mock auxiliares
npm install --save-dev @react-native-async-storage/async-storage
```

### Configurar Jest

```javascript
// jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
  ],
};
```

---

## 🧪 **UNIT TESTS**

### 1. Hook Tests

```typescript
// __tests__/unit/hooks/useLocation.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useLocation } from '@/hooks/useLocation';
import * as Location from 'expo-location';

jest.mock('expo-location');

describe('useLocation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should request permissions on mount', async () => {
    const mockRequestPermissions = jest.fn().mockResolvedValue({ status: 'granted' });
    (Location.requestForegroundPermissionsAsync as jest.Mock) = mockRequestPermissions;

    renderHook(() => useLocation({ enabled: true }));

    expect(mockRequestPermissions).toHaveBeenCalled();
  });

  it('should get current position after permission granted', async () => {
    const mockLocation = {
      coords: { latitude: -23.5505, longitude: -46.6333 },
    };

    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue(mockLocation);

    const { result, waitForNextUpdate } = renderHook(() => useLocation({ enabled: true }));

    await waitForNextUpdate();

    expect(result.current.location).toEqual(mockLocation.coords);
  });

  it('should handle permission denied', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'denied',
    });

    const { result, waitForNextUpdate } = renderHook(() => useLocation({ enabled: true }));

    await waitForNextUpdate();

    expect(result.current.error).toBeTruthy();
    expect(result.current.location).toBeNull();
  });
});
```

### 2. Service Tests

```typescript
// __tests__/unit/services/pixService.test.ts
import { pixPaymentService } from '@/services/payment/pixService';
import axios from 'axios';

jest.mock('axios');

describe('PixPaymentService', () => {
  it('should create PIX charge successfully', async () => {
    const mockResponse = {
      data: {
        loc: { id: 123 },
        txid: 'abc123',
      },
    };

    const mockQRCode = {
      data: {
        imagemQrcode: 'base64string',
        qrcode: 'pixcopypastestring',
      },
    };

    (axios.post as jest.Mock).mockResolvedValue(mockResponse);
    (axios.get as jest.Mock).mockResolvedValue(mockQRCode);

    const result = await pixPaymentService.createCharge({
      amount: 3617,
      ride_id: 'ride123',
      passenger_id: 'pass123',
      driver_id: 'driver123',
    });

    expect(result.qrcode).toBe('base64string');
    expect(result.qrcode_text).toBe('pixcopypastestring');
    expect(result.status).toBe('PENDING');
  });

  it('should check payment status', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: { status: 'CONCLUIDA' },
    });

    const status = await pixPaymentService.checkStatus('txid123');

    expect(status).toBe('PAID');
  });
});
```

### 3. Component Tests

```typescript
// __tests__/unit/components/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/Button';

describe('Button', () => {
  it('should render correctly', () => {
    const { getByText } = render(<Button>Click Me</Button>);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should call onPress when clicked', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<Button onPress={mockOnPress}>Click Me</Button>);

    fireEvent.press(getByText('Click Me'));

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when loading', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button onPress={mockOnPress} loading>
        Click Me
      </Button>
    );

    fireEvent.press(getByText('Click Me'));

    expect(mockOnPress).not.toHaveBeenCalled();
  });
});
```

---

## 🔄 **INTEGRATION TESTS**

### 1. Ride Request Flow

```typescript
// __tests__/integration/flows/rideRequest.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useRideRequest } from '@/hooks/useRideRequest';
import { wsService } from '@/api/websocket';

jest.mock('@/api/websocket');

describe('Ride Request Flow', () => {
  it('should complete full passenger request flow', async () => {
    const { result } = renderHook(() => useRideRequest('passenger'));

    // Step 1: Request ride
    await act(async () => {
      await result.current.requestRide({
        pickup: { lat: -23.5505, lng: -46.6333, address: 'Pickup' },
        dropoff: { lat: -23.5605, lng: -46.6433, address: 'Dropoff' },
        offeredPrice: 25.0,
      });
    });

    expect(result.current.status).toBe('REQUESTING');

    // Step 2: Driver accepts
    act(() => {
      wsService.emit('ride:accepted', {
        ride_id: 'ride123',
        driver: { id: 'driver123', name: 'Driver' },
      });
    });

    expect(result.current.status).toBe('DRIVER_ASSIGNED');

    // Step 3: Driver arrives
    act(() => {
      wsService.emit('ride:driver_arrived', { ride_id: 'ride123' });
    });

    expect(result.current.status).toBe('ARRIVED');

    // Step 4: Trip starts
    act(() => {
      wsService.emit('ride:started', { ride_id: 'ride123' });
    });

    expect(result.current.status).toBe('IN_PROGRESS');

    // Step 5: Trip completes
    act(() => {
      wsService.emit('ride:completed', {
        ride_id: 'ride123',
        final_price: 36.17,
      });
    });

    expect(result.current.status).toBe('COMPLETED');
  });
});
```

### 2. Payment Flow

```typescript
// __tests__/integration/flows/payment.test.ts
import { pixPaymentService } from '@/services/payment/pixService';
import { cardPaymentService } from '@/services/payment/cardService';

describe('Payment Flows', () => {
  describe('PIX Payment', () => {
    it('should complete PIX payment successfully', async () => {
      // Create charge
      const charge = await pixPaymentService.createCharge({
        amount: 3617,
        ride_id: 'ride123',
        passenger_id: 'pass123',
        driver_id: 'driver123',
      });

      expect(charge.status).toBe('PENDING');

      // Simulate webhook callback
      const webhookPayload = {
        txid: charge.txid,
        status: 'PAID',
        paid_at: new Date().toISOString(),
      };

      const result = pixPaymentService.processWebhook(webhookPayload);

      expect(result.success).toBe(true);
      expect(result.status).toBe('PAID');
    });
  });

  describe('Card Payment', () => {
    it('should save and use card', async () => {
      // Save card
      const savedCard = await cardPaymentService.saveCard('pm_123', 'pass123');

      expect(savedCard.id).toBeTruthy();
      expect(savedCard.last4).toBeTruthy();

      // Get saved cards
      const cards = await cardPaymentService.getSavedCards('pass123');

      expect(cards).toContainEqual(savedCard);

      // Use saved card for payment
      const intent = await cardPaymentService.createPaymentIntent({
        amount: 3617,
        ride_id: 'ride123',
        passenger_id: 'pass123',
        driver_id: 'driver123',
      });

      expect(intent.client_secret).toBeTruthy();
    });
  });
});
```

---

## 🎭 **E2E TESTS (Detox)**

### Setup Detox

```javascript
// .detoxrc.js
module.exports = {
  testRunner: 'jest',
  runnerConfig: 'e2e/config.json',
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/iBora.app',
      build: 'xcodebuild -workspace ios/iBora.xcworkspace -scheme iBora -configuration Debug -sdk iphonesimulator',
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: { type: 'iPhone 14' },
    },
    emulator: {
      type: 'android.emulator',
      device: { avdName: 'Pixel_4_API_30' },
    },
  },
};
```

### E2E Test Examples

```typescript
// e2e/passenger/requestRide.test.ts
describe('Passenger Request Ride', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should complete ride request flow', async () => {
    // Login
    await element(by.id('email-input')).typeText('passenger@test.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();

    // Wait for home screen
    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(5000);

    // Set pickup
    await element(by.id('pickup-input')).tap();
    await element(by.id('search-input')).typeText('Av Paulista 1000');
    await element(by.id('location-result-0')).tap();

    // Set dropoff
    await element(by.id('dropoff-input')).tap();
    await element(by.id('search-input')).typeText('Rua Augusta 500');
    await element(by.id('location-result-0')).tap();

    // Request ride
    await element(by.id('request-ride-button')).tap();

    // Wait for waiting screen
    await waitFor(element(by.id('waiting-driver-screen')))
      .toBeVisible()
      .withTimeout(3000);

    // Verify elements
    await expect(element(by.text('Procurando motorista...'))).toBeVisible();
    await expect(element(by.id('cancel-button'))).toBeVisible();
  });
});
```

---

## 📊 **COVERAGE**

### Rodar com Coverage

```bash
# Unit + Integration
npm test -- --coverage

# E2E
detox test --configuration ios.debug
```

### Target de Coverage

| Tipo | Target | Status |
|------|--------|--------|
| Statements | 80% | 🎯 |
| Branches | 75% | 🎯 |
| Functions | 80% | 🎯 |
| Lines | 80% | 🎯 |

---

## ✅ **CHECKLIST DE TESTES**

### Unit Tests
- [x] useLocation hook
- [x] useRideRequest hook
- [x] pixService
- [x] cardService
- [x] Button component
- [ ] Map component
- [ ] Avatar component
- [ ] All other components

### Integration Tests
- [x] Ride request flow
- [x] Payment PIX flow
- [x] Payment Card flow
- [ ] Rating flow
- [ ] Chat flow

### E2E Tests
- [x] Passenger request ride
- [ ] Driver accept ride
- [ ] Complete trip
- [ ] Payment PIX
- [ ] Payment Card
- [ ] History export

---

## 🚀 **SCRIPTS**

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "detox test",
    "test:e2e:build": "detox build"
  }
}
```

---

**Coverage atual estimado**: 80%  
**Testes implementados**: ~15  
**Testes restantes**: ~20  
**Tempo estimado**: 3-5 dias
