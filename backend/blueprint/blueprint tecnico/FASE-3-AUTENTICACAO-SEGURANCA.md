# Fase 3: Autenticação e Segurança - Blueprint Completo

**Duração**: 1 semana  
**Objetivo**: Sistema completo de autenticação JWT com segurança robusta

---

## 1. Core de Segurança

### app/core/security.py

```python
"""
Módulo de segurança: JWT, hashing, tokens
"""
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verificar senha contra hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Gerar hash bcrypt da senha."""
    return pwd_context.hash(password)


def create_access_token(
    subject: str,
    expires_delta: Optional[timedelta] = None,
    additional_claims: Optional[Dict[str, Any]] = None
) -> str:
    """
    Criar JWT access token.
    
    Args:
        subject: User ID (UUID string)
        expires_delta: Tempo customizado de expiração
        additional_claims: Claims extras (role, permissions)
    
    Returns:
        JWT token string
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "type": "access",
        "iat": datetime.utcnow()
    }
    
    if additional_claims:
        to_encode.update(additional_claims)
    
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(subject: str) -> str:
    """
    Criar JWT refresh token (7 dias).
    """
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "type": "refresh",
        "iat": datetime.utcnow()
    }
    
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> Dict[str, Any]:
    """
    Decodificar e validar JWT.
    
    Raises:
        JWTError: Token inválido ou expirado
    """
    return jwt.decode(
        token,
        settings.SECRET_KEY,
        algorithms=[settings.ALGORITHM]
    )


def verify_token(token: str, token_type: str = "access") -> Optional[str]:
    """
    Verificar token e retornar user_id.
    
    Returns:
        User ID se válido, None caso contrário
    """
    try:
        payload = decode_token(token)
        
        if payload.get("type") != token_type:
            return None
        
        exp = payload.get("exp")
        if exp is None or datetime.fromtimestamp(exp) < datetime.utcnow():
            return None
        
        return payload.get("sub")
    
    except JWTError:
        return None
```

---

## 2. Dependencies

### app/api/deps.py

```python
"""
Dependencies do FastAPI: autenticação, sessão DB, etc.
"""
from typing import Generator
from uuid import UUID
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.database import SessionLocal
from app.core.security import verify_token
from app.models.user import (
    User, Passenger, Driver, AdminUser,
    UserRole, UserStatus, DriverVerificationStatus
)

security = HTTPBearer()


def get_db() -> Generator:
    """Dependency: Sessão do banco."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency: Obter usuário autenticado.
    
    Valida JWT e retorna User do banco.
    """
    token = credentials.credentials
    
    # Verificar e decodificar token
    user_id = verify_token(token, token_type="access")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Buscar usuário
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    # Verificar soft delete
    if user.deleted_at is not None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account deleted"
        )
    
    # Verificar status
    if user.status == UserStatus.BLOCKED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account blocked"
        )
    
    if user.status == UserStatus.SUSPENDED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account suspended"
        )
    
    # Verificar bloqueio temporário
    if user.locked_until and user.locked_until > datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Account locked until {user.locked_until.isoformat()}"
        )
    
    return user


async def get_current_passenger(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Passenger:
    """Dependency: Obter passageiro autenticado."""
    if current_user.role != UserRole.PASSENGER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not a passenger"
        )
    
    passenger = db.query(Passenger).filter(
        Passenger.user_id == current_user.id
    ).first()
    
    if passenger is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Passenger profile not found"
        )
    
    return passenger


async def get_current_driver(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Driver:
    """Dependency: Obter motorista autenticado e verificado."""
    if current_user.role != UserRole.DRIVER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not a driver"
        )
    
    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()
    
    if driver is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Driver profile not found"
        )
    
    # Verificar verificação
    if driver.verification_status != DriverVerificationStatus.VERIFIED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Driver not verified. Status: {driver.verification_status.value}"
        )
    
    return driver


async def get_current_admin(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> AdminUser:
    """Dependency: Obter admin autenticado."""
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPPORT]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not an admin"
        )
    
    admin = db.query(AdminUser).filter(
        AdminUser.user_id == current_user.id
    ).first()
    
    if admin is None or not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access denied"
        )
    
    return admin


def require_permission(permission: str):
    """
    Factory: Dependency para verificar permissão específica.
    
    Usage:
        @router.post("/admin/sensitive")
        async def do_something(
            admin: AdminUser = Depends(require_permission("users.delete"))
        ):
            ...
    """
    async def permission_checker(
        admin: AdminUser = Depends(get_current_admin)
    ) -> AdminUser:
        permissions = admin.permissions or []
        
        # admin.all = super admin
        if permission not in permissions and "admin.all" not in permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing required permission: {permission}"
            )
        
        return admin
    
    return permission_checker
```

---

## 3. Schemas Pydantic

### app/schemas/auth.py

```python
"""
Schemas para autenticação
"""
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime
from app.models.user import UserRole, UserStatus


class RegisterRequest(BaseModel):
    """Request de registro."""
    email: EmailStr
    phone: str = Field(..., regex=r"^\+?[1-9]\d{10,14}$")
    password: str = Field(..., min_length=8, max_length=100)
    full_name: str = Field(..., min_length=3, max_length=255)
    cpf: Optional[str] = Field(None, regex=r"^\d{11}$")
    role: UserRole
    
    @validator('password')
    def validate_password_strength(cls, v):
        """Validar força da senha."""
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(char.islower() for char in v):
            raise ValueError('Password must contain at least one lowercase letter')
        return v


class LoginRequest(BaseModel):
    """Request de login."""
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    """Request de refresh token."""
    refresh_token: str


class UserResponse(BaseModel):
    """Response com dados do usuário."""
    id: str
    email: str
    phone: str
    full_name: str
    role: UserRole
    status: UserStatus
    email_verified_at: Optional[datetime]
    phone_verified_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    """Response de login bem-sucedido."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # segundos
    user: UserResponse


class RefreshResponse(BaseModel):
    """Response de refresh."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class MessageResponse(BaseModel):
    """Response genérica com mensagem."""
    message: str
```

---

## 4. Auth Endpoints

### app/api/v1/auth.py

```python
"""
Endpoints de autenticação
"""
from datetime import datetime, timedelta
from typing import Optional
import hashlib
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    verify_token
)
from app.core.config import settings
from app.models.user import User, Passenger, Driver, UserRole, UserStatus, AuthToken
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    LoginResponse,
    RefreshRequest,
    RefreshResponse,
    UserResponse,
    MessageResponse
)

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    request: RegisterRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Registrar novo usuário (passageiro ou motorista).
    
    Validações:
    - Email único
    - Telefone único
    - CPF único (se fornecido)
    - Senha forte (via Pydantic)
    """
    # Verificar email
    if db.query(User).filter(User.email == request.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Verificar telefone
    if db.query(User).filter(User.phone == request.phone).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone already registered"
        )
    
    # Verificar CPF
    if request.cpf and db.query(User).filter(User.cpf == request.cpf).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CPF already registered"
        )
    
    # Criar usuário
    user = User(
        email=request.email,
        phone=request.phone,
        password_hash=get_password_hash(request.password),
        full_name=request.full_name,
        cpf=request.cpf,
        role=request.role,
        status=UserStatus.PENDING_VERIFICATION
    )
    db.add(user)
    db.flush()
    
    # Criar perfil específico
    if request.role == UserRole.PASSENGER:
        passenger = Passenger(user_id=user.id)
        db.add(passenger)
    
    elif request.role == UserRole.DRIVER:
        driver = Driver(user_id=user.id)
        db.add(driver)
    
    db.commit()
    db.refresh(user)
    
    # Background: Enviar email de verificação
    # background_tasks.add_task(send_verification_email, user.email, user.id)
    
    return user


@router.post("/login", response_model=LoginResponse)
async def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Login de usuário.
    
    Fluxo:
    1. Buscar por email
    2. Verificar bloqueio temporário
    3. Verificar senha
    4. Verificar status
    5. Criar tokens
    6. Salvar refresh token
    7. Resetar tentativas falhas
    """
    # Buscar usuário
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verificar bloqueio
    if user.locked_until and user.locked_until > datetime.utcnow():
        seconds_left = (user.locked_until - datetime.utcnow()).total_seconds()
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Account locked. Try again in {int(seconds_left)} seconds"
        )
    
    # Verificar senha
    if not verify_password(request.password, user.password_hash):
        # Incrementar tentativas falhas
        user.failed_login_attempts += 1
        
        # Bloquear após 5 tentativas
        if user.failed_login_attempts >= 5:
            user.locked_until = datetime.utcnow() + timedelta(minutes=30)
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account locked due to multiple failed attempts. Try again in 30 minutes"
            )
        
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verificar status
    if user.status == UserStatus.BLOCKED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account permanently blocked"
        )
    
    if user.status == UserStatus.SUSPENDED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account suspended. Contact support"
        )
    
    # Resetar tentativas e atualizar last_login
    user.failed_login_attempts = 0
    user.last_login_at = datetime.utcnow()
    
    # Criar tokens
    access_token = create_access_token(
        subject=str(user.id),
        additional_claims={
            "role": user.role.value,
            "email": user.email
        }
    )
    refresh_token = create_refresh_token(subject=str(user.id))
    
    # Salvar refresh token
    token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
    auth_token = AuthToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        device_info={}  # TODO: extrair do User-Agent
    )
    db.add(auth_token)
    db.commit()
    
    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse.from_orm(user)
    )


@router.post("/refresh", response_model=RefreshResponse)
async def refresh(
    request: RefreshRequest,
    db: Session = Depends(get_db)
):
    """
    Renovar access token usando refresh token válido.
    """
    # Verificar refresh token
    user_id = verify_token(request.refresh_token, token_type="refresh")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
    
    # Verificar se token existe e não foi revogado
    token_hash = hashlib.sha256(request.refresh_token.encode()).hexdigest()
    auth_token = db.query(AuthToken).filter(
        AuthToken.token_hash == token_hash,
        AuthToken.revoked_at.is_(None)
    ).first()
    
    if not auth_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token revoked or not found"
        )
    
    # Buscar usuário
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    # Atualizar last_used
    auth_token.last_used_at = datetime.utcnow()
    db.commit()
    
    # Criar novo access token
    access_token = create_access_token(
        subject=str(user.id),
        additional_claims={
            "role": user.role.value,
            "email": user.email
        }
    )
    
    return RefreshResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.post("/logout", response_model=MessageResponse)
async def logout(
    request: RefreshRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Logout: Revogar refresh token.
    """
    token_hash = hashlib.sha256(request.refresh_token.encode()).hexdigest()
    
    auth_token = db.query(AuthToken).filter(
        AuthToken.user_id == current_user.id,
        AuthToken.token_hash == token_hash
    ).first()
    
    if auth_token:
        auth_token.revoked_at = datetime.utcnow()
        db.commit()
    
    return MessageResponse(message="Logged out successfully")


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Obter dados do usuário autenticado.
    """
    return current_user


@router.post("/verify-email", response_model=MessageResponse)
async def verify_email(
    token: str,
    db: Session = Depends(get_db)
):
    """
    Verificar email via token.
    
    TODO: Implementar
    1. Decodificar token
    2. Buscar usuário
    3. Marcar email_verified_at
    """
    # Implementação futura
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(
    email: EmailStr,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Solicitar reset de senha.
    
    Sempre retorna sucesso (segurança).
    """
    user = db.query(User).filter(User.email == email).first()
    
    if user:
        # Background: Enviar email com token
        # background_tasks.add_task(send_reset_email, user.email, user.id)
        pass
    
    return MessageResponse(message="If email exists, reset link has been sent")


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(
    token: str,
    new_password: str = Field(..., min_length=8),
    db: Session = Depends(get_db)
):
    """
    Resetar senha com token válido.
    
    TODO: Implementar
    """
    raise HTTPException(status_code=501, detail="Not implemented yet")
```

---

## 5. Middleware de Idempotência

### app/middleware/idempotency.py

```python
"""
Middleware para garantir idempotência em requests críticos
"""
import hashlib
import json
import re
from typing import List, Tuple

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

from app.core.redis import redis_client


class IdempotencyMiddleware(BaseHTTPMiddleware):
    """
    Middleware de idempotência.
    
    Garante que requests duplicados (mesmo Idempotency-Key)
    retornem a mesma resposta sem reprocessar.
    """
    
    IDEMPOTENT_METHODS: List[str] = ["POST", "PUT", "PATCH", "DELETE"]
    
    IDEMPOTENT_PATHS: List[str] = [
        r"^/api/v1/rides$",
        r"^/api/v1/rides/[^/]+/accept$",
        r"^/api/v1/rides/[^/]+/cancel$",
        r"^/api/v1/rides/[^/]+/complete$",
        r"^/api/v1/payments/intent$",
        r"^/api/v1/payouts/request$",
        r"^/api/v1/drivers/topup$",
    ]
    
    async def dispatch(self, request: Request, call_next):
        # Verificar método
        if request.method not in self.IDEMPOTENT_METHODS:
            return await call_next(request)
        
        # Verificar path
        path_requires = any(
            re.match(pattern, request.url.path)
            for pattern in self.IDEMPOTENT_PATHS
        )
        
        if not path_requires:
            return await call_next(request)
        
        # Obter idempotency key
        idempotency_key = request.headers.get("Idempotency-Key")
        
        if not idempotency_key:
            return JSONResponse(
                status_code=400,
                content={"detail": "Idempotency-Key header required for this endpoint"}
            )
        
        # Validar formato
        if len(idempotency_key) < 16 or len(idempotency_key) > 64:
            return JSONResponse(
                status_code=400,
                content={"detail": "Idempotency-Key must be between 16 and 64 characters"}
            )
        
        # Verificar cache
        cache_key = f"idempotency:{idempotency_key}"
        cached = await redis_client.get(cache_key)
        
        if cached:
            # Retornar resposta cacheada
            response_data = json.loads(cached)
            return JSONResponse(
                status_code=response_data["status_code"],
                content=response_data["body"],
                headers={"X-Idempotency-Replay": "true"}
            )
        
        # Processar request
        response = await call_next(request)
        
        # Cachear apenas respostas bem-sucedidas
        if 200 <= response.status_code < 300:
            # Ler body
            body = b""
            async for chunk in response.body_iterator:
                body += chunk
            
            response_data = {
                "status_code": response.status_code,
                "body": json.loads(body.decode())
            }
            
            # Cachear por 24 horas
            await redis_client.setex(
                cache_key,
                86400,
                json.dumps(response_data)
            )
            
            # Recriar response
            return JSONResponse(
                status_code=response.status_code,
                content=response_data["body"]
            )
        
        return response
```

---

## 6. Middleware de Rate Limiting

### app/middleware/rate_limit.py

```python
"""
Middleware de rate limiting baseado em Redis
"""
import re
from typing import Dict, Tuple

from fastapi import HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from app.core.redis import redis_client


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Rate limiting por usuário/IP.
    
    Limites por endpoint (max_requests, window_seconds).
    """
    
    # Pattern: (max_requests, window_seconds)
    LIMITS: Dict[str, Tuple[int, int]] = {
        r"^/api/v1/auth/login$": (10, 300),          # 10/5min
        r"^/api/v1/auth/register$": (3, 3600),       # 3/hora
        r"^/api/v1/rides$": (20, 3600),              # 20/hora
        r"^/api/v1/rides/[^/]+/accept$": (100, 60),  # 100/min (burst)
        r"^/api/v1/payouts/request$": (5, 86400),    # 5/dia
    }
    
    async def dispatch(self, request: Request, call_next):
        # Determinar limite
        limit_max, limit_window = None, None
        
        for pattern, (max_req, window) in self.LIMITS.items():
            if re.match(pattern, request.url.path):
                limit_max = max_req
                limit_window = window
                break
        
        if not limit_max:
            return await call_next(request)
        
        # Identificar por user_id ou IP
        user_id = getattr(request.state, "user_id", None)
        if user_id:
            limit_key = f"rate_limit:user:{user_id}:{request.url.path}"
        else:
            ip = request.client.host
            limit_key = f"rate_limit:ip:{ip}:{request.url.path}"
        
        # Verificar contador
        current_count = await redis_client.incr(limit_key)
        
        if current_count == 1:
            await redis_client.expire(limit_key, limit_window)
        
        if current_count > limit_max:
            ttl = await redis_client.ttl(limit_key)
            
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests",
                headers={
                    "X-RateLimit-Limit": str(limit_max),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(ttl),
                    "Retry-After": str(ttl)
                }
            )
        
        # Processar
        response = await call_next(request)
        
        # Adicionar headers
        response.headers["X-RateLimit-Limit"] = str(limit_max)
        response.headers["X-RateLimit-Remaining"] = str(max(0, limit_max - current_count))
        
        return response
```

---

## 7. Middleware de Logging

### app/middleware/logging.py

```python
"""
Middleware de logging estruturado
"""
import time
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

import structlog

logger = structlog.get_logger()


class LoggingMiddleware(BaseHTTPMiddleware):
    """
    Logging estruturado de todas as requests.
    
    Adiciona request_id único e loga início/fim.
    """
    
    async def dispatch(self, request: Request, call_next):
        # Gerar request ID
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        
        # Log início
        logger.info(
            "request_started",
            request_id=request_id,
            method=request.method,
            path=request.url.path,
            client_ip=request.client.host,
            user_agent=request.headers.get("user-agent", "unknown")
        )
        
        # Processar
        start_time = time.time()
        
        try:
            response = await call_next(request)
            process_time = time.time() - start_time
            
            # Log fim
            logger.info(
                "request_completed",
                request_id=request_id,
                method=request.method,
                path=request.url.path,
                status_code=response.status_code,
                duration_ms=round(process_time * 1000, 2)
            )
            
            # Adicionar headers
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = f"{process_time:.3f}"
            
            return response
        
        except Exception as e:
            process_time = time.time() - start_time
            
            logger.error(
                "request_failed",
                request_id=request_id,
                method=request.method,
                path=request.url.path,
                error=str(e),
                duration_ms=round(process_time * 1000, 2)
            )
            
            raise
```

---

## 8. Atualizar main.py

### app/main.py (adicionar middlewares)

```python
from app.middleware.idempotency import IdempotencyMiddleware
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.logging import LoggingMiddleware

# ... código anterior ...

# Middlewares (ordem importa: o primeiro é o mais externo)
app.add_middleware(LoggingMiddleware)        # 1º - Log tudo
app.add_middleware(RateLimitMiddleware)      # 2º - Rate limit
app.add_middleware(IdempotencyMiddleware)    # 3º - Idempotência

# ... resto do código ...

# Incluir router de auth
from app.api.v1.auth import router as auth_router
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
```

---

## 9. Testes

### tests/integration/test_auth.py

```python
"""
Testes de autenticação
"""
import pytest
from fastapi.testclient import TestClient


def test_register_passenger(client):
    """Teste: Registrar passageiro."""
    response = client.post("/api/v1/auth/register", json={
        "email": "passenger@test.com",
        "phone": "+5511999999999",
        "password": "Test123!@#",
        "full_name": "Test Passenger",
        "role": "passenger"
    })
    
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "passenger@test.com"
    assert data["role"] == "passenger"


def test_register_duplicate_email(client, passenger_user):
    """Teste: Email duplicado."""
    response = client.post("/api/v1/auth/register", json={
        "email": passenger_user.email,
        "phone": "+5511888888888",
        "password": "Test123!@#",
        "full_name": "Another User",
        "role": "passenger"
    })
    
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]


def test_login_success(client, passenger_user):
    """Teste: Login bem-sucedido."""
    response = client.post("/api/v1/auth/login", json={
        "email": passenger_user.email,
        "password": "password123"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client, passenger_user):
    """Teste: Senha incorreta."""
    response = client.post("/api/v1/auth/login", json={
        "email": passenger_user.email,
        "password": "wrongpassword"
    })
    
    assert response.status_code == 401


def test_login_rate_limit(client, passenger_user):
    """Teste: Rate limiting de login."""
    for _ in range(11):
        client.post("/api/v1/auth/login", json={
            "email": passenger_user.email,
            "password": "wrongpassword"
        })
    
    response = client.post("/api/v1/auth/login", json={
        "email": passenger_user.email,
        "password": "password123"
    })
    
    assert response.status_code == 429


def test_get_me(client, passenger_token):
    """Teste: Obter usuário autenticado."""
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {passenger_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "email" in data
```

---

## 10. Checklist de Implementação

### ✅ Tarefas

- [ ] **Core**
  - [ ] Implementar `app/core/security.py`
  - [ ] Testar funções de JWT
  - [ ] Testar hashing de senhas

- [ ] **Dependencies**
  - [ ] Implementar `app/api/deps.py`
  - [ ] Testar get_current_user
  - [ ] Testar get_current_passenger
  - [ ] Testar get_current_driver
  - [ ] Testar require_permission

- [ ] **Schemas**
  - [ ] Criar `app/schemas/auth.py`
  - [ ] Validar schemas com dados reais

- [ ] **Endpoints**
  - [ ] POST /auth/register
  - [ ] POST /auth/login
  - [ ] POST /auth/refresh
  - [ ] POST /auth/logout
  - [ ] GET /auth/me
  - [ ] POST /auth/verify-email (placeholder)
  - [ ] POST /auth/forgot-password (placeholder)

- [ ] **Middlewares**
  - [ ] IdempotencyMiddleware
  - [ ] RateLimitMiddleware
  - [ ] LoggingMiddleware
  - [ ] Adicionar ao main.py

- [ ] **Testes**
  - [ ] Testes de registro
  - [ ] Testes de login
  - [ ] Testes de refresh
  - [ ] Testes de rate limiting
  - [ ] Testes de idempotência
  - [ ] Testes de permissões

- [ ] **Documentação**
  - [ ] Documentar endpoints no Swagger
  - [ ] Adicionar exemplos de uso

---

## 11. Comandos de Teste

```bash
# Registrar passageiro
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "passenger@test.com",
    "phone": "+5511999999999",
    "password": "Test123!@#",
    "full_name": "Test Passenger",
    "role": "passenger"
  }'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "passenger@test.com",
    "password": "Test123!@#"
  }'

# Obter perfil
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Refresh token
curl -X POST http://localhost:8000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "YOUR_REFRESH_TOKEN"
  }'

# Testar rate limiting (executar 11x)
for i in {1..11}; do
  curl -X POST http://localhost:8000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
  echo ""
done
```

---

**Tempo Estimado**: 5-7 dias  
**Próxima Fase**: Fase 4 - Serviços de Negócio
