import base64
from typing import Dict, Any
from app.core.ml_models.crop_quality_predictor import crop_quality_predictor

class CropQualityService:
    """
    Service layer providing high-level interface for DINOv2 crop quality predictions.
    """
    @staticmethod
    def grade_image_bytes(image_bytes: bytes) -> Dict[str, Any]:
        """
        Runs high-accuracy DINOv2 vision pipeline on raw image bytes.
        """
        return crop_quality_predictor.predict(image_bytes)

    @staticmethod
    def grade_base64_image(base64_str: str) -> Dict[str, Any]:
        """
        Decodes base64 image string and runs high-accuracy grading.
        """
        if "," in base64_str:
            base64_str = base64_str.split(",")[1]
        img_bytes = base64.b64decode(base64_str)
        return crop_quality_predictor.predict(img_bytes)

    @staticmethod
    def grade_multi_item_bytes(image_bytes: bytes) -> Dict[str, Any]:
        """
        Runs multi-item detection & batch DINOv2 vision pipeline on raw image bytes.
        """
        return crop_quality_predictor.predict_multi_item(image_bytes)

    @staticmethod
    def grade_multi_item_base64(base64_str: str) -> Dict[str, Any]:
        """
        Decodes base64 image string and runs multi-item detection & batch grading.
        """
        if "," in base64_str:
            base64_str = base64_str.split(",")[1]
        img_bytes = base64.b64decode(base64_str)
        return crop_quality_predictor.predict_multi_item(img_bytes)

    @staticmethod
    def get_health() -> Dict[str, Any]:
        """
        Returns model health check info.
        """
        return crop_quality_predictor.health_check()

crop_quality_service = CropQualityService()


