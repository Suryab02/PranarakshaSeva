import os
import hmac
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, HTTPException, Header, Depends
from api.database import get_db
from api.models import LoginRequest, RegisterRequest, InviteCreate
from api.security import (
    hash_password, verify_password, create_token, needs_rehash,
    generate_invite_code, hash_invite,
)

router = APIRouter()

INVITE_TTL = timedelta(days=7)


@router.post("/login")
async def login(body: LoginRequest):
    db = get_db()
    user = await db["users"].find_one({"username": body.username})
    if not user or not verify_password(body.password, user.get("password", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Transparently upgrade legacy plaintext passwords to a hash on first login.
    if needs_rehash(user.get("password", "")):
        await db["users"].update_one(
            {"_id": user["_id"]},
            {"$set": {"password": hash_password(body.password)}},
        )

    token = create_token(user["username"], user["bankname"])
    return {"token": token, "bankname": user["bankname"]}


def _require_operator(x_invite_secret: str = Header(default="")):
    """Only the platform operator (who holds ADMIN_INVITE_SECRET) may mint
    invites. If the secret is unset, invite creation is disabled entirely —
    a safe default that prevents anyone from bootstrapping admin accounts."""
    expected = os.environ.get("ADMIN_INVITE_SECRET", "")
    if not expected or not hmac.compare_digest(x_invite_secret, expected):
        raise HTTPException(status_code=403, detail="Not authorized to issue invites")


@router.post("/invite", status_code=201)
async def create_invite(body: InviteCreate, _: None = Depends(_require_operator)):
    bankname = body.bankname.strip()
    if not bankname:
        raise HTTPException(status_code=422, detail="Bank name is required")

    db = get_db()
    if await db["users"].find_one({"bankname": bankname}):
        raise HTTPException(
            status_code=409,
            detail="This blood bank already has an administrator account.",
        )

    code = generate_invite_code()
    now = datetime.now(timezone.utc)
    expires_at = now + INVITE_TTL
    await db["invites"].insert_one({
        "code_hash": hash_invite(code),
        "bankname": bankname,
        "created_at": now,
        "expires_at": expires_at,
        "used_at": None,
    })
    # The plaintext code is returned exactly once, here, for the operator to
    # hand to the bank out-of-band. It is never stored or shown again.
    return {"code": code, "bankname": bankname, "expires_at": expires_at.isoformat()}


@router.post("/register", status_code=201)
async def register(body: RegisterRequest):
    username = body.username.strip()
    code = body.invite_code.strip()
    if len(username) < 3:
        raise HTTPException(status_code=422, detail="Username must be at least 3 characters")
    if len(body.password) < 8:
        raise HTTPException(status_code=422, detail="Password must be at least 8 characters")
    if not code:
        raise HTTPException(status_code=422, detail="An invite code is required")

    db = get_db()
    now = datetime.now(timezone.utc)
    invite = await db["invites"].find_one({"code_hash": hash_invite(code)})
    if not invite or invite.get("used_at"):
        raise HTTPException(status_code=400, detail="Invalid or already-used invite code")

    expires = invite.get("expires_at")
    if expires and expires.tzinfo is None:      # Mongo may hand back naive UTC
        expires = expires.replace(tzinfo=timezone.utc)
    if expires and expires < now:
        raise HTTPException(status_code=400, detail="This invite code has expired")

    bankname = invite["bankname"]
    if await db["users"].find_one({"username": username}):
        raise HTTPException(status_code=409, detail="Username already exists")
    if await db["users"].find_one({"bankname": bankname}):
        raise HTTPException(
            status_code=409,
            detail="This blood bank already has an administrator account.",
        )

    # Atomically claim the invite: the used_at=None filter guarantees only one
    # of two concurrent redemptions of the same code can succeed.
    claimed = await db["invites"].find_one_and_update(
        {"_id": invite["_id"], "used_at": None},
        {"$set": {"used_at": now, "used_by": username}},
    )
    if not claimed:
        raise HTTPException(status_code=400, detail="Invalid or already-used invite code")

    await db["users"].insert_one({
        "username": username,
        "bankname": bankname,
        "password": hash_password(body.password),
    })
    return {"message": "User registered successfully", "bankname": bankname}
