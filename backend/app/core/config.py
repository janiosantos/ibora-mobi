
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
    JWT_SECRET: Optional[str] = None # Legacy config support
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 
    JWT_ACCESS_TTL_MIN: Optional[int] = 60
    JWT_REFRESH_TTL_DAYS: Optional[int] = 30

    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "app"
    POSTGRES_PORT: int = 5432
    SQLALCHEMY_DATABASE_URI: Optional[str] = None
    DATABASE_URL: Optional[str] = None # Legacy support

    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: str | None, values: dict) -> str:
        if isinstance(v, str):
            return v
        # Fallback to DATABASE_URL from .env if present
        if values.get("DATABASE_URL"):
            return values.get("DATABASE_URL").replace("postgresql+psycopg://", "postgresql+asyncpg://")
            
        return f"postgresql+asyncpg://{values.get('POSTGRES_USER')}:{values.get('POSTGRES_PASSWORD')}@{values.get('POSTGRES_SERVER')}:{values.get('POSTGRES_PORT')}/{values.get('POSTGRES_DB')}"

    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_URL: Optional[str] = None

    # RabbitMQ
    RABBITMQ_URL: str = "amqp://guest:guest@localhost/"

    # Efi (Pix)
    EFI_ENV: Optional[str] = None
    EFI_CLIENT_ID: Optional[str] = None
    EFI_CLIENT_SECRET: Optional[str] = None
    EFI_CERT_PATH: Optional[str] = None
    EFI_PIX_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

settings = Settings()
