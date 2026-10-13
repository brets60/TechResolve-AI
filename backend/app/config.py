import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from backend root or parent
load_dotenv()
backend_env = Path(__file__).resolve().parent.parent / ".env"
if backend_env.exists():
    load_dotenv(backend_env)

class Settings:
    PROJECT_NAME: str = "TechResolve AI"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "techresolve-secret-key-change-in-production-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database: SQLite default, PostgreSQL supported if provided
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./techresolve.db")
    
    # Gemini AI
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    
    # Uploads
    UPLOAD_DIR: Path = Path(__file__).resolve().parent.parent / "uploads"
    MAX_UPLOAD_SIZE_MB: int = 15
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "*"
    ]

settings = Settings()
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
