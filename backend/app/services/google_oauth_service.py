import os
import requests
from dotenv import load_dotenv
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from google.auth import exceptions
import jwt
import datetime
from .database_service import DatabaseService

# Load environment variables at module import
load_dotenv()

class GoogleOAuthService:
    
    def __init__(self):
        self.client_id = os.getenv('GOOGLE_CLIENT_ID')
        self.client_secret = os.getenv('GOOGLE_CLIENT_SECRET')
        self.redirect_uri = os.getenv('GOOGLE_REDIRECT_URI', 'http://localhost:5173/auth/google/callback')
        
    
    def get_google_auth_url(self):
        auth_url = (
            f"https://accounts.google.com/o/oauth2/v2/auth"
            f"?client_id={self.client_id}"
            f"&redirect_uri={self.redirect_uri}"
            f"&scope=openid email profile"
            f"&response_type=code"
            f"&access_type=offline"
        )
        return auth_url
    
    def exchange_code_for_token(self, code, redirect_uri=None):
        try:
            if redirect_uri is None:
                redirect_uri = self.redirect_uri
                
            token_url = "https://oauth2.googleapis.com/token"
            data = {
                'client_id': self.client_id,
                'client_secret': self.client_secret,
                'code': code,
                'grant_type': 'authorization_code',
                'redirect_uri': redirect_uri,
            }
            response = requests.post(token_url, data=data)
            token_data = response.json()
            
            if response.status_code != 200:
                raise Exception(f"Token exchange failed: {token_data}")
                
            return token_data
        except Exception as e:
            raise Exception(f"Failed to exchange code for token: {str(e)}")
    
    def verify_google_token(self, id_token_str):
        try:
            # Add clock skew tolerance of 300 seconds (5 minutes) to handle time sync issues
            idinfo = id_token.verify_oauth2_token(
                id_token_str, 
                google_requests.Request(), 
                self.client_id,
                clock_skew_in_seconds=300  # Allow 5 minutes clock skew
            )
            
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
    
    def check_user_exists(self, email):
        """Check if a user already exists with the given email"""
        try:
            user = DatabaseService.find_one("users", {"email": email})
            return user is not None
        except Exception as e:
            return False

    def create_google_user(self, google_user_info):
        """Create a new user from Google OAuth info"""
        try:
            new_user = {
                "google_id": google_user_info['google_id'],
                "username": google_user_info['email'].split('@')[0],
                "email": google_user_info['email'],
                "name": google_user_info['name'],
                "picture": google_user_info.get('picture'),
                "email_verified": google_user_info.get('email_verified', False),
                "is_active": True,
                "auth_provider": "google",
                "created_at": datetime.datetime.utcnow(),
                "last_login": datetime.datetime.utcnow()
            }
            
            # Ensure username uniqueness
            existing_user = DatabaseService.find_one("users", {"username": new_user["username"]})
            counter = 1
            original_username = new_user["username"]
            while existing_user:
                new_user["username"] = f"{original_username}{counter}"
                existing_user = DatabaseService.find_one("users", {"username": new_user["username"]})
                counter += 1
            
            user_id = DatabaseService.insert_one("users", new_user)
            new_user["_id"] = user_id
            
            return new_user
            
        except Exception as e:
            raise Exception(f"Failed to create user: {str(e)}")

    def authenticate_google_user(self, google_user_info):
        """Authenticate existing Google user and update login info"""
        try:
            # First try to find by google_id
            user = DatabaseService.find_one("users", {"google_id": google_user_info['google_id']})
            
            if not user:
                # Then try to find by email
                user = DatabaseService.find_one("users", {"email": google_user_info['email']})
            
            if not user:
                return None
            
            # Update user info and last login
            update_data = {
                "last_login": datetime.datetime.utcnow(),
                "name": google_user_info['name'],
                "picture": google_user_info.get('picture')
            }
            
            # If user didn't have google_id, add it
            if "google_id" not in user or not user["google_id"]:
                update_data["google_id"] = google_user_info['google_id']
                update_data["auth_provider"] = "google"
            
            DatabaseService.update_one("users", {"_id": user["_id"]}, update_data)
            
            updated_user = DatabaseService.find_one("users", {"_id": user["_id"]})
            return updated_user
            
        except Exception as e:
            raise Exception(f"Failed to authenticate user: {str(e)}")

    def generate_jwt_token(self, user):
        try:
            
            if not user:
                raise Exception("User object is None")
            
            if "_id" not in user:
                raise Exception("User missing '_id' field")
                
            if "email" not in user:
                raise Exception("User missing 'email' field")
                
            username = user.get("username")
            if not username:
                username = user["email"].split('@')[0]
            
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
            raise Exception(f"Failed to generate JWT token: {str(e)}")