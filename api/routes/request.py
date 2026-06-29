import re
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel, field_validator
from api.database import get_db

router = APIRouter()

VALID_BLOOD  = {'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'}
VALID_CITIES = {'Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi', 'Pune', 'Goa', 'Vizag'}
VALID_URGENCY = {'normal', 'critical'}

PHONE_RE = re.compile(r'^\d{10}$')
SAFE_TEXT_RE = re.compile(r'[<>"\']')          # block HTML-injection chars in free text


class BloodRequestCreate(BaseModel):
    name: str
    blood_type: str
    city: str
    contact: str
    urgency: str = 'normal'
    message: str = ''

    @field_validator('name')
    @classmethod
    def clean_name(cls, v: str) -> str:
        v = SAFE_TEXT_RE.sub('', v).strip()
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

    @field_validator('urgency')
    @classmethod
    def valid_urgency(cls, v: str) -> str:
        return v if v in VALID_URGENCY else 'normal'

    @field_validator('message')
    @classmethod
    def clean_message(cls, v: str) -> str:
        v = SAFE_TEXT_RE.sub('', v).strip()
        return v[:150]                          # hard cap — never trust client


def _serialize(doc: dict) -> dict:
    doc.pop('_id', None)
    if isinstance(doc.get('created_at'), datetime):
        doc['created_at'] = doc['created_at'].isoformat()
    return doc


@router.get('')
async def list_requests(
    city: str = Query(...),
    blood: str = Query(None),
):
    if city not in VALID_CITIES:
        raise HTTPException(400, 'Invalid city')
    if blood and blood not in VALID_BLOOD:
        raise HTTPException(400, 'Invalid blood type')

    db = get_db()
    cutoff = datetime.now(timezone.utc) - timedelta(hours=72)
    query: dict = {'city': city, 'created_at': {'$gt': cutoff}}
    if blood:
        query['blood_type'] = blood

    cursor = db['requests'].find(query, {'_id': 0}).sort('created_at', -1).limit(50)
    docs = await cursor.to_list(50)

    # Mask contact — last 4 digits only; full number stored but never returned in list
    for d in docs:
        full = d.get('contact', '')
        d['contact_masked'] = 'XXXXXX' + full[-4:]
        del d['contact']                        # never expose in list response
        if isinstance(d.get('created_at'), datetime):
            d['created_at'] = d['created_at'].isoformat()

    return docs


@router.post('', status_code=201)
async def create_request(body: BloodRequestCreate):
    db = get_db()

    # Rate-limit: max 3 active requests per phone number per 24 h
    cutoff_24h = datetime.now(timezone.utc) - timedelta(hours=24)
    recent = await db['requests'].count_documents({
        'contact': body.contact,
        'created_at': {'$gt': cutoff_24h},
    })
    if recent >= 3:
        raise HTTPException(
            429,
            'You can post at most 3 requests per day. '
            'Please wait before posting again.',
        )

    doc = {
        **body.model_dump(),
        'created_at': datetime.now(timezone.utc),
    }
    await db['requests'].insert_one(doc)
    return {'status': 'created'}
