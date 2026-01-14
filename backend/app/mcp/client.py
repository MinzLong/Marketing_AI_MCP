from typing import Any, Dict, Optional

import httpx


class McpServerClient:
    def __init__(
        self,
        name: str,
        base_url: str,
        token: str = "",
        rpc_path: str = "/rpc",
        health_path: str = "/health",
        timeout: float = 10.0,
    ) -> None:
        self.name = name
        self.base_url = base_url.rstrip("/")
        self.token = token
        self.rpc_path = rpc_path
        self.health_path = health_path
        self.timeout = timeout

    def _headers(self) -> Dict[str, str]:
        if not self.token:
            return {"Content-Type": "application/json"}
        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.token}",
        }

    def _url(self, path: str) -> str:
        if not path:
            return self.base_url
        if not path.startswith("/"):
            path = f"/{path}"
        return f"{self.base_url}{path}"

    def ping(self) -> Dict[str, Any]:
        if not self.base_url:
            return {"ok": False, "error": "missing_base_url"}

        if self.health_path:
            try:
                response = httpx.get(
                    self._url(self.health_path),
                    headers=self._headers(),
                    timeout=self.timeout,
                )
                return {
                    "ok": response.status_code < 400,
                    "status_code": response.status_code,
                }
            except httpx.HTTPError as exc:
                return {"ok": False, "error": str(exc)}

        return self.call("ping", {})

    def call(self, method: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        if not self.base_url:
            return {"ok": False, "error": "missing_base_url"}

        payload = {
            "jsonrpc": "2.0",
            "id": "mcp-call",
            "method": method,
            "params": params or {},
        }
        try:
            response = httpx.post(
                self._url(self.rpc_path),
                headers=self._headers(),
                json=payload,
                timeout=self.timeout,
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as exc:
            return {"ok": False, "error": str(exc)}
