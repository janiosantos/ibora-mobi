# SPRINT 2 — RIDE MANAGEMENT (PARTE 1)

**Período:** Semanas 3-4  
**Duração:** 10 dias úteis  
**Time:** Tech Lead + 2 Backend + 2 Mobile + 1 Designer  
**Objetivo:** Passageiro consegue solicitar corrida e ver estimativa de preço

---

## 🎯 OBJETIVOS DO SPRINT

### Objetivo Principal
Implementar a funcionalidade core de solicitação de corrida: passageiro define destino, vê preço estimado e solicita corrida.

### Objetivos Específicos
1. ✅ Modelo de dados de corridas (rides)
2. ✅ Integração Google Maps API (geocoding + directions)
3. ✅ Cálculo de preço (distância + tempo)
4. ✅ Endpoint de estimativa de preço
5. ✅ Endpoint de solicitação de corrida
6. ✅ Telas mobile (home, destino, estimativa)
7. ✅ Mapa funcional (iOS + Android)

---

## 📋 BACKLOG DO SPRINT

### EPIC 1: Modelo de Dados

#### **US-012: Schema de Corridas**
**Como** Backend Dev  
**Quero** criar schema de corridas  
**Para** armazenar todas as informações de uma corrida

**Schema:**
```sql
CREATE TABLE rides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relacionamentos
    passenger_id UUID NOT NULL REFERENCES users(id),
    driver_id UUID REFERENCES users(id),
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'SEARCHING',
    -- SEARCHING | ACCEPTED | PICKING_UP | IN_PROGRESS | COMPLETED | CANCELLED
    
    -- Localização
    origin_lat DECIMAL(10, 8) NOT NULL,
    origin_lng DECIMAL(11, 8) NOT NULL,
    origin_address TEXT NOT NULL,
    destination_lat DECIMAL(10, 8) NOT NULL,
    destination_lng DECIMAL(11, 8) NOT NULL,
    destination_address TEXT NOT NULL,
    
    -- Preço
    price_estimated DECIMAL(10, 2) NOT NULL,
    price_final DECIMAL(10, 2),
    distance_km DECIMAL(10, 2) NOT NULL,
    duration_min INTEGER NOT NULL,
    
    -- Pagamento
    payment_method VARCHAR(20) NOT NULL, -- PIX | CREDIT_CARD | CASH
    payment_status VARCHAR(20) DEFAULT 'PENDING',
    -- PENDING | CONFIRMED | FAILED
    
    -- Estimativa
    estimate_id UUID,
    estimate_valid_until TIMESTAMP,
    
    -- Timestamps
    requested_at TIMESTAMP DEFAULT NOW(),
    accepted_at TIMESTAMP,
    picked_up_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    
    -- Metadata
    cancelled_by VARCHAR(20), -- PASSENGER | DRIVER | SYSTEM
    cancellation_reason TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_rides_passenger ON rides(passenger_id);
CREATE INDEX idx_rides_driver ON rides(driver_id);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_rides_created_at ON rides(created_at DESC);

-- Composite index para queries comuns
CREATE INDEX idx_rides_passenger_status ON rides(passenger_id, status);
CREATE INDEX idx_rides_driver_status ON rides(driver_id, status);
```

**Estimativa de Preços:**
```sql
CREATE TABLE price_estimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Localização
    origin_lat DECIMAL(10, 8) NOT NULL,
    origin_lng DECIMAL(11, 8) NOT NULL,
    destination_lat DECIMAL(10, 8) NOT NULL,
    destination_lng DECIMAL(11, 8) NOT NULL,
    
    -- Cálculo
    distance_km DECIMAL(10, 2) NOT NULL,
    duration_min INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    breakdown JSONB NOT NULL, -- {base, distance, time}
    
    -- Validade
    valid_until TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_price_estimates_valid ON price_estimates(valid_until) 
    WHERE NOT used;
```

**Critérios de Aceitação:**
- [ ] Migrations criadas (Alembic)
- [ ] Tabelas no PostgreSQL
- [ ] Models SQLAlchemy criados
- [ ] Schemas Pydantic criados
- [ ] CRUD básico funcional

**Tasks:**
```
├─ Criar migration: create_rides_table
├─ Criar migration: create_price_estimates_table
├─ Criar models/ride.py
├─ Criar models/price_estimate.py
├─ Criar schemas/ride.py (RideCreate, RideResponse, etc)
├─ Criar schemas/price_estimate.py
├─ Criar crud/ride.py
├─ Criar enums.py (RideStatus, PaymentMethod, etc)
└─ Testes unitários
```

**Estimativa:** 8 story points  
**Responsável:** Backend Dev 1  
**Tempo:** 1 dia

---

### EPIC 2: Integração Google Maps

#### **US-013: Configurar Google Maps API**
**Como** Backend Dev  
**Quero** integrar Google Maps API  
**Para** calcular rotas e distâncias

**APIs Necessárias:**
```
1. Geocoding API (endereço → lat/lng)
2. Directions API (rota + distância + tempo)
3. Places API (autocomplete destinos) — Opcional Sprint 2
```

**Critérios de Aceitação:**
- [ ] Conta Google Cloud criada
- [ ] Projeto configurado
- [ ] APIs habilitadas
- [ ] API Key gerada (com restrições)
- [ ] Billing configurado (limite diário)
- [ ] Integração testada (Python)

**Tasks:**
```
├─ Criar conta Google Cloud
├─ Criar projeto "iBora"
├─ Habilitar APIs necessárias
├─ Gerar API Key
├─ Restringir API Key (IPs, APIs)
├─ Configurar billing alert (R$ 100/dia)
├─ Instalar googlemaps SDK Python
├─ Criar services/maps.py
├─ Implementar geocode(address)
├─ Implementar get_directions(origin, destination)
└─ Testes (mock API)
```

**Estimativa:** 5 story points  
**Responsável:** Backend Dev 2  
**Tempo:** 0.5 dia

---

#### **US-014: Serviço de Cálculo de Distância**
**Como** Backend Dev  
**Quero** calcular distância e tempo entre dois pontos  
**Para** estimar preço da corrida

**Critérios de Aceitação:**
- [ ] Função calculate_route(origin, destination)
- [ ] Retorna: distance_km, duration_min, polyline
- [ ] Cache Redis (mesma rota, TTL 1h)
- [ ] Trata erros (API offline, rota inválida)

**Tasks:**
```
├─ Criar services/route_calculator.py
├─ Implementar calculate_route()
├─ Integrar com Google Directions API
├─ Implementar cache Redis
├─ Tratar exceções (timeout, erro API)
├─ Logs estruturados
└─ Testes (mock Google API)
```

**Estimativa:** 8 story points  
**Responsável:** Backend Dev 2  
**Tempo:** 1 dia

---

### EPIC 3: Cálculo de Preço

#### **US-015: Motor de Precificação**
**Como** Backend Dev  
**Quero** calcular preço da corrida  
**Para** mostrar estimativa para passageiro

**Fórmula:**
```python
# Preço Base
BASE_FARE = 4.00  # R$ 4,00

# Tarifa por KM
PRICE_PER_KM = 2.00  # R$ 2,00/km

# Tarifa por Minuto
PRICE_PER_MIN = 0.30  # R$ 0,30/min

# Preço Mínimo
MINIMUM_FARE = 7.00  # R$ 7,00

def calculate_price(distance_km: float, duration_min: int) -> dict:
    """
    Calcula preço da corrida
    
    Returns:
        {
            "price": 18.85,
            "breakdown": {
                "base": 4.00,
                "distance": 12.00,  # 6km × R$ 2,00
                "time": 3.90        # 13min × R$ 0,30
            }
        }
    """
    base = BASE_FARE
    distance_charge = distance_km * PRICE_PER_KM
    time_charge = duration_min * PRICE_PER_MIN
    
    total = base + distance_charge + time_charge
    
    # Preço mínimo
    if total < MINIMUM_FARE:
        total = MINIMUM_FARE
    
    # Arredondamento (para R$ X,X5 ou R$ X,X0)
    total = round_to_nearest_5_cents(total)
    
    return {
        "price": total,
        "breakdown": {
            "base": base,
            "distance": distance_charge,
            "time": time_charge
        }
    }
```

**Critérios de Aceitação:**
- [ ] Função calculate_price() implementada
- [ ] Arredondamento correto (R$ X,X5 ou R$ X,X0)
- [ ] Preço mínimo respeitado (R$ 7,00)
- [ ] Breakdown detalhado retornado
- [ ] Testes com vários cenários

**Tasks:**
```
├─ Criar services/pricing.py
├─ Implementar calculate_price()
├─ Implementar round_to_nearest_5_cents()
├─ Criar constantes de pricing (config)
├─ Testes unitários (10+ cenários)
└─ Documentação da fórmula
```

**Estimativa:** 5 story points  
**Responsável:** Backend Dev 1  
**Tempo:** 0.5 dia

---

### EPIC 4: Endpoints de Corrida

#### **US-016: Endpoint de Estimativa**
**Como** Passageiro  
**Quero** ver estimativa de preço  
**Para** decidir se solicito a corrida

**Endpoint:**
```
POST /rides/estimate

Request:
{
    "origin": {
        "lat": -23.550520,
        "lng": -46.633308
    },
    "destination": {
        "lat": -23.561684,
        "lng": -46.625378
    }
}

Response (200):
{
    "estimate_id": "uuid",
    "price": 18.85,
    "breakdown": {
        "base": 4.00,
        "distance": 12.00,
        "time": 3.90
    },
    "distance_km": 6.0,
    "duration_min": 13,
    "valid_until": "2025-12-16T15:35:00Z",  # 5 minutos
    "route_polyline": "encoded_polyline_string"
}
```

**Critérios de Aceitação:**
- [ ] Endpoint POST /rides/estimate funcional
- [ ] Calcula rota (Google Directions)
- [ ] Calcula preço (pricing service)
- [ ] Gera estimate_id (UUID)
- [ ] Salva estimativa (price_estimates table)
- [ ] TTL 5 minutos
- [ ] Rate limit: 10 req/min por usuário

**Tasks:**
```
├─ Criar routers/rides.py
├─ Criar endpoint POST /rides/estimate
├─ Validar input (Pydantic)
├─ Chamar calculate_route()
├─ Chamar calculate_price()
├─ Gerar estimate_id
├─ Salvar em price_estimates
├─ Implementar rate limiting
├─ Testes (unitários + integração)
└─ Documentação (Swagger)
```

**Estimativa:** 8 story points  
**Responsável:** Backend Dev 1  
**Tempo:** 1 dia

---

#### **US-017: Endpoint de Solicitação de Corrida**
**Como** Passageiro  
**Quero** solicitar corrida  
**Para** que um motorista me busque

**Endpoint:**
```
POST /rides/request

Request:
{
    "estimate_id": "uuid",
    "origin": {
        "lat": -23.550520,
        "lng": -46.633308,
        "address": "Av. Paulista, 1578"
    },
    "destination": {
        "lat": -23.561684,
        "lng": -46.625378,
        "address": "Shopping Center Norte"
    },
    "payment_method": "PIX"
}

Response (201):
{
    "ride_id": "uuid",
    "status": "SEARCHING",
    "estimated_wait": "2-5 minutos",
    "price": 18.85
}
```

**Validações:**
- [ ] Usuário autenticado (JWT)
- [ ] estimate_id válido (não expirado)
- [ ] Passageiro não tem corrida ativa
- [ ] Origem e destino válidos

**Critérios de Aceitação:**
- [ ] Endpoint POST /rides/request funcional
- [ ] Valida estimate_id (não expirado, não usado)
- [ ] Valida passageiro (sem corrida ativa)
- [ ] Cria registro em rides
- [ ] Status = SEARCHING
- [ ] Marca estimate como usado
- [ ] Retorna ride_id
- [ ] Emite evento (ride.requested) para matching

**Tasks:**
```
├─ Criar endpoint POST /rides/request
├─ Validar JWT (middleware)
├─ Validar estimate_id (buscar price_estimates)
├─ Validar passageiro (query rides ativas)
├─ Criar ride (INSERT)
├─ Marcar estimate como usado
├─ Publicar evento RabbitMQ (ride.requested)
├─ Testes (cenários válido/inválido)
└─ Documentação
```

**Estimativa:** 13 story points  
**Responsável:** Backend Dev 1 + Backend Dev 2  
**Tempo:** 1.5 dia

---

### EPIC 5: Mobile (Passageiro)

#### **US-018: Tela Home (Mapa)**
**Como** Passageiro  
**Quero** ver mapa com minha localização  
**Para** definir origem da corrida

**Componentes:**
```
├─ Mapa (react-native-maps)
├─ Marcador de localização atual
├─ Botão "Para onde?"
├─ Menu lateral (perfil, histórico, ajuda)
└─ Botão de centralizar no usuário
```

**Critérios de Aceitação:**
- [ ] Mapa carregando (Google Maps)
- [ ] Permissão de localização solicitada
- [ ] Marcador na localização atual
- [ ] Botão "Para onde?" funcional
- [ ] Navegação para tela de destino

**Tasks:**
```
├─ Instalar react-native-maps
├─ Configurar Google Maps API Key (iOS + Android)
├─ Criar screens/passenger/HomeScreen.tsx
├─ Criar components/Map.tsx
├─ Solicitar permissão de localização
├─ Obter localização atual (Geolocation)
├─ Renderizar mapa centrado no usuário
├─ Adicionar marcador de posição
├─ Criar botão "Para onde?"
├─ Navegar para DestinationScreen
└─ Testes
```

**Estimativa:** 13 story points  
**Responsável:** Mobile Dev 1  
**Tempo:** 1.5 dia

---

#### **US-019: Tela de Seleção de Destino**
**Como** Passageiro  
**Quero** digitar destino  
**Para** ver preço estimado

**Componentes:**
```
├─ Input de busca (autocomplete)
├─ Lista de sugestões (Google Places)
├─ Botão "Confirmar"
└─ Loading state
```

**Critérios de Aceitação:**
- [ ] Input de destino funcional
- [ ] Autocomplete (opcional: Google Places Autocomplete)
- [ ] Ao selecionar: volta para mapa
- [ ] Mapa mostra rota (polyline)
- [ ] Chama API /rides/estimate
- [ ] Mostra loading durante requisição

**Tasks:**
```
├─ Criar screens/passenger/DestinationScreen.tsx
├─ Criar SearchInput component
├─ (Opcional) Integrar Google Places Autocomplete
├─ Implementar busca local (mock para MVP)
├─ Ao selecionar: chamar API /rides/estimate
├─ Salvar estimativa (Redux)
├─ Navegar para EstimateScreen
└─ Testes
```

**Estimativa:** 13 story points  
**Responsável:** Mobile Dev 2  
**Tempo:** 1.5 dia

---

#### **US-020: Tela de Estimativa de Preço**
**Como** Passageiro  
**Quero** ver preço estimado  
**Para** decidir se confirmo a corrida

**Componentes:**
```
├─ Mapa com rota traçada
├─ Card de preço
│   ├─ Preço principal (R$ 18,85)
│   ├─ Distância (6,0 km)
│   ├─ Tempo estimado (13 min)
│   └─ Breakdown (opcional, expansível)
├─ Método de pagamento (PIX selecionado)
├─ Botão "Solicitar iBora"
└─ Botão "Voltar"
```

**Critérios de Aceitação:**
- [ ] Mapa mostra rota (polyline)
- [ ] Card de preço exibido
- [ ] Preço destacado (grande, bold)
- [ ] Distância e tempo visíveis
- [ ] Botão "Solicitar iBora" funcional
- [ ] Ao clicar: chama API /rides/request
- [ ] Navega para SearchingScreen

**Tasks:**
```
├─ Criar screens/passenger/EstimateScreen.tsx
├─ Criar components/PriceCard.tsx
├─ Renderizar mapa com rota (polyline)
├─ Exibir preço da estimativa
├─ Implementar ação "Solicitar"
├─ Chamar API POST /rides/request
├─ Tratar sucesso (navegar)
├─ Tratar erro (modal)
└─ Testes
```

**Estimativa:** 8 story points  
**Responsável:** Mobile Dev 1  
**Tempo:** 1 dia

---

#### **US-021: Tela "Procurando Motorista"**
**Como** Passageiro  
**Quero** ver que estou aguardando motorista  
**Para** saber que minha solicitação foi enviada

**Componentes:**
```
├─ Loading animation (ícone de carro girando)
├─ Texto "Procurando motorista..."
├─ Tempo estimado de espera (2-5 min)
├─ Botão "Cancelar"
└─ Mapa (fundo, desfocado)
```

**Critérios de Aceitação:**
- [ ] Tela exibida após solicitar corrida
- [ ] Animation suave (spinner + ícone carro)
- [ ] Texto claro
- [ ] Botão cancelar funcional
- [ ] (Sprint futuro) WebSocket para atualizar status

**Tasks:**
```
├─ Criar screens/passenger/SearchingScreen.tsx
├─ Criar animation (Lottie ou CSS)
├─ Exibir tempo estimado
├─ Implementar botão cancelar
├─ (Placeholder) Timeout de 60s → volta para home
└─ Testes
```

**Estimativa:** 5 story points  
**Responsável:** Mobile Dev 2  
**Tempo:** 0.5 dia

---

### EPIC 6: Design & UX

#### **US-022: Design de Telas de Corrida**
**Como** Designer  
**Quero** criar telas de solicitação de corrida  
**Para** garantir UX fluida

**Entregas:**
```
├─ HomeScreen (mapa + botão)
├─ DestinationScreen (busca)
├─ EstimateScreen (preço + rota)
├─ SearchingScreen (loading)
└─ Componentes (PriceCard, SearchInput)
```

**Critérios de Aceitação:**
- [ ] Telas no Figma (high-fidelity)
- [ ] Fluxo completo navegável (protótipo)
- [ ] Componentes exportados (assets)
- [ ] Especificações (cores, espaçamentos)

**Tasks:**
```
├─ Wireframes (baixa fidelidade)
├─ High-fidelity screens (Figma)
├─ Protótipo interativo
├─ Exportar assets (ícones, ilustrações)
├─ Criar specs para devs
└─ Review com time
```

**Estimativa:** 8 story points  
**Responsável:** Designer  
**Tempo:** 2 dias

---

## 🧪 TESTES

### Backend
```
✅ Testes Unitários
├─ test_ride_crud.py
├─ test_pricing.py
├─ test_route_calculator.py (mock Google API)
└─ test_estimate_endpoint.py

✅ Testes de Integração
├─ test_estimate_flow.py (end-to-end)
├─ test_request_ride_flow.py
└─ test_google_maps_integration.py (real API, slow)

✅ Testes de Validação
├─ test_invalid_estimate_id.py
├─ test_passenger_active_ride.py
└─ test_expired_estimate.py
```

### Mobile
```
✅ Testes de Componentes
├─ Map.test.tsx
├─ PriceCard.test.tsx
└─ SearchInput.test.tsx

✅ Testes de Fluxo
├─ RequestRideFlow.test.tsx
└─ Navigation.test.tsx

✅ Testes Manuais (QA)
├─ iOS: Solicitar corrida (sucesso)
├─ Android: Solicitar corrida (sucesso)
├─ Testar com GPS real
└─ Testar erros (sem internet, GPS off)
```

---

## 📊 CRITÉRIOS DE ACEITAÇÃO DO SPRINT

### Must Have
- [x] Passageiro consegue ver mapa com sua localização
- [x] Passageiro consegue digitar destino
- [x] Passageiro vê preço estimado
- [x] Passageiro consegue solicitar corrida
- [x] Backend salva corrida (status SEARCHING)
- [x] Testes passando (cobertura ≥ 75%)

### Should Have
- [x] Rota traçada no mapa (polyline)
- [x] Breakdown de preço (detalhes)
- [x] Validações robustas (estimate expirado, etc)

### Could Have
- [ ] Google Places Autocomplete (pode ser mock)
- [ ] Animações suaves (transitions)
- [ ] Cache de rotas (Redis)

### Won't Have
- ❌ Matching de motorista (Sprint 3)
- ❌ WebSocket (Sprint 3)
- ❌ Histórico de destinos

---

## 🚧 RISCOS E MITIGAÇÕES

### Risco 1: Google Maps API Custos
**Probabilidade:** Média  
**Impacto:** Alto  
**Mitigação:**
- Configurar billing alert (R$ 100/dia)
- Cache agressivo (Redis, TTL 1h)
- Ambiente dev: usar coordenadas fixas (bypass API)
- Monitorar usage diariamente

### Risco 2: Permissões de Localização (iOS/Android)
**Probabilidade:** Alta  
**Impacto:** Médio  
**Mitigação:**
- Testar em dispositivos reais (não só simulador)
- Tratar recusa de permissão (mensagem clara)
- Fallback: usuário digita endereço

### Risco 3: Polyline não renderiza no mapa
**Probabilidade:** Média  
**Impacto:** Baixo  
**Mitigação:**
- Usar biblioteca testada (react-native-maps)
- Decode polyline corretamente
- Fallback: linha reta origem → destino

---

## 📅 CRONOGRAMA DETALHADO

### Segunda (Dia 1)
```
09:00-10:00: Sprint Planning
10:00-12:00: US-012 (Schema rides)
14:00-17:00: US-013 (Google Maps setup)
17:00-18:00: Code review
```

### Terça (Dia 2)
```
09:00-09:15: Daily
09:15-12:00: US-014 (Route calculator)
14:00-17:00: US-015 (Pricing)
17:00-18:00: Testes
```

### Quarta (Dia 3)
```
09:00-09:15: Daily
09:15-12:00: US-016 (Endpoint estimate)
14:00-17:00: US-017 (Endpoint request) - Parte 1
17:00-18:00: Code review
```

### Quinta (Dia 4)
```
09:00-09:15: Daily
09:15-12:00: US-017 (Endpoint request) - Parte 2
14:00-17:00: US-018 (Tela Home mapa)
17:00-18:00: Testes integração
```

### Sexta (Dia 5)
```
09:00-09:15: Daily
09:15-12:00: US-019 (Tela destino)
14:00-17:00: US-020 (Tela estimativa)
17:00-18:00: Testes
```

### Segunda (Dia 6)
```
09:00-09:15: Daily
09:15-12:00: US-021 (Tela searching)
14:00-17:00: Polimento UI
17:00-18:00: Testes QA
```

### Terça (Dia 7)
```
09:00-09:15: Daily
09:15-12:00: Fixes de bugs
14:00-17:00: Integração mobile ↔ backend
17:00-18:00: Testes end-to-end
```

### Quarta-Quinta (Dia 8-9)
```
Buffer: Ajustes finais, testes, polimento
```

### Sexta (Dia 10)
```
09:00-11:00: QA final
11:00-12:00: Deploy staging
14:00-15:00: Sprint Review
15:00-16:00: Retrospective
16:00-17:00: Planning Sprint 3
```

---

## 📈 MÉTRICAS DO SPRINT

### Velocity
```
Story Points Planejados: 97
Story Points Esperados: 85-95 (time já aquecido)
```

### Qualidade
```
Code Coverage: ≥ 75%
Bugs P0/P1: 0
Tech Debt: < 10%
```

---

## ✅ DEFINITION OF DONE

### Código
- [ ] Merged no main
- [ ] Code review (2 aprovações)
- [ ] CI/CD green
- [ ] Sem conflitos

### Testes
- [ ] Unitários passando
- [ ] Integração passando
- [ ] Coverage ≥ 75%
- [ ] Testado iOS + Android

### Deploy
- [ ] Staging funcionando
- [ ] Sem erros críticos
- [ ] Performance OK (< 500ms API)

### Demo
- [ ] Fluxo completo demonstrado
- [ ] Feedback stakeholders
- [ ] Retrospectiva realizada

---

## 🚀 PRÓXIMO SPRINT

**Sprint 3:** Matching + Accept  
**Objetivo:** Motorista recebe oferta e aceita corrida

---

**Status:** 🟢 PRONTO  
**Última atualização:** 16/12/2025
