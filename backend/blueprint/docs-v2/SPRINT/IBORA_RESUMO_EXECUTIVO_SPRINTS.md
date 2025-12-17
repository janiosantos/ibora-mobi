# 📊 IBORA: RESUMO EXECUTIVO DO ROADMAP
## Visão Geral de 12 Meses (26 Sprints)

---

## 🎯 OBJETIVO PRINCIPAL

**Lançar app de mobilidade com foco em FIDELIZAÇÃO DE MOTORISTAS**

- Comissão justa (12-15% vs 25% Uber)
- Repasse rápido (D+2 vs D+7)
- Sistema de incentivos real
- Comunidade e reconhecimento
- Benefícios tangíveis (combustível, manutenção)

---

## 📅 TIMELINE DE 12 MESES

```
Mês 1-3:  ██████ MVP CORE
Mês 4-6:  ████████ FIDELIZAÇÃO FASE 1
Mês 7-9:  ████████ FIDELIZAÇÃO FASE 2  
Mês 10-11: ██████ ESCALA
Mês 12:   ██ LANÇAMENTO
```

---

## 🏗️ ARQUITETURA DO PROJETO

### 5 FASES PRINCIPAIS

```
┌─────────────────────────────────────────────────────┐
│ FASE 0: FOUNDATION (Sprint 0)                       │
│ ✅ Setup ambiente, CI/CD, infra AWS                 │
└─────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────┐
│ FASE 1: MVP CORE (Sprints 1-6)                      │
│ • Auth & Cadastro                                    │
│ • Matching Geoespacial                               │
│ • Ride Lifecycle                                     │
│ • Pagamento Pix/Cash                                 │
│ • Wallet & Repasse D+2                               │
└─────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────┐
│ FASE 2: FIDELIZAÇÃO TIER 1 (Sprints 7-12)          │
│ • Sistema de Tiers (Bronze→Ouro)                    │
│ • Comissão Progressiva (15%→12%)                     │
│ • Campanhas & Bônus                                  │
│ • Antichurn System                                   │
│ • Parceria Combustível                               │
│ • Programa Mentoria                                  │
│ • Garantia Renda Mínima                              │
└─────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────┐
│ FASE 3: FIDELIZAÇÃO TIER 2 (Sprints 13-18)         │
│ • Pagamento Cartão                                   │
│ • Sistema Avaliação Justo                            │
│ • Suporte Humanizado                                 │
│ • Eventos & Reconhecimento                           │
│ • Crédito Pré-pago                                   │
│ • Antifraude                                         │
└─────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────┐
│ FASE 4: ESCALA & OTIMIZAÇÃO (Sprints 19-24)        │
│ • Performance (cache, índices, replicas)             │
│ • WebSocket Scaling                                  │
│ • Driver Academy                                     │
│ • Parceria Manutenção                                │
│ • Tier Diamante (10% comissão)                       │
│ • Analytics & BI                                     │
└─────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────┐
│ FASE 5: LANÇAMENTO (Sprints 25-26)                 │
│ • Onboarding melhorado                               │
│ • Landing page                                       │
│ • Stress testing                                     │
│ • Marketing lançamento                               │
│ • Soft launch (beta)                                 │
│ • LANÇAMENTO OFICIAL 🚀                              │
└─────────────────────────────────────────────────────┘
```

---

## 📈 METAS POR FASE

### FASE 1: MVP CORE (Mês 1-3)
```
Objetivo: App funcional para matching básico
Status: 🔧 Desenvolvimento
Entregas:
  ✅ Sistema de autenticação
  ✅ Cadastro motorista/passageiro
  ✅ Matching geoespacial (5km raio)
  ✅ Fluxo completo de corrida
  ✅ Pagamento Pix + Cash
  ✅ Wallet motorista
  ✅ Repasse D+2
```

### FASE 2: FIDELIZAÇÃO FASE 1 (Mês 4-6)
```
Objetivo: Base de fidelização (tiers + bônus)
Status: 🎯 Planejado
Entregas:
  ✅ Tier Bronze/Prata/Ouro
  ✅ Comissão 15%/13%/12%
  ✅ 3 campanhas ativas
  ✅ Dashboard métricas
  ✅ Sistema antichurn
  ✅ Cashback combustível 8%
  ✅ Programa mentoria
  ✅ Garantia R$ 2.500/mês
  
ROI Esperado:
  • Churn: 35% → 8%
  • Retenção: +300%
  • LTV: +150%
```

### FASE 3: FIDELIZAÇÃO FASE 2 (Mês 7-9)
```
Objetivo: Comunidade + benefícios avançados
Status: 🎯 Planejado
Entregas:
  ✅ Pagamento cartão (Stripe)
  ✅ Avaliação contextualizada
  ✅ Suporte WhatsApp + Chat
  ✅ Ranking semanal
  ✅ Conquistas (badges)
  ✅ Crédito uso (+8% bônus)
  ✅ Antifraude básico
  
ROI Esperado:
  • NPS motoristas: 60 → 75
  • Economia motorista: +R$ 600/mês
```

### FASE 4: ESCALA (Mês 10-11)
```
Objetivo: Preparar para crescimento
Status: 🎯 Planejado
Entregas:
  ✅ Cache + índices otimizados
  ✅ WebSocket escalável (1000+ conexões)
  ✅ Driver Academy (5 cursos)
  ✅ Rede de oficinas
  ✅ Tier Diamante (10%)
  ✅ BI dashboards
  
Meta Performance:
  • Latência: p95 < 500ms
  • Uptime: 99.5%
  • Capacidade: 500 rides/hora
```

### FASE 5: LANÇAMENTO (Mês 12)
```
Objetivo: Go-live cidade piloto
Status: 🎯 Planejado
Entregas:
  ✅ 50+ motoristas onboarded
  ✅ 200+ passageiros cadastrados
  ✅ Landing page + SEO
  ✅ Load testing (100 rides simultâneas)
  ✅ Soft launch (4 semanas graduais)
  ✅ LANÇAMENTO OFICIAL
  
Meta Mês 1 Pós-Lançamento:
  • 100 rides/semana
  • Churn < 8%
  • NPS > 70
```

---

## 💰 INVESTIMENTO E ROI

### Custo do Projeto (12 Meses)

```
EQUIPE (5.5 pessoas × 12 meses):
  Tech Lead:        R$ 18.000/mês × 12 = R$ 216.000
  Backend Dev (2):  R$ 12.000/mês × 12 × 2 = R$ 288.000
  Frontend Dev:     R$ 12.000/mês × 12 = R$ 144.000
  Full-Stack:       R$ 12.000/mês × 12 = R$ 144.000
  Designer:         R$ 10.000/mês × 12 = R$ 120.000
  QA (0.5):         R$ 8.000/mês × 12 × 0.5 = R$ 48.000
                                    SUBTOTAL: R$ 960.000

INFRAESTRUTURA:
  AWS:              R$ 5.000/mês × 12 = R$ 60.000
  SaaS Tools:       R$ 3.000/mês × 12 = R$ 36.000
                                    SUBTOTAL: R$ 96.000

MARKETING (últimos 3 meses):
  Campanhas:        R$ 30.000/mês × 3 = R$ 90.000
  Eventos:          R$ 10.000
  Materiais:        R$ 20.000
                                    SUBTOTAL: R$ 120.000

TOTAL INVESTIMENTO 12 MESES: R$ 1.176.000
```

### ROI Projetado (Mês 13-24)

```
BASE (Mês 13):
  200 motoristas × 30 rides/mês × R$ 20 média = R$ 120.000 GMV
  Take rate 15% = R$ 18.000/mês
  Custos fixos: R$ 50.000/mês (team + infra + ops)
  
  EBITDA: −R$ 32.000/mês (queimando caixa)
  
CRESCIMENTO (Mês 24):
  800 motoristas × 40 rides/mês × R$ 20 média = R$ 640.000 GMV
  Take rate 13% (mix de tiers) = R$ 83.200/mês
  Custos fixos: R$ 80.000/mês (team maior)
  
  EBITDA: +R$ 3.200/mês (break-even)
  
BREAK-EVEN: Mês 22-24
```

---

## 🎯 KPIs PRINCIPAIS

### Crescimento

| Métrica | Mês 1 | Mês 6 | Mês 12 | Meta Ano 2 |
|---------|-------|-------|--------|------------|
| Motoristas Ativos | 50 | 100 | 200 | 800 |
| Passageiros | 200 | 600 | 2.000 | 10.000 |
| Rides/Semana | 100 | 300 | 1.000 | 5.000 |
| GMV/Mês | R$ 20k | R$ 60k | R$ 200k | R$ 800k |

### Fidelização (Estrela do Projeto)

| Métrica | MVP | Mês 6 | Mês 12 | Meta |
|---------|-----|-------|--------|------|
| Churn Motoristas | - | 8% | 5% | 3% |
| NPS Motoristas | - | 65 | 75 | 80+ |
| Motoristas Tier Ouro+ | - | 10% | 30% | 50% |
| Uso Benefícios | - | 40% | 70% | 85% |

### Operação

| Métrica | MVP | Mês 6 | Mês 12 | Meta |
|---------|-----|-------|--------|------|
| Uptime | 99% | 99.5% | 99.5% | 99.9% |
| Latência p95 | 2s | 1s | 500ms | 300ms |
| Taxa Sucesso Matching | 80% | 90% | 95% | 97% |
| Tempo Médio Aceite | 2min | 1min | 30s | 20s |

---

## 🚨 RISCOS E MITIGAÇÕES

### CRÍTICO 🔴

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Uber/99 baixam preços | Alto | Alta | Diferenciação em fidelização + parcerias |
| Dificuldade recrutar motoristas | Crítico | Média | Incentivo: 0% comissão 30 dias + garantia renda |
| Churn alto motoristas | Crítico | Alta | Sistema antichurn desde Sprint 9 |

### ALTO 🟠

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Race condition matching | Alto | Baixa | SELECT FOR UPDATE + testes |
| Fraude (corridas fictícias) | Alto | Média | Antifraude desde Sprint 18 |
| Performance em escala | Alto | Média | Cache + replicas + load testing |

### MÉDIO 🟡

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| GPS impreciso | Médio | Alta | Kalman filter + precisão < 50m |
| Suporte insuficiente | Médio | Alta | CS dedicado desde Sprint 15 |
| Bugs em produção | Médio | Média | Monitoring 24/7 + on-call |

---

## 📋 CHECKLIST DE EXECUÇÃO

### Pré-Projeto (Antes Sprint 0)
- [ ] Fundraising: R$ 1.5M (seed)
- [ ] Contratar Tech Lead
- [ ] Contratar 2 Backend Devs
- [ ] Contratar 1 Frontend Dev (React Native)
- [ ] Contratar 1 Full-Stack Dev
- [ ] Contratar 1 Product Designer
- [ ] Setup contas: AWS, GitHub, Datadog, Twilio, Efí, Stripe
- [ ] Alugar escritório (opcional, pode ser remoto)

### Sprint 0 (Semana -2 a 0)
- [ ] Repositório estruturado
- [ ] CI/CD pipeline
- [ ] Infra AWS (VPC, RDS, ElastiCache)
- [ ] Ambientes: dev, staging
- [ ] Documentação base

### Fase 1: MVP Core (Sprint 1-6)
- [ ] Auth funcionando
- [ ] Cadastro motorista + aprovação
- [ ] Matching 5km raio
- [ ] Corrida completa (aceite → fim)
- [ ] Pagamento Pix + Cash
- [ ] Wallet + repasse D+2
- [ ] Testes E2E passando

### Fase 2: Fidelização Fase 1 (Sprint 7-12)
- [ ] Tiers Bronze/Prata/Ouro ativos
- [ ] Comissão dinâmica funcionando
- [ ] 3 campanhas rodando
- [ ] Dashboard métricas
- [ ] Antichurn operando
- [ ] Parceria combustível (1 rede)
- [ ] Mentoria ativa (5+ mentores)
- [ ] Garantia renda testada

### Fase 3: Fidelização Fase 2 (Sprint 13-18)
- [ ] Pagamento cartão integrado
- [ ] Avaliação contextualizada
- [ ] Suporte WhatsApp + Chat
- [ ] Ranking semanal
- [ ] Sistema de badges
- [ ] Crédito uso ativo
- [ ] Antifraude detectando

### Fase 4: Escala (Sprint 19-24)
- [ ] Latência p95 < 500ms
- [ ] Cache strategy implementada
- [ ] WebSocket escalável (1000+)
- [ ] 5 cursos Academy disponíveis
- [ ] Rede oficinas (5+ parceiros)
- [ ] Tier Diamante ativo
- [ ] BI dashboards operando

### Fase 5: Lançamento (Sprint 25-26)
- [ ] Landing page no ar
- [ ] Onboarding testado
- [ ] Load testing: 100 rides simultâneas OK
- [ ] 50 motoristas onboarded
- [ ] 200 passageiros cadastrados
- [ ] Marketing rodando
- [ ] Monitoring 24/7
- [ ] 🚀 LANÇAMENTO OFICIAL

---

## 📞 PRÓXIMOS PASSOS IMEDIATOS

### SEMANA 1: VALIDAÇÃO
1. Entrevistar 10-15 motoristas Uber/99
2. Validar dores e soluções propostas
3. Testar mensagens de marketing
4. Confirmar comissão 12-15% é competitiva

### SEMANA 2-3: FUNDRAISING
1. Deck de apresentação
2. Roadshow (angels + VCs)
3. Meta: R$ 1.5M (seed)
4. 15-18 meses runway

### SEMANA 4: CONTRATAÇÃO
1. Publicar vagas (LinkedIn, AngelList)
2. Tech Lead (senior, 10+ anos)
3. Devs (mid-level, 3-5 anos)
4. Designer (sênior, portfolio forte)

### MÊS 2: SPRINT 0
1. Setup ambiente
2. Infra AWS
3. CI/CD
4. Documentação base

### MÊS 3+: EXECUÇÃO
1. Sprint 1 → Sprint 26
2. Reviews quinzenais
3. Ajustar roadmap conforme feedback
4. Manter foco em FIDELIZAÇÃO

---

## 🎊 MENSAGEM FINAL

**Este não é um roadmap teórico.**

É um **plano executável** baseado em:
- ✅ Dores reais mapeadas de 15+ estudos
- ✅ Stack tecnológico validado
- ✅ Time dimensionado realisticamente
- ✅ Custos calculados
- ✅ Riscos identificados e mitigados

**O diferencial do iBora não é tecnologia.**

É o **modelo de relacionamento com o motorista.**

Cada sprint foi pensado para construir, gradualmente, um app onde:
- Motorista ganha 27% a mais
- Motorista tem suporte real
- Motorista tem carreira
- Motorista **não quer sair**

---

**O iBora está pronto para ser construído.** 🚀

---

**Documento:** Resumo Executivo Sprints  
**Versão:** 1.0  
**Data:** Dezembro 2024  
**Próxima revisão:** Sprint 6 (ajustar velocity)
