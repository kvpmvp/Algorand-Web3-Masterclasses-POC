from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_ENV: str = "dev"
    APP_SECRET: str
    APP_CORS_ORIGINS: str = "*"
    DATABASE_URL: str
    REDIS_URL: str

    PROJECT_CREATE_DAILY_LIMIT: int = 5
    REPORT_DAILY_LIMIT: int = 20
    AUTO_HIDE_REPORT_THRESHOLD: int = 5
    ALLOWED_CATEGORIES: str = "DeFi,Infrastructure,Tooling,NFTs,Gaming,Social,Other"

    class Config:
        env_file = ".env"

settings = Settings()