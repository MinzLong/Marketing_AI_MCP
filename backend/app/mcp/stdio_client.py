import json
import subprocess
import threading
import time
import uuid
from typing import Any, Dict, Optional


class StdioMcpClient:
    def __init__(
        self,
        name: str,
        command: str,
        args: Optional[list] = None,
        env: Optional[Dict[str, str]] = None,
        cwd: Optional[str] = None,
        timeout: float = 30.0,
    ) -> None:
        self.name = name
        self.command = command
        self.args = args or []
        self.env = env or {}
        self.cwd = cwd
        self.timeout = timeout
        self._process = None
        self._lock = threading.Lock()
        self._cond = threading.Condition()
        self._responses: Dict[str, Dict[str, Any]] = {}
        self._reader = None

    def _ensure_process(self) -> None:
        if self._process and self._process.poll() is None:
            return

        self._process = subprocess.Popen(
            [self.command, *self.args],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            cwd=self.cwd,
            env={**subprocess.os.environ, **self.env},
        )
        self._reader = threading.Thread(target=self._read_loop, daemon=True)
        self._reader.start()

    def _read_loop(self) -> None:
        while True:
            if not self._process or not self._process.stdout:
                break
            line = self._process.stdout.readline()
            if not line:
                break
            try:
                payload = json.loads(line)
            except json.JSONDecodeError:
                continue
            response_id = payload.get("id")
            if not response_id:
                continue
            with self._cond:
                self._responses[str(response_id)] = payload
                self._cond.notify_all()

    def _send(self, method: str, params: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        if not self.command:
            return {"ok": False, "error": "missing_command"}

        self._ensure_process()
        request_id = str(uuid.uuid4())
        payload = {
            "jsonrpc": "2.0",
            "id": request_id,
            "method": method,
            "params": params or {},
        }

        if not self._process or not self._process.stdin:
            return {"ok": False, "error": "process_not_running"}

        with self._lock:
            self._process.stdin.write(json.dumps(payload) + "\n")
            self._process.stdin.flush()

        deadline = time.time() + self.timeout
        with self._cond:
            while request_id not in self._responses:
                remaining = deadline - time.time()
                if remaining <= 0:
                    return {"ok": False, "error": "timeout"}
                self._cond.wait(timeout=remaining)
            return self._responses.pop(request_id)

    def ping(self) -> Dict[str, Any]:
        return self._send("ping", {})

    def call(self, method: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        return self._send(method, params)

    def tool_call(self, tool_name: str, arguments: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        return self._send("tools/call", {"name": tool_name, "arguments": arguments or {}})
