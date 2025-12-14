Você é um arquiteto de software sênior (backend FastAPI + sistemas transacionais + pagamentos Pix).
Seu trabalho é analisar repositórios open-source locais (Traccar, Kill Bill/Fineract, OTP opcional) para extrair:
- padrões de eventos/histórico
- padrões de controle transacional
- padrões de ledger financeiro e idempotência

Você NÃO deve copiar código dos repos. Você deve produzir documentação e pseudocódigo.

## 0) Contexto do meu produto
Estou criando um app estilo Uber/99 (passageiro e motorista) com backend em:
- FastAPI (Python)
- PostgreSQL
- Redis
- WebSocket (ou SSE) para tempo real
- Jobs (Celery/RQ/Arq) para tarefas (expiração, reconciliação)

Pagamentos via Efí (Pix):
- Pix Cob (cobrança imediata)
- Webhook para confirmação de pagamento
- Ambiente sandbox/homologação e produção
Referência conceitual: endpoints de Cobranças imediatas (Pix Cob) e gestão de webhooks na documentação Efí.
Obs: webhook pode disparar quando a cobrança é paga, e expiração deve ser tratada pelo meu sistema (job/timeout).

## 1) Repositórios disponíveis (já clonados)
- TRACCAR_REPO: repo/traccar
- KILLBILL_REPO: repo/killbill e FINERACT_REPO: repo/fineract
- OPENTRIPPLANNER_REPO: repo/OpenTripPlanner-dev-2.x
- SOCKET.IO: repo/socket.io
- DELIVERY/MARKETPLACE: repo/spree

Se algum não existir, ignore.

## 2) Objetivo final (entregáveis)
Gere um documento Markdown completo com:

### A) Modelo de domínio (mobilidade + financeiro)
Entidades mínimas:
- Passenger, Driver, Vehicle
- Ride (corrida)
- RideOffer (oferta para motoristas)
- LocationUpdate (rastreamento)
- PaymentIntent (intenção de pagamento)
- PixCharge (espelho da cobrança Efí)
- WebhookEvent (registro de webhooks recebidos)
- LedgerAccount, LedgerEntry, FinancialEvent
- Payout (repasse motorista)
- Refund/Dispute (modelo mínimo)
Para cada entidade: campos essenciais, chaves, índices, relacionamentos.

### B) Invariantes (regras que nunca podem quebrar)
Exemplos obrigatórios:
- Uma Ride só pode ter 1 Driver “ACEITO” ativo
- Um PaymentIntent tem no máximo 1 confirmação efetiva (idempotência)
- LedgerEntry é imutável (append-only)
- Payout nunca pode exceder saldo disponível do driver (saldo derivado do ledger)
- WebhookEvent nunca pode aplicar o mesmo efeito duas vezes

### C) Máquina de estados da corrida (Mermaid)
Estados recomendados:
REQUESTED -> SEARCHING -> OFFERED -> ACCEPTED -> ARRIVING -> STARTED -> COMPLETED -> PAYMENT_PENDING -> PAID
E finais alternativos:
CANCELED, EXPIRED, REFUNDED, DISPUTED
Inclua guard conditions e eventos de transição.

### D) Controle transacional do “Accept Ride” (o ponto crítico)
Descreva 3 abordagens e escolha uma:
1) PostgreSQL transaction + SELECT ... FOR UPDATE
2) Otimista (version column) + retry
3) Redis mutex + verificação no banco

Entregue:
- Pseudocódigo do endpoint /rides/{ride_id}/accept
- Esquema de dados mínimo para garantir “aceite único”
- Estratégia de idempotência (AcceptIdempotencyKey) para caso de retry (mobile / rede ruim)
- Como emitir eventos realtime: ride.accepted

### E) Pix Efí: criação de cobrança + confirmação via webhook (transacional)
Desenhe o fluxo “Pix Cob” (cobrança imediata):
1) Criar PaymentIntent (PENDING)
2) Criar PixCharge via Efí (registrar txid, valor, expiração)
3) Retornar ao app: QR Code / copia e cola (payload)
4) Receber webhook de pagamento confirmado
5) Aplicar efeito financeiro via ledger (com idempotência)
6) Marcar corrida como PAID (após confirmação)
7) Disparar eventos para apps (payment.confirmed, ride.paid)

Inclua:
- Pseudocódigo do handler /webhooks/efi/pix
- Persistência do webhook (WebhookEvent)
- Deduplicação por txid / e2eId / hash do evento
- Validação de autenticidade (assinatura / mTLS, conforme práticas do gateway)
- Regras de expiração: como marcar cobranças expiradas (job), dado que webhook pode não disparar em expiração.

### F) Ledger financeiro (inspirado em Kill Bill/Fineract)
Especifique tabelas mínimas:
- ledger_accounts (plataforma, motorista, passageiro opcional)
- financial_events (ride_completed, payment_confirmed, payout_created, refund_created)
- ledger_entries (credit/debit, amount, currency, event_id, immutable)
- payouts (driver_id, amount, status, created_at, settled_at)
Regras:
- saldo é calculado por soma de entries
- entradas são imutáveis
- reconciliação simples com PixCharge (pago vs não pago)

### G) Comissão e repasse (payout)
Modelo:
- comissão plataforma (% ou fixa)
- “hold” antes de liberar payout (ex.: 24h ou até status “finalizado sem disputa”)
- endpoint de payout e job de settlement
Inclua invariantes e falhas (ex.: estorno/disputa).

### H) Eventos e tempo real (inspirado em Traccar)
Defina tópicos/eventos:
ride.created, ride.offered, ride.accepted, ride.started, ride.completed, ride.canceled
driver.location.updated
payment.intent.created, pix.charge.created, payment.confirmed
ledger.entry.created
payout.created, payout.settled
Defina payload mínimo e quem assina/autoriza.

### I) API FastAPI (contratos)
Liste endpoints mínimos:
- POST /rides
- POST /rides/{id}/offers (interno)
- POST /rides/{id}/accept
- POST /rides/{id}/cancel
- POST /rides/{id}/start
- POST /rides/{id}/complete
- POST /payments/intent (gera Pix)
- POST /webhooks/efi/pix
- GET /drivers/{id}/balance
- POST /payouts (solicitar)
Inclua schemas Pydantic (apenas campos, sem código completo).

### J) Observabilidade mínima
- logs estruturados com request_id
- audit trail de mudanças administrativas (tarifa/comissão)
- métricas: duplicidade de webhooks, tempo de aceite, falhas de pagamento

### K) Roadmap incremental (4 fases)
Fase 1: MVP seguro (aceite transacional + Pix Cob + ledger mínimo)
Fase 2: payout + auditoria + cancelamento robusto
Fase 3: antifraude e limites
Fase 4: escala (fila/eventos + particionamento + tracing)

## 3) Restrições
- Não copiar código dos repos.
- Pseudocódigo e diagramas Mermaid são obrigatórios.
- Seja pragmático: descreva como implementar em FastAPI/Postgres/Redis.
- Sempre indicar os pontos de consistência (atomicidade, idempotência, retries, compensações).

Comece agora. Priorize os itens D e E (Accept Ride e Webhook Pix).
