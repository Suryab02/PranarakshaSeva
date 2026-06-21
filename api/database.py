from motor.motor_asyncio import AsyncIOMotorClient
from os import environ

_client: AsyncIOMotorClient = None


def get_db():
    global _client
    if _client is None:
        uri = environ.get("MONGO_URI")
        if not uri:
            raise RuntimeError("MONGO_URI environment variable is not set")
        _client = AsyncIOMotorClient(uri)
    return _client["pranarakshaseva"]
