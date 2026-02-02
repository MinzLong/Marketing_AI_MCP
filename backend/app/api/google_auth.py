from flask import Blueprint, request, jsonify, redirect
from ..services.google_oauth_service import GoogleOAuthService
import os

google_auth_bp = Blueprint("google_auth", __name__)
google_service = GoogleOAuthService()

@google_auth_bp.route("/auth/google", methods=["GET"])
def google_auth():
    """Initiate Google OAuth flow"""
    try:
        auth_url = google_service.get_google_auth_url()
        return jsonify({
            "success": True,
            "auth_url": auth_url
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@google_auth_bp.route("/auth/google/callback", methods=["POST"])
def google_callback():
    """Handle Google OAuth callback"""
    try:
        data = request.get_json()
        
        if not data or not data.get("code"):
            return jsonify({
                "success": False,
                "error": "Authorization code is required"
            }), 400
        
        # Exchange code for token
        token_data = google_service.exchange_code_for_token(data["code"])
        
        if "id_token" not in token_data:
            return jsonify({
                "success": False,
                "error": "No ID token received from Google"
            }), 400
        
        # Verify token and get user info
        google_user_info = google_service.verify_google_token(token_data["id_token"])
        
        # Get or create user
        user = google_service.get_or_create_user(google_user_info)
        
        # Generate JWT token
        jwt_token = google_service.generate_jwt_token(user)
        
        # Prepare user data for response (exclude sensitive info)
        user_response = {
            "id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"],
            "name": user["name"],
            "picture": user.get("picture"),
            "auth_provider": user.get("auth_provider", "google")
        }
        
        return jsonify({
            "success": True,
            "message": "Authentication successful",
            "token": jwt_token,
            "user": user_response
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Authentication failed: {str(e)}"
        }), 500

@google_auth_bp.route("/auth/google/verify-user", methods=["POST"])
def verify_google_user():
    """Verify Google user info directly (for Google Identity Services)"""
    try:
        data = request.get_json()
        
        if not data or not data.get("user_info"):
            return jsonify({
                "success": False,
                "error": "User info is required"
            }), 400
        
        user_info = data["user_info"]
        
        # Create google_user_info in the expected format
        google_user_info = {
            'google_id': user_info.get('id'),
            'email': user_info.get('email'),
            'name': user_info.get('name'),
            'picture': user_info.get('picture'),
            'email_verified': user_info.get('verified_email', False)
        }
        
        # Get or create user
        user = google_service.get_or_create_user(google_user_info)
        
        # Generate JWT token
        jwt_token = google_service.generate_jwt_token(user)
        
        # Prepare user data for response
        user_response = {
            "id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"],
            "name": user["name"],
            "picture": user.get("picture"),
            "auth_provider": user.get("auth_provider", "google")
        }
        
        return jsonify({
            "success": True,
            "message": "Authentication successful",
            "token": jwt_token,
            "user": user_response
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"User verification failed: {str(e)}"
        }), 500

@google_auth_bp.route("/auth/google/verify-token", methods=["POST"])
def verify_google_token():
    """Verify Google ID token directly (alternative flow)"""
    try:
        data = request.get_json()
        
        if not data or not data.get("id_token"):
            return jsonify({
                "success": False,
                "error": "ID token is required"
            }), 400
        
        # Verify token and get user info
        google_user_info = google_service.verify_google_token(data["id_token"])
        
        # Get or create user
        user = google_service.get_or_create_user(google_user_info)
        
        # Generate JWT token
        jwt_token = google_service.generate_jwt_token(user)
        
        # Prepare user data for response
        user_response = {
            "id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"],
            "name": user["name"],
            "picture": user.get("picture"),
            "auth_provider": user.get("auth_provider", "google")
        }
        
        return jsonify({
            "success": True,
            "message": "Authentication successful",
            "token": jwt_token,
            "user": user_response
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Token verification failed: {str(e)}"
        }), 500
