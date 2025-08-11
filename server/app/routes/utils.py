# routes/utils.py
import os

BASE_URL = os.getenv("BASE_URL", "https://www.saemaeultruck.pics").rstrip("/")


def to_abs_url(path: str | None) -> str | None:
    if not path:
        return path
    if path.startswith("http://") or path.startswith("https://"):
        return path
    return f"{BASE_URL}/{path.lstrip('/')}"
