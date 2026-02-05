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
    
    # JWT Configuration
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")
    
    # Google OAuth Configuration
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
    GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:5173/auth/google/callback")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4.1")
    OPENAI_TEMPERATURE = float(os.getenv("OPENAI_TEMPERATURE", "0.2"))
    OPENAI_MAX_TOKENS = int(os.getenv("OPENAI_MAX_TOKENS", "1200"))
    MCP_GOOGLE_FORMS_STDIO_COMMAND = os.getenv("MCP_GOOGLE_FORMS_STDIO_COMMAND", "")
    MCP_GOOGLE_FORMS_STDIO_ARGS = os.getenv("MCP_GOOGLE_FORMS_STDIO_ARGS", "")
    MCP_GOOGLE_FORMS_STDIO_ENV = os.getenv("MCP_GOOGLE_FORMS_STDIO_ENV", "")
    MCP_GOOGLE_FORMS_STDIO_CWD = os.getenv("MCP_GOOGLE_FORMS_STDIO_CWD", "")
