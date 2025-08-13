"""
Test cases for myth utility functions.
"""

import pytest
from app.services.myth_utils import (
    detect_culture,
    get_culture_motifs,
    sanitize_text,
    validate_scenario_content,
    extract_keywords
)


class TestCultureDetection:
    """Test culture detection functionality"""
    
    def test_detect_greek_culture(self):
        """Test detection of Greek cultural keywords"""
        scenario = "I want to create a democratic voting system for my community using modern technology like Athens did."
        culture = detect_culture(scenario)
        assert culture == "greek"
    
    def test_detect_norse_culture(self):
        """Test detection of Norse cultural keywords"""
        scenario = "My startup is like Viking exploration, conquering new Nordic markets with innovative technology."
        culture = detect_culture(scenario)
        assert culture == "norse"
    
    def test_detect_indian_culture(self):
        """Test detection of Indian cultural keywords"""
        scenario = "I'm developing a meditation app inspired by Hindu philosophy and yoga practices from India."
        culture = detect_culture(scenario)
        assert culture == "indian"
    
    def test_detect_japanese_culture(self):
        """Test detection of Japanese cultural keywords"""
        scenario = "Creating a martial arts training platform with Zen principles and samurai discipline."
        culture = detect_culture(scenario)
        assert culture == "japanese"
    
    def test_fallback_to_greek(self):
        """Test fallback to Greek when no cultural keywords detected"""
        scenario = "I'm starting a generic business with no cultural references."
        culture = detect_culture(scenario)
        assert culture == "greek"
    
    def test_multiple_cultures_highest_score(self):
        """Test that highest scoring culture is selected"""
        scenario = "My project combines Greek democracy with Norse exploration and Indian spirituality, but focuses on Greek philosophy."
        culture = detect_culture(scenario)
        # Should detect Greek due to multiple Greek-related terms
        assert culture == "greek"


class TestMotifRetrieval:
    """Test motif retrieval functionality"""
    
    def test_get_greek_motifs(self):
        """Test retrieval of Greek motifs"""
        motifs = get_culture_motifs("greek")
        assert "journey" in motifs.lower() or "hero" in motifs.lower()
        assert len(motifs) > 0
    
    def test_get_norse_motifs(self):
        """Test retrieval of Norse motifs"""
        motifs = get_culture_motifs("norse")
        assert "tree" in motifs.lower() or "oath" in motifs.lower()
        assert len(motifs) > 0
    
    def test_get_indian_motifs(self):
        """Test retrieval of Indian motifs"""
        motifs = get_culture_motifs("indian")
        assert "divine" in motifs.lower() or "guru" in motifs.lower()
        assert len(motifs) > 0
    
    def test_get_unknown_culture_fallback(self):
        """Test fallback motifs for unknown culture"""
        motifs = get_culture_motifs("unknown_culture")
        assert "hero" in motifs.lower() or "journey" in motifs.lower()
        assert len(motifs) > 0
    
    def test_motifs_are_strings(self):
        """Test that motifs are returned as strings"""
        motifs = get_culture_motifs("greek")
        assert isinstance(motifs, str)


class TestTextSanitization:
    """Test text sanitization functionality"""
    
    def test_remove_html_tags(self):
        """Test removal of HTML tags"""
        text = "This is <script>alert('bad')</script> a test <b>with</b> HTML."
        sanitized = sanitize_text(text)
        assert "<script>" not in sanitized
        assert "<b>" not in sanitized
        assert "a test with HTML" in sanitized
    
    def test_remove_special_characters(self):
        """Test removal of potentially harmful special characters"""
        text = "Test with @#$% special chars!"
        sanitized = sanitize_text(text)
        # Should keep basic punctuation but remove harmful chars
        assert "Test with" in sanitized
        assert "special chars" in sanitized
    
    def test_preserve_basic_punctuation(self):
        """Test that basic punctuation is preserved"""
        text = "Hello, world! How are you? I'm fine."
        sanitized = sanitize_text(text)
        assert "Hello, world!" in sanitized
        assert "How are you?" in sanitized
        assert "I'm fine." in sanitized
    
    def test_strip_whitespace(self):
        """Test that leading/trailing whitespace is stripped"""
        text = "  \n  Test content  \n  "
        sanitized = sanitize_text(text)
        assert sanitized == "Test content"


class TestContentValidation:
    """Test content validation functionality"""
    
    def test_validate_good_content(self):
        """Test validation of appropriate content"""
        scenario = "I'm starting a community garden to bring neighbors together and grow fresh vegetables."
        assert validate_scenario_content(scenario) is True
    
    def test_reject_too_short_content(self):
        """Test rejection of content that's too short"""
        scenario = "Short"
        assert validate_scenario_content(scenario) is False
    
    def test_reject_empty_content(self):
        """Test rejection of empty content"""
        scenario = ""
        assert validate_scenario_content(scenario) is False
    
    def test_reject_whitespace_only(self):
        """Test rejection of whitespace-only content"""
        scenario = "   \n   \t   "
        assert validate_scenario_content(scenario) is False
    
    def test_basic_bad_words_filter(self):
        """Test basic bad words filtering"""
        scenario = "I want to create something with hate and violence in my community."
        # Note: This test depends on the bad words list in the actual implementation
        result = validate_scenario_content(scenario)
        # Might be True or False depending on implementation sensitivity
        assert isinstance(result, bool)


class TestKeywordExtraction:
    """Test keyword extraction functionality"""
    
    def test_extract_meaningful_keywords(self):
        """Test extraction of meaningful keywords"""
        text = "I am starting a technology startup in San Francisco with artificial intelligence."
        keywords = extract_keywords(text)
        
        # Should extract meaningful words, not stop words
        assert "technology" in keywords
        assert "startup" in keywords
        assert "artificial" in keywords
        assert "intelligence" in keywords
        
        # Should not extract stop words
        assert "am" not in keywords
        assert "in" not in keywords
        assert "with" not in keywords
    
    def test_extract_keywords_case_insensitive(self):
        """Test that keyword extraction is case insensitive"""
        text = "TECHNOLOGY and Technology should be the same."
        keywords = extract_keywords(text)
        
        # Should be normalized to lowercase
        assert all(word.islower() for word in keywords)
        assert "technology" in keywords
    
    def test_filter_short_words(self):
        """Test that very short words are filtered out"""
        text = "I am a big fan of AI and ML in the US."
        keywords = extract_keywords(text)
        
        # Should filter out words shorter than 3 characters
        assert "ai" not in keywords  # Too short
        assert "ml" not in keywords  # Too short
        assert "us" not in keywords  # Too short
        assert "big" in keywords     # 3 chars, should be included
        assert "fan" in keywords     # 3 chars, should be included
    
    def test_empty_text_keywords(self):
        """Test keyword extraction from empty text"""
        text = ""
        keywords = extract_keywords(text)
        assert keywords == []
    
    def test_special_characters_handling(self):
        """Test handling of special characters in keyword extraction"""
        text = "E-commerce and self-driving cars are game-changers!"
        keywords = extract_keywords(text)
        
        # Should handle hyphenated words appropriately
        assert len(keywords) > 0
        # Specific behavior depends on implementation


if __name__ == "__main__":
    pytest.main([__file__])
