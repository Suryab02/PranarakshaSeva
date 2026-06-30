from pydantic import BaseModel
from typing import Optional


class BloodCreate(BaseModel):
    name: str
    quantity: int
    bankname: str
    city: str
    lat: Optional[float] = None
    lng: Optional[float] = None


class BloodUpdate(BaseModel):
    name: str
    count: int


class DoctorCreate(BaseModel):
    name: str
    qualification: str
    contact: str
    hospital: str
    city: str


class AmbulanceCreate(BaseModel):
    contact: str
    hospital: str
    city: str


class LoginRequest(BaseModel):
    username: str
    password: str


class RegisterRequest(BaseModel):
    username: str
    password: str
    bankname: str


class DonorCreate(BaseModel):
    name: str
    blood_type: str
    city: str
    contact: str
    available: bool = True
