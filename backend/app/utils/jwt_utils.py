"""
JWT Utilities for generating secure secret keys and helper functions
"""
import secrets
import string


def generate_secret_key(length=64):
    """
    Generate a secure random secret key for JWT signing
    
    Args:
        length (int): Length of the secret key (default: 64)
    
    Returns:
        str: A secure random string
    """
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def create_env_template():
    """
    Create a template .env file with a generated JWT secret key
    """
    secret_key = generate_secret_key()
    template = f"""# Marketing AI MCP Backend Environment Variables

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=1

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=marketing_ai_mcp

# JWT Configuration - IMPORTANT: Change this secret key in production!
JWT_SECRET_KEY={secret_key}
JWT_ACCESS_TOKEN_EXPIRES=24
"""
    return template


if __name__ == "__main__":
    # Generate a new secret key
    print("Generated JWT Secret Key:")
    print(generate_secret_key())
    print("\nFull .env template:")
    print(create_env_template())
