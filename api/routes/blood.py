from fastapi import APIRouter, Query, Depends
from pymongo import ReturnDocument
from api.database import get_db
from api.models import BloodCreate, BloodUpdate
from api.deps import require_admin

router = APIRouter()


def serialize(doc) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


@router.get("")
async def get_blood(city: str = Query(...), blood: str = Query(None)):
    db = get_db()
    query = {"city": city}
    if blood:
        query["name"] = blood
    docs = await db["bloods"].find(query).to_list(100)
    return [serialize(d) for d in docs]


@router.post("", status_code=201)
async def add_blood(body: BloodCreate):
    db = get_db()
    result = await db["bloods"].insert_one(body.model_dump())
    doc = await db["bloods"].find_one({"_id": result.inserted_id})
    return serialize(doc)


# ── inventory: admin-only, scoped to the authenticated bank ──────────────────
@router.get("/inventory")
async def get_inventory(admin: dict = Depends(require_admin)):
    db = get_db()
    docs = await db["bloods"].find({"bankname": admin["bank"]}).to_list(100)
    return [serialize(d) for d in docs]


@router.put("/inventory")
async def update_inventory(body: BloodUpdate, admin: dict = Depends(require_admin)):
    db = get_db()
    result = await db["bloods"].find_one_and_update(
        {"bankname": admin["bank"], "name": body.name},
        {"$set": {"quantity": body.count}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    return serialize(result)


@router.delete("/inventory/{name}")
async def delete_inventory(name: str, admin: dict = Depends(require_admin)):
    db = get_db()
    await db["bloods"].find_one_and_delete({"bankname": admin["bank"], "name": name})
    return {"success": True}
