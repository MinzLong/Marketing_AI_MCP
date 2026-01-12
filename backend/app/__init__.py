from dotenv import load_dotenv
from flask import Flask

from .config import Config
from .extensions import cors
from .api import api_bp


def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config.from_object(Config)

    cors.init_app(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})
    app.register_blueprint(api_bp)

    return app
