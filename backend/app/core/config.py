
from typing import Optional
from pydantic import validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # App
    APP_ENV: str = "local"
    PROJECT_NAME: str = "Ibora Mobi Backend"
    API_V1_STR: str = "/api/v1"
    
    # Auth
    SECRET_KEY: str = "changethis"
    JWT_SECRET: Optional[str] = None
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 
    JWT_ACCESS_TTL_MIN: Optional[int] = 60
    JWT_REFRESH_TTL_DAYS: Optional[int] = 30

    # Database
    # Priority: DATABASE_URL from .env > Derived from POSTGRES_* vars > Defaults
    DATABASE_URL: Optional[str] = None
    
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres_password"
    POSTGRES_DB: str = "ibora_mobi"
    POSTGRES_PORT: int = 5432
    
    SQLALCHEMY_DATABASE_URI: Optional[str] = None

    @validator("SQLALCHEMY_DATABASE_URI", pre=True, always=True)
    def assemble_db_connection(cls, v: str | None, values: dict) -> str:
        # 1. Prefer explicitly passed value
        if isinstance(v, str):
            return v
            
        # 2. Prefer DATABASE_URL from .env
        db_url = values.get("DATABASE_URL")
        if db_url:
            return db_url.replace("postgresql+psycopg://", "postgresql+asyncpg://")

        # 3. Fallback to constructing from components (Legacy/Docker fallback)
        return f"postgresql+asyncpg://{values.get('POSTGRES_USER')}:{values.get('POSTGRES_PASSWORD')}@{values.get('POSTGRES_SERVER')}:{values.get('POSTGRES_PORT')}/{values.get('POSTGRES_DB')}"

    # Redis
    REDIS_URL: Optional[str] = "redis://localhost:6379/0"
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379

    # RabbitMQ
    RABBITMQ_URL: str = "amqp://guest:guest@localhost/"

    # Efí Bank (Pix)
    EFI_CLIENT_ID: Optional[str] = "Client_Id_d45febcef25500d2ff3b56fbf32b9a61b30dea2a"
    EFI_CLIENT_SECRET: Optional[str] = "Client_Secret_09c6be42a50a96c9a38c0074e0ba7a104c63a7a9"
    EFI_CERTIFICATE_PATH: Optional[str] = "/home/jpsantos/Projetos-dev/ibora-mobi/efi-ibora-mobi-test.p12"
    EFI_SANDBOX: bool = True
    EFI_PIX_KEY: Optional[str] = None

    # Google Maps
    GOOGLE_MAPS_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
