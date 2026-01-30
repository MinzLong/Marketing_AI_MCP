from flask import Blueprint, request, jsonify
from bson import ObjectId
from ..services.database_service import DatabaseService

users_bp = Blueprint("users", __name__)


@users_bp.route("/users", methods=["GET"])
def get_users():
    """Get all users"""
    try:
        users = DatabaseService.find_many("users")
        return jsonify({"success": True, "data": users}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@users_bp.route("/users", methods=["POST"])
def create_user():
    """Create a new user"""
    try:
        data = request.get_json()
        
        # Basic validation
        if not data or not data.get("name") or not data.get("email"):
            return jsonify({
                "success": False, 
                "error": "Name and email are required"
            }), 400
        
        # Check if user already exists
        existing_user = DatabaseService.find_one("users", {"email": data["email"]})
        if existing_user:
            return jsonify({
                "success": False, 
                "error": "User with this email already exists"
            }), 409
        
        # Insert new user
        user_id = DatabaseService.insert_one("users", data)
        return jsonify({
            "success": True, 
            "message": "User created successfully",
            "user_id": user_id
        }), 201
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@users_bp.route("/users/<user_id>", methods=["GET"])
def get_user(user_id):
    """Get a specific user by ID"""
    try:
        if not ObjectId.is_valid(user_id):
            return jsonify({"success": False, "error": "Invalid user ID"}), 400
            
        user = DatabaseService.find_one("users", {"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"success": False, "error": "User not found"}), 404
            
        return jsonify({"success": True, "data": user}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@users_bp.route("/users/<user_id>", methods=["PUT"])
def update_user(user_id):
    """Update a specific user"""
    try:
        if not ObjectId.is_valid(user_id):
            return jsonify({"success": False, "error": "Invalid user ID"}), 400
            
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
        
        # Remove _id from update data if present
        data.pop("_id", None)
        
        modified_count = DatabaseService.update_one("users", {"_id": ObjectId(user_id)}, data)
        
        if modified_count == 0:
            return jsonify({"success": False, "error": "User not found or no changes made"}), 404
            
        return jsonify({"success": True, "message": "User updated successfully"}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@users_bp.route("/users/<user_id>", methods=["DELETE"])
def delete_user(user_id):
    """Delete a specific user"""
    try:
        if not ObjectId.is_valid(user_id):
            return jsonify({"success": False, "error": "Invalid user ID"}), 400
            
        deleted_count = DatabaseService.delete_one("users", {"_id": ObjectId(user_id)})
        
        if deleted_count == 0:
            return jsonify({"success": False, "error": "User not found"}), 404
            
        return jsonify({"success": True, "message": "User deleted successfully"}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
