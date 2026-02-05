import json
from typing import Any, Dict, List

from flask import current_app
from openai import OpenAI

from .mcp_service import call_mcp_tool


def _build_prompt(topic: str, audience: str, language: str, num_questions: int) -> List[Dict[str, str]]:
    system = (
        "You generate survey form blueprints as JSON. "
        "Return ONLY valid JSON with keys: title, description, questions. "
        "Each question has: type ('text' or 'multiple_choice'), title, required, "
        "and for multiple_choice include options array of 3-6 short strings. "
        "Keep wording concise and professional."
    )
    user = (
        f"Topic: {topic}\n"
        f"Audience: {audience}\n"
        f"Language: {language}\n"
        f"Number of questions: {num_questions}\n"
        "Generate a balanced mix of question types."
    )
    return [
        {"role": "system", "content": system},
        {"role": "user", "content": user},
    ]


def generate_form_blueprint(payload: Dict[str, Any]) -> Dict[str, Any]:
    topic = (payload.get("topic") or "").strip()
    audience = (payload.get("audience") or "General").strip()
    language = (payload.get("language") or "Vietnamese").strip()
    num_questions = int(payload.get("num_questions") or 6)

    if not topic:
        return {"ok": False, "error": "missing_topic"}
    if num_questions < 1:
        num_questions = 1
    if num_questions > 20:
        num_questions = 20

    client = OpenAI(api_key=current_app.config.get("OPENAI_API_KEY"))
    response = client.responses.create(
        model=current_app.config.get("OPENAI_MODEL"),
        input=_build_prompt(topic, audience, language, num_questions),
        temperature=current_app.config.get("OPENAI_TEMPERATURE"),
        max_output_tokens=current_app.config.get("OPENAI_MAX_TOKENS"),
    )

    content = response.output_text or ""
    try:
        blueprint = json.loads(content)
    except json.JSONDecodeError:
        return {"ok": False, "error": "invalid_json_from_model", "raw": content}

    return {"ok": True, "blueprint": blueprint}


def _extract_mcp_json(mcp_result: Dict[str, Any]) -> Dict[str, Any]:
    result = mcp_result.get("result", {})
    content = result.get("content", [])
    if not content:
        return {}
    text = content[0].get("text", "")
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {}


def create_form_from_blueprint(blueprint: Dict[str, Any]) -> Dict[str, Any]:
    title = (blueprint.get("title") or "Survey").strip()
    description = (blueprint.get("description") or "").strip()

    create_result = call_mcp_tool(
        "google_forms",
        "create_form",
        {"title": title} if not description else {"title": title},
    )
    form_info = _extract_mcp_json(create_result)
    form_id = form_info.get("formId")
    responder_uri = form_info.get("responderUri")

    if not form_id:
        return {"ok": False, "error": "form_create_failed", "raw": create_result}

    created_questions = []
    for question in blueprint.get("questions", []):
        q_type = question.get("type")
        if q_type == "multiple_choice":
            payload = {
                "formId": form_id,
                "questionTitle": question.get("title"),
                "options": question.get("options", []),
                "required": bool(question.get("required", False)),
            }
            result = call_mcp_tool("google_forms", "add_multiple_choice_question", payload)
        else:
            payload = {
                "formId": form_id,
                "questionTitle": question.get("title"),
                "required": bool(question.get("required", False)),
            }
            result = call_mcp_tool("google_forms", "add_text_question", payload)
        created_questions.append({"question": payload, "result": result})

    return {
        "ok": True,
        "formId": form_id,
        "responderUri": responder_uri,
        "title": title,
        "description": description,
        "questions": created_questions,
    }
