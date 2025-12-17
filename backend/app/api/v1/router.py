from fastapi import APIRouter
from app.api.v1 import auth, passengers, drivers, rides, websockets, payments

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(passengers.router, prefix="/passengers", tags=["passengers"])
api_router.include_router(drivers.router, prefix="/drivers", tags=["drivers"])
api_router.include_router(rides.router, prefix="/rides", tags=["rides"])
api_router.include_router(websockets.router, tags=["websockets"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
