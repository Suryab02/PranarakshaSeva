from fastapi import APIRouter, Query
from api.database import get_db
from api.models import AmbulanceCreate

router = APIRouter()


def serialize(doc) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


@router.get("")
async def get_ambulances(city: str = Query(...)):
    db = get_db()
    docs = await db["ambulances"].find({"city": city}).to_list(100)
    return [serialize(d) for d in docs]


@router.post("", status_code=201)
async def add_ambulance(body: AmbulanceCreate):
    db = get_db()
    result = await db["ambulances"].insert_one(body.model_dump())
    doc = await db["ambulances"].find_one({"_id": result.inserted_id})
    return serialize(doc)
