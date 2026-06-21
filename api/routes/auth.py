from fastapi import APIRouter, HTTPException
from api.database import get_db
from api.models import LoginRequest, RegisterRequest

router = APIRouter()


@router.post("/login")
async def login(body: LoginRequest):
    db = get_db()
    user = await db["users"].find_one({"username": body.username, "password": body.password})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"bankname": user["bankname"]}


@router.post("/register", status_code=201)
async def register(body: RegisterRequest):
    db = get_db()
    existing = await db["users"].find_one({"username": body.username})
    if existing:
        raise HTTPException(status_code=409, detail="Username already exists")
    await db["users"].insert_one(body.model_dump())
    return {"message": "User registered successfully"}
