import os


class Config:
    ENV = os.getenv("FLASK_ENV", "development")
    DEBUG = os.getenv("FLASK_DEBUG", "1") == "1"
    CORS_ORIGINS = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://localhost:3000"
    ).split(",")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4.1")
    OPENAI_TEMPERATURE = float(os.getenv("OPENAI_TEMPERATURE", "0.2"))
    OPENAI_MAX_TOKENS = int(os.getenv("OPENAI_MAX_TOKENS", "1200"))
    MCP_GOOGLE_FORMS_STDIO_COMMAND = os.getenv("MCP_GOOGLE_FORMS_STDIO_COMMAND", "")
    MCP_GOOGLE_FORMS_STDIO_ARGS = os.getenv("MCP_GOOGLE_FORMS_STDIO_ARGS", "")
    MCP_GOOGLE_FORMS_STDIO_ENV = os.getenv("MCP_GOOGLE_FORMS_STDIO_ENV", "")
    MCP_GOOGLE_FORMS_STDIO_CWD = os.getenv("MCP_GOOGLE_FORMS_STDIO_CWD", "")
