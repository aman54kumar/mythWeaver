"""
Health check endpoint for monitoring and status.
"""

import logging
from datetime import datetime
from fastapi import APIRouter

from app.models.request import HealthResponse
from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
@router.head("/health")
async def health_check():
    """Health check endpoint"""
    
    logger.info("Health check requested")
    
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        timestamp=datetime.utcnow().isoformat(),
        environment=settings.ENVIRONMENT
    )
