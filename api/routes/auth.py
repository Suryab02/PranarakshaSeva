from fastapi import APIRouter, HTTPException
from api.database import get_db
from api.models import LoginRequest, RegisterRequest
from api.security import hash_password, verify_password, create_token, needs_rehash

router = APIRouter()


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


@router.post("/register", status_code=201)
async def register(body: RegisterRequest):
    db = get_db()
    existing = await db["users"].find_one({"username": body.username})
    if existing:
        raise HTTPException(status_code=409, detail="Username already exists")
    doc = body.model_dump()
    doc["password"] = hash_password(body.password)
    await db["users"].insert_one(doc)
    return {"message": "User registered successfully"}
