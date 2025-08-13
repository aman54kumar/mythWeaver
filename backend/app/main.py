"""
Main FastAPI application for MythWeaver backend.
Converts modern scenarios into ancient myths using OpenAI API.
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
import logging
import time
from contextlib import asynccontextmanager


from app.api.v1 import generate, health
from app.core.config import settings
from app.core.logging import setup_logging

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)




@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    logger.info("Starting MythWeaver backend...")
    yield
    logger.info("Shutting down MythWeaver backend...")


# Create FastAPI application
app = FastAPI(
    title="MythWeaver API",
    description="Convert modern scenarios into ancient myths",
    version="1.0.0",
    docs_url="/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT == "development" else None,
    lifespan=lifespan,
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS,
)




@app.middleware("http")
async def redirect_to_new_domain(request: Request, call_next):
    """Redirect from old domain to new domain"""
    host = request.headers.get("host", "")
    if "mythosync.com" in host:
        new_url = str(request.url).replace("mythosync.com", "mythweaver.fun")
        return RedirectResponse(url=new_url, status_code=301)
    return await call_next(request)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Add processing time header"""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )





# Include routers
app.include_router(health.router, prefix="/api/v1", tags=["health"])
app.include_router(generate.router, prefix="/api/v1", tags=["generation"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "MythWeaver API", "version": "1.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.BACKEND_HOST,
        port=settings.BACKEND_PORT,
        reload=settings.ENVIRONMENT == "development",
    )
