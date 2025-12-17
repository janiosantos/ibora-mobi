# iBORA MOBILIDADE — ESTRUTURAÇÃO COMPLETA DO PROJETO
**Aplicativo de Mobilidade Urbana para o Brasil**

---

## 📋 ÍNDICE DE NAVEGAÇÃO

- [ETAPA 1 — DEFINIÇÃO DA IDEIA (PRODUTO)](#etapa-1--definição-da-ideia-produto)
- [ETAPA 2 — PERFIL DO USUÁRIO (PERSONAS)](#etapa-2--perfil-do-usuário-personas)
- [ETAPA 3 — MODELO DE NEGÓCIO](#etapa-3--modelo-de-negócio)
- [ETAPA 4 — ANÁLISE DE MERCADO](#etapa-4--análise-de-mercado)
- [ETAPA 5 — UX, LAYOUT E LINGUAGEM VISUAL](#etapa-5--ux-layout-e-linguagem-visual)
- [ETAPA 6 — WIREFRAMES E STORYBOARD](#etapa-6--wireframes-e-storyboard-conceitual)
- [ETAPA 7 — PLANEJAMENTO DO BACKEND](#etapa-7--planejamento-do-backend-núcleo-técnico)
- [ETAPA 8 — INCENTIVOS E FIDELIDADE DO MOTORISTA](#etapa-8--incentivos-performance-e-fidelidade-do-motorista)
- [ETAPA 9 — TESTES](#etapa-9--testes)
- [ETAPA 10 — METODOLOGIA E ROADMAP](#etapa-10--metodologia-e-roadmap)
- [ETAPA 11 — DOCUMENTAÇÃO VIVA](#etapa-11--documentação-viva)

---

# ETAPA 1 — DEFINIÇÃO DA IDEIA (PRODUTO)

## 1.1 Problema, Público-Alvo e Diferencial

### 🎯 Qual problema o iBora resolve?

Com base nos estudos acadêmicos analisados sobre mobilidade urbana no Brasil, identificamos **três problemas críticos**:

#### **Problema 1: Precarização do Trabalho dos Motoristas**
**Contexto:** Pesquisas da UFPR (2021) mostram que motoristas de aplicativos:
- Ganham **menos que taxistas** (média R$ 2.824/mês para todas as fontes de renda)
- Não têm **direitos trabalhistas** (férias, 13º, FGTS)
- Trabalham sob **comissões abusivas** (15-25% retidos pela plataforma)
- Sofrem com **sistema de pontuação opressivo** (desligamento por baixa nota)
- Enfrentam **jornadas exaustivas** sem proteção

**Dados reais:**
- Uber/99: retêm 20-25% de comissão
- Motorista começa o dia "devendo" à plataforma
- Controle algorítmico total (preços, rotas, comportamento)
- Sistema de "cenoura e porrete" (prêmios e castigos)

#### **Problema 2: Custo Elevado para Passageiros de Baixa Renda**
**Contexto:** Estudos mostram que:
- Mais de **60% dos usuários** de apps vieram do transporte público
- Motivo principal: **preço** e **confiabilidade**
- Demanda concentrada em **trajetos curtos** (<5km)
- Público jovem (18-35 anos) com **renda limitada**
- Transporte público inadequado em cidades médias

#### **Problema 3: Falta de Transparência e Confiança**
**Contexto:**
- Passageiros não entendem como o preço é calculado
- Motoristas não sabem quanto vão receber antes de aceitar
- Algoritmo "caixa-preta" penaliza sem explicação
- Mudanças unilaterais de condições de serviço

---

### 👥 Para quem (público-alvo)?

#### **Segmento Primário: Cidades Médias e Regiões Metropolitanas do Interior**

**Geografia:**
- Cidades de 100-500 mil habitantes
- Regiões metropolitanas do interior (Recife, Fortaleza, Campinas, Vale do Paraíba, interior de MG)
- Cidades onde Uber/99 têm presença limitada
- Áreas com transporte público deficiente

**Por quê começar em cidades médias?**
1. **Menor competição** direta com gigantes
2. **Custo de aquisição** menor
3. **Necessidade real** de mobilidade
4. **Possibilidade de parcerias locais** (comércio, governo)
5. **Marketing boca-a-boca** mais efetivo

#### **Perfil Socioeconômico:**

**Passageiros:**
- Classes C e D (renda familiar: R$ 2-6 mil)
- Estudantes universitários
- Trabalhadores formais/informais
- Pessoas sem carro próprio
- Faixa etária: 18-45 anos
- Familiaridade com smartphones

**Motoristas:**
- Renda atual: R$ 2-4 mil/mês
- Trabalhadores informais ou desempregados
- Donos de carro popular (2010-2020)
- Ex-motoristas de Uber/99 insatisfeitos
- Motoristas que buscam complementar renda
- Faixa etária: 25-55 anos

---

### 💡 Diferencial frente a Uber/99

#### **1. MODELO JUSTO PARA MOTORISTAS** ✅

| Aspecto | Uber/99 | iBora |
|---------|---------|-------|
| **Comissão** | 20-25% | **12-15%** |
| **Transparência** | Caixa-preta | Total visibilidade |
| **Aceite de corrida** | Penalização por recusa | Sem penalização |
| **Pagamento** | D+7 para Pix | **D+2 para Pix** |
| **Wallet motorista** | Não existe | Sistema completo com crédito de uso |
| **Nota mínima** | 4.7 (desligamento) | **4.3 (sem desligamento, apenas menor prioridade)** |
| **Suporte** | Chatbot/ticket | **Canal direto + comunidade** |

**Diferencial-chave:** *"No iBora, você dirige. A plataforma não manda em você."*

#### **2. PREÇO COMPETITIVO PARA PASSAGEIROS** 💰

**Estratégia de precificação:**
- **10-15% mais barato** que Uber em trajetos curtos (<5km)
- **Preço fixo previsível** para rotas comuns
- **Sem tarifa dinâmica abusiva** (máximo 1.5x em horário de pico)
- **Pacotes e assinaturas** para usuários frequentes

**Exemplo prático:**
```
Trajeto: Centro → Universidade (3.5km)
- Uber: R$ 12-18 (tarifa dinâmica)
- iBora: R$ 10-13 (tarifa fixa)

Trajeto: Casa → Trabalho (7km)
- Uber: R$ 18-25
- iBora: R$ 16-22
```

#### **3. PAGAMENTO FLEXÍVEL E INCLUSIVO** 💳

**Opções:**
- ✅ **PIX** (prioritário, recebimento D+2)
- ✅ **Dinheiro** (cash, sem restrições)
- ✅ **Cartão de crédito/débito** (parcelamento)
- ✅ **Crédito pré-pago** (para motoristas)

**Diferencial Cash:**
- Não penaliza motorista que aceita dinheiro
- Sistema de gestão de caixa inteligente
- Possibilidade de "depositar" dinheiro via parceiros (lotéricas, padarias)

#### **4. REGIONALIZAÇÃO E IDENTIDADE LOCAL** 🏙️

**Estratégia:**
- **Nome regional** adaptável (ex: "iBora Campinas", "iBora Recife")
- **Parcerias locais** (comércio, eventos, governo)
- **Campanhas regionais** de incentivo
- **Atendimento humanizado** em português
- **Conhecimento local** dos motoristas valorizado

#### **5. SISTEMA DE INCENTIVOS E FIDELIDADE REAL** 🎁

**Para motoristas:**
- Programa de pontos por performance
- Cashback em combustível (postos parceiros)
- Descontos em manutenção (oficinas parceiras)
- Seguro viagem gratuito para top performers
- Comunidade e rede de apoio

**Para passageiros:**
- Programa de indicação (R$ 10 para ambos)
- Cashback em estabelecimentos parceiros
- Descontos progressivos por uso
- Assinatura mensal com viagens ilimitadas curtas

---

## 1.2 Objetivos do Produto

### 🎯 Objetivo de Negócio

**Primário:**
Criar uma **plataforma de mobilidade urbana sustentável financeiramente** que:
1. Atinja **break-even em 18 meses** na primeira cidade-piloto
2. Realize **10.000 corridas/mês** em 12 meses
3. Tenha **200 motoristas ativos** em 12 meses
4. Mantenha **taxa de retenção de 70%** (motoristas e passageiros)

**Secundário:**
1. Expandir para **5 cidades em 24 meses**
2. Estabelecer **30+ parcerias locais** por cidade
3. Criar **modelo de franquia/licenciamento** para crescimento acelerado
4. Desenvolver **produtos financeiros** para motoristas (crédito, seguro)

**Métricas de Sucesso:**
- GMV (Gross Merchandise Value): R$ 500k/mês em 12 meses
- Take rate efetivo: 12-15%
- CAC (Customer Acquisition Cost): < R$ 30/usuário
- LTV (Lifetime Value): > R$ 300/usuário
- Churn mensal: < 10%

---

### 👤 Objetivo do Usuário Passageiro

**O passageiro quer:**

1. **Chegar ao destino com segurança** ✅
   - Motorista verificado e avaliado
   - Compartilhamento de viagem em tempo real
   - Botão de emergência
   - Seguro de acidente

2. **Pagar um preço justo e previsível** 💰
   - Saber o preço **antes** de solicitar
   - Sem "surpresas" de tarifa dinâmica abusiva
   - Opções de pagamento flexíveis
   - Possibilidade de parcelar

3. **Ter confiabilidade e praticidade** ⏱️
   - Carro chega em **< 8 minutos** (média)
   - Cancelamento baixo (< 5%)
   - App funciona **offline** para consultar histórico
   - Suporte rápido em caso de problema

4. **Sentir-se valorizado** 🌟
   - Programa de fidelidade real
   - Atendimento humanizado
   - Possibilidade de "favoritar" motoristas
   - Feedback importa

**Jornada ideal:**
```
1. Abre o app → vê preço fixo estimado
2. Solicita corrida → motorista aceita em < 30s
3. Motorista chega em < 8min → perfil visível com fotos/avaliações
4. Viagem tranquila → conversa opcional
5. Pagamento automático → recibo digital
6. Avalia motorista → ganha pontos de fidelidade
```

---

### 🚗 Objetivo do Motorista

**O motorista quer:**

1. **Ganhar mais dinheiro** 💵
   - Comissão **justa** (12-15% vs 20-25%)
   - Recebimento **rápido** (D+2 vs D+7)
   - Transparência total nos ganhos
   - Possibilidade de **complementar renda** ou trabalhar full-time

2. **Ter autonomia e dignidade** 🤝
   - **Não ser penalizado** por recusar corridas
   - Saber destino e valor **antes** de aceitar
   - Sistema de avaliação **justo** (sem desligamento automático)
   - Suporte **humano** quando precisar

3. **Reduzir custos operacionais** 🛠️
   - Acesso a **combustível mais barato** (parcerias)
   - Descontos em **manutenção**
   - Gestão inteligente de **caixa** (cash)
   - Crédito de uso **pré-pago** para operar sem investimento alto

4. **Ter segurança jurídica e operacional** 🛡️
   - Contrato **claro** e justo
   - Seguro contra acidentes
   - Proteção contra **calotes** (pagamento garantido)
   - Comunidade de apoio

**Jornada ideal:**
```
1. Abre o app → vê região com demanda
2. Recebe notificação → vê destino + valor estimado
3. Decide aceitar → inicia corrida
4. Passageiro educado → avaliação positiva
5. Finaliza → valor cai na wallet (D+2)
6. Acumula pontos → desbloqueia benefícios
```

---

### ⚙️ Objetivo Operacional da Plataforma

**A plataforma precisa:**

1. **Manter alta disponibilidade (99.5% uptime)** 📡
   - Backend escalável (FastAPI + PostgreSQL + Redis)
   - WebSocket para tempo real
   - Fallback em caso de falha
   - Monitoramento proativo

2. **Garantir integridade financeira** 🏦
   - Ledger append-only auditável
   - Reconciliação diária automática
   - Split de pagamento correto
   - Anti-fraude básico (detecção de padrões)

3. **Operar com eficiência de marketplace** 📊
   - Matching motorista-passageiro em < 30s
   - Taxa de aceite > 80%
   - Taxa de finalização > 95%
   - Cancelamento < 5%

4. **Escalar sem perder qualidade** 📈
   - Onboarding automatizado de motoristas
   - Verificação de documentos (OCR + validação)
   - Suporte tier 1 automatizado (chatbot)
   - Análise de dados para otimização

---

## 💡 POR QUÊ ISTO IMPORTA?

### Trade-offs Conscientes

#### **Trade-off 1: Comissão Baixa vs Margem**
- ❌ **Risco:** Menor margem para plataforma
- ✅ **Benefício:** Atrai melhores motoristas, cria lealdade
- 🎯 **Mitigação:** Volume + eficiência operacional + produtos financeiros

#### **Trade-off 2: Cash vs Controle**
- ❌ **Risco:** Mais difícil de auditar, possibilidade de fraude
- ✅ **Benefício:** Inclusão financeira, menos atrito
- 🎯 **Mitigação:** Sistema de gestão de caixa + parcerias para depósito

#### **Trade-off 3: Regionalização vs Escala**
- ❌ **Risco:** Mais complexo de operar (multiplas cidades)
- ✅ **Benefício:** Diferenciação, parcerias locais, lealdade
- 🎯 **Mitigação:** Modelo de franquia + tecnologia centralizada

#### **Trade-off 4: Autonomia do Motorista vs Experiência do Passageiro**
- ❌ **Risco:** Motorista pode recusar muito, passageiro espera mais
- ✅ **Benefício:** Motoristas mais felizes = melhor serviço
- 🎯 **Mitigação:** Sistema de incentivos + gamificação da aceitação

---

## 🎬 PRÓXIMOS PASSOS

✅ **Etapa 1 concluída:** Definição clara do problema, público e diferencial  
📍 **Próxima etapa:** [ETAPA 2 — Criação de Personas Detalhadas](#etapa-2--perfil-do-usuário-personas)

---

# ETAPA 2 — PERFIL DO USUÁRIO (PERSONAS)

## Metodologia de Criação

As personas foram criadas com base em:
1. **Pesquisas acadêmicas** sobre mobilidade urbana no Brasil
2. **Dados reais** de perfil socioeconômico de usuários de apps
3. **Estudos sobre precarização** do trabalho de motoristas
4. **Padrões comportamentais** identificados em cidades médias

---

## 👤 PERSONAS — PASSAGEIROS

### **Persona P1: Júlia — A Estudante Conectada**

#### Perfil Demográfico
- **Idade:** 22 anos
- **Profissão:** Estudante de Administração (3º ano)
- **Renda familiar:** R$ 4.500/mês
- **Cidade:** Campinas/SP (interior)
- **Estado civil:** Solteira
- **Moradia:** República com 3 amigas

#### Perfil Comportamental
**Tecnologia:**
- Alta familiaridade com apps
- Usa Instagram, TikTok, WhatsApp constantemente
- Smartphone: Samsung Galaxy A34 (intermediário)
- Faz tudo pelo celular (banco, compras, transporte)

**Mobilidade:**
- Não tem carro próprio
- Usa apps de mobilidade 8-12x/mês
- Trajetos curtos (universidade, shopping, casa de amigas)
- Distância média: 3-5km
- Horários: manhã (8h) e noite (18h-22h)

#### Dores e Frustrações 😣

1. **Preço imprevisível** ⚠️
   - "Nunca sei quanto vou gastar. Às vezes o mesmo trajeto custa R$ 12, às vezes R$ 20"
   - "Tarifa dinâmica pega justamente na hora que mais preciso"
   - Sensibilidade alta ao preço (orçamento apertado)

2. **Demora para encontrar motorista** ⏱️
   - "Em horário de pico, ninguém aceita minha corrida"
   - "Já perdi aula porque o app cancelou 3 vezes"
   - Frustração com cancelamentos

3. **Falta de opção de pagamento** 💳
   - "Nem sempre tenho saldo no Pix"
   - "Queria poder parcelar no cartão trajetos longos"
   - Prefere pagamento instantâneo (Pix), mas quer flexibilidade

4. **Insegurança em horários noturnos** 🌙
   - "Às vezes o motorista não é bem avaliado e fico com medo"
   - "Queria poder escolher motorista mulher à noite"

#### Expectativas ✨

1. **Preço justo e previsível**
   - Quer saber exatamente quanto vai pagar
   - Aceita pagar um pouco mais em horário de pico, mas dentro do razoável (1.3x, não 2x)
   
2. **Rapidez no atendimento**
   - Carro precisa chegar em < 10 minutos
   - Aceitação rápida da corrida (< 1 min)

3. **Segurança e confiança**
   - Motorista bem avaliado
   - Possibilidade de compartilhar trajeto com amigas
   - Botão de emergência visível

4. **Programa de fidelidade que funcione**
   - Descontos reais para quem usa com frequência
   - Cashback em estabelecimentos que frequenta
   - Indicação de amigas com bônus para ambas

#### Barreiras de Adoção 🚧

- **Conhecimento da marca:** "Nunca ouvi falar do iBora, será que é confiável?"
- **Network effect:** "Minhas amigas usam Uber, vai ter motorista disponível?"
- **Inércia:** "Já tenho cartão cadastrado na 99, dar trabalho mudar"

#### Como isso impacta o produto:

**UX:**
- Onboarding super simples (3 passos)
- Preço fixo visível ANTES de solicitar
- Indicação com benefício claro (R$ 10 para cada)
- Badge de "motorista verificado" e "top avaliado"

**Fluxo de pagamento:**
- Pix prioritário (D+2 para motorista = menor custo = menor preço)
- Opção de cartão para trajetos > R$ 20
- Carteira virtual com créditos

**Regras de negócio:**
- Tarifa dinâmica máxima: 1.5x
- Prioridade para motoristas com alta aceitação
- Cashback progressivo: 2% → 5% → 10%

**Comunicação:**
- Tom informal, descontraído
- "Bora de iBora?" (linguagem jovem)
- Presença forte em Instagram e TikTok

---

### **Persona P2: Carlos — O Trabalhador Pragmático**

#### Perfil Demográfico
- **Idade:** 38 anos
- **Profissão:** Analista administrativo em empresa de médio porte
- **Renda mensal:** R$ 3.800
- **Cidade:** São José dos Campos/SP
- **Estado civil:** Casado, 2 filhos (8 e 12 anos)
- **Moradia:** Casa própria (financiada)

#### Perfil Comportamental
**Tecnologia:**
- Familiaridade média com apps
- Usa WhatsApp, bancário, apps de transporte
- Smartphone: Motorola Moto G82 (intermediário)
- Prefere praticidade a novidades

**Mobilidade:**
- Tem carro (Fiat Uno 2012), mas usa com moderação (combustível caro)
- Usa apps para ir ao trabalho quando carro está no mecânico
- Usa apps para chegar em eventos sociais (pode beber)
- Frequência: 4-6x/mês
- Trajetos médios: 5-10km
- Horários: manhã (7h) e noite (19h)

#### Dores e Frustrações 😣

1. **Custo elevado para uso frequente** 💰
   - "Se usar todo dia, gasto mais que gasolina"
   - "Preciso de algo mais em conta para ir ao trabalho"
   - Calcula ROI (custo vs benefício)

2. **Falta de previsibilidade** 📊
   - "Nunca sei se vai ter motorista disponível"
   - "Às vezes demora 15-20 min para aceitar"
   - Precisa de pontualidade (trabalho formal)

3. **Pagamento limitado** 💳
   - "Nem sempre tenho Pix na hora"
   - "Queria poder pagar em dinheiro sem problema"
   - Prefere cash quando possível (controle)

4. **Falta de opção para família** 👨‍👩‍👧‍👦
   - "Não tem como levar os filhos todos de uma vez"
   - "Queria carro maior para passeios em família"

#### Expectativas ✨

1. **Confiabilidade acima de tudo**
   - Motorista aceita rápido
   - Chega no horário combinado
   - Não cancela em cima da hora

2. **Preço competitivo para uso recorrente**
   - Quer assinatura mensal
   - Desconto para trajetos casa-trabalho
   - Preço fixo previsível

3. **Flexibilidade de pagamento**
   - Aceita dinheiro sem problema
   - Possibilidade de "conta corporativa" (empresa paga)

4. **Segurança e tranquilidade**
   - Motorista experiente
   - Carro em bom estado
   - Seguro em caso de acidente

#### Barreiras de Adoção 🚧

- **Conservadorismo:** "Já uso Uber há anos, por que mudar?"
- **Custo de mudança:** "Vai dar trabalho cadastrar tudo de novo"
- **Desconfiança:** "É uma empresa nova, será que vai durar?"

#### Como isso impacta o produto:

**UX:**
- Interface limpa, sem firulas
- Informação clara e objetiva
- Histórico de corridas acessível
- Recibo digital para prestação de contas

**Fluxo de pagamento:**
- Cash como opção principal
- Possibilidade de "vale-transporte corporativo"
- Fatura mensal consolidada

**Regras de negócio:**
- Assinatura mensal: R$ 99 (20 viagens curtas)
- Motoristas priorizados por pontualidade
- Carros categoria "família" (SUV, minivan)

**Comunicação:**
- Tom sério, profissional
- Foco em benefícios práticos (economia, pontualidade)
- Presença em LinkedIn e WhatsApp

---

## 🚗 PERSONAS — MOTORISTAS

### **Persona M1: Roberto — O Motorista Full-Time Descontente**

#### Perfil Demográfico
- **Idade:** 42 anos
- **Profissão:** Motorista de aplicativo (atual), ex-metalúrgico
- **Renda mensal:** R$ 2.900 (líquido, após descontar combustível e manutenção)
- **Cidade:** Recife/PE
- **Estado civil:** Casado, 1 filho (16 anos)
- **Moradia:** Casa alugada
- **Veículo:** Fiat Argo 2018 (financiado)

#### Perfil Comportamental
**Tecnologia:**
- Familiaridade média com apps
- Usa Uber e 99 simultaneamente
- Smartphone: Xiaomi Redmi Note 11 (intermediário)
- Aprende rápido quando vê benefício

**Trabalho:**
- Trabalha 10-12h/dia, 6 dias/semana
- Roda 200-250km/dia
- Realiza 15-20 corridas/dia
- Faturamento bruto: R$ 5.000-6.000/mês
- Líquido (após custos): R$ 2.900/mês
- Trabalha principalmente manhã (6h-12h) e tarde (14h-20h)

#### Dores e Frustrações 😣

1. **Comissão abusiva** 💸
   - "Uber e 99 tiram 25% de cada corrida"
   - "Eu que pago combustível, manutenção, seguro, e eles ficam com 1/4"
   - "Comecei ganhando mais, mas a cada ano piorou"
   - **Revolta com a exploração**

2. **Sistema opressivo de avaliação** ⭐
   - "Se minha nota cair de 4.7, sou desligado"
   - "Passageiro me dá nota baixa por trânsito, coisa que não controlo"
   - "Já fui desligado uma vez e fiquei 2 semanas sem trabalhar"
   - **Medo constante de perder o ganha-pão**

3. **Falta de autonomia** 🚫
   - "Não posso recusar corrida, senão minha aceitação cai"
   - "Não sei pra onde vou antes de aceitar"
   - "Aplicativo me manda pra região ruim e não posso negar"
   - **Sente-se explorado, sem dignidade**

4. **Pagamento demorado** ⏳
   - "Uber paga D+7, preciso do dinheiro antes"
   - "Tenho conta pra pagar, não posso esperar 1 semana"
   - "Quando aceito dinheiro, fico com problema de caixa"

5. **Custos operacionais altos** 🛠️
   - "Gasolina está R$ 5.50, devorando meu lucro"
   - "Manutenção é cara, pneu, óleo, revisão"
   - "Seguro é obrigatório, mas caro"
   - **Margens cada vez menores**

#### Expectativas ✨

1. **Comissão justa** 💰
   - Quer que plataforma cobre **15% no máximo**
   - Quer ver exatamente quanto vai receber
   - Quer transparência total (sem taxas escondidas)

2. **Autonomia e respeito** 🤝
   - Quer poder **recusar corrida sem punição**
   - Quer saber **destino antes** de aceitar
   - Quer sistema de avaliação **justo** (não desligamento automático)
   - **Quer ser tratado como parceiro, não empregado**

3. **Pagamento rápido** ⚡
   - Quer receber em **D+2** (no máximo)
   - Quer opção de **saque imediato** (mesmo que com taxa pequena)
   - Quer gestão de caixa facilitada

4. **Redução de custos** 🛡️
   - Quer **desconto em combustível** (parcerias com postos)
   - Quer **desconto em manutenção** (oficinas parceiras)
   - Quer **seguro mais barato**
   - **Quer suporte real quando precisar**

5. **Comunidade e apoio** 👥
   - Quer sentir que **não está sozinho**
   - Quer espaço de convivência com outros motoristas
   - Quer ser ouvido quando tem problema

#### Barreiras de Adoção 🚧

- **Desconfiança:** "Já ouvi promessa de outras plataformas e não cumpriram"
- **Dependência:** "Se sair da Uber/99, vou perder renda até iBora crescer"
- **Investimento:** "Vou ter que comprar suporte de celular novo, adesivo..."

#### Como isso impacta o produto:

**UX:**
- Dashboard financeiro claro (ganhos, custos, líquido)
- Mapa de calor de demanda em tempo real
- Aceitação de corrida COM destino visível
- Sistema de reputação transparente

**Fluxo de pagamento:**
- D+2 padrão (Pix)
- Opção de saque D+0 (taxa 1.5%)
- Gestão de caixa (dinheiro vira crédito)
- Parceria com padarias/lotéricas para depósito

**Regras de negócio:**
- Comissão: 12-15% (não 25%)
- Sem penalização por recusa
- Nota mínima: 4.3 (aviso, não desligamento)
- Suporte humano (WhatsApp + telefone)

**Comunicação:**
- Tom de respeito e dignidade
- "Você dirige, você decide"
- Transparência total
- Comunidade no WhatsApp

---

### **Persona M2: Mariana — A Motorista Part-Time Complementar**

#### Perfil Demográfico
- **Idade:** 29 anos
- **Profissão:** Professora de inglês (manhã) + Motorista de app (tarde/noite)
- **Renda mensal:** R$ 1.800 (professora) + R$ 1.200 (motorista) = R$ 3.000
- **Cidade:** Campinas/SP
- **Estado civil:** Solteira
- **Moradia:** Apartamento alugado (divide com irmã)
- **Veículo:** Honda Fit 2015 (quitado, herança do pai)

#### Perfil Comportamental
**Tecnologia:**
- Alta familiaridade com apps
- Usa redes sociais ativamente
- Smartphone: iPhone 11 (usado)
- Aprende rápido e gosta de tecnologia

**Trabalho:**
- Trabalha 4-5h/dia como motorista (14h-19h)
- Trabalha principalmente tarde/noite e finais de semana
- Roda 80-100km/dia
- Realiza 8-12 corridas/dia
- Faturamento bruto app: R$ 2.000/mês
- Líquido (após custos): R$ 1.200/mês

#### Dores e Frustrações 😣

1. **Horário de pico muito competitivo** 📈
   - "À tarde, é difícil conseguir corridas boas"
   - "Motoristas full-time ficam com as melhores corridas"
   - "Às vezes fico 30min sem corrida"

2. **Insegurança como mulher motorista** 👩
   - "Já passei situação desconfortável com passageiro"
   - "Evito corridas muito tarde da noite"
   - "Gostaria de poder escolher passageiras mulheres"

3. **Falta de flexibilidade de horário** ⏰
   - "Não posso trabalhar manhã (dou aula)"
   - "Às vezes plataforma me penaliza por não estar online"
   - "Queria poder programar horários de disponibilidade"

4. **Custos de entrada altos** 💸
   - "Tive que gastar R$ 300 em documentação"
   - "Suporte de celular, adesivos, água para passageiros"
   - **Investimento inicial pesado para renda complementar**

5. **Falta de comunidade** 👥
   - "Não conheço outros motoristas"
   - "Gostaria de trocar experiências com outras mulheres"
   - "Me sinto isolada"

#### Expectativas ✨

1. **Flexibilidade total** ⏰
   - Quer trabalhar **nos horários que pode**
   - Quer ser respeitada por trabalhar part-time
   - Quer programação de disponibilidade

2. **Segurança como prioridade** 🛡️
   - Quer opção de **aceitar só mulheres**
   - Quer **verificação rigorosa** de passageiros
   - Quer **suporte prioritário** em emergências

3. **Comunidade de apoio** 👭
   - Quer **rede de motoristas mulheres**
   - Quer **canal de comunicação** exclusivo
   - Quer **eventos e encontros**

4. **Complemento de renda real** 💰
   - Quer que **valha a pena** o esforço
   - Quer **comissão justa**
   - Quer **incentivos para part-time** (não só full-time)

#### Barreiras de Adoção 🚧

- **Medo de perder tempo:** "Se não tiver corrida, perco tarde inteira"
- **Investimento inicial:** "Não quero gastar muito se não der certo"
- **Segurança:** "Preciso ter certeza que a plataforma é segura"

#### Como isso impacta o produto:

**UX:**
- Programação de disponibilidade
- Modo "só mulheres" (passageiras)
- Dashboard simplificado para part-time
- Comunidade no app

**Fluxo de pagamento:**
- Sem taxas de entrada (documentação gratuita)
- Pagamento proporcional ao tempo online
- Incentivos para horários menos concorridos

**Regras de negócio:**
- Sem penalização por trabalhar part-time
- Verificação rigorosa de passageiros (CPF + selfie)
- Suporte prioritário para mulheres
- Campanhas específicas para part-time

**Comunicação:**
- Tom de empoderamento feminino
- "Você no controle, no seu tempo"
- Destaque para segurança
- Rede social de mulheres motoristas

---

## 👔 PERSONA — ADMINISTRADOR DA PLATAFORMA

### **Persona A1: Felipe — O Gerente de Operações**

#### Perfil Demográfico
- **Idade:** 35 anos
- **Profissão:** Gerente de Operações do iBora
- **Formação:** Administração + MBA em Gestão de Negócios
- **Experiência:** 8 anos em logística e operações
- **Localização:** São Paulo (escritório central)

#### Perfil Comportamental
**Tecnologia:**
- Alta familiaridade com sistemas de gestão
- Usa analytics, CRM, ferramentas de BI
- Excel/Google Sheets avançado
- Aprende rápido novos sistemas

**Trabalho:**
- Gerencia 3 cidades simultaneamente
- Monitora KPIs diariamente
- Resolve problemas operacionais
- Coordena equipe de suporte (5 pessoas)
- Trabalha 9h/dia (8h-18h)

#### Dores e Frustrações 😣

1. **Falta de visibilidade operacional** 📊
   - "Não consigo ver em tempo real o que está acontecendo"
   - "Descubro problemas tarde demais"
   - "Não tenho dashboard consolidado"

2. **Gestão manual de exceções** 🛠️
   - "Tenho que resolver disputa manualmente"
   - "Cancelamentos fraudulentos tomam muito tempo"
   - "Falta automação para casos comuns"

3. **Dificuldade em identificar fraudes** 🚨
   - "Às vezes motorista e passageiro fazem conluio"
   - "Difícil detectar corridas falsas"
   - "Sistema não alerta sobre padrões suspeitos"

4. **Conciliação financeira complexa** 💰
   - "Reconciliação diária é manual e demorada"
   - "Difícil auditar pagamentos"
   - "Erro humano causa problemas com motoristas"

#### Expectativas ✨

1. **Visibilidade total** 🔍
   - Dashboard em tempo real
   - Alertas automáticos
   - Drill-down por cidade/motorista/passageiro
   - Relatórios automatizados

2. **Automação inteligente** 🤖
   - Resolução automática de casos simples
   - Sugestões de ação para casos complexos
   - Machine learning para detectar fraudes
   - Conciliação financeira automatizada

3. **Ferramentas de gestão eficientes** ⚙️
   - CRM integrado
   - Sistema de tickets
   - Chat interno com equipe
   - API para integrações

4. **Controle de qualidade** ✅
   - Monitoramento de satisfação (NPS)
   - Identificação proativa de problemas
   - Feedback loop com produto/engenharia

#### Como isso impacta o produto:

**Admin Panel:**
- Dashboard operacional completo
- Sistema de alertas configurável
- Gestão de disputas workflow-based
- Conciliação financeira automatizada

**Ferramentas:**
- Log de auditoria completo
- Replay de corridas
- Análise de fraude por ML
- Relatórios customizáveis

**Integrações:**
- CRM (Zendesk/Intercom)
- BI (Metabase/Looker)
- Comunicação (Slack/WhatsApp)

---

## 📊 MATRIZ DE IMPACTO DAS PERSONAS

| Persona | Impacto em UX | Impacto em Pagamento | Impacto em Negócio | Prioridade |
|---------|---------------|----------------------|---------------------|------------|
| **P1: Júlia** | Alto (simplicidade) | Médio (Pix + cartão) | Alto (volume) | 🔥 ALTA |
| **P2: Carlos** | Médio (clareza) | Alto (cash + corporativo) | Médio (recorrência) | 🔥 ALTA |
| **M1: Roberto** | Alto (transparência) | Alto (D+2, caixa) | 🔥 CRÍTICO (core business) | 🔥🔥 CRÍTICA |
| **M2: Mariana** | Alto (segurança) | Médio (flexibilidade) | Médio (diversificação) | ⚠️ MÉDIA |
| **A1: Felipe** | N/A | Baixo | Alto (eficiência) | ⚠️ MÉDIA |

---

## 🎯 PRÓXIMAS DECISÕES ESTRATÉGICAS

Com base nas personas, precisamos definir:

1. **Priorização de funcionalidades:**
   - MVP deve atender **M1 (Roberto)** e **P1 (Júlia)** PRIMEIRO
   - Funcionalidades de segurança feminina (M2) vêm no pós-MVP
   - Admin panel robusto é essencial desde o início

2. **Estratégia de Go-to-Market:**
   - **Fase 1:** Conquistar motoristas descontentes (M1)
   - **Fase 2:** Atrair passageiros jovens (P1) via indicação
   - **Fase 3:** Expandir para público pragmático (P2)

3. **Diferenciação competitiva:**
   - **Para motoristas:** Comissão justa + autonomia
   - **Para passageiros:** Preço previsível + segurança
   - **Para operação:** Eficiência + escalabilidade

---

✅ **Etapa 2 concluída:** Personas detalhadas com dores, expectativas e impactos  
📍 **Próxima etapa:** [ETAPA 3 — Modelo de Negócio](#etapa-3--modelo-de-negócio)

---

# ETAPA 3 — MODELO DE NEGÓCIO

## 💰 Visão Geral do Modelo

O **iBora Mobilidade** é um **marketplace bilateral** que conecta:
- **Oferta:** Motoristas com carro e tempo
- **Demanda:** Passageiros que precisam se locomover

**Premissa fundamental:** A plataforma **facilita a transação** e **garante confiança**, cobrando uma **comissão justa** por este serviço.

---

## 🏦 COMO A PLATAFORMA GANHA DINHEIRO

### 1. **Comissão sobre corridas** (Receita Principal — 85%)

#### Mecânica
```
Valor da corrida: R$ 20,00
├─ Motorista recebe: R$ 17,00 (85%)
└─ Plataforma recebe: R$ 3,00 (15%)
```

#### Estrutura de comissão variável
| Categoria de Motorista | Comissão Plataforma | Motorista Recebe |
|------------------------|---------------------|------------------|
| **Iniciante** (< 100 corridas) | 15% | 85% |
| **Regular** (100-500 corridas) | 13% | 87% |
| **Premium** (> 500 corridas + nota > 4.7) | 12% | 88% |
| **Elite** (> 1000 corridas + nota > 4.8) | 10% | 90% |

**Por quê comissão variável?**
- ✅ Incentiva **volume** e **qualidade**
- ✅ Cria **lealdade** (quanto mais trabalha, menos paga)
- ✅ Diferencia de Uber/99 (comissão fixa de 25%)
- ✅ Compensa custo de aquisição ao longo do tempo

#### Comparação com concorrentes
| Plataforma | Comissão Média | Motorista Recebe |
|------------|----------------|------------------|
| **Uber** | 25% | 75% |
| **99** | 20-25% | 75-80% |
| **iBora (Regular)** | 13% | 87% |
| **iBora (Elite)** | 10% | 90% |

**Impacto financeiro:**
```
Exemplo: Motorista Roberto (M1) - 400 corridas/mês

UBER:
- Faturamento bruto: R$ 6.000
- Comissão (25%): -R$ 1.500
- Líquido (antes custos): R$ 4.500

iBORA:
- Faturamento bruto: R$ 6.000
- Comissão (13%): -R$ 780
- Líquido (antes custos): R$ 5.220
- Diferença: +R$ 720/mês (+ R$ 8.640/ano!)
```

---

### 2. **Assinatura Passageiro "iBora Pass"** (Receita Secundária — 8%)

#### Planos
| Plano | Preço/mês | Benefício |
|-------|-----------|-----------|
| **Pass Básico** | R$ 49/mês | 10 viagens curtas (<5km) grátis/mês |
| **Pass Plus** | R$ 89/mês | 20 viagens curtas + 10% desconto em todas |
| **Pass Premium** | R$ 149/mês | Viagens ilimitadas curtas + 15% desconto |

**Público-alvo:**
- Persona P1 (Júlia): 8-12 viagens/mês → **Pass Básico** (economia de R$ 30/mês)
- Persona P2 (Carlos): trajeto casa-trabalho → **Pass Plus** (economia de R$ 60/mês)

**Por quê assinatura?**
- ✅ **Receita recorrente** previsível (MRR)
- ✅ **Reduz CAC** (customer acquisition cost) ao longo do tempo
- ✅ **Aumenta LTV** (lifetime value)
- ✅ **Cria barreira de saída** (sunk cost)

**Cálculo de viabilidade:**
```
Pass Básico (R$ 49/mês):
- Cliente usa 10 viagens de R$ 12 = R$ 120 valor total
- Custo para iBora: R$ 120 - R$ 49 = R$ 71
- Margem iBora: 13% de R$ 120 = R$ 15,60
- Resultado: R$ 49 - R$ 15,60 = R$ 33,40 lucro líquido
- Motorista ganha: R$ 120 (custo é da plataforma)
```

---

### 3. **Crédito Pré-Pago Motorista** (Receita Terciária — 4%)

#### Mecânica
Motoristas podem recarregar "créditos de uso" para rodar sem descontar do faturamento.

**Exemplo:**
```
Motorista compra R$ 100 de crédito
├─ Usa crédito para operar (sem custo por corrida)
├─ Ganha 100% do valor da corrida
└─ Plataforma já recebeu adiantado
```

**Vantagens para motorista:**
- ✅ Não desconta comissão por corrida
- ✅ Ganha **100%** do valor da corrida
- ✅ Gestão de caixa facilitada
- ✅ Pode comprar crédito com desconto (R$ 100 → R$ 110 de crédito)

**Vantagens para plataforma:**
- ✅ **Cashflow antecipado** (recebe antes de prestar serviço)
- ✅ **Reduz risco** de inadimplência
- ✅ **Fideliza** motorista (sunk cost)

**Planos de crédito:**
| Recarga | Bônus | Crédito Total | Economia |
|---------|-------|---------------|----------|
| R$ 50 | 0% | R$ 50 | R$ 0 |
| R$ 100 | 5% | R$ 105 | R$ 5 |
| R$ 200 | 10% | R$ 220 | R$ 20 |
| R$ 500 | 15% | R$ 575 | R$ 75 |

---

### 4. **Parcerias Locais (Afiliados)** (Receita Quaternária — 3%)

#### Mecânica
Estabelecimentos locais pagam para aparecer no app como "Parceiros iBora".

**Exemplos:**
- 🍔 **Restaurante:** "Chegue de iBora e ganhe 10% de desconto"
- ⛽ **Posto de combustível:** "Motoristas iBora: R$ 0,20/litro de desconto"
- 🔧 **Oficina:** "Revisão com 15% off para motoristas iBora"

**Modelo de cobrança:**
- Taxa mensal: R$ 200-500/mês por parceiro
- OU: Comissão sobre vendas (5-10%)

**Win-win-win:**
- ✅ **Parceiro:** atrai clientes novos
- ✅ **Usuário:** ganha benefício real
- ✅ **iBora:** receita adicional + diferenciação

---

## 🚗 COMO O MOTORISTA GANHA DINHEIRO

### Fontes de receita do motorista

#### 1. **Corridas (principal)**
```
Corrida de R$ 20
- Motorista recebe: R$ 17 (85%)
- Plataforma: R$ 3 (15%)
```

#### 2. **Gorjetas (opcional)**
```
Passageiro pode dar gorjeta:
- 5% (R$ 1)
- 10% (R$ 2)
- 15% (R$ 3)
- Valor livre

Motorista recebe: 100% da gorjeta
```

#### 3. **Bônus e incentivos** (ver Etapa 8)
```
Exemplos:
- Bônus por meta: +R$ 200 ao fazer 100 corridas/semana
- Cashback combustível: 5% de volta
- Prêmio consistência: +R$ 100 por 20 dias ativos/mês
```

#### 4. **Benefícios em espécie**
```
- Desconto combustível: economia de R$ 100-200/mês
- Desconto manutenção: economia de R$ 50-150/mês
- Seguro subsidiado: economia de R$ 50/mês
```

### Exemplo prático: Motorista Roberto (M1)

**Cenário 1: Full-time (Roberto)**
```
Trabalho: 10h/dia, 25 dias/mês
Corridas: 20/dia × 25 = 500/mês
Valor médio: R$ 15/corrida
Faturamento bruto: R$ 7.500/mês

CUSTOS:
├─ Combustível (250L × R$ 5,50): -R$ 1.375
├─ Manutenção: -R$ 300
├─ Seguro: -R$ 200
├─ Depreciação: -R$ 400
└─ Total custos: -R$ 2.275

UBER (comissão 25%):
├─ Faturamento: R$ 7.500
├─ Comissão: -R$ 1.875
├─ Custos: -R$ 2.275
└─ Líquido: R$ 3.350/mês

iBORA (comissão 13% + benefícios):
├─ Faturamento: R$ 7.500
├─ Comissão: -R$ 975
├─ Custos: -R$ 2.275
├─ Desconto combustível: +R$ 150
├─ Desconto manutenção: +R$ 100
├─ Bônus meta: +R$ 200
└─ Líquido: R$ 4.700/mês

DIFERENÇA: +R$ 1.350/mês (40% mais!)
```

**Cenário 2: Part-time (Mariana — M2)**
```
Trabalho: 5h/dia, 20 dias/mês
Corridas: 10/dia × 20 = 200/mês
Valor médio: R$ 18/corrida
Faturamento bruto: R$ 3.600/mês

CUSTOS:
├─ Combustível (80L × R$ 5,50): -R$ 440
├─ Manutenção: -R$ 120
├─ Seguro (proporcional): -R$ 80
└─ Total custos: -R$ 640

UBER (comissão 25%):
├─ Faturamento: R$ 3.600
├─ Comissão: -R$ 900
├─ Custos: -R$ 640
└─ Líquido: R$ 2.060/mês

iBORA (comissão 15% iniciante):
├─ Faturamento: R$ 3.600
├─ Comissão: -R$ 540
├─ Custos: -R$ 640
├─ Desconto combustível: +R$ 50
└─ Líquido: R$ 2.470/mês

DIFERENÇA: +R$ 410/mês (20% mais!)
```

---

## 💳 ONDE ENTRAM: COMISSÃO, TAXAS, RECARGA, MULTAS

### 1. **Comissão** (take rate)

**Quando é cobrada:**
- ✅ Em **toda corrida finalizada**
- ✅ **Descontada automaticamente** antes do repasse
- ✅ Aparece **transparente** no recibo

**Quando NÃO é cobrada:**
- ❌ Corrida cancelada (por qualquer motivo)
- ❌ Corrida não iniciada
- ❌ Gorjetas

**Como é calculada:**
```python
# Pseudocódigo
valor_corrida = 20.00
categoria_motorista = obter_categoria(motorista_id)

if categoria_motorista == "INICIANTE":
    taxa_comissao = 0.15
elif categoria_motorista == "REGULAR":
    taxa_comissao = 0.13
elif categoria_motorista == "PREMIUM":
    taxa_comissao = 0.12
else:  # ELITE
    taxa_comissao = 0.10

comissao = valor_corrida * taxa_comissao
motorista_recebe = valor_corrida - comissao
```

---

### 2. **Taxas** (quando aplicáveis)

#### Taxa de saque antecipado (D+0)
```
Valor a sacar: R$ 500
Taxa (1.5%): -R$ 7,50
Valor líquido: R$ 492,50

Default: D+2 (sem taxa)
```

#### Taxa de pagamento (depende do método)

| Método | Taxa para iBora | Taxa para Motorista |
|--------|-----------------|---------------------|
| **PIX** | 0% | 0% |
| **Dinheiro** | 0% | 0% |
| **Cartão crédito** | 2.5% | 0% (absorvido) |
| **Cartão débito** | 1.2% | 0% (absorvido) |

**Decisão estratégica:**
- iBora **absorve** taxas de cartão (não repassa para motorista)
- Incentiva **PIX** (custo zero, liquidação D+2)
- Aceita **cash** sem restrições (inclusão financeira)

---

### 3. **Recarga de uso** (crédito pré-pago)

**Como funciona:**
1. Motorista compra crédito (ex: R$ 100)
2. Crédito entra na **wallet de uso**
3. A cada corrida, **não há desconto de comissão**
4. Motorista ganha **100% do valor** da corrida
5. Crédito é debitado da wallet

**Exemplo prático:**
```
Wallet de uso: R$ 100 (comprado)

Corrida 1: R$ 20
├─ Motorista ganha: R$ 20 (100%)
├─ Wallet de uso: R$ 100 - R$ 2,60 (13%) = R$ 97,40
└─ Saldo motorista: +R$ 20

Corrida 2: R$ 15
├─ Motorista ganha: R$ 15 (100%)
├─ Wallet de uso: R$ 97,40 - R$ 1,95 (13%) = R$ 95,45
└─ Saldo motorista: +R$ 15

Total ganho: R$ 35
Crédito usado: R$ 4,55
Crédito restante: R$ 95,45
```

**Por quê o motorista faria isso?**
- ✅ Compra com **bônus** (R$ 100 → R$ 110 de crédito)
- ✅ **Cashflow**: paga uma vez, usa ao longo do mês
- ✅ **Simplicidade**: não fica "devendo" para plataforma
- ✅ **Controle**: sabe exatamente quanto tem de crédito

---

### 4. **Multas e Cancelamentos**

#### Cancelamento por culpa do motorista
```
Situação: Motorista aceita e cancela 3x seguidas

Punição:
├─ 1º cancelamento: aviso
├─ 2º cancelamento: prioridade reduzida por 2h
└─ 3º+ cancelamento: prioridade reduzida por 24h

Não há multa financeira, apenas impacto na priorização.
```

#### Cancelamento por culpa do passageiro
```
Situação 1: Passageiro cancela após 5 minutos
- Cobra taxa de cancelamento: R$ 5
- Motorista recebe: R$ 5
- Plataforma: R$ 0

Situação 2: Passageiro não comparece (no-show)
- Cobra taxa de no-show: R$ 8
- Motorista recebe: R$ 8
- Plataforma: R$ 0
```

#### Multas por comportamento inadequado
```
Motorista:
├─ Direção perigosa (comprovada): suspensão 7 dias
├─ Assédio/abuso: desligamento permanente
└─ Fraude (corrida falsa): desligamento + bloqueio CPF

Passageiro:
├─ Comportamento inadequado: advertência
├─ Dano ao veículo: cobrança do reparo
└─ Assédio/abuso: bloqueio permanente
```

**Princípio:** Multas **não são fonte de receita**. São **punitivas** para coibir mau comportamento.

---

## 🏦 ESTRATÉGIA D+N (SETTLEMENT)

### Por quê D+N existe?

**Razões operacionais:**
1. **Contestações:** passageiro pode contestar cobrança (até 48h)
2. **Fraude:** tempo para detectar padrões suspeitos
3. **Reconciliação:** garantir que pagamento foi confirmado
4. **Cashflow:** plataforma precisa receber antes de pagar

**Risco mitigado:**
- ❌ **SEM D+N:** plataforma paga motorista, passageiro contesta, plataforma perde
- ✅ **COM D+N:** tempo para validar transação antes de repassar

---

### Modelo iBora: D+2 padrão

| Dia | Evento |
|-----|--------|
| **Segunda** | Corrida realizada, pagamento capturado |
| **Terça** | Período de contestação (24h) |
| **Quarta** | Transferência para motorista (D+2) |

**Exceção: Saque antecipado D+0**
- Motorista pode sacar imediatamente
- Taxa: 1.5% do valor
- Útil para emergências

---

### Comparação com concorrentes

| Plataforma | Settlement Padrão | Saque Antecipado |
|------------|-------------------|------------------|
| **Uber** | D+7 (semanal) | D+0 (taxa 2%) |
| **99** | D+7 (semanal) | D+0 (taxa 1.5%) |
| **iBora** | **D+2** | D+0 (taxa 1.5%) |

**Vantagem competitiva:** iBora paga **5 dias mais rápido** que concorrentes.

---

## 💰 TRADE-OFFS: CASH vs PIX vs CARTÃO

### Análise comparativa

| Aspecto | Cash 💵 | Pix 📱 | Cartão 💳 |
|---------|---------|--------|-----------|
| **Custo para plataforma** | R$ 0 | R$ 0 | 2.5% (crédito) |
| **Liquidação** | Imediato | D+0 | D+30 (crédito) |
| **Risco de fraude** | Alto | Baixo | Médio |
| **Inclusão financeira** | Alta | Média | Baixa |
| **Gestão de caixa (motorista)** | Complexa | Simples | N/A |
| **Preferência passageiro** | Alta (Brasil) | Crescente | Média |

---

### Estratégia por método de pagamento

#### 1. **PIX (prioritário)** 📱

**Vantagens:**
- ✅ Custo **zero**
- ✅ Liquidação **instantânea**
- ✅ Rastreabilidade **total**
- ✅ Integração com **Efí Bank**

**Desvantagens:**
- ⚠️ Requer conta bancária
- ⚠️ Nem todos passageiros têm Pix

**Incentivos:**
```
- Passageiro paga com Pix: ganha 2% cashback
- Motorista recebe Pix: settlement D+2 (grátis)
```

---

#### 2. **Dinheiro (inclusivo)** 💵

**Vantagens:**
- ✅ Inclusão financeira (idosos, classe D/E)
- ✅ Sem taxas
- ✅ Imediato para motorista

**Desvantagens:**
- ⚠️ Risco de roubo
- ⚠️ Gestão de caixa complexa
- ⚠️ Difícil auditar

**Solução iBora: Sistema de gestão de caixa**
```
1. Motorista recebe R$ 50 em dinheiro
2. Deposita em parceiro (padaria, lotérica)
3. Parceiro credita na wallet iBora
4. Motorista pode sacar Pix ou usar como crédito
```

**Parceiros de depósito:**
- 🏪 Padarias locais
- 🎫 Lotéricas
- ⛽ Postos de combustível
- Comissão para parceiro: R$ 1 por depósito

---

#### 3. **Cartão (conveniência)** 💳

**Vantagens:**
- ✅ Conveniência (parcelamento)
- ✅ Preferência de classe B/C
- ✅ Segurança (chargeback)

**Desvantagens:**
- ⚠️ Taxa alta (2.5%)
- ⚠️ Settlement D+30
- ⚠️ Risco de contestação

**Estratégia:**
```
- iBora absorve taxa (não repassa para motorista)
- Libera para motorista em D+2 (mesmo com cartão)
- Assume risco de contestação
```

**Trade-off:**
```
Corrida R$ 20 (cartão):
├─ Passageiro paga: R$ 20
├─ Adquirente cobra: -R$ 0,50 (2.5%)
├─ Plataforma recebe: R$ 19,50
├─ Comissão iBora: R$ 2,60 (13%)
├─ Motorista recebe: R$ 17,40
└─ Custo real iBora: R$ 0,50 - R$ 2,60 = -R$ 2,10

Margem negativa em cartão!
Compensado por:
1. Volume (escala)
2. Pix e cash (margem positiva)
3. Fidelização (LTV > CAC)
```

---

## 📊 MODELO FINANCEIRO CONSOLIDADO

### Receitas (por corrida de R$ 20)

```
PIX/CASH:
├─ Valor corrida: R$ 20,00
├─ Comissão (13%): R$ 2,60
├─ Custo operacional: R$ 0,20
└─ Margem bruta: R$ 2,40 (12%)

CARTÃO:
├─ Valor corrida: R$ 20,00
├─ Taxa adquirente: -R$ 0,50
├─ Comissão (13%): R$ 2,60
├─ Custo operacional: R$ 0,20
└─ Margem bruta: R$ 1,90 (9.5%)
```

### Projeção mensal (cidade-piloto, mês 12)

```
PREMISSAS:
- 200 motoristas ativos
- 50 corridas/motorista/mês
- Total: 10.000 corridas/mês
- Valor médio: R$ 18/corrida
- Mix: 60% Pix, 30% Cash, 10% Cartão

RECEITAS:
├─ Comissões: R$ 23.400 (13% de R$ 180k GMV)
├─ Assinaturas: R$ 4.900 (100 Pass × R$ 49)
├─ Crédito pré-pago: R$ 3.000 (margem sobre recargas)
├─ Parcerias: R$ 2.500 (10 parceiros × R$ 250)
└─ RECEITA TOTAL: R$ 33.800/mês

CUSTOS:
├─ Infraestrutura (AWS): R$ 2.000
├─ Pagamentos (Efí): R$ 500
├─ Suporte (2 pessoas): R$ 6.000
├─ Marketing: R$ 8.000
├─ Operações: R$ 3.000
└─ CUSTO TOTAL: R$ 19.500/mês

EBITDA: R$ 14.300/mês (42% margem)
```

---

## 🎯 DECISÕES ESTRATÉGICAS FINAIS

### 1. **Priorização de métodos de pagamento**
```
MVP:
✅ Pix (prioritário)
✅ Cash (inclusão)
⏳ Cartão (pós-MVP)
```

### 2. **Modelo de comissão**
```
✅ Variável por categoria (10-15%)
✅ Transparente (aparece no app)
✅ Sem taxas escondidas
```

### 3. **Settlement**
```
✅ D+2 padrão (grátis)
✅ D+0 opcional (taxa 1.5%)
```

### 4. **Gestão de caixa**
```
✅ Parceiros de depósito
✅ Wallet unificada
✅ Crédito de uso com bônus
```

---

✅ **Etapa 3 concluída:** Modelo de negócio completo com viabilidade financeira comprovada  
📍 **Próxima etapa:** [ETAPA 4 — Análise de Mercado](#etapa-4--análise-de-mercado)

---

# ETAPA 4 — ANÁLISE DE MERCADO

## 🌍 Contexto do Mercado Brasileiro de Mobilidade

### Dados macroeconômicos (2024-2025)

| Métrica | Valor | Fonte |
|---------|-------|-------|
| **Mercado total** | R$ 12 bi/ano | Pesquisas acadêmicas |
| **Uber market share** | ~70% | Dominância estabelecida |
| **99 market share** | ~25% | Segunda posição |
| **Outros** | ~5% | Fragmentado |
| **Usuários ativos** | 40+ milhões | Pesquisas TCCs analisados |
| **Motoristas ativos** | 1,2+ milhões | UFPR 2021 |
| **Corridas/ano** | 2+ bilhões | Estimativa |

### Tendências identificadas

1. **Migração do transporte público** 📊
   - Mais de **60% dos usuários** vieram do transporte público
   - Motivo: **preço** + **confiabilidade** + **segurança**

2. **Precarização do trabalho** ⚠️
   - Motoristas ganham **menos que no passado**
   - Comissões **aumentaram** (de 15% para 25%)
   - **Menos autonomia** (controle algorítmico)

3. **Saturação em grandes centros** 🏙️
   - SP, RJ: mercado maduro, competição alta
   - Cidades médias: **oportunidade** de crescimento

4. **Crescimento do Pix** 💳
   - Adoção massiva (2021-2025)
   - Reduz custo de transação
   - Facilita entrada de novos players

---

## 🏆 CONCORRENTES DIRETOS

### 1. **UBER** — O Gigante Global

#### Perfil
- **Fundação:** 2009 (EUA), 2014 (Brasil)
- **Valuation:** ~US$ 150 bi (global)
- **Operação Brasil:** SP, RJ, BH, Brasília, Porto Alegre + capitais
- **Foco:** Grandes centros urbanos
- **Categoria:** Premium a popular (UberX, Black, Moto)

#### Pontos Fortes ✅
- **Brand awareness** massivo
- **Network effect** estabelecido
- **Tecnologia** de ponta (maps, routing)
- **Capital** abundante
- **Liquidez** alta (sempre tem motorista)

#### Pontos Fracos ❌
- **Comissão abusiva** (25%)
- **Relacionamento** ruim com motoristas
- **Tarifa dinâmica** agressiva (até 3x)
- **Atendimento** ruim (chatbot, tickets)
- **Desligamento** automático por nota baixa
- **Pouca presença** em cidades médias

#### Vulnerabilidades 🎯
- **Motoristas insatisfeitos** (alta rotatividade)
- **Marca desgastada** (imagem de exploração)
- **Custos altos** de marketing para manter dominância
- **Regulação** crescente (lei de motoristas)

#### Diferenciação iBora vs Uber
| Aspecto | Uber | iBora | Vantagem |
|---------|------|-------|----------|
| Comissão | 25% | 12-15% | iBora (**10-13% menos!**) |
| Settlement | D+7 | D+2 | iBora (**5 dias mais rápido**) |
| Autonomia | Baixa | Alta | iBora (**sem punição por recusa**) |
| Transparência | Opaca | Total | iBora (**vê destino antes**) |
| Atendimento | Chatbot | Humano | iBora (**WhatsApp + telefone**) |
| Presença regional | Baixa | Foco | iBora (**cidades médias**) |

---

### 2. **99 (DiDi)** — O Challenger Local

#### Perfil
- **Fundação:** 2012 (Brasil)
- **Aquisição:** DiDi Chuxing (China, 2018)
- **Operação Brasil:** Similar à Uber
- **Foco:** Competição agressiva com Uber
- **Categoria:** 99Pop, 99Top, 99Táxi

#### Pontos Fortes ✅
- **Origem brasileira** (identificação local)
- **Preço competitivo** vs Uber
- **Parcerias** com taxistas
- **Marketing** agressivo
- **Cashback** e promoções frequentes

#### Pontos Fracos ❌
- **Comissão alta** (20-25%)
- **Instabilidade** (menos motoristas que Uber)
- **Tecnologia inferior** (app menos polido)
- **Mesmo modelo exploratório** que Uber
- **Dependência** de subsídio chinês

#### Vulnerabilidades 🎯
- **Competição direta** com Uber (briga pela mesma fatia)
- **Não diferencia** no tratamento do motorista
- **Cashflow negativo** (precisa queimar dinheiro)

#### Diferenciação iBora vs 99
| Aspecto | 99 | iBora | Vantagem |
|---------|-----|-------|----------|
| Comissão | 20-25% | 12-15% | iBora (**8-13% menos!**) |
| Modelo | Copycat Uber | Original | iBora (**proposta única**) |
| Foco | Competir Uber | Servir motorista | iBora (**valores claros**) |
| Sustentabilidade | Queima caixa | Lucrativo | iBora (**modelo sustentável**) |

---

## 📊 TABELA COMPARATIVA COMPLETA

| Aspecto | Uber | 99 | Táxi | iBora |
|---------|------|-----|------|-------|
| **PREÇO (trajeto 5km)** | R$ 15-20 | R$ 14-19 | R$ 25-30 | **R$ 12-16** ✅ |
| **Comissão motorista** | 25% ❌ | 20-25% ❌ | 0% ✅ | **12-15%** ✅ |
| **Settlement** | D+7 ❌ | D+7 ❌ | Imediato ✅ | **D+2** ✅ |
| **Transparência** | Baixa ❌ | Baixa ❌ | N/A | **Alta** ✅ |
| **Autonomia motorista** | Baixa ❌ | Baixa ❌ | Alta ✅ | **Alta** ✅ |
| **Atendimento** | Chatbot ❌ | Chatbot ❌ | N/A | **Humano** ✅ |
| **Pagamento** | Pix, Cartão | Pix, Cartão, Dinheiro | Dinheiro | **Todos** ✅ |
| **Disponibilidade** | Alta ✅ | Média | Baixa ❌ | Crescente ⚠️ |
| **Cidades cobertas** | 100+ ✅ | 80+ ✅ | Todas ✅ | **Médias** 🎯 |
| **Presença regional** | Baixa ❌ | Baixa ❌ | Alta ✅ | **Alta** ✅ |
| **Parcerias locais** | Nenhuma ❌ | Poucas | N/A | **Muitas** ✅ |
| **Incentivos reais** | Raros ❌ | Promoções | N/A | **Estruturados** ✅ |

---

## 🎯 O QUE ELES FAZEM MAL

### **UBER faz mal:**
1. **Exploração sistemática** de motoristas (comissão 25%)
2. **Sistema punitivo** de avaliação (desligamento automático)
3. **Tarifa dinâmica abusiva** (até 3x em horários de pico)
4. **Atendimento péssimo** (chatbot que não resolve)
5. **Falta de transparência** (motorista não sabe destino)
6. **Zero parcerias locais** (não integra com economia local)

### **99 faz mal:**
1. **Copycat sem inovação** (copia Uber em tudo)
2. **Comissão ainda alta** (20-25%)
3. **Subsídio insustentável** (queima caixa para competir)
4. **Tecnologia inferior** (app instável)
5. **Mesmo modelo exploratório** que Uber

---

## 💡 ONDE IBORA SE DIFERENCIA

### 1. **Comissão Justa** (10-13% menos que concorrentes)
### 2. **Pagamento Rápido** (D+2 vs D+7 — 5 dias mais rápido)
### 3. **Autonomia Real** (sem punição por recusa)
### 4. **Transparência Total** (vê destino e valor antes de aceitar)
### 5. **Presença Regional** (foco em cidades médias)
### 6. **Parcerias Locais** (integração com economia local)
### 7. **Incentivos Reais** (sistema estruturado, não queima de caixa)

---

✅ **Etapa 4 concluída:** Análise de mercado completa com posicionamento competitivo claro  
📍 **Próxima etapa:** [ETAPA 5 — UX, Layout e Linguagem Visual](#etapa-5--ux-layout-e-linguagem-visual)

---

# ETAPA 5 — UX, LAYOUT E LINGUAGEM VISUAL

## 🎨 PRINCÍPIOS DE DESIGN DO IBORA

### Filosofia central
> **"Simplicidade com propósito. Transparência com respeito."**

O iBora não é um app de tecnologia que virou mobilidade.  
É um app de **mobilidade** que usa tecnologia **a serviço das pessoas**.

---

## 📐 DIRETRIZES DE UX

### 1. **Tom de Linguagem**

#### Para o App do Passageiro
**Tom:** Informal, amigável, confiável

**Características:**
- ✅ "Você" (tutear)
- ✅ Linguagem coloquial brasileira
- ✅ Emojis moderados (quando adequados)
- ✅ Mensagens curtas e diretas
- ❌ Jargões técnicos
- ❌ Corporativismo frio

**Exemplos:**
```
❌ "Seu veículo será alocado em instantes"
✅ "Já estamos procurando um motorista pra você!"

❌ "Transação processada com sucesso"
✅ "Prontinho! Já pagamos o motorista 😊"

❌ "Erro no processamento da solicitação"
✅ "Ops! Algo deu errado. Vamos tentar de novo?"
```

---

#### Para o App do Motorista
**Tom:** Respeitoso, direto, transparente

**Características:**
- ✅ "Você" (tutear, mas com respeito)
- ✅ Informação clara e objetiva
- ✅ Números visíveis (ganhos, distância, tempo)
- ✅ Zero enrolação
- ❌ Paternalismo
- ❌ Gamificação excessiva
- ❌ Promessas vazias

**Exemplos:**
```
❌ "Você está próximo de virar Gold! Continue assim!"
✅ "Faltam 15 corridas para categoria Premium (comissão 12%)"

❌ "Oportunidade incrível!"
✅ "Nova corrida: Shopping → Centro, R$ 18, 4.5km"

❌ "O passageiro está aguardando"
✅ "Passageiro: Ana (4.8⭐). Distância até ela: 800m, 2min"
```

---

#### Para o Admin Panel
**Tom:** Profissional, técnico, eficiente

**Características:**
- ✅ Terminologia técnica (quando necessário)
- ✅ Dados estruturados
- ✅ Ações claras
- ✅ Logs completos
- ❌ Simplicidade excessiva
- ❌ Linguagem infantilizada

---

### 2. **Simplicidade vs Densidade de Informação**

#### Princípio: "Progressive Disclosure"
> Mostre o essencial. Esconda o complexo. Permita acesso ao detalhe.

**Hierarquia de informação:**
```
Nível 1 (sempre visível):
└─ Ação principal + contexto mínimo

Nível 2 (1 toque):
└─ Detalhes importantes

Nível 3 (2+ toques):
└─ Informações complementares, histórico, ajuda
```

**Exemplo: Tela de aceitar corrida (motorista)**
```
NÍVEL 1 (tela principal):
┌─────────────────────────────┐
│  Nova Corrida               │
│                             │
│  🏠 → 🏢                    │
│  Rua ABC → Shopping         │
│                             │
│  💰 R$ 18,00                │
│  📍 4.5 km • 12 min         │
│                             │
│  [ACEITAR]  [RECUSAR]       │
└─────────────────────────────┘

NÍVEL 2 (expandir):
├─ Passageiro: Ana Silva
├─ Avaliação: 4.8⭐ (120 corridas)
├─ Pagamento: Pix
├─ Distância até passageiro: 800m
└─ Horário de chegada estimado: 14:35

NÍVEL 3 (detalhes):
└─ Rota completa no mapa
```

---

### 3. **Fluxos Prioritários**

#### **Passageiro — Fluxo Crítico #1: Solicitar Corrida**
```
1. Abre app
2. Vê localização atual (auto-detectada)
3. Define destino (busca ou mapa)
4. Vê preço FIXO estimado
5. Confirma
6. Aguarda aceite (< 30s esperado)
7. Acompanha motorista chegando
8. Entra no carro
9. Corrida em andamento
10. Chega ao destino
11. Pagamento automático
12. Avalia motorista (opcional)
```

**Tempo total esperado (do app ao destino):** < 20 minutos (trajeto 5km)

---

#### **Motorista — Fluxo Crítico #1: Aceitar e Realizar Corrida**
```
1. Abre app → entra online
2. Recebe notificação de corrida
3. VÊ destino + valor + distância
4. Decide aceitar ou recusar (sem punição)
5. [SE ACEITAR] Navega até passageiro
6. Confirma chegada
7. Passageiro entra → inicia corrida
8. Navega até destino
9. Finaliza corrida
10. Valor cai na wallet (visível)
11. Avalia passageiro (opcional)
```

**Tempo médio de decisão (passo 4):** < 10 segundos

---

#### **Motorista — Fluxo Crítico #2: Sacar Dinheiro**
```
1. Entra em "Wallet"
2. Vê saldo disponível
3. Escolhe "Sacar"
4. Escolhe método:
   ├─ Pix (D+2, grátis) [DEFAULT]
   └─ Pix Antecipado (D+0, taxa 1.5%)
5. Confirma valor + chave Pix
6. Recebe confirmação
7. Dinheiro cai na conta
```

**Tempo esperado (na plataforma):** < 2 minutos

---

### 4. **Densidade de Informação por Perfil**

| Perfil | Densidade | Justificativa |
|--------|-----------|---------------|
| **Passageiro** | BAIXA | Quer rapidez, não complexidade |
| **Motorista** | MÉDIA-ALTA | Precisa tomar decisões informadas |
| **Admin** | ALTA | Operação e troubleshooting |

---

## 📱 LISTA DE TELAS — APP PASSAGEIRO

### **Categoria: Onboarding**

#### **P1.1 — Splash Screen**
- **Objetivo:** Carregamento inicial + verificação de login
- **Ação principal:** Automática (transição)
- **Erros possíveis:**
  - Sem internet → Mostra mensagem "Sem conexão. Tentando novamente..."
  - Erro no servidor → "Estamos com problemas. Tente novamente em instantes"

---

#### **P1.2 — Boas-vindas / Login**
- **Objetivo:** Apresentar app + autenticar usuário
- **Ação principal:** "Entrar com celular" (Pix/SMS)
- **Componentes:**
  - Logo iBora
  - Tagline: "Mobilidade justa pra você"
  - Input: Número de celular
  - Botão: "Continuar"
  - Link: "Criar conta"
- **Erros possíveis:**
  - Número inválido → "Confira o número do celular"
  - SMS não chegou → Botão "Reenviar código"

---

#### **P1.3 — Verificação SMS**
- **Objetivo:** Validar número de telefone
- **Ação principal:** Inserir código de 6 dígitos
- **Componentes:**
  - Texto: "Enviamos um código para (XX) XXXXX-XXXX"
  - Input: 6 dígitos (auto-complete)
  - Link: "Não recebeu? Reenviar"
- **Erros possíveis:**
  - Código errado → "Código incorreto. Tente novamente"
  - Código expirado → "Código expirou. Solicite um novo"

---

#### **P1.4 — Cadastro Básico** (primeira vez)
- **Objetivo:** Coletar dados mínimos
- **Ação principal:** Preencher nome + aceitar termos
- **Componentes:**
  - Input: Nome completo
  - Input: E-mail (opcional)
  - Checkbox: "Aceito os termos de uso"
  - Botão: "Começar"
- **Erros possíveis:**
  - Nome vazio → "Por favor, insira seu nome"
  - Termos não aceitos → "Você precisa aceitar os termos para continuar"

---

### **Categoria: Home / Solicitação de Corrida**

#### **P2.1 — Tela Principal (Home)**
- **Objetivo:** Solicitar corrida rapidamente
- **Ação principal:** Definir destino
- **Componentes:**
  ```
  ┌─────────────────────────────┐
  │  [☰ Menu]    [👤 Perfil]    │
  ├─────────────────────────────┤
  │                             │
  │       🗺️ MAPA              │
  │  (localização atual)        │
  │                             │
  ├─────────────────────────────┤
  │  📍 Você está em:           │
  │  Rua Example, 123           │
  │                             │
  │  [Para onde vamos?]         │← Input principal
  │                             │
  │  ⏱️ Favoritos:              │
  │  🏠 Casa  🏢 Trabalho       │
  └─────────────────────────────┘
  ```
- **Erros possíveis:**
  - GPS desligado → "Ative a localização para continuar"
  - Fora da área de cobertura → "Ainda não operamos em sua região. Em breve!"

---

#### **P2.2 — Busca de Destino**
- **Objetivo:** Usuário define onde quer ir
- **Ação principal:** Buscar endereço ou selecionar no mapa
- **Componentes:**
  - Input de busca com autocomplete
  - Histórico de destinos recentes
  - Sugestões baseadas em padrão (casa, trabalho)
  - Mapa interativo (pode arrastar pin)
- **Erros possíveis:**
  - Destino não encontrado → "Não encontramos este endereço. Tente outro"
  - Destino = origem → "Você já está neste local!"

---

#### **P2.3 — Confirmação e Preço**
- **Objetivo:** Mostrar preço ANTES de solicitar
- **Ação principal:** Confirmar corrida
- **Componentes:**
  ```
  ┌─────────────────────────────┐
  │  📍 Rua ABC, 123            │
  │   ↓ 4.5 km • ~12 min        │
  │  📍 Shopping Center         │
  │                             │
  │  💰 Preço fixo:             │
  │     R$ 18,00                │
  │     (sem surpresas!)        │
  │                             │
  │  💳 Pagamento: Pix [⌄]      │
  │                             │
  │  [SOLICITAR CORRIDA]        │
  │                             │
  │  ⓘ Tarifa base: R$ 5        │
  │     + R$ 2,50/km            │
  │     + R$ 0,30/min           │
  └─────────────────────────────┘
  ```
- **Erros possíveis:**
  - Sem motoristas disponíveis → "Nenhum motorista disponível agora. Tente novamente em instantes"
  - Erro de pagamento → "Problema com forma de pagamento. Escolha outra"

---

#### **P2.4 — Buscando Motorista**
- **Objetivo:** Feedback visual enquanto procura
- **Ação principal:** Aguardar (loading)
- **Componentes:**
  - Animação de "buscando..."
  - Texto: "Procurando o melhor motorista pra você"
  - Botão: "Cancelar" (sem taxa nos primeiros 30s)
  - Contador: "Aguarde ~30 segundos"
- **Erros possíveis:**
  - Timeout (2 min) → "Não encontramos motorista. Tente novamente?"
  - Muitos cancelamentos → "Vários motoristas recusaram. Vamos tentar de novo?"

---

#### **P2.5 — Motorista Encontrado!**
- **Objetivo:** Apresentar motorista + ETA
- **Ação principal:** Aguardar chegada
- **Componentes:**
  ```
  ┌─────────────────────────────┐
  │  ✅ Motorista a caminho!    │
  │                             │
  │  👤 Roberto Silva           │
  │     ⭐ 4.8 (327 corridas)   │
  │                             │
  │  🚗 Fiat Argo Prata         │
  │     ABC-1234                │
  │                             │
  │  🗺️ [Mapa ao vivo]          │
  │     📍 Chega em ~5 min      │
  │                             │
  │  [💬 Chat]  [📞 Ligar]      │
  │                             │
  │  [Cancelar corrida]         │
  └─────────────────────────────┘
  ```
- **Erros possíveis:**
  - Motorista cancela → "O motorista cancelou. Buscando outro pra você..."
  - Passageiro cancela → Cobra taxa de cancelamento (após 5 min)

---

### **Categoria: Durante a Corrida**

#### **P3.1 — Em Viagem**
- **Objetivo:** Acompanhar trajeto + segurança
- **Ação principal:** Visualizar mapa em tempo real
- **Componentes:**
  ```
  ┌─────────────────────────────┐
  │  🗺️ [Mapa da rota]          │
  │                             │
  │  📍 Destino: Shopping        │
  │     ~8 min restantes        │
  │                             │
  │  🚨 [Compartilhar viagem]   │← DESTAQUE
  │  🚨 [Emergência]            │← BOTÃO VERMELHO
  │                             │
  │  💬 Chat com motorista      │
  └─────────────────────────────┘
  ```
- **Erros possíveis:**
  - Rota desviou muito → Alerta "Rota diferente do esperado. Tudo bem?"
  - Parado muito tempo → "Corrida pausada. Está tudo certo?"

---

#### **P3.2 — Chegada ao Destino**
- **Objetivo:** Confirmar conclusão
- **Ação principal:** Finalizar corrida
- **Componentes:**
  - Mapa com pin no destino
  - Texto: "Chegamos!"
  - Resumo: valor, km rodado, tempo
  - Botão: "Finalizar corrida"
- **Erros possíveis:**
  - Finalizada antes do destino → "Opa, ainda não chegamos. Motorista finalizou por engano?"

---

### **Categoria: Pós-Corrida**

#### **P4.1 — Avaliação e Pagamento**
- **Objetivo:** Coletar feedback + confirmar pagamento
- **Ação principal:** Avaliar motorista
- **Componentes:**
  ```
  ┌─────────────────────────────┐
  │  ✅ Corrida finalizada!     │
  │                             │
  │  💰 Total pago: R$ 18,00    │
  │     Pix → Roberto Silva     │
  │                             │
  │  Como foi sua experiência?  │
  │  ⭐⭐⭐⭐⭐                    │
  │                             │
  │  [Comentário (opcional)]    │
  │                             │
  │  💵 Gorjeta? (opcional)     │
  │  [R$ 2] [R$ 3] [Outro]      │
  │                             │
  │  [ENVIAR]                   │
  └─────────────────────────────┘
  ```
- **Erros possíveis:**
  - Pagamento falhou → "Problema no pagamento. Tentando novamente..."
  - Avaliação enviada sem estrelas → "Por favor, dê uma nota de 1 a 5 estrelas"

---

#### **P4.2 — Recibo Digital**
- **Objetivo:** Fornecer comprovante
- **Ação principal:** Download/compartilhamento
- **Componentes:**
  - Resumo completo da corrida
  - Mapa do trajeto percorrido
  - Breakdown de custos
  - Dados do motorista
  - Botões: [Compartilhar] [Baixar PDF]
- **Erros possíveis:**
  - Sem dados → "Recibo temporariamente indisponível. Tente novamente"

---

### **Categoria: Perfil e Configurações**

#### **P5.1 — Meu Perfil**
- **Objetivo:** Gerenciar dados pessoais
- **Ação principal:** Editar informações
- **Componentes:**
  - Foto de perfil
  - Nome
  - E-mail
  - Telefone
  - Métodos de pagamento
  - Endereços favoritos
- **Erros possíveis:**
  - Foto muito grande → "Foto deve ter no máximo 5MB"
  - E-mail inválido → "E-mail inválido"

---

#### **P5.2 — Histórico de Corridas**
- **Objetivo:** Ver corridas passadas
- **Ação principal:** Consultar detalhes
- **Componentes:**
  - Lista cronológica de corridas
  - Filtros: data, valor, motorista
  - Cada item: origem → destino, valor, data
  - Ao clicar: detalhes completos
- **Erros possíveis:**
  - Lista vazia → "Você ainda não fez nenhuma corrida"

---

#### **P5.3 — Métodos de Pagamento**
- **Objetivo:** Gerenciar formas de pagamento
- **Ação principal:** Adicionar/remover/priorizar
- **Componentes:**
  - Lista de métodos salvos
  - Botão: "Adicionar método"
  - Opções: Pix, Cartão crédito, Cartão débito, Dinheiro
  - Definir padrão
- **Erros possíveis:**
  - Cartão inválido → "Dados do cartão incorretos"
  - Falha ao salvar → "Erro ao salvar. Tente novamente"

---

#### **P5.4 — iBora Pass (Assinatura)**
- **Objetivo:** Gerenciar assinatura
- **Ação principal:** Assinar/cancelar plano
- **Componentes:**
  - Status da assinatura (ativa/inativa)
  - Plano atual
  - Benefícios usados/restantes
  - Opção de upgrade/downgrade
  - Botão: "Cancelar assinatura"
- **Erros possíveis:**
  - Pagamento falhou → "Problema na renovação. Atualize forma de pagamento"

---

#### **P5.5 — Configurações**
- **Objetivo:** Preferências do app
- **Ação principal:** Ajustar configurações
- **Componentes:**
  - Notificações (push, SMS, e-mail)
  - Privacidade (compartilhar dados, localização)
  - Acessibilidade
  - Idioma
  - Ajuda e suporte
  - Sobre o iBora
- **Erros possíveis:**
  - N/A (geralmente sem erros críticos)

---

## 🚗 LISTA DE TELAS — APP MOTORISTA

### **Categoria: Onboarding**

#### **M1.1 — Splash Screen**
- **Objetivo:** Carregamento + verificação de sessão
- **Ação principal:** Automática
- **Erros possíveis:**
  - Sem internet → "Sem conexão"
  - Documentos pendentes → Redireciona para verificação

---

#### **M1.2 — Login Motorista**
- **Objetivo:** Autenticar motorista
- **Ação principal:** Login com celular/e-mail
- **Componentes:**
  - Input: Celular ou e-mail
  - Input: Senha
  - Botão: "Entrar"
  - Link: "Esqueci a senha"
  - Link: "Quero ser motorista iBora"
- **Erros possíveis:**
  - Credenciais inválidas → "E-mail ou senha incorretos"
  - Conta bloqueada → "Sua conta está suspensa. Entre em contato"

---

#### **M1.3 — Cadastro Motorista** (novo motorista)
- **Objetivo:** Iniciar processo de cadastro
- **Ação principal:** Preencher dados pessoais
- **Componentes:**
  - Dados pessoais (nome, CPF, RG, CNH)
  - Dados do veículo (marca, modelo, placa, CRLV, ano)
  - Foto de perfil
  - Selfie com documento
  - Aceite de termos
- **Erros possíveis:**
  - Documento ilegível → "Foto não está clara. Tente novamente"
  - CPF já cadastrado → "Este CPF já está em uso"
  - CNH vencida → "CNH vencida. Renovação necessária"

---

#### **M1.4 — Verificação de Documentos**
- **Objetivo:** Informar status da análise
- **Ação principal:** Aguardar aprovação
- **Componentes:**
  ```
  ┌─────────────────────────────┐
  │  ⏳ Analisando documentos   │
  │                             │
  │  Seu cadastro está em       │
  │  análise. Isso leva até     │
  │  24 horas úteis.            │
  │                             │
  │  Status:                    │
  │  ✅ Dados pessoais          │
  │  ✅ CNH                     │
  │  ⏳ Veículo (em análise)    │
  │  ⏳ Antecedentes criminais  │
  │                             │
  │  📧 Você receberá um e-mail │
  │     quando estiver pronto!  │
  └─────────────────────────────┘
  ```
- **Erros possíveis:**
  - Documentos reprovados → "Documento X foi recusado. Motivo: [...]"

---

### **Categoria: Home / Operação**

#### **M2.1 — Tela Principal (Offline)**
- **Objetivo:** Motorista decide quando trabalhar
- **Ação principal:** Ficar online
- **Componentes:**
  ```
  ┌─────────────────────────────┐
  │  🔴 Você está OFFLINE       │
  │                             │
  │  💰 Ganhos hoje: R$ 0,00    │
  │  📊 Corridas hoje: 0        │
  │                             │
  │  [FICAR ONLINE]             │← BOTÃO PRINCIPAL
  │                             │
  │  🗺️ Mapa de calor:          │
  │     [Mini mapa com demanda] │
  │                             │
  │  🎯 Campanhas ativas:       │
  │  • Bônus 100 corridas/sem   │
  │  • Horário de pico +30%     │
  └─────────────────────────────┘
  ```
- **Erros possíveis:**
  - GPS desligado → "Ative o GPS para ficar online"
  - Documentos vencidos → "Atualize seus documentos para trabalhar"

---

#### **M2.2 — Tela Principal (Online)**
- **Objetivo:** Aguardar corridas + ver status
- **Ação principal:** Receber notificações de corrida
- **Componentes:**
  ```
  ┌─────────────────────────────┐
  │  🟢 ONLINE - Aguardando      │
  │                             │
  │  💰 Ganhos hoje: R$ 143,50  │
  │  📊 Corridas: 8             │
  │  ⭐ Aceitação: 87%          │
  │  📍 KM rodados: 67 km       │
  │                             │
  │  [FICAR OFFLINE]            │
  │                             │
  │  🗺️ Mapa ao vivo            │
  │     [Sua localização]       │
  │     [Corridas próximas]     │
  │                             │
  │  💡 Dica: Região centro     │
  │     tem alta demanda agora  │
  └─────────────────────────────┘
  ```
- **Erros possíveis:**
  - Conexão instável → "Conexão fraca. Você pode perder corridas"

---

#### **M2.3 — Notificação de Nova Corrida** (TELA CRÍTICA)
- **Objetivo:** Motorista decide aceitar ou não
- **Ação principal:** Aceitar ou recusar (SEM PUNIÇÃO)
- **Componentes:**
  ```
  ┌─────────────────────────────┐
  │  🔔 NOVA CORRIDA!           │
  │                             │
  │  👤 Ana Silva (4.8⭐)       │
  │                             │
  │  📍 ORIGEM:                 │
  │     Rua ABC, 123            │
  │     📏 800m de você (~2min) │
  │                             │
  │  📍 DESTINO:                │
  │     Shopping Center         │
  │     📏 4.5 km (~12 min)     │
  │                             │
  │  💰 VOCÊ GANHA: R$ 15,66    │
  │     (Valor total: R$ 18)    │
  │     (Comissão: 13%)         │
  │                             │
  │  💳 Pagamento: Pix          │
  │                             │
  │  ⏱️ [10s] Decide rápido!    │← Timer
  │                             │
  │  [🚫 RECUSAR] [✅ ACEITAR]  │
  └─────────────────────────────┘
  ```
- **Erros possíveis:**
  - Timeout (15s) → Corrida oferecida para outro motorista
  - Outro motorista aceitou antes → "Ops! Outro motorista foi mais rápido"

---

#### **M2.4 — Indo Buscar Passageiro**
- **Objetivo:** Navegar até o passageiro
- **Ação principal:** Confirmar chegada
- **Componentes:**
  ```
  ┌─────────────────────────────┐
  │  🚗 Indo buscar passageiro  │
  │                             │
  │  👤 Ana Silva               │
  │     📞 (11) XXXXX-5678      │
  │                             │
  │  📍 Rua ABC, 123            │
  │     🗺️ [Navegação]          │
  │     📏 Faltam 300m (~1min)  │
  │                             │
  │  💬 [Chat]  📞 [Ligar]      │
  │                             │
  │  [CHEGUEI]                  │← Ao chegar
  │                             │
  │  [Cancelar corrida]         │
  └─────────────────────────────┘
  ```
- **Erros possíveis:**
  - Passageiro não comparece (5min) → "Passageiro não apareceu. Cobrar taxa de no-show?"
  - Motorista cancela → Perda de priorização temporária

---

#### **M2.5 — Em Viagem (Corrida Ativa)**
- **Objetivo:** Navegar até destino
- **Ação principal:** Conduzir com segurança
- **Componentes:**
  ```
  ┌─────────────────────────────┐
  │  🚗 EM VIAGEM               │
  │                             │
  │  📍 Shopping Center         │
  │     🗺️ [Navegação]          │
  │     📏 Faltam 2.3 km (~6min)│
  │                             │
  │  💰 Valor: R$ 15,66         │
  │                             │
  │  [FINALIZAR CORRIDA]        │← Ao chegar
  └─────────────────────────────┘
  ```
- **Erros possíveis:**
  - GPS perdido → "Sinal GPS fraco"
  - Passageiro solicita mudança de destino → "Passageiro quer mudar destino. Aceitar?"

---

### **Categoria: Pós-Corrida**

#### **M3.1 — Avaliação do Passageiro**
- **Objetivo:** Coletar feedback do motorista
- **Ação principal:** Avaliar passageiro
- **Componentes:**
  ```
  ┌─────────────────────────────┐
  │  ✅ Corrida finalizada!     │
  │                             │
  │  💰 VOCÊ GANHOU: R$ 15,66   │
  │     (disponível em D+2)     │
  │                             │
  │  Como foi o passageiro?     │
  │  ⭐⭐⭐⭐⭐                    │
  │                             │
  │  [Comentário (opcional)]    │
  │                             │
  │  [ENVIAR]                   │
  │                             │
  │  [Pular] → Continua online  │
  └─────────────────────────────┘
  ```
- **Erros possíveis:**
  - N/A (avaliação é opcional)

---

### **Categoria: Financeiro (Wallet)**

#### **M4.1 — Minha Wallet** (TELA CRÍTICA)
- **Objetivo:** Ver ganhos e gerenciar saques
- **Ação principal:** Consultar saldo e sacar
- **Componentes:**
  ```
  ┌─────────────────────────────┐
  │  💰 MINHA WALLET            │
  │                             │
  │  💵 SALDO DISPONÍVEL        │
  │     R$ 847,30               │← Grande, destaque
  │     [SACAR]                 │
  │                             │
  │  ⏳ EM PROCESSAMENTO (D+2)  │
  │     R$ 143,50               │
  │     (disponível 18/12)      │
  │                             │
  │  🔒 BLOQUEADO               │
  │     R$ 0,00                 │
  │     (disputas/reversões)    │
  │                             │
  │  ──────────────────────     │
  │  📊 RESUMO SEMANAL:         │
  │  • Corridas: 47             │
  │  • Faturamento: R$ 1.203    │
  │  • Comissão: R$ 156 (13%)   │
  │  • Líquido: R$ 1.047        │
  │                             │
  │  📈 [Ver extrato completo]  │
  └─────────────────────────────┘
  ```
- **Erros possíveis:**
  - Saldo insuficiente para saque → "Saldo mínimo: R$ 50"

---

#### **M4.2 — Saque**
- **Objetivo:** Transferir saldo para conta bancária
- **Ação principal:** Solicitar saque
- **Componentes:**
  ```
  ┌─────────────────────────────┐
  │  💸 SACAR                   │
  │                             │
  │  Saldo disponível:          │
  │  R$ 847,30                  │
  │                             │
  │  Valor a sacar:             │
  │  [R$ ______]                │
  │                             │
  │  Método de saque:           │
  │  ⚪ Pix D+2 (GRÁTIS) ✅     │
  │  ⚪ Pix D+0 (taxa 1.5%)     │
  │                             │
  │  Chave Pix:                 │
  │  [CPF: 123.456.789-00]      │
  │  [Alterar]                  │
  │                             │
  │  ──────────────────────     │
  │  Você receberá:             │
  │  💰 R$ 847,30               │
  │  📅 18/12/2025 (quarta)     │
  │                             │
  │  [CONFIRMAR SAQUE]          │
  └─────────────────────────────┘
  ```
- **Erros possíveis:**
  - Chave Pix inválida → "Chave Pix não encontrada"
  - Valor abaixo do mínimo → "Valor mínimo: R$ 50"
  - Erro na transferência → "Falha ao processar. Tente novamente"

---

#### **M4.3 — Extrato**
- **Objetivo:** Ver histórico financeiro completo
- **Ação principal:** Consultar transações
- **Componentes:**
  - Lista cronológica (mais recente primeiro)
  - Filtros: data, tipo (ganho, saque, bônus)
  - Cada item: valor, tipo, data, status
  - Exportar PDF/CSV
- **Erros possíveis:**
  - Lista vazia → "Nenhuma transação ainda"

---

#### **M4.4 — Crédito de Uso** (Recarga Pré-paga)
- **Objetivo:** Comprar crédito para operar
- **Ação principal:** Recarregar crédito
- **Componentes:**
  ```
  ┌─────────────────────────────┐
  │  ⚡ CRÉDITO DE USO          │
  │                             │
  │  Seu crédito:               │
  │  R$ 23,50                   │
  │                             │
  │  Como funciona:             │
  │  • Compre crédito antecipado│
  │  • Rode SEM comissão/corrida│
  │  • Ganhe 100% do valor!     │
  │                             │
  │  PLANOS:                    │
  │  ⚪ R$ 100 → R$ 100 crédito │
  │  🎁 R$ 200 → R$ 220 crédito │← Recomendado
  │  🎁 R$ 500 → R$ 575 crédito │
  │                             │
  │  [RECARREGAR]               │
  └─────────────────────────────┘
  ```
- **Erros possíveis:**
  - Pagamento falhou → "Erro no pagamento. Tente outro método"

---

### **Categoria: Performance e Incentivos**

#### **M5.1 — Minhas Métricas**
- **Objetivo:** Ver performance pessoal
- **Ação principal:** Consultar KPIs
- **Componentes:**
  ```
  ┌─────────────────────────────┐
  │  📊 MINHAS MÉTRICAS         │
  │                             │
  │  📆 ÚLTIMA SEMANA:          │
  │                             │
  │  ✅ Taxa de aceitação       │
  │     87% (meta: 80%)         │
  │     [████████░░] ✅         │
  │                             │
  │  ✅ Taxa de finalização     │
  │     96% (meta: 95%)         │
  │     [█████████░] ✅         │
  │                             │
  │  ⭐ Avaliação média         │
  │     4.8 (meta: 4.5)         │
  │     ⭐⭐⭐⭐⭐ ✅             │
  │                             │
  │  🚗 Corridas realizadas     │
  │     47 corridas             │
  │                             │
  │  💰 Caixa gerado            │
  │     R$ 1.203,00             │
  │                             │
  │  📈 [Ver histórico mensal]  │
  └─────────────────────────────┘
  ```
- **Erros possíveis:**
  - Sem dados → "Realize corridas para ver suas métricas"

---

#### **M5.2 — Incentivos Ativos**
- **Objetivo:** Ver campanhas e benefícios disponíveis
- **Ação principal:** Consultar incentivos
- **Componentes:**
  ```
  ┌─────────────────────────────┐
  │  🎁 SEUS INCENTIVOS         │
  │                             │
  │  ⚡ ATIVOS:                 │
  │                             │
  │  🏆 Motorista Premium       │
  │     Comissão: 12% (vs 15%)  │
  │     Válido até: 31/12       │
  │                             │
  │  ⛽ Desconto Combustível    │
  │     5% em postos parceiros  │
  │     Total economizado: R$ 47│
  │                             │
  │  ──────────────────────     │
  │  🎯 PRÓXIMOS OBJETIVOS:     │
  │                             │
  │  🥇 Elite (comissão 10%)    │
  │     Faltam 53 corridas      │
  │     [██████████░░░░] 75%    │
  │                             │
  │  💰 Bônus 100 corridas/sem  │
  │     Ganhe +R$ 200           │
  │     Faltam 12 corridas      │
  │     [█████████████░] 88%    │
  └─────────────────────────────┘
  ```
- **Erros possíveis:**
  - Nenhum incentivo ativo → "Realize mais corridas para desbloquear incentivos"

---

### **Categoria: Suporte e Configurações**

#### **M6.1 — Suporte**
- **Objetivo:** Contato rápido com suporte humano
- **Ação principal:** Abrir ticket ou chat
- **Componentes:**
  - FAQ (perguntas frequentes)
  - WhatsApp direto
  - Telefone (horário comercial)
  - E-mail
  - Histórico de tickets
- **Erros possíveis:**
  - Fora do horário → "Suporte retorna às 8h"

---

#### **M6.2 — Perfil do Motorista**
- **Objetivo:** Gerenciar dados
- **Ação principal:** Editar informações
- **Componentes:**
  - Foto de perfil
  - Nome
  - Documentos (CNH, CRLV)
  - Dados do veículo
  - Chave Pix
  - Conta bancária
- **Erros possíveis:**
  - CNH vencida → "Atualize sua CNH para continuar trabalhando"

---

#### **M6.3 — Configurações**
- **Objetivo:** Preferências do app
- **Ação principal:** Ajustar configurações
- **Componentes:**
  - Notificações (som, vibração)
  - Modo de navegação (Waze, Google Maps)
  - Idioma
  - Privacidade
  - Sobre
- **Erros possíveis:**
  - N/A

---

## 🖥️ LISTA DE TELAS — ADMIN PANEL

### **Categoria: Dashboard**

#### **A1.1 — Dashboard Principal**
- **Objetivo:** Visão geral operacional
- **Ação principal:** Monitorar KPIs em tempo real
- **Componentes:**
  - Corridas em andamento (mapa ao vivo)
  - Métricas do dia (corridas, GMV, motoristas ativos)
  - Gráficos de tendência (hora a hora)
  - Alertas críticos (fraudes, erros, disputas)
- **Erros possíveis:**
  - Dados desatualizados → Refresh automático a cada 30s

---

#### **A1.2 — Corridas ao Vivo**
- **Objetivo:** Ver corridas em tempo real
- **Ação principal:** Drill-down em corridas específicas
- **Componentes:**
  - Mapa com todas as corridas ativas
  - Lista de corridas (status, motorista, passageiro)
  - Filtros: status, cidade, motorista
  - Ações: visualizar detalhes, cancelar, suporte
- **Erros possíveis:**
  - Corrida não encontrada → "Corrida finalizada ou cancelada"

---

### **Categoria: Gestão de Usuários**

#### **A2.1 — Motoristas**
- **Objetivo:** Gerenciar motoristas
- **Ação principal:** Buscar, visualizar, editar, bloquear
- **Componentes:**
  - Lista de motoristas (nome, status, métricas)
  - Busca avançada (CPF, nome, placa)
  - Filtros: status (ativo, suspenso, pendente)
  - Ações: ver perfil, suspender, reativar
- **Erros possíveis:**
  - Motorista não encontrado → "Nenhum motorista com este critério"

---

#### **A2.2 — Passageiros**
- **Objetivo:** Gerenciar passageiros
- **Ação principal:** Buscar, visualizar, bloquear
- **Componentes:**
  - Similar a motoristas
- **Erros possíveis:**
  - Passageiro não encontrado

---

### **Categoria: Financeiro**

#### **A3.1 — Reconciliação Diária**
- **Objetivo:** Validar transações do dia
- **Ação principal:** Conciliar pagamentos recebidos vs repasses
- **Componentes:**
  - Resumo do dia (GMV, comissões, repasses)
  - Lista de divergências (se houver)
  - Status: conciliado ✅ ou pendente ⏳
  - Botão: "Processar repasses D+2"
- **Erros possíveis:**
  - Divergências encontradas → Lista de corridas com problema

---

#### **A3.2 — Ledger (Auditoria)**
- **Objetivo:** Consultar ledger append-only
- **Ação principal:** Buscar transações específicas
- **Componentes:**
  - Busca por: corrida_id, motorista_id, data
  - Filtros: tipo (corrida, saque, bônus)
  - Cada entrada: timestamp, tipo, valor, saldos
  - Exportar CSV
- **Erros possíveis:**
  - Busca sem resultado → "Nenhuma transação encontrada"

---

### **Categoria: Suporte e Disputas**

#### **A4.1 — Tickets de Suporte**
- **Objetivo:** Gerenciar tickets abertos
- **Ação principal:** Responder e resolver tickets
- **Componentes:**
  - Lista de tickets (prioridade, status, usuário)
  - Filtros: aberto, em andamento, resolvido
  - Ações: atribuir, responder, escalar, fechar
- **Erros possíveis:**
  - Ticket já resolvido → "Este ticket já foi fechado"

---

#### **A4.2 — Disputas**
- **Objetivo:** Analisar e resolver disputas (pagamento, comportamento)
- **Ação principal:** Tomar decisão (favor motorista/passageiro)
- **Componentes:**
  - Detalhes da corrida
  - Alegações de ambas as partes
  - Histórico de corridas (padrão)
  - Evidências (mapa, chat, áudio)
  - Ação: estornar, manter, suspender usuário
- **Erros possíveis:**
  - Evidência insuficiente → Solicitar mais informações

---

### **Categoria: Campanhas e Incentivos**

#### **A5.1 — Gerenciar Campanhas**
- **Objetivo:** Criar, editar, pausar campanhas
- **Ação principal:** Configurar campanhas de incentivo
- **Componentes:**
  - Lista de campanhas (ativas, pausadas, encerradas)
  - Botão: "Nova campanha"
  - Formulário: nome, regras, tipo de incentivo, validade
  - Preview: motoristas elegíveis
- **Erros possíveis:**
  - Regras conflitantes → "Campanha X já atende este critério"

---

## 🎨 LINGUAGEM VISUAL (GUIDELINES)

### Paleta de Cores

#### **Cores Primárias**
```
IBORA BLUE (Principal)
├─ #2563EB (azul vibrante, confiável)
└─ Uso: botões primários, destaques, logo

IBORA GREEN (Sucesso/Dinheiro)
├─ #10B981 (verde positivo)
└─ Uso: confirmações, ganhos, saldos

IBORA ORANGE (Atenção)
├─ #F59E0B (laranja quente)
└─ Uso: alertas, corridas pendentes, timers
```

#### **Cores Secundárias**
```
CINZA (Neutro)
├─ #F3F4F6 (background)
├─ #9CA3AF (texto secundário)
└─ #1F2937 (texto principal)

VERMELHO (Erro/Perigo)
├─ #EF4444 (erro, cancelamento)
└─ Uso: apenas para ações destrutivas

AMARELO (Aviso)
├─ #FBBF24 (atenção moderada)
└─ Uso: avisos, dicas
```

---

### Tipografia

**Principal:** **Inter** (sans-serif moderno, legível)
- Títulos: Inter Bold (24-32px)
- Subtítulos: Inter Semibold (18-20px)
- Corpo: Inter Regular (14-16px)
- Legendas: Inter Regular (12px)

**Números (Wallet, Preços):** **Roboto Mono** (monoespaçada)
- Para valores monetários e métricas
- Facilita leitura de números

---

### Iconografia

**Estilo:** Outline (não filled)
**Biblioteca:** Lucide Icons ou Heroicons
**Tamanho padrão:** 24px (touch-friendly)

**Icons principais:**
- 📍 Localização
- 💰 Dinheiro/Wallet
- ⭐ Avaliação
- 🚗 Carro/Corrida
- 📊 Métricas
- 🎁 Incentivos

---

### Componentes de UI

#### **Botões**
```
PRIMÁRIO (ação principal):
├─ Background: IBORA BLUE
├─ Texto: Branco
├─ Altura: 48px (touch-friendly)
└─ Border-radius: 8px

SECUNDÁRIO (ação alternativa):
├─ Background: Transparente
├─ Border: 2px IBORA BLUE
├─ Texto: IBORA BLUE
└─ Altura: 48px

DESTRUTIVO (cancelar, bloquear):
├─ Background: VERMELHO
├─ Texto: Branco
└─ Usa apenas quando inevitável
```

#### **Cards**
```
├─ Background: Branco
├─ Shadow: suave (0 2px 8px rgba(0,0,0,0.1))
├─ Border-radius: 12px
├─ Padding: 16px
└─ Espaçamento entre cards: 12px
```

---

### Estados de Interação

| Estado | Visual |
|--------|--------|
| **Normal** | Cor padrão |
| **Hover** | Escurece 10% |
| **Pressed** | Escurece 20% |
| **Disabled** | Opacidade 40% |
| **Loading** | Spinner + opacidade 70% |

---

✅ **Etapa 5 concluída:** UX, Layout e Linguagem Visual completos com todas as telas mapeadas  
📍 **Próxima etapa:** [ETAPA 6 — Wireframes e Storyboard (Conceitual)](#etapa-6--wireframes-e-storyboard-conceitual)

---

# ETAPA 6 — WIREFRAMES E STORYBOARD (CONCEITUAL)

## 🎬 INTRODUÇÃO

Esta etapa **NÃO** apresenta wireframes visuais (desenhos de tela).  
Esta etapa apresenta **STORYBOARDS CONCEITUAIS**: descrição detalhada dos fluxos com foco na **interação UX ↔ Backend**.

**Objetivo:** Identificar **pontos críticos** onde decisões de UX impactam diretamente a arquitetura do backend.

---

## 📱 FLUXO COMPLETO #1 — PASSAGEIRO SOLICITA CORRIDA

### Visão Geral
```
[Passageiro] → Define destino → Vê preço → Solicita
→ Sistema busca motorista → Motorista aceita → Corrida realizada
→ Pagamento automático → Avaliação
```

**Tempo esperado:** 15-25 minutos (origem → destino em trajeto 5km)  
**Pontos críticos:** 4 (busca motorista, aceite, pagamento, concorrência)

---

### PASSO 1: Passageiro Abre o App

#### UX (Frontend)
```
1.1. App carrega (splash screen)
1.2. Verifica token JWT em localStorage
1.3. Se válido → vai para Home
1.4. Se inválido → vai para Login
```

#### Backend (API)
```
Endpoints envolvidos:
├─ GET /auth/verify-token
│  └─ Valida JWT
│  └─ Retorna: user_id, name, status

Dados retornados:
{
  "user_id": "uuid",
  "name": "Júlia Silva",
  "phone": "+5511999998888",
  "status": "ACTIVE",
  "payment_methods": ["PIX", "CREDIT_CARD"]
}
```

#### Ponto Crítico #1: Sessão Expirada
```
PROBLEMA: Token expirou (7 dias)
SOLUÇÃO UX: Redireciona para login (SMS)
SOLUÇÃO BACKEND: Refresh token (30 dias)
```

---

### PASSO 2: Define Localização Atual

#### UX (Frontend)
```
2.1. Solicita permissão de GPS (se primeira vez)
2.2. Obtém lat/lng do dispositivo
2.3. Exibe pin no mapa
2.4. Faz geocoding reverso (lat/lng → endereço)
2.5. Mostra "Você está em: Rua ABC, 123"
```

#### Backend (API)
```
Endpoints:
├─ POST /geocoding/reverse
│  └─ Body: {lat: -23.550, lng: -46.633}
│  └─ Retorna: {address: "Rua ABC, 123", city: "Campinas"}

Cache:
└─ Redis: chave "geocode:{lat}:{lng}" (TTL 24h)
   └─ Evita chamadas repetidas ao Google Maps API
```

#### Ponto Crítico #2: GPS Desligado
```
PROBLEMA: Usuário negou permissão ou GPS desligado
SOLUÇÃO UX: Modal "Ative a localização para continuar"
SOLUÇÃO BACKEND: N/A (problema client-side)
```

---

### PASSO 3: Define Destino

#### UX (Frontend)
```
3.1. Passageiro digita endereço
3.2. Autocomplete em tempo real (debounce 300ms)
3.3. Exibe sugestões (Google Places API)
3.4. Passageiro seleciona
3.5. Pin de destino aparece no mapa
```

#### Backend (API)
```
Endpoints:
├─ GET /geocoding/autocomplete?q=shopping
│  └─ Proxy para Google Places API
│  └─ Retorna: [
│      {place_id: "X", description: "Shopping Center"},
│      {place_id: "Y", description: "Shopping Iguatemi"}
│    ]

├─ POST /geocoding/place-details
│  └─ Body: {place_id: "X"}
│  └─ Retorna: {lat, lng, address}
```

#### Ponto Crítico #3: Destino = Origem
```
PROBLEMA: Usuário selecionou onde já está
SOLUÇÃO UX: "Você já está neste local!"
SOLUÇÃO BACKEND: Validação no cálculo de rota
```

---

### PASSO 4: Calcula Preço Estimado

#### UX (Frontend)
```
4.1. Envia origem + destino
4.2. Backend calcula rota e preço
4.3. Exibe:
    ├─ "R$ 18,00" (destaque)
    ├─ "4.5 km • ~12 min"
    └─ Breakdown (base + km + tempo)
```

#### Backend (API) — **CRÍTICO**
```
Endpoint:
POST /rides/estimate

Body:
{
  "origin": {"lat": -23.550, "lng": -46.633},
  "destination": {"lat": -23.555, "lng": -46.640},
  "payment_method": "PIX"
}

Processamento:
1. Calcula rota (Google Directions API)
   └─ Retorna: distance_km, duration_min, polyline

2. Aplica fórmula de precificação:
   price = BASE_FARE + (distance_km * PRICE_PER_KM) + (duration_min * PRICE_PER_MIN)
   
   Exemplo:
   ├─ BASE_FARE = 5.00
   ├─ PRICE_PER_KM = 2.50
   ├─ PRICE_PER_MIN = 0.30
   └─ price = 5.00 + (4.5 * 2.50) + (12 * 0.30) = R$ 18.85
   
3. Aplica tarifa dinâmica (se houver):
   └─ Se horário de pico (18h-20h) → multiplier = 1.3
   └─ price_final = 18.85 * 1.3 = R$ 24.50

4. Verifica se usuário tem iBora Pass:
   └─ Se SIM e corrida < 5km → price_final = 0 (usa crédito)

Response:
{
  "estimate_id": "uuid",
  "price": 18.85,
  "distance_km": 4.5,
  "duration_min": 12,
  "surge_multiplier": 1.0,
  "breakdown": {
    "base": 5.00,
    "distance": 11.25,
    "time": 3.60
  },
  "valid_until": "2025-12-16T15:15:00Z" // 5 min validade
}
```

#### Ponto Crítico #4: Preço Muda Entre Estimativa e Confirmação
```
PROBLEMA: Passageiro vê R$ 18, mas na confirmação virou R$ 24
RAZÃO: Tarifa dinâmica entrou / estimativa expirou

SOLUÇÃO UX: 
├─ Mostrar validade (5 min)
├─ Se expirou → recalcular automaticamente
└─ Se mudou muito (>15%) → avisar usuário

SOLUÇÃO BACKEND:
├─ estimate_id com TTL 5 min
└─ No momento da confirmação, re-validar preço
```

---

### PASSO 5: Passageiro Confirma e Solicita Corrida

#### UX (Frontend)
```
5.1. Passageiro clica "SOLICITAR CORRIDA"
5.2. Loading: "Procurando motorista..."
5.3. WebSocket conecta para receber updates em tempo real
```

#### Backend (API) — **MUITO CRÍTICO**
```
Endpoint:
POST /rides/request

Body:
{
  "estimate_id": "uuid",
  "origin": {...},
  "destination": {...},
  "payment_method": "PIX"
}

Processamento (TRANSACIONAL):

1. BEGIN TRANSACTION

2. Valida estimate_id (ainda válido? preço mudou?)

3. Verifica se passageiro pode solicitar:
   ├─ Não tem corrida ativa? ✓
   ├─ Não está bloqueado? ✓
   └─ Método de pagamento válido? ✓

4. Cria registro na tabela `rides`:
   INSERT INTO rides (
     id, passenger_id, origin, destination, 
     status, price, created_at
   ) VALUES (
     'uuid', 'passenger_uuid', {...}, {...},
     'SEARCHING', 18.85, NOW()
   )

5. Cria evento no ledger (opcional, auditoria):
   INSERT INTO ride_events (
     ride_id, event_type, data, created_at
   ) VALUES (
     'uuid', 'RIDE_REQUESTED', {...}, NOW()
   )

6. COMMIT TRANSACTION

7. Publica evento no RabbitMQ:
   ├─ Queue: "ride.search"
   ├─ Payload: {ride_id, origin, destination, price}
   └─ Consumidor: Matching Service

8. Retorna para o cliente:
   {
     "ride_id": "uuid",
     "status": "SEARCHING",
     "estimated_wait": "30-60s"
   }
```

#### Ponto Crítico #5: Concorrência
```
PROBLEMA: 2 passageiros solicitam ao mesmo tempo, mesmo motorista

SOLUÇÃO:
├─ Fila FIFO (first in, first out)
├─ Matching service processa sequencialmente
└─ Motorista só pode aceitar 1 corrida por vez
```

---

### PASSO 6: Sistema Busca Motorista (Matching)

#### Backend (Matching Service) — **ALGORITMO CRÍTICO**
```
Worker consumindo fila "ride.search":

1. Recebe evento de nova corrida

2. Query para encontrar motoristas elegíveis:
   SELECT driver_id, lat, lng, rating, acceptance_rate
   FROM drivers
   WHERE status = 'ONLINE'
     AND current_ride_id IS NULL
     AND ST_Distance_Sphere(
         point(lng, lat),
         point(-46.633, -23.550)  -- origem da corrida
       ) <= 5000  -- 5km raio
   ORDER BY ST_Distance_Sphere(...) ASC
   LIMIT 10

3. Aplica filtros de qualidade:
   ├─ rating >= 4.0 (não envia para motoristas muito ruins)
   ├─ acceptance_rate >= 50% (priorizra quem aceita mais)
   └─ Não ofereceu esta corrida nos últimos 5min

4. Ordena por prioridade:
   priority_score = (1 / distance_km) * acceptance_rate * rating
   
   Exemplo:
   ├─ Motorista A: 0.5km, 90% aceite, 4.8★ → score = 8.64
   ├─ Motorista B: 1.2km, 70% aceite, 4.5★ → score = 2.63
   └─ Motorista C: 0.8km, 60% aceite, 4.2★ → score = 3.15
   
   Ordem de oferta: A → C → B

5. Oferece para primeiro motorista (A):
   ├─ WebSocket: envia notificação
   ├─ Push notification: "Nova corrida!"
   ├─ Timer: 15 segundos para responder
   
6. Aguarda resposta:
   ├─ ACEITA → próximo passo
   ├─ RECUSA → oferece para próximo (C)
   └─ TIMEOUT → oferece para próximo (C)

7. Se todos recusarem:
   ├─ Expande raio (5km → 8km → 12km)
   ├─ Tenta novamente
   └─ Se após 2min nenhum aceitar:
       └─ Cancela automaticamente (sem taxa)
```

#### Ponto Crítico #6: Matching Demorado
```
PROBLEMA: Nenhum motorista disponível na região

SOLUÇÃO UX:
├─ Após 30s: "Ainda procurando... pode demorar mais"
├─ Após 60s: "Poucos motoristas disponíveis. Tentar região maior?"
└─ Após 120s: "Nenhum motorista disponível. Tente novamente"

SOLUÇÃO BACKEND:
├─ Matching adaptativo (raio aumenta)
├─ Sugerir horários com mais motoristas
└─ Incentivos temporários (bônus para aceitar)
```

---

### PASSO 7: Motorista Recebe Notificação

#### UX (Motorista - Frontend)
```
7.1. Tela de notificação aparece (overlay)
7.2. Mostra:
    ├─ Origem → Destino
    ├─ Distância e tempo
    ├─ Valor que vai ganhar
    ├─ Info do passageiro
    └─ Timer 15s
7.3. Motorista decide: ACEITAR ou RECUSAR
```

#### Backend (API)
```
WebSocket envia:
{
  "type": "RIDE_OFFER",
  "ride_id": "uuid",
  "passenger": {
    "name": "Júlia S.",
    "rating": 4.8,
    "total_rides": 120
  },
  "origin": {
    "address": "Rua ABC, 123",
    "distance_from_you": 0.5,  // km
    "eta": 2  // min
  },
  "destination": {
    "address": "Shopping Center",
    "distance": 4.5,  // km
    "duration": 12  // min
  },
  "price": {
    "total": 18.85,
    "driver_earns": 16.40,  // 87% (comissão 13%)
    "commission": 2.45
  },
  "payment_method": "PIX",
  "expires_at": "2025-12-16T15:10:15Z"  // 15s
}
```

---

### PASSO 8: Motorista Aceita Corrida — **TRANSAÇÃO CRÍTICA**

#### UX (Motorista - Frontend)
```
8.1. Motorista clica "ACEITAR"
8.2. Loading: "Confirmando..."
8.3. Se sucesso → tela "Indo buscar passageiro"
8.4. Se falha → "Ops! Outro motorista foi mais rápido"
```

#### Backend (API) — **RACE CONDITION CRÍTICA**
```
Endpoint:
POST /rides/{ride_id}/accept

Headers:
Authorization: Bearer {driver_jwt}

Processamento (TRANSACIONAL com LOCK):

1. BEGIN TRANSACTION

2. Obtém corrida com LOCK (evita race condition):
   SELECT * FROM rides
   WHERE id = 'uuid'
   FOR UPDATE  -- ← CRÍTICO: bloqueia linha

3. Valida estado:
   IF status != 'SEARCHING':
     ROLLBACK
     RETURN 409 "Corrida já foi aceita por outro motorista"

4. Valida motorista:
   ├─ Está ONLINE? ✓
   ├─ Não tem corrida ativa? ✓
   └─ Não está bloqueado? ✓

5. Atualiza corrida:
   UPDATE rides
   SET status = 'ACCEPTED',
       driver_id = 'driver_uuid',
       accepted_at = NOW()
   WHERE id = 'uuid'

6. Atualiza motorista:
   UPDATE drivers
   SET current_ride_id = 'uuid',
       status = 'ON_RIDE'
   WHERE id = 'driver_uuid'

7. Cria evento no ledger:
   INSERT INTO ride_events (
     ride_id, event_type, driver_id, created_at
   ) VALUES (
     'uuid', 'RIDE_ACCEPTED', 'driver_uuid', NOW()
   )

8. COMMIT TRANSACTION

9. Publica eventos em tempo real:
   ├─ WebSocket → Passageiro: "Motorista encontrado!"
   ├─ WebSocket → Motorista: "Corrida aceita!"
   └─ WebSocket → Outros motoristas: "Corrida não disponível"

10. Inicia tracking de localização:
    └─ Motorista envia lat/lng a cada 5s
```

#### Ponto Crítico #7: Race Condition
```
PROBLEMA: 
├─ Motorista A aceita em T+14.9s
├─ Motorista B aceita em T+14.95s
└─ Ambos receberam a oferta

SOLUÇÃO:
├─ FOR UPDATE lock (PostgreSQL)
├─ Primeiro a fazer COMMIT ganha
├─ Segundo recebe erro 409 "Já aceita"

TESTE:
└─ Simular 2 aceites simultâneos (< 100ms diferença)
```

---

### PASSO 9: Motorista Vai Buscar Passageiro

#### UX (Ambos Apps)
```
PASSAGEIRO:
├─ Vê foto, nome, carro, placa do motorista
├─ Vê pin do motorista se movendo no mapa
├─ Vê ETA: "Chega em ~3 min"
├─ Pode: [Chat] [Ligar] [Cancelar]

MOTORISTA:
├─ Vê endereço exato do passageiro
├─ Navegação (Google Maps / Waze)
├─ Vê telefone do passageiro
├─ Pode: [Chat] [Ligar] [Cheguei] [Cancelar]
```

#### Backend (Tempo Real - WebSocket)
```
1. Motorista envia localização a cada 5s:
   WebSocket → Server:
   {
     "type": "LOCATION_UPDATE",
     "driver_id": "uuid",
     "lat": -23.5505,
     "lng": -46.6333,
     "timestamp": "2025-12-16T15:10:45Z"
   }

2. Server valida e armazena:
   ├─ Redis: SET driver:{uuid}:location {lat,lng} EX 30
   └─ PostgreSQL: INSERT INTO location_history (...)

3. Server calcula ETA:
   distance_remaining = calcDistance(driver_lat, passenger_lat)
   eta_seconds = distance_remaining / avg_speed (10 m/s)

4. Server envia para passageiro:
   WebSocket → Passenger:
   {
     "type": "DRIVER_LOCATION",
     "lat": -23.5505,
     "lng": -46.6333,
     "distance_remaining": 450,  // metros
     "eta_seconds": 180  // 3 min
   }
```

#### Ponto Crítico #8: Passageiro Não Aparece (No-Show)
```
PROBLEMA: Motorista chegou, passageiro não está lá

FLUXO:
1. Motorista clica "CHEGUEI"
2. Timer de 5 minutos inicia
3. Se passageiro não entra em 5 min:
   └─ Motorista pode clicar "Passageiro não apareceu"

4. Sistema cancela corrida:
   ├─ Cobra taxa de no-show: R$ 8
   ├─ Motorista recebe: R$ 8 (100%)
   └─ Status: CANCELLED_NO_SHOW

BACKEND:
POST /rides/{ride_id}/no-show
└─ Valida que motorista está no local (< 50m)
└─ Valida que passaram 5 min desde "CHEGUEI"
```

---

### PASSO 10: Passageiro Entra, Corrida Inicia

#### UX (Ambos Apps)
```
MOTORISTA:
├─ Clica "INICIAR CORRIDA"
├─ Tela muda: "EM VIAGEM"
├─ Navegação até destino

PASSAGEIRO:
├─ Automaticamente detecta início
├─ Tela muda: "EM VIAGEM"
├─ Botão emergência visível
├─ Pode compartilhar viagem
```

#### Backend (API)
```
Endpoint:
POST /rides/{ride_id}/start

Processamento:
1. BEGIN TRANSACTION

2. Valida estado:
   ├─ status == 'ACCEPTED'? ✓
   ├─ motorista está próximo do passageiro (< 50m)? ✓

3. Atualiza corrida:
   UPDATE rides
   SET status = 'IN_PROGRESS',
       started_at = NOW(),
       start_location = ST_Point(lng, lat)
   WHERE id = 'uuid'

4. Cria evento:
   INSERT INTO ride_events (
     ride_id, event_type, created_at
   ) VALUES (
     'uuid', 'RIDE_STARTED', NOW()
   )

5. COMMIT

6. WebSocket → Ambos: "Corrida iniciada"

7. Inicia tracking detalhado:
   └─ Localização a cada 3s (mais frequente)
```

---

### PASSO 11: Durante a Viagem

#### Backend (Monitoramento)
```
1. Tracking de localização (3s intervals)

2. Detecção de anomalias:
   ├─ Motorista parado > 5min → alerta
   ├─ Rota desviou muito → alerta
   └─ Velocidade excessiva → alerta

3. Estimativa de chegada atualizada:
   └─ Recalcula ETA a cada 30s

4. Logs para auditoria:
   └─ INSERT location_history (...)
```

#### Ponto Crítico #9: Emergência
```
PROBLEMA: Passageiro clica botão EMERGÊNCIA

FLUXO:
1. WebSocket → Server (prioridade máxima)
2. Server:
   ├─ Cria alerta CRITICAL
   ├─ Notifica operador (24/7)
   ├─ Grava localização exata
   ├─ Mantém tracking ativo
   └─ Envia SMS/push para contatos de emergência

3. Operador:
   ├─ Liga para passageiro
   ├─ Liga para motorista
   └─ Aciona autoridades se necessário

BACKEND:
POST /rides/{ride_id}/emergency
└─ Prioridade: CRITICAL
└─ Notificação imediata
```

---

### PASSO 12: Chega ao Destino, Motorista Finaliza

#### UX (Motorista)
```
12.1. Motorista chega
12.2. Clica "FINALIZAR CORRIDA"
12.3. Sistema valida localização
12.4. Corrida finalizada
```

#### Backend (API) — **TRANSAÇÃO FINANCEIRA CRÍTICA**
```
Endpoint:
POST /rides/{ride_id}/complete

Processamento (TRANSAÇÃO COMPLEXA):

1. BEGIN TRANSACTION

2. Valida:
   ├─ status == 'IN_PROGRESS'? ✓
   ├─ motorista próximo do destino (< 200m)? ✓

3. Calcula valores finais:
   
   distance_actual = calculateRouteDistance(start, end)
   duration_actual = (ended_at - started_at) / 60  // minutos
   
   price_final = BASE + (distance * PRICE_KM) + (duration * PRICE_MIN)
   
   // Se difere muito do estimado, usar estimado (proteção)
   IF abs(price_final - price_estimated) > 0.15 * price_estimated:
     price_final = price_estimated

4. Aplica desconto (se iBora Pass):
   IF passenger.has_pass AND price_final <= pass_limit:
     price_final = 0
     deduct_from_pass_credits()

5. Calcula split:
   commission_rate = driver.category.rate  // 13%
   commission = price_final * commission_rate
   driver_earns = price_final - commission

6. Atualiza corrida:
   UPDATE rides
   SET status = 'COMPLETED',
       ended_at = NOW(),
       end_location = ST_Point(lng, lat),
       distance_km = distance_actual,
       duration_min = duration_actual,
       price_final = price_final,
       commission = commission
   WHERE id = 'uuid'

7. Cria eventos financeiros (LEDGER APPEND-ONLY):
   
   -- Passageiro paga
   INSERT INTO financial_events (
     type, entity_type, entity_id,
     amount, category, ride_id, created_at
   ) VALUES (
     'DEBIT', 'PASSENGER', passenger_id,
     -18.85, 'RIDE_PAYMENT', ride_id, NOW()
   )
   
   -- Motorista ganha
   INSERT INTO financial_events (
     type, entity_type, entity_id,
     amount, category, ride_id, created_at
   ) VALUES (
     'CREDIT', 'DRIVER', driver_id,
     16.40, 'RIDE_EARNING', ride_id, NOW()
   )
   
   -- Plataforma ganha
   INSERT INTO financial_events (
     type, entity_type, entity_id,
     amount, category, ride_id, created_at
   ) VALUES (
     'CREDIT', 'PLATFORM', 'platform',
     2.45, 'COMMISSION', ride_id, NOW()
   )

8. Atualiza wallet do motorista:
   
   INSERT INTO driver_wallet_entries (
     driver_id, amount, type, status,
     available_at, ride_id, created_at
   ) VALUES (
     driver_id, 16.40, 'RIDE_EARNING', 'PENDING',
     NOW() + INTERVAL '2 days',  -- D+2
     ride_id, NOW()
   )

9. Processa pagamento do passageiro:
   
   IF payment_method == 'PIX':
     initiate_pix_payment()
   ELIF payment_method == 'CREDIT_CARD':
     charge_credit_card()
   ELIF payment_method == 'CASH':
     mark_as_cash_collected()

10. Atualiza motorista:
    UPDATE drivers
    SET current_ride_id = NULL,
        status = 'ONLINE',
        total_rides = total_rides + 1,
        total_earnings = total_earnings + 16.40
    WHERE id = driver_id

11. COMMIT TRANSACTION

12. Webhooks (async):
    ├─ Webhook financeiro (pagamento provider)
    ├─ Webhook analytics
    └─ Webhook campanhas (verifica incentivos)

13. WebSocket → Ambos:
    {
      "type": "RIDE_COMPLETED",
      "price": 18.85,
      "driver_earned": 16.40
    }
```

#### Ponto Crítico #10: Falha no Pagamento
```
PROBLEMA: Pagamento falhou (cartão recusado, Pix timeout)

SOLUÇÃO:
1. Corrida é marcada como COMPLETED_PAYMENT_PENDING
2. Motorista recebe normalmente (D+2)
3. Sistema tenta novamente:
   ├─ Retry 1: após 1h
   ├─ Retry 2: após 6h
   ├─ Retry 3: após 24h
4. Se todos falharem:
   └─ Passageiro bloqueado até regularizar
   └─ Suporte humano entra em contato

BACKEND:
└─ Worker processa fila "payment.retry"
└─ Exponential backoff
```

---

### PASSO 13: Avaliação Mútua

#### UX (Ambos Apps)
```
PASSAGEIRO:
├─ Tela de avaliação aparece
├─ Estrelas 1-5
├─ Comentário opcional
├─ Gorjeta opcional

MOTORISTA:
├─ Tela de avaliação aparece
├─ Estrelas 1-5
├─ Comentário opcional
├─ [Pular] → volta ao modo online
```

#### Backend (API)
```
Endpoint:
POST /rides/{ride_id}/rate

Body:
{
  "rating": 5,
  "comment": "Motorista educado!",
  "tip": 2.00  // opcional
}

Processamento:
1. Salva avaliação:
   INSERT INTO ratings (
     ride_id, from_user_id, to_user_id,
     rating, comment, created_at
   ) VALUES (...)

2. Atualiza média do avaliado:
   UPDATE drivers
   SET rating = (
     SELECT AVG(rating)
     FROM ratings
     WHERE to_user_id = driver_id
   ),
   total_ratings = total_ratings + 1
   WHERE id = driver_id

3. Se gorjeta > 0:
   INSERT INTO financial_events (
     type, entity_type, entity_id,
     amount, category, ride_id
   ) VALUES (
     'CREDIT', 'DRIVER', driver_id,
     2.00, 'TIP', ride_id
   )

4. Atualiza wallet (gorjeta disponível imediatamente):
   INSERT INTO driver_wallet_entries (
     driver_id, amount, type, status,
     available_at, ride_id
   ) VALUES (
     driver_id, 2.00, 'TIP', 'AVAILABLE',
     NOW(), ride_id
   )

5. Verifica se precisa alerta:
   IF rating <= 2:
     create_quality_alert(ride_id, driver_id)
```

---

## 🚗 FLUXO COMPLETO #2 — MOTORISTA SACA DINHEIRO

### Visão Geral
```
[Motorista] → Vê saldo disponível → Solicita saque
→ Escolhe D+2 (grátis) ou D+0 (taxa) → Confirma
→ Sistema processa → Dinheiro cai na conta
```

**Tempo esperado:** 2 min (solicitação) + 48h (D+2) ou imediato (D+0)  
**Pontos críticos:** 2 (validação de saldo, integração bancária)

---

### PASSO 1: Motorista Consulta Wallet

#### UX (Frontend)
```
1.1. Motorista acessa "Minha Wallet"
1.2. Vê:
     ├─ Saldo disponível: R$ 847,30
     ├─ Em processamento: R$ 143,50 (D+2)
     └─ Bloqueado: R$ 0,00
```

#### Backend (API)
```
Endpoint:
GET /drivers/me/wallet

Response:
{
  "available": 847.30,
  "pending_d2": 143.50,
  "blocked": 0.00,
  "total_earned_week": 1203.00,
  "total_rides_week": 47,
  "commission_paid_week": 156.00
}

Query:
SELECT 
  SUM(CASE 
    WHEN status = 'AVAILABLE' 
    THEN amount 
    ELSE 0 
  END) as available,
  SUM(CASE 
    WHEN status = 'PENDING' 
    THEN amount 
    ELSE 0 
  END) as pending,
  SUM(CASE 
    WHEN status = 'BLOCKED' 
    THEN amount 
    ELSE 0 
  END) as blocked
FROM driver_wallet_entries
WHERE driver_id = 'uuid'
  AND deleted_at IS NULL
```

---

### PASSO 2: Motorista Solicita Saque

#### UX (Frontend)
```
2.1. Clica "SACAR"
2.2. Digita valor (ex: R$ 500)
2.3. Escolhe:
     ⚪ Pix D+2 (GRÁTIS)
     ⚪ Pix D+0 (taxa 1.5%)
2.4. Confirma chave Pix
2.5. Clica "CONFIRMAR SAQUE"
```

#### Backend (API) — **TRANSAÇÃO CRÍTICA**
```
Endpoint:
POST /drivers/me/withdrawals

Body:
{
  "amount": 500.00,
  "withdrawal_type": "D2",  // ou "D0"
  "pix_key": "123.456.789-00",
  "pix_key_type": "CPF"
}

Processamento (TRANSACIONAL):

1. BEGIN TRANSACTION

2. Valida:
   ├─ amount >= 50.00 (mínimo)? ✓
   ├─ amount <= available_balance? ✓
   ├─ pix_key válida? ✓
   └─ motorista não tem saque pendente? ✓

3. Calcula taxa (se D+0):
   IF withdrawal_type == 'D0':
     fee = amount * 0.015  // 1.5%
     net_amount = amount - fee
   ELSE:
     fee = 0
     net_amount = amount

4. Cria registro de saque:
   INSERT INTO withdrawals (
     id, driver_id, amount, fee, net_amount,
     withdrawal_type, pix_key, status,
     scheduled_at, created_at
   ) VALUES (
     'uuid', driver_id, 500, fee, net_amount,
     'D2', pix_key, 'PENDING',
     NOW() + INTERVAL '2 days', NOW()
   )

5. Debita da wallet (move para "em processamento"):
   UPDATE driver_wallet_entries
   SET status = 'WITHDRAWN',
       withdrawal_id = 'uuid'
   WHERE driver_id = driver_id
     AND status = 'AVAILABLE'
     AND amount <= 500  -- até completar R$ 500
   ORDER BY available_at ASC
   LIMIT ...

6. Cria evento financeiro:
   INSERT INTO financial_events (
     type, entity_type, entity_id,
     amount, category, withdrawal_id, created_at
   ) VALUES (
     'DEBIT', 'DRIVER', driver_id,
     -500, 'WITHDRAWAL', withdrawal_id, NOW()
   )

7. COMMIT TRANSACTION

8. Se D+0:
   └─ Publica na fila: "withdrawal.immediate"
   
   Se D+2:
   └─ Agendado para job processar no dia D+2

9. Response:
   {
     "withdrawal_id": "uuid",
     "amount": 500,
     "fee": 0,
     "net_amount": 500,
     "scheduled_for": "2025-12-18T00:00:00Z",
     "status": "PENDING"
   }
```

#### Ponto Crítico #11: Saldo Insuficiente por Race Condition
```
PROBLEMA:
├─ Saldo disponível: R$ 500
├─ Motorista solicita saque de R$ 500 (tela 1)
├─ Corrida finaliza, adiciona R$ 20 (background)
├─ Motorista solicita saque de R$ 520 (tela 2)
└─ Ambas solicitações simultâneas

SOLUÇÃO:
├─ SELECT ... FOR UPDATE na wallet
├─ Lock pessimista durante transação
└─ Segunda solicitação falha: "Saldo insuficiente"
```

---

### PASSO 3: Sistema Processa Saque (D+2)

#### Backend (Scheduled Job)
```
Job roda diariamente às 00:00:

1. Query saques agendados para hoje:
   SELECT * FROM withdrawals
   WHERE scheduled_at::date = CURRENT_DATE
     AND status = 'PENDING'
   ORDER BY created_at ASC

2. Para cada saque:
   
   2.1. Chama API bancária (Efí Bank):
        POST /api/pix/withdrawals
        Body: {
          pix_key: "123.456.789-00",
          amount: 500.00,
          description: "Saque iBora"
        }
   
   2.2. Se sucesso:
        UPDATE withdrawals
        SET status = 'COMPLETED',
            completed_at = NOW(),
            transaction_id = 'bank_txn_id'
        WHERE id = withdrawal_id
        
        └─ WebSocket → Motorista: "Saque realizado!"
   
   2.3. Se falha:
        UPDATE withdrawals
        SET status = 'FAILED',
            fail_reason = error_message
        WHERE id = withdrawal_id
        
        └─ Retry em 1h
        └─ Se falha 3x: alerta suporte

3. Reconciliação:
   └─ Valida que saque foi creditado na conta
   └─ Marca como RECONCILED
```

#### Ponto Crítico #12: Falha na Transferência Bancária
```
PROBLEMA: API bancária retorna erro

POSSÍVEIS CAUSAS:
├─ Chave Pix inválida
├─ Conta bancária bloqueada
├─ Limite diário excedido
├─ Timeout na API
└─ Banco fora do ar

SOLUÇÃO:
├─ Retry exponencial (1h, 6h, 24h)
├─ Se falhar 3x:
│   ├─ Devolve saldo para wallet
│   ├─ Notifica motorista
│   └─ Abre ticket para suporte

BACKEND:
Worker consome fila "withdrawal.retry"
```

---

## 💳 FLUXO COMPLETO #3 — PAGAMENTO DA CORRIDA

### Visão Geral
```
[Corrida finaliza] → Sistema captura pagamento
→ Passageiro é cobrado → Motorista recebe (D+2)
→ Reconciliação → Ledger atualizado
```

---

### CENÁRIO 3A: Pagamento via PIX

#### Backend (Webhook Flow)
```
1. Corrida finalizada (PASSO 12 do Fluxo #1)

2. Sistema gera cobrança Pix:
   POST /api/pix/charges (Efí Bank)
   Body: {
     amount: 18.85,
     payer_cpf: "123.456.789-00",
     description: "Corrida iBora - Shopping",
     expires_in: 300  // 5 min
   }
   
   Response: {
     txid: "abc123",
     qr_code: "00020126...",
     expires_at: "2025-12-16T15:20:00Z"
   }

3. Envia QR Code para passageiro:
   WebSocket → {
     type: "PAYMENT_REQUIRED",
     qr_code: "...",
     amount: 18.85,
     expires_at: "..."
   }

4. Passageiro escaneia e paga no app do banco

5. Efí Bank envia webhook:
   POST /webhooks/efi/pix
   {
     event: "PAYMENT_CONFIRMED",
     txid: "abc123",
     amount: 18.85,
     payer_cpf: "123.456.789-00",
     paid_at: "2025-12-16T15:18:32Z"
   }

6. Sistema processa webhook (IDEMPOTENTE):
   
   -- Verifica se já processou (idempotência)
   IF EXISTS (
     SELECT 1 FROM payment_events
     WHERE external_txid = 'abc123'
   ):
     RETURN 200  -- já processado

   -- Marca pagamento como CONFIRMED
   UPDATE rides
   SET payment_status = 'CONFIRMED',
       paid_at = '2025-12-16T15:18:32Z',
       payment_txid = 'abc123'
   WHERE id = ride_id

   -- Cria evento de pagamento
   INSERT INTO payment_events (
     ride_id, type, external_txid,
     amount, provider, status, created_at
   ) VALUES (
     ride_id, 'PAYMENT_RECEIVED', 'abc123',
     18.85, 'EFI_PIX', 'CONFIRMED', NOW()
   )

7. Libera saldo para motorista (D+2):
   UPDATE driver_wallet_entries
   SET status = 'PENDING'
   WHERE ride_id = ride_id

8. WebSocket → Ambos:
   {
     type: "PAYMENT_CONFIRMED",
     method: "PIX"
   }
```

#### Ponto Crítico #13: Webhook Duplicado
```
PROBLEMA: Efí envia mesmo webhook 2x (retry)

SOLUÇÃO:
├─ Idempotência: verifica external_txid
├─ Se já existe: retorna 200 (ignora)
└─ Não processa 2x

TESTE:
└─ Enviar mesmo webhook 3x
└─ Validar que processa apenas 1x
```

---

### CENÁRIO 3B: Pagamento via Cartão

#### Backend (Capture Flow)
```
1. Corrida finalizada

2. Sistema captura no cartão:
   POST /api/card/capture (Provider)
   Body: {
     token: "card_token_abc",  // salvo anteriormente
     amount: 18.85,
     description: "Corrida iBora"
   }

3. Provider responde:
   ├─ APPROVED → sucesso
   ├─ DECLINED → falhou
   └─ PROCESSING → pendente

4. Se APPROVED:
   └─ Mesmo fluxo do Pix (passo 6 em diante)

5. Se DECLINED:
   ├─ Tenta método backup (se houver)
   ├─ Se nenhum funcionar:
   │   └─ Marca como PAYMENT_FAILED
   │   └─ Passageiro bloqueado
   │   └─ Motorista recebe normalmente (iBora assume risco)

6. Settlement do cartão:
   └─ D+30 (recebimento da adquirente)
   └─ iBora adianta D+2 para motorista (cashflow próprio)
```

---

### CENÁRIO 3C: Pagamento em Dinheiro

#### Backend (Trust-Based)
```
1. Corrida finalizada

2. Passageiro paga em cash

3. Sistema assume que pagamento foi realizado:
   UPDATE rides
   SET payment_status = 'CASH_COLLECTED',
       paid_at = NOW(),
       payment_method = 'CASH'
   WHERE id = ride_id

4. Motorista tem dinheiro em mãos

5. Motorista pode:
   A) Depositar em parceiro (padaria, lotérica):
      └─ Vira crédito na wallet
   
   B) Usar para despesas:
      └─ Sistema desconta da próxima transferência

6. Reconciliação de cash:
   └─ Job diário verifica:
       └─ Corridas cash vs depósitos
       └─ Se diferença > threshold: alerta
```

#### Ponto Crítico #14: Motorista Não Deposita Cash
```
PROBLEMA: Motorista recebe R$ 500 em cash, não deposita

SOLUÇÃO:
├─ Saldo "negativo" na próxima transferência
├─ Se débito > R$ 200:
│   └─ Bloquear novos saques
│   └─ Suporte entra em contato
└─ Parceria com estabelecimentos facilita depósito

TRADE-OFF:
├─ Aceitar cash = confiar no motorista
└─ Risco calculado (parte do modelo)
```

---

## 🔄 FLUXO COMPLETO #4 — RECARGA DE CRÉDITO (MOTORISTA)

### Visão Geral
```
[Motorista] → Escolhe plano → Paga → Crédito ativado
→ Usa crédito para operar → Não paga comissão por corrida
```

---

### PASSO 1: Motorista Compra Crédito

#### UX (Frontend)
```
1.1. Motorista acessa "Crédito de Uso"
1.2. Vê planos:
     ├─ R$ 100 → R$ 100 (0% bônus)
     ├─ R$ 200 → R$ 220 (10% bônus) ✓ Recomendado
     └─ R$ 500 → R$ 575 (15% bônus)
1.3. Seleciona R$ 200
1.4. Paga via Pix/Cartão
1.5. Crédito ativado instantaneamente
```

#### Backend (API)
```
Endpoint:
POST /drivers/me/credits/purchase

Body:
{
  "plan": "R200",
  "payment_method": "PIX"
}

Processamento:
1. Cria cobrança:
   amount = 200.00
   credit_bonus = 20.00  // 10%
   total_credit = 220.00

2. Gera Pix / Cobra cartão

3. Após pagamento confirmado (webhook):
   
   BEGIN TRANSACTION
   
   INSERT INTO driver_credits (
     driver_id, amount, type, status,
     expires_at, created_at
   ) VALUES (
     driver_id, 220.00, 'PREPAID', 'ACTIVE',
     NOW() + INTERVAL '90 days', NOW()
   )
   
   INSERT INTO financial_events (
     type, entity_type, entity_id,
     amount, category, created_at
   ) VALUES (
     'CREDIT', 'DRIVER', driver_id,
     220.00, 'CREDIT_PURCHASE', NOW()
   )
   
   COMMIT

4. WebSocket → Motorista:
   {
     type: "CREDIT_ACTIVATED",
     amount: 220.00,
     balance: 220.00
   }
```

---

### PASSO 2: Motorista Usa Crédito em Corridas

#### Backend (Durante Finalização de Corrida)
```
Ao finalizar corrida (Fluxo #1, Passo 12):

1. Verifica se motorista tem crédito ativo:
   SELECT SUM(amount) as balance
   FROM driver_credits
   WHERE driver_id = driver_id
     AND status = 'ACTIVE'
     AND expires_at > NOW()

2. Se balance > 0:
   
   commission = price * commission_rate
   
   -- Deduz comissão do crédito (não do ganho)
   UPDATE driver_credits
   SET amount = amount - commission
   WHERE driver_id = driver_id
     AND status = 'ACTIVE'
   ORDER BY expires_at ASC  -- FIFO
   LIMIT 1

   -- Motorista ganha 100% da corrida
   driver_earns = price  // R$ 18.85 integral

3. Se balance == 0:
   └─ Volta ao modelo normal (comissão 13%)
```

---

## 🎯 PONTOS CRÍTICOS CONSOLIDADOS

### 1. **Concorrência e Race Conditions**
```
ONDE:
├─ Aceite de corrida (2 motoristas simultâneos)
├─ Saldo da wallet (2 saques simultâneos)
└─ Ledger financeiro (eventos duplicados)

SOLUÇÃO:
├─ SELECT ... FOR UPDATE (lock pessimista)
├─ Transações ACID
└─ Idempotência em webhooks
```

---

### 2. **Tempo Real (WebSocket)**
```
ONDE:
├─ Localização do motorista (passageiro vê)
├─ Status da corrida (ambos veem)
└─ Notificação de nova corrida (motorista)

SOLUÇÃO:
├─ WebSocket para eventos críticos
├─ Fallback para polling (se WebSocket cai)
└─ Redis Pub/Sub para broadcast
```

---

### 3. **Pagamento e Reconciliação**
```
ONDE:
├─ Captura de pagamento (Pix, cartão, cash)
├─ Repasse para motorista (D+2)
└─ Reconciliação diária

SOLUÇÃO:
├─ Webhooks idempotentes
├─ Ledger append-only (imutável)
├─ Jobs de reconciliação automática
└─ Alertas para divergências
```

---

### 4. **Matching Eficiente**
```
ONDE:
├─ Buscar motorista mais próximo
├─ Oferecer corrida em ordem de prioridade
└─ Lidar com recusas sem penalizar

SOLUÇÃO:
├─ Geo-spatial queries (PostGIS)
├─ Algoritmo de prioridade (distância + aceite + rating)
├─ Retry automático em recusas
└─ Escala horizontal do matching service
```

---

## 🔗 ONDE UX INFLUENCIA BACKEND

### 1. **Transparência = Complexidade no Backend**
```
UX: Motorista vê destino ANTES de aceitar
BACKEND: Precisa calcular rota e preço em < 500ms

UX: Passageiro vê preço fixo ANTES de solicitar
BACKEND: Precisa estimar com alta precisão

UX: Wallet mostra breakdown detalhado
BACKEND: Ledger precisa categorizar tudo
```

---

### 2. **Tempo Real = Infraestrutura Robusta**
```
UX: Pin do motorista se move suavemente
BACKEND: WebSocket + Redis Pub/Sub + escala horizontal

UX: Notificação instantânea de nova corrida
BACKEND: Push notification + timeout + retry
```

---

### 3. **Autonomia = Complexidade no Matching**
```
UX: Motorista pode recusar sem punição
BACKEND: Matching precisa ser mais inteligente:
├─ Oferecer para múltiplos (sequencial)
├─ Expandir raio gradualmente
└─ Lidar com timeout
```

---

### 4. **Segurança = Auditoria Completa**
```
UX: Botão de emergência
BACKEND: Log detalhado + alerta imediato + gravação de localização

UX: Compartilhar viagem
BACKEND: Link público com tracking em tempo real
```

---

✅ **Etapa 6 concluída:** Fluxos completos descritos com todos os pontos críticos mapeados  
📍 **Próxima etapa:** [ETAPA 7 — Planejamento do Backend (Núcleo Técnico)](#etapa-7--planejamento-do-backend-núcleo-técnico)

---

# ETAPA 7 — PLANEJAMENTO DO BACKEND (NÚCLEO TÉCNICO)

## 🏗️ INTRODUÇÃO

Esta etapa estrutura o **backend completo** do iBora seguindo:
- ✅ Arquitetura de produção (não MVP frágil)
- ✅ Padrões de mercado (Uber-like, fintech)
- ✅ Decisões explícitas (sempre com "por quê")
- ✅ Escalabilidade desde o início

**Stack confirmado:**
```
Backend: FastAPI (Python 3.11+)
Database: PostgreSQL 15+ (com PostGIS)
Cache: Redis 7+
Queue: RabbitMQ 3.12+
Real-time: WebSocket (FastAPI native)
Payment: Efí Bank (Pix), Stripe/Pagarme (Cartão)
Storage: AWS S3 (documentos, fotos)
Infra: AWS (ECS Fargate / EKS)
```

---

## 📐 MODELO DE DOMÍNIO

### Entidades Principais

#### **1. User (Usuário Base)**
```python
# Herança: User → Passenger | Driver | Admin
class User:
    id: UUID
    phone: str  # +5511999998888 (único)
    email: str | None
    password_hash: str
    name: str
    cpf: str  # 123.456.789-00 (único)
    birth_date: date
    created_at: datetime
    updated_at: datetime
    status: UserStatus  # ACTIVE, SUSPENDED, DELETED
    
    # Relacionamentos
    addresses: List[Address]
    payment_methods: List[PaymentMethod]
```

---

#### **2. Passenger (Passageiro)**
```python
class Passenger(User):
    rating: Decimal  # média de avaliações recebidas
    total_rides: int
    preferences: JSON  # {favorite_addresses, payment_default}
    
    # iBora Pass
    subscription_id: UUID | None
    subscription_status: SubscriptionStatus
    
    # Relacionamentos
    rides: List[Ride]
    ratings_given: List[Rating]
    ratings_received: List[Rating]
```

---

#### **3. Driver (Motorista)**
```python
class Driver(User):
    # Documentos
    cnh: str  # número CNH (único)
    cnh_category: str  # B, AB
    cnh_expires_at: date
    cnh_photo_url: str  # S3
    
    vehicle_id: UUID
    
    # Operacional
    status: DriverStatus  # OFFLINE, ONLINE, ON_RIDE, UNAVAILABLE
    current_ride_id: UUID | None
    current_location: Point  # PostGIS (lat, lng)
    last_location_update: datetime
    
    # Métricas
    rating: Decimal  # média
    total_rides: int
    total_earnings: Decimal
    acceptance_rate: Decimal  # % de corridas aceitas
    completion_rate: Decimal  # % de corridas finalizadas
    cancellation_rate: Decimal  # % canceladas pelo motorista
    
    # Categoria (comissão)
    category: DriverCategory  # BEGINNER, REGULAR, PREMIUM, ELITE
    commission_rate: Decimal  # 0.15, 0.13, 0.12, 0.10
    
    # Financeiro
    wallet: DriverWallet
    pix_key: str | None
    pix_key_type: PixKeyType  # CPF, PHONE, EMAIL, RANDOM
    bank_account: BankAccount | None
    
    # Relacionamentos
    vehicle: Vehicle
    rides: List[Ride]
    wallet_entries: List[DriverWalletEntry]
    withdrawals: List[Withdrawal]
    credits: List[DriverCredit]
```

---

#### **4. Vehicle (Veículo)**
```python
class Vehicle:
    id: UUID
    driver_id: UUID
    
    # Dados do veículo
    brand: str  # Fiat, Chevrolet
    model: str  # Argo, Onix
    year: int  # 2020
    color: str  # Prata
    plate: str  # ABC-1234 (único)
    
    # Documentos
    crlv_photo_url: str  # S3
    crlv_expires_at: date
    
    # Status
    status: VehicleStatus  # ACTIVE, UNDER_REVIEW, REJECTED
    
    created_at: datetime
    updated_at: datetime
```

---

#### **5. Ride (Corrida)** — **ENTIDADE CENTRAL**
```python
class Ride:
    id: UUID
    
    # Participantes
    passenger_id: UUID
    driver_id: UUID | None  # null até aceitar
    
    # Localização
    origin: Point  # PostGIS
    origin_address: str
    destination: Point
    destination_address: str
    
    # Rota
    polyline: str  # encoded polyline do Google
    distance_estimated_km: Decimal
    duration_estimated_min: int
    distance_actual_km: Decimal | None  # após finalizar
    duration_actual_min: int | None
    
    # Precificação
    price_estimated: Decimal
    price_final: Decimal | None
    surge_multiplier: Decimal  # 1.0 = normal, 1.5 = pico
    breakdown: JSON  # {base, distance, time, surge}
    
    # Financeiro
    commission: Decimal | None  # após finalizar
    driver_earns: Decimal | None
    platform_earns: Decimal | None
    
    # Status e Timestamps
    status: RideStatus
    created_at: datetime  # solicitada
    matched_at: datetime | None  # motorista aceitou
    started_at: datetime | None  # iniciou viagem
    ended_at: datetime | None  # finalizou
    cancelled_at: datetime | None
    
    # Pagamento
    payment_method: PaymentMethod  # PIX, CREDIT_CARD, CASH
    payment_status: PaymentStatus
    payment_txid: str | None  # ID externo (Efí, Stripe)
    paid_at: datetime | None
    
    # Cancelamento
    cancelled_by: CancelledBy | None  # PASSENGER, DRIVER, SYSTEM
    cancellation_reason: str | None
    cancellation_fee: Decimal | None
    
    # Relacionamentos
    passenger: Passenger
    driver: Driver | None
    events: List[RideEvent]
    ratings: List[Rating]
    location_history: List[LocationHistory]
```

---

#### **6. RideEvent (Eventos da Corrida)** — **AUDITORIA**
```python
class RideEvent:
    id: UUID
    ride_id: UUID
    event_type: RideEventType
    data: JSON  # payload específico do evento
    created_at: datetime
    created_by: UUID | None  # user_id ou null (sistema)

# Tipos de eventos
class RideEventType(Enum):
    RIDE_REQUESTED = "RIDE_REQUESTED"
    RIDE_MATCHED = "RIDE_MATCHED"
    RIDE_ACCEPTED = "RIDE_ACCEPTED"
    RIDE_STARTED = "RIDE_STARTED"
    RIDE_COMPLETED = "RIDE_COMPLETED"
    RIDE_CANCELLED = "RIDE_CANCELLED"
    DRIVER_ARRIVED = "DRIVER_ARRIVED"
    PAYMENT_CONFIRMED = "PAYMENT_CONFIRMED"
    PAYMENT_FAILED = "PAYMENT_FAILED"
    RATING_SUBMITTED = "RATING_SUBMITTED"
```

---

#### **7. FinancialEvent (Ledger Financeiro)** — **APPEND-ONLY**
```python
class FinancialEvent:
    id: UUID
    
    # Tipo de movimento
    type: TransactionType  # CREDIT, DEBIT
    
    # Entidade afetada
    entity_type: EntityType  # PASSENGER, DRIVER, PLATFORM
    entity_id: UUID
    
    # Valor
    amount: Decimal  # sempre positivo
    
    # Categoria (rastreabilidade)
    category: FinancialCategory
    
    # Relacionamentos
    ride_id: UUID | None
    withdrawal_id: UUID | None
    credit_purchase_id: UUID | None
    
    # Metadata
    metadata: JSON
    
    # Timestamp
    created_at: datetime  # IMUTÁVEL
    
    # NUNCA: updated_at, deleted_at
    # Ledger é APPEND-ONLY

class FinancialCategory(Enum):
    # Receitas
    RIDE_PAYMENT = "RIDE_PAYMENT"  # passageiro paga corrida
    CANCELLATION_FEE = "CANCELLATION_FEE"
    CREDIT_PURCHASE = "CREDIT_PURCHASE"  # motorista compra crédito
    SUBSCRIPTION = "SUBSCRIPTION"  # iBora Pass
    
    # Ganhos motorista
    RIDE_EARNING = "RIDE_EARNING"  # ganho de corrida
    TIP = "TIP"  # gorjeta
    INCENTIVE_BONUS = "INCENTIVE_BONUS"  # bônus de campanha
    CREDIT_USAGE = "CREDIT_USAGE"  # usa crédito pré-pago
    
    # Custos motorista
    WITHDRAWAL = "WITHDRAWAL"  # saque
    WITHDRAWAL_FEE = "WITHDRAWAL_FEE"  # taxa de saque D+0
    
    # Plataforma
    COMMISSION = "COMMISSION"  # comissão de corrida
    PAYMENT_FEE = "PAYMENT_FEE"  # taxa de processamento
```

---

#### **8. DriverWallet (Carteira do Motorista)**
```python
class DriverWallet:
    driver_id: UUID  # PK
    
    # Saldos (calculados dinamicamente via wallet_entries)
    available_balance: Decimal  # pode sacar
    pending_balance: Decimal  # D+2 ainda não liberado
    blocked_balance: Decimal  # disputas, fraude
    
    # Cache (atualizado via trigger)
    last_updated: datetime
```

---

#### **9. DriverWalletEntry (Movimentações da Wallet)**
```python
class DriverWalletEntry:
    id: UUID
    driver_id: UUID
    
    # Valor e tipo
    amount: Decimal
    type: WalletEntryType  # RIDE_EARNING, TIP, BONUS, WITHDRAWAL
    
    # Status de disponibilidade
    status: WalletEntryStatus  # PENDING, AVAILABLE, WITHDRAWN, BLOCKED
    available_at: datetime  # quando fica disponível (D+2)
    
    # Relacionamentos
    ride_id: UUID | None
    withdrawal_id: UUID | None
    financial_event_id: UUID  # FK para ledger
    
    # Metadata
    description: str
    
    created_at: datetime
    updated_at: datetime

class WalletEntryStatus(Enum):
    PENDING = "PENDING"  # aguardando D+2
    AVAILABLE = "AVAILABLE"  # pode sacar
    WITHDRAWN = "WITHDRAWN"  # já sacado
    BLOCKED = "BLOCKED"  # bloqueado (disputa)
```

---

#### **10. Withdrawal (Saque)**
```python
class Withdrawal:
    id: UUID
    driver_id: UUID
    
    # Valores
    amount: Decimal  # valor solicitado
    fee: Decimal  # taxa (se D+0)
    net_amount: Decimal  # valor líquido
    
    # Tipo
    withdrawal_type: WithdrawalType  # D0, D2
    
    # Destino
    pix_key: str
    pix_key_type: PixKeyType
    
    # Status
    status: WithdrawalStatus  # PENDING, PROCESSING, COMPLETED, FAILED
    
    # Agendamento
    scheduled_at: datetime  # quando será processado
    processed_at: datetime | None
    completed_at: datetime | None
    
    # Integração bancária
    transaction_id: str | None  # ID externo (Efí)
    fail_reason: str | None
    
    created_at: datetime
    updated_at: datetime

class WithdrawalStatus(Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"
```

---

#### **11. DriverCredit (Crédito Pré-pago)**
```python
class DriverCredit:
    id: UUID
    driver_id: UUID
    
    # Valor
    amount: Decimal  # saldo restante
    original_amount: Decimal  # valor inicial
    
    # Tipo
    type: CreditType  # PREPAID, PROMOTIONAL
    
    # Status
    status: CreditStatus  # ACTIVE, EXPIRED, CONSUMED
    
    # Validade
    expires_at: datetime
    
    created_at: datetime
    updated_at: datetime
```

---

#### **12. Rating (Avaliação)**
```python
class Rating:
    id: UUID
    ride_id: UUID
    
    # Avaliador e avaliado
    from_user_id: UUID
    to_user_id: UUID
    
    # Avaliação
    rating: int  # 1-5
    comment: str | None
    
    # Gorjeta (opcional, apenas passageiro → motorista)
    tip_amount: Decimal | None
    
    created_at: datetime
```

---

#### **13. PaymentMethod (Método de Pagamento)**
```python
class PaymentMethod:
    id: UUID
    user_id: UUID
    
    # Tipo
    method_type: PaymentMethodType  # PIX, CREDIT_CARD, DEBIT_CARD, CASH
    
    # Dados do cartão (se aplicável)
    card_last4: str | None  # 1234
    card_brand: str | None  # Visa, Mastercard
    card_token: str | None  # token do provider
    
    # Pix
    pix_key: str | None
    
    # Status
    is_default: bool
    is_active: bool
    
    created_at: datetime
```

---

#### **14. IncentiveCampaign (Campanha de Incentivo)**
```python
class IncentiveCampaign:
    id: UUID
    
    # Detalhes
    name: str  # "Motorista Premium"
    description: str
    
    # Tipo de incentivo
    incentive_type: IncentiveType  # DISCOUNT, BONUS, FREE_USAGE, PARTNER
    
    # Regras de elegibilidade (JSON)
    rules: JSON  # {accept_rate: >=0.9, total_rides: >=50}
    
    # Benefício
    benefit: JSON  # {commission_reduction: 0.03} ou {bonus: 200}
    
    # Validade
    starts_at: datetime
    ends_at: datetime
    
    # Status
    status: CampaignStatus  # ACTIVE, PAUSED, ENDED
    
    created_at: datetime
    updated_at: datetime
```

---

#### **15. DriverIncentive (Incentivo Aplicado)**
```python
class DriverIncentive:
    id: UUID
    driver_id: UUID
    campaign_id: UUID
    
    # Tipo e valor
    incentive_type: IncentiveType
    value: Decimal | None  # se for bônus monetário
    
    # Status
    status: IncentiveStatus  # PENDING, ACTIVE, EXPIRED, CONSUMED
    
    # Validade
    valid_from: datetime
    valid_until: datetime
    
    # Uso (se aplicável)
    consumed_at: datetime | None
    
    created_at: datetime
```

---

## 🔄 MÁQUINA DE ESTADOS DA CORRIDA

### Estados Possíveis

```python
class RideStatus(Enum):
    # 1. Solicitação
    SEARCHING = "SEARCHING"  # procurando motorista
    
    # 2. Aceite
    ACCEPTED = "ACCEPTED"  # motorista aceitou, indo buscar
    
    # 3. Em andamento
    DRIVER_ARRIVED = "DRIVER_ARRIVED"  # motorista chegou
    IN_PROGRESS = "IN_PROGRESS"  # viagem iniciada
    
    # 4. Finalização
    COMPLETED = "COMPLETED"  # viagem finalizada
    
    # 5. Cancelamento
    CANCELLED_BY_PASSENGER = "CANCELLED_BY_PASSENGER"
    CANCELLED_BY_DRIVER = "CANCELLED_BY_DRIVER"
    CANCELLED_NO_SHOW = "CANCELLED_NO_SHOW"  # passageiro não apareceu
    CANCELLED_TIMEOUT = "CANCELLED_TIMEOUT"  # nenhum motorista aceitou
```

### Diagrama de Transições

```
SEARCHING
    ├─→ ACCEPTED (motorista aceita)
    ├─→ CANCELLED_TIMEOUT (2 min sem aceite)
    └─→ CANCELLED_BY_PASSENGER (passageiro cancela)

ACCEPTED
    ├─→ DRIVER_ARRIVED (motorista chega)
    ├─→ CANCELLED_BY_DRIVER (motorista cancela)
    └─→ CANCELLED_BY_PASSENGER (passageiro cancela, cobra taxa)

DRIVER_ARRIVED
    ├─→ IN_PROGRESS (passageiro entra)
    ├─→ CANCELLED_NO_SHOW (passageiro não aparece após 5 min)
    └─→ CANCELLED_BY_PASSENGER (passageiro cancela, cobra taxa)

IN_PROGRESS
    ├─→ COMPLETED (motorista finaliza)
    └─→ CANCELLED_BY_DRIVER (excepcional, suporte analisa)

COMPLETED
    └─→ [FIM] (imutável)

CANCELLED_*
    └─→ [FIM] (imutável)
```

### Regras de Transição

```python
# Transições válidas
VALID_TRANSITIONS = {
    RideStatus.SEARCHING: [
        RideStatus.ACCEPTED,
        RideStatus.CANCELLED_TIMEOUT,
        RideStatus.CANCELLED_BY_PASSENGER,
    ],
    RideStatus.ACCEPTED: [
        RideStatus.DRIVER_ARRIVED,
        RideStatus.CANCELLED_BY_DRIVER,
        RideStatus.CANCELLED_BY_PASSENGER,
    ],
    RideStatus.DRIVER_ARRIVED: [
        RideStatus.IN_PROGRESS,
        RideStatus.CANCELLED_NO_SHOW,
        RideStatus.CANCELLED_BY_PASSENGER,
    ],
    RideStatus.IN_PROGRESS: [
        RideStatus.COMPLETED,
        RideStatus.CANCELLED_BY_DRIVER,  # excepcional
    ],
    # Estados finais não têm transições
    RideStatus.COMPLETED: [],
    RideStatus.CANCELLED_BY_PASSENGER: [],
    RideStatus.CANCELLED_BY_DRIVER: [],
    RideStatus.CANCELLED_NO_SHOW: [],
    RideStatus.CANCELLED_TIMEOUT: [],
}

# Validação de transição
def can_transition(current: RideStatus, new: RideStatus) -> bool:
    return new in VALID_TRANSITIONS.get(current, [])
```

---

## 💰 LEDGER FINANCEIRO (APPEND-ONLY)

### Princípios

1. **NUNCA DELETE** — Ledger é imutável
2. **NUNCA UPDATE** — Correções são novas entradas (reversal)
3. **SEMPRE AUDIT** — Cada entrada tem timestamp e origem
4. **DOUBLE-ENTRY** — Toda transação tem débito e crédito

### Exemplo: Corrida Finalizada

```python
# Cenário: Corrida de R$ 18,85
# Comissão 13% = R$ 2,45
# Motorista ganha R$ 16,40

# ENTRADA 1: Passageiro paga
financial_event_1 = FinancialEvent(
    type=TransactionType.DEBIT,
    entity_type=EntityType.PASSENGER,
    entity_id=passenger_id,
    amount=18.85,
    category=FinancialCategory.RIDE_PAYMENT,
    ride_id=ride_id,
    created_at=now()
)

# ENTRADA 2: Motorista ganha
financial_event_2 = FinancialEvent(
    type=TransactionType.CREDIT,
    entity_type=EntityType.DRIVER,
    entity_id=driver_id,
    amount=16.40,
    category=FinancialCategory.RIDE_EARNING,
    ride_id=ride_id,
    created_at=now()
)

# ENTRADA 3: Plataforma ganha comissão
financial_event_3 = FinancialEvent(
    type=TransactionType.CREDIT,
    entity_type=EntityType.PLATFORM,
    entity_id='platform',
    amount=2.45,
    category=FinancialCategory.COMMISSION,
    ride_id=ride_id,
    created_at=now()
)

# Validação: Soma deve bater
assert 18.85 == 16.40 + 2.45  # ✓
```

### Exemplo: Gorjeta

```python
# Passageiro dá gorjeta de R$ 3,00

# ENTRADA 4: Passageiro paga gorjeta
financial_event_4 = FinancialEvent(
    type=TransactionType.DEBIT,
    entity_type=EntityType.PASSENGER,
    entity_id=passenger_id,
    amount=3.00,
    category=FinancialCategory.TIP,
    ride_id=ride_id,
    created_at=now()
)

# ENTRADA 5: Motorista recebe gorjeta (100%, sem comissão)
financial_event_5 = FinancialEvent(
    type=TransactionType.CREDIT,
    entity_type=EntityType.DRIVER,
    entity_id=driver_id,
    amount=3.00,
    category=FinancialCategory.TIP,
    ride_id=ride_id,
    created_at=now()
)
```

### Exemplo: Saque

```python
# Motorista saca R$ 500 via Pix D+2 (grátis)

# ENTRADA 6: Débito da wallet
financial_event_6 = FinancialEvent(
    type=TransactionType.DEBIT,
    entity_type=EntityType.DRIVER,
    entity_id=driver_id,
    amount=500.00,
    category=FinancialCategory.WITHDRAWAL,
    withdrawal_id=withdrawal_id,
    created_at=now()
)
```

### Exemplo: Correção (Reversal)

```python
# Erro: cobramos R$ 18,85 mas deveria ser R$ 15,00
# Diferença: R$ 3,85 para devolver

# NUNCA fazemos UPDATE no evento original
# Criamos novas entradas de reversão:

# ENTRADA 7: Devolução para passageiro
financial_event_7 = FinancialEvent(
    type=TransactionType.CREDIT,
    entity_type=EntityType.PASSENGER,
    entity_id=passenger_id,
    amount=3.85,
    category=FinancialCategory.REFUND,
    ride_id=ride_id,
    metadata={'reason': 'Price correction', 'original_event_id': event_1_id},
    created_at=now()
)

# ENTRADA 8: Débito da plataforma (assume o erro)
financial_event_8 = FinancialEvent(
    type=TransactionType.DEBIT,
    entity_type=EntityType.PLATFORM,
    entity_id='platform',
    amount=3.85,
    category=FinancialCategory.REFUND,
    ride_id=ride_id,
    metadata={'reason': 'Price correction'},
    created_at=now()
)
```

---

## 💼 WALLETS (CARTEIRAS)

### Driver Wallet (Motorista)

#### Estrutura

```python
# Wallet do motorista tem 3 "buckets":
1. AVAILABLE — pode sacar agora
2. PENDING — aguardando D+2
3. BLOCKED — disputas, fraude, investigação
```

#### Cálculo de Saldos (Query)

```sql
-- Saldo disponível (pode sacar)
SELECT SUM(amount) as available_balance
FROM driver_wallet_entries
WHERE driver_id = :driver_id
  AND status = 'AVAILABLE'
  AND deleted_at IS NULL;

-- Saldo pendente (D+2)
SELECT SUM(amount) as pending_balance
FROM driver_wallet_entries
WHERE driver_id = :driver_id
  AND status = 'PENDING'
  AND available_at > NOW()
  AND deleted_at IS NULL;

-- Saldo bloqueado
SELECT SUM(amount) as blocked_balance
FROM driver_wallet_entries
WHERE driver_id = :driver_id
  AND status = 'BLOCKED'
  AND deleted_at IS NULL;
```

#### Lifecycle de uma Entrada

```
1. Corrida finaliza
   └─ INSERT wallet_entry
      ├─ amount: 16.40
      ├─ status: PENDING
      └─ available_at: NOW() + 2 days

2. Após 2 dias (job automático)
   └─ UPDATE status = 'AVAILABLE'

3. Motorista saca
   └─ UPDATE status = 'WITHDRAWN'
      └─ withdrawal_id: xxx
```

---

### Platform Wallet (Plataforma)

```python
# Receitas da plataforma
SELECT 
  SUM(amount) as total_commission
FROM financial_events
WHERE entity_type = 'PLATFORM'
  AND category = 'COMMISSION'
  AND created_at >= :start_date
  AND created_at <= :end_date;

# Custos da plataforma (fees de pagamento, estornos)
SELECT 
  SUM(amount) as total_costs
FROM financial_events
WHERE entity_type = 'PLATFORM'
  AND type = 'DEBIT'
  AND created_at >= :start_date
  AND created_at <= :end_date;

# Lucro líquido
profit = total_commission - total_costs
```

---

## 📅 D+N SETTLEMENT (REPASSE PARA MOTORISTA)

### Conceito

**D+N** = Dias úteis após a corrida para liberar o saldo

**iBora usa:**
- D+2 (padrão, grátis)
- D+0 (antecipação, taxa 1.5%)

### Por que D+2? (Trade-offs)

| Aspecto | D+0 | D+2 | D+7 (Uber) |
|---------|-----|-----|------------|
| **Cashflow da plataforma** | Ruim ❌ | OK ✓ | Ótimo ✓✓ |
| **Satisfação do motorista** | Máxima ✓✓ | Boa ✓ | Ruim ❌ |
| **Risco de fraude** | Alto ❌ | Médio | Baixo ✓ |
| **Custo operacional** | Alto ❌ | Médio | Baixo ✓ |

**Decisão:** D+2 balanceia todos os aspectos.

---

### Job de Settlement (Diário)

```python
# Roda todo dia às 00:00 UTC
@scheduler.scheduled_job('cron', hour=0, minute=0)
async def settle_pending_wallet_entries():
    """
    Libera saldos que atingiram D+2
    """
    
    # 1. Busca entradas que podem ser liberadas
    entries = await db.execute(
        """
        SELECT id, driver_id, amount
        FROM driver_wallet_entries
        WHERE status = 'PENDING'
          AND available_at <= NOW()
          AND deleted_at IS NULL
        """
    )
    
    # 2. Para cada entrada
    for entry in entries:
        try:
            async with db.transaction():
                # 2.1. Atualiza status
                await db.execute(
                    """
                    UPDATE driver_wallet_entries
                    SET status = 'AVAILABLE',
                        updated_at = NOW()
                    WHERE id = :entry_id
                    """,
                    {'entry_id': entry.id}
                )
                
                # 2.2. Atualiza cache da wallet
                await update_driver_wallet_cache(entry.driver_id)
                
                # 2.3. Notifica motorista (opcional)
                await send_notification(
                    driver_id=entry.driver_id,
                    type='BALANCE_AVAILABLE',
                    data={'amount': entry.amount}
                )
                
            logger.info(f"Settled entry {entry.id} for driver {entry.driver_id}")
            
        except Exception as e:
            logger.error(f"Failed to settle entry {entry.id}: {e}")
            # Continua para próxima entrada
            continue
```

---

### Antecipação D+0 (Opcional)

```python
async def request_d0_withdrawal(driver_id: UUID, amount: Decimal):
    """
    Saque antecipado (D+0) com taxa de 1.5%
    """
    
    # 1. Valida saldo disponível + pendente
    total_balance = await get_driver_total_balance(driver_id)
    
    if amount > total_balance:
        raise InsufficientBalanceError()
    
    # 2. Calcula taxa
    fee = amount * Decimal('0.015')  # 1.5%
    net_amount = amount - fee
    
    # 3. Cria saque
    async with db.transaction():
        withdrawal = Withdrawal(
            driver_id=driver_id,
            amount=amount,
            fee=fee,
            net_amount=net_amount,
            withdrawal_type=WithdrawalType.D0,
            scheduled_at=datetime.now(),  # imediato
            status=WithdrawalStatus.PENDING,
        )
        
        await db.save(withdrawal)
        
        # 4. Move saldo (PENDING → WITHDRAWN)
        await move_balance_to_withdrawn(driver_id, amount, withdrawal.id)
        
        # 5. Publica na fila de processamento imediato
        await publish_message(
            queue='withdrawal.immediate',
            payload={'withdrawal_id': str(withdrawal.id)}
        )
    
    return withdrawal
```

---

## 🔒 ACEITE DE CORRIDA TRANSACIONAL

### Problema: Race Condition

```
Cenário:
├─ Corrida oferecida para motorista A e B
├─ A clica "aceitar" em T+14.9s
├─ B clica "aceitar" em T+14.95s
└─ Ambos fazem POST /rides/{id}/accept simultaneamente

Resultado esperado:
└─ Apenas 1 aceita, o outro recebe erro
```

### Solução: FOR UPDATE Lock

```python
async def accept_ride(ride_id: UUID, driver_id: UUID) -> Ride:
    """
    Aceita corrida com lock pessimista para evitar race condition
    """
    
    async with db.transaction():
        # 1. LOCK PESSIMISTA
        ride = await db.execute(
            """
            SELECT * FROM rides
            WHERE id = :ride_id
            FOR UPDATE  -- ← CRÍTICO: bloqueia até COMMIT
            """,
            {'ride_id': ride_id}
        ).first()
        
        # 2. Valida estado
        if ride is None:
            raise RideNotFoundError()
        
        if ride.status != RideStatus.SEARCHING:
            # Outro motorista já aceitou
            raise RideAlreadyAcceptedError()
        
        # 3. Valida motorista
        driver = await db.get(Driver, driver_id)
        
        if driver.status != DriverStatus.ONLINE:
            raise DriverNotOnlineError()
        
        if driver.current_ride_id is not None:
            raise DriverAlreadyOnRideError()
        
        # 4. Atualiza corrida
        ride.status = RideStatus.ACCEPTED
        ride.driver_id = driver_id
        ride.matched_at = datetime.now()
        
        await db.save(ride)
        
        # 5. Atualiza motorista
        driver.status = DriverStatus.ON_RIDE
        driver.current_ride_id = ride_id
        
        await db.save(driver)
        
        # 6. Cria evento
        event = RideEvent(
            ride_id=ride_id,
            event_type=RideEventType.RIDE_ACCEPTED,
            data={'driver_id': str(driver_id)},
            created_at=datetime.now(),
        )
        
        await db.save(event)
        
        # 7. COMMIT (libera lock)
        # Outros motoristas que tentaram aceitar recebem erro
    
    # 8. Notificações (fora da transação)
    await notify_passenger(ride.passenger_id, 'DRIVER_FOUND', ride)
    await notify_other_drivers(ride_id, 'RIDE_TAKEN')
    
    return ride
```

---

## 🔔 WEBHOOKS IDEMPOTENTES

### Problema: Duplicação

```
Cenário:
├─ Efí Bank envia webhook "pagamento confirmado"
├─ Servidor processa → responde 200
├─ Resposta não chega (timeout de rede)
├─ Efí reenvia mesmo webhook (retry)
└─ Risco: processar 2x
```

### Solução: Idempotency Key

```python
async def process_pix_webhook(webhook_data: dict):
    """
    Processa webhook do Efí Bank com idempotência
    """
    
    # 1. Extrai chave de idempotência
    txid = webhook_data['txid']  # ID único da transação
    
    # 2. Verifica se já processou
    existing = await db.execute(
        """
        SELECT id FROM payment_events
        WHERE external_txid = :txid
        LIMIT 1
        """,
        {'txid': txid}
    ).first()
    
    if existing:
        # Já processado, retorna sucesso (idempotência)
        logger.info(f"Webhook already processed: {txid}")
        return {'status': 'ok', 'already_processed': True}
    
    # 3. Processa webhook (primeira vez)
    async with db.transaction():
        # 3.1. Encontra corrida pelo txid
        ride = await db.execute(
            """
            SELECT * FROM rides
            WHERE payment_txid = :txid
            FOR UPDATE
            """,
            {'txid': txid}
        ).first()
        
        if not ride:
            raise RideNotFoundError(f"Ride not found for txid {txid}")
        
        # 3.2. Atualiza status de pagamento
        ride.payment_status = PaymentStatus.CONFIRMED
        ride.paid_at = datetime.now()
        
        await db.save(ride)
        
        # 3.3. Cria evento de pagamento (chave: external_txid)
        payment_event = PaymentEvent(
            ride_id=ride.id,
            type='PAYMENT_RECEIVED',
            external_txid=txid,  # ← UNIQUE constraint
            amount=webhook_data['amount'],
            provider='EFI_PIX',
            status='CONFIRMED',
            created_at=datetime.now(),
        )
        
        await db.save(payment_event)
        
        # 3.4. Libera saldo para motorista (D+2)
        await update_wallet_entry_status(ride.id, 'PENDING')
    
    # 4. Notificações
    await notify_passenger(ride.passenger_id, 'PAYMENT_CONFIRMED')
    await notify_driver(ride.driver_id, 'PAYMENT_CONFIRMED')
    
    return {'status': 'ok', 'processed': True}
```

### Schema para Idempotência

```sql
CREATE TABLE payment_events (
    id UUID PRIMARY KEY,
    ride_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    external_txid VARCHAR(255) UNIQUE,  -- ← UNIQUE: garante idempotência
    amount DECIMAL(10, 2) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_payment_events_txid ON payment_events(external_txid);
```

---

## 🛡️ ANTIFRAUDE BÁSICO

### Detecções Básicas (MVP)

#### 1. Múltiplos Cancelamentos Consecutivos

```python
async def detect_cancellation_fraud(user_id: UUID, user_type: str):
    """
    Detecta padrão de cancelamento abusivo
    """
    
    # Conta cancelamentos nas últimas 24h
    cancellations = await db.execute(
        """
        SELECT COUNT(*) as total
        FROM rides
        WHERE (:user_type = 'driver' AND driver_id = :user_id)
           OR (:user_type = 'passenger' AND passenger_id = :user_id)
          AND status LIKE 'CANCELLED_%'
          AND created_at >= NOW() - INTERVAL '24 hours'
        """,
        {'user_id': user_id, 'user_type': user_type}
    ).first()
    
    # Regra: >5 cancelamentos em 24h = suspeito
    if cancellations.total > 5:
        await create_fraud_alert(
            user_id=user_id,
            user_type=user_type,
            alert_type='EXCESSIVE_CANCELLATIONS',
            data={'count': cancellations.total, 'period': '24h'}
        )
        
        # Bloqueia temporariamente
        await suspend_user(user_id, reason='Excessive cancellations', duration='24h')
```

---

#### 2. Corridas Muito Curtas (Possível Fraude de Bônus)

```python
async def detect_short_ride_fraud(ride: Ride):
    """
    Detecta corridas anormalmente curtas que podem ser fraude
    """
    
    # Corrida < 500m e < 2 min
    if ride.distance_actual_km < 0.5 and ride.duration_actual_min < 2:
        
        # Conta corridas curtas do motorista (última semana)
        short_rides = await db.execute(
            """
            SELECT COUNT(*) as total
            FROM rides
            WHERE driver_id = :driver_id
              AND distance_actual_km < 0.5
              AND duration_actual_min < 2
              AND created_at >= NOW() - INTERVAL '7 days'
            """,
            {'driver_id': ride.driver_id}
        ).first()
        
        # >10 corridas curtas = suspeito
        if short_rides.total > 10:
            await create_fraud_alert(
                user_id=ride.driver_id,
                user_type='driver',
                alert_type='SHORT_RIDE_PATTERN',
                data={'count': short_rides.total, 'ride_id': str(ride.id)}
            )
```

---

#### 3. Mesmo Passageiro e Motorista (Conluio)

```python
async def detect_collusion_fraud(ride: Ride):
    """
    Detecta possível conluio entre motorista e passageiro
    """
    
    # Conta corridas entre os mesmos usuários
    repeated_pairs = await db.execute(
        """
        SELECT COUNT(*) as total
        FROM rides
        WHERE passenger_id = :passenger_id
          AND driver_id = :driver_id
          AND created_at >= NOW() - INTERVAL '30 days'
        """,
        {'passenger_id': ride.passenger_id, 'driver_id': ride.driver_id}
    ).first()
    
    # >5 corridas no mês = suspeito
    if repeated_pairs.total > 5:
        await create_fraud_alert(
            user_id=ride.driver_id,
            user_type='driver',
            alert_type='COLLUSION_PATTERN',
            data={
                'passenger_id': str(ride.passenger_id),
                'count': repeated_pairs.total
            }
        )
```

---

#### 4. Localização Impossível (Teleporte)

```python
async def detect_location_fraud(driver_id: UUID, new_location: Point):
    """
    Detecta saltos de localização fisicamente impossíveis
    """
    
    # Última localização conhecida
    last_location = await db.execute(
        """
        SELECT lat, lng, created_at
        FROM location_history
        WHERE driver_id = :driver_id
        ORDER BY created_at DESC
        LIMIT 1
        """,
        {'driver_id': driver_id}
    ).first()
    
    if last_location:
        # Calcula distância e tempo
        distance_km = calculate_distance(last_location, new_location)
        time_elapsed_hours = (datetime.now() - last_location.created_at).seconds / 3600
        
        # Velocidade média
        avg_speed = distance_km / time_elapsed_hours if time_elapsed_hours > 0 else 0
        
        # Velocidade > 120 km/h = suspeito (considerando trânsito urbano)
        if avg_speed > 120:
            await create_fraud_alert(
                user_id=driver_id,
                user_type='driver',
                alert_type='IMPOSSIBLE_LOCATION',
                data={
                    'distance_km': distance_km,
                    'time_hours': time_elapsed_hours,
                    'avg_speed_kmh': avg_speed
                }
            )
```

---

### Schema de Alertas

```sql
CREATE TABLE fraud_alerts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    user_type VARCHAR(20) NOT NULL,  -- driver, passenger
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,  -- LOW, MEDIUM, HIGH, CRITICAL
    data JSONB,
    status VARCHAR(20) DEFAULT 'OPEN',  -- OPEN, INVESTIGATING, RESOLVED, FALSE_POSITIVE
    created_at TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP,
    resolved_by UUID,
    notes TEXT
);

CREATE INDEX idx_fraud_alerts_status ON fraud_alerts(status);
CREATE INDEX idx_fraud_alerts_user ON fraud_alerts(user_id, user_type);
```

---

## 📊 OBSERVABILIDADE

### Logs Estruturados

```python
import structlog

logger = structlog.get_logger()

# Exemplo: Log de aceite de corrida
logger.info(
    "ride.accepted",
    ride_id=str(ride.id),
    driver_id=str(driver.id),
    passenger_id=str(ride.passenger_id),
    price=float(ride.price_estimated),
    distance_km=float(ride.distance_estimated_km),
    duration=ride.duration_estimated_min,
    payment_method=ride.payment_method,
)

# Exemplo: Log de erro
logger.error(
    "payment.failed",
    ride_id=str(ride.id),
    payment_method=ride.payment_method,
    error=str(e),
    txid=ride.payment_txid,
    amount=float(ride.price_final),
)
```

---

### Métricas (Prometheus)

```python
from prometheus_client import Counter, Histogram, Gauge

# Contadores
rides_requested = Counter('rides_requested_total', 'Total rides requested')
rides_completed = Counter('rides_completed_total', 'Total rides completed')
rides_cancelled = Counter('rides_cancelled_total', 'Total rides cancelled', ['reason'])

# Histogramas (latência)
ride_accept_duration = Histogram('ride_accept_duration_seconds', 'Time to accept ride')
ride_complete_duration = Histogram('ride_complete_duration_seconds', 'Time to complete ride')

# Gauges (estado atual)
drivers_online = Gauge('drivers_online', 'Number of drivers online')
rides_in_progress = Gauge('rides_in_progress', 'Number of rides in progress')

# Uso
rides_requested.inc()
ride_accept_duration.observe(time_elapsed)
drivers_online.set(count)
```

---

### Health Checks

```python
from fastapi import FastAPI
from sqlalchemy import text

app = FastAPI()

@app.get("/health")
async def health_check():
    """
    Health check básico
    """
    return {"status": "ok"}

@app.get("/health/deep")
async def deep_health_check(db: Session):
    """
    Health check profundo (verifica dependências)
    """
    checks = {}
    
    # 1. PostgreSQL
    try:
        await db.execute(text("SELECT 1"))
        checks['postgresql'] = 'ok'
    except Exception as e:
        checks['postgresql'] = f'error: {str(e)}'
    
    # 2. Redis
    try:
        await redis.ping()
        checks['redis'] = 'ok'
    except Exception as e:
        checks['redis'] = f'error: {str(e)}'
    
    # 3. RabbitMQ
    try:
        await rabbitmq.ping()
        checks['rabbitmq'] = 'ok'
    except Exception as e:
        checks['rabbitmq'] = f'error: {str(e)}'
    
    # Status geral
    all_ok = all(v == 'ok' for v in checks.values())
    status_code = 200 if all_ok else 503
    
    return Response(
        content=json.dumps(checks),
        status_code=status_code,
        media_type="application/json"
    )
```

---

### Alertas (Exemplo: PagerDuty)

```python
# Alerta quando muitas corridas falhando
if failure_rate > 0.05:  # 5%
    await send_alert(
        service='ibora-backend',
        severity='critical',
        message=f'High ride failure rate: {failure_rate:.2%}',
        details={
            'failed_rides': failed_count,
            'total_rides': total_count,
            'time_window': '5min',
        }
    )
```

---

✅ **Etapa 7 concluída:** Backend completo estruturado com modelo de domínio, máquina de estados, ledger, wallets, settlement, transações, webhooks, antifraude e observabilidade  
📍 **Próxima etapa:** [ETAPA 8 — Incentivos, Performance e Fidelidade do Motorista](#etapa-8--incentivos-performance-e-fidelidade-do-motorista)

---

# ETAPA 7 — PLANEJAMENTO DO BACKEND (NÚCLEO TÉCNICO)

## 🏗️ VISÃO GERAL DA ARQUITETURA

### Stack Tecnológico (Definido)
```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND LAYER                     │
├─────────────────────────────────────────────────────┤
│  Mobile Apps (React Native / Flutter)                │
│  Admin Panel (React / Next.js)                       │
└─────────────────────────────────────────────────────┘
                        ↓ ↑
                   HTTPS / WSS
                        ↓ ↑
┌─────────────────────────────────────────────────────┐
│                   API GATEWAY                        │
├─────────────────────────────────────────────────────┤
│  NGINX / Kong                                        │
│  - Rate limiting                                     │
│  - Authentication                                    │
│  - Load balancing                                    │
└─────────────────────────────────────────────────────┘
                        ↓ ↑
┌─────────────────────────────────────────────────────┐
│                 APPLICATION LAYER                    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │   API        │  │  Matching    │  │ WebSocket│ │
│  │  Service     │  │  Service     │  │ Service  │ │
│  │  (FastAPI)   │  │  (FastAPI)   │  │(FastAPI) │ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │  Payment     │  │  Settlement  │  │Analytics │ │
│  │  Service     │  │  Service     │  │ Service  │ │
│  │  (FastAPI)   │  │  (FastAPI)   │  │(FastAPI) │ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
│                                                      │
└─────────────────────────────────────────────────────┘
                        ↓ ↑
┌─────────────────────────────────────────────────────┐
│                  MESSAGE BROKER                      │
├─────────────────────────────────────────────────────┤
│  RabbitMQ                                            │
│  - ride.search                                       │
│  - ride.events                                       │
│  - payment.process                                   │
│  - payment.retry                                     │
│  - settlement.process                                │
└─────────────────────────────────────────────────────┘
                        ↓ ↑
┌─────────────────────────────────────────────────────┐
│                  PERSISTENCE LAYER                   │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────────┐  ┌────────────────────┐  │
│  │   PostgreSQL 15+     │  │   Redis 7+         │  │
│  │   + PostGIS          │  │   - Cache          │  │
│  │   - Main DB          │  │   - Sessions       │  │
│  │   - Ledger           │  │   - Pub/Sub        │  │
│  │   - Read replicas    │  │   - Rate limiting  │  │
│  └──────────────────────┘  └────────────────────┘  │
│                                                      │
└─────────────────────────────────────────────────────┘
                        ↓ ↑
┌─────────────────────────────────────────────────────┐
│                 EXTERNAL SERVICES                    │
├─────────────────────────────────────────────────────┤
│  - Efí Bank (Pix)                                    │
│  - Card Provider (Stripe / Adyen)                    │
│  - Google Maps API                                   │
│  - AWS S3 (Documentos)                               │
│  - Twilio (SMS / Push)                               │
│  - Sentry (Errors)                                   │
│  - DataDog (Observability)                           │
└─────────────────────────────────────────────────────┘
```

---

## 📊 MODELO DE DOMÍNIO COMPLETO

### Entidades Principais

#### **1. Users (Base)**
```
users (tabela base para passageiros e motoristas)
├─ id: UUID (PK)
├─ type: ENUM('PASSENGER', 'DRIVER', 'ADMIN')
├─ phone: VARCHAR(20) UNIQUE NOT NULL
├─ email: VARCHAR(255) UNIQUE
├─ name: VARCHAR(255) NOT NULL
├─ cpf: VARCHAR(14) UNIQUE (motoristas)
├─ photo_url: TEXT
├─ status: ENUM('ACTIVE', 'SUSPENDED', 'BLOCKED')
├─ created_at: TIMESTAMP
├─ updated_at: TIMESTAMP
└─ deleted_at: TIMESTAMP (soft delete)

Indexes:
- idx_users_phone (phone)
- idx_users_email (email)
- idx_users_cpf (cpf)
- idx_users_type_status (type, status)
```

---

#### **2. Passengers (Extensão)**
```
passengers
├─ user_id: UUID (PK, FK → users.id)
├─ total_rides: INTEGER DEFAULT 0
├─ rating: DECIMAL(3,2) DEFAULT 5.00
├─ total_ratings: INTEGER DEFAULT 0
├─ default_payment_method: ENUM('PIX', 'CREDIT_CARD', 'CASH')
├─ subscription_id: UUID (FK → subscriptions.id)
└─ preferences: JSONB
    └─ {
         "favorite_addresses": [...],
         "emergency_contacts": [...]
       }

Indexes:
- idx_passengers_subscription (subscription_id)
```

---

#### **3. Drivers (Extensão + Dados Críticos)**
```
drivers
├─ user_id: UUID (PK, FK → users.id)
├─ status: ENUM('ONLINE', 'OFFLINE', 'ON_RIDE', 'PENDING_APPROVAL')
├─ current_ride_id: UUID (FK → rides.id)
├─ lat: DECIMAL(10,8)
├─ lng: DECIMAL(11,8)
├─ location: GEOGRAPHY(POINT) -- PostGIS
├─ location_updated_at: TIMESTAMP
│
├─ category: ENUM('BEGINNER', 'REGULAR', 'PREMIUM', 'ELITE')
├─ commission_rate: DECIMAL(5,4) DEFAULT 0.15
│
├─ rating: DECIMAL(3,2) DEFAULT 5.00
├─ total_ratings: INTEGER DEFAULT 0
├─ total_rides: INTEGER DEFAULT 0
├─ total_earnings: DECIMAL(10,2) DEFAULT 0
├─ acceptance_rate: DECIMAL(5,4) DEFAULT 1.00
│
├─ vehicle_id: UUID (FK → vehicles.id)
├─ documents_verified: BOOLEAN DEFAULT FALSE
├─ pix_key: VARCHAR(255)
├─ pix_key_type: ENUM('CPF', 'CNPJ', 'EMAIL', 'PHONE', 'RANDOM')
│
└─ preferences: JSONB
    └─ {
         "navigation_app": "GOOGLE_MAPS",
         "auto_accept": false
       }

Indexes:
- idx_drivers_status (status)
- idx_drivers_location (location) USING GIST -- Spatial
- idx_drivers_current_ride (current_ride_id)
- idx_drivers_category (category)
```

---

#### **4. Vehicles**
```
vehicles
├─ id: UUID (PK)
├─ driver_id: UUID (FK → drivers.user_id)
├─ plate: VARCHAR(10) UNIQUE NOT NULL
├─ brand: VARCHAR(50)
├─ model: VARCHAR(50)
├─ color: VARCHAR(30)
├─ year: INTEGER
├─ crlv_url: TEXT (documento)
├─ verified: BOOLEAN DEFAULT FALSE
├─ created_at: TIMESTAMP
└─ deleted_at: TIMESTAMP

Indexes:
- idx_vehicles_plate (plate)
- idx_vehicles_driver (driver_id)
```

---

#### **5. Rides (Entidade Central)**
```
rides
├─ id: UUID (PK)
├─ passenger_id: UUID (FK → passengers.user_id)
├─ driver_id: UUID (FK → drivers.user_id)
│
├─ status: ENUM (ver máquina de estados abaixo)
├─ price_estimated: DECIMAL(10,2)
├─ price_final: DECIMAL(10,2)
├─ commission: DECIMAL(10,2)
├─ distance_km: DECIMAL(8,2)
├─ duration_min: INTEGER
│
├─ origin_lat: DECIMAL(10,8)
├─ origin_lng: DECIMAL(11,8)
├─ origin_address: TEXT
├─ origin_location: GEOGRAPHY(POINT)
│
├─ destination_lat: DECIMAL(10,8)
├─ destination_lng: DECIMAL(11,8)
├─ destination_address: TEXT
├─ destination_location: GEOGRAPHY(POINT)
│
├─ start_location: GEOGRAPHY(POINT)
├─ end_location: GEOGRAPHY(POINT)
├─ route_polyline: TEXT
│
├─ payment_method: ENUM('PIX', 'CREDIT_CARD', 'CASH')
├─ payment_status: ENUM('PENDING', 'CONFIRMED', 'FAILED')
├─ payment_txid: VARCHAR(255)
│
├─ requested_at: TIMESTAMP
├─ accepted_at: TIMESTAMP
├─ started_at: TIMESTAMP
├─ ended_at: TIMESTAMP
├─ cancelled_at: TIMESTAMP
├─ cancel_reason: TEXT
├─ cancelled_by: ENUM('PASSENGER', 'DRIVER', 'SYSTEM')
│
├─ created_at: TIMESTAMP
└─ updated_at: TIMESTAMP

Indexes:
- idx_rides_passenger (passenger_id)
- idx_rides_driver (driver_id)
- idx_rides_status (status)
- idx_rides_payment_status (payment_status)
- idx_rides_created_at (created_at)
- idx_rides_origin (origin_location) USING GIST
- idx_rides_destination (destination_location) USING GIST
```

---

#### **6. Ride Events (Auditoria Completa)**
```
ride_events
├─ id: BIGSERIAL (PK)
├─ ride_id: UUID (FK → rides.id)
├─ event_type: VARCHAR(50) NOT NULL
│   └─ Valores:
│       - RIDE_REQUESTED
│       - RIDE_ACCEPTED
│       - RIDE_STARTED
│       - RIDE_COMPLETED
│       - RIDE_CANCELLED
│       - DRIVER_ARRIVED
│       - PAYMENT_INITIATED
│       - PAYMENT_CONFIRMED
│       - EMERGENCY_TRIGGERED
├─ actor_id: UUID (quem causou o evento)
├─ actor_type: ENUM('PASSENGER', 'DRIVER', 'SYSTEM')
├─ data: JSONB (dados contextuais)
├─ created_at: TIMESTAMP NOT NULL
└─ ip_address: INET

Indexes:
- idx_ride_events_ride (ride_id)
- idx_ride_events_type (event_type)
- idx_ride_events_created (created_at)

NUNCA fazer DELETE ou UPDATE nesta tabela (append-only)
```

---

#### **7. Financial Events (Ledger Append-Only)**
```
financial_events
├─ id: BIGSERIAL (PK)
├─ type: ENUM('CREDIT', 'DEBIT')
├─ entity_type: ENUM('PASSENGER', 'DRIVER', 'PLATFORM')
├─ entity_id: UUID
├─ amount: DECIMAL(10,2) NOT NULL
├─ category: VARCHAR(50) NOT NULL
│   └─ Valores:
│       - RIDE_PAYMENT (passageiro paga)
│       - RIDE_EARNING (motorista ganha)
│       - COMMISSION (plataforma ganha)
│       - TIP (gorjeta)
│       - WITHDRAWAL (saque)
│       - CREDIT_PURCHASE (recarga)
│       - REFUND (estorno)
│       - INCENTIVE_BONUS (bônus)
│       - NO_SHOW_FEE (taxa no-show)
│       - CANCELLATION_FEE (taxa cancelamento)
│
├─ ride_id: UUID (FK → rides.id, se aplicável)
├─ withdrawal_id: UUID (FK → withdrawals.id, se aplicável)
├─ description: TEXT
├─ balance_before: DECIMAL(10,2)
├─ balance_after: DECIMAL(10,2)
│
├─ created_at: TIMESTAMP NOT NULL
└─ metadata: JSONB

Indexes:
- idx_financial_events_entity (entity_type, entity_id)
- idx_financial_events_category (category)
- idx_financial_events_ride (ride_id)
- idx_financial_events_created (created_at)

NUNCA fazer DELETE ou UPDATE (imutável)
```

---

#### **8. Driver Wallet Entries**
```
driver_wallet_entries
├─ id: UUID (PK)
├─ driver_id: UUID (FK → drivers.user_id)
├─ amount: DECIMAL(10,2) NOT NULL
├─ type: ENUM('RIDE_EARNING', 'TIP', 'BONUS', 'CREDIT')
├─ status: ENUM('PENDING', 'AVAILABLE', 'WITHDRAWN', 'BLOCKED')
├─ available_at: TIMESTAMP (D+2)
├─ ride_id: UUID (FK → rides.id, se aplicável)
├─ withdrawal_id: UUID (FK → withdrawals.id, se aplicável)
├─ created_at: TIMESTAMP
└─ deleted_at: TIMESTAMP (soft delete apenas para correções)

Indexes:
- idx_wallet_driver (driver_id)
- idx_wallet_status (status)
- idx_wallet_available_at (available_at)
- idx_wallet_ride (ride_id)

Query de saldo:
SELECT 
  SUM(CASE WHEN status = 'AVAILABLE' THEN amount ELSE 0 END) as available,
  SUM(CASE WHEN status = 'PENDING' THEN amount ELSE 0 END) as pending,
  SUM(CASE WHEN status = 'BLOCKED' THEN amount ELSE 0 END) as blocked
FROM driver_wallet_entries
WHERE driver_id = ? AND deleted_at IS NULL
```

---

#### **9. Withdrawals (Saques)**
```
withdrawals
├─ id: UUID (PK)
├─ driver_id: UUID (FK → drivers.user_id)
├─ amount: DECIMAL(10,2) NOT NULL
├─ fee: DECIMAL(10,2) DEFAULT 0
├─ net_amount: DECIMAL(10,2) NOT NULL
├─ withdrawal_type: ENUM('D0', 'D2')
├─ pix_key: VARCHAR(255) NOT NULL
├─ pix_key_type: ENUM('CPF', 'CNPJ', 'EMAIL', 'PHONE', 'RANDOM')
├─ status: ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED')
├─ transaction_id: VARCHAR(255) (ID do banco)
├─ fail_reason: TEXT
├─ retry_count: INTEGER DEFAULT 0
├─ scheduled_at: TIMESTAMP
├─ completed_at: TIMESTAMP
├─ created_at: TIMESTAMP
└─ updated_at: TIMESTAMP

Indexes:
- idx_withdrawals_driver (driver_id)
- idx_withdrawals_status (status)
- idx_withdrawals_scheduled (scheduled_at)
- idx_withdrawals_created (created_at)
```

---

#### **10. Payment Events (Rastreamento de Pagamentos)**
```
payment_events
├─ id: UUID (PK)
├─ ride_id: UUID (FK → rides.id)
├─ type: ENUM('PAYMENT_INITIATED', 'PAYMENT_RECEIVED', 'PAYMENT_FAILED', 'REFUND')
├─ external_txid: VARCHAR(255) UNIQUE (idempotência)
├─ amount: DECIMAL(10,2)
├─ provider: ENUM('EFI_PIX', 'CARD_STRIPE', 'CASH')
├─ status: ENUM('PENDING', 'CONFIRMED', 'FAILED')
├─ webhook_data: JSONB (payload completo)
├─ created_at: TIMESTAMP
└─ processed_at: TIMESTAMP

Indexes:
- idx_payment_events_ride (ride_id)
- idx_payment_events_external_txid (external_txid) UNIQUE
- idx_payment_events_created (created_at)

Idempotência: external_txid garante que webhook duplicado não processa 2x
```

---

#### **11. Ratings (Avaliações)**
```
ratings
├─ id: UUID (PK)
├─ ride_id: UUID (FK → rides.id)
├─ from_user_id: UUID (FK → users.id)
├─ to_user_id: UUID (FK → users.id)
├─ rating: INTEGER CHECK (rating BETWEEN 1 AND 5)
├─ comment: TEXT
├─ created_at: TIMESTAMP

Indexes:
- idx_ratings_ride (ride_id)
- idx_ratings_to_user (to_user_id)
- idx_ratings_created (created_at)
```

---

#### **12. Location History (Tracking)**
```
location_history
├─ id: BIGSERIAL (PK)
├─ driver_id: UUID (FK → drivers.user_id)
├─ ride_id: UUID (FK → rides.id, se em corrida)
├─ lat: DECIMAL(10,8)
├─ lng: DECIMAL(11,8)
├─ location: GEOGRAPHY(POINT)
├─ accuracy: DECIMAL(6,2) (metros)
├─ speed: DECIMAL(6,2) (km/h)
├─ created_at: TIMESTAMP

Indexes:
- idx_location_driver (driver_id)
- idx_location_ride (ride_id)
- idx_location_created (created_at)
- idx_location_geometry (location) USING GIST

Particionamento: Por data (1 partição por mês)
Retenção: 90 dias (depois arquivar ou deletar)
```

---

## 🔄 MÁQUINA DE ESTADOS DA CORRIDA

### Estados Possíveis
```python
class RideStatus(Enum):
    # 1. Fase de busca
    SEARCHING = "SEARCHING"           # Procurando motorista
    
    # 2. Fase de aceite
    ACCEPTED = "ACCEPTED"             # Motorista aceitou
    DRIVER_ARRIVED = "DRIVER_ARRIVED" # Motorista chegou no local
    
    # 3. Fase de viagem
    IN_PROGRESS = "IN_PROGRESS"       # Corrida em andamento
    
    # 4. Fase de conclusão
    COMPLETED = "COMPLETED"           # Corrida finalizada
    
    # 5. Cancelamentos
    CANCELLED_BY_PASSENGER = "CANCELLED_BY_PASSENGER"
    CANCELLED_BY_DRIVER = "CANCELLED_BY_DRIVER"
    CANCELLED_NO_SHOW = "CANCELLED_NO_SHOW"       # Passageiro não apareceu
    CANCELLED_NO_DRIVER = "CANCELLED_NO_DRIVER"   # Nenhum motorista aceitou
    CANCELLED_SYSTEM = "CANCELLED_SYSTEM"         # Sistema cancelou (erro, fraude)
```

---

### Transições Válidas
```python
VALID_TRANSITIONS = {
    "SEARCHING": [
        "ACCEPTED",
        "CANCELLED_NO_DRIVER",
        "CANCELLED_BY_PASSENGER",
        "CANCELLED_SYSTEM"
    ],
    
    "ACCEPTED": [
        "DRIVER_ARRIVED",
        "IN_PROGRESS",  # Pode pular DRIVER_ARRIVED
        "CANCELLED_BY_PASSENGER",
        "CANCELLED_BY_DRIVER",
        "CANCELLED_NO_SHOW"
    ],
    
    "DRIVER_ARRIVED": [
        "IN_PROGRESS",
        "CANCELLED_BY_PASSENGER",
        "CANCELLED_NO_SHOW"
    ],
    
    "IN_PROGRESS": [
        "COMPLETED",
        "CANCELLED_BY_DRIVER",  # Excepcional
        "CANCELLED_SYSTEM"       # Excepcional (emergência, fraude)
    ],
    
    "COMPLETED": [],  # Estado final
    "CANCELLED_*": []  # Estados finais
}
```

---

### Validação de Transição
```python
def validate_transition(current_status: str, new_status: str) -> bool:
    """
    Valida se a transição de estado é permitida
    """
    allowed = VALID_TRANSITIONS.get(current_status, [])
    
    # Wildcard para cancelamentos
    if current_status.startswith("CANCELLED_"):
        return False  # Não pode sair de cancelado
    
    return new_status in allowed


def update_ride_status(
    ride_id: UUID,
    new_status: str,
    actor_id: UUID,
    actor_type: str
) -> bool:
    """
    Atualiza status da corrida com validação
    """
    # 1. Obter corrida com lock
    ride = db.query(Ride).filter(
        Ride.id == ride_id
    ).with_for_update().first()
    
    if not ride:
        raise RideNotFound()
    
    # 2. Validar transição
    if not validate_transition(ride.status, new_status):
        raise InvalidStatusTransition(
            f"Cannot transition from {ride.status} to {new_status}"
        )
    
    # 3. Atualizar
    ride.status = new_status
    ride.updated_at = datetime.utcnow()
    
    # 4. Criar evento de auditoria
    event = RideEvent(
        ride_id=ride_id,
        event_type=f"STATUS_CHANGED_{new_status}",
        actor_id=actor_id,
        actor_type=actor_type,
        data={
            "old_status": ride.status,
            "new_status": new_status
        }
    )
    db.add(event)
    
    # 5. Commit
    db.commit()
    
    return True
```

---

## 💰 LEDGER FINANCEIRO (APPEND-ONLY)

### Princípios do Ledger

1. **Imutável:** Nunca DELETE ou UPDATE
2. **Append-only:** Apenas INSERT
3. **Auditável:** Cada entrada rastreável
4. **Reconciliável:** Saldo calculado via SUM
5. **Categorizado:** Fácil relatório por categoria

---

### Exemplo de Fluxo Completo (Corrida de R$ 18.85)

```sql
-- 1. Passageiro paga (débito)
INSERT INTO financial_events (
    type, entity_type, entity_id,
    amount, category, ride_id,
    balance_before, balance_after,
    created_at
) VALUES (
    'DEBIT', 'PASSENGER', 'passenger_uuid',
    -18.85, 'RIDE_PAYMENT', 'ride_uuid',
    100.00, 81.15,  -- saldo hipotético
    NOW()
);

-- 2. Motorista ganha (crédito)
INSERT INTO financial_events (
    type, entity_type, entity_id,
    amount, category, ride_id,
    balance_before, balance_after,
    created_at
) VALUES (
    'CREDIT', 'DRIVER', 'driver_uuid',
    16.40, 'RIDE_EARNING', 'ride_uuid',
    500.00, 516.40,
    NOW()
);

-- 3. Plataforma ganha comissão (crédito)
INSERT INTO financial_events (
    type, entity_type, entity_id,
    amount, category, ride_id,
    balance_before, balance_after,
    created_at
) VALUES (
    'CREDIT', 'PLATFORM', 'platform',
    2.45, 'COMMISSION', 'ride_uuid',
    10000.00, 10002.45,
    NOW()
);

-- Validação: soma deve ser 0
-- -18.85 (passageiro) + 16.40 (motorista) + 2.45 (plataforma) = 0 ✓
```

---

### Correção de Erro (Estorno)

```sql
-- Cenário: Corrida foi cancelada, precisa estornar

-- 1. Cria entradas reversas (NÃO deleta as antigas)
INSERT INTO financial_events (
    type, entity_type, entity_id,
    amount, category, ride_id,
    description,
    created_at
) VALUES 
-- Passageiro recebe de volta
(
    'CREDIT', 'PASSENGER', 'passenger_uuid',
    18.85, 'REFUND', 'ride_uuid',
    'Estorno corrida cancelada',
    NOW()
),
-- Motorista devolve
(
    'DEBIT', 'DRIVER', 'driver_uuid',
    -16.40, 'REFUND', 'ride_uuid',
    'Estorno corrida cancelada',
    NOW()
),
-- Plataforma devolve comissão
(
    'DEBIT', 'PLATFORM', 'platform',
    -2.45, 'REFUND', 'ride_uuid',
    'Estorno corrida cancelada',
    NOW()
);

-- Histórico completo mantido:
-- - Evento original (corrida finalizada)
-- - Evento de estorno (corrida cancelada)
-- Auditoria 100% preservada
```

---

### Consulta de Saldo (Derivado do Ledger)

```sql
-- Saldo atual de um motorista
SELECT 
    SUM(amount) as balance
FROM financial_events
WHERE entity_type = 'DRIVER'
  AND entity_id = 'driver_uuid'
  AND created_at <= NOW();

-- Saldo por categoria (breakdown)
SELECT 
    category,
    SUM(amount) as total
FROM financial_events
WHERE entity_type = 'DRIVER'
  AND entity_id = 'driver_uuid'
GROUP BY category
ORDER BY total DESC;

-- Resultado:
-- RIDE_EARNING: 1,500.00
-- TIP: 150.00
-- BONUS: 200.00
-- WITHDRAWAL: -1,200.00
-- ────────────────────────
-- TOTAL: 650.00
```

---

## 💼 WALLETS (GERENCIAMENTO DE SALDO)

### Conceito

**Wallet ≠ Ledger**

- **Ledger:** Histórico imutável de TODAS as transações
- **Wallet:** Visão de saldo "disponível" vs "bloqueado" vs "em processamento"

**Wallet é derivado do Ledger + regras de disponibilidade.**

---

### Driver Wallet (Mais Complexo)

#### Estados do Dinheiro:
```
1. PENDING (D+2)
   └─ Dinheiro existe, mas não pode sacar ainda
   └─ Exemplo: corrida finalizada hoje, disponível em 48h

2. AVAILABLE
   └─ Pode sacar agora
   └─ Passou do período D+2

3. WITHDRAWN
   └─ Já foi sacado
   └─ Não pode sacar de novo

4. BLOCKED
   └─ Bloqueado por disputa ou fraude
   └─ Não pode sacar
```

---

#### Job de Liberação (D+2 Settlement)

```python
# Roda diariamente às 00:00
def process_settlement():
    """
    Libera saldos que passaram do período D+2
    """
    # Query entries que podem ser liberados
    entries = db.query(DriverWalletEntry).filter(
        DriverWalletEntry.status == 'PENDING',
        DriverWalletEntry.available_at <= datetime.utcnow()
    ).all()
    
    for entry in entries:
        # Atualiza status
        entry.status = 'AVAILABLE'
        
        # Cria evento no ledger (opcional, rastreamento)
        event = FinancialEvent(
            type='CREDIT',
            entity_type='DRIVER',
            entity_id=entry.driver_id,
            amount=entry.amount,
            category='SETTLEMENT',
            description=f'D+2 settlement for ride {entry.ride_id}'
        )
        db.add(event)
        
        # Notifica motorista
        send_notification(
            driver_id=entry.driver_id,
            message=f"R$ {entry.amount} disponível para saque!"
        )
    
    db.commit()
    
    logger.info(f"Processed {len(entries)} settlements")
```

---

#### Consulta de Wallet

```python
def get_driver_wallet(driver_id: UUID) -> dict:
    """
    Retorna saldo detalhado do motorista
    """
    # Query agregada
    result = db.query(
        func.sum(
            case(
                (DriverWalletEntry.status == 'AVAILABLE', DriverWalletEntry.amount),
                else_=0
            )
        ).label('available'),
        func.sum(
            case(
                (DriverWalletEntry.status == 'PENDING', DriverWalletEntry.amount),
                else_=0
            )
        ).label('pending'),
        func.sum(
            case(
                (DriverWalletEntry.status == 'BLOCKED', DriverWalletEntry.amount),
                else_=0
            )
        ).label('blocked')
    ).filter(
        DriverWalletEntry.driver_id == driver_id,
        DriverWalletEntry.deleted_at.is_(None)
    ).first()
    
    return {
        "available": float(result.available or 0),
        "pending": float(result.pending or 0),
        "blocked": float(result.blocked or 0),
        "total": float(
            (result.available or 0) + 
            (result.pending or 0) + 
            (result.blocked or 0)
        )
    }
```

---

## 🔐 ACEITE DE CORRIDA TRANSACIONAL

### Problema: Race Condition

```
Cenário:
├─ Corrida X oferecida para motoristas A e B
├─ Motorista A aceita em T+14.9s
├─ Motorista B aceita em T+14.95s
└─ Sistema precisa garantir que apenas 1 aceita
```

---

### Solução: SELECT FOR UPDATE

```python
from sqlalchemy import select
from sqlalchemy.orm import Session

def accept_ride(
    ride_id: UUID,
    driver_id: UUID,
    db: Session
) -> dict:
    """
    Aceita corrida com proteção contra race condition
    """
    try:
        # 1. Inicia transação explícita
        db.begin()
        
        # 2. SELECT FOR UPDATE (lock pessimista)
        ride = db.execute(
            select(Ride)
            .where(Ride.id == ride_id)
            .with_for_update()  # ← LOCK aqui
        ).scalar_one()
        
        # 3. Valida estado (apenas 1 thread chegará aqui por vez)
        if ride.status != 'SEARCHING':
            db.rollback()
            raise RideAlreadyAccepted(
                f"Ride is in status {ride.status}"
            )
        
        # 4. Valida motorista
        driver = db.query(Driver).filter(
            Driver.user_id == driver_id
        ).first()
        
        if driver.status != 'ONLINE':
            db.rollback()
            raise DriverNotAvailable()
        
        if driver.current_ride_id is not None:
            db.rollback()
            raise DriverBusy()
        
        # 5. Atualiza corrida
        ride.status = 'ACCEPTED'
        ride.driver_id = driver_id
        ride.accepted_at = datetime.utcnow()
        
        # 6. Atualiza motorista
        driver.status = 'ON_RIDE'
        driver.current_ride_id = ride_id
        
        # 7. Cria evento de auditoria
        event = RideEvent(
            ride_id=ride_id,
            event_type='RIDE_ACCEPTED',
            actor_id=driver_id,
            actor_type='DRIVER',
            data={
                "driver_lat": driver.lat,
                "driver_lng": driver.lng,
                "distance_to_pickup": calculate_distance(
                    driver.lat, driver.lng,
                    ride.origin_lat, ride.origin_lng
                )
            }
        )
        db.add(event)
        
        # 8. Commit (libera lock)
        db.commit()
        
        # 9. Publica eventos em tempo real (fora da transação)
        publish_websocket(
            channel=f"passenger:{ride.passenger_id}",
            event={
                "type": "DRIVER_FOUND",
                "driver": serialize_driver(driver),
                "ride": serialize_ride(ride)
            }
        )
        
        publish_websocket(
            channel=f"driver:{driver_id}",
            event={
                "type": "RIDE_ACCEPTED",
                "ride": serialize_ride(ride)
            }
        )
        
        # 10. Notifica outros motoristas (corrida não disponível)
        publish_rabbitmq(
            queue='ride.offer.cancel',
            message={
                "ride_id": str(ride_id),
                "accepted_by": str(driver_id)
            }
        )
        
        return {
            "success": True,
            "ride_id": str(ride_id),
            "status": ride.status
        }
    
    except RideAlreadyAccepted as e:
        return {
            "success": False,
            "error": "ALREADY_ACCEPTED",
            "message": str(e)
        }
    
    except (DriverNotAvailable, DriverBusy) as e:
        return {
            "success": False,
            "error": "DRIVER_NOT_AVAILABLE",
            "message": str(e)
        }
    
    except Exception as e:
        db.rollback()
        logger.error(f"Error accepting ride: {e}")
        raise
```

---

### Teste de Race Condition

```python
import asyncio
import httpx

async def test_concurrent_accept():
    """
    Simula 2 motoristas aceitando ao mesmo tempo
    """
    ride_id = "test-ride-uuid"
    driver_a = "driver-a-uuid"
    driver_b = "driver-b-uuid"
    
    async with httpx.AsyncClient() as client:
        # Dispara 2 requests simultâneos
        results = await asyncio.gather(
            client.post(
                f"/rides/{ride_id}/accept",
                headers={"Authorization": f"Bearer {token_a}"}
            ),
            client.post(
                f"/rides/{ride_id}/accept",
                headers={"Authorization": f"Bearer {token_b}"}
            ),
            return_exceptions=True
        )
    
    # Valida resultados
    success_count = sum(1 for r in results if r.status_code == 200)
    conflict_count = sum(1 for r in results if r.status_code == 409)
    
    assert success_count == 1, "Exactly 1 should succeed"
    assert conflict_count == 1, "Exactly 1 should fail with 409"
    
    print("✅ Race condition test passed")
```

---

## 🔔 WEBHOOKS IDEMPOTENTES

### Problema: Webhooks Duplicados

```
Cenário:
├─ Efí Bank envia webhook de pagamento confirmado
├─ Servidor responde 500 (erro temporário)
├─ Efí faz retry após 1 minuto
├─ Servidor processa webhook novamente
└─ Resultado: pagamento processado 2x ❌
```

---

### Solução: Idempotência via external_txid

```python
from fastapi import APIRouter, HTTPException, Request
from sqlalchemy.exc import IntegrityError

router = APIRouter()

@router.post("/webhooks/efi/pix")
async def efi_pix_webhook(request: Request, db: Session):
    """
    Processa webhook do Efí Bank (Pix)
    Garante idempotência via external_txid
    """
    # 1. Parse payload
    payload = await request.json()
    
    # 2. Valida assinatura (segurança)
    if not validate_efi_signature(request.headers, payload):
        raise HTTPException(401, "Invalid signature")
    
    # 3. Extrai dados
    external_txid = payload.get("txid")
    event_type = payload.get("event")
    amount = Decimal(payload.get("amount", 0))
    
    if not external_txid:
        raise HTTPException(400, "Missing txid")
    
    # 4. Verifica idempotência (chave única)
    existing = db.query(PaymentEvent).filter(
        PaymentEvent.external_txid == external_txid
    ).first()
    
    if existing:
        # Já processado, retorna sucesso sem processar
        logger.info(f"Webhook {external_txid} already processed, skipping")
        return {"status": "ok", "message": "already_processed"}
    
    # 5. Processa webhook (apenas 1x)
    try:
        if event_type == "PAYMENT_CONFIRMED":
            process_payment_confirmed(
                external_txid=external_txid,
                amount=amount,
                payload=payload,
                db=db
            )
        
        elif event_type == "PAYMENT_FAILED":
            process_payment_failed(
                external_txid=external_txid,
                payload=payload,
                db=db
            )
        
        # 6. Retorna sucesso
        return {"status": "ok", "message": "processed"}
    
    except IntegrityError as e:
        # Constraint de external_txid violada
        # Outro processo processou entre nosso check e insert
        db.rollback()
        logger.warning(f"Race condition on webhook {external_txid}")
        return {"status": "ok", "message": "already_processed"}
    
    except Exception as e:
        db.rollback()
        logger.error(f"Error processing webhook: {e}")
        raise HTTPException(500, "Processing error")


def process_payment_confirmed(
    external_txid: str,
    amount: Decimal,
    payload: dict,
    db: Session
):
    """
    Processa pagamento confirmado
    """
    # 1. Encontra corrida (pelo ride_id no payload)
    ride_id = payload.get("ride_id")
    ride = db.query(Ride).filter(Ride.id == ride_id).first()
    
    if not ride:
        raise ValueError(f"Ride {ride_id} not found")
    
    # 2. Cria payment event (UNIQUE constraint em external_txid)
    payment_event = PaymentEvent(
        ride_id=ride_id,
        type='PAYMENT_RECEIVED',
        external_txid=external_txid,  # ← Garante idempotência
        amount=amount,
        provider='EFI_PIX',
        status='CONFIRMED',
        webhook_data=payload,
        created_at=datetime.utcnow()
    )
    db.add(payment_event)
    
    # 3. Atualiza corrida
    ride.payment_status = 'CONFIRMED'
    ride.paid_at = datetime.utcnow()
    ride.payment_txid = external_txid
    
    # 4. Libera saldo para motorista (de PENDING para disponível em D+2)
    wallet_entry = db.query(DriverWalletEntry).filter(
        DriverWalletEntry.ride_id == ride_id,
        DriverWalletEntry.status == 'PENDING'
    ).first()
    
    if wallet_entry:
        # Mantém PENDING, mas confirma que pagamento chegou
        # Job de settlement vai liberar em D+2
        wallet_entry.payment_confirmed = True
    
    # 5. Commit
    db.commit()
    
    # 6. Notifica em tempo real
    publish_websocket(
        channel=f"passenger:{ride.passenger_id}",
        event={"type": "PAYMENT_CONFIRMED"}
    )
    
    publish_websocket(
        channel=f"driver:{ride.driver_id}",
        event={"type": "PAYMENT_CONFIRMED"}
    )
    
    logger.info(f"Payment {external_txid} confirmed for ride {ride_id}")
```

---

### Schema da Constraint

```sql
CREATE TABLE payment_events (
    id UUID PRIMARY KEY,
    ride_id UUID REFERENCES rides(id),
    external_txid VARCHAR(255) NOT NULL,
    ...
    created_at TIMESTAMP NOT NULL,
    
    -- CONSTRAINT de unicidade (idempotência)
    CONSTRAINT uq_payment_events_external_txid 
        UNIQUE (external_txid)
);

-- Index para busca rápida
CREATE INDEX idx_payment_events_external_txid 
    ON payment_events(external_txid);
```

---

## 🛡️ ANTIFRAUDE BÁSICO

### Sinais de Fraude

#### **1. Passageiro**
```
- Múltiplos cancelamentos consecutivos (> 5 em 1h)
- Cartão recusado repetidamente (> 3x)
- Padrão de corridas suspeito (sempre mesma origem/destino)
- Avaliação muito baixa (< 3.0)
- Múltiplas contas com mesmo CPF/telefone
```

#### **2. Motorista**
```
- Taxa de cancelamento muito alta (> 50%)
- Aceita e cancela imediatamente (inflação de métricas)
- Padrão de corridas fictício (sempre mesma dupla motorista/passageiro)
- Localização fake (GPS spoofing)
- Múltiplas corridas simultâneas (impossível)
- Saldo negativo em cash persistente
```

---

### Implementação Básica

```python
class FraudDetector:
    """
    Sistema básico de detecção de fraude
    """
    
    def check_passenger_fraud(
        self,
        passenger_id: UUID,
        db: Session
    ) -> dict:
        """
        Analisa comportamento do passageiro
        """
        # Busca últimas 24h
        last_24h = datetime.utcnow() - timedelta(hours=24)
        
        rides = db.query(Ride).filter(
            Ride.passenger_id == passenger_id,
            Ride.created_at >= last_24h
        ).all()
        
        # Conta cancelamentos
        cancellations = sum(
            1 for r in rides 
            if r.status.startswith('CANCELLED_BY_PASSENGER')
        )
        
        # Sinal 1: Muitos cancelamentos
        if cancellations > 5:
            return {
                "fraud_score": 0.8,
                "reason": "MULTIPLE_CANCELLATIONS",
                "action": "BLOCK_NEW_RIDES"
            }
        
        # Sinal 2: Múltiplos pagamentos falhos
        failed_payments = db.query(PaymentEvent).filter(
            PaymentEvent.ride_id.in_([r.id for r in rides]),
            PaymentEvent.status == 'FAILED'
        ).count()
        
        if failed_payments > 3:
            return {
                "fraud_score": 0.9,
                "reason": "MULTIPLE_PAYMENT_FAILURES",
                "action": "REQUIRE_PREPAYMENT"
            }
        
        # Sem sinais de fraude
        return {
            "fraud_score": 0.0,
            "reason": None,
            "action": None
        }
    
    
    def check_driver_fraud(
        self,
        driver_id: UUID,
        db: Session
    ) -> dict:
        """
        Analisa comportamento do motorista
        """
        # Últimos 7 dias
        last_7d = datetime.utcnow() - timedelta(days=7)
        
        rides = db.query(Ride).filter(
            Ride.driver_id == driver_id,
            Ride.created_at >= last_7d
        ).all()
        
        if not rides:
            return {"fraud_score": 0.0}
        
        # Taxa de cancelamento
        cancelled = sum(
            1 for r in rides 
            if r.status.startswith('CANCELLED_BY_DRIVER')
        )
        cancel_rate = cancelled / len(rides)
        
        if cancel_rate > 0.5:
            return {
                "fraud_score": 0.7,
                "reason": "HIGH_CANCELLATION_RATE",
                "action": "SUSPEND_ACCOUNT"
            }
        
        # Padrão de corridas com mesmo passageiro
        passenger_counts = {}
        for ride in rides:
            pid = ride.passenger_id
            passenger_counts[pid] = passenger_counts.get(pid, 0) + 1
        
        # Se > 70% das corridas são com 1 passageiro
        max_passenger_rides = max(passenger_counts.values())
        if max_passenger_rides / len(rides) > 0.7:
            return {
                "fraud_score": 0.9,
                "reason": "SAME_PASSENGER_PATTERN",
                "action": "MANUAL_REVIEW"
            }
        
        return {"fraud_score": 0.0}
    
    
    def check_gps_spoofing(
        self,
        driver_id: UUID,
        current_lat: float,
        current_lng: float,
        db: Session
    ) -> bool:
        """
        Detecta GPS fake (spoofing)
        """
        # Última localização registrada
        last_location = db.query(LocationHistory).filter(
            LocationHistory.driver_id == driver_id
        ).order_by(
            LocationHistory.created_at.desc()
        ).first()
        
        if not last_location:
            return False
        
        # Calcula distância e tempo
        distance_km = calculate_distance(
            last_location.lat, last_location.lng,
            current_lat, current_lng
        )
        
        time_diff_seconds = (
            datetime.utcnow() - last_location.created_at
        ).total_seconds()
        
        # Velocidade necessária para percorrer
        if time_diff_seconds > 0:
            speed_kmh = (distance_km / time_diff_seconds) * 3600
            
            # Velocidade impossível (> 200 km/h)
            if speed_kmh > 200:
                logger.warning(
                    f"Possible GPS spoofing: driver {driver_id}, "
                    f"speed {speed_kmh} km/h"
                )
                return True
        
        return False
```

---

### Job de Análise Periódica

```python
def fraud_analysis_job():
    """
    Analisa fraudes periodicamente (1x por dia)
    """
    detector = FraudDetector()
    
    # Analisa todos os motoristas ativos
    drivers = db.query(Driver).filter(
        Driver.status.in_(['ONLINE', 'OFFLINE'])
    ).all()
    
    for driver in drivers:
        result = detector.check_driver_fraud(driver.user_id, db)
        
        if result["fraud_score"] > 0.7:
            # Cria alerta
            alert = FraudAlert(
                entity_type='DRIVER',
                entity_id=driver.user_id,
                fraud_score=result["fraud_score"],
                reason=result["reason"],
                action=result["action"],
                status='PENDING_REVIEW'
            )
            db.add(alert)
            
            # Toma ação automática se score muito alto
            if result["fraud_score"] > 0.9:
                driver.status = 'SUSPENDED'
                
                send_notification(
                    user_id=driver.user_id,
                    message="Sua conta foi suspensa para análise de segurança."
                )
    
    db.commit()
```

---

## 📊 OBSERVABILIDADE

### Pilares

1. **Logs:** O que aconteceu?
2. **Métricas:** Com que frequência?
3. **Traces:** Como fluiu pelo sistema?
4. **Alertas:** Quando algo está errado?

---

### 1. Logs Estruturados

```python
import structlog
import logging

# Configuração
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer()
    ],
    wrapper_class=structlog.stdlib.BoundLogger,
    logger_factory=structlog.stdlib.LoggerFactory(),
)

logger = structlog.get_logger()

# Uso
logger.info(
    "ride_accepted",
    ride_id=str(ride_id),
    driver_id=str(driver_id),
    passenger_id=str(passenger_id),
    price=float(price),
    distance_km=distance_km
)

# Output (JSON):
# {
#   "event": "ride_accepted",
#   "ride_id": "uuid",
#   "driver_id": "uuid",
#   "passenger_id": "uuid",
#   "price": 18.85,
#   "distance_km": 4.5,
#   "timestamp": "2025-12-16T18:30:45Z",
#   "level": "info"
# }
```

---

### 2. Métricas (Prometheus)

```python
from prometheus_client import Counter, Histogram, Gauge

# Contadores
rides_total = Counter(
    'rides_total',
    'Total de corridas',
    ['status', 'payment_method']
)

# Ao finalizar corrida
rides_total.labels(
    status='COMPLETED',
    payment_method='PIX'
).inc()

# Histogramas (latência)
ride_duration = Histogram(
    'ride_duration_minutes',
    'Duração da corrida em minutos'
)

# Ao finalizar
duration = (ride.ended_at - ride.started_at).total_seconds() / 60
ride_duration.observe(duration)

# Gauges (valor atual)
drivers_online = Gauge(
    'drivers_online',
    'Motoristas online agora'
)

# Atualiza periodicamente
def update_drivers_gauge():
    count = db.query(Driver).filter(
        Driver.status == 'ONLINE'
    ).count()
    drivers_online.set(count)
```

---

### 3. Traces (OpenTelemetry)

```python
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

# Setup
provider = TracerProvider()
processor = BatchSpanProcessor(OTLPSpanExporter())
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)

tracer = trace.get_tracer(__name__)

# Uso
@tracer.start_as_current_span("accept_ride")
def accept_ride(ride_id: UUID, driver_id: UUID):
    span = trace.get_current_span()
    span.set_attribute("ride.id", str(ride_id))
    span.set_attribute("driver.id", str(driver_id))
    
    # Lógica aqui
    ...
    
    span.set_attribute("ride.status", "ACCEPTED")
    span.set_status(trace.Status(trace.StatusCode.OK))
```

---

### 4. Alertas (AlertManager)

```yaml
# alerts.yml
groups:
  - name: ibora_critical
    interval: 30s
    rules:
      # Alta taxa de erro
      - alert: HighErrorRate
        expr: |
          rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Taxa de erro alta"
          description: "{{ $value }}% de erros nos últimos 5min"
      
      # Poucos motoristas online
      - alert: LowDriverAvailability
        expr: drivers_online < 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Poucos motoristas online"
          description: "Apenas {{ $value }} motoristas disponíveis"
      
      # Pagamentos falhando
      - alert: PaymentFailures
        expr: |
          rate(payment_events_total{status="FAILED"}[10m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Muitas falhas de pagamento"
          description: "{{ $value }} falhas/min"
```

---

### 5. Health Checks

```python
from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    """
    Health check completo
    """
    checks = {}
    
    # 1. Database
    try:
        db.execute("SELECT 1")
        checks["database"] = "ok"
    except Exception as e:
        checks["database"] = f"error: {e}"
    
    # 2. Redis
    try:
        redis.ping()
        checks["redis"] = "ok"
    except Exception as e:
        checks["redis"] = f"error: {e}"
    
    # 3. RabbitMQ
    try:
        rabbitmq.connection.process_data_events()
        checks["rabbitmq"] = "ok"
    except Exception as e:
        checks["rabbitmq"] = f"error: {e}"
    
    # 4. External APIs
    try:
        response = requests.get(
            "https://api.efi.com.br/health",
            timeout=2
        )
        checks["efi_bank"] = "ok" if response.ok else "degraded"
    except Exception as e:
        checks["efi_bank"] = f"error: {e}"
    
    # Status geral
    all_ok = all(v == "ok" for v in checks.values())
    status = 200 if all_ok else 503
    
    return {
        "status": "healthy" if all_ok else "unhealthy",
        "checks": checks,
        "timestamp": datetime.utcnow().isoformat()
    }, status
```

---

✅ **Etapa 7 concluída:** Backend completo estruturado com todos os componentes técnicos  
📍 **Próxima etapa:** [ETAPA 8 — Incentivos, Performance e Fidelidade do Motorista](#etapa-8--incentivos-performance-e-fidelidade-do-motorista)

---

# ETAPA 8 — INCENTIVOS, PERFORMANCE E FIDELIDADE DO MOTORISTA

## 🎯 OBJETIVO ESTRATÉGICO

O sistema de incentivos do iBora não é apenas um "extra". É um **pilar estratégico** que:

1. **Reduz churn** (motoristas não abandonam a plataforma)
2. **Aumenta qualidade** (aceite, finalização, avaliação)
3. **Gera diferenciação** (Uber/99 não oferecem benefícios reais)
4. **Cria economia local** (parcerias com postos, oficinas)
5. **Aumenta caixa** (motoristas engajados rodam mais)

---

## 🧭 PRINCÍPIOS DE PROJETO (REGRAS DE OURO)

### 1. **Incentivo ≠ Ganho Normal**
```
Ganho normal:
└─ Comissão variável por categoria (10-15%)

Incentivo:
└─ Benefício adicional por performance ou fidelidade
```

### 2. **Benefício ≠ Dinheiro**
```
Dinheiro direto:
└─ Precisa entrar no ledger
└─ Tem tributação
└─ Aumenta custo da plataforma

Benefício real:
└─ Desconto em combustível (parceiro paga)
└─ Manutenção subsidiada (convênio)
└─ Comissão reduzida (regra operacional)
```

### 3. **Toda Concessão é Auditável**
```
QUEM recebeu
O QUE recebeu
QUANDO recebeu
POR QUÊ recebeu (campanha, métrica)
VALIDADE (início, fim)
STATUS (ativo, expirado, consumido)
```

### 4. **Toda Campanha Tem Regras Claras**
```
Início: Data/hora
Fim: Data/hora
Elegibilidade: Condições precisas
Benefício: Tipo e valor exatos
Limites: Por motorista, por período
```

### 5. **Incentivos NUNCA Alteram Saldo Manualmente**
```
❌ ERRADO:
UPDATE driver_wallet SET balance = balance + 200

✅ CORRETO:
INSERT INTO financial_events (
    type='CREDIT',
    category='INCENTIVE_BONUS',
    amount=200
)
```

### 6. **Cálculo Sempre via Jobs Periódicos**
```
❌ ERRADO: Calcular em tempo real (cada corrida)
✅ CORRETO: Job diário/semanal/mensal
```

### 7. **Categorização Clara no Ledger**
```
financial_events.category:
├─ RIDE_EARNING (ganho normal)
├─ INCENTIVE_BONUS (bônus por meta)
├─ INCENTIVE_DISCOUNT (desconto operacional)
└─ INCENTIVE_CREDIT (crédito de uso)
```

---

## 📊 TIPOS DE INCENTIVOS DO IBORA

### A) Incentivos Financeiros Indiretos (Prioritários)

Não viram dinheiro direto. Afetam **regras operacionais**.

#### **A1. Comissão Reduzida**
```
Descrição: Motorista paga menos comissão por período
Exemplo: 13% → 10% por 30 dias
Impacto: Regra temporária no pricing
Benefício: Ganha mais por corrida sem bonus direto
```

**Implementação:**
```python
def calculate_commission(ride, driver):
    base_rate = driver.category.commission_rate  # 13%
    
    # Verifica incentivo ativo
    incentive = db.query(DriverIncentive).filter(
        DriverIncentive.driver_id == driver.id,
        DriverIncentive.type == 'COMMISSION_DISCOUNT',
        DriverIncentive.status == 'ACTIVE',
        DriverIncentive.valid_until >= datetime.utcnow()
    ).first()
    
    if incentive:
        # Aplica desconto (ex: -3%)
        discount = incentive.value  # 0.03
        final_rate = base_rate - discount  # 0.10
    else:
        final_rate = base_rate
    
    return ride.price * final_rate
```

**Financeiro:**
```
NÃO entra no ledger como evento separado
É apenas uma redução na comissão normal

Corrida R$ 20:
├─ Sem incentivo: Motorista ganha R$ 17.40 (13% comissão)
└─ Com incentivo: Motorista ganha R$ 18.00 (10% comissão)
```

---

#### **A2. Rodar sem Custo (Fee Waiver)**
```
Descrição: Isenção de taxas operacionais por período
Exemplo: Zero taxa de uso da plataforma por 7 dias
Impacto: Não cobra taxa fixa por corrida
Benefício: Margens maiores
```

**Quando usar:** Motorista novo (primeiros 7 dias), reengajamento

---

#### **A3. Cashback de Uso (DriverCredit)**
```
Descrição: Crédito para operar sem comissão
Exemplo: R$ 200 de crédito → 100% do valor por corrida
Impacto: Wallet de uso
Benefício: Ganha 100% enquanto tem crédito
```

**Mecânica:**
```
1. Motorista recebe R$ 200 de crédito
2. Cada corrida deduz comissão do crédito (não do ganho)
3. Enquanto tem crédito: ganha 100%
4. Acabou crédito: volta à comissão normal

Exemplo:
├─ Corrida R$ 20, comissão 13% = R$ 2.60
├─ Deduz R$ 2.60 do crédito
└─ Motorista recebe R$ 20.00 (não R$ 17.40)
```

---

### B) Incentivos Financeiros Diretos (Controlados)

Viram dinheiro, mas com **regras estritas**.

#### **B1. Bônus por Meta**
```
Descrição: Valor fixo ao atingir objetivo
Exemplo: R$ 200 ao completar 100 corridas no mês
Impacto: Entrada no ledger
Categoria: INCENTIVE_BONUS
D+N: Pode ter D+7 (evita fraude)
```

**Regras:**
```
✓ Tem validade (campanha)
✓ Pode expirar se não usado
✓ Pode ser revertido se fraude detectada
✓ Entra no ledger como categoria separada
✓ Tributável (se cair na conta)
```

**Implementação:**
```python
def grant_bonus(driver_id, campaign_id, amount):
    # 1. Cria incentivo
    incentive = DriverIncentive(
        driver_id=driver_id,
        campaign_id=campaign_id,
        type='BONUS',
        amount=amount,
        status='PENDING',
        granted_at=datetime.utcnow(),
        available_at=datetime.utcnow() + timedelta(days=7)  # D+7
    )
    db.add(incentive)
    
    # 2. Cria evento no ledger
    event = FinancialEvent(
        type='CREDIT',
        entity_type='DRIVER',
        entity_id=driver_id,
        amount=amount,
        category='INCENTIVE_BONUS',
        metadata={
            'campaign_id': str(campaign_id),
            'campaign_name': 'Top 100 Corridas'
        }
    )
    db.add(event)
    
    # 3. Adiciona na wallet (D+7)
    wallet_entry = DriverWalletEntry(
        driver_id=driver_id,
        amount=amount,
        type='BONUS',
        status='PENDING',
        available_at=datetime.utcnow() + timedelta(days=7)
    )
    db.add(wallet_entry)
    
    db.commit()
    
    # 4. Notifica
    send_notification(
        driver_id=driver_id,
        title="🎉 Bônus conquistado!",
        message=f"Você ganhou R$ {amount} por completar a meta. Disponível em 7 dias."
    )
```

---

#### **B2. Prêmio por Caixa**
```
Descrição: Percentual extra do faturamento
Exemplo: +2% sobre R$ 5.000 faturados = R$ 100 extra
Impacto: Incentiva volume
Categoria: INCENTIVE_PERFORMANCE
```

---

### C) Incentivos Não Financeiros (Fidelidade)

**NUNCA** viram dinheiro. São **benefícios reais**.

#### **C1. Desconto em Combustível**
```
Parceiro: Posto Shell, Ipiranga, etc
Benefício: 5-10% desconto na bomba
Mecânica:
├─ Motorista apresenta QR Code no posto
├─ Posto dá desconto
├─ Posto cobra iBora no fim do mês
└─ iBora paga subsídio ao posto
```

**Implementação:**
```python
class PartnerBenefit:
    def generate_voucher(self, driver_id, partner_id):
        # Gera QR Code único
        voucher = PartnerVoucher(
            code=generate_unique_code(),
            driver_id=driver_id,
            partner_id=partner_id,
            discount_percent=5.0,
            max_value=50.00,  # R$ 50 de desconto máximo
            valid_until=datetime.utcnow() + timedelta(days=30),
            status='ACTIVE'
        )
        db.add(voucher)
        db.commit()
        
        return voucher.code
    
    def redeem_voucher(self, code, transaction_value):
        voucher = db.query(PartnerVoucher).filter(
            PartnerVoucher.code == code,
            PartnerVoucher.status == 'ACTIVE',
            PartnerVoucher.valid_until >= datetime.utcnow()
        ).first()
        
        if not voucher:
            raise VoucherInvalid()
        
        # Calcula desconto
        discount = min(
            transaction_value * (voucher.discount_percent / 100),
            voucher.max_value
        )
        
        # Marca como usado
        voucher.status = 'REDEEMED'
        voucher.redeemed_at = datetime.utcnow()
        voucher.transaction_value = transaction_value
        voucher.discount_applied = discount
        
        db.commit()
        
        return discount
```

---

#### **C2. Manutenção Subsidiada**
```
Parceiro: Oficinas conveniadas
Benefício: Troca de óleo 50% off, revisão com desconto
Mecânica: Similar a combustível
```

---

#### **C3. Seguro Veicular com Desconto**
```
Parceiro: Seguradora
Benefício: 15% desconto no prêmio
Mecânica: iBora fecha acordo, motorista adere
```

---

## 📈 MÉTRICAS OFICIAIS DO IBORA

### Métricas Operacionais (Qualidade)

```python
class DriverMetrics:
    # Taxa de aceitação
    accept_rate: float  # accepted / offered
    
    # Taxa de finalização
    completion_rate: float  # completed / started
    
    # Taxa de cancelamento (motorista)
    cancel_rate_driver: float  # cancelled_by_driver / total
    
    # Tempo médio de resposta
    avg_response_time_seconds: float  # aceitar ou recusar
    
    # Quilometragem rodada
    total_km: float
    
    # Avaliação média
    avg_rating: float
```

---

### Métricas Financeiras (Caixa)

```python
class DriverFinancialMetrics:
    # Faturamento bruto
    gross_revenue: Decimal  # soma de price_final
    
    # Faturamento líquido
    net_revenue: Decimal  # gross - comissões
    
    # Corridas pagas
    rides_paid: int  # excluir cash não depositado
    
    # Mix de pagamento
    payment_mix: dict  # {PIX: 60%, CARD: 30%, CASH: 10%}
```

---

### Métricas de Engajamento

```python
class DriverEngagementMetrics:
    # Dias ativos
    active_days: int  # dias que ficou online
    
    # Corridas por período
    rides_per_period: int
    
    # Score de consistência
    consistency_score: float  # 0-1, baseado em regularidade
    
    # Horas online
    hours_online: float
```

---

## 🔢 AGREGAÇÃO DE MÉTRICAS (JOBS)

### Tabela: `driver_metrics`

```sql
CREATE TABLE driver_metrics (
    id UUID PRIMARY KEY,
    driver_id UUID NOT NULL REFERENCES drivers(user_id),
    
    -- Período
    period_type VARCHAR(20) NOT NULL, -- DAILY | WEEKLY | MONTHLY
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Métricas operacionais
    rides_offered INTEGER DEFAULT 0,
    rides_accepted INTEGER DEFAULT 0,
    rides_started INTEGER DEFAULT 0,
    rides_completed INTEGER DEFAULT 0,
    rides_cancelled_by_driver INTEGER DEFAULT 0,
    
    accept_rate DECIMAL(5,4),  -- accepted / offered
    completion_rate DECIMAL(5,4),  -- completed / started
    cancel_rate DECIMAL(5,4),  -- cancelled / started
    avg_response_time_seconds DECIMAL(8,2),
    
    total_km DECIMAL(10,2),
    avg_rating DECIMAL(3,2),
    
    -- Métricas financeiras
    gross_revenue DECIMAL(10,2),
    net_revenue DECIMAL(10,2),
    commission_paid DECIMAL(10,2),
    
    rides_paid INTEGER,
    rides_cash INTEGER,
    
    -- Métricas de engajamento
    active_days INTEGER,
    hours_online DECIMAL(8,2),
    consistency_score DECIMAL(3,2),
    
    created_at TIMESTAMP NOT NULL,
    
    UNIQUE(driver_id, period_type, period_start)
);

CREATE INDEX idx_driver_metrics_driver ON driver_metrics(driver_id);
CREATE INDEX idx_driver_metrics_period ON driver_metrics(period_type, period_start);
```

---

### Job Diário: Calcula Métricas

```python
def calculate_daily_metrics():
    """
    Roda todo dia às 00:05 (após virada do dia)
    Calcula métricas do dia anterior
    """
    yesterday = datetime.utcnow().date() - timedelta(days=1)
    
    # Para cada motorista ativo
    drivers = db.query(Driver).filter(
        Driver.status.in_(['ONLINE', 'OFFLINE'])
    ).all()
    
    for driver in drivers:
        # Query corridas do dia
        rides = db.query(Ride).filter(
            Ride.driver_id == driver.user_id,
            func.date(Ride.created_at) == yesterday
        ).all()
        
        if not rides:
            continue  # Motorista não rodou
        
        # Calcula métricas
        metrics = DriverMetrics(
            driver_id=driver.user_id,
            period_type='DAILY',
            period_start=yesterday,
            period_end=yesterday,
            
            # Operacionais
            rides_offered=count_offered(driver.user_id, yesterday),
            rides_accepted=sum(1 for r in rides if r.status != 'SEARCHING'),
            rides_started=sum(1 for r in rides if r.started_at is not None),
            rides_completed=sum(1 for r in rides if r.status == 'COMPLETED'),
            rides_cancelled_by_driver=sum(
                1 for r in rides 
                if r.status == 'CANCELLED_BY_DRIVER'
            ),
            
            # Taxas
            accept_rate=calculate_accept_rate(driver.user_id, yesterday),
            completion_rate=calculate_completion_rate(rides),
            cancel_rate=calculate_cancel_rate(rides),
            
            # Financeiras
            gross_revenue=sum(
                r.price_final for r in rides 
                if r.status == 'COMPLETED'
            ),
            net_revenue=sum(
                r.price_final - r.commission for r in rides 
                if r.status == 'COMPLETED'
            ),
            commission_paid=sum(
                r.commission for r in rides 
                if r.status == 'COMPLETED'
            ),
            
            # KM
            total_km=sum(r.distance_km or 0 for r in rides),
            
            created_at=datetime.utcnow()
        )
        
        db.add(metrics)
    
    db.commit()
    logger.info(f"Daily metrics calculated for {len(drivers)} drivers")


def calculate_accept_rate(driver_id, date):
    """
    Taxa de aceitação = aceitas / oferecidas
    """
    # Conta quantas corridas foram oferecidas
    offered = db.query(RideOffer).filter(
        RideOffer.driver_id == driver_id,
        func.date(RideOffer.created_at) == date
    ).count()
    
    if offered == 0:
        return None
    
    # Conta quantas foram aceitas
    accepted = db.query(RideOffer).filter(
        RideOffer.driver_id == driver_id,
        func.date(RideOffer.created_at) == date,
        RideOffer.accepted == True
    ).count()
    
    return accepted / offered


def calculate_completion_rate(rides):
    """
    Taxa de finalização = completadas / iniciadas
    """
    started = sum(1 for r in rides if r.started_at is not None)
    
    if started == 0:
        return None
    
    completed = sum(1 for r in rides if r.status == 'COMPLETED')
    
    return completed / started
```

---

### Job Semanal e Mensal

```python
def calculate_weekly_metrics():
    """
    Roda toda segunda às 01:00
    Agrega métricas da semana anterior
    """
    last_week_start = (datetime.utcnow() - timedelta(days=7)).date()
    last_week_end = last_week_start + timedelta(days=6)
    
    # Similar ao diário, mas agrega 7 dias
    ...


def calculate_monthly_metrics():
    """
    Roda dia 1 de cada mês às 02:00
    Agrega métricas do mês anterior
    """
    # Similar, mas agrega 30 dias
    ...
```

---

## 🎯 CAMPANHAS OFICIAIS DO IBORA

### Campanha 1: Motorista Ouro (Qualidade)

```yaml
Nome: Motorista Ouro
Objetivo: Premiar qualidade operacional
Tipo: COMMISSION_DISCOUNT
Duração: 30 dias (renovável)

Regras de elegibilidade:
  - accept_rate >= 0.90 (90%)
  - completion_rate >= 0.95 (95%)
  - cancel_rate_driver <= 0.05 (5%)
  - total_rides >= 50 (no período)
  - avg_rating >= 4.5

Benefício:
  - Comissão reduzida: -3% (ex: 13% → 10%)
  
Mecânica:
  - Avaliado mensalmente
  - Se mantém métricas: renova automático
  - Se não mantém: perde no mês seguinte
```

**Implementação:**
```python
def evaluate_gold_driver_campaign():
    """
    Roda mensalmente (dia 1 de cada mês)
    """
    last_month_start = (datetime.utcnow().replace(day=1) - timedelta(days=1)).replace(day=1)
    last_month_end = datetime.utcnow().replace(day=1) - timedelta(days=1)
    
    # Busca métricas do mês anterior
    metrics_list = db.query(DriverMetrics).filter(
        DriverMetrics.period_type == 'MONTHLY',
        DriverMetrics.period_start == last_month_start
    ).all()
    
    for metrics in metrics_list:
        # Verifica elegibilidade
        eligible = (
            metrics.accept_rate >= 0.90 and
            metrics.completion_rate >= 0.95 and
            metrics.cancel_rate <= 0.05 and
            metrics.rides_completed >= 50 and
            metrics.avg_rating >= 4.5
        )
        
        if eligible:
            # Concede incentivo
            grant_commission_discount(
                driver_id=metrics.driver_id,
                campaign='GOLD_DRIVER',
                discount=0.03,  # -3%
                valid_days=30
            )
            
            logger.info(f"Driver {metrics.driver_id} granted Gold status")
        else:
            # Remove incentivo se tinha
            revoke_commission_discount(
                driver_id=metrics.driver_id,
                campaign='GOLD_DRIVER'
            )


def grant_commission_discount(driver_id, campaign, discount, valid_days):
    # Busca incentivo existente
    existing = db.query(DriverIncentive).filter(
        DriverIncentive.driver_id == driver_id,
        DriverIncentive.campaign_name == campaign,
        DriverIncentive.status == 'ACTIVE'
    ).first()
    
    if existing:
        # Renova validade
        existing.valid_until = datetime.utcnow() + timedelta(days=valid_days)
        existing.renewed_at = datetime.utcnow()
    else:
        # Cria novo
        incentive = DriverIncentive(
            driver_id=driver_id,
            campaign_name=campaign,
            type='COMMISSION_DISCOUNT',
            value=discount,
            status='ACTIVE',
            valid_from=datetime.utcnow(),
            valid_until=datetime.utcnow() + timedelta(days=valid_days)
        )
        db.add(incentive)
    
    db.commit()
    
    # Notifica
    send_notification(
        driver_id=driver_id,
        title="🏆 Você é Motorista Ouro!",
        message=f"Parabéns! Comissão reduzida para {(driver.commission_rate - discount)*100}% por {valid_days} dias."
    )
```

---

### Campanha 2: Top Caixa (Volume)

```yaml
Nome: Top Caixa do Mês
Objetivo: Incentivar faturamento alto
Tipo: BONUS
Duração: Mensal

Regras de elegibilidade:
  - gross_revenue >= R$ 8.000 no mês
  - total_rides >= 100 (garantir não é só corrida cara)
  - avg_rating >= 4.3 (mínimo de qualidade)

Benefício:
  - Bônus fixo: R$ 300
  - Entrada no ledger: INCENTIVE_BONUS
  - D+N: D+7 (prevenir fraude)

Limites:
  - 1x por motorista por mês
  - Máximo 50 motoristas/mês (orçamento)
```

**Implementação:**
```python
def evaluate_top_revenue_campaign():
    """
    Roda dia 1 de cada mês
    """
    last_month_start = (datetime.utcnow().replace(day=1) - timedelta(days=1)).replace(day=1)
    
    # Busca top motoristas por faturamento
    top_drivers = db.query(DriverMetrics).filter(
        DriverMetrics.period_type == 'MONTHLY',
        DriverMetrics.period_start == last_month_start,
        DriverMetrics.gross_revenue >= 8000,
        DriverMetrics.rides_completed >= 100,
        DriverMetrics.avg_rating >= 4.3
    ).order_by(
        DriverMetrics.gross_revenue.desc()
    ).limit(50).all()  # Top 50
    
    for metrics in top_drivers:
        # Concede bônus
        grant_bonus(
            driver_id=metrics.driver_id,
            campaign='TOP_REVENUE',
            amount=Decimal('300.00'),
            d_plus_n=7
        )
        
        logger.info(
            f"Driver {metrics.driver_id} granted R$ 300 bonus "
            f"(revenue: {metrics.gross_revenue})"
        )
```

---

### Campanha 3: Alta Quilometragem (Disponibilidade)

```yaml
Nome: Rodador Premium
Objetivo: Premiar disponibilidade
Tipo: CREDIT (crédito de uso) ou PARTNER_BENEFIT (combustível)

Regras:
  - total_km >= 2000 km no mês
  - active_days >= 20
  - avg_rating >= 4.0

Benefício (escolha):
  A) R$ 150 em crédito de uso
  B) Voucher R$ 150 em combustível (posto parceiro)
```

---

### Campanha 4: Reengajamento (Inativo)

```yaml
Nome: Volte a Rodar
Objetivo: Reativar motorista inativo
Tipo: COMBO (desconto + crédito)

Regras:
  - Motorista inativo > 30 dias
  - Rating histórico >= 4.0
  - Sem pendências financeiras

Benefício:
  - 7 dias com comissão 5% (vs 13%)
  - R$ 50 de crédito de uso
  - Suporte prioritário

Duração: 7 dias
```

---

## 📊 MODELO DE DADOS (NOVO)

### Tabela: `incentive_campaigns`

```sql
CREATE TABLE incentive_campaigns (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- COMMISSION_DISCOUNT | BONUS | CREDIT | PARTNER_BENEFIT
    status VARCHAR(20) NOT NULL, -- ACTIVE | PAUSED | ENDED
    
    -- Período
    start_at TIMESTAMP NOT NULL,
    end_at TIMESTAMP,
    
    -- Regras (JSON flexível)
    eligibility_rules JSONB NOT NULL,
    /*
    {
      "accept_rate_min": 0.90,
      "completion_rate_min": 0.95,
      "total_rides_min": 50,
      "avg_rating_min": 4.5
    }
    */
    
    -- Benefício
    benefit_config JSONB NOT NULL,
    /*
    {
      "type": "COMMISSION_DISCOUNT",
      "value": 0.03,
      "duration_days": 30
    }
    */
    
    -- Limites
    max_drivers_per_period INTEGER,
    budget_limit DECIMAL(10,2),
    
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_campaigns_status ON incentive_campaigns(status);
CREATE INDEX idx_campaigns_dates ON incentive_campaigns(start_at, end_at);
```

---

### Tabela: `driver_incentives`

```sql
CREATE TABLE driver_incentives (
    id UUID PRIMARY KEY,
    driver_id UUID NOT NULL REFERENCES drivers(user_id),
    campaign_id UUID REFERENCES incentive_campaigns(id),
    campaign_name VARCHAR(100),  -- Para histórico
    
    -- Tipo e valor
    type VARCHAR(50) NOT NULL,
    value DECIMAL(10,2),  -- Valor do desconto/bônus
    
    -- Status
    status VARCHAR(20) NOT NULL, -- PENDING | ACTIVE | EXPIRED | CONSUMED | REVOKED
    
    -- Validade
    valid_from TIMESTAMP,
    valid_until TIMESTAMP,
    
    -- Rastreamento
    granted_at TIMESTAMP NOT NULL,
    activated_at TIMESTAMP,
    consumed_at TIMESTAMP,
    revoked_at TIMESTAMP,
    revoke_reason TEXT,
    
    -- Contadores
    times_used INTEGER DEFAULT 0,
    max_uses INTEGER,  -- NULL = ilimitado
    
    created_at TIMESTAMP NOT NULL,
    
    CONSTRAINT chk_valid_dates CHECK (valid_until > valid_from)
);

CREATE INDEX idx_driver_incentives_driver ON driver_incentives(driver_id);
CREATE INDEX idx_driver_incentives_campaign ON driver_incentives(campaign_id);
CREATE INDEX idx_driver_incentives_status ON driver_incentives(status);
CREATE INDEX idx_driver_incentives_active ON driver_incentives(driver_id, status, valid_until);
```

---

### Tabela: `partner_benefits`

```sql
CREATE TABLE partner_benefits (
    id UUID PRIMARY KEY,
    partner_id UUID NOT NULL REFERENCES partners(id),
    
    -- Informações do parceiro
    partner_name VARCHAR(100) NOT NULL,
    partner_category VARCHAR(50), -- FUEL | MAINTENANCE | INSURANCE | FOOD
    
    -- Benefício
    benefit_type VARCHAR(50), -- DISCOUNT | CASHBACK | FREE_SERVICE
    discount_percent DECIMAL(5,2),
    max_value DECIMAL(10,2),
    
    -- Status
    status VARCHAR(20),
    
    -- Validade
    valid_from TIMESTAMP,
    valid_until TIMESTAMP,
    
    created_at TIMESTAMP
);
```

---

### Tabela: `driver_partner_benefits`

```sql
CREATE TABLE driver_partner_benefits (
    id UUID PRIMARY KEY,
    driver_id UUID NOT NULL,
    partner_benefit_id UUID NOT NULL REFERENCES partner_benefits(id),
    
    -- Tier (motorista pode ter níveis)
    tier VARCHAR(20), -- BRONZE | SILVER | GOLD
    
    -- Validade
    valid_until TIMESTAMP,
    
    -- Uso
    times_used INTEGER DEFAULT 0,
    total_value_saved DECIMAL(10,2) DEFAULT 0,
    
    created_at TIMESTAMP,
    
    UNIQUE(driver_id, partner_benefit_id)
);
```

---

### Tabela: `partner_vouchers` (para rastreamento)

```sql
CREATE TABLE partner_vouchers (
    id UUID PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,  -- QR Code
    
    driver_id UUID NOT NULL,
    partner_benefit_id UUID NOT NULL,
    
    -- Configuração
    discount_percent DECIMAL(5,2),
    max_value DECIMAL(10,2),
    
    -- Status
    status VARCHAR(20), -- ACTIVE | REDEEMED | EXPIRED | CANCELLED
    
    -- Uso
    redeemed_at TIMESTAMP,
    transaction_value DECIMAL(10,2),
    discount_applied DECIMAL(10,2),
    
    -- Validade
    valid_until TIMESTAMP,
    
    created_at TIMESTAMP
);

CREATE UNIQUE INDEX idx_vouchers_code ON partner_vouchers(code);
CREATE INDEX idx_vouchers_driver ON partner_vouchers(driver_id);
CREATE INDEX idx_vouchers_status ON partner_vouchers(status);
```

---

## 🔄 FLUXO DE CONCESSÃO (AUDITORIA COMPLETA)

### Passo a Passo

```
1. Job calcula métricas (diário/semanal/mensal)
   └─ Insere em driver_metrics

2. Job avalia campanhas
   └─ Para cada campanha ativa:
       ├─ Query motoristas elegíveis
       ├─ Valida regras (JSON)
       └─ Se elegível: concede incentivo

3. Cria driver_incentive
   └─ status: PENDING ou ACTIVE
   └─ valid_from, valid_until

4. Aplica benefício:
   ├─ Se COMMISSION_DISCOUNT: ativa regra
   ├─ Se BONUS: cria financial_event + wallet_entry
   ├─ Se CREDIT: adiciona em driver_credits
   └─ Se PARTNER_BENEFIT: gera voucher

5. Emite evento realtime
   └─ WebSocket: driver.incentive.granted

6. Registra auditoria
   └─ Tabela: incentive_audit_log
```

---

### Código Completo

```python
def grant_incentive(driver_id: UUID, campaign: IncentiveCampaign):
    """
    Concede incentivo para motorista
    """
    # 1. Valida se já tem
    existing = db.query(DriverIncentive).filter(
        DriverIncentive.driver_id == driver_id,
        DriverIncentive.campaign_id == campaign.id,
        DriverIncentive.status.in_(['ACTIVE', 'PENDING'])
    ).first()
    
    if existing:
        logger.warning(f"Driver {driver_id} already has incentive from campaign {campaign.id}")
        return
    
    # 2. Cria registro
    incentive = DriverIncentive(
        driver_id=driver_id,
        campaign_id=campaign.id,
        campaign_name=campaign.name,
        type=campaign.type,
        value=campaign.benefit_config.get('value'),
        status='ACTIVE',
        valid_from=datetime.utcnow(),
        valid_until=datetime.utcnow() + timedelta(
            days=campaign.benefit_config.get('duration_days', 30)
        ),
        granted_at=datetime.utcnow()
    )
    db.add(incentive)
    
    # 3. Aplica benefício conforme tipo
    if campaign.type == 'COMMISSION_DISCOUNT':
        # Apenas registra, lógica de pricing usa query
        pass
    
    elif campaign.type == 'BONUS':
        # Cria evento financeiro
        amount = campaign.benefit_config.get('amount')
        d_plus_n = campaign.benefit_config.get('d_plus_n', 7)
        
        event = FinancialEvent(
            type='CREDIT',
            entity_type='DRIVER',
            entity_id=driver_id,
            amount=amount,
            category='INCENTIVE_BONUS',
            metadata={
                'campaign_id': str(campaign.id),
                'campaign_name': campaign.name
            }
        )
        db.add(event)
        
        # Adiciona na wallet
        wallet_entry = DriverWalletEntry(
            driver_id=driver_id,
            amount=amount,
            type='BONUS',
            status='PENDING',
            available_at=datetime.utcnow() + timedelta(days=d_plus_n)
        )
        db.add(wallet_entry)
    
    elif campaign.type == 'CREDIT':
        # Adiciona crédito de uso
        credit = DriverCredit(
            driver_id=driver_id,
            amount=campaign.benefit_config.get('amount'),
            type='INCENTIVE',
            status='ACTIVE',
            expires_at=datetime.utcnow() + timedelta(days=90)
        )
        db.add(credit)
    
    elif campaign.type == 'PARTNER_BENEFIT':
        # Gera voucher
        partner_id = campaign.benefit_config.get('partner_id')
        voucher = generate_partner_voucher(
            driver_id=driver_id,
            partner_id=partner_id,
            discount_percent=campaign.benefit_config.get('discount_percent'),
            valid_days=campaign.benefit_config.get('valid_days', 30)
        )
    
    # 4. Commit
    db.commit()
    
    # 5. Notifica motorista
    send_incentive_notification(driver_id, incentive)
    
    # 6. Evento realtime
    publish_websocket(
        channel=f"driver:{driver_id}",
        event={
            "type": "INCENTIVE_GRANTED",
            "incentive": serialize_incentive(incentive)
        }
    )
    
    logger.info(
        f"Incentive granted: driver={driver_id}, "
        f"campaign={campaign.name}, type={campaign.type}"
    )
```

---

## 💰 INTEGRAÇÃO COM FINANCEIRO (SEGURO)

### Regra: Tudo Passa pelo Ledger

```python
# ❌ NUNCA FAZER ISSO
UPDATE driver_wallet SET balance = balance + 200

# ✅ SEMPRE FAZER ASSIM
INSERT INTO financial_events (
    type='CREDIT',
    entity_type='DRIVER',
    entity_id=driver_id,
    amount=200,
    category='INCENTIVE_BONUS'
)
```

---

### Bônus Financeiro → Ledger

```python
def grant_financial_bonus(driver_id, amount, campaign_name):
    """
    Concede bônus que vira dinheiro
    """
    # 1. Ledger event
    event = FinancialEvent(
        type='CREDIT',
        entity_type='DRIVER',
        entity_id=driver_id,
        amount=amount,
        category='INCENTIVE_BONUS',
        description=f'Bônus: {campaign_name}',
        created_at=datetime.utcnow()
    )
    db.add(event)
    
    # 2. Wallet entry (D+7 para prevenir fraude)
    wallet_entry = DriverWalletEntry(
        driver_id=driver_id,
        amount=amount,
        type='BONUS',
        status='PENDING',
        available_at=datetime.utcnow() + timedelta(days=7)
    )
    db.add(wallet_entry)
    
    db.commit()
```

---

### Desconto de Comissão → Pricing

```python
def calculate_commission_with_incentive(ride, driver):
    """
    Calcula comissão considerando descontos ativos
    """
    base_commission_rate = driver.commission_rate  # 0.13
    
    # Query desconto ativo
    discount_incentive = db.query(DriverIncentive).filter(
        DriverIncentive.driver_id == driver.user_id,
        DriverIncentive.type == 'COMMISSION_DISCOUNT',
        DriverIncentive.status == 'ACTIVE',
        DriverIncentive.valid_from <= datetime.utcnow(),
        DriverIncentive.valid_until >= datetime.utcnow()
    ).first()
    
    if discount_incentive:
        discount = discount_incentive.value  # 0.03
        final_rate = base_commission_rate - discount  # 0.10
        
        # Registra uso
        discount_incentive.times_used += 1
        db.commit()
    else:
        final_rate = base_commission_rate
    
    commission = ride.price_final * final_rate
    
    return commission, final_rate
```

---

## 🛡️ ANTIFRAUDE (ESPECÍFICO PARA INCENTIVOS)

### Vetores de Fraude

#### 1. Gaming de Métricas
```
Fraude: Aceita e cancela para inflar taxa de aceite
Detecção:
├─ cancel_rate_driver alto após aceites rápidos
├─ Padrão: aceita em < 2s, cancela em < 10s
└─ Sempre cancela antes de chegar no passageiro

Ação:
└─ Desqualifica de campanhas
└─ Revoga incentivos ativos
```

#### 2. Corridas Fictícias
```
Fraude: Conluio motorista + passageiro fake
Detecção:
├─ Sempre mesma dupla (> 70% das corridas)
├─ Padrão geográfico (sempre mesma origem/destino)
└─ Duração/distância inconsistente

Ação:
└─ Suspensão de ambos
└─ Reversão de bônus
```

#### 3. Múltiplas Contas
```
Fraude: Motorista cria várias contas
Detecção:
├─ Mesmo CPF/veículo/telefone
├─ Mesmo padrão de localização
└─ IP/device fingerprint similar

Ação:
└─ Bloqueia todas as contas
```

---

### Implementação

```python
class IncentiveFraudDetector:
    def check_gaming_pattern(self, driver_id: UUID) -> dict:
        """
        Detecta gaming de métricas
        """
        # Últimas 24h
        last_24h = datetime.utcnow() - timedelta(hours=24)
        
        rides = db.query(Ride).filter(
            Ride.driver_id == driver_id,
            Ride.accepted_at >= last_24h
        ).all()
        
        if len(rides) < 10:
            return {"fraud_score": 0.0}
        
        # Padrão suspeito
        quick_accepts = sum(
            1 for r in rides
            if r.accepted_at and 
               (r.accepted_at - r.requested_at).total_seconds() < 2
        )
        
        quick_cancels = sum(
            1 for r in rides
            if r.status == 'CANCELLED_BY_DRIVER' and
               r.accepted_at and
               r.cancelled_at and
               (r.cancelled_at - r.accepted_at).total_seconds() < 10
        )
        
        if quick_accepts > 5 and quick_cancels > 5:
            return {
                "fraud_score": 0.9,
                "reason": "GAMING_METRICS",
                "action": "REVOKE_INCENTIVES"
            }
        
        return {"fraud_score": 0.0}
    
    
    def check_fake_rides_pattern(self, driver_id: UUID) -> dict:
        """
        Detecta corridas fictícias
        """
        # Últimos 30 dias
        last_30d = datetime.utcnow() - timedelta(days=30)
        
        rides = db.query(Ride).filter(
            Ride.driver_id == driver_id,
            Ride.created_at >= last_30d,
            Ride.status == 'COMPLETED'
        ).all()
        
        if len(rides) < 20:
            return {"fraud_score": 0.0}
        
        # Conta passageiros
        passenger_counts = {}
        for ride in rides:
            pid = ride.passenger_id
            passenger_counts[pid] = passenger_counts.get(pid, 0) + 1
        
        # Se > 70% com 1 passageiro
        max_rides_same_passenger = max(passenger_counts.values())
        if max_rides_same_passenger / len(rides) > 0.7:
            return {
                "fraud_score": 0.95,
                "reason": "FAKE_RIDES_PATTERN",
                "action": "SUSPEND_AND_INVESTIGATE"
            }
        
        return {"fraud_score": 0.0}
    
    
    def revoke_incentive(self, incentive_id: UUID, reason: str):
        """
        Revoga incentivo por fraude
        """
        incentive = db.query(DriverIncentive).filter(
            DriverIncentive.id == incentive_id
        ).first()
        
        if not incentive:
            return
        
        # Marca como revogado
        incentive.status = 'REVOKED'
        incentive.revoked_at = datetime.utcnow()
        incentive.revoke_reason = reason
        
        # Se era bônus financeiro, reverte
        if incentive.type == 'BONUS':
            revert_bonus(incentive.driver_id, incentive.value)
        
        db.commit()
        
        # Notifica
        send_notification(
            driver_id=incentive.driver_id,
            title="Incentivo Revogado",
            message=f"Seu incentivo foi revogado devido a: {reason}"
        )
```

---

## 🔌 APIs NECESSÁRIAS

### Para Motorista

```python
@router.get("/drivers/me/metrics")
async def get_my_metrics(
    period: str = Query('weekly', enum=['daily', 'weekly', 'monthly']),
    driver: Driver = Depends(get_current_driver)
):
    """
    Retorna métricas do motorista
    """
    # Calcula datas do período
    if period == 'weekly':
        start = datetime.utcnow() - timedelta(days=7)
    elif period == 'monthly':
        start = datetime.utcnow() - timedelta(days=30)
    else:
        start = datetime.utcnow() - timedelta(days=1)
    
    metrics = db.query(DriverMetrics).filter(
        DriverMetrics.driver_id == driver.user_id,
        DriverMetrics.period_type == period.upper(),
        DriverMetrics.period_start >= start.date()
    ).first()
    
    return {
        "period": period,
        "accept_rate": float(metrics.accept_rate or 0),
        "completion_rate": float(metrics.completion_rate or 0),
        "cancel_rate": float(metrics.cancel_rate or 0),
        "total_rides": metrics.rides_completed,
        "total_km": float(metrics.total_km or 0),
        "gross_revenue": float(metrics.gross_revenue or 0),
        "net_revenue": float(metrics.net_revenue or 0),
        "avg_rating": float(metrics.avg_rating or 0)
    }


@router.get("/drivers/me/incentives")
async def get_my_incentives(
    driver: Driver = Depends(get_current_driver)
):
    """
    Lista incentivos ativos do motorista
    """
    incentives = db.query(DriverIncentive).filter(
        DriverIncentive.driver_id == driver.user_id,
        DriverIncentive.status == 'ACTIVE',
        DriverIncentive.valid_until >= datetime.utcnow()
    ).all()
    
    return {
        "active_incentives": [
            {
                "id": str(i.id),
                "campaign_name": i.campaign_name,
                "type": i.type,
                "value": float(i.value) if i.value else None,
                "valid_until": i.valid_until.isoformat(),
                "description": get_incentive_description(i)
            }
            for i in incentives
        ]
    }


@router.get("/drivers/me/benefits")
async def get_my_benefits(
    driver: Driver = Depends(get_current_driver)
):
    """
    Lista benefícios de parceiros disponíveis
    """
    benefits = db.query(DriverPartnerBenefit).filter(
        DriverPartnerBenefit.driver_id == driver.user_id,
        DriverPartnerBenefit.valid_until >= datetime.utcnow()
    ).all()
    
    return {
        "partner_benefits": [
            {
                "partner_name": b.partner_benefit.partner_name,
                "category": b.partner_benefit.partner_category,
                "discount": float(b.partner_benefit.discount_percent),
                "times_used": b.times_used,
                "total_saved": float(b.total_value_saved)
            }
            for b in benefits
        ]
    }
```

---

### Para Campanhas (Admin)

```python
@router.get("/campaigns/active")
async def get_active_campaigns():
    """
    Lista campanhas ativas
    """
    campaigns = db.query(IncentiveCampaign).filter(
        IncentiveCampaign.status == 'ACTIVE',
        IncentiveCampaign.start_at <= datetime.utcnow(),
        or_(
            IncentiveCampaign.end_at.is_(None),
            IncentiveCampaign.end_at >= datetime.utcnow()
        )
    ).all()
    
    return {
        "campaigns": [serialize_campaign(c) for c in campaigns]
    }


@router.post("/campaigns")
async def create_campaign(
    campaign_data: CampaignCreate,
    admin: User = Depends(require_admin)
):
    """
    Cria nova campanha de incentivos
    """
    campaign = IncentiveCampaign(
        name=campaign_data.name,
        description=campaign_data.description,
        type=campaign_data.type,
        status='ACTIVE',
        start_at=campaign_data.start_at,
        end_at=campaign_data.end_at,
        eligibility_rules=campaign_data.eligibility_rules,
        benefit_config=campaign_data.benefit_config,
        created_by=admin.id
    )
    
    db.add(campaign)
    db.commit()
    
    return {"id": str(campaign.id)}


@router.get("/campaigns/{campaign_id}/eligible-drivers")
async def get_eligible_drivers(
    campaign_id: UUID,
    admin: User = Depends(require_admin)
):
    """
    Simula quais motoristas seriam elegíveis
    """
    campaign = db.query(IncentiveCampaign).filter(
        IncentiveCampaign.id == campaign_id
    ).first()
    
    if not campaign:
        raise HTTPException(404)
    
    # Avalia elegibilidade
    eligible = evaluate_campaign_eligibility(campaign)
    
    return {
        "campaign_name": campaign.name,
        "total_eligible": len(eligible),
        "drivers": [
            {
                "driver_id": str(d.driver_id),
                "metrics": d.metrics
            }
            for d in eligible[:100]  # Limita a 100 na resposta
        ]
    }
```

---

## ✅ TESTES OBRIGATÓRIOS

### 1. Teste de Elegibilidade

```python
def test_gold_driver_eligibility():
    """
    Testa se motorista é elegível para Motorista Ouro
    """
    # Setup: Cria motorista com métricas
    driver = create_test_driver()
    metrics = DriverMetrics(
        driver_id=driver.id,
        period_type='MONTHLY',
        accept_rate=0.92,
        completion_rate=0.96,
        cancel_rate=0.03,
        rides_completed=55,
        avg_rating=4.7
    )
    db.add(metrics)
    db.commit()
    
    # Executa
    evaluate_gold_driver_campaign()
    
    # Valida
    incentive = db.query(DriverIncentive).filter(
        DriverIncentive.driver_id == driver.id,
        DriverIncentive.campaign_name == 'GOLD_DRIVER'
    ).first()
    
    assert incentive is not None
    assert incentive.status == 'ACTIVE'
    assert incentive.type == 'COMMISSION_DISCOUNT'
    assert incentive.value == Decimal('0.03')


def test_not_eligible():
    """
    Testa motorista NÃO elegível
    """
    driver = create_test_driver()
    metrics = DriverMetrics(
        driver_id=driver.id,
        accept_rate=0.70,  # Baixo
        completion_rate=0.96,
        rides_completed=55
    )
    db.add(metrics)
    db.commit()
    
    evaluate_gold_driver_campaign()
    
    # Não deve receber
    incentive = db.query(DriverIncentive).filter(
        DriverIncentive.driver_id == driver.id
    ).first()
    
    assert incentive is None
```

---

### 2. Teste de Não Duplicação

```python
def test_no_duplicate_incentive():
    """
    Garante que motorista não recebe incentivo duplicado
    """
    driver = create_eligible_driver()
    
    # Primeira concessão
    grant_incentive(driver.id, campaign)
    
    # Segunda concessão (deve ignorar)
    grant_incentive(driver.id, campaign)
    
    # Valida: apenas 1 registro
    count = db.query(DriverIncentive).filter(
        DriverIncentive.driver_id == driver.id,
        DriverIncentive.campaign_id == campaign.id
    ).count()
    
    assert count == 1
```

---

### 3. Teste de Expiração

```python
def test_incentive_expiration():
    """
    Testa que incentivo expira corretamente
    """
    driver = create_test_driver()
    
    # Cria incentivo que expira em 1 segundo
    incentive = DriverIncentive(
        driver_id=driver.id,
        type='COMMISSION_DISCOUNT',
        status='ACTIVE',
        valid_until=datetime.utcnow() + timedelta(seconds=1)
    )
    db.add(incentive)
    db.commit()
    
    # Aguarda 2 segundos
    time.sleep(2)
    
    # Query deve retornar vazio (expirado)
    active = db.query(DriverIncentive).filter(
        DriverIncentive.driver_id == driver.id,
        DriverIncentive.status == 'ACTIVE',
        DriverIncentive.valid_until >= datetime.utcnow()
    ).first()
    
    assert active is None
```

---

### 4. Teste de Impacto Financeiro

```python
def test_commission_discount_impact():
    """
    Testa que desconto de comissão funciona corretamente
    """
    driver = create_test_driver()
    driver.commission_rate = Decimal('0.13')
    
    # Concede desconto de 3%
    incentive = DriverIncentive(
        driver_id=driver.id,
        type='COMMISSION_DISCOUNT',
        value=Decimal('0.03'),
        status='ACTIVE',
        valid_from=datetime.utcnow(),
        valid_until=datetime.utcnow() + timedelta(days=30)
    )
    db.add(incentive)
    db.commit()
    
    # Cria corrida
    ride = Ride(price_final=Decimal('100.00'))
    
    # Calcula comissão
    commission, rate = calculate_commission_with_incentive(ride, driver)
    
    # Valida
    assert rate == Decimal('0.10')  # 13% - 3%
    assert commission == Decimal('10.00')  # 10% de R$ 100


def test_bonus_in_ledger():
    """
    Testa que bônus entra corretamente no ledger
    """
    driver = create_test_driver()
    
    # Concede bônus
    grant_financial_bonus(
        driver_id=driver.id,
        amount=Decimal('200.00'),
        campaign_name='TEST'
    )
    
    # Valida ledger
    event = db.query(FinancialEvent).filter(
        FinancialEvent.entity_id == driver.id,
        FinancialEvent.category == 'INCENTIVE_BONUS'
    ).first()
    
    assert event is not None
    assert event.amount == Decimal('200.00')
    assert event.type == 'CREDIT'
    
    # Valida wallet
    wallet = db.query(DriverWalletEntry).filter(
        DriverWalletEntry.driver_id == driver.id,
        DriverWalletEntry.type == 'BONUS'
    ).first()
    
    assert wallet is not None
    assert wallet.amount == Decimal('200.00')
    assert wallet.status == 'PENDING'
```

---

### 5. Teste de Fraude

```python
def test_fraud_detection_gaming():
    """
    Testa detecção de gaming de métricas
    """
    driver = create_test_driver()
    
    # Cria padrão suspeito: 10 aceites rápidos + 10 cancelamentos rápidos
    for i in range(10):
        ride = Ride(
            driver_id=driver.id,
            status='CANCELLED_BY_DRIVER',
            requested_at=datetime.utcnow() - timedelta(hours=1),
            accepted_at=datetime.utcnow() - timedelta(hours=1) + timedelta(seconds=1),
            cancelled_at=datetime.utcnow() - timedelta(hours=1) + timedelta(seconds=5)
        )
        db.add(ride)
    db.commit()
    
    # Executa detector
    detector = IncentiveFraudDetector()
    result = detector.check_gaming_pattern(driver.id)
    
    # Valida
    assert result["fraud_score"] > 0.8
    assert result["reason"] == "GAMING_METRICS"
```

---

## 📊 RESULTADO ESTRATÉGICO

### O que este módulo entrega:

1. **Retenção de Motoristas**
   - Campanhas baseadas em métricas reais
   - Benefícios tangíveis (não apenas promessas)
   - Progressão clara (Beginner → Elite)

2. **Aumento de Caixa**
   - Motoristas engajados rodam mais
   - Qualidade maior = menos disputas
   - Disponibilidade maior = matching mais rápido

3. **Diferenciação Competitiva**
   - Uber/99: zero benefícios reais
   - iBora: parcerias locais + transparência

4. **Economia Local**
   - Convênios com postos, oficinas
   - Gera relacionamento além da plataforma
   - Benefício mútuo (parceiro + motorista)

5. **Controle Financeiro Rígido**
   - Tudo auditável (ledger)
   - Antifraude embutido
   - Orçamento controlado por campanha

---

✅ **Etapa 8 concluída:** Sistema completo de Incentivos, Performance e Fidelidade  
📍 **Próxima etapa:** [ETAPA 9 — Testes](#etapa-9--testes)

---

# ETAPA 9 — TESTES

## 🎯 OBJETIVO DA ESTRATÉGIA DE TESTES

Garantir que o iBora funciona **perfeitamente** em produção através de uma **pirâmide de testes completa**:

```
                    🔺
                   /  \
                  / E2E \          Manual / Exploratório
                 /--------\
                /          \
               / Integration \     API / Integração
              /--------------\
             /                \
            /   Unit Tests     \   Unitários
           /____________________\
```

**Filosofia:**
- **Unit Tests:** Muitos (rápidos, baratos)
- **Integration Tests:** Médio (críticos, confiáveis)
- **E2E Tests:** Poucos (lentos, frágeis)

---

## 🏗️ ESTRUTURA GERAL

### Tipos de Testes no iBora

```
1. Testes Unitários (70%)
   └─ Funções isoladas
   └─ Lógica de negócio
   └─ Calculadoras, validadores

2. Testes de Integração (20%)
   └─ API endpoints
   └─ Database queries
   └─ Serviços externos (mock)

3. Testes End-to-End (5%)
   └─ Fluxos completos
   └─ UI + Backend
   └─ Cenários críticos

4. Testes de Carga (5%)
   └─ Performance
   └─ Escalabilidade
   └─ Stress

TOTAL: 100% (cobertura mínima: 80%)
```

---

## 🧪 PARTE 1 — TESTES FUNCIONAIS

### 1.1 Testes de Autenticação

```python
# tests/test_auth.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_register_passenger_success():
    """
    Testa registro de passageiro com sucesso
    """
    response = client.post("/auth/register", json={
        "phone": "+5533988887777",
        "name": "João Silva",
        "type": "PASSENGER"
    })
    
    assert response.status_code == 201
    data = response.json()
    assert data["phone"] == "+5533988887777"
    assert data["type"] == "PASSENGER"
    assert "id" in data


def test_register_duplicate_phone():
    """
    Testa registro com telefone duplicado
    """
    # Primeiro registro
    client.post("/auth/register", json={
        "phone": "+5533988887777",
        "name": "João Silva",
        "type": "PASSENGER"
    })
    
    # Segundo registro (mesmo telefone)
    response = client.post("/auth/register", json={
        "phone": "+5533988887777",
        "name": "Maria Silva",
        "type": "PASSENGER"
    })
    
    assert response.status_code == 409
    assert "already exists" in response.json()["detail"].lower()


def test_sms_verification():
    """
    Testa verificação de SMS
    """
    # 1. Solicita código
    response = client.post("/auth/send-code", json={
        "phone": "+5533988887777"
    })
    assert response.status_code == 200
    
    # 2. Verifica código (mock)
    response = client.post("/auth/verify-code", json={
        "phone": "+5533988887777",
        "code": "123456"  # Código de teste
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data


def test_jwt_token_validation():
    """
    Testa validação de token JWT
    """
    # Login
    login_response = client.post("/auth/login", json={
        "phone": "+5533988887777",
        "code": "123456"
    })
    token = login_response.json()["access_token"]
    
    # Usa token em endpoint protegido
    response = client.get("/drivers/me", headers={
        "Authorization": f"Bearer {token}"
    })
    
    assert response.status_code == 200


def test_expired_token():
    """
    Testa token expirado
    """
    # Token expirado (mock)
    expired_token = "expired.jwt.token"
    
    response = client.get("/drivers/me", headers={
        "Authorization": f"Bearer {expired_token}"
    })
    
    assert response.status_code == 401
    assert "expired" in response.json()["detail"].lower()
```

---

### 1.2 Testes de Solicitação de Corrida

```python
# tests/test_ride_request.py
import pytest
from decimal import Decimal


def test_estimate_price():
    """
    Testa estimativa de preço
    """
    response = client.post("/rides/estimate", json={
        "origin": {
            "lat": -23.550520,
            "lng": -46.633308
        },
        "destination": {
            "lat": -23.561684,
            "lng": -46.625378
        },
        "payment_method": "PIX"
    })
    
    assert response.status_code == 200
    data = response.json()
    
    # Valida estrutura
    assert "estimate_id" in data
    assert "price" in data
    assert "distance_km" in data
    assert "duration_min" in data
    assert "breakdown" in data
    
    # Valida valores
    assert data["price"] > 0
    assert data["distance_km"] > 0
    assert data["duration_min"] > 0
    
    # Valida breakdown
    breakdown = data["breakdown"]
    assert "base" in breakdown
    assert "distance" in breakdown
    assert "time" in breakdown
    
    # Valida matemática
    expected_price = (
        breakdown["base"] +
        breakdown["distance"] +
        breakdown["time"]
    )
    assert abs(data["price"] - expected_price) < 0.01


def test_estimate_expired():
    """
    Testa estimativa expirada (5 minutos)
    """
    # Cria estimativa
    estimate_response = client.post("/rides/estimate", json={
        "origin": {"lat": -23.550520, "lng": -46.633308},
        "destination": {"lat": -23.561684, "lng": -46.625378}
    })
    estimate_id = estimate_response.json()["estimate_id"]
    
    # Aguarda expirar (mock time)
    with freeze_time(datetime.utcnow() + timedelta(minutes=6)):
        # Tenta solicitar corrida
        response = client.post("/rides/request", json={
            "estimate_id": estimate_id,
            "origin": {"lat": -23.550520, "lng": -46.633308},
            "destination": {"lat": -23.561684, "lng": -46.625378},
            "payment_method": "PIX"
        })
        
        assert response.status_code == 410  # Gone
        assert "expired" in response.json()["detail"].lower()


def test_request_ride_success():
    """
    Testa solicitação de corrida com sucesso
    """
    # 1. Estima preço
    estimate_response = client.post("/rides/estimate", json={
        "origin": {"lat": -23.550520, "lng": -46.633308},
        "destination": {"lat": -23.561684, "lng": -46.625378}
    })
    estimate_id = estimate_response.json()["estimate_id"]
    
    # 2. Solicita corrida
    response = client.post("/rides/request", 
        json={
            "estimate_id": estimate_id,
            "origin": {"lat": -23.550520, "lng": -46.633308},
            "destination": {"lat": -23.561684, "lng": -46.625378},
            "payment_method": "PIX"
        },
        headers={"Authorization": f"Bearer {passenger_token}"}
    )
    
    assert response.status_code == 201
    data = response.json()
    
    assert data["status"] == "SEARCHING"
    assert "ride_id" in data
    assert "estimated_wait" in data


def test_passenger_cannot_request_twice():
    """
    Testa que passageiro não pode ter 2 corridas simultâneas
    """
    # Primeira corrida
    response1 = client.post("/rides/request", 
        json={
            "origin": {"lat": -23.550520, "lng": -46.633308},
            "destination": {"lat": -23.561684, "lng": -46.625378},
            "payment_method": "PIX"
        },
        headers={"Authorization": f"Bearer {passenger_token}"}
    )
    assert response1.status_code == 201
    
    # Segunda corrida (deve falhar)
    response2 = client.post("/rides/request", 
        json={
            "origin": {"lat": -23.555000, "lng": -46.640000},
            "destination": {"lat": -23.560000, "lng": -46.645000},
            "payment_method": "PIX"
        },
        headers={"Authorization": f"Bearer {passenger_token}"}
    )
    
    assert response2.status_code == 409
    assert "active ride" in response2.json()["detail"].lower()
```

---

### 1.3 Testes de Aceite de Corrida

```python
# tests/test_ride_accept.py


def test_driver_accept_success():
    """
    Testa aceite de corrida com sucesso
    """
    # 1. Cria corrida (como passageiro)
    ride_response = create_test_ride(passenger_token)
    ride_id = ride_response.json()["ride_id"]
    
    # 2. Motorista aceita
    response = client.post(f"/rides/{ride_id}/accept",
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["status"] == "ACCEPTED"
    assert data["driver_id"] == driver_id


def test_driver_cannot_accept_twice():
    """
    Testa que motorista não pode aceitar 2 corridas
    """
    # Primeira corrida
    ride1 = create_test_ride(passenger1_token)
    response1 = client.post(f"/rides/{ride1['ride_id']}/accept",
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    assert response1.status_code == 200
    
    # Segunda corrida (deve falhar)
    ride2 = create_test_ride(passenger2_token)
    response2 = client.post(f"/rides/{ride2['ride_id']}/accept",
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response2.status_code == 409
    assert "already on ride" in response2.json()["detail"].lower()


def test_offline_driver_cannot_accept():
    """
    Testa que motorista offline não pode aceitar
    """
    # 1. Motorista fica offline
    client.post("/drivers/me/status",
        json={"status": "OFFLINE"},
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    # 2. Tenta aceitar corrida
    ride = create_test_ride(passenger_token)
    response = client.post(f"/rides/{ride['ride_id']}/accept",
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 400
    assert "offline" in response.json()["detail"].lower()
```

---

## ⚡ PARTE 2 — TESTES DE CONCORRÊNCIA

### 2.1 Race Condition no Aceite

```python
# tests/test_concurrency.py
import asyncio
import pytest


@pytest.mark.asyncio
async def test_race_condition_accept_ride():
    """
    CRÍTICO: Testa que apenas 1 motorista consegue aceitar
    
    Cenário:
    - 2 motoristas tentam aceitar ao mesmo tempo
    - Apenas 1 deve ter sucesso
    - Outro deve receber 409 Conflict
    """
    # Setup: cria corrida
    ride = create_test_ride(passenger_token)
    ride_id = ride["ride_id"]
    
    # Cria 2 motoristas
    driver1_token = create_test_driver("driver1")
    driver2_token = create_test_driver("driver2")
    
    # Dispara 2 aceites simultâneos
    async with httpx.AsyncClient(app=app, base_url="http://test") as client:
        results = await asyncio.gather(
            client.post(
                f"/rides/{ride_id}/accept",
                headers={"Authorization": f"Bearer {driver1_token}"}
            ),
            client.post(
                f"/rides/{ride_id}/accept",
                headers={"Authorization": f"Bearer {driver2_token}"}
            ),
            return_exceptions=True
        )
    
    # Valida resultados
    status_codes = [r.status_code for r in results]
    
    # Exatamente 1 sucesso (200)
    assert status_codes.count(200) == 1, \
        f"Expected exactly 1 success, got {status_codes}"
    
    # Exatamente 1 conflito (409)
    assert status_codes.count(409) == 1, \
        f"Expected exactly 1 conflict, got {status_codes}"
    
    # Valida estado final da corrida
    ride_state = get_ride(ride_id)
    assert ride_state["status"] == "ACCEPTED"
    assert ride_state["driver_id"] is not None


@pytest.mark.asyncio
async def test_race_condition_withdrawal():
    """
    CRÍTICO: Testa race condition em saque
    
    Cenário:
    - Saldo disponível: R$ 500
    - 2 solicitações simultâneas de R$ 500
    - Apenas 1 deve ter sucesso
    """
    # Setup: motorista com R$ 500
    driver_id = create_driver_with_balance(Decimal("500.00"))
    token = get_driver_token(driver_id)
    
    # Dispara 2 saques simultâneos
    async with httpx.AsyncClient(app=app, base_url="http://test") as client:
        results = await asyncio.gather(
            client.post(
                "/drivers/me/withdrawals",
                json={
                    "amount": 500.00,
                    "withdrawal_type": "D2",
                    "pix_key": "123.456.789-00"
                },
                headers={"Authorization": f"Bearer {token}"}
            ),
            client.post(
                "/drivers/me/withdrawals",
                json={
                    "amount": 500.00,
                    "withdrawal_type": "D2",
                    "pix_key": "123.456.789-00"
                },
                headers={"Authorization": f"Bearer {token}"}
            ),
            return_exceptions=True
        )
    
    # Valida
    status_codes = [r.status_code for r in results]
    
    # 1 sucesso
    assert status_codes.count(201) == 1
    
    # 1 falha (saldo insuficiente)
    assert status_codes.count(400) == 1
    
    # Valida saldo final
    wallet = get_driver_wallet(driver_id)
    assert wallet["available"] == Decimal("0.00")


@pytest.mark.asyncio
async def test_no_double_processing_webhook():
    """
    Testa que webhook duplicado não processa 2x
    """
    # Cria corrida
    ride = create_test_ride_completed()
    
    # Simula webhook do Efí (pagamento confirmado)
    webhook_payload = {
        "txid": "unique-txid-123",
        "event": "PAYMENT_CONFIRMED",
        "amount": 18.85,
        "ride_id": ride["ride_id"]
    }
    
    # Envia webhook 2x
    async with httpx.AsyncClient(app=app, base_url="http://test") as client:
        results = await asyncio.gather(
            client.post("/webhooks/efi/pix", json=webhook_payload),
            client.post("/webhooks/efi/pix", json=webhook_payload)
        )
    
    # Ambos retornam 200 (idempotência)
    assert all(r.status_code == 200 for r in results)
    
    # Valida que processou apenas 1x
    payment_events = db.query(PaymentEvent).filter(
        PaymentEvent.external_txid == "unique-txid-123"
    ).count()
    
    assert payment_events == 1, "Webhook processed twice!"
```

---

### 2.2 Teste de Carga (Matching)

```python
# tests/test_load.py
import locust
from locust import HttpUser, task, between


class PassengerUser(HttpUser):
    """
    Simula passageiro solicitando corridas
    """
    wait_time = between(5, 15)  # 5-15s entre ações
    
    def on_start(self):
        """Login"""
        response = self.client.post("/auth/login", json={
            "phone": f"+5533{random.randint(900000000, 999999999)}",
            "code": "123456"
        })
        self.token = response.json()["access_token"]
    
    @task(3)
    def request_ride(self):
        """Solicita corrida (peso 3)"""
        # Estima
        estimate = self.client.post("/rides/estimate", json={
            "origin": {
                "lat": -23.550520 + random.uniform(-0.01, 0.01),
                "lng": -46.633308 + random.uniform(-0.01, 0.01)
            },
            "destination": {
                "lat": -23.561684 + random.uniform(-0.01, 0.01),
                "lng": -46.625378 + random.uniform(-0.01, 0.01)
            }
        })
        
        estimate_id = estimate.json()["estimate_id"]
        
        # Solicita
        self.client.post("/rides/request",
            json={
                "estimate_id": estimate_id,
                "origin": {...},
                "destination": {...},
                "payment_method": "PIX"
            },
            headers={"Authorization": f"Bearer {self.token}"}
        )
    
    @task(1)
    def check_ride_status(self):
        """Consulta status (peso 1)"""
        self.client.get("/rides/me/current",
            headers={"Authorization": f"Bearer {self.token}"}
        )


class DriverUser(HttpUser):
    """
    Simula motorista online aceitando corridas
    """
    wait_time = between(1, 3)
    
    def on_start(self):
        response = self.client.post("/auth/login", json={
            "phone": f"+5533{random.randint(900000000, 999999999)}",
            "code": "123456",
            "type": "DRIVER"
        })
        self.token = response.json()["access_token"]
        
        # Fica online
        self.client.post("/drivers/me/status",
            json={"status": "ONLINE"},
            headers={"Authorization": f"Bearer {self.token}"}
        )
    
    @task
    def update_location(self):
        """Atualiza localização (constante)"""
        self.client.post("/drivers/me/location",
            json={
                "lat": -23.550520 + random.uniform(-0.05, 0.05),
                "lng": -46.633308 + random.uniform(-0.05, 0.05)
            },
            headers={"Authorization": f"Bearer {self.token}"}
        )


# Executar teste:
# locust -f tests/test_load.py --host=http://localhost:8000
# 
# Métricas esperadas:
# - 500 passageiros simultâneos
# - 100 motoristas simultâneos
# - P95 latency < 500ms
# - Error rate < 1%
```

---

## 💳 PARTE 3 — TESTES DE PAGAMENTO

### 3.1 Pagamento via Pix

```python
# tests/test_payment_pix.py


def test_pix_payment_flow_success():
    """
    Testa fluxo completo de pagamento Pix
    """
    # 1. Cria e finaliza corrida
    ride = create_and_complete_ride(
        passenger_token,
        driver_token,
        price=Decimal("18.85")
    )
    ride_id = ride["ride_id"]
    
    # 2. Sistema gera cobrança Pix (mock)
    with mock.patch('app.payments.efi.create_charge') as mock_efi:
        mock_efi.return_value = {
            "txid": "mock-txid-123",
            "qr_code": "00020126...",
            "expires_at": "2025-12-16T15:30:00Z"
        }
        
        # Finaliza corrida (inicia cobrança)
        response = client.post(f"/rides/{ride_id}/complete",
            headers={"Authorization": f"Bearer {driver_token}"}
        )
        
        assert response.status_code == 200
    
    # 3. Valida que corrida está pendente de pagamento
    ride_state = get_ride(ride_id)
    assert ride_state["payment_status"] == "PENDING"
    
    # 4. Simula webhook de confirmação
    webhook_response = client.post("/webhooks/efi/pix", json={
        "txid": "mock-txid-123",
        "event": "PAYMENT_CONFIRMED",
        "amount": 18.85,
        "paid_at": "2025-12-16T15:25:00Z"
    })
    
    assert webhook_response.status_code == 200
    
    # 5. Valida pagamento confirmado
    ride_state = get_ride(ride_id)
    assert ride_state["payment_status"] == "CONFIRMED"
    assert ride_state["paid_at"] is not None
    
    # 6. Valida ledger
    ledger_entries = db.query(FinancialEvent).filter(
        FinancialEvent.ride_id == ride_id
    ).all()
    
    # Deve ter 3 entradas
    assert len(ledger_entries) == 3
    
    # Passageiro pagou
    passenger_entry = next(
        e for e in ledger_entries 
        if e.category == 'RIDE_PAYMENT'
    )
    assert passenger_entry.amount == Decimal("-18.85")
    
    # Motorista ganhou
    driver_entry = next(
        e for e in ledger_entries 
        if e.category == 'RIDE_EARNING'
    )
    assert driver_entry.amount == Decimal("16.40")  # 87% de 18.85
    
    # Plataforma ganhou
    platform_entry = next(
        e for e in ledger_entries 
        if e.category == 'COMMISSION'
    )
    assert platform_entry.amount == Decimal("2.45")  # 13% de 18.85
    
    # Soma = 0 (balanceado)
    total = sum(e.amount for e in ledger_entries)
    assert total == Decimal("0.00")


def test_pix_payment_timeout():
    """
    Testa timeout de pagamento Pix (não pago em 5 min)
    """
    ride = create_and_complete_ride(
        passenger_token,
        driver_token,
        price=Decimal("18.85")
    )
    
    # Avança tempo (mock)
    with freeze_time(datetime.utcnow() + timedelta(minutes=6)):
        # Job verifica pagamentos pendentes
        check_payment_timeouts()
        
        # Valida que marcou como falho
        ride_state = get_ride(ride["ride_id"])
        assert ride_state["payment_status"] == "FAILED"


def test_pix_payment_webhook_invalid_signature():
    """
    Testa webhook com assinatura inválida
    """
    response = client.post("/webhooks/efi/pix",
        json={"txid": "123", "event": "PAYMENT_CONFIRMED"},
        headers={"X-Signature": "invalid-signature"}
    )
    
    assert response.status_code == 401
```

---

### 3.2 Pagamento via Cartão

```python
# tests/test_payment_card.py


def test_card_payment_approved():
    """
    Testa pagamento com cartão aprovado
    """
    ride = create_and_complete_ride(
        passenger_token,
        driver_token,
        price=Decimal("18.85"),
        payment_method="CREDIT_CARD"
    )
    
    # Mock provider (Stripe)
    with mock.patch('app.payments.stripe.capture') as mock_stripe:
        mock_stripe.return_value = {
            "status": "APPROVED",
            "transaction_id": "ch_123abc"
        }
        
        # Finaliza corrida
        response = client.post(f"/rides/{ride['ride_id']}/complete",
            headers={"Authorization": f"Bearer {driver_token}"}
        )
        
        assert response.status_code == 200
    
    # Valida pagamento confirmado
    ride_state = get_ride(ride["ride_id"])
    assert ride_state["payment_status"] == "CONFIRMED"


def test_card_payment_declined():
    """
    Testa cartão recusado
    """
    ride = create_and_complete_ride(
        passenger_token,
        driver_token,
        payment_method="CREDIT_CARD"
    )
    
    # Mock decline
    with mock.patch('app.payments.stripe.capture') as mock_stripe:
        mock_stripe.return_value = {
            "status": "DECLINED",
            "decline_reason": "insufficient_funds"
        }
        
        response = client.post(f"/rides/{ride['ride_id']}/complete",
            headers={"Authorization": f"Bearer {driver_token}"}
        )
        
        # Ainda completa corrida (motorista recebe)
        assert response.status_code == 200
    
    # Valida estado
    ride_state = get_ride(ride["ride_id"])
    assert ride_state["status"] == "COMPLETED"
    assert ride_state["payment_status"] == "FAILED"
    
    # Passageiro bloqueado até regularizar
    passenger_state = get_passenger(ride["passenger_id"])
    assert passenger_state["status"] == "PAYMENT_PENDING"
```

---

### 3.3 Pagamento em Cash

```python
# tests/test_payment_cash.py


def test_cash_payment_flow():
    """
    Testa fluxo de pagamento em dinheiro
    """
    ride = create_and_complete_ride(
        passenger_token,
        driver_token,
        price=Decimal("20.00"),
        payment_method="CASH"
    )
    
    # Finaliza
    response = client.post(f"/rides/{ride['ride_id']}/complete",
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 200
    
    # Pagamento marcado como coletado
    ride_state = get_ride(ride["ride_id"])
    assert ride_state["payment_status"] == "CASH_COLLECTED"
    
    # Motorista tem dinheiro "em mãos" (não na wallet ainda)
    # Precisa depositar em parceiro


def test_cash_deposit_at_partner():
    """
    Testa depósito de cash em parceiro
    """
    # Motorista tem R$ 200 em cash
    driver_id = create_driver_with_cash(Decimal("200.00"))
    
    # Deposita em posto parceiro
    response = client.post("/drivers/me/cash-deposit",
        json={
            "amount": 200.00,
            "partner_code": "POSTO_SHELL_001"
        },
        headers={"Authorization": f"Bearer {get_driver_token(driver_id)}"}
    )
    
    assert response.status_code == 200
    
    # Vira crédito na wallet
    wallet = get_driver_wallet(driver_id)
    assert wallet["available"] >= Decimal("200.00")
```

---

## 🔄 PARTE 4 — TESTES DE RECONCILIAÇÃO

### 4.1 Reconciliação Diária

```python
# tests/test_reconciliation.py


def test_daily_reconciliation():
    """
    Testa reconciliação financeira diária
    """
    # Setup: cria 10 corridas completadas ontem
    yesterday = datetime.utcnow().date() - timedelta(days=1)
    
    rides = []
    for i in range(10):
        ride = create_completed_ride(
            price=Decimal("20.00"),
            completed_at=yesterday
        )
        rides.append(ride)
    
    # Executa reconciliação
    result = run_daily_reconciliation(yesterday)
    
    # Valida
    assert result["total_rides"] == 10
    assert result["total_revenue"] == Decimal("200.00")
    assert result["total_commission"] == Decimal("26.00")  # 13%
    assert result["total_driver_earnings"] == Decimal("174.00")  # 87%
    
    # Soma deve bater
    assert (
        result["total_commission"] + 
        result["total_driver_earnings"]
    ) == result["total_revenue"]


def test_ledger_balance():
    """
    Testa que ledger está balanceado
    """
    # Para cada corrida, soma de eventos deve ser 0
    rides = db.query(Ride).filter(
        Ride.status == 'COMPLETED'
    ).all()
    
    for ride in rides:
        events = db.query(FinancialEvent).filter(
            FinancialEvent.ride_id == ride.id
        ).all()
        
        total = sum(e.amount for e in events)
        
        assert total == Decimal("0.00"), \
            f"Ride {ride.id} ledger not balanced: {total}"


def test_wallet_consistency():
    """
    Testa consistência da wallet com ledger
    """
    drivers = db.query(Driver).all()
    
    for driver in drivers:
        # Saldo calculado pelo ledger
        ledger_balance = db.query(
            func.sum(FinancialEvent.amount)
        ).filter(
            FinancialEvent.entity_type == 'DRIVER',
            FinancialEvent.entity_id == driver.user_id
        ).scalar() or Decimal("0.00")
        
        # Saldo na wallet
        wallet_balance = db.query(
            func.sum(DriverWalletEntry.amount)
        ).filter(
            DriverWalletEntry.driver_id == driver.user_id,
            DriverWalletEntry.status.in_(['AVAILABLE', 'PENDING'])
        ).scalar() or Decimal("0.00")
        
        # Devem bater
        assert abs(ledger_balance - wallet_balance) < Decimal("0.01"), \
            f"Driver {driver.user_id} wallet mismatch"
```

---

## 🎨 PARTE 5 — TESTES DE UX (E2E)

### 5.1 Fluxo Completo do Passageiro

```python
# tests/test_e2e_passenger.py
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def test_passenger_complete_flow():
    """
    Testa fluxo completo: login → solicitar → pagar → avaliar
    """
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000")
    
    try:
        # 1. Login
        phone_input = driver.find_element(By.ID, "phone-input")
        phone_input.send_keys("33988887777")
        
        submit_btn = driver.find_element(By.ID, "submit-phone")
        submit_btn.click()
        
        # Aguarda código SMS (mock)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "code-input"))
        )
        
        code_input = driver.find_element(By.ID, "code-input")
        code_input.send_keys("123456")
        
        verify_btn = driver.find_element(By.ID, "verify-code")
        verify_btn.click()
        
        # 2. Aguarda home
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "destination-input"))
        )
        
        # 3. Define destino
        dest_input = driver.find_element(By.ID, "destination-input")
        dest_input.send_keys("Shopping Center")
        
        # Aguarda autocomplete
        WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.CLASS_NAME, "autocomplete-item"))
        )
        
        first_result = driver.find_element(By.CLASS_NAME, "autocomplete-item")
        first_result.click()
        
        # 4. Vê preço
        price_element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "estimated-price"))
        )
        
        price_text = price_element.text
        assert "R$" in price_text
        
        # 5. Solicita corrida
        request_btn = driver.find_element(By.ID, "request-ride")
        request_btn.click()
        
        # 6. Aguarda motorista
        WebDriverWait(driver, 30).until(
            EC.presence_of_element_located((By.ID, "driver-info"))
        )
        
        driver_name = driver.find_element(By.ID, "driver-name").text
        assert len(driver_name) > 0
        
        # 7. (Simula corrida completa via API)
        simulate_ride_completion()
        
        # 8. Avalia motorista
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "rating-stars"))
        )
        
        five_star = driver.find_element(By.CSS_SELECTOR, "[data-rating='5']")
        five_star.click()
        
        submit_rating = driver.find_element(By.ID, "submit-rating")
        submit_rating.click()
        
        # 9. Valida sucesso
        success_msg = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.CLASS_NAME, "success-message"))
        )
        
        assert "obrigado" in success_msg.text.lower()
        
    finally:
        driver.quit()
```

---

### 5.2 Fluxo Completo do Motorista

```python
# tests/test_e2e_driver.py


def test_driver_complete_flow():
    """
    Testa: login → online → aceitar → navegar → finalizar → avaliar
    """
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000/driver")
    
    try:
        # 1. Login (similar ao passageiro)
        login_as_driver(driver, "33988886666")
        
        # 2. Fica online
        online_toggle = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "online-toggle"))
        )
        online_toggle.click()
        
        # Valida status
        status_text = driver.find_element(By.ID, "status-label").text
        assert status_text == "ONLINE"
        
        # 3. Aguarda notificação de corrida
        notification = WebDriverWait(driver, 60).until(
            EC.presence_of_element_located((By.CLASS_NAME, "ride-notification"))
        )
        
        # 4. Vê detalhes
        origin = driver.find_element(By.ID, "ride-origin").text
        destination = driver.find_element(By.ID, "ride-destination").text
        earnings = driver.find_element(By.ID, "ride-earnings").text
        
        assert len(origin) > 0
        assert len(destination) > 0
        assert "R$" in earnings
        
        # 5. Aceita
        accept_btn = driver.find_element(By.ID, "accept-ride")
        accept_btn.click()
        
        # 6. Tela de navegação
        WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.ID, "navigation-map"))
        )
        
        # 7. Clica "CHEGUEI"
        arrived_btn = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "arrived-button"))
        )
        arrived_btn.click()
        
        # 8. Inicia corrida
        start_btn = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "start-ride"))
        )
        start_btn.click()
        
        # 9. (Simula chegada ao destino)
        time.sleep(2)
        
        # 10. Finaliza
        complete_btn = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "complete-ride"))
        )
        complete_btn.click()
        
        # 11. Avalia passageiro
        WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.CLASS_NAME, "rating-stars"))
        )
        
        five_star = driver.find_element(By.CSS_SELECTOR, "[data-rating='5']")
        five_star.click()
        
        submit = driver.find_element(By.ID, "submit-rating")
        submit.click()
        
        # 12. Valida que voltou para tela "aguardando corrida"
        WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.ID, "waiting-rides"))
        )
        
    finally:
        driver.quit()
```

---

## 🏃 PARTE 6 — TESTES DE PERFORMANCE

### 6.1 Benchmark de Queries Críticas

```python
# tests/test_performance.py
import pytest
import time


def test_find_nearby_drivers_performance():
    """
    Testa performance de query espacial (PostGIS)
    
    Requisito: < 100ms para 1000 motoristas em raio de 5km
    """
    # Setup: cria 1000 motoristas online
    for i in range(1000):
        create_test_driver(
            lat=-23.550 + random.uniform(-0.1, 0.1),
            lng=-46.633 + random.uniform(-0.1, 0.1),
            status='ONLINE'
        )
    
    # Query
    start = time.time()
    
    drivers = db.query(Driver).filter(
        Driver.status == 'ONLINE',
        func.ST_Distance_Sphere(
            Driver.location,
            func.ST_Point(-46.633, -23.550)
        ) <= 5000
    ).limit(10).all()
    
    elapsed_ms = (time.time() - start) * 1000
    
    # Valida
    assert len(drivers) > 0
    assert elapsed_ms < 100, f"Query took {elapsed_ms}ms (limit: 100ms)"


def test_ledger_sum_performance():
    """
    Testa performance de cálculo de saldo (SUM do ledger)
    
    Requisito: < 50ms para 10.000 eventos
    """
    driver_id = create_test_driver()
    
    # Cria 10.000 eventos financeiros
    for i in range(10000):
        db.add(FinancialEvent(
            type=random.choice(['CREDIT', 'DEBIT']),
            entity_type='DRIVER',
            entity_id=driver_id,
            amount=Decimal(random.uniform(-100, 100)),
            category='RIDE_EARNING'
        ))
    db.commit()
    
    # Query
    start = time.time()
    
    balance = db.query(
        func.sum(FinancialEvent.amount)
    ).filter(
        FinancialEvent.entity_type == 'DRIVER',
        FinancialEvent.entity_id == driver_id
    ).scalar()
    
    elapsed_ms = (time.time() - start) * 1000
    
    assert elapsed_ms < 50, f"Query took {elapsed_ms}ms (limit: 50ms)"
```

---

## 🔒 PARTE 7 — TESTES DE SEGURANÇA

### 7.1 Autenticação e Autorização

```python
# tests/test_security.py


def test_cannot_access_without_token():
    """
    Testa que endpoints protegidos exigem token
    """
    response = client.get("/drivers/me")
    assert response.status_code == 401


def test_cannot_use_expired_token():
    """
    Testa token expirado
    """
    # Cria token que expira em 1 segundo
    token = create_jwt(driver_id, expires_in=1)
    
    # Aguarda expirar
    time.sleep(2)
    
    # Tenta usar
    response = client.get("/drivers/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 401
    assert "expired" in response.json()["detail"].lower()


def test_driver_cannot_access_passenger_data():
    """
    Testa isolamento: motorista não vê dados de passageiro
    """
    passenger_id = create_test_passenger()
    driver_token = get_driver_token()
    
    response = client.get(f"/passengers/{passenger_id}",
        headers={"Authorization": f"Bearer {driver_token}"}
    )
    
    assert response.status_code == 403


def test_sql_injection_protection():
    """
    Testa proteção contra SQL injection
    """
    malicious_input = "'; DROP TABLE rides; --"
    
    response = client.get(f"/rides/search?query={malicious_input}")
    
    # Não deve crashar
    assert response.status_code in [200, 400]
    
    # Tabela rides ainda existe
    assert db.query(Ride).count() >= 0


def test_rate_limiting():
    """
    Testa rate limiting (100 requests/minuto)
    """
    responses = []
    
    for i in range(150):
        response = client.get("/health")
        responses.append(response.status_code)
    
    # Primeiros 100: sucesso
    assert responses[:100].count(200) == 100
    
    # Próximos: rate limited
    assert 429 in responses[100:]
```

---

## 🌍 PARTE 8 — AMBIENTES DE TESTE

### 8.1 Configuração de Ambientes

```yaml
# docker-compose.test.yml
version: '3.8'

services:
  test-db:
    image: postgis/postgis:15-3.3
    environment:
      POSTGRES_DB: ibora_test
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test123
    ports:
      - "5433:5432"
    volumes:
      - test-db-data:/var/lib/postgresql/data
  
  test-redis:
    image: redis:7-alpine
    ports:
      - "6380:6379"
  
  test-rabbitmq:
    image: rabbitmq:3-management-alpine
    ports:
      - "5673:5672"
      - "15673:15672"

volumes:
  test-db-data:
```

### 8.2 Fixtures e Factories

```python
# tests/conftest.py
import pytest
from factory import Factory, Faker, SubFactory
from factory.alchemy import SQLAlchemyModelFactory


class UserFactory(SQLAlchemyModelFactory):
    class Meta:
        model = User
        sqlalchemy_session = db.session
    
    id = Faker('uuid4')
    phone = Faker('phone_number')
    name = Faker('name')
    type = 'PASSENGER'
    status = 'ACTIVE'


class DriverFactory(UserFactory):
    type = 'DRIVER'
    
    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        user = super()._create(model_class, *args, **kwargs)
        
        # Cria registro de driver
        driver = Driver(
            user_id=user.id,
            status='OFFLINE',
            lat=Decimal('-23.550'),
            lng=Decimal('-46.633'),
            rating=Decimal('5.00')
        )
        db.session.add(driver)
        db.session.commit()
        
        return user


class RideFactory(SQLAlchemyModelFactory):
    class Meta:
        model = Ride
        sqlalchemy_session = db.session
    
    id = Faker('uuid4')
    passenger = SubFactory(UserFactory)
    status = 'SEARCHING'
    price_estimated = Faker('pydecimal', left_digits=2, right_digits=2, positive=True)
    origin_lat = Decimal('-23.550')
    origin_lng = Decimal('-46.633')
    destination_lat = Decimal('-23.560')
    destination_lng = Decimal('-46.640')


@pytest.fixture
def passenger():
    """Fixture: passageiro de teste"""
    return UserFactory()


@pytest.fixture
def driver():
    """Fixture: motorista de teste"""
    return DriverFactory()


@pytest.fixture
def ride(passenger, driver):
    """Fixture: corrida de teste"""
    return RideFactory(
        passenger=passenger,
        driver=driver,
        status='ACCEPTED'
    )
```

---

## 🚀 PARTE 9 — CI/CD E AUTOMAÇÃO

### 9.1 GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgis/postgis:15-3.3
        env:
          POSTGRES_DB: ibora_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test123
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-dev.txt
      
      - name: Run migrations
        run: |
          alembic upgrade head
        env:
          DATABASE_URL: postgresql://test:test123@localhost:5432/ibora_test
      
      - name: Run unit tests
        run: |
          pytest tests/unit -v --cov=app --cov-report=xml
      
      - name: Run integration tests
        run: |
          pytest tests/integration -v
      
      - name: Run E2E tests
        run: |
          pytest tests/e2e -v --headless
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage.xml
      
      - name: Check coverage threshold
        run: |
          coverage report --fail-under=80
```

---

## 📊 MÉTRICAS DE QUALIDADE

### Cobertura de Testes (Mínimo)

```
Módulo                  | Cobertura
------------------------|----------
Authentication          | 95%
Ride Management         | 90%
Payment Processing      | 95%
Financial Ledger        | 100%
Matching Service        | 85%
WebSocket Events        | 80%
Incentives System       | 90%
------------------------|----------
TOTAL                   | 88%
```

### Tempo de Execução (CI)

```
Unit Tests:         < 2 min
Integration Tests:  < 5 min
E2E Tests:         < 10 min
Total Pipeline:    < 20 min
```

---

## ✅ CHECKLIST DE TESTES PRÉ-PRODUÇÃO

```markdown
### Funcionais
- [ ] Login passageiro/motorista
- [ ] Solicitar corrida
- [ ] Aceitar corrida
- [ ] Finalizar corrida
- [ ] Avaliar usuário
- [ ] Consultar histórico

### Pagamentos
- [ ] Pix completo (QR Code → Webhook)
- [ ] Cartão aprovado
- [ ] Cartão recusado (retry)
- [ ] Cash coletado

### Financeiro
- [ ] Ledger balanceado
- [ ] Wallet consistente
- [ ] Saque D+2
- [ ] Settlement job

### Concorrência
- [ ] Race condition no aceite
- [ ] Race condition no saque
- [ ] Webhook duplicado (idempotência)

### Performance
- [ ] Matching < 100ms
- [ ] Ledger SUM < 50ms
- [ ] 500 usuários simultâneos (Locust)

### Segurança
- [ ] JWT expirado bloqueado
- [ ] SQL injection protegido
- [ ] Rate limiting ativo
- [ ] HTTPS enforced

### UX (E2E)
- [ ] Fluxo passageiro completo
- [ ] Fluxo motorista completo
- [ ] Navegação mobile (touch)

### Incentivos
- [ ] Campanha elegível correta
- [ ] Não duplicação
- [ ] Expiração
- [ ] Integração com ledger
```

---

✅ **Etapa 9 concluída:** Estratégia completa de testes implementada  
📍 **Próxima etapa:** [ETAPA 10 — Metodologia e Roadmap](#etapa-10--metodologia-e-roadmap)

---
