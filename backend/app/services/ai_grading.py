import base64
import urllib.request
from typing import Dict, Any
from app.core.ml_models.yolo_wrapper import crop_grader

class AIGradingService:
    @staticmethod
    def grade_image_bytes(image_bytes: bytes) -> Dict[str, Any]:
        """Runs the vision pipeline on raw image bytes."""
        return crop_grader.analyze_crop_image(image_bytes)

    @staticmethod
    def grade_base64_image(base64_str: str) -> Dict[str, Any]:
        """Decodes base64 string and runs grading."""
        if "," in base64_str:
            base64_str = base64_str.split(",")[1]
        img_bytes = base64.b64decode(base64_str)
        return AIGradingService.grade_image_bytes(img_bytes)

    @staticmethod
    def grade_image_url(url: str) -> Dict[str, Any]:
        """Fetches remote image from URL and runs grading."""
        req = urllib.request.Request(url, headers={"User-Agent": "KisanSetu/2.0"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            return AIGradingService.grade_image_bytes(resp.read())

ai_grading_service = AIGradingService()
