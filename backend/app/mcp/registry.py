import json
import os
from typing import Dict, List

from .stdio_client import StdioMcpClient


def build_clients(config) -> Dict[str, StdioMcpClient]:
    clients = {}

    if config.get("MCP_GOOGLE_FORMS_STDIO_COMMAND"):
        project_root = _project_root()
        clients["google_forms"] = StdioMcpClient(
            name="google_forms",
            command=config.get("MCP_GOOGLE_FORMS_STDIO_COMMAND", ""),
            args=_resolve_args(
                _parse_json_list(config.get("MCP_GOOGLE_FORMS_STDIO_ARGS", "")),
                project_root,
            ),
            env=_parse_json_dict(config.get("MCP_GOOGLE_FORMS_STDIO_ENV", "")),
            cwd=_resolve_path(config.get("MCP_GOOGLE_FORMS_STDIO_CWD", None), project_root),
        )

    return clients


def _parse_json_list(value: str) -> list:
    if not value:
        return []
    try:
        parsed = json.loads(value)
        return parsed if isinstance(parsed, list) else []
    except json.JSONDecodeError:
        return []


def _parse_json_dict(value: str) -> dict:
    if not value:
        return {}
    try:
        parsed = json.loads(value)
        return parsed if isinstance(parsed, dict) else {}
    except json.JSONDecodeError:
        return {}


def _project_root() -> str:
    return os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))


def _resolve_path(value: str | None, base: str) -> str | None:
    if not value:
        return value
    if os.path.isabs(value):
        return value
    return os.path.normpath(os.path.join(base, value))


def _resolve_args(args: List[str], base: str) -> List[str]:
    resolved = []
    for arg in args:
        if isinstance(arg, str) and not os.path.isabs(arg) and ("/" in arg or "\\" in arg):
            resolved.append(os.path.normpath(os.path.join(base, arg)))
        else:
            resolved.append(arg)
    return resolved
