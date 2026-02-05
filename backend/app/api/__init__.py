from flask import Blueprint

from .users_routes import users_bp
from .login import login_bp
from .register import register_bp
from .google_auth import google_auth_bp
from .mcp_routes import mcp_bp

api_bp = Blueprint("api", __name__, url_prefix="/api")
api_bp.register_blueprint(users_bp)
api_bp.register_blueprint(login_bp)
api_bp.register_blueprint(register_bp)
api_bp.register_blueprint(google_auth_bp)
api_bp.register_blueprint(mcp_bp)
