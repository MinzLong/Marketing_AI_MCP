import os
import requests
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from google.auth import exceptions
import jwt
import datetime
from .database_service import DatabaseService

class GoogleOAuthService:
    """Service for handling Google OAuth authentication"""
    
    def __init__(self):
        self.client_id = os.getenv('GOOGLE_CLIENT_ID')
        self.client_secret = os.getenv('GOOGLE_CLIENT_SECRET')
        self.redirect_uri = os.getenv('GOOGLE_REDIRECT_URI', 'http://localhost:5173/auth/google/callback')
    
    def get_google_auth_url(self):
        """Generate Google OAuth authorization URL"""
        auth_url = (
            f"https://accounts.google.com/o/oauth2/v2/auth"
            f"?client_id={self.client_id}"
            f"&redirect_uri={self.redirect_uri}"
            f"&scope=openid email profile"
            f"&response_type=code"
            f"&access_type=offline"
        )
        return auth_url
    
    def exchange_code_for_token(self, code):
        """Exchange authorization code for access token"""
        try:
            token_url = "https://oauth2.googleapis.com/token"
            data = {
                'client_id': self.client_id,
                'client_secret': self.client_secret,
                'code': code,
                'grant_type': 'authorization_code',
                'redirect_uri': self.redirect_uri,
            }
            
            response = requests.post(token_url, data=data)
            token_data = response.json()
            
            if response.status_code != 200:
                raise Exception(f"Token exchange failed: {token_data}")
                
            return token_data
        except Exception as e:
            raise Exception(f"Failed to exchange code for token: {str(e)}")
    
    def verify_google_token(self, id_token_str):
        """Verify Google ID token and extract user info"""
        try:
            # Verify the token
            idinfo = id_token.verify_oauth2_token(
                id_token_str, 
                google_requests.Request(), 
                self.client_id
            )
            
            # Check if token is from correct issuer
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')
            
            return {
                'google_id': idinfo['sub'],
                'email': idinfo['email'],
                'name': idinfo['name'],
                'picture': idinfo.get('picture'),
                'email_verified': idinfo.get('email_verified', False)
            }
            
        except exceptions.GoogleAuthError as e:
            raise Exception(f"Invalid Google token: {str(e)}")
        except Exception as e:
            raise Exception(f"Token verification failed: {str(e)}")
    
    def get_or_create_user(self, google_user_info):
        """Get existing user or create new user from Google info"""
        try:
            print(f"DEBUG: Google user info received: {google_user_info}")
            
            # Check if user exists by Google ID
            user = DatabaseService.find_one("users", {"google_id": google_user_info['google_id']})
            
            if user:
                print(f"DEBUG: Found existing user by Google ID: {user}")
                # Update user info if exists and ensure username field exists
                update_data = {
                    "last_login": datetime.datetime.utcnow(),
                    "name": google_user_info['name'],
                    "picture": google_user_info.get('picture')
                }
                
                # Ensure username field exists for older users
                if "username" not in user:
                    update_data["username"] = google_user_info['email'].split('@')[0]
                
                DatabaseService.update_one("users", {"_id": user["_id"]}, update_data)
                
                # Fetch updated user to ensure all fields are present
                updated_user = DatabaseService.find_one("users", {"_id": user["_id"]})
                return updated_user
            
            # Check if user exists by email
            user = DatabaseService.find_one("users", {"email": google_user_info['email']})
            
            if user:
                print(f"DEBUG: Found existing user by email: {user}")
                # Link Google account to existing user
                update_data = {
                    "google_id": google_user_info['google_id'],
                    "picture": google_user_info.get('picture'),
                    "last_login": datetime.datetime.utcnow()
                }
                
                # Ensure username field exists for older users
                if "username" not in user:
                    update_data["username"] = google_user_info['email'].split('@')[0]
                
                DatabaseService.update_one("users", {"_id": user["_id"]}, update_data)
                
                # Fetch updated user to ensure all fields are present
                updated_user = DatabaseService.find_one("users", {"_id": user["_id"]})
                return updated_user
            
            # Create new user
            new_user = {
                "google_id": google_user_info['google_id'],
                "username": google_user_info['email'].split('@')[0],  # Use email prefix as username
                "email": google_user_info['email'],
                "name": google_user_info['name'],
                "picture": google_user_info.get('picture'),
                "email_verified": google_user_info.get('email_verified', False),
                "is_active": True,
                "auth_provider": "google",
                "created_at": datetime.datetime.utcnow(),
                "last_login": datetime.datetime.utcnow()
            }
            
            print(f"DEBUG: Creating new user: {new_user}")
              # Make username unique if it already exists
            existing_user = DatabaseService.find_one("users", {"username": new_user["username"]})
            counter = 1
            original_username = new_user["username"]
            while existing_user:
                new_user["username"] = f"{original_username}{counter}"
                existing_user = DatabaseService.find_one("users", {"username": new_user["username"]})
                counter += 1
            
            print(f"DEBUG: Final username after uniqueness check: {new_user['username']}")
            
            user_id = DatabaseService.insert_one("users", new_user)
            new_user["_id"] = user_id
            
            print(f"DEBUG: User created successfully with ID: {new_user['_id']}")
            return new_user
            
        except Exception as e:
            print(f"DEBUG: Error in get_or_create_user: {str(e)}")
            raise Exception(f"Failed to get or create user: {str(e)}")
    
    def generate_jwt_token(self, user):
        """Generate JWT token for authenticated user"""
        try:
            # Debug: Print user object to see what's missing
            print(f"DEBUG: User object: {user}")
            print(f"DEBUG: User keys: {list(user.keys()) if user else 'User is None'}")
            
            # Check if required fields exist
            if not user:
                raise Exception("User object is None")
            
            if "_id" not in user:
                raise Exception("User missing '_id' field")
                
            if "email" not in user:
                raise Exception("User missing 'email' field")
                
            # Ensure username exists, use email prefix as fallback
            username = user.get("username")
            if not username:
                username = user["email"].split('@')[0]
                print(f"DEBUG: Username missing, using email prefix: {username}")
            
            payload = {
                "user_id": str(user["_id"]),
                "email": user["email"],
                "username": username,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
            }
            
            secret_key = os.getenv("JWT_SECRET_KEY", "your-secret-key")
            token = jwt.encode(payload, secret_key, algorithm="HS256")
            
            return token
            
        except Exception as e:
            print(f"DEBUG: JWT generation error: {str(e)}")
            raise Exception(f"Failed to generate JWT token: {str(e)}")