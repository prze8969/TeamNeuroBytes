import os
import sys
import argparse
import json
import torch
from torchvision import transforms
from PIL import Image
import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from models.crop_grading_model import CropGradingModel
from models.quality_features import QualityFeatureExtractor
from training.prepare_dataset import REVERSE_GRADE_MAP

class CropQualityInferencePipeline:
    """
    End-to-end inference pipeline for crop image quality grading.
    Loads trained DINOv3 + CORAL model, extracts handcrafted quality features,
    and returns standardized prediction dictionary.
    """
    def __init__(self, checkpoint_path: str = "checkpoints/best_model.pth"):
        if not os.path.exists(checkpoint_path):
            raise FileNotFoundError(f"Checkpoint not found at '{checkpoint_path}'. Train the model first.")

        self.checkpoint = torch.load(checkpoint_path, map_location="cpu")
        self.cfg = self.checkpoint["config"]

        self.device = torch.device(self.cfg["training"]["device"] if torch.cuda.is_available() else "cpu")
        self.model = CropGradingModel(
            variant="dinov2_vits14",
            freeze_backbone=True,
            quality_dim=self.cfg["model"]["quality_feature_dim"],
            fusion_dim=self.cfg["model"]["fusion_dim"],
            num_classes=self.cfg["model"]["num_classes"]
        ).to(self.device)

        self.model.load_state_dict(self.checkpoint["model_state_dict"])
        self.model.eval()

        self.feature_extractor = QualityFeatureExtractor()
        self.transform = transforms.Compose([
            transforms.Resize((self.cfg["model"]["image_size"], self.cfg["model"]["image_size"])),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

    def predict_image(self, image_path: str) -> dict:
        if not os.path.exists(image_path):
            return {"error": f"Image file not found at '{image_path}'"}

        with Image.open(image_path) as img:
            img_rgb = img.convert("RGB")
            img_np = np.array(img_rgb)

            # Handcrafted visual features
            quality_feat = self.feature_extractor.extract_from_numpy(img_np)
            quality_tensor = torch.tensor(quality_feat, dtype=torch.float32).unsqueeze(0).to(self.device)

            image_tensor = self.transform(img_rgb).unsqueeze(0).to(self.device)

        with torch.no_grad():
            logits, probs, scores = self.model(image_tensor, quality_tensor)

        prob_vec = probs[0].cpu().numpy()
        pred_idx = int(np.argmax(prob_vec))
        grade_letter = REVERSE_GRADE_MAP.get(pred_idx, "A")

        confidence = float(prob_vec[pred_idx])
        quality_score = float(scores[0].item())

        if confidence > 0.85:
            conf_level = "High"
        elif confidence >= 0.60:
            conf_level = "Medium"
        else:
            conf_level = "Low"

        probabilities_dict = {
            "A": round(float(prob_vec[0]), 4),
            "B": round(float(prob_vec[1]), 4),
            "C": round(float(prob_vec[2]), 4),
            "D": round(float(prob_vec[3]), 4)
        }

        result = {
            "grade": grade_letter,
            "confidence": round(confidence, 4),
            "quality_score": round(quality_score, 1),
            "probabilities": probabilities_dict,
            "confidence_level": conf_level
        }

        if conf_level == "Low":
            result["warning"] = "Prediction uncertain. Please provide another clear image of the produce."

        return result

def main():
    parser = argparse.ArgumentParser(description="Crop Quality AI Inference CLI")
    parser.add_argument("--image", type=str, required=True, help="Path to input crop image")
    parser.add_argument("--checkpoint", type=str, default="checkpoints/best_model.pth", help="Model checkpoint path")
    args = parser.parse_args()

    pipeline = CropQualityInferencePipeline(checkpoint_path=args.checkpoint)
    res = pipeline.predict_image(args.image)
    print(json.dumps(res, indent=2))

if __name__ == "__main__":
    main()
