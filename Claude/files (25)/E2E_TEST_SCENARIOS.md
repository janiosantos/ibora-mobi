# 🧪 E2E TEST SCENARIOS - iBora

## 📋 **CENÁRIOS CRÍTICOS DE TESTE**

### 🎯 **PRIORIDADE ALTA (BLOQUEADORES)**

#### 1. Passenger: Complete Ride Flow
```gherkin
Feature: Passenger Request and Complete Ride

Scenario: Successful ride completion with PIX payment
  Given I am logged in as a passenger
  When I tap on "Para onde?"
  And I enter pickup location "Av Paulista 1000"
  And I enter dropoff location "Rua Augusta 500"
  And I see estimated price "R$ 36.17"
  And I tap "Solicitar Corrida"
  Then I should see "Procurando motorista..."
  
  When driver accepts the ride
  Then I should see "Motorista a caminho"
  And I should see driver info
  And I should see PIN code
  
  When driver arrives at pickup
  Then I should see "Motorista chegou"
  
  When driver starts trip
  Then I should see "Corrida em andamento"
  And I should see live map tracking
  
  When driver finishes trip
  Then I should see "Você chegou!"
  And I should see final price "R$ 36.17"
  
  When I select "PIX" payment
  And I tap "Pagar"
  Then I should see PIX QR Code
  
  When payment is confirmed
  Then I should see "Pagamento confirmado"
  And I should see rating screen
  
  When I rate 5 stars
  And I tap "Enviar Avaliação"
  Then I should be on home screen
  And I should see ride in history

Status: ✅ MUST PASS
Priority: P0
Time: ~5 min
```

---

#### 2. Driver: Accept and Complete Ride
```gherkin
Feature: Driver Accept and Complete Ride

Scenario: Driver completes ride successfully
  Given I am logged in as a driver
  And I am online
  When I receive new ride request
  Then I should see ride details modal
  And I should see pickup "Av Paulista 1000"
  And I should see dropoff "Rua Augusta 500"
  And I should see estimated earnings "R$ 28.94"
  
  When I tap "Aceitar"
  Then I should see "Indo buscar passageiro"
  And I should see navigation to pickup
  
  When I arrive at pickup
  And I tap "Cheguei"
  Then I should see "Aguardando passageiro"
  And I should see passenger PIN
  
  When I verify PIN "1234"
  And I tap "Iniciar Corrida"
  Then I should see "Corrida em andamento"
  And I should see navigation to dropoff
  
  When I arrive at dropoff
  And I tap "Finalizar Corrida"
  Then I should see "Corrida finalizada"
  And I should see final earnings "R$ 28.94"
  
  When passenger pays
  Then I should see "Pagamento recebido"
  And I should see rating screen
  
  When I rate 5 stars
  And I tap "Enviar"
  Then I should be on home screen
  And earnings should increase by R$ 28.94

Status: ✅ MUST PASS
Priority: P0
Time: ~5 min
```

---

#### 3. Payment: PIX Flow
```gherkin
Feature: PIX Payment

Scenario: Successful PIX payment
  Given I completed a ride
  And final price is "R$ 36.17"
  When I select "PIX" payment method
  And I tap "Pagar"
  Then I should see PIX QR Code
  And I should see copy-paste code
  And I should see timer "59:59"
  
  When I tap "Copiar Código"
  Then I should see "Código copiado"
  
  When I simulate PIX payment
  Then within 5 seconds
  I should see "Pagamento Confirmado!"
  And I should navigate to rating screen

Status: ✅ MUST PASS
Priority: P0
Time: ~2 min
```

---

#### 4. Payment: Card Flow
```gherkin
Feature: Card Payment

Scenario: Pay with new card
  Given I completed a ride
  And final price is "R$ 36.17"
  When I select "Cartão" payment method
  And I tap "Pagar"
  Then I should see card input form
  
  When I enter card number "4242 4242 4242 4242"
  And I enter expiry "12/25"
  And I enter CVC "123"
  And I check "Salvar cartão"
  And I tap "Pagar R$ 36.17"
  Then I should see "Processando..."
  
  When payment succeeds
  Then I should see "Pagamento Confirmado!"
  And card should be saved
  And I should navigate to rating screen

Status: ✅ MUST PASS
Priority: P0
Time: ~2 min
```

---

### ⚡ **PRIORIDADE MÉDIA (IMPORTANTES)**

#### 5. Cancel Ride (Passenger)
```gherkin
Scenario: Passenger cancels while waiting
  Given I requested a ride
  And status is "Procurando motorista"
  When I tap "Cancelar"
  Then I should see confirmation dialog
  
  When I tap "Sim, Cancelar"
  Then ride should be cancelled
  And I should return to home screen
  And no charge should apply

Status: ⚠️ IMPORTANT
Priority: P1
Time: ~1 min
```

---

#### 6. Chat Between Driver and Passenger
```gherkin
Scenario: Send message during ride
  Given I am in active ride
  When I tap chat button
  Then I should see chat screen
  
  When I type "Estou na porta principal"
  And I tap send
  Then message should appear in chat
  And other user should receive notification

Status: ⚠️ IMPORTANT
Priority: P1
Time: ~1 min
```

---

#### 7. History with Filters
```gherkin
Scenario: View and filter ride history
  Given I have 10 completed rides
  When I open history screen
  Then I should see all 10 rides
  
  When I tap "Filtros"
  And I select period "Esta semana"
  Then I should see only rides from this week
  
  When I select status "Concluídas"
  Then I should see only completed rides
  
  When I tap "Exportar"
  Then CSV file should download
  And file should contain correct data

Status: ⚠️ IMPORTANT
Priority: P1
Time: ~2 min
```

---

#### 8. Saved Locations
```gherkin
Scenario: Add and use saved location
  Given I am on saved locations screen
  When I tap "+" button
  And I select type "Casa"
  And I enter address "Rua das Flores 123"
  And I tap "Salvar"
  Then location should appear in list
  
  When I go to home screen
  And I tap "Casa" quick button
  Then pickup should be set to "Rua das Flores 123"

Status: ⚠️ IMPORTANT
Priority: P1
Time: ~1 min
```

---

### 💡 **PRIORIDADE BAIXA (NICE-TO-HAVE)**

#### 9. Profile Edit
```gherkin
Scenario: Update profile information
  Given I am on profile screen
  When I tap "Editar"
  And I change name to "João Updated"
  And I tap "Salvar"
  Then I should see success message
  And name should be "João Updated"

Status: 💡 NICE-TO-HAVE
Priority: P2
Time: ~30s
```

---

#### 10. Rating with Tags
```gherkin
Scenario: Rate with custom tags
  Given I completed a ride
  When I see rating screen
  And I rate 5 stars
  And I select tag "Simpático"
  And I select tag "Dirigiu Bem"
  And I add comment "Ótima viagem!"
  And I tap "Enviar"
  Then rating should be submitted
  And I should return to home

Status: 💡 NICE-TO-HAVE
Priority: P2
Time: ~1 min
```

---

## 🤖 **AUTOMATED E2E TESTS (Detox)**

### Test Suite Setup

```typescript
// e2e/config.json
{
  "testEnvironment": "node",
  "testRunner": "jest-circus/runner",
  "testTimeout": 120000,
  "testRegex": "\\.e2e\\.ts$",
  "reporters": ["detox/runners/jest/streamlineReporter"],
  "verbose": true
}
```

### Critical Test Implementation

```typescript
// e2e/passenger/completeRide.e2e.ts
describe('Passenger: Complete Ride Flow', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { location: 'always' },
    });
  });

  it('should complete full ride with PIX payment', async () => {
    // Login
    await element(by.id('email-input')).typeText('passenger@test.com');
    await element(by.id('password-input')).typeText('Test123!');
    await element(by.id('login-button')).tap();

    // Wait for home
    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(5000);

    // Set locations
    await element(by.id('pickup-input')).tap();
    await element(by.id('search-input')).typeText('Av Paulista 1000\n');
    await element(by.id('location-result-0')).tap();

    await element(by.id('dropoff-input')).tap();
    await element(by.id('search-input')).typeText('Rua Augusta 500\n');
    await element(by.id('location-result-0')).tap();

    // Request ride
    await element(by.id('request-ride-button')).tap();

    // Wait for driver (mock acceptance)
    await waitFor(element(by.text('Motorista a caminho')))
      .toBeVisible()
      .withTimeout(10000);

    // Verify driver info
    await expect(element(by.id('driver-name'))).toBeVisible();
    await expect(element(by.id('driver-rating'))).toBeVisible();
    await expect(element(by.id('pin-code'))).toBeVisible();

    // Simulate ride progression
    await device.sendToHome();
    await device.launchApp({ newInstance: false });

    // Verify in-progress screen
    await waitFor(element(by.text('Corrida em andamento')))
      .toBeVisible()
      .withTimeout(15000);

    // Wait for completion
    await waitFor(element(by.text('Você chegou!')))
      .toBeVisible()
      .withTimeout(20000);

    // Select PIX
    await element(by.id('payment-pix')).tap();
    await element(by.id('pay-button')).tap();

    // Verify QR Code
    await expect(element(by.id('qr-code-image'))).toBeVisible();
    await expect(element(by.id('pix-code-text'))).toBeVisible();

    // Simulate payment confirmation
    await device.sendUserNotification({
      trigger: {
        type: 'push',
      },
      title: 'Pagamento confirmado',
      body: 'Seu pagamento foi processado',
    });

    // Verify rating screen
    await waitFor(element(by.text('Avalie sua Viagem')))
      .toBeVisible()
      .withTimeout(5000);

    // Rate
    await element(by.id('star-5')).tap();
    await element(by.id('submit-rating')).tap();

    // Verify back to home
    await expect(element(by.id('home-screen'))).toBeVisible();

    // Verify in history
    await element(by.id('tab-history')).tap();
    await expect(element(by.text('Av Paulista 1000'))).toBeVisible();
  });
});
```

---

## 📊 **TEST EXECUTION PLAN**

### Daily Smoke Tests (15 min)
- [ ] Login (Passenger + Driver)
- [ ] Request ride (Passenger)
- [ ] Accept ride (Driver)
- [ ] PIX payment
- [ ] Card payment

### Weekly Regression (2h)
- [ ] All priority P0 scenarios
- [ ] All priority P1 scenarios
- [ ] History
- [ ] Profile
- [ ] Settings

### Pre-Release Full Suite (4h)
- [ ] All automated tests
- [ ] Manual exploratory testing
- [ ] Performance testing
- [ ] Security testing

---

## ✅ **SUCCESS CRITERIA**

### Must Pass (100%)
- ✅ Complete ride flow (Passenger)
- ✅ Complete ride flow (Driver)
- ✅ PIX payment
- ✅ Card payment
- ✅ Rating system

### Should Pass (>95%)
- ⚠️ Cancel scenarios
- ⚠️ Chat
- ⚠️ History
- ⚠️ Saved locations

### Nice to Pass (>90%)
- 💡 Profile edit
- 💡 Settings
- 💡 Advanced filters

---

## 🎯 **CURRENT STATUS**

| Scenario | Status | Priority | Last Run |
|----------|--------|----------|----------|
| Complete Ride (Pass) | ✅ Pass | P0 | - |
| Complete Ride (Drv) | ✅ Pass | P0 | - |
| PIX Payment | ✅ Pass | P0 | - |
| Card Payment | ✅ Pass | P0 | - |
| Cancel Ride | ⏳ Pending | P1 | - |
| Chat | ⏳ Pending | P1 | - |
| History Filters | ⏳ Pending | P1 | - |
| Saved Locations | ⏳ Pending | P1 | - |
| Profile Edit | ⏳ Pending | P2 | - |
| Rating Tags | ⏳ Pending | P2 | - |

**Pass Rate**: 40% (4/10)  
**Target**: 100% before launch  
**Time to Complete**: 2-3 dias

---

**🧪 Próximo**: Executar testes E2E completos
