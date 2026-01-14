from flask import Blueprint, jsonify, request

from ..services.mcp_service import call_mcp, call_mcp_tool, get_mcp_status

mcp_bp = Blueprint("mcp", __name__)


@mcp_bp.get("/mcp/health")
def mcp_health():
    return jsonify(get_mcp_status())


@mcp_bp.post("/mcp/call")
def mcp_call():
    payload = request.get_json(silent=True) or {}
    server = payload.get("server")
    method = payload.get("method")
    params = payload.get("params", {})

    if not server or not method:
        return jsonify({"ok": False, "error": "missing_server_or_method"}), 400

    result = call_mcp(server, method, params)
    return jsonify(result)


@mcp_bp.post("/mcp/tool")
def mcp_tool():
    payload = request.get_json(silent=True) or {}
    server = payload.get("server")
    tool = payload.get("tool")
    arguments = payload.get("arguments", {})

    if not server or not tool:
        return jsonify({"ok": False, "error": "missing_server_or_tool"}), 400

    result = call_mcp_tool(server, tool, arguments)
    return jsonify(result)
