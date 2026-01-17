# 🚀 GUIA COMPLETO DE DEPLOY - iBora

## 📋 **PRÉ-REQUISITOS**

### Contas Necessárias
- ✅ Apple Developer Account ($99/ano)
- ✅ Google Play Console ($25 one-time)
- ✅ Expo Account (free)
- ✅ Firebase Project (free/paid)
- ✅ Sentry Account (free tier ok)

### Ferramentas
```bash
# Expo CLI
npm install -g expo-cli eas-cli

# Fastlane
gem install fastlane

# Firebase CLI
npm install -g firebase-tools
```

---

## 📱 **BUILD PARA iOS**

### 1. Configurar App Store Connect

```bash
# 1. Criar App no App Store Connect
# - Bundle ID: com.ibora.app
# - Nome: iBora
# - Primary Language: Portuguese (Brazil)

# 2. Criar App Icon (1024x1024)
# - Usar ferramenta: https://appicon.co

# 3. Screenshots necessários:
# - iPhone 6.7" (1290x2796): 3-10 screenshots
# - iPhone 6.5" (1242x2688): 3-10 screenshots
# - iPhone 5.5" (1242x2208): 3-10 screenshots
```

### 2. Configurar EAS Build

```json
// eas.json
{
  "build": {
    "production": {
      "ios": {
        "releaseChannel": "production",
        "distribution": "store",
        "autoIncrement": true
      }
    },
    "preview": {
      "ios": {
        "releaseChannel": "preview",
        "distribution": "internal"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your@email.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABC123XYZ"
      }
    }
  }
}
```

### 3. Build iOS

```bash
# Login Expo
eas login

# Configure project
eas build:configure

# Build para TestFlight (Preview)
eas build --platform ios --profile preview

# Build para App Store (Production)
eas build --platform ios --profile production

# Submit para App Store
eas submit --platform ios --profile production
```

### 4. App Store Metadata

```
Nome: iBora - Mobilidade Urbana
Subtítulo: Transporte rápido e seguro
Categoria: Travel
Classificação: 4+

Descrição:
O iBora é o app de mobilidade urbana que conecta você ao seu destino 
de forma rápida, segura e com o melhor preço.

🚗 Para Passageiros:
• Solicite corridas em segundos
• Preço justo e transparente
• Pagamento via PIX, Cartão ou Dinheiro
• Avalie sua experiência

🚙 Para Motoristas:
• Ganhe dinheiro dirigindo
• Saque via PIX
• Seja seu próprio chefe
• Suporte 24/7

Keywords: transporte, uber, 99, corrida, taxi, mobilidade, viagem

Support URL: https://ibora.com.br/suporte
Privacy URL: https://ibora.com.br/privacidade
```

---

## 🤖 **BUILD PARA ANDROID**

### 1. Configurar Google Play Console

```bash
# 1. Criar app no Google Play Console
# - Package name: com.ibora.app
# - Nome: iBora
# - Idioma padrão: Português (Brasil)

# 2. Criar Feature Graphic (1024x500)
# 3. App Icon (512x512)

# 4. Screenshots necessários:
# - Phone: 2-8 screenshots (16:9 ratio)
# - 7" Tablet: 1-8 screenshots
# - 10" Tablet: 1-8 screenshots
```

### 2. Build Android

```bash
# Build AAB para Google Play
eas build --platform android --profile production

# Submit para Google Play
eas submit --platform android --profile production
```

### 3. Google Play Metadata

```
Nome curto: iBora
Nome completo: iBora - Mobilidade Urbana

Descrição curta:
Transporte urbano rápido, seguro e com o melhor preço.

Descrição completa:
[Mesma descrição do iOS]

Categoria: Mapas e Navegação
Classificação de conteúdo: PEGI 3

Tipo de app: App
Categoria: Gratuito
```

---

## 🔒 **SEGURANÇA**

### 1. Environment Variables

```bash
# .env.production
API_BASE_URL=https://api.ibora.com.br
WEBSOCKET_URL=wss://ws.ibora.com.br

# PIX
EFI_CLIENT_ID=...
EFI_CLIENT_SECRET=...
EFI_PIX_KEY=pix@ibora.com.br

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Firebase
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...

# Sentry
SENTRY_DSN=https://...@sentry.io/...
```

### 2. Code Signing

```bash
# iOS
# - Upload certificates no Apple Developer Portal
# - Configure Provisioning Profiles

# Android
# - Generate keystore
keytool -genkey -v -keystore ibora-release.keystore -alias ibora -keyalg RSA -keysize 2048 -validity 10000

# - Add to eas.json
{
  "build": {
    "production": {
      "android": {
        "credentialsSource": "local"
      }
    }
  }
}
```

---

## 📊 **MONITORING**

### 1. Sentry Setup

```typescript
// App.tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: __DEV__ ? 'development' : 'production',
  tracesSampleRate: 1.0,
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 30000,
});

export default Sentry.wrap(App);
```

### 2. Firebase Analytics

```typescript
// analytics.ts
import analytics from '@react-native-firebase/analytics';

export const logEvent = (name: string, params?: any) => {
  analytics().logEvent(name, params);
};

// Usage
logEvent('ride_requested', {
  pickup: 'Av Paulista',
  dropoff: 'Rua Augusta',
  price: 36.17,
});
```

### 3. Performance Monitoring

```typescript
// performance.ts
import perf from '@react-native-firebase/perf';

export const trackScreen = async (screenName: string) => {
  const trace = await perf().startTrace(screenName);
  return () => trace.stop();
};

// Usage
useEffect(() => {
  const stopTrace = trackScreen('HomeScreen');
  return stopTrace;
}, []);
```

---

## 🔄 **CI/CD**

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build iOS
        run: eas build --platform ios --profile production --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
      
      - name: Submit to App Store
        run: eas submit --platform ios --profile production --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}

  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build Android
        run: eas build --platform android --profile production --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
      
      - name: Submit to Google Play
        run: eas submit --platform android --profile production --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

---

## 📈 **RELEASE STRATEGY**

### Versioning

```json
// app.json
{
  "expo": {
    "version": "1.0.0",
    "ios": {
      "buildNumber": "1"
    },
    "android": {
      "versionCode": 1
    }
  }
}
```

### Release Flow

```
1. Development
   ├─> Feature branches
   └─> Pull Requests

2. Staging (Preview)
   ├─> TestFlight (iOS)
   ├─> Internal Testing (Android)
   └─> QA Testing

3. Production
   ├─> App Store (iOS)
   ├─> Google Play (Android)
   └─> Phased Rollout (10% → 50% → 100%)

4. Hotfix
   ├─> Critical bugs
   └─> Fast track review
```

---

## ✅ **CHECKLIST DE DEPLOY**

### Pré-Deploy
- [ ] Todos os testes passando
- [ ] Coverage > 80%
- [ ] No console errors/warnings
- [ ] Performance otimizada
- [ ] Bundle size < 50MB
- [ ] ENV vars configuradas
- [ ] Code signing configurado

### iOS
- [ ] App icon 1024x1024
- [ ] Screenshots (3 sizes)
- [ ] App Store metadata
- [ ] Privacy policy URL
- [ ] Support URL
- [ ] Build uploaded
- [ ] Submit para review

### Android
- [ ] App icon 512x512
- [ ] Feature graphic 1024x500
- [ ] Screenshots (phone + tablets)
- [ ] Google Play metadata
- [ ] Privacy policy
- [ ] Build uploaded
- [ ] Submit para review

### Post-Deploy
- [ ] Monitoring configurado (Sentry)
- [ ] Analytics configurado (Firebase)
- [ ] Crash reporting ativo
- [ ] Performance tracking
- [ ] User feedback channel

---

## 📊 **CRONOGRAMA**

| Fase | Tempo | Responsável |
|------|-------|-------------|
| **Builds** | 1 dia | DevOps |
| iOS App Store setup | 2h | PM |
| Android Play Store setup | 2h | PM |
| Screenshots & assets | 4h | Design |
| **Metadata & descriptions** | 1 dia | Marketing |
| **Monitoring setup** | 4h | DevOps |
| **CI/CD pipeline** | 1 dia | DevOps |
| **Submission** | 1 dia | PM |
| **Review (iOS)** | 1-3 dias | Apple |
| **Review (Android)** | 1-7 dias | Google |
| **TOTAL** | **5-10 dias** | - |

---

## 💰 **CUSTOS**

| Item | Custo | Recorrência |
|------|-------|-------------|
| Apple Developer | $99 | Anual |
| Google Play Console | $25 | One-time |
| Expo EAS | $0-29 | Mensal |
| Firebase | $0-25 | Mensal |
| Sentry | $0-26 | Mensal |
| **TOTAL** | **$124-205** | **Ano 1** |

---

## 🎯 **KPIs PÓS-LAUNCH**

### Métricas Técnicas
- Crash-free rate > 99.5%
- App start time < 3s
- Network requests < 2s
- Memory usage < 200MB

### Métricas de Negócio
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Retention Day 1/7/30
- Ride completion rate
- Average rating
- Revenue per ride

---

## 🚀 **LAUNCH PLAN**

### Soft Launch (Week 1)
```
1. Internal testing (50 users)
2. Beta testing (500 users)
3. Bug fixes
```

### Limited Launch (Week 2-3)
```
1. Single city (São Paulo)
2. 10% rollout
3. Monitor metrics
4. Iterate quickly
```

### Full Launch (Week 4+)
```
1. 100% rollout São Paulo
2. Expand to other cities
3. Marketing campaign
4. Press release
```

---

**Status**: Pronto para deploy  
**Tempo estimado**: 5-10 dias  
**Próximo passo**: Build iOS + Android

🚀 **Boa sorte com o lançamento!**
