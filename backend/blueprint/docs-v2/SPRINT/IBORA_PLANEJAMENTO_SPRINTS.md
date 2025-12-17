# 🏃 IBORA: PLANEJAMENTO DE SPRINTS
## Roadmap Executável de 12 Meses (26 Sprints)

---

## 📋 PREMISSAS DO PLANEJAMENTO

### Time Base
```
Tech Lead: 1
Backend Dev: 2
Frontend Dev (React Native): 1
Full-Stack Dev: 1
Product Designer: 1
QA: 0.5 (part-time inicialmente)

Total: 5.5 pessoas
```

### Metodologia
```
Framework: Scrum
Sprint: 2 semanas
Velocity inicial estimada: 40 story points/sprint
Cerimônias:
- Daily: 15min (async nos primeiros meses)
- Planning: 2h
- Review: 1h
- Retro: 1h
```

### Definição de Pronto (DoD)
```
✅ Código revisado (PR aprovado)
✅ Testes unitários (cobertura > 80%)
✅ Testes de integração (fluxos críticos)
✅ Documentação técnica atualizada
✅ Deploy em ambiente de staging
✅ Validação do PO
✅ Sem débitos técnicos críticos
```

### Stack Tecnológico
```
Backend: FastAPI + PostgreSQL + Redis + RabbitMQ
Frontend: React Native (Expo)
Infra: AWS (ECS + RDS + ElastiCache)
CI/CD: GitHub Actions
Monitoramento: Datadog
Pagamentos: Efí Bank (Pix) + Stripe (Cartão)
```

---

## 🎯 FASES DO PROJETO

### FASE 0: Foundation (Sprint 0)
**Objetivo:** Setup do projeto e infraestrutura base

### FASE 1: MVP Core (Sprints 1-6)
**Objetivo:** App funcional para matching e pagamento básico

### FASE 2: Fidelização Tier 1 (Sprints 7-12)
**Objetivo:** Sistema de tiers, bônus e métricas

### FASE 3: Fidelização Tier 2 (Sprints 13-18)
**Objetivo:** Parcerias, comunidade e benefícios

### FASE 4: Escala e Otimização (Sprints 19-24)
**Objetivo:** Performance, antifraude e automação

### FASE 5: Produção (Sprints 25-26)
**Objetivo:** Lançamento cidade piloto

---

# 📅 DETALHAMENTO DOS SPRINTS

---

## SPRINT 0 (Semanas -2 a 0)
**Tema:** Foundation & Setup
**Duração:** 2 semanas
**Objetivo:** Preparar ambiente de desenvolvimento

### Entregas
```
□ Repositório Git estruturado (monorepo)
  ├─ /backend
  ├─ /frontend-driver
  ├─ /frontend-passenger
  ├─ /docs
  └─ /infra

□ CI/CD pipeline básico
  ├─ Lint + Format (pre-commit)
  ├─ Testes automatizados
  └─ Deploy staging

□ Infraestrutura AWS
  ├─ VPC + Subnets
  ├─ RDS PostgreSQL
  ├─ ElastiCache Redis
  └─ S3 buckets

□ Ambientes
  ├─ Local (Docker Compose)
  ├─ Dev (AWS)
  └─ Staging (AWS)

□ Documentação
  ├─ README setup
  ├─ Guias de contribuição
  └─ ADRs (Architecture Decision Records)
```

### Definition of Done
- [ ] Dev consegue rodar projeto localmente em < 30min
- [ ] Pipeline verde (build + testes)
- [ ] Staging acessível via URL
- [ ] Documentação no Notion/Confluence

### Riscos
- Atraso na criação de contas AWS
- Dificuldade com permissões IAM

---

## SPRINT 1 (Semanas 1-2)
**Tema:** Auth & User Management
**Velocity:** 40 SP
**Objetivo:** Sistema de autenticação e cadastro

### User Stories

#### US1.1: Cadastro de Motorista (13 SP)
```
Como motorista
Quero me cadastrar no app
Para começar a trabalhar

Critérios de Aceite:
- [ ] Campos: nome, CPF, telefone, e-mail
- [ ] Validação de CPF
- [ ] Verificação de telefone (SMS via Twilio)
- [ ] Foto de perfil (upload S3)
- [ ] Documentos: CNH (frente/verso), Veículo (CRLV)
- [ ] Status inicial: PENDING_APPROVAL
- [ ] E-mail de boas-vindas

Testes:
- [ ] Validação de dados inválidos
- [ ] CPF duplicado retorna 409
- [ ] Upload de foto funciona
```

#### US1.2: Cadastro de Passageiro (8 SP)
```
Como passageiro
Quero me cadastrar no app
Para solicitar corridas

Critérios de Aceite:
- [ ] Campos: nome, telefone, e-mail
- [ ] Verificação de telefone (SMS)
- [ ] Login social (Google, Apple) opcional
- [ ] Foto de perfil opcional
- [ ] Status inicial: ACTIVE
```

#### US1.3: Login JWT (8 SP)
```
Como usuário
Quero fazer login
Para acessar o app

Critérios de Aceite:
- [ ] Login via telefone + código SMS
- [ ] JWT com expiração 7 dias
- [ ] Refresh token
- [ ] Rate limiting (max 5 tentativas/15min)
- [ ] Logout (invalidar token)
```

#### US1.4: Aprovação de Motorista (Admin) (8 SP)
```
Como admin
Quero aprovar/reprovar motoristas
Para garantir qualidade

Critérios de Aceite:
- [ ] Dashboard admin lista pending drivers
- [ ] Visualizar documentos
- [ ] Aprovar → status ACTIVE
- [ ] Reprovar → status REJECTED + motivo
- [ ] Notificação por e-mail/SMS
```

### Tech Tasks
- [ ] Setup FastAPI + SQLAlchemy
- [ ] Models: User, Driver, Passenger, Document
- [ ] JWT authentication middleware
- [ ] Twilio integration (SMS)
- [ ] S3 upload service
- [ ] Admin panel básico (Django Admin ou Retool)

### Riscos
- Twilio pode ter delay no SMS (Brasil)
- Validação de documentos manual é lenta

---

## SPRINT 2 (Semanas 3-4)
**Tema:** Geolocation & Matching Core
**Velocity:** 40 SP
**Objetivo:** Sistema de localização e matching básico

### User Stories

#### US2.1: Motorista Online/Offline (5 SP)
```
Como motorista
Quero ficar online/offline
Para controlar quando trabalho

Critérios de Aceite:
- [ ] Toggle online/offline no app
- [ ] Status: ONLINE, OFFLINE, IN_RIDE
- [ ] Enviar localização (lat, lng) a cada 5s quando online
- [ ] Redis: drivers:online (sorted set por timestamp)
```

#### US2.2: Busca de Motoristas Próximos (13 SP)
```
Como passageiro
Quero ver motoristas próximos no mapa
Para saber se tem disponibilidade

Critérios de Aceite:
- [ ] Query PostGIS: motoristas num raio de 5km
- [ ] Retornar: id, lat, lng, rating, distância
- [ ] Cache Redis (30s TTL)
- [ ] Max 20 motoristas
- [ ] Ordenar por distância
```

#### US2.3: Solicitar Corrida (13 SP)
```
Como passageiro
Quero solicitar corrida
Para ser transportado

Critérios de Aceite:
- [ ] Input: origem (lat,lng), destino (lat,lng)
- [ ] Calcular distância e tempo (Google Maps API)
- [ ] Calcular preço: base + km + minuto
- [ ] Mostrar preço estimado
- [ ] Criar Ride (status: SEARCHING)
- [ ] Notificar motoristas próximos (5 mais perto)
```

#### US2.4: Motorista Aceita Corrida (8 SP)
```
Como motorista
Quero aceitar/recusar corrida
Para escolher o que atendo

Critérios de Aceite:
- [ ] Notificação push com: origem, destino, valor estimado
- [ ] Botões: Aceitar / Recusar
- [ ] Lock otimista: apenas 1 motorista aceita
- [ ] Ride status: SEARCHING → ACCEPTED
- [ ] Passageiro notificado: "Motorista X aceitou"
```

### Tech Tasks
- [ ] PostGIS extension no PostgreSQL
- [ ] Redis pub/sub para notificações real-time
- [ ] WebSocket server (FastAPI)
- [ ] Google Maps API integration
- [ ] Pricing engine (v1 simples)
- [ ] Push notifications (Firebase)

### Riscos
- Race condition no aceite (mitigar com SELECT FOR UPDATE)
- Google Maps API cota

---

## SPRINT 3 (Semanas 5-6)
**Tema:** Ride Lifecycle
**Velocity:** 40 SP
**Objetivo:** Fluxo completo da corrida

### User Stories

#### US3.1: Motorista a Caminho (5 SP)
```
Como motorista
Quero sinalizar que estou indo buscar
Para informar o passageiro

Critérios de Aceite:
- [ ] Botão "Estou indo"
- [ ] Ride status: ACCEPTED → DRIVER_ARRIVING
- [ ] Passageiro vê ETA (Google Maps)
- [ ] Localização do motorista em tempo real
```

#### US3.2: Iniciar Corrida (5 SP)
```
Como motorista
Quero iniciar a corrida ao pegar passageiro
Para começar a contar tempo/distância

Critérios de Aceite:
- [ ] Botão "Iniciar viagem"
- [ ] Ride status: DRIVER_ARRIVING → IN_PROGRESS
- [ ] Timestamp: started_at
- [ ] Tracking: salvar GPS a cada 30s
```

#### US3.3: Finalizar Corrida (13 SP)
```
Como motorista
Quero finalizar a corrida
Para receber o pagamento

Critérios de Aceite:
- [ ] Botão "Finalizar"
- [ ] Calcular: distância real, tempo real
- [ ] Calcular: valor final (pode variar do estimado)
- [ ] Ride status: IN_PROGRESS → COMPLETED
- [ ] Timestamp: completed_at
- [ ] Trigger pagamento
```

#### US3.4: Cancelamento (8 SP)
```
Como passageiro ou motorista
Quero cancelar a corrida
Por algum motivo

Critérios de Aceite:
- [ ] Botão "Cancelar" (ambos lados)
- [ ] Motivo obrigatório (lista pré-definida)
- [ ] Ride status: * → CANCELLED
- [ ] Regra de cobrança:
  - Cancelamento passageiro após 5min: cobra R$ 5
  - Cancelamento motorista: sem taxa
- [ ] Estatística: impacta taxa de cancelamento
```

#### US3.5: Avaliação Mútua (8 SP)
```
Como passageiro e motorista
Quero avaliar a experiência
Para melhorar o serviço

Critérios de Aceite:
- [ ] Tela de avaliação após ride
- [ ] Nota: 1-5 estrelas
- [ ] Comentário opcional (max 200 chars)
- [ ] Salvar: Rating (tabela)
- [ ] Atualizar: driver.rating_avg, passenger.rating_avg
- [ ] Exibir ratings nos perfis
```

### Tech Tasks
- [ ] State machine da corrida (FSM)
- [ ] GPS tracking worker
- [ ] Pricing calculation (real vs estimado)
- [ ] Cancelamento logic
- [ ] Rating aggregation

### Riscos
- GPS impreciso (túnel, prédios)
- Divergência preço estimado vs final

---

## SPRINT 4 (Semanas 7-8)
**Tema:** Payment Integration (Pix)
**Velocity:** 40 SP
**Objetivo:** Pagamento via Pix (Efí Bank)

### User Stories

#### US4.1: Integração Efí Bank (13 SP)
```
Como sistema
Quero integrar com Efí Bank
Para processar pagamentos Pix

Critérios de Aceite:
- [ ] Conta Efí configurada (sandbox)
- [ ] Criar cobrança Pix (QR code)
- [ ] Webhook idempotente (receber confirmação)
- [ ] Salvar transaction: external_txid, status, amount
```

#### US4.2: Pagamento Pix pelo Passageiro (13 SP)
```
Como passageiro
Quero pagar via Pix
Para finalizar a corrida

Critérios de Aceite:
- [ ] Após ride completed: tela pagamento
- [ ] Gerar QR code Pix (Efí)
- [ ] Exibir QR + código copia-e-cola
- [ ] Polling: verificar pagamento (max 5min)
- [ ] Se pago: ride status → PAID
- [ ] Se não pago: ride status → PAYMENT_PENDING
```

#### US4.3: Ledger Financeiro (13 SP)
```
Como sistema
Quero registrar todas transações
Para auditoria

Critérios de Aceite:
- [ ] Tabela: financial_events (append-only)
- [ ] Criar evento: RIDE_COMPLETED
  - amount: valor da corrida
  - driver_id, passenger_id, ride_id
- [ ] Criar evento: PLATFORM_FEE
  - amount: comissão (15%)
- [ ] Criar evento: DRIVER_EARNING
  - amount: ganho do motorista (85%)
- [ ] Ledger imutável (sem UPDATE/DELETE)
```

### Tech Tasks
- [ ] Efí Bank SDK integration
- [ ] Webhook endpoint (/webhooks/efi)
- [ ] Idempotency (unique constraint external_txid)
- [ ] Ledger service
- [ ] Financial events worker

### Riscos
- Webhook duplicado (mitigar com idempotency)
- Delay no Pix (pode levar 10-30s)

---

## SPRINT 5 (Semanas 9-10)
**Tema:** Driver Wallet & Payout
**Velocity:** 40 SP
**Objetivo:** Carteira do motorista e repasse

### User Stories

#### US5.1: Driver Wallet (13 SP)
```
Como motorista
Quero ver meu saldo
Para saber quanto tenho

Critérios de Aceite:
- [ ] Tabela: driver_wallets
  - available_balance (saldo disponível)
  - pending_balance (saldo D+N)
  - total_earnings (acumulado)
- [ ] Atualizar após cada corrida
- [ ] Tela: "Minha Carteira"
  - Saldo disponível
  - Saldo pendente
  - Histórico de ganhos
```

#### US5.2: Repasse D+2 (13 SP)
```
Como motorista
Quero receber meu dinheiro em D+2
Para ter liquidez

Critérios de Aceite:
- [ ] Job diário: settlement_worker
- [ ] Buscar rides: completed_at <= hoje - 2 dias
- [ ] Status PAID e não setled
- [ ] Mover: pending → available
- [ ] Criar evento: SETTLEMENT
```

#### US5.3: Solicitar Saque (Pix) (13 SP)
```
Como motorista
Quero sacar meu saldo
Para usar o dinheiro

Critérios de Aceite:
- [ ] Botão "Sacar"
- [ ] Valor mínimo: R$ 50
- [ ] Informar chave Pix
- [ ] Criar: payout request (status PENDING)
- [ ] Validar: available_balance >= valor
- [ ] Deduzir: available_balance
- [ ] Processar: enviar Pix via Efí
- [ ] Status: PENDING → COMPLETED
- [ ] Criar evento: PAYOUT
```

### Tech Tasks
- [ ] Wallet service
- [ ] Settlement worker (cron job)
- [ ] Payout service (Efí Bank Pix out)
- [ ] Dashboard financeiro (motorista)

### Riscos
- Erro no cálculo de settlement (auditoria rigorosa)
- Falha no Pix out (retry logic necessário)

---

## SPRINT 6 (Semanas 11-12)
**Tema:** MVP Polish & Testing
**Velocity:** 40 SP
**Objetivo:** Refinar fluxos e testes E2E

### User Stories

#### US6.1: Pagamento Cash (8 SP)
```
Como passageiro
Quero pagar em dinheiro
Para flexibilidade

Critérios de Aceite:
- [ ] Opção "Dinheiro" no método de pagamento
- [ ] Após ride: confirmar pagamento (motorista)
- [ ] Ride status → PAID (sem Pix)
- [ ] Ledger: marcar como CASH
- [ ] Motorista: saldo direto (não passa pela plataforma)
```

#### US6.2: Histórico de Corridas (5 SP)
```
Como passageiro/motorista
Quero ver minhas corridas anteriores
Para consultar

Critérios de Aceite:
- [ ] Tela: "Minhas Corridas"
- [ ] Listar: últimas 50 corridas
- [ ] Filtrar: data, status
- [ ] Detalhes: origem, destino, valor, rating
```

#### US6.3: Perfil do Usuário (5 SP)
```
Como usuário
Quero editar meu perfil
Para manter atualizado

Critérios de Aceite:
- [ ] Editar: nome, foto, telefone
- [ ] Alterar senha
- [ ] Logout
- [ ] Excluir conta (soft delete)
```

#### US6.4: Testes E2E (13 SP)
```
Como QA
Quero garantir que fluxos funcionam
Para lançar com confiança

Critérios de Aceite:
- [ ] Fluxo completo: cadastro → corrida → pagamento
- [ ] Testes: Postman/Insomnia collections
- [ ] Testes: Detox (React Native E2E)
- [ ] Smoke tests em staging
```

#### US6.5: Monitoring & Alerts (8 SP)
```
Como DevOps
Quero monitorar o sistema
Para detectar problemas

Critérios de Aceite:
- [ ] Datadog APM
- [ ] Logs centralizados
- [ ] Alertas: erro 5xx, latência > 2s
- [ ] Dashboard: rides/min, motoristas online
```

### Tech Tasks
- [ ] Cash payment flow
- [ ] E2E test suite
- [ ] Monitoring setup
- [ ] Performance profiling

### Milestone: 🎉 MVP FUNCIONAL
```
✅ Motorista pode se cadastrar e ser aprovado
✅ Passageiro pode solicitar corrida
✅ Matching funciona (5km raio)
✅ Corrida completa (aceite → início → fim)
✅ Pagamento Pix/Cash funciona
✅ Repasse D+2 funciona
✅ Wallet motorista funciona
✅ Testes E2E passam
```

---

## SPRINT 7 (Semanas 13-14)
**Tema:** Tiers & Commission System
**Velocity:** 45 SP (time mais rodado)
**Objetivo:** Sistema de fidelização - Tier Bronze/Prata

### User Stories

#### US7.1: Sistema de Tiers (13 SP)
```
Como motorista
Quero ter tier baseado em tempo
Para pagar menos comissão

Critérios de Aceite:
- [ ] Tabela: driver_tiers
  - tier: BRONZE, SILVER, GOLD, DIAMOND
  - commission_rate: 0.15, 0.13, 0.12, 0.10
  - requirements: JSON
- [ ] Calcular tier automaticamente:
  - Bronze: 0-3 meses
  - Prata: 3-6 meses + 25 rides/week + rating > 4.5
- [ ] Atualizar semanalmente (job)
- [ ] Notificar motorista ao subir tier
```

#### US7.2: Comissão Dinâmica (8 SP)
```
Como sistema
Quero aplicar comissão baseada no tier
Para incentivar fidelidade

Critérios de Aceite:
- [ ] Ao calcular ledger: usar driver.tier.commission_rate
- [ ] Bronze: 15%
- [ ] Prata: 13%
- [ ] Dashboard: mostrar economia vs Uber (25%)
```

#### US7.3: Dashboard de Métricas (13 SP)
```
Como motorista
Quero ver minhas métricas
Para entender meu desempenho

Critérios de Aceite:
- [ ] Tela: "Minhas Estatísticas"
- [ ] Métricas:
  - Taxa de aceite
  - Taxa de finalização
  - Taxa de cancelamento
  - Corridas/semana
  - Ganho médio/corrida
  - KM rodado/semana
- [ ] Atualizar: diariamente (job)
```

#### US7.4: Progresso do Tier (8 SP)
```
Como motorista
Quero ver progresso para próximo tier
Para me motivar

Critérios de Aceite:
- [ ] Card: "Próximo Tier: Prata"
- [ ] Progresso visual (barra)
- [ ] Requisitos: 
  - Tempo: X dias restantes
  - Corridas: Y/25 esta semana
  - Rating: 4.3 → meta 4.5
- [ ] Estimativa: "Faltam 2 semanas"
```

### Tech Tasks
- [ ] Tier calculation worker
- [ ] Metrics aggregation worker
- [ ] Commission dynamic calculation
- [ ] Tier progression UI

---

## SPRINT 8 (Semanas 15-16)
**Tema:** Campaigns & Bonus System
**Velocity:** 45 SP
**Objetivo:** Sistema de campanhas e bônus

### User Stories

#### US8.1: Engine de Campanhas (13 SP)
```
Como admin
Quero criar campanhas de bônus
Para incentivar motoristas

Critérios de Aceite:
- [ ] Tabela: incentive_campaigns
  - name, type, rules (JSON), start/end, status
- [ ] Admin panel: CRUD campanhas
- [ ] Tipos: BONUS, FREE_USAGE, DISCOUNT
```

#### US8.2: Campanha "Semana Cheia" (13 SP)
```
Como motorista
Quero ganhar bônus ao bater meta
Para aumentar renda

Critérios de Aceite:
- [ ] Campanha: "40 corridas em 7 dias = R$ 200"
- [ ] Job semanal: avaliar elegibilidade
- [ ] Se atingiu: criar financial_event INCENTIVE_BONUS
- [ ] Adicionar em pending_balance (D+2)
- [ ] Notificar motorista: "Parabéns! Ganhou R$ 200"
```

#### US8.3: Card de Campanhas Ativas (8 SP)
```
Como motorista
Quero ver campanhas ativas
Para saber quais metas perseguir

Critérios de Aceite:
- [ ] Tela: "Campanhas" (home)
- [ ] Listar: campanhas ativas
- [ ] Card: nome, descrição, requisitos, prêmio
- [ ] Progresso: "20/40 corridas"
```

#### US8.4: Histórico de Incentivos (8 SP)
```
Como motorista
Quero ver incentivos recebidos
Para acompanhar ganhos extras

Critérios de Aceite:
- [ ] Tela: "Meus Incentivos"
- [ ] Listar: PENDING, ACTIVE, CONSUMED, EXPIRED
- [ ] Mostrar valor e data
```

### Tech Tasks
- [ ] Campaign engine
- [ ] Eligibility evaluator
- [ ] Bonus payment integration
- [ ] Campaign UI

---

## SPRINT 9 (Semanas 17-18)
**Tema:** Metrics & Anti-churn
**Velocity:** 45 SP
**Objetivo:** Sistema de métricas e alerta de churn

### User Stories

#### US9.1: Cálculo de Métricas Diário (13 SP)
```
Como sistema
Quero calcular métricas de motoristas
Para avaliar performance

Critérios de Aceite:
- [ ] Tabela: driver_metrics (daily)
- [ ] Job diário: calcular para D-1
- [ ] Métricas:
  - accept_rate, completion_rate, cancel_rate
  - total_rides, total_km, gross_revenue
  - active_days
- [ ] Aggregations: weekly, monthly
```

#### US9.2: Score de Risco de Churn (13 SP)
```
Como sistema
Quero calcular risco de churn
Para agir preventivamente

Critérios de Aceite:
- [ ] Algoritmo:
  - Queda atividade: +30 pts
  - Queda ganhos: +25 pts
  - Nota baixa: +15 pts
  - Sem engajamento: +20 pts
  - Sem usar benefícios: +10 pts
- [ ] Score: 0-100
- [ ] Classificação: LOW, MEDIUM, HIGH, CRITICAL
```

#### US9.3: Alertas de Churn (13 SP)
```
Como CS
Quero ser notificado de motoristas em risco
Para intervir

Critérios de Aceite:
- [ ] Dashboard: lista motoristas em risco
- [ ] Ordenar por: score DESC
- [ ] Ações sugeridas:
  - Score > 70: ligar hoje
  - Score > 50: WhatsApp 24h
  - Score > 30: notificação app
- [ ] Registrar ações tomadas
```

#### US9.4: Campanha de Reativação (5 SP)
```
Como motorista inativo
Quero ser incentivado a voltar
Para retomar trabalho

Critérios de Aceite:
- [ ] Inativo há 15 dias: enviar WhatsApp
- [ ] Oferta: 0% comissão por 7 dias
- [ ] Se voltar: fast-track ao tier anterior
```

### Tech Tasks
- [ ] Metrics calculation worker
- [ ] Churn score algorithm
- [ ] CS dashboard (Retool ou similar)
- [ ] Reactivation campaign automation

---

## SPRINT 10 (Semanas 19-20)
**Tema:** Partner Benefits - Fuel
**Velocity:** 45 SP
**Objetivo:** Primeira parceria estratégica (combustível)

### User Stories

#### US10.1: Parceria Postos (Admin) (8 SP)
```
Como admin
Quero cadastrar postos parceiros
Para oferecer desconto

Critérios de Aceite:
- [ ] Tabela: partner_fuel_stations
  - name, address, discount (%)
- [ ] Admin: CRUD postos
```

#### US10.2: Cashback Combustível (13 SP)
```
Como motorista
Quero ganhar cashback ao abastecer
Para economizar

Critérios de Aceite:
- [ ] Motorista abastece no posto
- [ ] Tira foto da nota fiscal
- [ ] Envia pelo app
- [ ] CS aprova/reprova
- [ ] Se aprovado: cashback 8% em wallet (D+2)
- [ ] Criar evento: FUEL_CASHBACK
```

#### US10.3: Mapa de Postos (8 SP)
```
Como motorista
Quero ver postos parceiros próximos
Para escolher onde abastecer

Critérios de Aceite:
- [ ] Tela: "Postos Parceiros"
- [ ] Mapa com pins
- [ ] Filtrar por: distância, desconto
- [ ] Rota até o posto (Waze integration)
```

#### US10.4: Histórico de Cashback (5 SP)
```
Como motorista
Quero ver meu cashback acumulado
Para acompanhar economia

Critérios de Aceite:
- [ ] Tela: "Meus Benefícios"
- [ ] Total economizado (mensal/anual)
- [ ] Histórico de reembolsos
```

### Tech Tasks
- [ ] Partner management system
- [ ] OCR para nota fiscal (ou validação manual)
- [ ] Cashback calculation
- [ ] Map integration

---

## SPRINT 11 (Semanas 21-22)
**Tema:** Community - Mentorship
**Velocity:** 45 SP
**Objetivo:** Programa de mentoria

### User Stories

#### US11.1: Sistema de Mentoria (13 SP)
```
Como motorista Diamante
Quero ser mentor
Para ajudar novatos e ganhar bônus

Critérios de Aceite:
- [ ] Requisitos: tier Diamante + voluntário
- [ ] Tabela: mentorships
  - mentor_id, mentee_id, status, started_at
- [ ] Max 5 mentorados por mentor
- [ ] Admin: atribuir mentorados
```

#### US11.2: Chat Mentor-Mentorado (13 SP)
```
Como mentorado
Quero conversar com meu mentor
Para tirar dúvidas

Critérios de Aceite:
- [ ] Chat in-app (simples)
- [ ] Push notification
- [ ] Histórico de mensagens
```

#### US11.3: Bônus de Mentoria (8 SP)
```
Como mentor
Quero ganhar bônus ao mentorado completar 30 dias
Para ser recompensado

Critérios de Aceite:
- [ ] Job mensal: verificar mentorados ativos há 30+ dias
- [ ] Se ativo: pagar R$ 50 ao mentor
- [ ] Criar evento: MENTORSHIP_BONUS
- [ ] Notificar mentor
```

#### US11.4: Progresso do Mentorado (8 SP)
```
Como mentor
Quero acompanhar progresso do mentorado
Para orientar melhor

Critérios de Aceite:
- [ ] Dashboard: mentorados
- [ ] Métricas: corridas, rating, ganhos
- [ ] Avisos: se inativo > 3 dias
```

### Tech Tasks
- [ ] Mentorship management
- [ ] Simple chat (Firebase ou similar)
- [ ] Mentor dashboard

---

## SPRINT 12 (Semanas 23-24)
**Tema:** Tier Gold & Guarantee Program
**Velocity:** 45 SP
**Objetivo:** Tier Ouro + Garantia de Renda

### User Stories

#### US12.1: Tier Ouro (8 SP)
```
Como motorista
Quero atingir tier Ouro
Para pagar 12% de comissão

Critérios de Aceite:
- [ ] Requisitos: 6-12 meses + 30 rides/week + rating > 4.6
- [ ] Comissão: 12%
- [ ] Badge "Ouro" no perfil
```

#### US12.2: Programa iBora Garante (13 SP)
```
Como motorista Ouro+
Quero garantia de renda mínima
Para ter segurança

Critérios de Aceite:
- [ ] Requisitos:
  - 40h/semana
  - Taxa aceite > 80%
  - Taxa finalização > 95%
- [ ] Se faturar < R$ 2.500/mês: plataforma complementa
- [ ] Job mensal: calcular elegibilidade
- [ ] Se elegível e abaixo: pagar diferença
- [ ] Criar evento: INCOME_GUARANTEE
- [ ] Limite: 2 meses consecutivos
```

#### US12.3: Dashboard de Garantia (8 SP)
```
Como motorista Ouro+
Quero ver se estou elegível à garantia
Para me planejar

Critérios de Aceite:
- [ ] Card: "iBora Garante"
- [ ] Status: ELEGÍVEL / NÃO ELEGÍVEL
- [ ] Requisitos faltantes
- [ ] Projeção: faturamento do mês
```

### Tech Tasks
- [ ] Tier Gold calculation
- [ ] Income guarantee worker
- [ ] Eligibility calculator

---

## SPRINT 13 (Semanas 25-26)
**Tema:** Payment - Credit Card
**Velocity:** 45 SP
**Objetivo:** Pagamento por cartão de crédito

### User Stories

#### US13.1: Integração Stripe (13 SP)
```
Como sistema
Quero processar cartões
Para dar opção aos passageiros

Critérios de Aceite:
- [ ] Stripe account setup
- [ ] Criar payment intent
- [ ] Salvar card (tokenizado)
- [ ] Cobrar automaticamente após ride
```

#### US13.2: Cadastro de Cartão (8 SP)
```
Como passageiro
Quero cadastrar cartão
Para não ter que pagar todo vez

Critérios de Aceite:
- [ ] Tela: "Meus Cartões"
- [ ] Adicionar cartão (Stripe Elements)
- [ ] Salvar como default
- [ ] Max 3 cartões
```

#### US13.3: Pagamento Automático (13 SP)
```
Como passageiro
Quero que cartão seja cobrado automaticamente
Para agilizar

Critérios de Aceite:
- [ ] Após ride completed: cobrar cartão default
- [ ] Se sucesso: ride PAID
- [ ] Se falha: retry 2x
- [ ] Se persistir: status PAYMENT_FAILED
- [ ] Notificar passageiro
```

### Tech Tasks
- [ ] Stripe integration
- [ ] Card tokenization
- [ ] Automatic charge
- [ ] Retry logic

---

## SPRINT 14 (Semanas 27-28)
**Tema:** Rating System Improvements
**Velocity:** 45 SP
**Objetivo:** Sistema de avaliação justo

### User Stories

#### US14.1: Peso de Avaliações (13 SP)
```
Como sistema
Quero contextualizar avaliações
Para ser mais justo

Critérios de Aceite:
- [ ] Passageiro com rating < 4.0: peso 0.5
- [ ] Passageiro com rating > 4.8: peso 1.0
- [ ] Recalcular driver rating com pesos
```

#### US14.2: Contestação de Avaliação (13 SP)
```
Como motorista
Quero contestar avaliação injusta
Para não ser prejudicado

Critérios de Aceite:
- [ ] Botão "Contestar" em avaliações < 4 estrelas
- [ ] Motivo obrigatório
- [ ] Prazo: 48h
- [ ] CS analisa manualmente
- [ ] Se procedente: remover avaliação
```

#### US14.3: Motorista Veterano (8 SP)
```
Como motorista veterano (6+ meses)
Quero ter "crédito" em avaliações
Para não ser prejudicado por uma semana ruim

Critérios de Aceite:
- [ ] Se 6+ meses e rating histórico > 4.7:
  - Avaliações < 4 estrelas não baixam imediatamente
  - Flagged para review manual
- [ ] "Perdoar" até 5 avaliações ruins/mês
```

### Tech Tasks
- [ ] Weighted rating calculation
- [ ] Appeal system
- [ ] Veteran protection logic

---

## SPRINT 15 (Semanas 29-30)
**Tema:** Support System
**Velocity:** 45 SP
**Objetivo:** Atendimento humanizado

### User Stories

#### US15.1: Chat de Suporte (13 SP)
```
Como motorista/passageiro
Quero falar com suporte
Para resolver problemas

Critérios de Aceite:
- [ ] Chat in-app
- [ ] Bot inicial (FAQ)
- [ ] Escalação para humano
- [ ] SLA: resposta < 2h (crítico), < 24h (normal)
```

#### US15.2: WhatsApp Business (8 SP)
```
Como motorista
Quero falar com suporte via WhatsApp
Para comodidade

Critérios de Aceite:
- [ ] Número WhatsApp Business
- [ ] Integração: enviar mensagem do app
- [ ] Template de mensagens
```

#### US15.3: Ticket System (13 SP)
```
Como CS
Quero gerenciar tickets
Para organizar atendimento

Critérios de Aceite:
- [ ] Dashboard: tickets abertos
- [ ] Priorização: CRITICAL > HIGH > MEDIUM > LOW
- [ ] Atribuir a CS agent
- [ ] Histórico de conversas
- [ ] Resolver / Escalar
```

### Tech Tasks
- [ ] Chat integration (Firebase / Intercom)
- [ ] WhatsApp Business API
- [ ] Ticket management system

---

## SPRINT 16 (Semanas 31-32)
**Tema:** Events & Recognition
**Velocity:** 45 SP
**Objetivo:** Comunidade e reconhecimento

### User Stories

#### US16.1: Ranking Semanal (8 SP)
```
Como motorista
Quero ver ranking
Para me comparar

Critérios de Aceite:
- [ ] Tela: "Ranking da Semana"
- [ ] Top 10: mais corridas, melhor rating, maior faturamento
- [ ] Minha posição
```

#### US16.2: Conquistas (Achievements) (13 SP)
```
Como motorista
Quero desbloquear conquistas
Para me sentir reconhecido

Critérios de Aceite:
- [ ] Sistema de badges:
  - "100 corridas"
  - "Nota 5.0 por 1 mês"
  - "1 ano no iBora"
- [ ] Notificação ao desbloquear
- [ ] Exibir no perfil
```

#### US16.3: Motorista da Semana (8 SP)
```
Como motorista top
Quero ser reconhecido
Para valorização

Critérios de Aceite:
- [ ] Job semanal: calcular "Driver of the Week"
- [ ] Critérios: rating + rides + revenue
- [ ] Notificação: "Parabéns! Você é o motorista da semana"
- [ ] Post no blog/redes sociais
- [ ] Prêmio: R$ 100
```

### Tech Tasks
- [ ] Ranking calculation
- [ ] Achievement system
- [ ] Recognition automation

---

## SPRINT 17 (Semanas 33-34)
**Tema:** Driver Credit System
**Velocity:** 45 SP
**Objetivo:** Crédito pré-pago para motorista

### User Stories

#### US17.1: Recarga de Crédito (13 SP)
```
Como motorista
Quero recarregar crédito
Para usar na plataforma

Critérios de Aceite:
- [ ] Tela: "Recarregar Crédito"
- [ ] Valores: R$ 100, 200, 500
- [ ] Pagamento: Pix
- [ ] Bônus: 8% extra
  - R$ 100 → R$ 108
- [ ] Adicionar em: usage_credit
```

#### US17.2: Uso do Crédito (8 SP)
```
Como motorista
Quero usar crédito nas comissões
Para não "dever" para plataforma

Critérios de Aceite:
- [ ] Ao finalizar ride: deduzir comissão de usage_credit
- [ ] Se insuficiente: deduzir de available_balance
- [ ] Dashboard: saldo de crédito
```

#### US17.3: Histórico de Crédito (5 SP)
```
Como motorista
Quero ver uso do crédito
Para controlar gastos

Critérios de Aceite:
- [ ] Tela: "Meu Crédito"
- [ ] Saldo atual
- [ ] Histórico: recargas e usos
```

### Tech Tasks
- [ ] Credit wallet management
- [ ] Credit usage logic
- [ ] Bonus calculation

---

## SPRINT 18 (Semanas 35-36)
**Tema:** Fraud Detection v1
**Velocity:** 45 SP
**Objetivo:** Antifraude básico

### User Stories

#### US18.1: Detecção de Corridas Suspeitas (13 SP)
```
Como sistema
Quero detectar fraudes
Para evitar prejuízo

Critérios de Aceite:
- [ ] Padrões suspeitos:
  - Mesmo par (driver-passenger) > 70%
  - Corridas sempre no mesmo local
  - Cancelamento após aceite (repetido)
  - Corrida muito curta com valor alto
- [ ] Flagging: ride.fraud_score (0-100)
- [ ] Se > 70: revisão manual obrigatória
```

#### US18.2: Dashboard Antifraude (13 SP)
```
Como CS
Quero ver corridas suspeitas
Para investigar

Critérios de Aceite:
- [ ] Dashboard: rides flagged
- [ ] Ordenar por: fraud_score DESC
- [ ] Ações:
  - Aprovar (false positive)
  - Bloquear motorista/passageiro
  - Reverter pagamento
```

#### US18.3: Bloqueio Automático (8 SP)
```
Como sistema
Quero bloquear usuários fraudulentos
Para proteger plataforma

Critérios de Aceite:
- [ ] Se fraud_score > 90: bloquear automático
- [ ] Status: SUSPENDED
- [ ] Notificar usuário
- [ ] Reversão de incentivos
```

### Tech Tasks
- [ ] Fraud detection rules engine
- [ ] Fraud dashboard
- [ ] Automated blocking

---

## SPRINT 19 (Semanas 37-38)
**Tema:** Performance Optimization
**Velocity:** 45 SP
**Objetivo:** Otimizar queries e caching

### User Stories

#### US19.1: Otimização de Queries (13 SP)
```
Como sistema
Quero queries rápidas
Para melhor UX

Critérios de Aceite:
- [ ] Profile slow queries (> 1s)
- [ ] Adicionar índices:
  - rides(status, created_at)
  - drivers(location) GIST
  - financial_events(driver_id, created_at)
- [ ] Reduzir latência: p95 < 500ms
```

#### US19.2: Cache Strategy (13 SP)
```
Como sistema
Quero cachear dados frequentes
Para reduzir carga no DB

Critérios de Aceite:
- [ ] Redis cache:
  - Driver online status (5s TTL)
  - Available drivers (30s TTL)
  - Campaign rules (5min TTL)
- [ ] Cache invalidation: on update
```

#### US19.3: Read Replicas (8 SP)
```
Como sistema
Quero separar leitura/escrita
Para escalar

Critérios de Aceite:
- [ ] Setup RDS read replica
- [ ] Queries read-only: usar replica
- [ ] Queries write: usar primary
```

### Tech Tasks
- [ ] Query profiling
- [ ] Index optimization
- [ ] Redis caching layer
- [ ] Read replica setup

---

## SPRINT 20 (Semanas 39-40)
**Tema:** Real-time Improvements
**Velocity:** 45 SP
**Objetivo:** Melhorar tempo real (WebSocket)

### User Stories

#### US20.1: WebSocket Scaling (13 SP)
```
Como sistema
Quero suportar 1000+ conexões simultâneas
Para escalar

Critérios de Aceite:
- [ ] Separar WebSocket server (FastAPI)
- [ ] Redis pub/sub para broadcast
- [ ] Load balancer (ALB)
- [ ] Testes de carga: 1000 conexões
```

#### US20.2: Notificações Mais Rápidas (8 SP)
```
Como motorista/passageiro
Quero receber notificações instantâneas
Para melhor experiência

Critérios de Aceite:
- [ ] Latência: < 200ms (p95)
- [ ] Fallback: push notification se offline
- [ ] Retry logic se falhar
```

#### US20.3: GPS Tracking Otimizado (8 SP)
```
Como sistema
Quero tracking preciso e leve
Para melhor UX

Critérios de Aceite:
- [ ] Enviar GPS apenas se moveu > 50m
- [ ] Batch GPS points (enviar 5 em 5)
- [ ] Kalman filter no backend
```

### Tech Tasks
- [ ] WebSocket server scaling
- [ ] Redis pub/sub
- [ ] GPS optimization

---

## SPRINT 21 (Semanas 41-42)
**Tema:** Driver Academy
**Velocity:** 40 SP
**Objetivo:** Capacitação de motoristas

### User Stories

#### US21.1: Cursos Online (13 SP)
```
Como motorista
Quero fazer cursos
Para melhorar habilidades

Critérios de Aceite:
- [ ] Integração: Hotmart ou similar
- [ ] Cursos:
  - Direção Defensiva
  - Atendimento ao Cliente
  - Gestão Financeira
- [ ] Certificado ao completar
- [ ] Pontos extras no tier
```

#### US21.2: Progresso de Cursos (8 SP)
```
Como motorista
Quero ver progresso
Para acompanhar

Critérios de Aceite:
- [ ] Tela: "iBora Academy"
- [ ] Listar cursos: disponíveis, em progresso, concluídos
- [ ] Progresso: % concluído
- [ ] Certificados baixáveis
```

### Tech Tasks
- [ ] LMS integration
- [ ] Certificate generation

---

## SPRINT 22 (Semanas 43-44)
**Tema:** Maintenance Partnerships
**Velocity:** 40 SP
**Objetivo:** Parcerias manutenção

### User Stories

#### US22.1: Rede de Oficinas (8 SP)
```
Como admin
Quero cadastrar oficinas parceiras
Para oferecer desconto

Critérios de Aceite:
- [ ] Tabela: partner_workshops
- [ ] Admin: CRUD oficinas
- [ ] Desconto: 15-20%
```

#### US22.2: Agendamento (13 SP)
```
Como motorista
Quero agendar manutenção
Para usar desconto

Critérios de Aceite:
- [ ] Tela: "Oficinas Parceiras"
- [ ] Selecionar oficina
- [ ] Escolher data/hora
- [ ] QR code com desconto
- [ ] Oficina valida QR
```

### Tech Tasks
- [ ] Workshop management
- [ ] Booking system
- [ ] QR code generation

---

## SPRINT 23 (Semanas 45-46)
**Tema:** Tier Diamond
**Velocity:** 40 SP
**Objetivo:** Tier máximo + benefícios premium

### User Stories

#### US23.1: Tier Diamante (13 SP)
```
Como motorista veterano
Quero atingir tier Diamante
Para ter máximos benefícios

Critérios de Aceite:
- [ ] Requisitos: 12+ meses + 35 rides/week + rating > 4.7 + mentor
- [ ] Comissão: 10%
- [ ] Badge "Diamante" no perfil
- [ ] Acesso exclusivo a eventos
```

#### US23.2: Benefícios Diamante (8 SP)
```
Como motorista Diamante
Quero benefícios exclusivos
Para reconhecimento

Critérios de Aceite:
- [ ] Seguro de acidente (parceria)
- [ ] Prioridade em campanhas
- [ ] Convites para eventos VIP
- [ ] Desconto em plano de saúde (parceria)
```

### Tech Tasks
- [ ] Tier Diamond calculation
- [ ] Premium benefits logic

---

## SPRINT 24 (Semanas 47-48)
**Tema:** Analytics & BI
**Velocity:** 40 SP
**Objetivo:** Dashboards de negócio

### User Stories

#### US24.1: Dashboard Executivo (13 SP)
```
Como CEO/CFO
Quero ver métricas de negócio
Para tomar decisões

Critérios de Aceite:
- [ ] Metabase/Looker setup
- [ ] Dashboards:
  - GMV diário/semanal/mensal
  - Rides por hora
  - Motoristas ativos
  - Churn rate
  - Revenue por tier
  - CAC / LTV
```

#### US24.2: Dashboard Operacional (8 SP)
```
Como operations
Quero monitorar operação
Para agir rápido

Critérios de Aceite:
- [ ] Dashboard em tempo real:
  - Motoristas online agora
  - Rides em progresso
  - Tempo médio de matching
  - Taxa de cancelamento (hoje)
```

### Tech Tasks
- [ ] BI tool setup (Metabase)
- [ ] Data warehouse (optional)
- [ ] Automated reports

---

## SPRINT 25 (Semanas 49-50)
**Tema:** Pre-launch Prep
**Velocity:** 40 SP
**Objetivo:** Preparação para lançamento

### User Stories

#### US25.1: Onboarding Melhorado (8 SP)
```
Como novo usuário
Quero entender o app rapidamente
Para começar a usar

Critérios de Aceite:
- [ ] Tutorial interativo (motorista)
- [ ] Walkthrough (passageiro)
- [ ] Vídeos curtos (< 1min)
- [ ] Skip opcional
```

#### US25.2: Landing Page (8 SP)
```
Como visitante
Quero saber sobre o iBora
Para decidir usar

Critérios de Aceite:
- [ ] Landing page:
  - Proposta de valor clara
  - Comparação vs Uber/99
  - Cadastro motorista
  - Download app
- [ ] SEO básico
- [ ] Google Analytics
```

#### US25.3: Stress Testing (13 SP)
```
Como DevOps
Quero garantir que sistema aguenta carga
Para lançar com confiança

Critérios de Aceite:
- [ ] Testes de carga: K6 ou Locust
- [ ] Simular: 100 rides simultâneas
- [ ] Latência: p95 < 1s
- [ ] Sem crashes
- [ ] Plano de scale-up
```

### Tech Tasks
- [ ] Onboarding UI
- [ ] Landing page
- [ ] Load testing
- [ ] Capacity planning

---

## SPRINT 26 (Semanas 51-52)
**Tema:** Launch!
**Velocity:** 30 SP (conservador)
**Objetivo:** Lançamento cidade piloto

### User Stories

#### US26.1: Marketing de Lançamento (8 SP)
```
Como marketing
Quero recrutar motoristas
Para ter oferta no lançamento

Critérios de Aceite:
- [ ] Meta: 50 motoristas cadastrados
- [ ] Campanha:
  - Anúncios locais (Google/Facebook)
  - Outdoors em pontos estratégicos
  - Boca-a-boca (referral)
- [ ] Incentivo: 0% comissão por 30 dias
```

#### US26.2: Soft Launch (8 SP)
```
Como produto
Quero lançar gradualmente
Para validar e ajustar

Critérios de Aceite:
- [ ] Semana 1: apenas motoristas convidados
- [ ] Semana 2: abrir cadastro (50 vagas)
- [ ] Semana 3: abrir para passageiros (100 vagas)
- [ ] Semana 4: abrir geral
- [ ] Monitorar: bugs, feedback, churn
```

#### US26.3: Monitoring 24/7 (8 SP)
```
Como DevOps
Quero monitorar 24/7
Para resolver problemas imediatos

Critérios de Aceite:
- [ ] PagerDuty ou similar
- [ ] Alertas críticos: SMS para tech lead
- [ ] On-call rotation
- [ ] Runbook para incidentes comuns
```

### Tech Tasks
- [ ] Marketing campaigns
- [ ] Gradual rollout
- [ ] On-call setup
- [ ] Incident response plan

### Milestone: 🚀 LANÇAMENTO OFICIAL
```
✅ 50+ motoristas ativos
✅ 200+ passageiros cadastrados
✅ 100+ rides/semana
✅ Churn < 10%
✅ NPS motoristas > 60
✅ Sistema estável (uptime > 99%)
```

---

## 📊 RESUMO POR FASE

### FASE 1: MVP Core (Sprints 1-6)
**Entregas:**
- ✅ Auth e cadastro
- ✅ Matching geo-espacial
- ✅ Ride lifecycle completo
- ✅ Pagamento Pix/Cash
- ✅ Wallet motorista
- ✅ Repasse D+2

**Team:** 5 pessoas | **Duração:** 12 semanas

---

### FASE 2: Fidelização Tier 1 (Sprints 7-12)
**Entregas:**
- ✅ Sistema de tiers (Bronze/Prata/Ouro)
- ✅ Comissão dinâmica
- ✅ Campanhas e bônus
- ✅ Métricas e antichurn
- ✅ Parceria combustível
- ✅ Programa mentoria
- ✅ Garantia de renda

**Team:** 5 pessoas | **Duração:** 12 semanas

---

### FASE 3: Fidelização Tier 2 (Sprints 13-18)
**Entregas:**
- ✅ Pagamento cartão
- ✅ Sistema de avaliação justo
- ✅ Suporte humanizado
- ✅ Eventos e reconhecimento
- ✅ Crédito pré-pago
- ✅ Antifraude v1

**Team:** 5 pessoas | **Duração:** 12 semanas

---

### FASE 4: Escala e Otimização (Sprints 19-24)
**Entregas:**
- ✅ Performance optimization
- ✅ WebSocket scaling
- ✅ Driver Academy
- ✅ Parcerias manutenção
- ✅ Tier Diamante
- ✅ Analytics & BI

**Team:** 5 pessoas | **Duração:** 12 semanas

---

### FASE 5: Produção (Sprints 25-26)
**Entregas:**
- ✅ Onboarding melhorado
- ✅ Landing page
- ✅ Stress testing
- ✅ Marketing de lançamento
- ✅ Soft launch
- ✅ Lançamento oficial

**Team:** 5 pessoas | **Duração:** 4 semanas

---

## 🎯 KPIs POR SPRINT

| Sprint | Rides/Week | Motoristas | Passageiros | Churn | NPS |
|--------|------------|------------|-------------|-------|-----|
| 1-6    | 0 (dev)    | 0          | 0           | -     | -   |
| 7-12   | 0 (dev)    | 0          | 0           | -     | -   |
| 13-18  | 0 (dev)    | 0          | 0           | -     | -   |
| 19-24  | 0 (dev)    | 0          | 0           | -     | -   |
| 25     | 10 (beta)  | 10         | 20          | -     | -   |
| 26     | 100        | 50         | 200         | 8%    | 65  |
| +4w    | 300        | 100        | 600         | 7%    | 70  |
| +8w    | 600        | 150        | 1200        | 6%    | 72  |
| +12w   | 1000       | 200        | 2000        | 5%    | 75  |

---

## 🚨 RISCOS GERAIS

### Técnicos
1. **Race condition no matching** → Mitigar com locks
2. **GPS impreciso** → Filtros + Kalman filter
3. **Webhook duplicado** → Idempotency
4. **Latência em escala** → Cache + replicas

### Negócio
1. **Uber/99 baixam preços** → Diferenciação em fidelização
2. **Dificuldade recrutar motoristas** → Incentivos iniciais
3. **Churn alto** → Programa antichurn desde Sprint 9
4. **Fraude** → Antifraude desde Sprint 18

### Operacional
1. **Suporte insuficiente** → Contratar CS em Sprint 15
2. **Bugs em produção** → Monitoring 24/7 desde lançamento
3. **Feedback negativo** → NPS tracking contínuo

---

## 📅 CALENDÁRIO (2025)

```
Q1 (Jan-Mar): Sprints 1-6 (MVP Core)
Q2 (Abr-Jun): Sprints 7-12 (Fidelização Fase 1)
Q3 (Jul-Set): Sprints 13-18 (Fidelização Fase 2)
Q4 (Out-Dez): Sprints 19-26 (Escala + Lançamento)
```

**Lançamento previsto:** Dezembro 2025

---

## ✅ DEFINITION OF READY (DoR)

User Story está pronta para sprint se:
- [ ] Critérios de aceite claros
- [ ] Mockups disponíveis (se UI)
- [ ] Dependências identificadas
- [ ] Estimada pelo time (planning poker)
- [ ] Validada pelo PO

---

## 🎉 CONCLUSÃO

**26 sprints** = **52 semanas** = **12 meses**

Ao final:
- ✅ App completo e testado
- ✅ Sistema de fidelização robusto
- ✅ Infraestrutura escalável
- ✅ 200+ motoristas ativos
- ✅ 2.000+ passageiros
- ✅ 1.000 rides/semana
- ✅ Churn < 5%
- ✅ NPS > 75

**O iBora está pronto para crescer.** 🚀

---

**Documento criado em:** Dezembro 2024  
**Versão:** 1.0  
**Próxima revisão:** Após Sprint 6 (ajustar velocity)
