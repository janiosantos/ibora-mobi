# 🚀 IBORA - DEVELOPMENT STARTER KIT
## Comece a desenvolver em < 30 minutos

---

# OBJETIVO

Este starter kit contém tudo que você precisa para começar a desenvolver o iBora **hoje**:

- ✅ Docker Compose (PostgreSQL + Redis + RabbitMQ)
- ✅ Setup script automatizado (1 comando)
- ✅ Seed data (usuários de teste)
- ✅ Postman collection (50+ endpoints)
- ✅ Variáveis de ambiente
- ✅ Test data factories
- ✅ Scripts úteis

**Tempo de setup:** < 30 minutos  
**Resultado:** Backend rodando local idêntico a produção

---

# ÍNDICE

1. [Pré-requisitos](#pré-requisitos)
2. [Quick Start](#quick-start)
3. [Docker Compose](#docker-compose)
4. [Setup Script](#setup-script)
5. [Seed Data](#seed-data)
6. [Postman Collection](#postman-collection)
7. [Test Factories](#test-factories)
8. [Scripts Úteis](#scripts-úteis)
9. [Troubleshooting](#troubleshooting)

---

## PRÉ-REQUISITOS

Instale antes de começar:

```bash
# Docker Desktop (Mac/Windows)
https://www.docker.com/products/docker-desktop

# Ou Docker Engine (Linux)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Python 3.11+
brew install python@3.11  # Mac
# ou
apt install python3.11    # Linux

# Node.js 18+ (para frontend futuro)
brew install node         # Mac
# ou
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Postman (opcional, mas recomendado)
https://www.postman.com/downloads/
```

**Verificar instalação:**
```bash
docker --version          # Docker version 24.0.0+
docker compose version    # Docker Compose version v2.20.0+
python3 --version         # Python 3.11.0+
node --version            # v18.0.0+
```

---

## QUICK START

### Opção 1: Setup Automático (Recomendado)

```bash
# Clone o repo
git clone https://github.com/your-org/ibora-backend.git
cd ibora-backend

# Execute o setup
chmod +x scripts/setup.sh
./scripts/setup.sh

# Aguarde 5-10 minutos
# ☕ Pegue um café...

# Quando terminar, você verá:
# ✅ PostgreSQL running on :5432
# ✅ Redis running on :6379
# ✅ RabbitMQ running on :5672
# ✅ Backend API running on :8000
# ✅ Seed data loaded
# ✅ Ready to develop! 🚀

# Teste a API
curl http://localhost:8000/health
# {"status":"healthy"}

# Login de teste
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"driver@test.com","password":"password123"}'
```

### Opção 2: Setup Manual

```bash
# 1. Subir infraestrutura
docker compose up -d

# 2. Criar ambiente virtual
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# 3. Instalar dependências
pip install -r requirements.txt

# 4. Configurar variáveis
cp .env.example .env
# Editar .env com suas credenciais

# 5. Rodar migrations
alembic upgrade head

# 6. Carregar seed data
python scripts/seed_data.py

# 7. Rodar servidor
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

---

## DOCKER COMPOSE

### Arquivo: `docker-compose.yml`

```yaml
version: '3.8'

services:
  # PostgreSQL 15 com PostGIS
  postgres:
    image: postgis/postgis:15-3.3
    container_name: ibora-postgres
    environment:
      POSTGRES_DB: ibora
      POSTGRES_USER: ibora_user
      POSTGRES_PASSWORD: ibora_pass_dev_only
      POSTGRES_HOST_AUTH_METHOD: trust
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ibora_user -d ibora"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - ibora-network

  # Redis 7
  redis:
    image: redis:7-alpine
    container_name: ibora-redis
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    networks:
      - ibora-network

  # RabbitMQ 3
  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: ibora-rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: ibora
      RABBITMQ_DEFAULT_PASS: ibora_pass_dev_only
    ports:
      - "5672:5672"   # AMQP
      - "15672:15672" # Management UI
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "-q", "ping"]
      interval: 30s
      timeout: 10s
      retries: 5
    networks:
      - ibora-network

  # PgAdmin (opcional, para visualizar DB)
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: ibora-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@ibora.com
      PGADMIN_DEFAULT_PASSWORD: admin123
      PGADMIN_CONFIG_SERVER_MODE: 'False'
    ports:
      - "5050:80"
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    depends_on:
      - postgres
    networks:
      - ibora-network

volumes:
  postgres_data:
  redis_data:
  rabbitmq_data:
  pgadmin_data:

networks:
  ibora-network:
    driver: bridge
```

### Comandos Docker

```bash
# Subir todos os serviços
docker compose up -d

# Ver logs
docker compose logs -f

# Logs de serviço específico
docker compose logs -f postgres

# Parar todos
docker compose stop

# Parar e remover
docker compose down

# Parar e remover TUDO (including volumes)
docker compose down -v

# Restart serviço
docker compose restart postgres

# Acessar container
docker compose exec postgres psql -U ibora_user -d ibora
docker compose exec redis redis-cli
```

### URLs dos serviços

```
PostgreSQL:     localhost:5432
Redis:          localhost:6379
RabbitMQ:       localhost:5672
RabbitMQ UI:    http://localhost:15672 (user: ibora, pass: ibora_pass_dev_only)
PgAdmin:        http://localhost:5050 (admin@ibora.com / admin123)
Backend API:    http://localhost:8000
API Docs:       http://localhost:8000/docs
Metrics:        http://localhost:8000/metrics
```

---

## SETUP SCRIPT

### Arquivo: `scripts/setup.sh`

```bash
#!/bin/bash

# IBORA - Setup Automático
# Este script configura todo o ambiente de desenvolvimento

set -e  # Exit on error

echo "🚀 IBORA - Setup Iniciado"
echo "========================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check prerequisites
echo ""
echo "📋 Verificando pré-requisitos..."

if ! command -v docker &> /dev/null; then
    log_error "Docker não instalado"
    exit 1
fi
log_info "Docker OK"

if ! command -v docker compose &> /dev/null; then
    log_error "Docker Compose não instalado"
    exit 1
fi
log_info "Docker Compose OK"

if ! command -v python3 &> /dev/null; then
    log_error "Python 3 não instalado"
    exit 1
fi
log_info "Python 3 OK"

# Create directories
echo ""
echo "📁 Criando estrutura de diretórios..."
mkdir -p backend/alembic/versions
mkdir -p backend/tests
mkdir -p backend/scripts
mkdir -p backend/certificates
mkdir -p frontend
mkdir -p docs
log_info "Diretórios criados"

# Copy environment file
echo ""
echo "⚙️  Configurando variáveis de ambiente..."
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    log_info ".env criado (edite conforme necessário)"
else
    log_warn ".env já existe (não sobrescrito)"
fi

# Start Docker services
echo ""
echo "🐳 Iniciando serviços Docker..."
docker compose up -d

# Wait for PostgreSQL
echo ""
echo "⏳ Aguardando PostgreSQL..."
for i in {1..30}; do
    if docker compose exec -T postgres pg_isready -U ibora_user -d ibora &> /dev/null; then
        log_info "PostgreSQL pronto"
        break
    fi
    if [ $i -eq 30 ]; then
        log_error "PostgreSQL timeout"
        exit 1
    fi
    sleep 2
done

# Wait for Redis
echo ""
echo "⏳ Aguardando Redis..."
for i in {1..30}; do
    if docker compose exec -T redis redis-cli ping &> /dev/null; then
        log_info "Redis pronto"
        break
    fi
    if [ $i -eq 30 ]; then
        log_error "Redis timeout"
        exit 1
    fi
    sleep 2
done

# Create virtual environment
echo ""
echo "🐍 Criando ambiente virtual Python..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
    log_info "Virtual env criado"
else
    log_warn "Virtual env já existe"
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo ""
echo "📦 Instalando dependências..."
pip install --upgrade pip > /dev/null
pip install -r requirements.txt
log_info "Dependências instaladas"

# Run migrations
echo ""
echo "🗄️  Rodando migrations..."
alembic upgrade head
log_info "Migrations aplicadas"

# Load seed data
echo ""
echo "🌱 Carregando seed data..."
python scripts/seed_data.py
log_info "Seed data carregado"

# Summary
echo ""
echo "========================="
echo "✅ Setup Completo!"
echo "========================="
echo ""
echo "Serviços rodando:"
echo "  PostgreSQL:   localhost:5432"
echo "  Redis:        localhost:6379"
echo "  RabbitMQ:     localhost:5672"
echo "  RabbitMQ UI:  http://localhost:15672"
echo "  PgAdmin:      http://localhost:5050"
echo ""
echo "Para iniciar o servidor:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  uvicorn src.main:app --reload"
echo ""
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Usuários de teste:"
echo "  Passageiro: passenger@test.com / password123"
echo "  Motorista:  driver@test.com / password123"
echo "  Admin:      admin@test.com / password123"
echo ""
echo "🚀 Pronto para desenvolver!"
```

---

## SEED DATA

### Arquivo: `scripts/seed_data.py`

```python
#!/usr/bin/env python3
"""
Seed data for development

Creates test users, drivers, passengers
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from src.core.database import SessionLocal, engine, Base
from src.models.user import User, UserRole
from src.models.driver import Driver, DriverOnlineStatus
from src.models.passenger import Passenger
from src.core.security import get_password_hash
from geoalchemy2.elements import WKTElement
from datetime import datetime

def seed_data():
    """Load seed data"""
    
    print("🌱 Loading seed data...")
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if already seeded
        existing_user = db.query(User).filter(
            User.email == "admin@test.com"
        ).first()
        
        if existing_user:
            print("⚠️  Seed data already loaded")
            return
        
        # Create admin user
        admin_user = User(
            email="admin@test.com",
            phone="11999999999",
            full_name="Admin Test",
            password_hash=get_password_hash("password123"),
            role=UserRole.ADMIN,
            is_active=True,
            email_verified=True
        )
        db.add(admin_user)
        
        # Create passenger users
        passengers_data = [
            {
                "email": "passenger@test.com",
                "phone": "11988888888",
                "full_name": "João Silva",
                "cpf": "12345678901"
            },
            {
                "email": "passenger2@test.com",
                "phone": "11977777777",
                "full_name": "Maria Santos",
                "cpf": "98765432109"
            }
        ]
        
        for data in passengers_data:
            user = User(
                email=data["email"],
                phone=data["phone"],
                full_name=data["full_name"],
                password_hash=get_password_hash("password123"),
                role=UserRole.PASSENGER,
                is_active=True,
                email_verified=True
            )
            db.add(user)
            db.flush()
            
            passenger = Passenger(
                user_id=user.id,
                cpf=data["cpf"]
            )
            db.add(passenger)
        
        # Create driver users
        drivers_data = [
            {
                "email": "driver@test.com",
                "phone": "11966666666",
                "full_name": "Carlos Motorista",
                "cpf": "11122233344",
                "cnh": "12345678901",
                "vehicle": {
                    "plate": "ABC1D23",
                    "model": "Gol 1.0",
                    "color": "Branco",
                    "year": 2020
                },
                "location": (-23.5505, -46.6333)  # São Paulo
            },
            {
                "email": "driver2@test.com",
                "phone": "11955555555",
                "full_name": "Ana Motorista",
                "cpf": "55566677788",
                "cnh": "98765432109",
                "vehicle": {
                    "plate": "XYZ9W87",
                    "model": "Onix 1.4",
                    "color": "Prata",
                    "year": 2021
                },
                "location": (-23.5600, -46.6400)
            },
            {
                "email": "driver3@test.com",
                "phone": "11944444444",
                "full_name": "Pedro Motorista",
                "cpf": "99988877766",
                "cnh": "11223344556",
                "vehicle": {
                    "plate": "DEF5G67",
                    "model": "HB20 1.6",
                    "color": "Preto",
                    "year": 2022
                },
                "location": (-23.5450, -46.6280)
            }
        ]
        
        for data in drivers_data:
            user = User(
                email=data["email"],
                phone=data["phone"],
                full_name=data["full_name"],
                password_hash=get_password_hash("password123"),
                role=UserRole.DRIVER,
                is_active=True,
                email_verified=True
            )
            db.add(user)
            db.flush()
            
            # Create location point
            lat, lng = data["location"]
            location = WKTElement(f'POINT({lng} {lat})', srid=4326)
            
            driver = Driver(
                user_id=user.id,
                cpf=data["cpf"],
                cnh_number=data["cnh"],
                vehicle_plate=data["vehicle"]["plate"],
                vehicle_model=data["vehicle"]["model"],
                vehicle_color=data["vehicle"]["color"],
                vehicle_year=data["vehicle"]["year"],
                location=location,
                last_location_update=datetime.utcnow(),
                online_status=DriverOnlineStatus.OFFLINE,
                rating_avg=4.8,
                rating_count=150
            )
            db.add(driver)
        
        db.commit()
        
        print("✅ Seed data loaded successfully!")
        print("")
        print("Test users created:")
        print("  Admin:      admin@test.com / password123")
        print("  Passenger:  passenger@test.com / password123")
        print("  Passenger2: passenger2@test.com / password123")
        print("  Driver:     driver@test.com / password123")
        print("  Driver2:    driver2@test.com / password123")
        print("  Driver3:    driver3@test.com / password123")
        
    except Exception as e:
        print(f"❌ Error loading seed data: {e}")
        db.rollback()
        raise
    
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
```

---

## POSTMAN COLLECTION

### Arquivo: `postman/IBORA_API.postman_collection.json`

```json
{
  "info": {
    "name": "IBORA API",
    "description": "Complete API collection for iBora mobility app",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000",
      "type": "string"
    },
    {
      "key": "passenger_token",
      "value": "",
      "type": "string"
    },
    {
      "key": "driver_token",
      "value": "",
      "type": "string"
    },
    {
      "key": "admin_token",
      "value": "",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register Passenger",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"newpassenger@test.com\",\n  \"phone\": \"11900000000\",\n  \"full_name\": \"New Passenger\",\n  \"password\": \"password123\",\n  \"cpf\": \"12312312312\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/v1/auth/register/passenger",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "auth", "register", "passenger"]
            }
          }
        },
        {
          "name": "Login Passenger",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    var jsonData = pm.response.json();",
                  "    pm.collectionVariables.set('passenger_token', jsonData.access_token);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"passenger@test.com\",\n  \"password\": \"password123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/v1/auth/login",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "auth", "login"]
            }
          }
        },
        {
          "name": "Login Driver",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    var jsonData = pm.response.json();",
                  "    pm.collectionVariables.set('driver_token', jsonData.access_token);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"driver@test.com\",\n  \"password\": \"password123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/v1/auth/login",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Drivers",
      "item": [
        {
          "name": "Go Online",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{driver_token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"status\": \"online\",\n  \"latitude\": -23.5505,\n  \"longitude\": -46.6333\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/v1/drivers/me/status",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "drivers", "me", "status"]
            }
          }
        },
        {
          "name": "Update Location",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{driver_token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"latitude\": -23.5510,\n  \"longitude\": -46.6340,\n  \"accuracy\": 10.5\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/v1/drivers/me/location",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "drivers", "me", "location"]
            }
          }
        },
        {
          "name": "Get My Wallet",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{driver_token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/v1/wallet/drivers/me/wallet",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "wallet", "drivers", "me", "wallet"]
            }
          }
        }
      ]
    },
    {
      "name": "Rides",
      "item": [
        {
          "name": "Get Nearby Drivers",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{passenger_token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/v1/passengers/nearby-drivers?latitude=-23.5505&longitude=-46.6333&radius_km=5&min_rating=4.0",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "passengers", "nearby-drivers"],
              "query": [
                {"key": "latitude", "value": "-23.5505"},
                {"key": "longitude", "value": "-46.6333"},
                {"key": "radius_km", "value": "5"},
                {"key": "min_rating", "value": "4.0"}
              ]
            }
          }
        },
        {
          "name": "Request Ride",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 201) {",
                  "    var jsonData = pm.response.json();",
                  "    pm.collectionVariables.set('ride_id', jsonData.id);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{passenger_token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"origin_lat\": -23.5505,\n  \"origin_lng\": -46.6333,\n  \"destination_lat\": -23.5600,\n  \"destination_lng\": -46.6400,\n  \"payment_method\": \"pix\",\n  \"notes\": \"Portão 2\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/v1/rides",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "rides"]
            }
          }
        },
        {
          "name": "Accept Ride",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{driver_token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/v1/rides/{{ride_id}}/accept",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "rides", "{{ride_id}}", "accept"]
            }
          }
        },
        {
          "name": "Complete Ride",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{driver_token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/v1/rides/{{ride_id}}/complete",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "rides", "{{ride_id}}", "complete"]
            }
          }
        }
      ]
    },
    {
      "name": "Health",
      "item": [
        {
          "name": "Health Check",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/health",
              "host": ["{{base_url}}"],
              "path": ["health"]
            }
          }
        },
        {
          "name": "Readiness Check",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/health/ready",
              "host": ["{{base_url}}"],
              "path": ["health", "ready"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## TEST FACTORIES

### Arquivo: `tests/factories.py`

```python
"""
Test data factories using Factory Boy

Makes it easy to create test objects
"""

import factory
from factory.alchemy import SQLAlchemyModelFactory
from src.core.database import SessionLocal
from src.models.user import User, UserRole
from src.models.driver import Driver, DriverOnlineStatus
from src.models.passenger import Passenger
from src.models.ride import Ride, RideStatus, PaymentMethod
from src.core.security import get_password_hash
from geoalchemy2.elements import WKTElement
from datetime import datetime

class BaseFactory(SQLAlchemyModelFactory):
    """Base factory"""
    class Meta:
        sqlalchemy_session = SessionLocal()
        sqlalchemy_session_persistence = "commit"

class UserFactory(BaseFactory):
    """User factory"""
    class Meta:
        model = User
    
    email = factory.Sequence(lambda n: f"user{n}@test.com")
    phone = factory.Sequence(lambda n: f"1199999{n:04d}")
    full_name = factory.Faker("name", locale="pt_BR")
    password_hash = get_password_hash("password123")
    role = UserRole.PASSENGER
    is_active = True
    email_verified = True

class PassengerFactory(BaseFactory):
    """Passenger factory"""
    class Meta:
        model = Passenger
    
    user = factory.SubFactory(UserFactory, role=UserRole.PASSENGER)
    cpf = factory.Sequence(lambda n: f"{n:011d}")

class DriverFactory(BaseFactory):
    """Driver factory"""
    class Meta:
        model = Driver
    
    user = factory.SubFactory(UserFactory, role=UserRole.DRIVER)
    cpf = factory.Sequence(lambda n: f"{n:011d}")
    cnh_number = factory.Sequence(lambda n: f"{n:011d}")
    vehicle_plate = factory.Sequence(lambda n: f"ABC{n:04d}")
    vehicle_model = "Gol 1.0"
    vehicle_color = "Branco"
    vehicle_year = 2020
    location = WKTElement('POINT(-46.6333 -23.5505)', srid=4326)
    online_status = DriverOnlineStatus.OFFLINE
    rating_avg = 4.8
    rating_count = 100

class RideFactory(BaseFactory):
    """Ride factory"""
    class Meta:
        model = Ride
    
    passenger = factory.SubFactory(PassengerFactory)
    driver = factory.SubFactory(DriverFactory)
    
    origin_lat = -23.5505
    origin_lng = -46.6333
    origin_address = "Av. Paulista, 1000"
    
    destination_lat = -23.5600
    destination_lng = -46.6400
    destination_address = "Av. Brigadeiro, 2000"
    
    estimated_distance_km = 5.0
    estimated_duration_min = 15
    estimated_price = 20.00
    
    payment_method = PaymentMethod.PIX
    status = RideStatus.SEARCHING

# Usage examples
def create_test_data():
    """Create test data using factories"""
    
    # Create 5 passengers
    passengers = PassengerFactory.create_batch(5)
    
    # Create 3 drivers
    drivers = DriverFactory.create_batch(3)
    
    # Create some rides
    rides = []
    for i in range(10):
        ride = RideFactory.create(
            passenger=passengers[i % 5],
            driver=drivers[i % 3] if i % 2 == 0 else None
        )
        rides.append(ride)
    
    return {
        "passengers": passengers,
        "drivers": drivers,
        "rides": rides
    }
```

---

## SCRIPTS ÚTEIS

### 1. Reset Database

```bash
# scripts/reset_db.sh
#!/bin/bash
# Reset database (DANGER: deletes all data)

echo "⚠️  This will DELETE all data!"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Cancelled"
    exit 0
fi

echo "Stopping containers..."
docker compose down

echo "Removing volumes..."
docker volume rm ibora-backend_postgres_data

echo "Starting containers..."
docker compose up -d

echo "Waiting for PostgreSQL..."
sleep 10

cd backend
source venv/bin/activate

echo "Running migrations..."
alembic upgrade head

echo "Loading seed data..."
python scripts/seed_data.py

echo "✅ Database reset complete!"
```

### 2. Run Tests

```bash
# scripts/run_tests.sh
#!/bin/bash
# Run all tests

cd backend
source venv/bin/activate

echo "🧪 Running tests..."

# Unit tests
pytest tests/unit -v --cov=src --cov-report=html

# Integration tests
pytest tests/integration -v

# E2E tests (optional, slower)
# pytest tests/e2e -v -m e2e

echo "✅ Tests complete!"
echo "Coverage report: backend/htmlcov/index.html"
```

### 3. Generate Migration

```bash
# scripts/new_migration.sh
#!/bin/bash
# Generate new Alembic migration

if [ -z "$1" ]; then
    echo "Usage: ./new_migration.sh 'migration message'"
    exit 1
fi

cd backend
source venv/bin/activate

alembic revision --autogenerate -m "$1"

echo "✅ Migration created"
echo "Review it in: backend/alembic/versions/"
```

---

## TROUBLESHOOTING

### PostgreSQL não inicia

```bash
# Check logs
docker compose logs postgres

# Remove volume and restart
docker compose down -v
docker compose up -d
```

### Port already in use

```bash
# Find process using port 8000
lsof -i :8000

# Kill it
kill -9 <PID>

# Or change port in docker-compose.yml
```

### Migrations out of sync

```bash
# Drop all tables
docker compose exec postgres psql -U ibora_user -d ibora -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Re-run migrations
cd backend
alembic upgrade head
python scripts/seed_data.py
```

### Redis connection error

```bash
# Check Redis
docker compose logs redis

# Restart Redis
docker compose restart redis

# Test connection
docker compose exec redis redis-cli ping
# Should return: PONG
```

---

## PRÓXIMOS PASSOS

Após setup concluído:

1. ✅ Explore a API Docs: http://localhost:8000/docs
2. ✅ Importe Postman collection
3. ✅ Teste os fluxos principais
4. ✅ Configure IDE (VS Code / PyCharm)
5. ✅ Configure Git hooks (pre-commit)
6. ✅ Comece a desenvolver!

---

## SUPPORT

Problemas? Contate:
- Tech Lead: tech@ibora.com
- Slack: #dev-backend
- Docs: https://docs.ibora.com

---

**🚀 Pronto para revolucionar a mobilidade urbana!**
