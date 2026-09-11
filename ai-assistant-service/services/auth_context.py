from contextvars import ContextVar

_token = ContextVar("token", default=None)

def set_token(token: str):
    _token.set(token)

def get_token():
    return _token.get()

def clear_token():
    _token.set(None)