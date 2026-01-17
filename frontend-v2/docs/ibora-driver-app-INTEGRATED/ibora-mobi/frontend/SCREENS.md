# Inventário de Telas - iBora Driver App

## 📱 Telas Implementadas

### 1. Autenticação e Onboarding

#### LoginScreen
- **Rota**: `/Login`
- **Objetivo**: Autenticar motorista existente
- **Componentes principais**:
  - Logo do iBora
  - Input de telefone
  - Input de senha (com toggle show/hide)
  - Botão "Entrar"
  - Link "Esqueci minha senha"
  - Link "Cadastre-se"
- **Estados**:
  - Default: Formulário vazio
  - Loading: Botão mostrando spinner
  - Error: Mensagem de erro abaixo dos inputs
- **Navegação**:
  - Success → MainTabs
  - "Cadastre-se" → VehicleInformation

#### VehicleInformationScreen
- **Rota**: `/VehicleInformation`
- **Objetivo**: Cadastrar informações do veículo do motorista
- **Componentes principais**:
  - Header com back button e "Vehicles Information"
  - Progress bar (50%)
  - Dropdown de tipo de veículo
  - Upload de foto do veículo
  - Input placa
  - Input cor
  - Input capacidade
  - Chips de preferências (bagagem, pneus, pets, etc.)
  - Botão "SUBMIT AND NEXT"
- **Estados**:
  - Default: Formulário vazio
  - Filled: Formulário preenchido com dados
  - Loading: Enviando dados
- **Navegação**:
  - Back → Login
  - Submit → RegistrationSuccess modal

---

### 2. Home e Disponibilidade

#### HomeScreen
- **Rota**: `/Home` (MainTabs)
- **Objetivo**: Toggle online/offline e ver status
- **Componentes principais**:
  - Map placeholder (fullscreen)
  - Header com menu e notificações
  - Bottom sheet com:
    - Avatar do motorista + rating
    - Resumo de ganhos (Hoje/Semana/Disponível)
    - Switch Online/Offline
    - Status indicator (quando online)
- **Estados**:
  - Offline: Switch off, sem indicator
  - Online: Switch on, "Procurando corridas..."
  - Busy: Motorista em corrida (não mostrado nesta tela)
- **Navegação**:
  - Online → (auto) IncomingRideRequest (quando recebe)
  - Tabs → Outras telas

---

### 3. Fluxo de Corrida

#### IncomingRideRequestScreen
- **Rota**: `/IncomingRideRequest` (Modal)
- **Objetivo**: Aceitar ou rejeitar solicitação de corrida
- **Componentes principais**:
  - Map com rota traçada
  - Top bar com botão "Cancel"
  - Bottom sheet com:
    - Avatar + nome + rating do passageiro
    - Endereços pickup/dropoff
    - Preço + distância + R$/km
    - Badge de método de pagamento
    - Botões "Accept For $X" (verde) e "Reject" (vermelho)
    - Timer de auto-reject (30s)
- **Estados**:
  - Default: Mostrando solicitação
  - Countdown: Timer decrescendo
  - Timeout: Auto-reject se não responder
- **Navegação**:
  - Accept → DriveToPickup
  - Reject → Home
  - Timeout → Home

#### DriveToPickupScreen
- **Rota**: `/DriveToPickup`
- **Objetivo**: Motorista navegando até o passageiro
- **Componentes principais**:
  - Map com rota
  - Header card com:
    - Back button
    - "Drive to pickup" + timer
    - Notificação
  - Botão flutuante "Navigate"
  - Bottom sheet com:
    - Avatar + nome do passageiro
    - Endereço de pickup
    - Preço
    - Botões de contato (call/chat)
    - Botão "I'm here"
- **Estados**:
  - Navigating: Timer crescendo
  - Arrived: Próximo do local
- **Navegação**:
  - "I'm here" → StartRide
  - Chat → ChatScreen

#### StartRideScreen
- **Rota**: `/StartRide`
- **Objetivo**: Aguardar passageiro e iniciar corrida
- **Similar a DriveToPickup mas**:
  - Texto muda para "Start the ride"
  - Timer diferente
  - Botão muda para "Start the ride" (verde)
- **Navegação**:
  - "Start the ride" → TripInProgress

#### TripInProgressScreen
- **Rota**: `/TripInProgress`
- **Objetivo**: Corrida em andamento
- **Similar a StartRide mas**:
  - Texto muda para "End the ride"
  - Botão muda para "Finish the ride" (vermelho)
- **Navegação**:
  - "Finish the ride" → TripCompleted

#### TripCompletedScreen
- **Rota**: `/TripCompleted`
- **Objetivo**: Mostrar resumo e processar pagamento
- **Componentes principais**:
  - Timeline (Accepted → Pickup → Dropoff)
  - Avatar do passageiro
  - Badge "RIDE COMPLETED"
  - Título "Select a payment method to pay {name}"
  - Preço total
  - Breakdown de preço (charges, discount, fees, etc.)
  - "AMOUNT TO BE PAID"
  - Seletor de método de pagamento
  - Botão "Next"
- **Estados**:
  - Awaiting payment: Mostrando opções
  - Processing: Processando pagamento
  - Paid: Mostra confirmação
- **Navegação**:
  - "Next" → Rating

---

### 4. Pós-Corrida

#### RatingScreen
- **Rota**: `/Rating` (Modal)
- **Objetivo**: Avaliar passageiro
- **Componentes principais**:
  - Banner "✓ Paid $X"
  - Avatar do passageiro
  - Título "How was your ride with {name}"
  - Componente de estrelas (1-5)
  - Prompt "Great, what did you like most?"
  - Chips de feedback tags
  - Input de comentário
  - Botões "Done" e "Skip"
- **Estados**:
  - No rating: Botão Done disabled
  - Rated: Pode enviar
  - Submitted: Feedback enviado
- **Navegação**:
  - "Done" → Home
  - "Skip" → Home

---

### 5. Ganhos e Histórico

#### EarningsScreen
- **Rota**: `/Earnings` (MainTabs)
- **Objetivo**: Ver ganhos detalhados
- **Componentes principais**:
  - Header "My Earning"
  - Cards de resumo (Earning/Tips/Login Hrs de hoje)
  - Seção "Earning & Rides" com:
    - Selector de período (All/Semana/Mês)
    - Valor total grande
    - Cards de stats (Total Trips, Total Driving Hrs)
  - Seção "Recommended Bookings" com:
    - Lista de corridas recentes
    - Card por corrida com:
      - Ícone do tipo de veículo
      - Trip #
      - Data/hora badge
      - Duração e distância
      - Endereços origem/destino
      - Preço footer
- **Estados**:
  - Loading: Skeleton screens
  - Loaded: Dados completos
  - Empty: Sem corridas
- **Navegação**:
  - "View All" → HistoryScreen (future)
  - Tap corrida → RideDetailScreen (future)

---

### 6. Outras Telas (Tabs)

#### ProfileScreen
- **Rota**: `/Profile` (MainTabs)
- **Objetivo**: Ver e editar perfil
- **Status**: Placeholder (usa EarningsScreen)
- **Future**: Implementar perfil completo

#### RidesScreen
- **Rota**: `/Rides` (MainTabs)
- **Objetivo**: Histórico de corridas
- **Status**: Placeholder (usa EarningsScreen)
- **Future**: Implementar histórico

---

## 📊 Matriz de Estados por Tela

| Tela | Default | Loading | Error | Empty | Success |
|------|---------|---------|-------|-------|---------|
| Login | ✅ | ✅ | ✅ | - | ✅ |
| VehicleInfo | ✅ | ✅ | ✅ | - | ✅ |
| Home | ✅ | - | - | - | - |
| IncomingRequest | ✅ | - | - | - | - |
| DriveToPickup | ✅ | - | - | - | - |
| Rating | ✅ | ✅ | - | - | ✅ |
| Earnings | ✅ | ✅ | ✅ | ✅ | - |

---

## 🎨 Componentes UI por Tela

| Tela | Button | Input | Card | Avatar | Map | Rating | Chip | BottomSheet |
|------|--------|-------|------|--------|-----|--------|------|-------------|
| Login | ✅ | ✅ | - | - | - | - | - | - |
| VehicleInfo | ✅ | ✅ | - | - | - | - | ✅ | - |
| Home | - | - | ✅ | ✅ | ✅ | - | - | - |
| IncomingRequest | ✅ | - | - | ✅ | ✅ | - | - | ✅ |
| DriveToPickup | ✅ | - | - | ✅ | ✅ | - | - | ✅ |
| Rating | ✅ | ✅ | - | ✅ | - | ✅ | ✅ | - |
| Earnings | - | - | ✅ | - | - | - | - | - |

---

## 🔄 Fluxo de Navegação Completo

```
Login
  ├─ Sucesso → MainTabs
  │              ├─ Home (Tab)
  │              │   └─ Online → IncomingRideRequest (Modal)
  │              │                ├─ Accept → DriveToPickup
  │              │                │             └─ Arrived → StartRide
  │              │                │                           └─ Start → TripInProgress
  │              │                │                                        └─ Finish → TripCompleted
  │              │                │                                                      └─ Payment → Rating (Modal)
  │              │                │                                                                     └─ Done → Home
  │              │                └─ Reject → Home
  │              ├─ Rides (Tab)
  │              ├─ Earnings (Tab)
  │              └─ Profile (Tab)
  └─ Cadastro → VehicleInformation
                  └─ Success → Login
```

---

## 📝 Notas de Implementação

### Telas Prioritárias (MVP)
1. ✅ Login
2. ✅ Home
3. ✅ IncomingRideRequest
4. ✅ DriveToPickup
5. ✅ TripCompleted
6. ✅ Rating
7. ✅ Earnings

### Telas para Fase 2
- [ ] Chat
- [ ] Notifications
- [ ] Profile (completo)
- [ ] Wallet
- [ ] Incentives
- [ ] Support
- [ ] Settings
- [ ] History (detalhado)

### Melhorias Futuras
- [ ] Skeleton screens para loading
- [ ] Animações de transição
- [ ] Gestures (swipe para voltar)
- [ ] Modo offline com sync
- [ ] Cache de dados
- [ ] Deep linking
- [ ] Share trip (segurança)
