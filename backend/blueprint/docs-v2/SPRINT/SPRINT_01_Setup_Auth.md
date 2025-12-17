# SPRINT 1 — SETUP + AUTH

**Período:** Semanas 1-2  
**Duração:** 10 dias úteis  
**Time:** Tech Lead + 2 Backend + 2 Mobile + 1 Designer  
**Objetivo:** Fundação técnica + Autenticação funcional

---

## 🎯 OBJETIVOS DO SPRINT

### Objetivo Principal
Estabelecer a fundação técnica do projeto e implementar autenticação completa (backend + mobile) para passageiros e motoristas.

### Objetivos Específicos
1. ✅ Repositórios configurados (backend + mobile)
2. ✅ CI/CD básico funcionando
3. ✅ Ambientes de desenvolvimento configurados
4. ✅ Autenticação via SMS operacional
5. ✅ Login/Cadastro funcional no app mobile
6. ✅ Design system básico implementado

---

## 📋 BACKLOG DO SPRINT

### EPIC 1: Setup de Infraestrutura

#### **US-001: Setup Backend**
**Como** Tech Lead  
**Quero** configurar o projeto backend  
**Para** que o time possa começar a desenvolver

**Critérios de Aceitação:**
- [ ] Repositório Git criado e configurado
- [ ] Estrutura de pastas definida (app/, tests/, migrations/)
- [ ] FastAPI instalado e rodando "Hello World"
- [ ] PostgreSQL rodando via Docker Compose
- [ ] Redis rodando via Docker Compose
- [ ] .env.example criado com variáveis necessárias
- [ ] README.md com instruções de setup

**Tasks:**
```
├─ Criar repositório no GitHub
├─ Inicializar projeto Python (pyproject.toml)
├─ Instalar FastAPI + Uvicorn
├─ Criar docker-compose.yml
├─ Configurar PostgreSQL (database: ibora_dev)
├─ Configurar Redis
├─ Criar estrutura de pastas
├─ Criar .env.example
└─ Documentar setup no README
```

**Estimativa:** 8 story points  
**Responsável:** Tech Lead  
**Tempo:** 1 dia

---

#### **US-002: Setup Mobile**
**Como** Mobile Lead  
**Quero** configurar o projeto mobile  
**Para** que o time possa desenvolver os apps iOS/Android

**Critérios de Aceitação:**
- [ ] Repositório Git criado
- [ ] React Native inicializado
- [ ] Rodando em iOS simulator
- [ ] Rodando em Android emulator
- [ ] React Navigation configurado
- [ ] Redux Toolkit configurado
- [ ] Axios configurado (API client)
- [ ] README.md com instruções

**Tasks:**
```
├─ Criar repositório no GitHub
├─ npx react-native init iBora
├─ Instalar dependências (navigation, redux, axios)
├─ Configurar estrutura de pastas (src/, screens/, components/)
├─ Testar em iOS simulator
├─ Testar em Android emulator
├─ Configurar environment variables
└─ Documentar setup no README
```

**Estimativa:** 8 story points  
**Responsável:** Mobile Lead  
**Tempo:** 1 dia

---

#### **US-003: CI/CD Pipeline**
**Como** Tech Lead  
**Quero** pipeline de CI/CD básico  
**Para** garantir qualidade e facilitar deploys

**Critérios de Aceitação:**
- [ ] GitHub Actions configurado (backend)
- [ ] Tests rodam no PR
- [ ] Linter roda no PR
- [ ] Deploy staging automático (main branch)
- [ ] Notificação Slack em falhas

**Tasks:**
```
├─ Criar .github/workflows/backend.yml
├─ Configurar job de tests (pytest)
├─ Configurar job de lint (ruff)
├─ Configurar deploy para staging (AWS/GCP)
├─ Integrar notificações Slack
└─ Testar pipeline completo
```

**Estimativa:** 5 story points  
**Responsável:** Tech Lead  
**Tempo:** 0.5 dia

---

### EPIC 2: Autenticação Backend

#### **US-004: Modelo de Dados de Usuários**
**Como** Backend Dev  
**Quero** criar schema de usuários  
**Para** armazenar dados de passageiros e motoristas

**Schema:**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL, -- PASSENGER | DRIVER
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE | SUSPENDED | BLOCKED
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_type ON users(type);
```

**Critérios de Aceitação:**
- [ ] Migration criada (Alembic)
- [ ] Tabela users no PostgreSQL
- [ ] Indexes criados
- [ ] Model Pydantic criado (User)
- [ ] CRUD básico funcional

**Tasks:**
```
├─ Configurar Alembic
├─ Criar migration inicial
├─ Criar models/user.py (SQLAlchemy)
├─ Criar schemas/user.py (Pydantic)
├─ Criar crud/user.py (create, get, update)
└─ Testes unitários (test_user_crud.py)
```

**Estimativa:** 5 story points  
**Responsável:** Backend Dev 1  
**Tempo:** 0.5 dia

---

#### **US-005: Integração SMS (Twilio)**
**Como** Backend Dev  
**Quero** enviar SMS de verificação  
**Para** validar telefone do usuário

**Critérios de Aceitação:**
- [ ] Integração Twilio configurada
- [ ] Endpoint POST /auth/send-code funcional
- [ ] Código gerado (6 dígitos)
- [ ] SMS enviado com sucesso
- [ ] Código armazenado (Redis, TTL 5min)
- [ ] Rate limit: 1 SMS por telefone a cada 60s

**Tasks:**
```
├─ Instalar twilio SDK
├─ Configurar credenciais (env vars)
├─ Criar services/sms.py
├─ Criar endpoint POST /auth/send-code
├─ Gerar código (6 dígitos aleatórios)
├─ Armazenar no Redis (key: phone:code, TTL: 300s)
├─ Enviar SMS via Twilio
├─ Implementar rate limiting
└─ Testes (mock Twilio)
```

**Estimativa:** 8 story points  
**Responsável:** Backend Dev 1  
**Tempo:** 1 dia

---

#### **US-006: Verificação de Código SMS**
**Como** Backend Dev  
**Quero** validar código SMS  
**Para** confirmar identidade do usuário

**Critérios de Aceitação:**
- [ ] Endpoint POST /auth/verify-code funcional
- [ ] Código validado contra Redis
- [ ] Se válido: criar/buscar usuário
- [ ] Se válido: gerar JWT token
- [ ] Se inválido: retornar 401
- [ ] Código usado é deletado do Redis

**Tasks:**
```
├─ Criar endpoint POST /auth/verify-code
├─ Buscar código no Redis (key: phone:code)
├─ Validar código informado
├─ Se válido: criar usuário (se não existe)
├─ Se válido: gerar access_token + refresh_token
├─ Deletar código do Redis
├─ Retornar tokens + user info
└─ Testes (cenários válido/inválido)
```

**Estimativa:** 8 story points  
**Responsável:** Backend Dev 2  
**Tempo:** 1 dia

---

#### **US-007: JWT Tokens**
**Como** Backend Dev  
**Quero** sistema de autenticação JWT  
**Para** proteger endpoints

**Critérios de Aceitação:**
- [ ] Access token (1h expiração)
- [ ] Refresh token (30 dias expiração)
- [ ] Tokens assinados com RS256
- [ ] Middleware de autenticação funcional
- [ ] Endpoint GET /auth/me retorna user autenticado
- [ ] Endpoint POST /auth/refresh gera novo access token

**Tasks:**
```
├─ Instalar PyJWT
├─ Gerar chaves RSA (private + public)
├─ Criar services/jwt.py
├─ Implementar create_access_token()
├─ Implementar create_refresh_token()
├─ Implementar verify_token()
├─ Criar middleware de autenticação
├─ Criar endpoint GET /auth/me
├─ Criar endpoint POST /auth/refresh
└─ Testes (token válido, expirado, inválido)
```

**Estimativa:** 13 story points  
**Responsável:** Backend Dev 2  
**Tempo:** 1.5 dia

---

### EPIC 3: Autenticação Mobile

#### **US-008: Telas de Login/Cadastro**
**Como** Designer  
**Quero** telas de login/cadastro  
**Para** usuários se autenticarem

**Entregas:**
- [ ] Tela: Welcome (splash)
- [ ] Tela: Tipo de usuário (Passageiro / Motorista)
- [ ] Tela: Input telefone
- [ ] Tela: Input código SMS
- [ ] Tela: Input nome (primeiro acesso)
- [ ] Componentes reutilizáveis (Button, Input)

**Figma:**
```
├─ WelcomeScreen.fig
├─ UserTypeScreen.fig
├─ PhoneInputScreen.fig
├─ CodeInputScreen.fig
├─ NameInputScreen.fig
└─ Components.fig (Button, TextInput)
```

**Estimativa:** 5 story points  
**Responsável:** Designer  
**Tempo:** 1 dia

---

#### **US-009: Implementar Fluxo de Auth (Mobile)**
**Como** Mobile Dev  
**Quero** implementar fluxo de autenticação  
**Para** usuários fazerem login

**Critérios de Aceitação:**
- [ ] Tela Welcome implementada
- [ ] Tela UserType implementada
- [ ] Tela PhoneInput implementada
- [ ] Tela CodeInput implementada
- [ ] Tela NameInput implementada (se primeiro acesso)
- [ ] Navegação entre telas funcional
- [ ] Integração com API (/auth/send-code, /auth/verify-code)
- [ ] Tokens salvos (AsyncStorage)
- [ ] Redirecionamento para home após login

**Tasks:**
```
├─ Criar screens/auth/WelcomeScreen.tsx
├─ Criar screens/auth/UserTypeScreen.tsx
├─ Criar screens/auth/PhoneInputScreen.tsx
├─ Criar screens/auth/CodeInputScreen.tsx
├─ Criar screens/auth/NameInputScreen.tsx
├─ Criar components/Button.tsx
├─ Criar components/TextInput.tsx
├─ Configurar navegação (Stack Navigator)
├─ Criar services/api.ts (axios)
├─ Implementar sendCode() API call
├─ Implementar verifyCode() API call
├─ Salvar tokens no AsyncStorage
├─ Criar context/AuthContext.tsx
└─ Testes (fluxo completo)
```

**Estimativa:** 13 story points  
**Responsável:** Mobile Dev 1 + Mobile Dev 2  
**Tempo:** 2 dias

---

#### **US-010: Persistência de Sessão**
**Como** Mobile Dev  
**Quero** usuário permanecer logado  
**Para** não precisar fazer login toda vez

**Critérios de Aceitação:**
- [ ] Tokens salvos em AsyncStorage
- [ ] Ao abrir app: verificar se token existe
- [ ] Se existe e válido: ir para home
- [ ] Se existe e expirado: tentar refresh
- [ ] Se refresh falha: ir para login
- [ ] Botão "Sair" limpa tokens

**Tasks:**
```
├─ Implementar saveTokens() (AsyncStorage)
├─ Implementar getTokens() (AsyncStorage)
├─ Implementar clearTokens() (AsyncStorage)
├─ Criar utils/checkAuth.ts
├─ Implementar auto-refresh (interceptor axios)
├─ Tela de loading inicial (verificando auth)
├─ Implementar logout()
└─ Testes
```

**Estimativa:** 8 story points  
**Responsável:** Mobile Dev 1  
**Tempo:** 1 dia

---

### EPIC 4: Design System Básico

#### **US-011: Design System (Cores, Tipografia, Espaçamentos)**
**Como** Designer  
**Quero** design system básico  
**Para** garantir consistência visual

**Entregas:**
- [ ] Paleta de cores definida
- [ ] Tipografia (fontes, tamanhos)
- [ ] Espaçamentos (4, 8, 16, 24, 32, 48px)
- [ ] Componentes básicos (Button, Input, Card)
- [ ] Documentação (Figma + código)

**Paleta de Cores:**
```
Primary: #FF6B00 (laranja vibrante)
Secondary: #1E1E1E (cinza escuro)
Success: #00C853 (verde)
Error: #D32F2F (vermelho)
Background: #FFFFFF (branco)
Surface: #F5F5F5 (cinza claro)
Text Primary: #212121 (quase preto)
Text Secondary: #757575 (cinza médio)
```

**Tipografia:**
```
Font Family: Inter (fallback: System)
Heading 1: 32px, Bold
Heading 2: 24px, SemiBold
Heading 3: 18px, SemiBold
Body: 16px, Regular
Caption: 14px, Regular
```

**Tasks:**
```
├─ Definir paleta de cores (Figma)
├─ Criar theme.ts (React Native)
├─ Instalar fonte Inter
├─ Criar components/Button.tsx (variants: primary, secondary, outline)
├─ Criar components/TextInput.tsx
├─ Criar components/Card.tsx
├─ Documentar no Storybook (opcional)
└─ Exportar assets (ícones, logos)
```

**Estimativa:** 8 story points  
**Responsável:** Designer + Mobile Dev 2  
**Tempo:** 1 dia

---

## 🧪 TESTES (DEFINITION OF DONE)

### Backend
```
✅ Testes unitários (cobertura ≥ 80%)
├─ test_user_crud.py
├─ test_sms_service.py
├─ test_auth_endpoints.py
└─ test_jwt_tokens.py

✅ Testes de integração
├─ test_auth_flow.py (end-to-end)
└─ test_rate_limiting.py

✅ Linter passou (ruff)
✅ Type checking passou (mypy)
```

### Mobile
```
✅ Testes de componentes (Jest + React Testing Library)
├─ Button.test.tsx
├─ TextInput.test.tsx
└─ AuthFlow.test.tsx

✅ Testes de navegação
└─ AuthNavigator.test.tsx

✅ App compila (iOS + Android)
✅ ESLint passou
```

---

## 📊 CRITÉRIOS DE ACEITAÇÃO DO SPRINT

### Must Have (Obrigatório)
- [x] Backend rodando localmente
- [x] Mobile rodando em simulador/emulator
- [x] Usuário consegue fazer cadastro
- [x] Usuário consegue fazer login
- [x] SMS de verificação funciona
- [x] Tokens JWT funcionam
- [x] CI/CD básico configurado

### Should Have (Importante)
- [x] Design system básico
- [x] Persistência de sessão
- [x] Testes automatizados (≥ 70% cobertura)

### Could Have (Desejável)
- [ ] Documentação API (Swagger)
- [ ] Storybook (componentes mobile)
- [ ] Analytics básico (Firebase)

### Won't Have (Fora do Escopo)
- ❌ Recuperação de senha
- ❌ Login social (Google, Apple)
- ❌ Biometria
- ❌ Multi-idioma

---

## 🚧 RISCOS E MITIGAÇÕES

### Risco 1: Twilio API Rate Limits
**Probabilidade:** Média  
**Impacto:** Alto  
**Mitigação:**
- Ambiente de dev: usar código fixo "123456" (bypass SMS)
- Implementar queue (se muitos cadastros simultâneos)
- Monitorar usage Twilio dashboard

### Risco 2: Problemas com React Native (iOS/Android)
**Probabilidade:** Alta (setup inicial sempre tem problemas)  
**Impacto:** Médio  
**Mitigação:**
- Usar versão stable do React Native (0.72+)
- Seguir documentação oficial à risca
- Ter Mac disponível (para build iOS)
- Time mobile experiente

### Risco 3: CI/CD não funciona no primeiro deploy
**Probabilidade:** Alta  
**Impacto:** Baixo  
**Mitigação:**
- Testar localmente antes de commitar
- Deploy manual como fallback
- Iterar sobre pipeline (não precisa ser perfeito no Sprint 1)

---

## 📅 CRONOGRAMA DETALHADO

### Segunda-feira (Dia 1)
```
Tech Lead:
├─ 09:00-10:00: Sprint Planning
├─ 10:00-12:00: Setup backend (US-001)
├─ 14:00-17:00: Setup backend (US-001)
└─ 17:00-18:00: Code review

Backend Dev 1:
├─ 09:00-10:00: Sprint Planning
├─ 10:00-12:00: Apoio setup
├─ 14:00-17:00: Modelo de dados (US-004)
└─ 17:00-18:00: Testes

Backend Dev 2:
├─ 09:00-10:00: Sprint Planning
├─ 10:00-12:00: Apoio setup
├─ 14:00-17:00: Estudo JWT
└─ 17:00-18:00: Planning JWT (US-007)

Mobile Dev 1:
├─ 09:00-10:00: Sprint Planning
├─ 10:00-12:00: Setup mobile (US-002)
├─ 14:00-17:00: Setup mobile (US-002)
└─ 17:00-18:00: Testes simuladores

Mobile Dev 2:
├─ 09:00-10:00: Sprint Planning
├─ 10:00-12:00: Apoio setup
├─ 14:00-17:00: Estrutura de pastas
└─ 17:00-18:00: Code review

Designer:
├─ 09:00-10:00: Sprint Planning
├─ 10:00-12:00: Design system (cores, tipografia)
├─ 14:00-17:00: Telas de auth (Figma)
└─ 17:00-18:00: Review com time
```

---

### Terça-feira (Dia 2)
```
Tech Lead:
├─ 09:00-09:15: Daily standup
├─ 09:15-12:00: CI/CD pipeline (US-003)
├─ 14:00-17:00: Finalizar CI/CD
└─ 17:00-18:00: Deploy staging

Backend Dev 1:
├─ 09:00-09:15: Daily standup
├─ 09:15-12:00: Integração SMS (US-005)
├─ 14:00-17:00: Integração SMS (US-005)
└─ 17:00-18:00: Testes

Backend Dev 2:
├─ 09:00-09:15: Daily standup
├─ 09:15-12:00: JWT tokens (US-007)
├─ 14:00-17:00: JWT tokens (US-007)
└─ 17:00-18:00: Testes

Mobile Dev 1 + 2:
├─ 09:00-09:15: Daily standup
├─ 09:15-12:00: Componentes básicos (Button, Input)
├─ 14:00-17:00: Telas de auth (US-009)
└─ 17:00-18:00: Code review

Designer:
├─ 09:00-09:15: Daily standup
├─ 09:15-12:00: Finalizar telas Figma
├─ 14:00-17:00: Exportar assets
└─ 17:00-18:00: Handoff para devs
```

---

### Quarta-feira (Dia 3)
```
Backend Dev 1:
├─ 09:00-09:15: Daily standup
├─ 09:15-12:00: Verificação SMS (US-006)
├─ 14:00-17:00: Testes integração
└─ 17:00-18:00: Code review

Backend Dev 2:
├─ 09:00-09:15: Daily standup
├─ 09:15-12:00: Finalizar JWT (US-007)
├─ 14:00-17:00: Middleware autenticação
└─ 17:00-18:00: Documentação API

Mobile Dev 1 + 2:
├─ 09:00-09:15: Daily standup
├─ 09:15-12:00: Implementar fluxo auth (US-009)
├─ 14:00-17:00: Integração API
└─ 17:00-18:00: Testes
```

---

### Quinta-feira (Dia 4)
```
Mobile Dev 1:
├─ 09:00-09:15: Daily standup
├─ 09:15-12:00: Persistência sessão (US-010)
├─ 14:00-17:00: Auto-refresh tokens
└─ 17:00-18:00: Testes

Mobile Dev 2:
├─ 09:00-09:15: Daily standup
├─ 09:15-12:00: Polimento UI
├─ 14:00-17:00: Tratamento erros
└─ 17:00-18:00: Testes

Tech Lead:
├─ 09:00-09:15: Daily standup
├─ 09:15-12:00: Code review geral
├─ 14:00-17:00: Ajustes finais
└─ 17:00-18:00: Preparar demo
```

---

### Sexta-feira (Dia 5)
```
Time Todo:
├─ 09:00-09:15: Daily standup
├─ 09:15-10:00: Testes finais
├─ 10:00-11:00: Deploy staging
├─ 11:00-12:00: Validação QA
├─ 14:00-15:00: Sprint Review (demo para stakeholders)
├─ 15:00-16:00: Sprint Retrospective
└─ 16:00-17:00: Planning próximo sprint
```

---

## 📈 MÉTRICAS DO SPRINT

### Velocity
```
Story Points Planejados: 89
Story Points Concluídos: TBD (após sprint)
Velocity Esperado: 75-85 (time novo, primeiro sprint)
```

### Qualidade
```
Code Coverage: ≥ 70% (ideal 80%)
Bugs Encontrados: < 5 (críticos: 0)
Tech Debt: < 10% (do total de effort)
```

### Entrega
```
Features Completadas: 11/11 (100%)
Testes Passando: 100%
Deploy Staging: Sucesso
```

---

## 🎓 LIÇÕES APRENDIDAS (PREENCHER PÓS-SPRINT)

### O que funcionou bem?
```
- 
- 
- 
```

### O que pode melhorar?
```
- 
- 
- 
```

### Action items para próximo sprint
```
- 
- 
- 
```

---

## 📝 CHECKLIST FINAL (DEFINITION OF DONE)

### Código
- [ ] Todos os commits no main
- [ ] Code review aprovado (2 aprovações)
- [ ] CI/CD passou (green)
- [ ] Sem conflitos de merge

### Testes
- [ ] Testes unitários passando
- [ ] Testes integração passando
- [ ] Coverage ≥ 70%
- [ ] Testado em iOS simulator
- [ ] Testado em Android emulator

### Deploy
- [ ] Deploy staging realizado
- [ ] App funciona em staging
- [ ] Sem erros críticos (Sentry)

### Documentação
- [ ] README atualizado
- [ ] API documentada (Swagger)
- [ ] Architecture Decision Records (se houver decisões importantes)

### Demo
- [ ] Demo preparada
- [ ] Feedback stakeholders coletado
- [ ] Retrospectiva realizada

---

## 🚀 PRÓXIMO SPRINT

**Sprint 2:** Ride Management (Parte 1)  
**Objetivo:** Passageiro solicita corrida, cálculo de preço

---

**Status:** 🟢 PRONTO PARA COMEÇAR  
**Última atualização:** 16/12/2025

---
