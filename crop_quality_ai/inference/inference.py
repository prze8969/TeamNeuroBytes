import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.path.insert(0, os.path.abspath("."))
import argparse
import json
import yaml
import numpy as np
import torch
from torchvision import transforms
from PIL import Image
from typing import Dict, Any

from crop_quality_ai.models.crop_grading_model import CropQualityGradingModel

GRADE_NAMES = ["A", "B", "C", "D"]

class CropQualityPredictor:
    """
    Production-ready single-image inference pipeline.
    Loads best_model.pth and returns detailed JSON payload.
    """
    def __init__(self, config_path: str = "crop_quality_ai/configs/config.yaml", checkpoint_path: str = None):
        with open(config_path, "r") as f:
            self.config = yaml.safe_load(f)

        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        if checkpoint_path is None:
            checkpoint_path = os.path.join(self.config["data"]["checkpoints_dir"], "best_model.pth")
            if not os.path.exists(checkpoint_path):
                checkpoint_path = os.path.join(self.config["data"]["checkpoints_dir"], "last_model.pth")

        self.model = CropQualityGradingModel(
            backbone_name=self.config["model"]["backbone_name"],
            freeze_backbone=True,
            num_classes=self.config["model"]["num_classes"],
            dropout=self.config["model"]["dropout"]
        ).to(self.device)

        if os.path.exists(checkpoint_path):
            self.model.load_state_dict(torch.load(checkpoint_path, map_location=self.device))
            print(f"[OK] CropQualityPredictor loaded weights from '{checkpoint_path}'.")
        else:
            print(f"[WARN] Checkpoint '{checkpoint_path}' not found. Initialized with default weights.")

        self.model.eval()

        image_size = self.config["data"]["image_size"]
        self.transform = transforms.Compose([
            transforms.Resize((image_size, image_size)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

    def predict_image(self, image: Image.Image) -> Dict[str, Any]:
        """
        Runs model inference on PIL Image instance.
        Returns clean JSON dict format.
        """
        img_tensor = self.transform(image).unsqueeze(0).to(self.device)

        with torch.no_grad():
            out = self.model.predict(img_tensor)

        rank_idx = int(out["ranks"].cpu().item())
        score = float(out["scores"].cpu().item())
        probs_np = out["probabilities"].cpu().squeeze(0).numpy()

        predicted_grade = GRADE_NAMES[rank_idx] if rank_idx < len(GRADE_NAMES) else "D"
        confidence = float(probs_np[rank_idx])

        # Probabilities dictionary
        prob_dict = {
            GRADE_NAMES[i]: round(float(probs_np[i]), 4) for i in range(len(GRADE_NAMES))
        }

        # Confidence level
        if confidence >= 0.85:
            conf_level = "High"
        elif confidence >= 0.65:
            conf_level = "Medium"
        else:
            conf_level = "Low"

        return {
            "grade": predicted_grade,
            "confidence": round(confidence, 4),
            "quality_score": round(score, 1),
            "probabilities": prob_dict,
            "confidence_level": conf_level
        }

    def predict_image_path(self, image_path: str) -> Dict[str, Any]:
        """
        Loads image from disk and runs prediction.
        """
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found at path '{image_path}'")
        image = Image.open(image_path).convert("RGB")
        return self.predict_image(image)

def main():
    parser = argparse.ArgumentParser(description="Crop Quality Grading AI Inference")
    parser.add_argument("--image", type=str, required=True, help="Path to input crop image")
    parser.add_argument("--config", type=str, default="crop_quality_ai/configs/config.yaml", help="Path to config yaml")
    parser.add_argument("--checkpoint", type=str, default=None, help="Optional path to model checkpoint")
    args = parser.parse_args()

    predictor = CropQualityPredictor(config_path=args.config, checkpoint_path=args.checkpoint)
    result = predictor.predict_image_path(args.image)

    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
