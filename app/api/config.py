import os
import logging
from pydantic import Field
from pydantic_settings import BaseSettings
from typing import Optional
from pydantic import field_validator

logger = logging.getLogger("graphflow-api")

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    This ensures sensitive data is never hardcoded or exposed to clients.
    """
    # Database settings
    DATABASE_URL: str = Field(
        default="sqlite:///./graphflow.db", 
        description="Database connection string"
    )
    
    # API settings
    API_PREFIX: str = Field(default="/api", description="API route prefix")
    DEBUG: bool = Field(default=False, description="Debug mode")
    
    # Security settings
    SECRET_KEY: str = Field(
        default="", 
        description="Secret key for JWT tokens and other security features"
    )
    ALGORITHM: str = Field(default="HS256", description="JWT algorithm")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=30, 
        description="Token expiration time in minutes"
    )
    
    # CORS settings
    CORS_ORIGINS: str = Field(
        default="*", 
        description="Comma-separated list of allowed origins for CORS"
    )
    
    # LangGraph settings
    OPENAI_API_KEY: Optional[str] = Field(
        default=None, 
        description="OpenAI API key for LangGraph"
    )
    
    @field_validator("CORS_ORIGINS")
    def parse_cors_origins(cls, v):
        if v == "*":
            return ["*"]
        return [origin.strip() for origin in v.split(",")]
    
    @field_validator("SECRET_KEY")
    def validate_secret_key(cls, v):
        if not v and os.environ.get("ENVIRONMENT", "development") == "production":
            logger.warning("SECRET_KEY is not set in production environment!")
        return v
    
    @field_validator("OPENAI_API_KEY")
    def validate_openai_api_key(cls, v):
        if not v:
            logger.warning("OPENAI_API_KEY is not set, some LangGraph features may not work properly")
        return v
    
    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True
    }

# Create global settings object
settings = Settings()

def get_settings():
    """
    Returns the settings object.
    This function can be used as a dependency in FastAPI.
    """
    return settings

# Function to get sensitive settings for internal use only
def get_sensitive_settings():
    """
    Returns sensitive settings for internal use only.
    This should never be exposed via API endpoints.
    """
    return {
        "database_url": settings.DATABASE_URL,
        "secret_key": settings.SECRET_KEY,
        "openai_api_key": settings.OPENAI_API_KEY,
    }

# Function to get public settings that can be exposed to clients
def get_public_settings():
    """
    Returns non-sensitive settings that can be safely exposed to clients.
    """
    return {
        "api_prefix": settings.API_PREFIX,
        "debug": settings.DEBUG,
        "cors_origins": settings.CORS_ORIGINS,
    } 