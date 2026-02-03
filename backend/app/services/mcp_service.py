from typing import Any, Dict

from flask import current_app

from app.mcp.registry import build_clients


def get_mcp_status() -> Dict[str, Any]:
    clients = build_clients(current_app.config)
    status = {}
    for name, client in clients.items():
        status[name] = client.ping()
    return status


def call_mcp(server: str, method: str, params: Dict[str, Any]) -> Dict[str, Any]:
    clients = build_clients(current_app.config)
    client = clients.get(server)
    if not client:
        return {"ok": False, "error": "unknown_server"}
    return client.call(method, params)


def call_mcp_tool(server: str, tool: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    clients = build_clients(current_app.config)
    client = clients.get(server)
    if not client:
        return {"ok": False, "error": "unknown_server"}
    if not hasattr(client, "tool_call"):
        return {"ok": False, "error": "tool_call_not_supported"}
    return client.tool_call(tool, arguments)
