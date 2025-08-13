"""
Pydantic models for request and response data structures.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, validator


class MythGenerationRequest(BaseModel):
    """Request model for myth generation"""
    
    scenario: str = Field(
        ...,
        description="The modern scenario to convert into a myth",
        min_length=10,
        max_length=2000,
    )
    culture: str = Field(
        default="auto",
        description="The cultural tradition for the myth (auto, Greek, Norse, Indian, etc.)",
    )
    tone: Optional[str] = Field(
        default="balanced",
        description="The tone of the story (playful, serious, balanced)",
    )
    
    @validator("scenario")
    def validate_scenario(cls, v):
        """Validate scenario content"""
        if not v.strip():
            raise ValueError("Scenario cannot be empty")
        return v.strip()
    
    @validator("culture")
    def validate_culture(cls, v):
        """Validate culture selection"""
        allowed_cultures = {
            "auto", "greek", "norse", "indian", "japanese", 
            "egyptian", "celtic", "chinese", "african", "native_american"
        }
        if v.lower() not in allowed_cultures:
            return "auto"
        return v.lower()


class ChoiceOption(BaseModel):
    """A choice option for interactive endings"""
    
    id: str = Field(..., description="Unique identifier for the choice")
    label: str = Field(..., description="Display label for the choice")
    outcome: str = Field(..., description="The outcome text for this choice")


class MythMetadata(BaseModel):
    """Metadata about the generated myth"""
    
    culture: str = Field(..., description="The cultural tradition used")
    source_motif: str = Field(..., description="Reference to the source motif")
    generation_time: Optional[float] = Field(None, description="Time taken to generate")
    ai_model: Optional[str] = Field(None, description="OpenAI model used")


class MythGenerationResponse(BaseModel):
    """Response model for myth generation"""
    
    title: str = Field(..., description="The title of the generated myth")
    adapted_story: str = Field(..., description="The full story text")
    choices: List[ChoiceOption] = Field(..., description="Interactive choice options")
    meta: MythMetadata = Field(..., description="Metadata about the generation")
    
    @validator("choices")
    def validate_choices(cls, v):
        """Ensure exactly 3 choices are provided"""
        if len(v) != 3:
            raise ValueError("Exactly 3 choices must be provided")
        return v


class HealthResponse(BaseModel):
    """Health check response"""
    
    status: str = Field(..., description="Health status")
    version: str = Field(..., description="API version")
    timestamp: str = Field(..., description="Current timestamp")
    environment: str = Field(..., description="Current environment")


class ErrorResponse(BaseModel):
    """Error response model"""
    
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Error message")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional error details")
