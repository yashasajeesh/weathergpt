import time

_cache = {}
CACHE_TTL_SECONDS = 600  # 10 minutes

def get_cached(key: str):
    entry = _cache.get(key)
    if entry is None:
        return None
    timestamp, data = entry
    if time.time() - timestamp > CACHE_TTL_SECONDS:
        del _cache[key]
        return None
    return data

def set_cached(key: str, data):
    _cache[key] = (time.time(), data)
