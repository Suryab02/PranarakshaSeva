from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import blood, doctor, ambulance, auth, donor

app = FastAPI(
    title="PranarakshaSeva API",
    version="2.0",
    description="Emergency healthcare services API — blood banks, doctors, ambulances",
    redirect_slashes=False,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(blood.router, prefix="/api/blood", tags=["Blood"])
app.include_router(doctor.router, prefix="/api/doctor", tags=["Doctor"])
app.include_router(ambulance.router, prefix="/api/ambulance", tags=["Ambulance"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(donor.router, prefix="/api/donor", tags=["Donor"])


@app.get("/")
def root():
    return {"app": "PranarakshaSeva API", "version": "2.0", "docs": "/docs"}


# Vercel serverless handler
try:
    from mangum import Mangum
    handler = Mangum(app, lifespan="off")
except ImportError:
    pass
