from flask import Blueprint, request, jsonify
import bcrypt
import re
from datetime import datetime
from ..services.database_service import DatabaseService

register_bp = Blueprint("register", __name__)


def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    
    return True, "Password is valid"


@register_bp.route("/register", methods=["POST"])
def register():
    """User registration endpoint"""
    try:
        data = request.get_json()
        
        # Basic validation
        if not data:            return jsonify({
                "success": False,
                "error": "No data provided"
            }), 400
        
        required_fields = ["name", "email", "password"]
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    "success": False,
                    "error": f"{field.title()} is required"
                }), 400
        
        name = data["name"].strip()
        email = data["email"].lower().strip()
        password = data["password"]
        username = data.get("username", "").strip()  # Optional username field
        
        # Validate email format
        if not validate_email(email):
            return jsonify({
                "success": False,
                "error": "Invalid email format"
            }), 400
        
        # Validate password strength
        is_valid, password_message = validate_password(password)
        if not is_valid:
            return jsonify({
                "success": False,                "error": password_message
            }), 400
        
        # Check if user already exists (by email or username)
        existing_user = DatabaseService.find_one("users", {"email": email})
        if existing_user:
            return jsonify({
                "success": False,
                "error": "User with this email already exists"
            }), 409
            
        # Check username uniqueness if provided
        if username:
            existing_username = DatabaseService.find_one("users", {"username": username})
            if existing_username:
                return jsonify({
                    "success": False,
                    "error": "Username is already taken"                }), 409
        
        # Hash password
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        
        # Create user document
        user_data = {
            "name": name,
            "email": email,
            "password": hashed_password.decode('utf-8'),
            "role": data.get("role", "user"),  # Default role is 'user'
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_active": True
        }
        
        # Add username if provided
        if username:
            user_data["username"] = username
        
        # Insert user
        user_id = DatabaseService.insert_one("users", user_data)
        
        # Return success response (without password)
        response_data = {k: v for k, v in user_data.items() if k != "password"}
        response_data["_id"] = user_id
        
        return jsonify({
            "success": True,
            "message": "User registered successfully",
            "user": response_data
        }), 201
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Registration failed: {str(e)}"
        }), 500


@register_bp.route("/check-email", methods=["POST"])
def check_email_availability():
    """Check if email is available"""
    try:
        data = request.get_json()
        
        if not data or not data.get("email"):
            return jsonify({
                "success": False,
                "error": "Email is required"
            }), 400
        
        email = data["email"].lower().strip()
        
        # Validate email format
        if not validate_email(email):
            return jsonify({
                "success": False,
                "error": "Invalid email format"
            }), 400
        
        # Check if email exists
        existing_user = DatabaseService.find_one("users", {"email": email})
        
        return jsonify({
            "success": True,
            "available": existing_user is None
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Email check failed: {str(e)}"
        }), 500