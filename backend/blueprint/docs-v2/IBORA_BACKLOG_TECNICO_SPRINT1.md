# 🎫 IBORA: BACKLOG TÉCNICO GRANULAR
## Sprints 1-3 - Tarefas Executáveis (Formato Jira)

---

## 📋 COMO USAR ESTE DOCUMENTO

Este documento contém **tasks técnicas granulares** prontas para serem:
- Importadas no Jira/Linear/Asana
- Atribuídas ao time
- Estimadas em story points
- Executadas

**Formato de cada task:**
```
[TIPO] Título da Task
Responsável sugerido | Estimativa | Prioridade
Descrição técnica
Critérios de aceite
Dependências
```

---

# SPRINT 1: AUTH & USER MANAGEMENT
**Duração:** 2 semanas  
**Objetivo:** Sistema de autenticação e cadastro funcionando  
**Team:** 5 pessoas  
**Velocity target:** 40 SP

---

## EPIC 1.1: SETUP PROJETO (13 SP)

### [SETUP] Estruturar Monorepo
**Responsável:** Tech Lead | **Estimativa:** 3 SP | **Prioridade:** P0

**Descrição:**
Criar estrutura de pastas do monorepo seguindo boas práticas.

**Tasks:**
```bash
# Estrutura a criar
ibora/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── auth/
│   │   │   │   ├── users/
│   │   │   │   ├── drivers/
│   │   │   │   └── rides/
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   ├── tests/
│   ├── alembic/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend-driver/
│   ├── src/
│   ├── app.json
│   └── package.json
├── frontend-passenger/
├── docs/
├── .github/
│   └── workflows/
├── docker-compose.yml
└── README.md
```

**Critérios de Aceite:**
- [ ] Estrutura de pastas criada
- [ ] README.md com instruções de setup
- [ ] .gitignore configurado
- [ ] pyproject.toml ou setup.py configurado

**Dependências:** Nenhuma

---

### [SETUP] Configurar FastAPI Base
**Responsável:** Backend Dev 1 | **Estimativa:** 3 SP | **Prioridade:** P0

**Descrição:**
Setup inicial do FastAPI com configurações base.

**Código:**
```python
# backend/src/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings
from src.api.v1 import auth, users, drivers

app = FastAPI(
    title="iBora API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(drivers.router, prefix="/api/v1/drivers", tags=["drivers"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

**Critérios de Aceite:**
- [ ] FastAPI inicializa sem erros
- [ ] Endpoint /health retorna 200
- [ ] CORS configurado
- [ ] Docs em /docs acessível
- [ ] Hot reload funcionando

**Dependências:** Estruturar Monorepo

---

### [SETUP] Configurar PostgreSQL + SQLAlchemy
**Responsável:** Backend Dev 1 | **Estimativa:** 5 SP | **Prioridade:** P0

**Descrição:**
Setup database connection, models base e migrations.

**Código:**
```python
# backend/src/core/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from src.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    echo=settings.DEBUG
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

```python
# backend/src/models/base.py
from datetime import datetime
from sqlalchemy import Column, DateTime
from src.core.database import Base

class TimestampMixin:
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

**Alembic setup:**
```bash
cd backend
alembic init alembic
# Editar alembic.ini com DATABASE_URL
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

**Critérios de Aceite:**
- [ ] Conexão com PostgreSQL funciona
- [ ] Alembic configurado
- [ ] Migration inicial criada
- [ ] get_db() dependency funciona
- [ ] Testes de conexão passam

**Dependências:** Configurar FastAPI Base

---

### [SETUP] CI/CD Pipeline (GitHub Actions)
**Responsável:** Tech Lead | **Estimativa:** 2 SP | **Prioridade:** P1

**Descrição:**
Pipeline básico de CI com lint, tests e build.

**Código:**
```yaml
# .github/workflows/backend-ci.yml
name: Backend CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: ibora_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
          pip install pytest pytest-cov black flake8
      
      - name: Lint
        run: |
          cd backend
          black --check .
          flake8 .
      
      - name: Run tests
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost/ibora_test
        run: |
          cd backend
          pytest --cov=src --cov-report=xml
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage.xml
```

**Critérios de Aceite:**
- [ ] Pipeline roda em PRs
- [ ] Lint (black, flake8) funciona
- [ ] Tests rodam
- [ ] Coverage report gerado
- [ ] Badge no README

**Dependências:** Estruturar Monorepo

---

## EPIC 1.2: MODELOS DE DADOS (8 SP)

### [BACKEND] Criar Models: User, Driver, Passenger
**Responsável:** Backend Dev 2 | **Estimativa:** 5 SP | **Prioridade:** P0

**Descrição:**
Implementar models do domínio central.

**Código:**
```python
# backend/src/models/user.py
from sqlalchemy import Column, Integer, String, Enum, Boolean
from sqlalchemy.orm import relationship
from src.models.base import TimestampMixin
from src.core.database import Base
import enum

class UserType(str, enum.Enum):
    DRIVER = "driver"
    PASSENGER = "passenger"
    ADMIN = "admin"

class User(Base, TimestampMixin):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=True)
    full_name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    user_type = Column(Enum(UserType), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Relationships
    driver = relationship("Driver", back_populates="user", uselist=False)
    passenger = relationship("Passenger", back_populates="user", uselist=False)
```

```python
# backend/src/models/driver.py
from sqlalchemy import Column, Integer, String, Float, Enum, ForeignKey
from sqlalchemy.orm import relationship
from src.models.base import TimestampMixin
from src.core.database import Base
import enum

class DriverStatus(str, enum.Enum):
    PENDING_APPROVAL = "pending_approval"
    ACTIVE = "active"
    SUSPENDED = "suspended"
    REJECTED = "rejected"

class Driver(Base, TimestampMixin):
    __tablename__ = "drivers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Documents
    cpf = Column(String(11), unique=True, nullable=False)
    cnh_number = Column(String(20), nullable=False)
    cnh_front_url = Column(String(500))
    cnh_back_url = Column(String(500))
    
    # Vehicle
    vehicle_plate = Column(String(10), nullable=False)
    vehicle_model = Column(String(100), nullable=False)
    vehicle_year = Column(Integer, nullable=False)
    vehicle_color = Column(String(50), nullable=False)
    crlv_url = Column(String(500))
    
    # Status
    status = Column(Enum(DriverStatus), default=DriverStatus.PENDING_APPROVAL)
    rating_avg = Column(Float, default=5.0)
    rating_count = Column(Integer, default=0)
    
    # Relationships
    user = relationship("User", back_populates="driver")
    rides = relationship("Ride", back_populates="driver")
```

```python
# backend/src/models/passenger.py
from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from src.models.base import TimestampMixin
from src.core.database import Base

class Passenger(Base, TimestampMixin):
    __tablename__ = "passengers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    rating_avg = Column(Float, default=5.0)
    rating_count = Column(Integer, default=0)
    
    # Relationships
    user = relationship("User", back_populates="passenger")
    rides = relationship("Ride", back_populates="passenger")
```

**Migration:**
```bash
alembic revision --autogenerate -m "Add user driver passenger models"
alembic upgrade head
```

**Critérios de Aceite:**
- [ ] Models criados sem erros
- [ ] Migration gerada e aplicada
- [ ] Relacionamentos funcionam
- [ ] Constraints (unique, FK) validam
- [ ] Tests unitários passam

**Dependências:** Configurar PostgreSQL + SQLAlchemy

---

### [BACKEND] Criar Schemas (Pydantic)
**Responsável:** Backend Dev 2 | **Estimativa:** 3 SP | **Prioridade:** P0

**Descrição:**
Schemas de request/response com validação.

**Código:**
```python
# backend/src/schemas/user.py
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from src.models.user import UserType

class UserBase(BaseModel):
    phone: str
    email: Optional[EmailStr] = None
    full_name: str
    
    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v):
        # Validar formato brasileiro: +5511999999999
        import re
        if not re.match(r'^\+55\d{11}$', v):
            raise ValueError('Phone must be +55XXXXXXXXXXX')
        return v

class UserCreate(UserBase):
    password: str
    user_type: UserType

class UserResponse(UserBase):
    id: int
    user_type: UserType
    is_active: bool
    is_verified: bool
    
    class Config:
        from_attributes = True
```

```python
# backend/src/schemas/driver.py
from pydantic import BaseModel, field_validator
from src.models.driver import DriverStatus

class DriverCreate(BaseModel):
    cpf: str
    cnh_number: str
    vehicle_plate: str
    vehicle_model: str
    vehicle_year: int
    vehicle_color: str
    
    @field_validator('cpf')
    @classmethod
    def validate_cpf(cls, v):
        # Validar CPF (11 dígitos)
        if len(v) != 11 or not v.isdigit():
            raise ValueError('CPF must be 11 digits')
        return v
    
    @field_validator('vehicle_year')
    @classmethod
    def validate_year(cls, v):
        from datetime import datetime
        current_year = datetime.now().year
        if v < 2010 or v > current_year + 1:
            raise ValueError(f'Vehicle year must be between 2010 and {current_year}')
        return v

class DriverResponse(BaseModel):
    id: int
    user_id: int
    cpf: str
    vehicle_plate: str
    vehicle_model: str
    status: DriverStatus
    rating_avg: float
    
    class Config:
        from_attributes = True
```

**Critérios de Aceite:**
- [ ] Schemas validam corretamente
- [ ] Validadores customizados funcionam
- [ ] Erros de validação são claros
- [ ] Response models serializan OK
- [ ] Docs Swagger mostram schemas

**Dependências:** Criar Models

---

## EPIC 1.3: AUTENTICAÇÃO JWT (13 SP)

### [BACKEND] Implementar JWT Authentication
**Responsável:** Backend Dev 1 | **Estimativa:** 5 SP | **Prioridade:** P0

**Descrição:**
Sistema de autenticação com JWT tokens.

**Código:**
```python
# backend/src/core/security.py
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from src.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=7)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    payload = decode_access_token(token)
    user_id: int = payload.get("sub")
    
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    
    return user
```

**Critérios de Aceite:**
- [ ] Hash de senha funciona (bcrypt)
- [ ] JWT gerado e validado corretamente
- [ ] Token expira após 7 dias
- [ ] get_current_user dependency funciona
- [ ] Testes de auth passam

**Dependências:** Criar Models

---

### [BACKEND] Endpoint: POST /auth/register
**Responsável:** Backend Dev 1 | **Estimativa:** 3 SP | **Prioridade:** P0

**Descrição:**
Endpoint de registro de usuário.

**Código:**
```python
# backend/src/api/v1/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.core.database import get_db
from src.core.security import hash_password, create_access_token
from src.models.user import User
from src.schemas.user import UserCreate, UserResponse
from src.schemas.auth import TokenResponse

router = APIRouter()

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(
        (User.phone == user_data.phone) | (User.email == user_data.email)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Phone or email already registered"
        )
    
    # Create user
    user = User(
        phone=user_data.phone,
        email=user_data.email,
        full_name=user_data.full_name,
        password_hash=hash_password(user_data.password),
        user_type=user_data.user_type,
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }
```

**Testes:**
```python
# backend/tests/test_auth.py
def test_register_success(client):
    response = client.post("/api/v1/auth/register", json={
        "phone": "+5511999999999",
        "email": "test@ibora.com",
        "full_name": "Test User",
        "password": "securepass123",
        "user_type": "passenger"
    })
    
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["phone"] == "+5511999999999"

def test_register_duplicate_phone(client, db_user):
    response = client.post("/api/v1/auth/register", json={
        "phone": db_user.phone,
        "email": "another@ibora.com",
        "full_name": "Test User",
        "password": "pass123",
        "user_type": "passenger"
    })
    
    assert response.status_code == 409
```

**Critérios de Aceite:**
- [ ] Registra usuário corretamente
- [ ] Retorna JWT válido
- [ ] Valida phone/email duplicado (409)
- [ ] Hash senha antes de salvar
- [ ] Testes passam

**Dependências:** Implementar JWT Authentication

---

### [BACKEND] Endpoint: POST /auth/login
**Responsável:** Backend Dev 1 | **Estimativa:** 3 SP | **Prioridade:** P0

**Descrição:**
Endpoint de login.

**Código:**
```python
@router.post("/login", response_model=TokenResponse)
async def login(phone: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == phone).first()
    
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect phone or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }
```

**Critérios de Aceite:**
- [ ] Login com phone + password funciona
- [ ] Retorna JWT válido
- [ ] Valida credenciais incorretas (401)
- [ ] Bloqueia usuário inativo (403)
- [ ] Testes passam

**Dependências:** Implementar JWT Authentication

---

### [BACKEND] SMS Verification (Twilio)
**Responsável:** Backend Dev 2 | **Estimativa:** 2 SP | **Prioridade:** P1

**Descrição:**
Integração Twilio para verificação de telefone.

**Código:**
```python
# backend/src/services/sms.py
from twilio.rest import Client
from src.core.config import settings
import random

client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

def generate_verification_code() -> str:
    return str(random.randint(100000, 999999))

def send_verification_sms(phone: str, code: str):
    message = client.messages.create(
        body=f"Seu código de verificação iBora: {code}",
        from_=settings.TWILIO_PHONE_NUMBER,
        to=phone
    )
    return message.sid
```

```python
# backend/src/api/v1/auth.py
@router.post("/send-verification")
async def send_verification(phone: str, db: Session = Depends(get_db)):
    code = generate_verification_code()
    
    # Save code to Redis with 10min expiry
    redis_client.setex(f"verification:{phone}", 600, code)
    
    # Send SMS
    send_verification_sms(phone, code)
    
    return {"message": "Verification code sent"}

@router.post("/verify-phone")
async def verify_phone(phone: str, code: str, db: Session = Depends(get_db)):
    stored_code = redis_client.get(f"verification:{phone}")
    
    if not stored_code or stored_code.decode() != code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code"
        )
    
    # Mark user as verified
    user = db.query(User).filter(User.phone == phone).first()
    if user:
        user.is_verified = True
        db.commit()
    
    redis_client.delete(f"verification:{phone}")
    
    return {"message": "Phone verified successfully"}
```

**Critérios de Aceite:**
- [ ] SMS enviado via Twilio
- [ ] Código armazenado no Redis (10min)
- [ ] Verificação valida código
- [ ] User marcado como verified
- [ ] Testes mockando Twilio

**Dependências:** Implementar JWT Authentication

---

## EPIC 1.4: CADASTRO MOTORISTA (6 SP)

### [BACKEND] Endpoint: POST /drivers/profile
**Responsável:** Backend Dev 2 | **Estimativa:** 3 SP | **Prioridade:** P0

**Descrição:**
Completar perfil de motorista com documentos.

**Código:**
```python
# backend/src/api/v1/drivers.py
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from src.core.security import get_current_user
from src.services.storage import upload_file_to_s3

router = APIRouter()

@router.post("/profile", response_model=DriverResponse)
async def create_driver_profile(
    driver_data: DriverCreate,
    cnh_front: UploadFile = File(...),
    cnh_back: UploadFile = File(...),
    crlv: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if already driver
    if current_user.user_type != "driver":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not registered as driver"
        )
    
    existing_driver = db.query(Driver).filter(Driver.user_id == current_user.id).first()
    if existing_driver:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Driver profile already exists"
        )
    
    # Upload documents to S3
    cnh_front_url = await upload_file_to_s3(cnh_front, f"drivers/{current_user.id}/cnh_front")
    cnh_back_url = await upload_file_to_s3(cnh_back, f"drivers/{current_user.id}/cnh_back")
    crlv_url = await upload_file_to_s3(crlv, f"drivers/{current_user.id}/crlv")
    
    # Create driver
    driver = Driver(
        user_id=current_user.id,
        cpf=driver_data.cpf,
        cnh_number=driver_data.cnh_number,
        cnh_front_url=cnh_front_url,
        cnh_back_url=cnh_back_url,
        vehicle_plate=driver_data.vehicle_plate,
        vehicle_model=driver_data.vehicle_model,
        vehicle_year=driver_data.vehicle_year,
        vehicle_color=driver_data.vehicle_color,
        crlv_url=crlv_url,
        status=DriverStatus.PENDING_APPROVAL
    )
    
    db.add(driver)
    db.commit()
    db.refresh(driver)
    
    # Send notification to admin
    # TODO: implement notification service
    
    return driver
```

**Critérios de Aceite:**
- [ ] Upload de 3 documentos funciona
- [ ] Arquivos salvos no S3
- [ ] Driver criado com status PENDING
- [ ] Valida usuário é tipo DRIVER
- [ ] Previne duplicação

**Dependências:** Criar Models, JWT Auth

---

### [BACKEND] S3 Upload Service
**Responsável:** Backend Dev 2 | **Estimativa:** 3 SP | **Prioridade:** P0

**Descrição:**
Serviço de upload para S3.

**Código:**
```python
# backend/src/services/storage.py
import boto3
from fastapi import UploadFile
from src.core.config import settings
import uuid

s3_client = boto3.client(
    's3',
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_REGION
)

async def upload_file_to_s3(file: UploadFile, path: str) -> str:
    """
    Upload file to S3 and return public URL
    
    Args:
        file: UploadFile from FastAPI
        path: S3 path (e.g., "drivers/123/cnh_front")
    
    Returns:
        str: Public URL of uploaded file
    """
    # Generate unique filename
    file_extension = file.filename.split('.')[-1]
    unique_filename = f"{path}_{uuid.uuid4()}.{file_extension}"
    
    # Upload to S3
    s3_client.upload_fileobj(
        file.file,
        settings.S3_BUCKET_NAME,
        unique_filename,
        ExtraArgs={
            'ContentType': file.content_type,
            'ACL': 'public-read'  # or 'private' if using pre-signed URLs
        }
    )
    
    # Return public URL
    url = f"https://{settings.S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{unique_filename}"
    return url

async def delete_file_from_s3(file_url: str):
    """Delete file from S3 given its URL"""
    # Extract key from URL
    key = file_url.split(f"{settings.S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/")[1]
    
    s3_client.delete_object(
        Bucket=settings.S3_BUCKET_NAME,
        Key=key
    )
```

**Testes:**
```python
# backend/tests/test_storage.py
from unittest.mock import patch, MagicMock

@patch('src.services.storage.s3_client')
def test_upload_file_to_s3(mock_s3):
    mock_file = MagicMock()
    mock_file.filename = "test.jpg"
    mock_file.content_type = "image/jpeg"
    mock_file.file = MagicMock()
    
    result = await upload_file_to_s3(mock_file, "test/path")
    
    assert mock_s3.upload_fileobj.called
    assert "test/path" in result
    assert ".jpg" in result
```

**Critérios de Aceite:**
- [ ] Upload para S3 funciona
- [ ] Retorna URL pública
- [ ] Suporta múltiplos tipos de arquivo
- [ ] Gera filename único (UUID)
- [ ] Testes mockando boto3

**Dependências:** Nenhuma (pode ser paralelo)

---

## EPIC 1.5: FRONTEND DRIVER (Sprint 1 MVP)

### [FRONTEND] Setup React Native (Expo)
**Responsável:** Frontend Dev | **Estimativa:** 2 SP | **Prioridade:** P0

**Descrição:**
Inicializar projeto React Native com Expo.

**Comandos:**
```bash
cd frontend-driver
npx create-expo-app . --template blank-typescript
npm install @react-navigation/native @react-navigation/stack
npm install axios react-native-maps
npm install @expo/vector-icons
```

**Estrutura:**
```
frontend-driver/
├── src/
│   ├── screens/
│   │   ├── Auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── VerifyPhoneScreen.tsx
│   │   └── Driver/
│   │       ├── HomeScreen.tsx
│   │       └── ProfileSetupScreen.tsx
│   ├── components/
│   ├── services/
│   │   └── api.ts
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   └── types/
├── App.tsx
└── package.json
```

**Critérios de Aceite:**
- [ ] App inicializa sem erros
- [ ] Navegação configurada
- [ ] API client (axios) configurado
- [ ] Build para Android/iOS funciona

**Dependências:** Nenhuma

---

### [FRONTEND] Tela de Registro
**Responsável:** Frontend Dev | **Estimativa:** 3 SP | **Prioridade:** P0

**Descrição:**
Tela de registro de motorista.

**Código:**
```typescript
// src/screens/Auth/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { apiClient } from '../../services/api';

export function RegisterScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    
    try {
      const response = await apiClient.post('/auth/register', {
        phone: `+55${phone}`,
        email,
        full_name: fullName,
        password,
        user_type: 'driver'
      });
      
      // Save token
      await AsyncStorage.setItem('access_token', response.data.access_token);
      
      // Navigate to verification
      navigation.navigate('VerifyPhone', { phone: `+55${phone}` });
      
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.detail || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Telefone (11999999999)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        value={fullName}
        onChangeText={setFullName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <Button
        title={loading ? "Cadastrando..." : "Cadastrar"}
        onPress={handleRegister}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
```

**Critérios de Aceite:**
- [ ] Campos validam corretamente
- [ ] Loading state funciona
- [ ] Erro é exibido ao usuário
- [ ] Navega para verificação após sucesso
- [ ] Token salvo no AsyncStorage

**Dependências:** Setup React Native

---

## RESUMO SPRINT 1

### Velocity: 40 SP distribuídos

| Epic | Story Points | Status |
|------|--------------|--------|
| Setup Projeto | 13 SP | 🔴 TODO |
| Modelos de Dados | 8 SP | 🔴 TODO |
| Autenticação JWT | 13 SP | 🔴 TODO |
| Cadastro Motorista | 6 SP | 🔴 TODO |

### Dependências críticas:
```
Setup → Models → JWT Auth → Endpoints
              ↓
          Frontend (paralelo após setup)
```

### Definition of Done:
- [ ] Motorista pode se registrar via app
- [ ] JWT authentication funciona
- [ ] Upload de documentos funciona
- [ ] Status PENDING_APPROVAL correto
- [ ] Todos os testes passam (>80% coverage)
- [ ] Pipeline CI passa
- [ ] Code review aprovado
- [ ] Deploy em staging

---

# PRÓXIMOS PASSOS

Este documento cobre **Sprint 1** em detalhe granular.

Para **Sprint 2 e 3**, recomendo criar issues no Jira/Linear e estimar no planning com o time.

**Pronto para começar?** 🚀

---

**Documento:** Backlog Técnico Granular  
**Versão:** 1.0  
**Data:** Dezembro 2024
