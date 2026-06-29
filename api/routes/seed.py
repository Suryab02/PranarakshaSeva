from fastapi import APIRouter, Header, HTTPException
from api.database import get_db
import os

router = APIRouter()

BLOODS = [
    {"bankname": "Manipal Hospital Blood Bank", "city": "Bengaluru", "name": "A+",  "quantity": 12},
    {"bankname": "Manipal Hospital Blood Bank", "city": "Bengaluru", "name": "B+",  "quantity": 8},
    {"bankname": "Manipal Hospital Blood Bank", "city": "Bengaluru", "name": "O+",  "quantity": 15},
    {"bankname": "Manipal Hospital Blood Bank", "city": "Bengaluru", "name": "AB+", "quantity": 4},
    {"bankname": "Fortis Blood Bank",           "city": "Bengaluru", "name": "O+",  "quantity": 10},
    {"bankname": "Fortis Blood Bank",           "city": "Bengaluru", "name": "A-",  "quantity": 3},
    {"bankname": "Victoria Hospital Blood Bank","city": "Bengaluru", "name": "O-",  "quantity": 5},
    {"bankname": "NIMS Blood Bank",             "city": "Hyderabad", "name": "A+",  "quantity": 9},
    {"bankname": "NIMS Blood Bank",             "city": "Hyderabad", "name": "O+",  "quantity": 14},
    {"bankname": "NIMS Blood Bank",             "city": "Hyderabad", "name": "B+",  "quantity": 6},
    {"bankname": "Yashoda Blood Bank",          "city": "Hyderabad", "name": "AB+", "quantity": 3},
    {"bankname": "Care Hospital Blood Bank",    "city": "Hyderabad", "name": "A+",  "quantity": 7},
    {"bankname": "KEM Hospital Blood Bank",     "city": "Mumbai",    "name": "O+",  "quantity": 20},
    {"bankname": "KEM Hospital Blood Bank",     "city": "Mumbai",    "name": "A+",  "quantity": 11},
    {"bankname": "KEM Hospital Blood Bank",     "city": "Mumbai",    "name": "B+",  "quantity": 9},
    {"bankname": "Lilavati Blood Bank",         "city": "Mumbai",    "name": "AB+", "quantity": 5},
    {"bankname": "Lilavati Blood Bank",         "city": "Mumbai",    "name": "O-",  "quantity": 3},
    {"bankname": "AIIMS Blood Bank",            "city": "Delhi",     "name": "O+",  "quantity": 25},
    {"bankname": "AIIMS Blood Bank",            "city": "Delhi",     "name": "A+",  "quantity": 18},
    {"bankname": "AIIMS Blood Bank",            "city": "Delhi",     "name": "B+",  "quantity": 14},
    {"bankname": "Safdarjung Blood Bank",       "city": "Delhi",     "name": "O-",  "quantity": 6},
    {"bankname": "Sassoon Hospital Blood Bank", "city": "Pune",      "name": "A+",  "quantity": 8},
    {"bankname": "Sassoon Hospital Blood Bank", "city": "Pune",      "name": "O+",  "quantity": 11},
    {"bankname": "Ruby Hall Blood Bank",        "city": "Pune",      "name": "B+",  "quantity": 5},
    {"bankname": "GMC Goa Blood Bank",          "city": "Goa",       "name": "O+",  "quantity": 7},
    {"bankname": "GMC Goa Blood Bank",          "city": "Goa",       "name": "A+",  "quantity": 5},
    {"bankname": "King George Hospital BB",     "city": "Vizag",     "name": "O+",  "quantity": 10},
    {"bankname": "King George Hospital BB",     "city": "Vizag",     "name": "A+",  "quantity": 7},
    {"bankname": "Apollo Vizag Blood Bank",     "city": "Vizag",     "name": "B+",  "quantity": 4},
]

DOCTORS = [
    {"name": "Dr. Ravi Kumar",    "qualification": "MBBS, MD - Emergency Medicine", "contact": "9845012345", "hospital": "Manipal Hospital",   "city": "Bengaluru"},
    {"name": "Dr. Priya Nair",    "qualification": "MBBS, MS - General Surgery",    "contact": "9886543210", "hospital": "Fortis Hospital",     "city": "Bengaluru"},
    {"name": "Dr. Suresh Babu",   "qualification": "MBBS, DM - Cardiology",         "contact": "9900112233", "hospital": "Narayana Health",     "city": "Bengaluru"},
    {"name": "Dr. Venkat Rao",    "qualification": "MBBS, MD - Internal Medicine",  "contact": "9848012345", "hospital": "NIMS Hospital",       "city": "Hyderabad"},
    {"name": "Dr. Lakshmi Devi",  "qualification": "MBBS, DGO - Gynaecology",       "contact": "9912345678", "hospital": "Yashoda Hospital",    "city": "Hyderabad"},
    {"name": "Dr. Amit Shah",     "qualification": "MBBS, MD - Emergency Medicine", "contact": "9820012345", "hospital": "KEM Hospital",        "city": "Mumbai"},
    {"name": "Dr. Sunita Mehta",  "qualification": "MBBS, MS - Orthopaedics",       "contact": "9867543210", "hospital": "Lilavati Hospital",   "city": "Mumbai"},
    {"name": "Dr. Rajesh Gupta",  "qualification": "MBBS, MD - Cardiology",         "contact": "9810012345", "hospital": "AIIMS Delhi",         "city": "Delhi"},
    {"name": "Dr. Anita Sharma",  "qualification": "MBBS, DM - Neurology",          "contact": "9911223344", "hospital": "Safdarjung Hospital", "city": "Delhi"},
    {"name": "Dr. Nitin Desai",   "qualification": "MBBS, MD - General Medicine",   "contact": "9823012345", "hospital": "Sassoon Hospital",    "city": "Pune"},
    {"name": "Dr. Meera Joshi",   "qualification": "MBBS, MS - General Surgery",    "contact": "9765432109", "hospital": "Ruby Hall Clinic",    "city": "Pune"},
    {"name": "Dr. Fernandes A.",  "qualification": "MBBS, MD - Emergency Medicine", "contact": "9823456789", "hospital": "GMC Goa",             "city": "Goa"},
    {"name": "Dr. Prasad Rao",    "qualification": "MBBS, MD - Internal Medicine",  "contact": "9848765432", "hospital": "King George Hospital","city": "Vizag"},
    {"name": "Dr. Kavitha Reddy", "qualification": "MBBS, DM - Cardiology",         "contact": "9912876543", "hospital": "Apollo Hospital",     "city": "Vizag"},
]

AMBULANCES = [
    {"contact": "9845099999", "hospital": "Manipal Hospital",        "city": "Bengaluru"},
    {"contact": "9886500000", "hospital": "Fortis Hospital",          "city": "Bengaluru"},
    {"contact": "108",        "hospital": "CATS Ambulance Bengaluru", "city": "Bengaluru"},
    {"contact": "9848000108", "hospital": "NIMS Hospital",            "city": "Hyderabad"},
    {"contact": "108",        "hospital": "GVK EMRI Hyderabad",       "city": "Hyderabad"},
    {"contact": "9820099999", "hospital": "KEM Hospital",             "city": "Mumbai"},
    {"contact": "108",        "hospital": "Mumbai Ambulance Service", "city": "Mumbai"},
    {"contact": "9810099999", "hospital": "AIIMS Delhi",              "city": "Delhi"},
    {"contact": "102",        "hospital": "Delhi Ambulance Service",  "city": "Delhi"},
    {"contact": "9823099999", "hospital": "Sassoon Hospital",         "city": "Pune"},
    {"contact": "9765400000", "hospital": "Ruby Hall Clinic",         "city": "Pune"},
    {"contact": "108",        "hospital": "Goa Ambulance Service",    "city": "Goa"},
    {"contact": "9848700000", "hospital": "King George Hospital",     "city": "Vizag"},
    {"contact": "108",        "hospital": "Vizag Ambulance Service",  "city": "Vizag"},
]

USERS = [
    {"username": "manipal_admin",  "password": "blood123", "bankname": "Manipal Hospital Blood Bank"},
    {"username": "fortis_admin",   "password": "blood123", "bankname": "Fortis Blood Bank"},
    {"username": "aiims_admin",    "password": "blood123", "bankname": "AIIMS Blood Bank"},
    {"username": "nims_admin",     "password": "blood123", "bankname": "NIMS Blood Bank"},
    {"username": "kem_admin",      "password": "blood123", "bankname": "KEM Hospital Blood Bank"},
]


@router.get("/status")
async def seed_status():
    db = get_db()
    bloods = await db["bloods"].count_documents({})
    doctors = await db["doctors"].count_documents({})
    ambulances = await db["ambulances"].count_documents({})
    return {
        "seeded": bloods > 0,
        "counts": {"bloods": bloods, "doctors": doctors, "ambulances": ambulances},
        "hint": "POST /api/seed/run to seed" if bloods == 0 else "Pass x-seed-key header to re-seed",
    }


@router.post("/run")
async def run_seed(x_seed_key: str = Header(default="")):
    db = get_db()

    # First-time setup: allow seeding without a key if DB is completely empty
    existing = await db["bloods"].count_documents({})
    if existing > 0:
        expected = os.environ.get("SEED_KEY", "")
        if not expected or x_seed_key != expected:
            raise HTTPException(
                status_code=403,
                detail="Database already has data. Set SEED_KEY env var and pass it as x-seed-key header to re-seed.",
            )
    await db["bloods"].delete_many({})
    await db["doctors"].delete_many({})
    await db["ambulances"].delete_many({})

    await db["bloods"].insert_many(BLOODS)
    await db["doctors"].insert_many(DOCTORS)
    await db["ambulances"].insert_many(AMBULANCES)

    for u in USERS:
        existing = await db["users"].find_one({"username": u["username"]})
        if not existing:
            await db["users"].insert_one(u)

    return {
        "status": "seeded",
        "bloods": len(BLOODS),
        "doctors": len(DOCTORS),
        "ambulances": len(AMBULANCES),
        "admin_accounts": [u["username"] for u in USERS],
    }
