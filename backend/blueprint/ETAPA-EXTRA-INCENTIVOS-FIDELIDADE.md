# ETAPA EXTRA — INCENTIVOS, PERFORMANCE E FIDELIDADE DO MOTORISTA
## Projeto: iBora Mobilidade

## 1) Objetivo do Módulo
Criar um **Sistema de Incentivos e Fidelidade do Motorista** que:
- aumente **aceite e finalização**
- aumente **caixa gerado para a plataforma**
- reduza **churn de motoristas**
- permita **benefícios reais** (combustível, autopeças)
- **NÃO quebre** o modelo financeiro, ledger e D+N

Este módulo não é opcional: ele é parte estratégica do produto.

## 2) Princípios de Projeto (Regras de Ouro)
1. Incentivo ≠ Ganho normal  
2. Benefício ≠ Dinheiro  
3. Toda concessão é **auditável**  
4. Toda campanha tem: início, fim e regras claras  
5. Incentivos **nunca** alteram saldo manualmente  
6. Cálculo sempre via **jobs periódicos**  
7. Incentivos financeiros entram no ledger **com categoria própria**

## 3) Tipos de Incentivos no iBora

### A) Incentivos Financeiros Indiretos (prioritários)
Não viram dinheiro direto.

- **Comissão reduzida**: 10% → 5% por 30 dias (impacto: regra temporária)
- **Rodar sem custo**: isenção de taxa de uso (impacto: wallet de uso)
- **Cashback de uso**: crédito para operar (impacto: DriverCredit)

Regras:
- não entram no ledger de ganhos
- entram como regra operacional (pricing/fees)

### B) Incentivos Financeiros Diretos (controlados)
Virarão dinheiro, mas com regras.

Exemplos:
- bônus por meta (R$ 200 ao bater meta)
- prêmio por caixa (% extra do faturamento)

Regras:
- categoria `INCENTIVE_BONUS`
- pode ter D+N
- pode ter expiração
- pode ser revertido em fraude

### C) Incentivos Não Financeiros (Fidelidade)
Nunca viram dinheiro.

Exemplos:
- desconto em combustível (posto parceiro)
- desconto em autopeças
- serviços (troca de óleo, lavagem)

Forma:
- voucher
- código
- QR
- API do parceiro

## 4) Métricas Oficiais do iBora

### Métricas Operacionais
- `accept_rate`
- `completion_rate`
- `cancel_rate_driver`
- `avg_response_time`
- `total_km`

### Métricas Financeiras
- `gross_revenue`
- `net_revenue`
- `rides_paid`
- `payment_mix` (Pix / Cartão / Cash)

### Métricas de Engajamento
- `active_days`
- `rides_per_period`
- `consistency_score`

## 5) Agregação de Métricas (como calcular)
- Nunca calcular em tempo real
- Sempre via job

### Tabela: `driver_metrics`
Campos:
- `driver_id`
- `period_type` (daily | weekly | monthly)
- `period_start`
- `period_end`
- `accept_rate`
- `completion_rate`
- `cancel_rate`
- `total_km`
- `total_rides`
- `gross_revenue`
- `net_revenue`
- `active_days`
- `created_at`

Jobs:
- diário → métricas operacionais
- semanal → ranking
- mensal → campanhas grandes

## 6) Campanhas Oficiais do iBora (inicial)

### Campanha 1 — Motorista Ouro
Objetivo: qualidade operacional  
Regras:
- `accept_rate >= 0.90`
- `completion_rate >= 0.95`
- mínimo `50` corridas no período

Benefício:
- comissão reduzida (ex.: −3%)
- duração: 30 dias

Tipo: financeiro indireto

### Campanha 2 — Top Caixa
Objetivo: faturamento  
Regras:
- `gross_revenue >= X` no mês
- mínimo `100` corridas pagas

Benefício:
- bônus fixo `Y`
- ledger: categoria `INCENTIVE_BONUS`
- D+N = 7 dias

Tipo: financeiro direto (controlado)

### Campanha 3 — Alta Quilometragem
Objetivo: disponibilidade  
Regras:
- `total_km >= Y` no mês
- `active_days >= Z`

Benefício:
- crédito de uso (DriverCredit) **ou**
- desconto combustível (benefício parceiro)

Tipo: financeiro indireto + fidelidade

## 7) Modelo de Dados (novo)

### `incentive_campaigns`
- `id`
- `name`
- `type` (DISCOUNT | BONUS | FREE_USAGE | PARTNER)
- `rules` (JSON)
- `start_at`
- `end_at`
- `status`

### `driver_incentives`
- `id`
- `driver_id`
- `campaign_id`
- `incentive_type`
- `value`
- `status` (PENDING | ACTIVE | EXPIRED | CONSUMED)
- `valid_from`
- `valid_until`

### `partner_benefits`
- `id`
- `partner_name`
- `benefit_type`
- `discount_rule`
- `redemption_type`

### `driver_partner_benefits`
- `driver_id`
- `partner_id`
- `tier`
- `valid_until`

## 8) Fluxo de Concessão (auditoria)
1. Job calcula métricas
2. Avalia elegibilidade
3. Cria `driver_incentive`
4. Aplica:
   - regra de comissão
   - crédito de uso
   - bônus (ledger)
5. Emite evento realtime: `driver.incentive.granted`

## 9) Integração com Financeiro (seguro)

### Se for bônus (dinheiro)
- criar `financial_event = INCENTIVE_BONUS`
- gerar `ledger_entry` append-only
- aplicar D+N se definido

### Se for desconto (regra)
- aplicar no motor de precificação/fees
- sem mexer no ledger

## 10) Antifraude básico (obrigatório)
- penalizar cancelamentos por culpa do motorista
- evitar “gaming” (aceita e cancela pra inflar taxa)
- histórico de decisões
- possibilidade de reversão de benefício
- limites por período

## 11) APIs necessárias

Motorista:
- `GET /drivers/me/metrics`
- `GET /drivers/me/incentives`
- `GET /drivers/me/benefits`

Campanhas:
- `GET /campaigns/active`

Admin:
- `POST /campaigns`
- `PUT /campaigns/{id}`
- `GET /campaigns/{id}/eligible-drivers`

## 12) Testes obrigatórios
- não duplicação (idempotência)
- expiração
- reversão
- impacto financeiro correto
- não afetar saldo base

## 13) Resultado estratégico
- aumenta retenção
- aumenta caixa
- cria diferenciação local
- habilita parcerias regionais
- mantém controle financeiro rígido
