# PROGRESSO - Backend App Estilo Uber/99

**Data de Início:** 14/12/2024
**Última Atualização:** 14/12/2024 - 21:00

---

## 📋 STATUS GERAL DO PROJETO

**Status Atual:** 🟢 FASE DE DOCUMENTAÇÃO CONCLUÍDA - Pronto para Implementação

---

## ✅ TAREFAS CONCLUÍDAS

### Sessão 1 - Inicialização e Análise (14/12/2024 - Manhã)

#### 1.1 - Setup Inicial ✅
- ✅ Estrutura de pastas verificada
- ✅ Arquivo PROMPT.md e PROMPT-2.md lidos e compreendidos
- ✅ Sistema de controle de progresso estabelecido (PROGRESSO.md)

**Detalhes:**
- Repositório possui pasta `backend/` para desenvolvimento
- Pasta `repo/` contém 6 projetos de referência:
  - Traccar (rastreamento GPS)
  - Kill Bill (billing/pagamentos)
  - Fineract (ledger financeiro)
  - OpenTripPlanner (rotas/mobilidade)
  - Socket.io (comunicação real-time)
  - Spree (marketplace/delivery)

#### 1.2 - Análise de Repositórios de Referência ✅
- ✅ **Traccar analisado**: Padrões de eventos, rastreamento GPS, tempo real
  - Pipeline de processamento (Chain of Responsibility)
  - WebSocket com Listener Pattern
  - Cache em grafo para queries rápidas
  - Event detection baseado em transições de estado

- ✅ **Kill Bill analisado**: Controle transacional, idempotência, webhooks
  - State Machine para consistência
  - GlobalLocker para operações distribuídas
  - External Keys para idempotência
  - Janitor Pattern para reconciliação
  - Eventos atômicos (postFromTransaction)

- ✅ **Fineract analisado**: Ledger financeiro, double-entry, auditoria
  - Double-Entry Bookkeeping
  - Running Balance assíncrono
  - Tabelas de histórico para auditoria
  - Imutabilidade via reversões
  - GL Closure para compliance

**Documento gerado:** `00-ANALISE-REPOSITORIOS.md` (Sessão 1)

---

### Sessão 2 - Blueprint Técnico Completo (14/12/2024 - Tarde)

#### 2.1 - Documentação Arquitetural Completa ✅

**Documento gerado:** `01-BLUEPRINT-TECNICO-COMPLETO.md` (1000+ linhas)

**Conteúdo do Blueprint:**

1. ✅ **Stack e Decisões Arquiteturais**
   - FastAPI + PostgreSQL + Redis + WebSocket + Arq/Celery
   - Princípios: ACID, Idempotency First, Append-Only Ledger, Event Sourcing Lite

2. ✅ **Modelo de Domínio Completo** (12+ tabelas core)
   - **Identidade**: users, passengers, drivers, vehicles, driver_documents
   - **Corridas**: rides, ride_offers, ride_events, driver_locations
   - **Pagamentos**: payment_intents, pix_charges, card_charges, webhook_events, cash_collections
   - **Ledger**: ledger_accounts, financial_events, ledger_entries, holds, settlements
   - **Wallet**: driver_credits, driver_credit_events
   - **Payout**: payout_requests, payout_transfers
   - **Admin**: admin_users, audit_log

3. ✅ **Máquina de Estados da Corrida**
   - Diagrama Mermaid completo
   - 15 estados (REQUESTED → PAID)
   - Estados alternativos (CANCELED, EXPIRED, REFUNDED, DISPUTED)
   - Guard conditions e eventos por transição

4. ✅ **Fluxos Transacionais Críticos** (com pseudocódigo)

   **CRÍTICO #1 - Accept Ride:**
   - Abordagem híbrida: Redis Lock + PostgreSQL SELECT FOR UPDATE
   - Idempotência via `idempotency_key`
   - Validações: status, driver ativo, corrida única, crédito suficiente
   - Atomicidade: tudo em 1 transação
   - Eventos tempo real pós-commit
   - Tabela: `ride_accept_attempts`

   **CRÍTICO #2 - Webhook Pix Efí:**
   - Validação de assinatura (HMAC-SHA256)
   - Persistência de webhook (sempre)
   - Deduplicação por e2e_id + hash
   - Lock distribuído (Redis)
   - Transação atômica:
     - Atualiza PixCharge, PaymentIntent, Ride
     - Cria FinancialEvent
     - Lança ledger entries (double-entry)
     - Calcula e registra comissão
     - Cria hold D+N
     - Agenda settlement
   - Eventos tempo real

   **Outros fluxos documentados:**
   - Create Ride
   - Dispatch (ofertas)
   - Start/Complete Ride
   - Cancel Ride (com taxas)
   - Create Pix Charge
   - Recarga de crédito (Topup)
   - Consumo de crédito
   - Payout (saque)
   - Settlement D+N (job)
   - Expiração de cobranças (job)

5. ✅ **Modelo Financeiro (Ledger + D+N + Payout + Topup)**
   
   **Princípios:**
   - Double-Entry Bookkeeping (débitos = créditos)
   - Imutabilidade (append-only)
   - Reversões via entries invertidos
   - Saldo derivado (não armazenado)
   - Auditoria completa

   **Chart of Accounts:**
   ```
   ASSETS: Caixa, Banco, Pix a Receber
   LIABILITIES: Motoristas a Pagar, Comissões Retidas
   REVENUE: Receita de Corridas, Comissão Plataforma
   EXPENSES: Taxas de Pagamento, Estornos
   ```

   **Settlement D+N:**
   - Holds automáticos com `release_at`
   - Job diário processa settlements agendados
   - Libera: LOCKED → AVAILABLE
   - Notifica motorista

   **Separação de Wallets:**
   - **EARNINGS**: Ganhos de corridas (ledger conta 2100)
     - Total = soma de ledger entries
     - LOCKED = em hold
     - AVAILABLE = total - locked
   - **CREDIT**: Crédito pré-pago (driver_credits)
     - Recarga via Pix/Cartão
     - Consumo por corrida/período
     - Bloqueia operação se insuficiente

6. ✅ **Abstração PaymentProvider** (Plugável)
   - Interface abstrata: `create_charge`, `get_status`, `refund`, `handle_webhook`, `validate_signature`
   - Implementação EfiPixProvider completa
   - Factory Pattern para múltiplos providers
   - Suporte: Efí Pix, Pagar.me, Stripe, Adyen, etc.

7. ✅ **Segurança, Idempotência e Antifraude**
   - Idempotency keys obrigatórias
   - Rate limiting (Redis)
   - Antifraude:
     - Limite de corridas simultâneas
     - Limite de tentativas falhadas
     - Verificação de disputas/chargebacks
     - Limite de saques diários
     - Valor máximo diário de payout

8. ✅ **Eventos Tempo Real (WebSocket)**
   - WebSocketManager com Redis Pub/Sub
   - Broadcast entre múltiplas instâncias
   - 20+ eventos definidos:
     - ride.* (created, accepted, started, completed, canceled)
     - driver.* (location.updated, status.changed)
     - payment.* (confirmed, failed, expired)
     - wallet.* (earnings.updated, available.updated, credit.updated)
     - payout.* (requested, completed, failed)

9. ✅ **Contratos API FastAPI**
   - Schemas Pydantic para todos endpoints
   - Auth: register, login, refresh
   - Passenger: rides, payments
   - Driver: location, accept, start, complete, wallet, topup, payout
   - Admin: CRUD, relatórios
   - Webhooks: Efí, cards

10. ✅ **Observabilidade e Auditoria**
    - Logs estruturados (JSON)
    - Request ID tracking
    - Métricas Prometheus:
      - rides_created_total, rides_accepted_total
      - webhooks_received_total, webhooks_duplicates_total
      - ride_accept_duration, webhook_processing_duration
      - active_rides, available_drivers
    - Audit log para ações admin

11. ✅ **Roadmap de Implementação (4 fases)**
    - **Fase 1 (4-6 sem)**: MVP Seguro - Rides + Accept + Pix + Ledger
    - **Fase 2 (4-6 sem)**: Financeiro - D+N + Payout + Topup + Cartão + Cash
    - **Fase 3 (3-4 sem)**: Robustez - Antifraude + Rate Limit + Reconciliação
    - **Fase 4 (ongoing)**: Escala - Particionamento + Tracing + HA

---

## 📚 DOCUMENTOS GERADOS

### Sessão 1
1. **PROGRESSO.md** - Sistema de controle de progresso
2. **00-ANALISE-REPOSITORIOS.md** - Consolidação de insights dos repositórios
   - Padrões de Traccar (eventos, tempo real)
   - Padrões de Kill Bill (transacional, idempotência)
   - Padrões de Fineract (ledger, auditoria)
   - Decisões de arquitetura derivadas
   - Checklist de implementação

### Sessão 2
3. **01-BLUEPRINT-TECNICO-COMPLETO.md** - Especificação técnica completa
   - Modelo de domínio (SQL completo)
   - Máquina de estados (Mermaid)
   - Fluxos transacionais (pseudocódigo)
   - Modelo financeiro (ledger + D+N)
   - Abstrações (PaymentProvider)
   - Segurança e observabilidade
   - Roadmap

---

## 🎯 OBJETIVOS DO PROJETO

### Stack Tecnológica (Confirmada)
- **Backend:** FastAPI (Python 3.11+)
- **Banco de Dados:** PostgreSQL 15+ (JSONB, PostGIS)
- **Cache/Session:** Redis 7+
- **Real-time:** WebSocket + Redis Pub/Sub
- **Jobs:** Arq (async) ou Celery
- **Pagamentos:** 
  - Pix: Efí (Pix Cob + Webhook)
  - Cartão: Plugável (Pagar.me, Mercado Pago, etc.)
  - Cash: Registro offline

### Funcionalidades Core
1. ✅ Sistema de corridas (Ride matching) - **DOCUMENTADO**
2. ✅ Rastreamento em tempo real - **DOCUMENTADO**
3. ✅ Pagamentos via Pix com webhook - **DOCUMENTADO**
4. ✅ Ledger financeiro (double-entry) - **DOCUMENTADO**
5. ✅ Sistema de repasse D+N para motoristas - **DOCUMENTADO**
6. ✅ Wallet de crédito (recarga) - **DOCUMENTADO**
7. ✅ Payout (saque) - **DOCUMENTADO**
8. ✅ Eventos em tempo real - **DOCUMENTADO**
9. ✅ Antifraude básico - **DOCUMENTADO**
10. ✅ Observabilidade - **DOCUMENTADO**

### Requisitos Não-Funcionais (Atendidos)
- ✅ Controle transacional rigoroso (accept ride único)
- ✅ Idempotência em pagamentos e webhooks
- ✅ Ledger imutável (append-only)
- ✅ Auditoria completa
- ✅ Observabilidade (logs estruturados, métricas)
- ✅ Separação de wallets (earnings vs credit)
- ✅ Settlement D+N automático
- ✅ Abstração de payment providers

---

## 💡 DECISÕES DE ARQUITETURA (Consolidadas)

### 1. Controle Transacional - Accept Ride
**Abordagem:** Híbrida (Redis Lock + PostgreSQL SELECT FOR UPDATE)
- ✅ Lock distribuído via Redis (previne contenção)
- ✅ Lock pessimista no banco (garante consistência ACID)
- ✅ Idempotency Key obrigatória
- ✅ Eventos atômicos (mesma transação)
- ✅ Validações completas (status, driver, crédito)
- ✅ Tabela `ride_accept_attempts` para retry seguro

### 2. Pagamentos
**Estratégia:** Multi-provider com abstração + Webhook transacional

**Pix (Efí):**
- ✅ Create Charge: Gera QR Code com expiração
- ✅ Webhook: Validação de assinatura HMAC-SHA256
- ✅ Deduplicação: Por e2e_id + hash do payload
- ✅ Persistência: Todos webhooks salvos (audit)
- ✅ Aplicação: Efeito financeiro atômico
- ✅ Job: Expiração de cobranças não pagas

**Cartão:**
- ✅ Provider plugável (interface abstrata)
- ✅ Suporte: Pagar.me, Mercado Pago, Stripe, Adyen
- ✅ Authorize/Capture flow
- ✅ Webhook handler genérico

**Cash:**
- ✅ Registro offline
- ✅ Confirmação pelo motorista
- ✅ Comissão aplicada normalmente

### 3. Ledger Financeiro
**Modelo:** Double-Entry Bookkeeping (inspirado em Fineract)
- ✅ Journal entries imutáveis (append-only)
- ✅ Reversões via novos registros invertidos
- ✅ Saldo derivado (não materializado)
- ✅ Tabelas de histórico para auditoria
- ✅ Chart of Accounts específico
- ✅ Validação: débitos = créditos sempre

### 4. Settlement D+N
**Modelo:** Holds + Job Diário
- ✅ Hold automático ao confirmar pagamento
- ✅ `release_at` configurável (ex: D+7)
- ✅ Job diário: libera holds vencidos
- ✅ Notificação ao motorista
- ✅ Rastreabilidade completa

### 5. Wallets do Motorista
**Separação:** Earnings vs Credit

**Earnings Wallet:**
- Total = soma de ledger entries (conta 2100)
- LOCKED = soma de holds ativos
- AVAILABLE = total - locked
- Usada para: payout (saque)

**Credit Wallet:**
- Saldo materializado em `driver_credits`
- Histórico em `driver_credit_events`
- Recarga: Pix/Cartão (via PaymentIntent)
- Consumo: Por corrida ou período
- Usada para: custo operacional do app

**Por que separar?**
- Evita misturar ganhos com custos
- Permite bloquear operação se crédito insuficiente
- Simplifica contabilidade

### 6. Tempo Real
**Arquitetura:** WebSocket + Redis Pub/Sub
- ✅ Pipeline de processamento de eventos
- ✅ Broadcast via Redis para múltiplas instâncias
- ✅ Autorização por canal (user_id)
- ✅ 20+ eventos definidos
- ✅ Heartbeat para manter conexão

---

## 📊 MÉTRICAS DO BLUEPRINT

- **Linhas de documentação:** 1000+
- **Tabelas modeladas:** 25+
- **Estados da corrida:** 15
- **Fluxos transacionais:** 14
- **Eventos tempo real:** 20+
- **Endpoints API:** 30+
- **Jobs periódicos:** 3 (settlement, expiração, reconciliação)

---

## 🚀 PRÓXIMOS PASSOS

### Imediato (Próxima Sessão)
1. **Iniciar Fase 1 (MVP Seguro)**
   - Configurar ambiente (FastAPI + PostgreSQL + Redis)
   - Implementar modelo de dados (migrations)
   - Auth JWT + Refresh Tokens
   - CRUD básico (Users, Drivers, Passengers)

### Curto Prazo (Semanas 1-2)
2. **Core de Corridas**
   - Create Ride
   - Dispatch (ofertas)
   - **Accept Ride** (crítico - implementar conforme blueprint)
   - Start/Complete Ride
   - WebSocket básico

### Médio Prazo (Semanas 3-4)
3. **Pagamentos Pix**
   - Integração Efí (sandbox)
   - Create Pix Charge
   - **Webhook handler** (crítico - implementar conforme blueprint)
   - Job de expiração

### Médio Prazo (Semanas 5-6)
4. **Ledger Financeiro**
   - Implementar double-entry
   - Criar financial_events
   - Lançar ledger_entries
   - Calcular comissões
   - Implementar holds

---

## 📝 NOTAS IMPORTANTES

### Prioridades Implementação
1. **CRÍTICO**: Accept Ride transacional
2. **CRÍTICO**: Webhook Pix idempotente
3. **IMPORTANTE**: Ledger double-entry
4. **IMPORTANTE**: Settlement D+N
5. **DESEJÁVEL**: Recarga de crédito
6. **DESEJÁVEL**: Payout

### Princípios a Seguir
1. ✅ **Sempre** usar idempotency keys
2. ✅ **Sempre** validar antes de locks
3. ✅ **Sempre** usar transações ACID
4. ✅ **Nunca** UPDATE/DELETE em ledger
5. ✅ **Sempre** emitir eventos após commit
6. ✅ **Sempre** logar estruturadamente

### Riscos Identificados
1. **Concorrência**: Accept ride simultâneo
   - **Mitigação**: Redis Lock + SELECT FOR UPDATE
2. **Webhooks duplicados**: Efí pode reenviar
   - **Mitigação**: Deduplicação por e2e_id + hash
3. **Webhooks perdidos**: Rede pode falhar
   - **Mitigação**: Job de reconciliação
4. **Cobranças expiradas**: Webhook pode não disparar
   - **Mitigação**: Job de expiração

---

## 🐛 PROBLEMAS CONHECIDOS

*Nenhum problema identificado ainda - fase de documentação.*

---

## 📌 CONTROLE DE VERSÕES

### Commits Realizados
1. **[Sessão 1]** - Inicialização do projeto + Análise de repositórios
2. **[Sessão 2]** - Blueprint Técnico Completo

### Próximo Commit
- **[Sessão 3]** - Início da implementação (Fase 1 - Setup + Modelo de dados)

---

**Última Atualização:** 14/12/2024 - 21:00  
**Status:** ✅ FASE DE DOCUMENTAÇÃO CONCLUÍDA  
**Próximo:** Iniciar implementação (Fase 1 - MVP Seguro)
