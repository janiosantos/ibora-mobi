from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.metrics import setup_metrics
from app.core.tracing import setup_tracing

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    version="0.1.0",
)

# Setup Observability
setup_metrics(app)
setup_tracing(app)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Mudar para front url em prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

from app.api.v1.health import router as health_router

app.include_router(health_router, tags=["health"])

from app.core.websocket import manager

@app.on_event("startup")
async def startup_event():
    from app.core.logging import configure_logging
    configure_logging()
    await manager.startup()
    
    from app.core.scheduler import start_scheduler
    start_scheduler()

@app.on_event("shutdown")
async def shutdown_event():
    from app.core.scheduler import shutdown_scheduler
    shutdown_scheduler()
