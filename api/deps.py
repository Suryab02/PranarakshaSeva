"""Shared FastAPI dependencies."""
from fastapi import Header, HTTPException
from api.security import verify_token


def require_admin(authorization: str = Header(default="")) -> dict:
    """Validate the Bearer token and return its payload ({sub, bank, exp})."""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    try:
        return verify_token(authorization[7:])
    except ValueError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")
