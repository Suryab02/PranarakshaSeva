"""
Run once to populate MongoDB with sample data for all 7 cities.
Usage: python seed.py
"""
import asyncio
from dotenv import load_dotenv
load_dotenv()

from motor.motor_asyncio import AsyncIOMotorClient
from os import environ

client = AsyncIOMotorClient(environ["MONGO_URI"])
db = client["pranarakshaseva"]

BLOODS = [
    # Bengaluru
    {"bankname": "Manipal Hospital Blood Bank", "city": "Bengaluru", "name": "A+",  "quantity": 12},
    {"bankname": "Manipal Hospital Blood Bank", "city": "Bengaluru", "name": "B+",  "quantity": 8},
    {"bankname": "Manipal Hospital Blood Bank", "city": "Bengaluru", "name": "O+",  "quantity": 15},
    {"bankname": "Manipal Hospital Blood Bank", "city": "Bengaluru", "name": "AB+", "quantity": 4},
    {"bankname": "Fortis Blood Bank",           "city": "Bengaluru", "name": "O+",  "quantity": 10},
    {"bankname": "Fortis Blood Bank",           "city": "Bengaluru", "name": "A-",  "quantity": 3},
    {"bankname": "Fortis Blood Bank",           "city": "Bengaluru", "name": "B-",  "quantity": 2},
    {"bankname": "Victoria Hospital Blood Bank","city": "Bengaluru", "name": "O-",  "quantity": 5},
    {"bankname": "Victoria Hospital Blood Bank","city": "Bengaluru", "name": "AB-", "quantity": 1},
    # Hyderabad
    {"bankname": "NIMS Blood Bank",             "city": "Hyderabad", "name": "A+",  "quantity": 9},
    {"bankname": "NIMS Blood Bank",             "city": "Hyderabad", "name": "O+",  "quantity": 14},
    {"bankname": "NIMS Blood Bank",             "city": "Hyderabad", "name": "B+",  "quantity": 6},
    {"bankname": "Yashoda Blood Bank",          "city": "Hyderabad", "name": "AB+", "quantity": 3},
    {"bankname": "Yashoda Blood Bank",          "city": "Hyderabad", "name": "O-",  "quantity": 4},
    {"bankname": "Care Hospital Blood Bank",    "city": "Hyderabad", "name": "A+",  "quantity": 7},
    # Mumbai
    {"bankname": "KEM Hospital Blood Bank",     "city": "Mumbai",    "name": "O+",  "quantity": 20},
    {"bankname": "KEM Hospital Blood Bank",     "city": "Mumbai",    "name": "A+",  "quantity": 11},
    {"bankname": "KEM Hospital Blood Bank",     "city": "Mumbai",    "name": "B+",  "quantity": 9},
    {"bankname": "Lilavati Blood Bank",         "city": "Mumbai",    "name": "AB+", "quantity": 5},
    {"bankname": "Lilavati Blood Bank",         "city": "Mumbai",    "name": "O-",  "quantity": 3},
    {"bankname": "Tata Memorial Blood Bank",    "city": "Mumbai",    "name": "A-",  "quantity": 4},
    # Delhi
    {"bankname": "AIIMS Blood Bank",            "city": "Delhi",     "name": "O+",  "quantity": 25},
    {"bankname": "AIIMS Blood Bank",            "city": "Delhi",     "name": "A+",  "quantity": 18},
    {"bankname": "AIIMS Blood Bank",            "city": "Delhi",     "name": "B+",  "quantity": 14},
    {"bankname": "AIIMS Blood Bank",            "city": "Delhi",     "name": "AB-", "quantity": 2},
    {"bankname": "Safdarjung Blood Bank",       "city": "Delhi",     "name": "O-",  "quantity": 6},
    {"bankname": "Safdarjung Blood Bank",       "city": "Delhi",     "name": "A-",  "quantity": 4},
    # Pune
    {"bankname": "Sassoon Hospital Blood Bank", "city": "Pune",      "name": "A+",  "quantity": 8},
    {"bankname": "Sassoon Hospital Blood Bank", "city": "Pune",      "name": "O+",  "quantity": 11},
    {"bankname": "Ruby Hall Blood Bank",        "city": "Pune",      "name": "B+",  "quantity": 5},
    {"bankname": "Ruby Hall Blood Bank",        "city": "Pune",      "name": "AB+", "quantity": 2},
    # Goa
    {"bankname": "GMC Goa Blood Bank",          "city": "Goa",       "name": "O+",  "quantity": 7},
    {"bankname": "GMC Goa Blood Bank",          "city": "Goa",       "name": "A+",  "quantity": 5},
    {"bankname": "Manipal Goa Blood Bank",      "city": "Goa",       "name": "B+",  "quantity": 3},
    # Vizag
    {"bankname": "King George Hospital BB",     "city": "Vizag",     "name": "O+",  "quantity": 10},
    {"bankname": "King George Hospital BB",     "city": "Vizag",     "name": "A+",  "quantity": 7},
    {"bankname": "Apollo Vizag Blood Bank",     "city": "Vizag",     "name": "B+",  "quantity": 4},
    {"bankname": "Apollo Vizag Blood Bank",     "city": "Vizag",     "name": "AB+", "quantity": 2},
]

DOCTORS = [
    # Bengaluru
    {"name": "Dr. Ravi Kumar",     "qualification": "MBBS, MD - Emergency Medicine", "contact": "9845012345", "hospital": "Manipal Hospital",  "city": "Bengaluru"},
    {"name": "Dr. Priya Nair",     "qualification": "MBBS, MS - General Surgery",    "contact": "9886543210", "hospital": "Fortis Hospital",    "city": "Bengaluru"},
    {"name": "Dr. Suresh Babu",    "qualification": "MBBS, DM - Cardiology",         "contact": "9900112233", "hospital": "Narayana Health",    "city": "Bengaluru"},
    # Hyderabad
    {"name": "Dr. Venkat Rao",     "qualification": "MBBS, MD - Internal Medicine",  "contact": "9848012345", "hospital": "NIMS Hospital",      "city": "Hyderabad"},
    {"name": "Dr. Lakshmi Devi",   "qualification": "MBBS, DGO - Gynaecology",       "contact": "9912345678", "hospital": "Yashoda Hospital",   "city": "Hyderabad"},
    # Mumbai
    {"name": "Dr. Amit Shah",      "qualification": "MBBS, MD - Emergency Medicine", "contact": "9820012345", "hospital": "KEM Hospital",       "city": "Mumbai"},
    {"name": "Dr. Sunita Mehta",   "qualification": "MBBS, MS - Orthopaedics",       "contact": "9867543210", "hospital": "Lilavati Hospital",  "city": "Mumbai"},
    # Delhi
    {"name": "Dr. Rajesh Gupta",   "qualification": "MBBS, MD - Cardiology",         "contact": "9810012345", "hospital": "AIIMS Delhi",        "city": "Delhi"},
    {"name": "Dr. Anita Sharma",   "qualification": "MBBS, DM - Neurology",          "contact": "9911223344", "hospital": "Safdarjung Hospital","city": "Delhi"},
    # Pune
    {"name": "Dr. Nitin Desai",    "qualification": "MBBS, MD - General Medicine",   "contact": "9823012345", "hospital": "Sassoon Hospital",   "city": "Pune"},
    {"name": "Dr. Meera Joshi",    "qualification": "MBBS, MS - General Surgery",    "contact": "9765432109", "hospital": "Ruby Hall Clinic",   "city": "Pune"},
    # Goa
    {"name": "Dr. Fernandes A.",   "qualification": "MBBS, MD - Emergency Medicine", "contact": "9823456789", "hospital": "GMC Goa",            "city": "Goa"},
    # Vizag
    {"name": "Dr. Prasad Rao",     "qualification": "MBBS, MD - Internal Medicine",  "contact": "9848765432", "hospital": "King George Hospital","city": "Vizag"},
    {"name": "Dr. Kavitha Reddy",  "qualification": "MBBS, DM - Cardiology",         "contact": "9912876543", "hospital": "Apollo Hospital",    "city": "Vizag"},
]

AMBULANCES = [
    # Bengaluru
    {"contact": "9845099999", "hospital": "Manipal Hospital",       "city": "Bengaluru"},
    {"contact": "9886500000", "hospital": "Fortis Hospital",         "city": "Bengaluru"},
    {"contact": "9900100000", "hospital": "Narayana Health",         "city": "Bengaluru"},
    {"contact": "108",        "hospital": "CATS Ambulance Bengaluru","city": "Bengaluru"},
    # Hyderabad
    {"contact": "9848000108", "hospital": "NIMS Hospital",           "city": "Hyderabad"},
    {"contact": "9912000999", "hospital": "Yashoda Hospital",        "city": "Hyderabad"},
    {"contact": "108",        "hospital": "GVK EMRI Hyderabad",      "city": "Hyderabad"},
    # Mumbai
    {"contact": "9820099999", "hospital": "KEM Hospital",            "city": "Mumbai"},
    {"contact": "9867500000", "hospital": "Lilavati Hospital",       "city": "Mumbai"},
    {"contact": "108",        "hospital": "Mumbai Ambulance Service","city": "Mumbai"},
    # Delhi
    {"contact": "9810099999", "hospital": "AIIMS Delhi",             "city": "Delhi"},
    {"contact": "9911000108", "hospital": "Safdarjung Hospital",     "city": "Delhi"},
    {"contact": "102",        "hospital": "Delhi Ambulance Service", "city": "Delhi"},
    # Pune
    {"contact": "9823099999", "hospital": "Sassoon Hospital",        "city": "Pune"},
    {"contact": "9765400000", "hospital": "Ruby Hall Clinic",        "city": "Pune"},
    # Goa
    {"contact": "9823400000", "hospital": "GMC Goa",                 "city": "Goa"},
    {"contact": "108",        "hospital": "Goa Ambulance Service",   "city": "Goa"},
    # Vizag
    {"contact": "9848700000", "hospital": "King George Hospital",    "city": "Vizag"},
    {"contact": "9912800000", "hospital": "Apollo Vizag",            "city": "Vizag"},
    {"contact": "108",        "hospital": "Vizag Ambulance Service", "city": "Vizag"},
]


async def seed():
    print("Clearing existing data...")
    await db["bloods"].delete_many({})
    await db["doctors"].delete_many({})
    await db["ambulances"].delete_many({})

    print(f"Inserting {len(BLOODS)} blood records...")
    await db["bloods"].insert_many(BLOODS)

    print(f"Inserting {len(DOCTORS)} doctor records...")
    await db["doctors"].insert_many(DOCTORS)

    print(f"Inserting {len(AMBULANCES)} ambulance records...")
    await db["ambulances"].insert_many(AMBULANCES)

    print("Done! Summary:")
    print(f"  Bloods:     {await db['bloods'].count_documents({})}")
    print(f"  Doctors:    {await db['doctors'].count_documents({})}")
    print(f"  Ambulances: {await db['ambulances'].count_documents({})}")
    client.close()

asyncio.run(seed())
