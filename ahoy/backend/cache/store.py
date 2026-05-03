from __future__ import annotations
import time
from typing import Any, Optional


class TTLCache:
    def __init__(self, ttl: int = 1800):
        self._store: dict[str, tuple[Any, float]] = {}
        self._ttl = ttl

    def get(self, key: str) -> Optional[Any]:
        if key not in self._store: return None
        val, exp = self._store[key]
        if time.time() > exp:
            del self._store[key]; return None
        return val

    def set(self, key: str, value: Any) -> None:
        self._store[key] = (value, time.time() + self._ttl)

    def delete(self, key: str) -> None:
        self._store.pop(key, None)

    def size(self) -> int:
        now = time.time()
        for k in [k for k,(_, e) in self._store.items() if now > e]:
            del self._store[k]
        return len(self._store)


profile_cache = TTLCache(ttl=1800)
