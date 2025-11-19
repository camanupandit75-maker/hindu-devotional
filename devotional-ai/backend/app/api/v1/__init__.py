from fastapi import APIRouter
from .endpoints import auth, generations

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(generations.router, prefix="/generations", tags=["generations"])

