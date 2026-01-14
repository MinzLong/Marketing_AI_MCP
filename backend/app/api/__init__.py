from flask import Blueprint

from .health_routes import health_bp
from .hello_routes import hello_bp
from .mcp_routes import mcp_bp

api_bp = Blueprint("api", __name__, url_prefix="/api")
api_bp.register_blueprint(health_bp)
api_bp.register_blueprint(hello_bp)
api_bp.register_blueprint(mcp_bp)
