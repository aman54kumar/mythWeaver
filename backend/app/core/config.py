"""
Configuration settings for the Mythosync backend.
Loads environment variables and provides type-safe configuration.
"""

import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import validator


class Settings(BaseSettings):
    """Application settings"""
    
    # OpenAI Configuration
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-4o-mini"
    OPENAI_MAX_TOKENS: int = 1200
    OPENAI_TEMPERATURE: float = 0.7
    
    # Server Configuration
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    ENVIRONMENT: str = "production"
    
    # Database Configuration
    DATABASE_URL: str = "sqlite:///./data.db"
    
    # Redis Configuration (optional)
    REDIS_URL: str = ""
    
    # Security  
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001", "https://mythweaver.fun", "https://www.mythweaver.fun", "https://*.onrender.com"]
    ALLOWED_HOSTS: List[str] = ["localhost", "mythweaver.fun", "www.mythweaver.fun", "*.mythweaver.fun", "*.onrender.com", "api.mythweaver.fun"]
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 20
    RATE_LIMIT_WINDOW: int = 3600  # 1 hour in seconds
    
    # Content Safety
    USE_OPENAI_MODERATION: bool = True
    MAX_SCENARIO_LENGTH: int = 2000
    
    # Affiliate Configuration
    AFFILIATE_TEMPLATE_URL: str = "https://affiliate.example.com/?q={isbn}"
    
    # Monitoring
    SENTRY_DSN: str = ""
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
