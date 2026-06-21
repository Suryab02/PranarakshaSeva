from fastapi import APIRouter, Query
from api.database import get_db
from api.models import DonorCreate

router = APIRouter()


def serialize(doc) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


@router.get("/")
async def get_donors(city: str = Query(...), blood: str = Query(None)):
    db = get_db()
    query = {"city": city, "available": True}
    if blood:
        query["blood_type"] = blood
    docs = await db["donors"].find(query).to_list(100)
    return [serialize(d) for d in docs]


@router.post("/", status_code=201)
async def register_donor(body: DonorCreate):
    db = get_db()
    result = await db["donors"].insert_one(body.model_dump())
    doc = await db["donors"].find_one({"_id": result.inserted_id})
    return serialize(doc)
