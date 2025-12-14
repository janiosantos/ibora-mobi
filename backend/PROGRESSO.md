# PROGRESSO - Backend App Estilo Uber/99

**Data de Início:** 14/12/2024
**Branch de Desenvolvimento:** `claude/uber-style-backend-XeHsb`

---

## 📋 STATUS GERAL DO PROJETO

**Status Atual:** 🟢 EM PROGRESSO - Fase de Documentação de Arquitetura

---

## ✅ TAREFAS CONCLUÍDAS

### Sessão 1 - Inicialização do Projeto (14/12/2024)

#### 1.1 - Setup Inicial
- ✅ Estrutura de pastas verificada
- ✅ Arquivo PROMPT.md lido e compreendido
- ✅ Sistema de controle de progresso estabelecido (PROGRESSO.md)
- ✅ Branch de desenvolvimento configurada: `claude/uber-style-backend-XeHsb`

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

**Documento gerado:** `00-ANALISE-REPOSITORIOS.md`

---

## 🚧 TAREFA EM ANDAMENTO

**Próximo:** Criar documentação detalhada dos itens D e E (prioridades do PROMPT.md)

---

## 📝 PRÓXIMAS TAREFAS (Planejadas)

### Fase 1: Análise e Documentação de Arquitetura

1. **Análise dos Repositórios de Referência**
   - Analisar Traccar: padrões de eventos e rastreamento
   - Analisar Kill Bill/Fineract: controle transacional, ledger, idempotência
   - Extrair padrões relevantes (NÃO copiar código)

2. **Documentação Prioritária (Conforme PROMPT.md)**
   - **Item D (PRIORIDADE 1):** Controle transacional do "Accept Ride"
     - 3 abordagens de concorrência
     - Pseudocódigo do endpoint /rides/{id}/accept
     - Estratégia de idempotência
     - Eventos realtime

   - **Item E (PRIORIDADE 1):** Pix Efí - Cobrança + Webhook
     - Fluxo completo de pagamento Pix Cob
     - Handler de webhook transacional
     - Deduplicação e validação
     - Controle de expiração

3. **Documentação Completa de Arquitetura**
   - Item A: Modelo de domínio (entidades, relacionamentos)
   - Item B: Invariantes do sistema
   - Item C: Máquina de estados da corrida (Mermaid)
   - Item F: Ledger financeiro
   - Item G: Comissão e repasse (payout)
   - Item H: Eventos e tempo real
   - Item I: Contratos API FastAPI
   - Item J: Observabilidade
   - Item K: Roadmap incremental (4 fases)

---

## 🎯 OBJETIVOS DO PROJETO

### Stack Tecnológica
- **Backend:** FastAPI (Python)
- **Banco de Dados:** PostgreSQL
- **Cache/Session:** Redis
- **Real-time:** WebSocket ou SSE
- **Jobs:** Celery/RQ/Arq
- **Pagamentos:** Efí (Pix Cob)

### Funcionalidades Core
1. Sistema de corridas (Ride matching)
2. Rastreamento em tempo real
3. Pagamentos via Pix com webhook
4. Ledger financeiro
5. Sistema de repasse para motoristas
6. Eventos em tempo real

### Requisitos Não-Funcionais
- Controle transacional rigoroso (accept ride único)
- Idempotência em pagamentos e webhooks
- Ledger imutável (append-only)
- Auditoria completa
- Observabilidade (logs estruturados, métricas)

---

## 📚 DOCUMENTOS GERADOS

1. **PROGRESSO.md** - Sistema de controle de progresso
2. **00-ANALISE-REPOSITORIOS.md** - Consolidação de insights dos repositórios de referência
   - Padrões de Traccar (eventos, tempo real)
   - Padrões de Kill Bill (transacional, idempotência)
   - Padrões de Fineract (ledger, auditoria)
   - Decisões de arquitetura derivadas
   - Checklist de implementação

---

## 🔄 HISTÓRICO DE COMMITS

1. **591e5e12** - 📝 Inicialização do projeto - Sistema de controle de progresso

---

## 📌 NOTAS IMPORTANTES

1. **Princípio:** NÃO copiar código dos repos de referência - apenas extrair padrões
2. **Formato:** Documentação em Markdown + Pseudocódigo + Diagramas Mermaid
3. **Foco:** Consistência, atomicidade, idempotência, retries, compensações
4. **Prioridade:** Itens D (Accept Ride) e E (Pix Webhook) primeiro

---

## 🐛 PROBLEMAS CONHECIDOS

*Nenhum problema identificado ainda.*

---

## 💡 DECISÕES DE ARQUITETURA

### Controle Transacional - Accept Ride
**Abordagem escolhida:** Híbrida (PostgreSQL SELECT FOR UPDATE + Redis Lock)
- Lock distribuído via Redis (previne contenção)
- Lock pessimista no banco (garante consistência)
- Idempotency Key obrigatória em todas requisições
- Eventos atômicos (mesma transação)

### Pagamentos Pix
**Estratégia:** Webhook transacional + Janitor
- Persistir todos webhooks recebidos
- Deduplicação por txid + e2eId
- Aplicar efeito financeiro atomicamente
- Job de reconciliação para webhooks perdidos
- Job de expiração para cobranças não pagas

### Ledger Financeiro
**Modelo:** Double-Entry Bookkeeping (inspirado em Fineract)
- Journal entries imutáveis
- Reversões via novos registros invertidos
- Running balance calculado assincronamente
- Tabelas de histórico para auditoria
- Chart of Accounts específico para mobilidade

### Tempo Real
**Arquitetura:** WebSocket + Redis Pub/Sub
- Pipeline de processamento de eventos
- Cache apenas de corridas ativas
- Broadcast via Redis para múltiplas instâncias
- Event detection baseado em transições de estado

---

**Última Atualização:** 14/12/2024 - Análise de repositórios concluída
**Próximo Passo:** Criar documentação detalhada dos itens D (Accept Ride) e E (Pix Webhook)
