from motor.motor_asyncio import AsyncIOMotorClient
from os import environ

_client: AsyncIOMotorClient = None


def get_db():
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(environ["MONGO_URI"])
    return _client["pranarakshaseva"]
