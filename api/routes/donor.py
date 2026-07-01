from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel, field_validator
from api.database import get_db
from api.constants import VALID_BLOOD, VALID_CITIES, PHONE_RE, clean_text

router = APIRouter()


class DonorCreate(BaseModel):
    name: str
    blood_type: str
    city: str
    contact: str
    available: bool = True

    @field_validator('name')
    @classmethod
    def clean_name(cls, v: str) -> str:
        v = clean_text(v)
        if not 2 <= len(v) <= 60:
            raise ValueError('Name must be 2–60 characters')
        return v

    @field_validator('blood_type')
    @classmethod
    def valid_blood(cls, v: str) -> str:
        if v not in VALID_BLOOD:
            raise ValueError('Invalid blood type')
        return v

    @field_validator('city')
    @classmethod
    def valid_city(cls, v: str) -> str:
        if v not in VALID_CITIES:
            raise ValueError('Invalid city')
        return v

    @field_validator('contact')
    @classmethod
    def valid_contact(cls, v: str) -> str:
        v = v.strip()
        if not PHONE_RE.match(v):
            raise ValueError('Contact must be exactly 10 digits')
        return v


def serialize(doc) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


@router.get("")
async def get_donors(city: str = Query(...), blood: str = Query(None)):
    if city not in VALID_CITIES:
        raise HTTPException(400, "Invalid city")
    if blood and blood not in VALID_BLOOD:
        raise HTTPException(400, "Invalid blood type")
    db = get_db()
    query = {"city": city, "available": True}
    if blood:
        query["blood_type"] = blood
    docs = await db["donors"].find(query).to_list(100)
    return [serialize(d) for d in docs]


@router.post("", status_code=201)
async def register_donor(body: DonorCreate):
    db = get_db()

    # Rate-limit: cap registrations per phone number per 24 h to curb spam.
    cutoff_24h = datetime.now(timezone.utc) - timedelta(hours=24)
    recent = await db["donors"].count_documents({
        "contact": body.contact,
        "created_at": {"$gt": cutoff_24h},
    })
    if recent >= 3:
        raise HTTPException(
            429,
            "You've registered several times recently. Please try again later.",
        )

    doc = {**body.model_dump(), "created_at": datetime.now(timezone.utc)}
    result = await db["donors"].insert_one(doc)
    saved = await db["donors"].find_one({"_id": result.inserted_id})
    return serialize(saved)
