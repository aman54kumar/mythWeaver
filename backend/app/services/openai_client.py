"""
OpenAI client service for myth generation.
Handles prompt assembly and API communication.
"""

import json
import logging
import time
from typing import Dict, Any, Optional

import openai
from openai import OpenAI

from app.core.config import settings
from app.models.request import MythGenerationRequest, MythGenerationResponse, MythMetadata
from app.services.myth_utils import get_culture_motifs, detect_culture

logger = logging.getLogger(__name__)


class OpenAIService:
    """Service for interacting with OpenAI API"""
    
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.OPENAI_MODEL
        self.max_tokens = settings.OPENAI_MAX_TOKENS
        self.temperature = settings.OPENAI_TEMPERATURE
    
    def _build_prompt(self, request: MythGenerationRequest) -> str:
        """Build the OpenAI prompt from the request"""
        
        # Determine culture
        culture = request.culture
        if culture == "auto":
            culture = detect_culture(request.scenario)
        
        # Get relevant motifs
        motifs = get_culture_motifs(culture)
        
        # Build the prompt
        prompt = f"""You are a master storyteller, cultural historian, and respectful adapter of public-domain myths. Using only public domain sources and folklore motifs (Project Gutenberg, Sacred-Texts collections, or in-repo seed motifs), adapt the user's modern scenario into an ancient-style myth consistent with the requested culture.

Guidelines:
- Preserve essential mythic motifs and symbolic language from the chosen culture.
- Make the plot fit the modern scenario while maintaining mythic archetypes (hero, guide, trickster, boon, taboo, test).
- Use poetic yet clear language that is accessible to modern readers.
- Provide exactly 3 alternative interactive endings, each reflecting a different moral or interpretation.
- Output must be valid JSON with no extra commentary.

Cultural Context: {culture.title()}
Relevant Motifs: {motifs}

Modern Scenario: {request.scenario}

Tone: {request.tone}

Return JSON:
{{
"title": "<short evocative title>",
"adapted_story": "<full story text, ~350-900 words>",
"choices": [
{{"id":"c1","label":"<label>","outcome":"<text>"}},
{{"id":"c2","label":"<label>","outcome":"<text>"}},
{{"id":"c3","label":"<label>","outcome":"<text>"}}
],
"meta": {{"culture":"{culture}","source_motif":"<motif reference>"}}
}}"""
        
        return prompt
    
    async def moderate_content(self, text: str) -> bool:
        """Check content using OpenAI moderation API"""
        if not settings.USE_OPENAI_MODERATION:
            return True
        
        try:
            response = self.client.moderations.create(input=text)
            return not response.results[0].flagged
        except Exception as e:
            logger.error(f"Moderation API error: {e}")
            return True  # Allow content if moderation fails
    
    async def generate_myth(self, request: MythGenerationRequest) -> MythGenerationResponse:
        """Generate a myth from the request"""
        
        start_time = time.time()
        
        # Content moderation
        if not await self.moderate_content(request.scenario):
            raise ValueError("Content flagged by moderation system")
        
        # Build prompt
        prompt = self._build_prompt(request)
        
        # Make OpenAI API call
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert storyteller who adapts modern scenarios into ancient myths. Always respond with valid JSON only."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                response_format={"type": "json_object"}
            )
            
            # Parse response
            content = response.choices[0].message.content
            myth_data = json.loads(content)
            
            # Add metadata
            generation_time = time.time() - start_time
            myth_data["meta"]["generation_time"] = generation_time
            myth_data["meta"]["ai_model"] = self.model
            
            # Validate and return response
            return MythGenerationResponse(**myth_data)
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse OpenAI response as JSON: {e}")
            # Retry with more explicit instructions
            return await self._retry_generation(request, prompt)
        
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            raise ValueError(f"Failed to generate myth: {str(e)}")
    
    async def _retry_generation(self, request: MythGenerationRequest, original_prompt: str) -> MythGenerationResponse:
        """Retry generation with more explicit JSON instructions"""
        
        retry_prompt = original_prompt + "\n\nIMPORTANT: Return ONLY valid JSON. No additional text or commentary."
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You must respond with valid JSON only. No other text."
                    },
                    {
                        "role": "user",
                        "content": retry_prompt
                    }
                ],
                max_tokens=self.max_tokens,
                temperature=0.5,  # Lower temperature for more consistent output
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            myth_data = json.loads(content)
            
            # Add metadata
            myth_data["meta"]["generation_time"] = 0
            myth_data["meta"]["ai_model"] = self.model
            
            return MythGenerationResponse(**myth_data)
            
        except Exception as e:
            logger.error(f"Retry generation failed: {e}")
            # Return fallback response
            return self._create_fallback_response(request)
    
    def _create_fallback_response(self, request: MythGenerationRequest) -> MythGenerationResponse:
        """Create a fallback response when OpenAI fails"""
        
        culture = request.culture if request.culture != "auto" else "universal"
        
        return MythGenerationResponse(
            title="The Tale of Modern Wisdom",
            adapted_story=f"In times long past, when the world was young and mysteries abounded, there lived one who faced a challenge much like yours: {request.scenario[:100]}... This ancient tale reminds us that the struggles we face today have echoed through the ages, and wisdom can be found in how our ancestors might have approached such trials.",
            choices=[
                {
                    "id": "c1",
                    "label": "Seek Wisdom",
                    "outcome": "The protagonist seeks counsel from the elders, finding guidance in ancient traditions."
                },
                {
                    "id": "c2", 
                    "label": "Trust Instinct",
                    "outcome": "Following inner wisdom, the protagonist forges a new path forward."
                },
                {
                    "id": "c3",
                    "label": "Unite Others",
                    "outcome": "By bringing together allies, the protagonist finds strength in community."
                }
            ],
            meta=MythMetadata(
                culture=culture,
                source_motif="Universal heroic journey pattern",
                generation_time=0,
                ai_model="fallback"
            )
        )


# Global service instance
openai_service = OpenAIService()
