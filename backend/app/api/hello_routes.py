from flask import Blueprint, jsonify, request

from ..services.hello_service import build_hello_message

hello_bp = Blueprint("hello", __name__)


@hello_bp.get("/hello")
def hello():
    name = request.args.get("name", "World")
    return jsonify(message=build_hello_message(name))
