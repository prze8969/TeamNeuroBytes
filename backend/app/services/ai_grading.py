import base64
import urllib.request
from typing import Dict, Any
from app.services.crop_quality_service import crop_quality_service

class AIGradingService:
    @staticmethod
    def grade_image_bytes(image_bytes: bytes) -> Dict[str, Any]:
        """Runs high-accuracy DINOv2 vision pipeline on raw image bytes."""
        return crop_quality_service.grade_image_bytes(image_bytes)

    @staticmethod
    def grade_base64_image(base64_str: str) -> Dict[str, Any]:
        """Decodes base64 string and runs high-accuracy DINOv2 grading."""
        return crop_quality_service.grade_base64_image(base64_str)

    @staticmethod
    def grade_image_url(url: str) -> Dict[str, Any]:
        """Fetches remote image from URL and runs DINOv2 grading."""
        req = urllib.request.Request(url, headers={"User-Agent": "KisanSetu/2.0"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            return crop_quality_service.grade_image_bytes(resp.read())

ai_grading_service = AIGradingService()

