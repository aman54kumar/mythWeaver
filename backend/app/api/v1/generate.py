"""
Myth generation endpoint.
Handles scenario submission and myth creation.
"""

import logging
import time
from typing import Dict
from fastapi import APIRouter, HTTPException, Request, Depends

from app.models.request import MythGenerationRequest, MythGenerationResponse, ErrorResponse
from app.services.openai_client import openai_service
from app.services.myth_utils import sanitize_text, validate_scenario_content
from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()

# In-memory cache for responses (use Redis in production)
response_cache: Dict[str, Dict] = {}


def get_cache_key(request: MythGenerationRequest) -> str:
    """Generate cache key for request"""
    return f"{hash(request.scenario + request.culture + str(request.tone))}"


@router.post("/generate-myth", response_model=MythGenerationResponse)
async def generate_myth(
    request: MythGenerationRequest,
    req: Request
):
    """Generate a myth from a modern scenario"""
    
    start_time = time.time()
    
    try:
        logger.info(f"Myth generation requested for culture: {request.culture}")
        
        # Sanitize input
        request.scenario = sanitize_text(request.scenario)
        
        # Validate content
        if not validate_scenario_content(request.scenario):
            raise HTTPException(
                status_code=400,
                detail="Scenario content is not appropriate or too short"
            )
        
        # Check length limits
        if len(request.scenario) > settings.MAX_SCENARIO_LENGTH:
            raise HTTPException(
                status_code=400,
                detail=f"Scenario too long. Maximum {settings.MAX_SCENARIO_LENGTH} characters allowed."
            )
        
        # Check cache
        cache_key = get_cache_key(request)
        if cache_key in response_cache:
            cached_response = response_cache[cache_key]
            if time.time() - cached_response["timestamp"] < 3600:  # 1 hour cache
                logger.info("Returning cached response")
                return MythGenerationResponse(**cached_response["data"])
        
        # Generate myth
        try:
            response = await openai_service.generate_myth(request)
            
            # Cache response
            response_cache[cache_key] = {
                "data": response.dict(),
                "timestamp": time.time()
            }
            
            # Log metrics
            generation_time = time.time() - start_time
            logger.info(f"Myth generated successfully in {generation_time:.2f}s")
            
            return response
            
        except ValueError as e:
            logger.error(f"Generation error: {e}")
            raise HTTPException(status_code=400, detail=str(e))
        
        except Exception as e:
            logger.error(f"Unexpected generation error: {e}")
            raise HTTPException(status_code=500, detail="Failed to generate myth")
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in generate_myth: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")


# Rate limit handler will be added to the main app, not the router
