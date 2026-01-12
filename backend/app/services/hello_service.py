def build_hello_message(name: str) -> str:
    safe_name = name.strip() or "World"
    return f"Hello, {safe_name}!"
