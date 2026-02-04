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

@google_auth_bp.route("/auth/google/register", methods=["POST"])
def google_register():
    """Handle Google OAuth registration - only for new users"""
    try:
        data = request.get_json()
        
        # Handle code-based OAuth flow
        if data.get("code"):
            code = data["code"]
            redirect_uri = data.get("redirect_uri", "http://localhost:5173/auth/google/callback")
            
            # Exchange code for token and get user info
            token_data = google_service.exchange_code_for_token(code, redirect_uri)
            
            # Check if id_token exists in the response
            if "id_token" not in token_data:
                print(f"ERROR: Google Register - Missing id_token, response: {token_data}")
                return jsonify({
                    "success": False,
                    "error": f"Missing id_token in Google response. Response keys: {list(token_data.keys())}"
                }), 400
                
            google_user_info = google_service.verify_google_token(token_data["id_token"])

        # Handle direct user_info (legacy support)
        elif data.get("user_info"):
            user_info = data["user_info"]
            google_user_info = {
                'google_id': user_info.get('id'),
                'email': user_info.get('email'),
                'name': user_info.get('name'),
                'picture': user_info.get('picture'),
                'email_verified': user_info.get('verified_email', False)
            }
        else:
            return jsonify({
                "success": False,
                "error": "Either code or user_info is required"
            }), 400
          # Check if user already exists
        existing_user = google_service.check_user_exists(google_user_info['email'])
        
        if existing_user:
            print(f"ERROR: Google Register - User already exists: {google_user_info['email']}")
            return jsonify({
                "success": False,
                "error": "Email already registered. Please login instead.",
                "error_code": "USER_EXISTS"
            }), 409
        
        # Create new user
        try:
            user = google_service.create_google_user(google_user_info)
        except Exception as create_error:
            print(f"ERROR: Google Register - User creation failed: {str(create_error)}")
            return jsonify({
                "success": False,
                "error": f"User creation failed: {str(create_error)}"
            }), 500
        
        # Generate JWT token
        try:
            jwt_token = google_service.generate_jwt_token(user)
        except Exception as jwt_error:
            print(f"ERROR: Google Register - JWT generation failed: {str(jwt_error)}")
            return jsonify({
                "success": False,
                "error": f"Token generation failed: {str(jwt_error)}"
            }), 500
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
            "message": "Registration successful",
            "token": jwt_token,
            "user": user_response
        })
        
    except Exception as e:
        print(f"ERROR: Google Register - Exception: {str(e)}")
        print(f"ERROR: Google Register - Exception type: {type(e)}")
        import traceback
        print(f"ERROR: Google Register - Traceback: {traceback.format_exc()}")
        return jsonify({
            "success": False,
            "error": f"Registration failed: {str(e)}"
        }), 500

@google_auth_bp.route("/auth/google/login", methods=["POST"])
def google_login():
    """Handle Google OAuth login - only for existing users"""
    try:
        data = request.get_json()
        
        # Handle code-based OAuth flow
        if data.get("code"):
            code = data["code"]
            redirect_uri = data.get("redirect_uri", "http://localhost:5173/auth/google/callback")
            
            # Exchange code for token and get user info
            token_data = google_service.exchange_code_for_token(code, redirect_uri)
            
            # Check if id_token exists in the response
            if "id_token" not in token_data:
                print(f"ERROR: Google Login - Missing id_token, response: {token_data}")
                return jsonify({
                    "success": False,
                    "error": f"Missing id_token in Google response. Response keys: {list(token_data.keys())}"
                }), 400
                
            google_user_info = google_service.verify_google_token(token_data["id_token"])
            
        # Handle direct user_info (legacy support)
        elif data.get("user_info"):
            user_info = data["user_info"]
            google_user_info = {
                'google_id': user_info.get('id'),
                'email': user_info.get('email'),
                'name': user_info.get('name'),
                'picture': user_info.get('picture'),
                'email_verified': user_info.get('verified_email', False)
            }
        else:
            return jsonify({
                "success": False,
                "error": "Either code or user_info is required"
            }), 400
          # Check if user exists
        try:
            user = google_service.authenticate_google_user(google_user_info)
        except Exception as auth_error:
            print(f"ERROR: Google Login - User authentication failed: {str(auth_error)}")
            return jsonify({
                "success": False,
                "error": f"User authentication failed: {str(auth_error)}"
            }), 500
        
        if not user:
            print(f"ERROR: Google Login - No account found for: {google_user_info['email']}")
            return jsonify({
                "success": False,
                "error": "No account found with this email. Please register first.",
                "error_code": "USER_NOT_FOUND"
            }), 404
        
        # Generate JWT token
        try:
            jwt_token = google_service.generate_jwt_token(user)
        except Exception as jwt_error:
            print(f"ERROR: Google Login - JWT generation failed: {str(jwt_error)}")
            return jsonify({
                "success": False,
                "error": f"Token generation failed: {str(jwt_error)}"
            }), 500
        
        # Prepare user data for response
        user_response = {
            "id": str(user["_id"]),
            "username": user["username"],            "email": user["email"],
            "name": user["name"],
            "picture": user.get("picture"),
            "auth_provider": user.get("auth_provider", "google")
        }
        
        return jsonify({
            "success": True,
            "message": "Login successful",
            "token": jwt_token,
            "user": user_response
        })
        
    except Exception as e:
        print(f"ERROR: Google Login - Exception: {str(e)}")
        print(f"ERROR: Google Login - Exception type: {type(e)}")
        import traceback
        print(f"ERROR: Google Login - Traceback: {traceback.format_exc()}")
        return jsonify({
            "success": False,
            "error": f"Login failed: {str(e)}"
        }), 500

@google_auth_bp.route("/auth/google/callback", methods=["POST"])
def google_callback():
    """Handle Google OAuth callback (legacy endpoint for code-based flow)"""
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
        
        # For backward compatibility, try to authenticate existing user first
        user = google_service.authenticate_google_user(google_user_info)
        
        # If user doesn't exist, create new one
        if not user:
            user = google_service.create_google_user(google_user_info)
        
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
        print(f"ERROR: Google Login - Exception: {str(e)}")
        print(f"ERROR: Google Login - Exception type: {type(e)}")
        import traceback
        print(f"ERROR: Google Login - Traceback: {traceback.format_exc()}")
        return jsonify({
            "success": False,
            "error": f"Login failed: {str(e)}"
        }), 500

@google_auth_bp.route("/auth/google/debug", methods=["GET"])
def google_debug():
    """Debug endpoint to help troubleshoot OAuth issues"""
    return jsonify({
        "success": True,
        "debug_info": {
            "client_id": google_service.client_id[:20] + "..." if google_service.client_id else "NOT_SET",
            "redirect_uri": google_service.redirect_uri,
            "backend_url": "http://localhost:8000",
            "frontend_expected_callback": "http://localhost:5173/auth/google/callback"
        }
    })
