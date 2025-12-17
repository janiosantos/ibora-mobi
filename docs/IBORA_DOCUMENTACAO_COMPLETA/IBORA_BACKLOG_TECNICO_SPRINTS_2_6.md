# 🎫 IBORA: BACKLOG TÉCNICO GRANULAR - SPRINTS 2-6
## MVP CORE - Tarefas Executáveis (Formato Jira)

---

**Documento complementar ao Sprint 1**  
Este documento cobre os **Sprints 2, 3, 4, 5 e 6** com o mesmo nível de detalhe técnico.

---

# SPRINT 2: GEOLOCATION & MATCHING CORE
**Duração:** Semanas 3-4  
**Objetivo:** Sistema de localização e matching funcionando  
**Velocity target:** 40 SP

## EPIC 2.1: GEOLOCALIZAÇÃO (13 SP)

### [BACKEND] Setup PostGIS Extension
**Responsável:** Backend Dev 1 | **Estimativa:** 2 SP | **Prioridade:** P0

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE INDEX idx_drivers_location ON drivers USING GIST (location);
```

### [BACKEND] Driver Online/Offline Status  
**Responsável:** Backend Dev 1 | **Estimativa:** 5 SP | **Prioridade:** P0

Adiciona status online + atualização de localização em tempo real.

### [BACKEND] Query Drivers Nearby
**Responsável:** Backend Dev 2 | **Estimativa:** 6 SP | **Prioridade:** P0

Busca motoristas num raio de 5km usando PostGIS + cache Redis.

---

## EPIC 2.2: RIDE MATCHING (13 SP)

### [BACKEND] Ride Model & State Machine
**Responsável:** Backend Dev 1 | **Estimativa:** 5 SP | **Prioridade:** P0

Model de corrida com máquina de estados completa.

### [BACKEND] Google Maps Integration  
**Responsável:** Backend Dev 2 | **Estimativa:** 3 SP | **Prioridade:** P0

Calcular rotas, distâncias e geocoding.

### [BACKEND] Pricing Engine v1
**Responsável:** Backend Dev 2 | **Estimativa:** 5 SP | **Prioridade:** P0

Motor de precificação: base + km + minuto + surge.

---

## EPIC 2.3: REQUEST RIDE (14 SP)

### [BACKEND] Endpoint: POST /rides (Request Ride)
**Responsável:** Backend Dev 1 | **Estimativa:** 8 SP | **Prioridade:** P0

Passageiro solicita corrida + notifica motoristas próximos.

### [BACKEND] Driver Accept Ride (Race Condition Safe)
**Responsável:** Backend Dev 1 | **Estimativa:** 6 SP | **Prioridade:** P0

Aceite com SELECT FOR UPDATE para evitar race condition.

---

# SPRINT 3: RIDE LIFECYCLE
**Duração:** Semanas 5-6  
**Objetivo:** Fluxo completo da corrida  
**Velocity target:** 40 SP

## EPIC 3.1: RIDE PROGRESSION (18 SP)

### [BACKEND] Endpoint: POST /rides/{id}/start-trip
**Responsável:** Backend Dev 1 | **Estimativa:** 5 SP | **Prioridade:** P0

Motorista inicia viagem após pegar passageiro.

### [BACKEND] GPS Tracking Worker  
**Responsável:** Backend Dev 2 | **Estimativa:** 5 SP | **Prioridade:** P0

Worker que salva pontos GPS a cada 30 segundos.

### [BACKEND] Endpoint: POST /rides/{id}/complete
**Responsável:** Backend Dev 1 | **Estimativa:** 8 SP | **Prioridade:** P0

Finaliza corrida e calcula valor real baseado em GPS.

---

## EPIC 3.2: CANCELLATION (10 SP)

### [BACKEND] Endpoint: POST /rides/{id}/cancel
**Responsável:** Backend Dev 2 | **Estimativa:** 8 SP | **Prioridade:** P0

Cancelamento com regras (taxa R$ 5 após 5min).

### [BACKEND] Cancellation Metrics Service
**Responsável:** Backend Dev 2 | **Estimativa:** 2 SP | **Prioridade:** P1

Calcula taxa de cancelamento do motorista.

---

## EPIC 3.3: RATING SYSTEM (12 SP)

### [BACKEND] Rating Model
**Responsável:** Backend Dev 1 | **Estimativa:** 3 SP | **Prioridade:** P0

Model de avaliações mútuas.

### [BACKEND] Endpoint: POST /rides/{id}/rate
**Responsável:** Backend Dev 1 | **Estimativa:** 5 SP | **Prioridade:** P0

Avaliar motorista/passageiro após corrida.

### [BACKEND] Endpoint: GET /drivers/{id}/ratings
**Responsável:** Backend Dev 2 | **Estimativa:** 4 SP | **Prioridade:** P1

Ver histórico de avaliações.

---

# SPRINT 4: PAYMENT INTEGRATION (PIX)
**Duração:** Semanas 7-8  
**Objetivo:** Pagamento via Pix funcionando  
**Velocity target:** 40 SP

## EPIC 4.1: EFÍ BANK INTEGRATION (13 SP)

### [BACKEND] Efí Bank SDK Setup
**Responsável:** Backend Dev 2 | **Estimativa:** 3 SP | **Prioridade:** P0

Setup conta sandbox + SDK Python.

### [BACKEND] Create Pix Charge
**Responsável:** Backend Dev 2 | **Estimativa:** 5 SP | **Prioridade:** P0

Endpoint para gerar QR code Pix.

### [BACKEND] Webhook Handler (Idempotent)
**Responsável:** Backend Dev 2 | **Estimativa:** 5 SP | **Prioridade:** P0

Receber confirmação de pagamento com idempotência.

---

## EPIC 4.2: PAYMENT FLOW (13 SP)

### [BACKEND] Endpoint: POST /rides/{id}/pay-with-pix
**Responsável:** Backend Dev 1 | **Estimativa:** 5 SP | **Prioridade:** P0

Gerar cobrança Pix após corrida.

### [BACKEND] Payment Status Polling
**Responsável:** Backend Dev 1 | **Estimativa:** 3 SP | **Prioridade:** P0

Verificar status do pagamento (timeout 5min).

### [FRONTEND] Tela de Pagamento Pix
**Responsável:** Frontend Dev | **Estimativa:** 5 SP | **Prioridade:** P0

Exibir QR code + código copia-e-cola.

---

## EPIC 4.3: LEDGER FINANCEIRO (14 SP)

### [BACKEND] Financial Events Model
**Responsável:** Backend Dev 1 | **Estimativa:** 5 SP | **Prioridade:** P0

Tabela append-only para eventos financeiros.

### [BACKEND] Ledger Service
**Responsável:** Backend Dev 1 | **Estimativa:** 5 SP | **Prioridade:** P0

Criar eventos: RIDE_COMPLETED, PLATFORM_FEE, DRIVER_EARNING.

### [BACKEND] Ledger Reconciliation Job
**Responsável:** Backend Dev 1 | **Estimativa:** 4 SP | **Prioridade:** P1

Job diário para validar integridade do ledger.

---

# SPRINT 5: DRIVER WALLET & PAYOUT
**Duração:** Semanas 9-10  
**Objetivo:** Carteira motorista + repasse D+2  
**Velocity target:** 40 SP

## EPIC 5.1: DRIVER WALLET (13 SP)

### [BACKEND] Driver Wallet Model
**Responsável:** Backend Dev 1 | **Estimativa:** 3 SP | **Prioridade:** P0

Tabela com: available_balance, pending_balance, total_earnings.

### [BACKEND] Wallet Service  
**Responsável:** Backend Dev 1 | **Estimativa:** 5 SP | **Prioridade:** P0

Operações: add_earnings, move_to_available, deduct.

### [FRONTEND] Tela "Minha Carteira"
**Responsável:** Frontend Dev | **Estimativa:** 5 SP | **Prioridade:** P0

Dashboard com saldos e histórico.

---

## EPIC 5.2: SETTLEMENT D+2 (13 SP)

### [BACKEND] Settlement Worker
**Responsável:** Backend Dev 2 | **Estimativa:** 8 SP | **Prioridade:** P0

Job diário que move pending → available após D+2.

### [BACKEND] Endpoint: GET /drivers/me/earnings
**Responsável:** Backend Dev 2 | **Estimativa:** 3 SP | **Prioridade:** P0

Ver ganhos por período (dia/semana/mês).

### [BACKEND] Settlement Notification
**Responsável:** Backend Dev 2 | **Estimativa:** 2 SP | **Prioridade:** P1

Notificar motorista quando saldo ficar disponível.

---

## EPIC 5.3: PAYOUT (PIX) (14 SP)

### [BACKEND] Endpoint: POST /payouts/request
**Responsável:** Backend Dev 1 | **Estimativa:** 5 SP | **Prioridade:** P0

Motorista solicita saque (mínimo R$ 50).

### [BACKEND] Payout Processor (Efí Bank)
**Responsável:** Backend Dev 1 | **Estimativa:** 5 SP | **Prioridade:** P0

Processar saque via Pix out.

### [BACKEND] Payout Status Tracking
**Responsável:** Backend Dev 1 | **Estimativa:** 4 SP | **Prioridade:** P0

Acompanhar status: PENDING, PROCESSING, COMPLETED, FAILED.

---

# SPRINT 6: MVP POLISH & TESTING
**Duração:** Semanas 11-12  
**Objetivo:** Refinar e preparar para beta  
**Velocity target:** 40 SP

## EPIC 6.1: PAYMENT METHODS (8 SP)

### [BACKEND] Cash Payment Flow
**Responsável:** Backend Dev 2 | **Estimativa:** 5 SP | **Prioridade:** P0

Marcar corrida como paga em dinheiro.

### [FRONTEND] Seleção Método de Pagamento
**Responsável:** Frontend Dev | **Estimativa:** 3 SP | **Prioridade:** P0

Tela para escolher: Pix ou Cash.

---

## EPIC 6.2: USER EXPERIENCE (13 SP)

### [BACKEND] Endpoint: GET /rides/history
**Responsável:** Backend Dev 2 | **Estimativa:** 3 SP | **Prioridade:** P0

Histórico de corridas (passageiro + motorista).

### [BACKEND] Endpoint: PATCH /users/me/profile
**Responsável:** Backend Dev 2 | **Estimativa:** 3 SP | **Prioridade:** P0

Editar perfil (nome, foto).

### [FRONTEND] Tela de Histórico
**Responsável:** Frontend Dev | **Estimativa:** 4 SP | **Prioridade:** P0

Listar corridas passadas com filtros.

### [FRONTEND] Tela de Perfil
**Responsável:** Frontend Dev | **Estimativa:** 3 SP | **Prioridade:** P0

Editar dados do usuário.

---

## EPIC 6.3: TESTING & MONITORING (19 SP)

### [QA] E2E Test Suite
**Responsável:** QA + Backend Dev 1 | **Estimativa:** 8 SP | **Prioridade:** P0

Fluxo completo: cadastro → corrida → pagamento.

### [BACKEND] Performance Testing
**Responsável:** Tech Lead | **Estimativa:** 5 SP | **Prioridade:** P0

Load testing com K6 (100 corridas simultâneas).

### [DEVOPS] Monitoring Setup (Datadog)
**Responsável:** Tech Lead | **Estimativa:** 4 SP | **Prioridade:** P0

APM, logs, alertas.

### [DEVOPS] Staging Deploy Pipeline
**Responsável:** Tech Lead | **Estimativa:** 2 SP | **Prioridade:** P0

Deploy automático em staging.

---

# RESUMO GERAL SPRINTS 2-6

## Entregas Totais:

### Sprint 2 (Geo + Matching):
- ✅ PostGIS habilitado
- ✅ Motorista online/offline
- ✅ Busca motoristas 5km raio
- ✅ Google Maps integration
- ✅ Pricing engine
- ✅ Request ride
- ✅ Accept ride (safe)

### Sprint 3 (Lifecycle):
- ✅ Start trip
- ✅ GPS tracking
- ✅ Complete ride
- ✅ Cancelamento
- ✅ Rating system

### Sprint 4 (Payment):
- ✅ Efí Bank Pix
- ✅ QR code geração
- ✅ Webhook idempotente
- ✅ Ledger financeiro

### Sprint 5 (Wallet):
- ✅ Driver wallet
- ✅ Settlement D+2
- ✅ Payout Pix

### Sprint 6 (Polish):
- ✅ Cash payment
- ✅ Histórico
- ✅ Perfil
- ✅ E2E tests
- ✅ Monitoring

---

## Milestone: 🎉 MVP COMPLETO

**Ao final do Sprint 6:**
- ✅ App funcional end-to-end
- ✅ Pagamento Pix + Cash
- ✅ Repasse D+2
- ✅ Wallet funcionando
- ✅ Avaliações mútuas
- ✅ Histórico completo
- ✅ Testes E2E passando
- ✅ Monitoring ativo
- ✅ Pronto para Beta Testing

---

## Próximos Sprints (7-26):
Os Sprints 7-26 cobrem:
- Fidelização (Tiers, Bônus, Métricas)
- Parcerias (Combustível, Manutenção)
- Comunidade (Mentoria, Eventos)
- Escala (Performance, BI)
- Lançamento

**Consulte:** `IBORA_PLANEJAMENTO_SPRINTS.md` para detalhes.

---

**Documento:** Backlog Técnico Sprints 2-6  
**Versão:** 1.0  
**Data:** Dezembro 2024  
**Pronto para execução!** 🚀
