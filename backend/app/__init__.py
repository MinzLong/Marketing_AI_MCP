from dotenv import load_dotenv
from flask import Flask, jsonify
from pymongo import MongoClient

from .config import Config
from .extensions import cors
from .api import api_bp


def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config.from_object(Config)    # Initialize CORS with explicit configuration
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": app.config["CORS_ORIGINS"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })# Initialize MongoDB
    if app.config["MONGODB_URI"]:
        try:
            mongo_client = MongoClient(
                app.config["MONGODB_URI"],
                tls=True,
                tlsAllowInvalidCertificates=True,  # More permissive for development
                serverSelectionTimeoutMS=10000,
                connectTimeoutMS=10000,
                socketTimeoutMS=10000
            )
            mongo_client.admin.command('ping')
            app.db = mongo_client[app.config["MONGODB_DATABASE"]]
            print(f"✅ Connected to MongoDB database: {app.config['MONGODB_DATABASE']}")
        except Exception as e:
            print(f"❌ Failed to connect to MongoDB: {e}")
            app.db = None
    else:
        print("⚠️  No MongoDB URI provided")
        app.db = None
      # Add a root route
    @app.route("/")
    def index():
        db_status = "connected" if app.db is not None else "not connected"
        return jsonify({
            "message": "Marketing AI MCP Backend API",
            "version": "1.0.0",
            "database": db_status,
            "endpoints": {
                "health": "/api/health",
                "hello": "/api/hello?name=YourName",
                "users": {
                    "get_all": "/api/users",
                    "create": "POST /api/users",
                    "get_by_id": "/api/users/<id>",
                    "update": "PUT /api/users/<id>",
                    "delete": "DELETE /api/users/<id>"
                }
            }
        })
    
    app.register_blueprint(api_bp)

    return app
