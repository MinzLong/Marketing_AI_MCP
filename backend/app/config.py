import os


class Config:
    ENV = os.getenv("FLASK_ENV", "development")
    DEBUG = os.getenv("FLASK_DEBUG", "1") == "1"
    CORS_ORIGINS = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://localhost:3000"
    ).split(",")
    MCP_FACEBOOK_URL = os.getenv("MCP_FACEBOOK_URL", "")
    MCP_FACEBOOK_TOKEN = os.getenv("MCP_FACEBOOK_TOKEN", "")
    MCP_FACEBOOK_RPC_PATH = os.getenv("MCP_FACEBOOK_RPC_PATH", "/rpc")
    MCP_FACEBOOK_HEALTH_PATH = os.getenv("MCP_FACEBOOK_HEALTH_PATH", "/health")
    MCP_FACEBOOK_STDIO_COMMAND = os.getenv("MCP_FACEBOOK_STDIO_COMMAND", "")
    MCP_FACEBOOK_STDIO_ARGS = os.getenv("MCP_FACEBOOK_STDIO_ARGS", "")
    MCP_FACEBOOK_STDIO_ENV = os.getenv("MCP_FACEBOOK_STDIO_ENV", "")
    MCP_FACEBOOK_STDIO_CWD = os.getenv("MCP_FACEBOOK_STDIO_CWD", "")
    MCP_SLIDES_URL = os.getenv("MCP_SLIDES_URL", "")
    MCP_SLIDES_TOKEN = os.getenv("MCP_SLIDES_TOKEN", "")
    MCP_SLIDES_RPC_PATH = os.getenv("MCP_SLIDES_RPC_PATH", "/rpc")
    MCP_SLIDES_HEALTH_PATH = os.getenv("MCP_SLIDES_HEALTH_PATH", "/health")
    MCP_SLIDES_STDIO_COMMAND = os.getenv("MCP_SLIDES_STDIO_COMMAND", "")
    MCP_SLIDES_STDIO_ARGS = os.getenv("MCP_SLIDES_STDIO_ARGS", "")
    MCP_SLIDES_STDIO_ENV = os.getenv("MCP_SLIDES_STDIO_ENV", "")
    MCP_SLIDES_STDIO_CWD = os.getenv("MCP_SLIDES_STDIO_CWD", "")
