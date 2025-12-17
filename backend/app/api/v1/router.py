from fastapi import APIRouter
from app.api.v1 import auth, passengers, drivers, rides, websockets, payments, payouts, wallet

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(passengers.router, prefix="/passengers", tags=["passengers"])
api_router.include_router(drivers.router, prefix="/drivers", tags=["drivers"])
api_router.include_router(rides.router, prefix="/rides", tags=["rides"])
api_router.include_router(websockets.router, tags=["websockets"])
api_router.include_router(payments.router, tags=["payments"])
api_router.include_router(payouts.router, prefix="/payouts", tags=["payouts"])
api_router.include_router(wallet.router, prefix="/wallet", tags=["wallet"])
