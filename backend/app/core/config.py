from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_ENV: str = "local"
    DATABASE_URL: str = ""
    REDIS_URL: str = ""
    JWT_SECRET: str = "change-me"
    JWT_ACCESS_TTL_MIN: int = 30
    JWT_REFRESH_TTL_DAYS: int = 30

    EFI_ENV: str = "sandbox"
    EFI_CLIENT_ID: str | None = None
    EFI_CLIENT_SECRET: str | None = None
    EFI_CERT_PATH: str | None = None
    EFI_PIX_KEY: str | None = None

    class Config:
        env_file = ".env"

settings = Settings()
