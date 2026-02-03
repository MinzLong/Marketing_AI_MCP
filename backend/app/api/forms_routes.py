from flask import Blueprint, jsonify, request

from ..services.form_generation_service import create_form_from_blueprint, generate_form_blueprint

forms_bp = Blueprint("forms", __name__)


@forms_bp.post("/forms/generate")
def generate_form():
    payload = request.get_json(silent=True) or {}
    draft = generate_form_blueprint(payload)
    if not draft.get("ok"):
        return jsonify(draft), 400

    created = create_form_from_blueprint(draft["blueprint"])
    if not created.get("ok"):
        return jsonify(created), 500

    return jsonify(created)
