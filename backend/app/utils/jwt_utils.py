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
    Create a template .env file for environment variables.
    Does NOT include actual values for security reasons.
    """
    template = """# Marketing AI MCP Backend Environment Variables

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=1

# CORS Configuration (add your frontend URLs)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# MongoDB Configuration
# For local development: mongodb://localhost:27017
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_URI=your_mongodb_uri_here
MONGODB_DATABASE=marketing_ai_mcp

# JWT Configuration - IMPORTANT: Generate a secure secret key!
# Use: python -c "from app.utils.jwt_utils import generate_secret_key; print(generate_secret_key())"
JWT_SECRET_KEY=your_jwt_secret_key_here

# Google OAuth Configuration (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
"""
    return template


def generate_env_file(mongodb_uri=None, google_client_id=None, google_client_secret=None):
    """
    Generate an actual .env file with real values.
    This should only be used during setup, not committed to git.
    
    Args:
        mongodb_uri (str): MongoDB connection string
        google_client_id (str): Google OAuth client ID
        google_client_secret (str): Google OAuth client secret
    
    Returns:
        str: Complete .env content with actual values
    """
    secret_key = generate_secret_key()
    
    # Default values for development
    mongodb_uri = mongodb_uri or "mongodb://localhost:27017"
    
    template = f"""# Marketing AI MCP Backend Environment Variables
# WARNING: This file contains sensitive information. DO NOT COMMIT TO GIT!

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=1

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# MongoDB Configuration
MONGODB_URI={mongodb_uri}
MONGODB_DATABASE=marketing_ai_mcp

# JWT Configuration
JWT_SECRET_KEY={secret_key}

# Google OAuth Configuration
GOOGLE_CLIENT_ID={google_client_id or 'your_google_client_id'}
GOOGLE_CLIENT_SECRET={google_client_secret or 'your_google_client_secret'}
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
"""
    return template


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "generate-key":
        # Just generate a secret key
        print("Generated JWT Secret Key:")
        print(generate_secret_key())
    elif len(sys.argv) > 1 and sys.argv[1] == "template":
        # Show template without actual values
        print("Environment template (.env.example):")
        print(create_env_template())
    elif len(sys.argv) > 1 and sys.argv[1] == "setup":
        # Generate actual .env file for development
        print("WARNING: This will create .env with actual secret keys!")
        confirm = input("Continue? (y/N): ")
        if confirm.lower() == 'y':
            env_content = generate_env_file()
            with open('.env', 'w') as f:
                f.write(env_content)
            print("✅ .env file created successfully!")
            print("⚠️  REMEMBER: Add .env to your .gitignore!")
        else:
            print("Operation cancelled.")
    else:
        print("Usage:")
        print("  python jwt_utils.py generate-key  # Generate a JWT secret key")
        print("  python jwt_utils.py template      # Show .env template")
        print("  python jwt_utils.py setup         # Create actual .env file")
