Você é um arquiteto de software sênior especializado em backends transacionais (marketplace + fintech), FastAPI, Postgres, Redis e pagamentos (Pix, cartão, cash).
Seu objetivo é produzir o Blueprint completo + especificação técnica para um sistema estilo Uber/99 (passageiro + motorista + admin), com foco extremo em:
- consistência transacional (atomicidade)
- idempotência
- concorrência (aceite único)
- ledger financeiro (append-only)
- pagamentos Pix Efí + cartão + dinheiro (cash)
- wallet do motorista com recarga pré-paga para usar o app
- settlement D+N: repasse ao motorista após N dias
- saque mínimo (>= 50,00) e regras antifraude

NÃO copie código. Gere documentação + pseudocódigo + diagramas + contratos API.

## 0) Stack e decisões
Backend:
- FastAPI (Python)
- PostgreSQL (modelo relacional)
- Redis (cache + locks + rate limiting + filas rápidas)
- WebSocket (tempo real para apps)
- Jobs (Arq/RQ/Celery) para: expiração, settlement D+N, reconciliação, notificações, antifraude, relatórios
- Storage para logs/auditoria (pode ser no próprio Postgres inicialmente)
- Autenticação JWT + refresh tokens

Pagamentos:
- Pix via Efí: Cob (imediata) + webhook
- Cartão: integração plugável (ex.: Pagar.me, Mercado Pago, Adyen, Stripe, etc.) — desenhar interface PaymentProvider para suportar múltiplos adquirentes.
- Dinheiro (cash): pagamento fora do sistema; registrar evento e conciliar.

## 1) Requisitos de negócio (principais)
A. Marketplace:
- Passageiro solicita corrida, motoristas próximos recebem oferta, 1 aceita (aceite único).
- Corrida tem lifecycle com estados e regras (máquina de estados).

B. Pagamentos suportados:
- Pix online (plataforma recebe)
- Cartão online (plataforma recebe)
- Dinheiro (passageiro paga motorista) -> sistema registra e aplica regras (taxa/comissão/ajustes)

C. Wallet / Financeiro:
- A plataforma controla um ledger (razão) com entradas imutáveis.
- O motorista tem:
  - Wallet/Earnings (ganhos a receber, liberados após D+N)
  - Wallet/Available (disponível após liberação)
  - Wallet/Locked (em hold, disputas, chargeback, ou D+N)
- Saque mínimo: >= 50,00 (configurável).
- Plataforma recebe do cliente via Pix/cartão, segura D+N e só libera a parte do motorista na data.

D. Recarga do motorista (pré-pago para usar o app):
- Motorista precisa ter “saldo de uso” (DriverCredit) para operar, com:
  - recarga via Pix/cartão
  - consumo por corrida (ou por diária/semanal/mensal)
  - bloqueio de aceitar corridas se saldo insuficiente
- A recarga é separada dos “ganhos” — são carteiras diferentes (crédito de uso vs earnings).

E. Administração:
- Tarifas (base, km, minuto, dinâmica opcional)
- Comissão da plataforma (% e/ou fixa)
- Regras D+N por cidade/categoria
- Cancelamento e multas
- Fraude e limites
- Logs de alterações (audit trail)

F. Compliance e segurança:
- Idempotência em endpoints críticos e webhooks
- Trilhas financeiras imutáveis
- Rate limiting e antifraude básico

## 2) Entregáveis obrigatórios (o que você deve gerar)
Gere um documento Markdown completo com:

### A) Modelo de Domínio e Banco (Postgres)
Liste entidades/tabelas com:
- colunas essenciais
- chaves primárias/estrangeiras
- índices
- constraints (unique, check)
- enum types (status)

Entidades mínimas:

Identidade:
- users (base), passengers, drivers, vehicles
- driver_documents (KYC básico), driver_status

Corridas:
- rides
- ride_offers
- ride_events (event-sourcing leve / histórico)
- driver_locations (última posição + histórico opcional)

Pagamentos:
- payment_intents
- payment_attempts
- pix_charges (efi)
- card_charges (provider)
- webhook_events (efi + cartão)

Financeiro (ledger):
- ledger_accounts (plataforma, motorista, passageiro opcional)
- financial_events (imutável, correlaciona com corrida/pagamento/payout)
- ledger_entries (credit/debit, append-only)
- holds (bloqueios D+N, disputa, chargeback)
- settlements (agenda de liberação D+N)

Wallet de uso (recarga):
- driver_credits (saldo atual DERIVADO ou materializado com trilha)
- driver_credit_events (topup, consumption, adjustment)

Payout:
- payout_requests
- payout_transfers (processamento)
- payout_events

Cash:
- cash_collections (registro de pagamento em dinheiro)
- cash_reconciliation (conciliação, se aplicável)

Admin/auditoria:
- admin_users
- audit_log (quem mudou tarifa, comissão, status)

### B) Máquina de estados da corrida (Mermaid)
Inclua:
- estados e transições permitidas
- guard conditions
- eventos emitidos em cada transição

Estados recomendados:
REQUESTED, SEARCHING, OFFERED, ACCEPTED, ARRIVING, STARTED, COMPLETED,
PAYMENT_PENDING, PAID,
CANCELED_BY_PASSENGER, CANCELED_BY_DRIVER, EXPIRED,
REFUNDED, DISPUTED

### C) Fluxos transacionais críticos (com pseudocódigo)
Obrigatório para cada fluxo:
- transação (Postgres) ou lock (Redis) e por quê
- idempotency key
- efeito no ledger
- eventos realtime emitidos
- compensações em falhas

Fluxos mínimos:
1) Criar corrida (POST /rides)
2) Criar ofertas para motoristas (dispatch)
3) Aceitar corrida (POST /rides/{id}/accept) — o mais crítico (aceite único)
4) Cancelar corrida (passageiro/motorista) e regras de taxa/multa
5) Iniciar e finalizar corrida (start/complete) com validação
6) Gerar cobrança Pix Efí (create cob) e retornar QR/copia-e-cola
7) Webhook Pix Efí (confirmado) com deduplicação
8) Cobrança cartão (authorize/capture) + webhook/retorno do provider (plugável)
9) Pagamento em dinheiro (cash): registrar, calcular comissão, criar obrigações
10) Ledger: lançar comissão, ganhos do motorista, e aplicar D+N hold
11) Settlement D+N (job): liberar saldo do motorista na data
12) Payout (saque): criar solicitação, validar mínimo >= 50, aplicar taxas, gerar transferência, atualizar ledger
13) Recarga do motorista: criar topup Pix/cartão, confirmar, creditar DriverCredit
14) Consumo de crédito do motorista por corrida (ou diária): debitar DriverCredit transacionalmente (antes de aceitar ou ao completar — definir regra)

### D) Regras D+N (settlement)
Defina:
- N configurável por cidade/categoria
- Quando a corrida vira elegível para settlement (ex.: após PAID e sem disputa)
- Como o hold é representado (tabela holds + settlements schedule)
- Job diário: liberar entries de LOCKED -> AVAILABLE via novo ledger entry (não altere saldo direto)

### E) Wallet do motorista: 3 buckets + separação do “crédito de uso”
Defina claramente:
- Earnings (ganhos por corrida) + holds D+N
- Available (liberado para saque)
- Locked (D+N, disputas, chargeback)
Separado de:
- DriverCredit (crédito pré-pago para usar app)

Explique:
- Por que separar (evita misturar custo operacional com ganhos)
- Como impedir aceitar corrida com DriverCredit insuficiente

### F) Pagamentos: abstração PaymentProvider
Crie uma interface (conceitual) com:
- create_charge
- get_status
- refund
- handle_webhook
- idempotency support
Explique como implementar:
- EfiPixProvider (Pix Cob + webhook)
- CardProvider genérico (pode ser Pagar.me/MercadoPago etc.)

### G) Segurança, idempotência e antifraude básico
Regras obrigatórias:
- Idempotency keys em accept/cancel/payment webhook/payout
- WebhookEvent store + dedup (por event_id/txid/e2eid)
- Rate limit (login, request ride, accept)
- Proteções:
  - motorista não aceita 2 corridas simultâneas
  - passageiro não cria 20 corridas em 1 minuto
  - bloqueio se chargeback/disputa
  - limite de saque diário/semana (configurável)

### H) Eventos realtime (WebSocket)
Defina eventos e payloads:
- ride.offered, ride.accepted, ride.started, ride.completed, ride.canceled
- driver.location.updated
- payment.qr.generated, payment.confirmed, payment.failed
- wallet.updated, payout.status.changed
Defina autorização por canal (passageiro só vê sua corrida, motorista só suas corridas).

### I) Contratos API (FastAPI) com schemas Pydantic (apenas campos)
Liste endpoints e payloads:
Auth:
- POST /auth/register, /auth/login, /auth/refresh
Passenger:
- POST /rides
- GET /rides/{id}
- POST /rides/{id}/cancel
- POST /payments/intent (Pix/cartão)
Driver:
- POST /drivers/location
- POST /rides/{id}/accept
- POST /rides/{id}/start
- POST /rides/{id}/complete
- GET /drivers/wallet
- POST /drivers/topup (recarga)
- POST /payouts/request
Admin:
- CRUD tarifas, comissões, N (D+N), usuários, bloqueios
Webhooks:
- POST /webhooks/efi/pix
- POST /webhooks/cards/{provider}

### J) Observabilidade e auditoria
- audit_log para ações admin (tarifa, comissão, N, banimentos)
- logs estruturados com request_id/correlation_id
- métricas básicas: dupla aceitação, retries de webhook, tempo médio aceite, chargeback rate

### K) Roadmap incremental (produção real)
Fase 1 (MVP seguro): rides + accept transacional + Pix + ledger + D+N básico + cash registro
Fase 2: cartão + payout + recarga + antifraude básico + auditoria admin
Fase 3: disputas/chargeback + limites + reconciliação + relatórios
Fase 4: escala (fila/eventos, particionamento, tracing)

## 3) Restrições
- Não copiar código.
- Produzir pseudocódigo para endpoints críticos: accept ride, pix webhook confirm, settlement D+N, payout request, topup confirm.
- Sempre indicar transações/locks e invariantes.
- Seja pragmático e pronto para implementação.

Comece agora e priorize:
1) Modelo financeiro (ledger + D+N + payout + topup)
2) Accept ride transacional
3) Integração Efí Pix + webhook idempotente
Depois complete o restante.
