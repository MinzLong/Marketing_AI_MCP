from flask import Blueprint, request, jsonify
import bcrypt
import jwt
import datetime
from bson import ObjectId
from ..services.database_service import DatabaseService

login_bp = Blueprint("login", __name__)


@login_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        
        # Accept both username and email fields for flexibility
        username_or_email = data.get("username") or data.get("email")
        password = data.get("password")
        
        if not data or not username_or_email or not password:
            return jsonify({
                "success": False,
                "error": "Username/email and password are required"
            }), 400
          # Try to find user by username first, then by email
        user = None
        if "@" in username_or_email:
            # Looks like an email
            email = username_or_email.lower().strip()
            user = DatabaseService.find_one("users", {"email": email})
        else:
            # Looks like a username, try both username and email fields
            username = username_or_email.strip()
            user = DatabaseService.find_one("users", {"username": username})
            if not user:
                user = DatabaseService.find_one("users", {"email": username.lower()})
        
        if not user:
            return jsonify({
                "success": False,
                "error": "Invalid username/email or password"
            }), 401
        
        # Check if user account is active
        if not user.get("is_active", True):
            return jsonify({
                "success": False,
                "error": "Account is disabled"
            }), 401
        
        if not bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
            return jsonify({
                "success": False,
                "error": "Invalid username/email or password"
            }), 401
        
        # Create JWT token
        secret_key = "your-secret-key-change-this-in-production"  # TODO: Move to config
        token_payload = {
            "user_id": user["_id"],
            "email": user.get("email", ""),
            "username": user.get("username", ""),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        
        # Fix: Use jwt.encode() instead of jwt()
        token = jwt.encode(token_payload, secret_key, algorithm="HS256")
        
        # Remove password from user data
        user_data = {k: v for k, v in user.items() if k != "password"}
        
        return jsonify({
            "success": True,
            "message": "Login successful",
            "token": token,
            "user": user_data
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Login failed: {str(e)}"
        }), 500


@login_bp.route("/verify-token", methods=["POST"])
def verify_token():
    """Verify JWT token endpoint"""
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({
                "success": False,
                "error": "No valid token provided"
            }), 401
        
        token = auth_header.split(" ")[1]
        secret_key = "your-secret-key-change-this"  # TODO: Move to config
        
        try:
            payload = jwt.decode(token, secret_key, algorithms=["HS256"])
            user_id = payload["user_id"]
            
            # Get fresh user data
            user = DatabaseService.find_one("users", {"_id": ObjectId(user_id)})
            if not user:
                return jsonify({
                    "success": False,
                    "error": "User not found"
                }), 401
            
            # Remove password from user data
            user_data = {k: v for k, v in user.items() if k != "password"}
            
            return jsonify({
                "success": True,
                "user": user_data
            }), 200
            
        except jwt.ExpiredSignatureError:
            return jsonify({
                "success": False,
                "error": "Token has expired"
            }), 401
        except jwt.InvalidTokenError:
            return jsonify({
                "success": False,
                "error": "Invalid token"
            }), 401
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Token verification failed: {str(e)}"
        }), 500

