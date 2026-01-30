import os


class Config:
    ENV = os.getenv("FLASK_ENV", "development")
    DEBUG = os.getenv("FLASK_DEBUG", "1") == "1"
    CORS_ORIGINS = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://localhost:3000"
    ).split(",")
    
    # MongoDB Configuration
    MONGODB_URI = os.getenv("MONGODB_URI")
    MONGODB_DATABASE = os.getenv("MONGODB_DATABASE", "marketing_ai_mcp")
