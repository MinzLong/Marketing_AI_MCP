import json
from typing import Dict

from .client import McpServerClient
from .stdio_client import StdioMcpClient


def build_clients(config) -> Dict[str, McpServerClient]:
    clients = {}

    if config.get("MCP_FACEBOOK_URL"):
        clients["facebook"] = McpServerClient(
            name="facebook",
            base_url=config["MCP_FACEBOOK_URL"],
            token=config.get("MCP_FACEBOOK_TOKEN", ""),
            rpc_path=config.get("MCP_FACEBOOK_RPC_PATH", "/rpc"),
            health_path=config.get("MCP_FACEBOOK_HEALTH_PATH", "/health"),
        )
    elif config.get("MCP_FACEBOOK_STDIO_COMMAND"):
        clients["facebook"] = StdioMcpClient(
            name="facebook",
            command=config.get("MCP_FACEBOOK_STDIO_COMMAND", ""),
            args=_parse_json_list(config.get("MCP_FACEBOOK_STDIO_ARGS", "")),
            env=_parse_json_dict(config.get("MCP_FACEBOOK_STDIO_ENV", "")),
            cwd=config.get("MCP_FACEBOOK_STDIO_CWD", None),
        )

    if config.get("MCP_SLIDES_URL"):
        clients["slides"] = McpServerClient(
            name="slides",
            base_url=config["MCP_SLIDES_URL"],
            token=config.get("MCP_SLIDES_TOKEN", ""),
            rpc_path=config.get("MCP_SLIDES_RPC_PATH", "/rpc"),
            health_path=config.get("MCP_SLIDES_HEALTH_PATH", "/health"),
        )
    elif config.get("MCP_SLIDES_STDIO_COMMAND"):
        clients["slides"] = StdioMcpClient(
            name="slides",
            command=config.get("MCP_SLIDES_STDIO_COMMAND", ""),
            args=_parse_json_list(config.get("MCP_SLIDES_STDIO_ARGS", "")),
            env=_parse_json_dict(config.get("MCP_SLIDES_STDIO_ENV", "")),
            cwd=config.get("MCP_SLIDES_STDIO_CWD", None),
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
