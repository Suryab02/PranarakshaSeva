import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from api.routes import blood, doctor, ambulance, auth, donor, seed, request

app = FastAPI(
    title="PranarakshaSeva API",
    version="2.0",
    description="Emergency healthcare services API — blood banks, doctors, ambulances",
    redirect_slashes=False,
)

# Lock CORS to known origins. Set ALLOWED_ORIGINS (comma-separated) in prod.
# On Vercel the SPA and API share an origin, so CORS only matters for local dev.
_origins_env = os.environ.get("ALLOWED_ORIGINS", "").strip()
_allowed_origins = (
    [o.strip() for o in _origins_env.split(",") if o.strip()]
    if _origins_env
    else ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(self), microphone=(), camera=()"
    return response


app.include_router(blood.router, prefix="/api/blood", tags=["Blood"])
app.include_router(doctor.router, prefix="/api/doctor", tags=["Doctor"])
app.include_router(ambulance.router, prefix="/api/ambulance", tags=["Ambulance"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(donor.router, prefix="/api/donor", tags=["Donor"])
app.include_router(seed.router, prefix="/api/seed", tags=["Seed"])
app.include_router(request.router, prefix="/api/request", tags=["BloodRequest"])


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "mongo_uri_set": bool(os.environ.get("MONGO_URI")),
    }


@app.get("/")
def root():
    return {"app": "PranarakshaSeva API", "version": "2.0", "docs": "/docs"}


try:
    from mangum import Mangum
    handler = Mangum(app, lifespan="off")
except ImportError:
    pass

