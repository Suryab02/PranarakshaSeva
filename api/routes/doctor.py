from fastapi import APIRouter, Query
from api.database import get_db
from api.models import DoctorCreate

router = APIRouter()


def serialize(doc) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


@router.get("/")
async def get_doctors(city: str = Query(...)):
    db = get_db()
    docs = await db["doctors"].find({"city": city}).to_list(100)
    return [serialize(d) for d in docs]


@router.post("/", status_code=201)
async def add_doctor(body: DoctorCreate):
    db = get_db()
    result = await db["doctors"].insert_one(body.model_dump())
    doc = await db["doctors"].find_one({"_id": result.inserted_id})
    return serialize(doc)
