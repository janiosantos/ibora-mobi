# ✅ TODO LIST - Checklist Completo para Produção

## 🚗 **DRIVER APP - TODO (15-20 dias)**

### 🔴 CRÍTICO - Bloqueia produção (8.5 dias)

#### Telas (2 dias)
- [ ] **SignupScreen** (4h)
  - Formulário: nome, email, telefone, senha
  - Validação de dados
  - Integração com API `/auth/signup`
  - CPF/CNPJ para pessoa física/jurídica

- [ ] **OnboardingScreen** (4h)
  - 3-4 slides de tutorial
  - Permissões (GPS + Notificações)
  - Skip button

#### Funcionalidades Core (6.5 dias)
- [ ] **Mapa Real** (3 dias)
  - Instalar: `npm install react-native-maps`
  - Configurar Google Maps API keys
  - Substituir MapPlaceholder por MapView
  - Adicionar markers customizados
  - Polyline para rota

- [ ] **GPS Tracking Real** (2 dias)
  - Instalar: `npx expo install expo-location`
  - Solicitar permissões
  - Foreground tracking (app aberto)
  - Background tracking (app fechado)
  - Enviar localização a cada 5s

- [ ] **Push Notifications** (2 dias)
  - Configurar Firebase Cloud Messaging
  - Instalar: `npx expo install expo-notifications`
  - Handler de notificações
  - Deep linking (notificação → tela correta)
  - Testar notificação de nova corrida

- [ ] **Secure Token Storage** (0.5 dia)
  - Instalar: `npx expo install expo-secure-store`
  - Migrar tokens do AsyncStorage
  - Salvar JWT no Keychain/Keystore
  - Atualizar authStore

---

### 🟡 IMPORTANTE - Impacta UX (4 dias)

#### Telas (2 dias)
- [ ] **ProfileScreen** (4h)
  - Ver/editar perfil
  - Upload de foto
  - Documentos (CNH)
  - Configurações

- [ ] **TripDetailsScreen** (3h)
  - Detalhes da corrida
  - Mapa da rota
  - Origem → Destino
  - Info do passageiro
  - Breakdown de preço

- [ ] **HistoryScreen** (3h)
  - Histórico de corridas
  - Filtros (data, status)
  - Busca
  - Paginação

- [ ] **WithdrawScreen** (2h)
  - Solicitar saque PIX
  - Validar mínimo R$ 50
  - Mostrar status
  - Histórico de saques

#### Funcionalidades (2 dias)
- [ ] **Chat com Passageiro** (1 dia)
  - WebSocket para mensagens
  - Input de texto
  - Histórico
  - Indicador de digitação

- [ ] **Tratamento Offline** (0.5 dia)
  - Instalar: `npm install @react-native-community/netinfo`
  - Retry automático
  - Queue de requisições
  - Feedback visual

- [ ] **Error Tracking** (0.5 dia)
  - Configurar Sentry
  - Crash reporting
  - Performance monitoring

---

### 🟢 NICE-TO-HAVE - Não bloqueia (3 dias)

- [ ] **Animações** (1 dia)
  - `npm install react-native-reanimated`
  - Transições suaves
  - Loading skeletons

- [ ] **Analytics** (0.5 dia)
  - Firebase Analytics
  - Tracking de eventos

- [ ] **Acessibilidade** (1 dia)
  - Screen readers
  - Font scaling
  - High contrast

---

## 👤 **PASSENGER APP - TODO (25-30 dias)**

### 🔴 CRÍTICO - Bloqueia produção (16 dias)

#### Telas Essenciais (3 dias)
- [ ] **SignupScreen** (2h) - Código fornecido ✅
- [ ] **OTPVerificationScreen** (2h) - Código fornecido ✅
- [ ] **LocationPermissionScreen** (1h) - Código fornecido ✅
- [ ] **SelectDestinationScreen** (4h) - Código parcial fornecido
- [ ] **SelectOnMapScreen** (3h) - Código fornecido ✅
- [ ] **WaitingDriverScreen** (2h) - Código fornecido ✅
- [ ] **DriverOnWayScreen** (4h) - Código fornecido ✅
- [ ] **TripInProgressScreen** (4h) - Código parcial fornecido
- [ ] **TripCompletedScreen** (3h) - Código fornecido ✅
- [ ] **RatingDriverScreen** (2h) - Código fornecido ✅

#### Funcionalidades Core (13 dias)
- [ ] **Mapa Real** (0 dia - já implementado no Driver) ✅

- [ ] **Google Places Autocomplete** (2 dias)
  - Instalar: `npm install @react-native-google-places/google-places`
  - Configurar Places API key
  - Buscar endereços
  - Histórico de endereços
  - Endereços salvos (Home, Work)

- [ ] **Cálculo de Rota e Preço** (1 dia)
  - Integrar com backend `/rides/estimate`
  - Mostrar estimativa antes de solicitar
  - Diferentes tipos de veículo
  - Atualizar preço dinamicamente

- [ ] **Pagamento Real** (5 dias) ⚠️ COMPLEXO
  - **PIX** (2 dias)
    - Configurar Efí Pay
    - Gerar QR Code
    - Webhook de confirmação
  - **Cartão** (2 dias)
    - Configurar Stripe/Adyen
    - Tokenização
    - Validação CVV
    - 3D Secure
  - **Carteira Digital** (1 dia)
    - Recarga
    - Débito automático
    - Histórico

- [ ] **Push Notifications** (0 dia - já implementado no Driver) ✅

- [ ] **WebSocket Updates** (1 dia)
  - Localização do motorista
  - Status da corrida
  - Mensagens do chat
  - Usar base do Driver

- [ ] **Sistema de Cupons** (1 dia)
  - Validar no backend
  - Aplicar desconto
  - Histórico de cupons

- [ ] **Múltiplas Paradas** (2 dias)
  - Adicionar até 3 paradas
  - Recalcular preço
  - Rota otimizada

- [ ] **React Navigation** (1 dia)
  - Stack Navigator
  - Tab Navigator
  - Deep linking
  - State persistence

---

### 🟡 IMPORTANTE - Impacta UX (4 dias)

#### Telas (2 dias)
- [ ] **ProfileScreen** (4h)
- [ ] **HistoryScreen** (3h)
- [ ] **NotificationPermissionScreen** (1h) - Código fornecido ✅
- [ ] **ForgotPasswordScreen** (1h) - Código fornecido ✅
- [ ] **ChatScreen** (4h)
- [ ] **TripDetailsScreen** (3h)

#### Funcionalidades (2 dias)
- [ ] **Tratamento Offline** (0.5 dia)
- [ ] **Error Tracking** (0.5 dia)
- [ ] **Agendamento** (1 dia)

---

## 🔐 **SEGURANÇA - AMBOS OS APPS (2 dias)**

- [ ] **Secure Storage** (já feito no Driver)
- [ ] **Certificate Pinning** (1 dia)
- [ ] **Code Obfuscation** (0.5 dia)
- [ ] **LGPD Compliance** (0.5 dia)
  - Termos de uso
  - Política de privacidade
  - Consentimento

---

## 🧪 **TESTES (5 dias)**

### Unit Tests (2 dias)
- [ ] Stores (authStore, rideStore, walletStore)
- [ ] Utils
- [ ] API clients
- [ ] Hooks

### Integration Tests (1 dia)
- [ ] Fluxo de login
- [ ] Fluxo de corrida
- [ ] Fluxo de pagamento

### E2E Tests (1 dia)
- [ ] Instalar Detox ou Maestro
- [ ] Fluxo completo de corrida

### QA Manual (1 dia)
- [ ] iOS (15, 16, 17)
- [ ] Android (10, 11, 12, 13, 14)
- [ ] Devices antigos
- [ ] Diferentes resoluções

---

## 🚀 **DEPLOY (3 dias)**

### iOS (1 dia)
- [ ] Build de produção
- [ ] Ícones (1024x1024)
- [ ] Splash screens
- [ ] 5+ screenshots
- [ ] App Store Connect
- [ ] Submeter para review

### Android (1 dia)
- [ ] Build AAB
- [ ] Feature graphic
- [ ] Screenshots
- [ ] Play Console
- [ ] Submeter para review

### Monitoramento (1 dia)
- [ ] Firebase configurado
- [ ] Sentry configurado
- [ ] Dashboard
- [ ] Alertas

---

## 📦 **DEPENDÊNCIAS A INSTALAR**

### Mapas
```bash
npm install react-native-maps
npm install @react-native-google-maps/google-maps
npm install react-native-maps-directions
```

### GPS
```bash
npx expo install expo-location
```

### Notificações
```bash
npx expo install expo-notifications expo-device expo-constants
npm install @react-native-firebase/messaging
```

### Pagamentos
```bash
npm install @stripe/stripe-react-native
# Configurar Efí Pay SDK
```

### Storage Seguro
```bash
npx expo install expo-secure-store
```

### Places
```bash
npm install @react-native-google-places/google-places
```

### Network
```bash
npm install @react-native-community/netinfo
```

### Error Tracking
```bash
npm install @sentry/react-native
```

### Analytics
```bash
npm install @react-native-firebase/analytics
```

### Animações
```bash
npm install react-native-reanimated
npm install react-native-gesture-handler
```

### Testes
```bash
npm install --save-dev jest @testing-library/react-native
npm install --save-dev detox
```

---

## 📊 **RESUMO EXECUTIVO**

| Categoria | Driver | Passenger | Total |
|-----------|--------|-----------|-------|
| **Crítico** | 8.5 dias | 16 dias | 24.5 dias |
| **Importante** | 4 dias | 4 dias | 8 dias |
| **Nice-to-have** | 3 dias | 0 dias | 3 dias |
| **Segurança** | 0 dias* | 2 dias | 2 dias |
| **Testes** | - | - | 5 dias |
| **Deploy** | - | - | 3 dias |
| **TOTAL** | **15.5 dias** | **22 dias** | **45.5 dias** |

*Segurança já inclusa no Driver

### Com 1 desenvolvedor: **~8 semanas**
### Com 2 desenvolvedores: **~4 semanas**

---

## 🎯 **ORDEM DE EXECUÇÃO SUGERIDA**

### Week 1: Driver Core
1. Mapa real (3 dias)
2. GPS tracking (2 dias)

### Week 2: Driver Completo
1. Push notifications (2 dias)
2. Secure storage (0.5 dia)
3. Signup/Onboarding (0.5 dia)
4. Profile/History/Withdraw (2 dias)

### Week 3: Passenger Auth + Core
1. Signup/OTP/Permissions (0.5 dia)
2. Places Autocomplete (2 dias)
3. Select destination/map (0.5 dia)

### Week 4: Passenger Ride Flow
1. Waiting/DriverOnWay (0.5 dia)
2. Trip screens (0.5 dia)
3. Rating (0.5 dia)
4. Navigation (1 dia)

### Week 5: Pagamentos
1. PIX (2 dias)
2. Cartão (2 dias)
3. Wallet (1 dia)

### Week 6: Features Finais
1. Chat (1 dia)
2. Cupons (1 dia)
3. Múltiplas paradas (2 dias)
4. Profile/History (1 dia)

### Week 7: Testes
1. Unit tests (2 dias)
2. Integration tests (1 dia)
3. E2E tests (1 dia)
4. QA manual (1 dia)

### Week 8: Deploy
1. iOS build + submit (1 dia)
2. Android build + submit (1 dia)
3. Monitoramento (1 dia)

---

## ✅ **USE ESTE CHECKLIST**

Imprima este documento e vá marcando conforme completa.

**Cada item marcado = 1% mais perto da produção!**

**Total de itens**: ~80  
**Cada item**: ~1.25% de progresso  

**Boa sorte! 🚀**
