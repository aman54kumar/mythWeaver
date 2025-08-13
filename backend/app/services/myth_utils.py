"""
Utility functions for myth generation.
Handles culture detection and motif loading.
"""

import json
import logging
import re
from pathlib import Path
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

# Culture keywords for auto-detection
CULTURE_KEYWORDS = {
    "greek": [
        "democracy", "philosophy", "theater", "olympics", "mediterranean", 
        "athens", "sparta", "zeus", "apollo", "athena", "poseidon"
    ],
    "norse": [
        "viking", "nordic", "scandinavia", "iceland", "norway", "sweden", 
        "denmark", "odin", "thor", "loki", "valhalla", "runes"
    ],
    "indian": [
        "india", "hindu", "buddhism", "karma", "dharma", "yoga", "sanskrit",
        "ganges", "himalaya", "brahma", "vishnu", "shiva", "krishna"
    ],
    "japanese": [
        "japan", "samurai", "ninja", "zen", "shinto", "tokyo", "kyoto",
        "cherry", "blossom", "amaterasu", "susanoo", "tsukuyomi"
    ],
    "egyptian": [
        "egypt", "pharaoh", "pyramid", "sphinx", "nile", "cairo", "alexandria",
        "ra", "isis", "osiris", "anubis", "thoth", "hieroglyphs"
    ],
    "celtic": [
        "ireland", "scotland", "wales", "druid", "celtic", "gaelic",
        "shamrock", "leprechaun", "brigid", "lugh", "morrigan"
    ],
    "chinese": [
        "china", "tao", "confucius", "buddha", "dragon", "phoenix", "beijing",
        "jade", "emperor", "yin", "yang", "chi", "feng", "shui"
    ],
    "african": [
        "africa", "tribal", "sahara", "congo", "nile", "ancestor", "spirit",
        "anansi", "ubuntu", "griot", "baobab", "savanna"
    ],
    "native_american": [
        "native", "american", "tribal", "spirit", "nature", "eagle", "wolf",
        "great", "spirit", "medicine", "wheel", "totem", "shaman"
    ]
}


def load_seed_myths() -> List[Dict[str, Any]]:
    """Load myth motifs from seed data"""
    
    try:
        seed_file = Path(__file__).parent.parent / "db" / "seed_myths.json"
        if seed_file.exists():
            with open(seed_file, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        logger.error(f"Failed to load seed myths: {e}")
    
    # Fallback seed data
    return [
        {
            "culture": "greek", 
            "motif": "Journey to underworld; hero aided by a cunning guide; test by riddles"
        },
        {
            "culture": "norse", 
            "motif": "Tree of worlds; binding oath; trickster changes fate"
        },
        {
            "culture": "indian", 
            "motif": "Divine boon and curse; river as purification; guru advice"
        },
        {
            "culture": "japanese", 
            "motif": "Honor and duty; seasonal change; ancestor guidance"
        },
        {
            "culture": "egyptian", 
            "motif": "Death and rebirth; solar journey; sacred geometry"
        },
        {
            "culture": "celtic", 
            "motif": "Otherworld journey; sacred grove; three-fold blessing"
        },
        {
            "culture": "chinese", 
            "motif": "Balance of opposites; heavenly mandate; dragon transformation"
        },
        {
            "culture": "african", 
            "motif": "Ancestor wisdom; animal guide; community ritual"
        },
        {
            "culture": "native_american", 
            "motif": "Great spirit vision; nature harmony; sacred circle"
        }
    ]


def detect_culture(scenario: str) -> str:
    """Detect culture from scenario keywords"""
    
    scenario_lower = scenario.lower()
    culture_scores = {}
    
    # Score each culture based on keyword matches
    for culture, keywords in CULTURE_KEYWORDS.items():
        score = 0
        for keyword in keywords:
            if keyword in scenario_lower:
                score += 1
        
        if score > 0:
            culture_scores[culture] = score
    
    # Return culture with highest score, or default to Greek
    if culture_scores:
        return max(culture_scores, key=culture_scores.get)
    
    return "greek"  # Default fallback


def get_culture_motifs(culture: str) -> str:
    """Get motifs for a specific culture"""
    
    seed_myths = load_seed_myths()
    
    # Find motifs for the specified culture
    culture_motifs = [
        myth["motif"] for myth in seed_myths 
        if myth["culture"].lower() == culture.lower()
    ]
    
    if culture_motifs:
        return "; ".join(culture_motifs)
    
    # Fallback to universal motifs
    return "Hero's journey; wise mentor; transformative trial; choice of paths; return with wisdom"


def sanitize_text(text: str) -> str:
    """Sanitize input text for safety"""
    
    # Remove potential harmful content
    text = re.sub(r'<[^>]*>', '', text)  # Remove HTML tags
    text = re.sub(r'[^\w\s\-.,!?;:()\'""]', '', text)  # Allow only safe characters
    text = text.strip()
    
    return text


def validate_scenario_content(scenario: str) -> bool:
    """Basic content validation for scenarios"""
    
    # Check for minimum content
    if len(scenario.strip()) < 10:
        return False
    
    # Basic bad words filter (extend as needed)
    bad_words = [
        "hate", "violence", "illegal", "harmful", "explicit"
    ]
    
    scenario_lower = scenario.lower()
    for word in bad_words:
        if word in scenario_lower:
            return False
    
    return True


def extract_keywords(text: str) -> List[str]:
    """Extract relevant keywords from text for culture detection"""
    
    # Simple keyword extraction
    words = re.findall(r'\b\w+\b', text.lower())
    
    # Filter out common words
    stop_words = {
        "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
        "of", "with", "by", "from", "up", "about", "into", "through", "during",
        "before", "after", "above", "below", "up", "down", "out", "off", "over",
        "under", "again", "further", "then", "once", "is", "are", "was", "were",
        "be", "been", "being", "have", "has", "had", "do", "does", "did", "will",
        "would", "could", "should", "may", "might", "must", "can", "this", "that",
        "these", "those", "i", "me", "my", "myself", "we", "our", "ours", "ourselves",
        "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself",
        "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their",
        "theirs", "themselves", "what", "which", "who", "whom", "whose", "this", "that",
        "these", "those", "am", "is", "are", "was", "were", "be", "been", "being",
        "have", "has", "had", "do", "does", "did", "will", "would", "should", "could",
        "may", "might", "must", "shall"
    }
    
    return [word for word in words if word not in stop_words and len(word) > 2]
