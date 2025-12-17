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
