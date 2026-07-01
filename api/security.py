"""
Password hashing and stateless admin tokens — stdlib only (no native deps).

- Passwords: PBKDF2-HMAC-SHA256 with a per-user random salt.
- Tokens: compact HMAC-signed payload (mini-JWT) with an expiry, signed with
  SECRET_KEY. No server-side session store needed.
"""
import os
import hmac
import json
import time
import base64
import hashlib
import secrets

_DEFAULT_SECRET = "dev-insecure-change-me-in-production"
SECRET_KEY = os.environ.get("SECRET_KEY", _DEFAULT_SECRET)
_PBKDF2_ITERATIONS = 200_000
TOKEN_TTL_SECONDS = 60 * 60 * 8  # 8 hours

# A known secret means anyone can forge admin tokens. Refuse to run with the
# throwaway dev secret in a deployed (Vercel) environment — fail loudly at
# import time rather than silently accepting forged sessions in production.
if SECRET_KEY == _DEFAULT_SECRET and os.environ.get("VERCEL"):
    raise RuntimeError(
        "SECRET_KEY is not set in production. Configure a strong random "
        "SECRET_KEY environment variable before deploying."
    )


# ── password hashing ────────────────────────────────────────────────────────
def hash_password(password: str) -> str:
    salt = os.urandom(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, _PBKDF2_ITERATIONS)
    return (
        f"pbkdf2_sha256${_PBKDF2_ITERATIONS}$"
        f"{base64.b64encode(salt).decode()}${base64.b64encode(dk).decode()}"
    )


def verify_password(password: str, stored: str) -> bool:
    if not stored:
        return False
    # Legacy plaintext (pre-hashing) accounts — compared in constant time.
    if not stored.startswith("pbkdf2_sha256$"):
        return hmac.compare_digest(password, stored)
    try:
        _, iters, salt_b64, hash_b64 = stored.split("$")
        salt = base64.b64decode(salt_b64)
        expected = base64.b64decode(hash_b64)
        dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, int(iters))
        return hmac.compare_digest(dk, expected)
    except Exception:
        return False


def needs_rehash(stored: str) -> bool:
    """True for legacy plaintext passwords that should be upgraded on next login."""
    return not (stored or "").startswith("pbkdf2_sha256$")


# ── invite codes ────────────────────────────────────────────────────────────
def generate_invite_code() -> str:
    """High-entropy, URL-safe one-time invite code (~72 bits)."""
    return secrets.token_urlsafe(9)


def hash_invite(code: str) -> str:
    """Store only the hash so a DB leak never exposes usable invite codes.
    Codes are already high-entropy, so a plain SHA-256 is sufficient here."""
    return hashlib.sha256(code.encode()).hexdigest()


# ── signed tokens ───────────────────────────────────────────────────────────
def _b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode().rstrip("=")


def _b64url_decode(s: str) -> bytes:
    return base64.urlsafe_b64decode(s + "=" * (-len(s) % 4))


def create_token(username: str, bankname: str) -> str:
    payload = {
        "sub": username,
        "bank": bankname,
        "exp": int(time.time()) + TOKEN_TTL_SECONDS,
    }
    body = _b64url(json.dumps(payload, separators=(",", ":")).encode())
    sig = hmac.new(SECRET_KEY.encode(), body.encode(), hashlib.sha256).digest()
    return f"{body}.{_b64url(sig)}"


def verify_token(token: str) -> dict:
    try:
        body, sig = token.split(".")
    except (ValueError, AttributeError):
        raise ValueError("malformed token")
    expected = hmac.new(SECRET_KEY.encode(), body.encode(), hashlib.sha256).digest()
    if not hmac.compare_digest(_b64url(expected), sig):
        raise ValueError("bad signature")
    payload = json.loads(_b64url_decode(body))
    if payload.get("exp", 0) < int(time.time()):
        raise ValueError("token expired")
    return payload
