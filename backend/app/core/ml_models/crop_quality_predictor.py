import os
import sys
import time
import yaml
import io
import torch
import numpy as np
from PIL import Image
from torchvision import transforms
from typing import Dict, Any, Union, Optional

# Dynamically add crop_quality_ai to sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
workspace_dir = os.path.abspath(os.path.join(backend_dir, ".."))
crop_ai_dir = os.path.join(workspace_dir, "crop_quality_ai")

if crop_ai_dir not in sys.path:
    sys.path.insert(0, crop_ai_dir)
if workspace_dir not in sys.path:
    sys.path.insert(0, workspace_dir)

try:
    from crop_quality_ai.models.crop_grading_model import CropQualityGradingModel
except ModuleNotFoundError:
    from models.crop_grading_model import CropQualityGradingModel

GRADE_NAMES = ["A", "B", "C", "D"]

class CropQualityPredictor:
    """
    Singleton class for loading and serving the high-accuracy DINOv2 + CORAL
    Crop Quality Grading AI model.
    Ensures model weights are loaded once at application startup into GPU VRAM.
    """
    _instance = None
    _model = None
    _device = None
    _config = None
    _model_path = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(CropQualityPredictor, cls).__new__(cls)
        return cls._instance

    def load_model(self, model_path: Optional[str] = None, config_path: Optional[str] = None):
        """
        Load DINOv2 backbone and trained weights onto CUDA GPU / CPU.
        """
        if self._model is not None:
            return  # Already loaded

        if not config_path:
            config_path = os.path.join(crop_ai_dir, "configs", "config.yaml")

        if not os.path.exists(config_path):
            raise FileNotFoundError(f"Config file not found at '{config_path}'")

        with open(config_path, "r") as f:
            self._config = yaml.safe_load(f)

        if not model_path:
            model_path = os.path.join(crop_ai_dir, "checkpoints", "best_model.pth")
            if not os.path.exists(model_path):
                model_path = os.path.join(crop_ai_dir, "checkpoints", "last_model.pth")

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model checkpoint not found at '{model_path}'")

        self._model_path = model_path
        self._device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"[INFO] CropQualityPredictor initializing on device: {self._device}")

        # Instantiate model architecture
        backbone_name = self._config["model"].get("backbone_name", "dinov2_vitb14")
        num_classes = self._config["model"].get("num_classes", 4)
        dropout = self._config["model"].get("dropout", 0.2)

        self._model = CropQualityGradingModel(
            backbone_name=backbone_name,
            freeze_backbone=True,
            num_classes=num_classes,
            dropout=dropout
        ).to(self._device)

        # Load weights safely
        try:
            state_dict = torch.load(model_path, map_location=self._device, weights_only=True)
        except Exception:
            state_dict = torch.load(model_path, map_location=self._device)

        self._model.load_state_dict(state_dict)
        self._model.eval()

        image_size = self._config.get("data", {}).get("image_size", 392) if self._config else 392
        # Ensure image_size is divisible by 14 for DINOv2 patch alignment
        if image_size % 14 != 0:
            image_size = round(image_size / 14) * 14

        self._transform = transforms.Compose([
            transforms.Resize((image_size, image_size)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

        print(f"[SUCCESS] CropQualityPredictor loaded weights from '{model_path}' (Image Resolution: {image_size}x{image_size}).")

    def predict(self, image_input: Union[str, bytes, np.ndarray, Image.Image]) -> Dict[str, Any]:
        """
        Runs high-accuracy inference on a single image.
        Accepts:
        - File path (str)
        - Image raw bytes (UploadFile / request stream)
        - NumPy array (decoded opencv/pillow image)
        - PIL Image instance
        """
        if self._model is None:
            self.load_model()

        start_time = time.time()

        # Parse image input with robust error handling
        try:
            if isinstance(image_input, str):
                if not os.path.exists(image_input):
                    raise FileNotFoundError(f"Image file not found: {image_input}")
                image = Image.open(image_input).convert("RGB")
            elif isinstance(image_input, bytes):
                image = Image.open(io.BytesIO(image_input)).convert("RGB")
            elif isinstance(image_input, np.ndarray):
                if image_input.ndim == 3 and image_input.shape[2] == 3:
                    image = Image.fromarray(image_input)
                else:
                    image = Image.fromarray(image_input).convert("RGB")
            elif isinstance(image_input, Image.Image):
                image = image_input.convert("RGB")
            else:
                raise ValueError(f"Unsupported image input type: {type(image_input)}")
        except Exception as e:
            return {
                "error": f"Invalid image input: {str(e)}",
                "grade": "D",
                "quality_grade": "Grade D",
                "confidence": 0.0,
                "quality_score": 0.0,
                "is_passed": False
            }

        # Preprocess & Inference pass
        try:
            img_tensor = self._transform(image).unsqueeze(0).to(self._device)

            with torch.no_grad():
                out = self._model.predict(img_tensor)

            rank_idx = int(out["ranks"].cpu().item())
            score = float(out["scores"].cpu().item())
            probs_np = out["probabilities"].cpu().squeeze(0).numpy()

            predicted_grade = GRADE_NAMES[rank_idx] if rank_idx < len(GRADE_NAMES) else "D"
            confidence = float(probs_np[rank_idx])

            prob_dict = {
                GRADE_NAMES[i]: round(float(probs_np[i]), 4) for i in range(len(GRADE_NAMES))
            }

            # Confidence level heuristic
            if confidence >= 0.85:
                conf_level = "High"
            elif confidence >= 0.65:
                conf_level = "Medium"
            else:
                conf_level = "Low"

            elapsed_ms = (time.time() - start_time) * 1000.0

            return {
                "grade": predicted_grade,
                "quality_grade": f"Grade {predicted_grade}",
                "confidence": round(confidence, 4),
                "quality_score": round(score, 1),
                "probabilities": prob_dict,
                "confidence_level": conf_level,
                "inference_time_ms": round(elapsed_ms, 2),
                "is_passed": predicted_grade in ["A", "B", "C"]
            }
        except Exception as e:
            return {
                "error": f"Inference execution failed: {str(e)}",
                "grade": "D",
                "quality_grade": "Grade D",
                "confidence": 0.0,
                "quality_score": 0.0,
                "is_passed": False
            }

    def predict_multi_item(self, image_input: Union[str, bytes, np.ndarray, Image.Image]) -> Dict[str, Any]:
        """
        Runs two-stage multi-object produce detection & grading:
        1. Item Segmentation / Candidate Region Proposals (bounding boxes)
        2. Single Batch DINOv2 + CORAL GPU Inference across all detected items
        3. Grade distribution breakdown (A/B/C/D counts & %), weighted quality score,
           and per-item color-coded bounding boxes.
        """
        if self._model is None:
            self.load_model()

        start_time = time.time()

        # Parse image input
        try:
            if isinstance(image_input, str):
                if not os.path.exists(image_input):
                    raise FileNotFoundError(f"Image file not found: {image_input}")
                image = Image.open(image_input).convert("RGB")
            elif isinstance(image_input, bytes):
                image = Image.open(io.BytesIO(image_input)).convert("RGB")
            elif isinstance(image_input, np.ndarray):
                if image_input.ndim == 3 and image_input.shape[2] == 3:
                    image = Image.fromarray(image_input)
                else:
                    image = Image.fromarray(image_input).convert("RGB")
            elif isinstance(image_input, Image.Image):
                image = image_input.convert("RGB")
            else:
                raise ValueError(f"Unsupported image input type: {type(image_input)}")
        except Exception as e:
            return {
                "error": f"Invalid image input: {str(e)}",
                "items_count": 0,
                "overall_grade": "D",
                "overall_score": 0.0,
                "distribution": {"A": 0, "B": 0, "C": 0, "D": 0},
                "distribution_pct": {"A": 0.0, "B": 0.0, "C": 0.0, "D": 0.0},
                "items": [],
                "is_passed": False
            }

        img_width, img_height = image.size
        img_np = np.array(image)

        # Stage 1: Detect Item Bounding Boxes (Segmentation / Contour Analysis)
        boxes = self._extract_item_bounding_boxes(img_np, img_width, img_height)

        # Stage 2: Batch Crop Preprocessing & Tensor Stack
        crop_tensors = []
        valid_boxes = []

        for b in boxes:
            x, y, w, h = b["x"], b["y"], b["w"], b["h"]
            # Crop sub-image with small padding if possible
            crop_img = image.crop((x, y, x + w, y + h))
            crop_tensor = self._transform(crop_img)
            crop_tensors.append(crop_tensor)
            valid_boxes.append(b)

        if not crop_tensors:
            # Fallback to full image if no boxes extracted
            crop_tensors = [self._transform(image)]
            valid_boxes = [{"x": 0, "y": 0, "w": img_width, "h": img_height}]

        # Stack into single batch tensor: shape [N, 3, 392, 392]
        batch_tensor = torch.stack(crop_tensors).to(self._device)

        # Stage 3: GPU Batch Inference Pass
        try:
            with torch.no_grad():
                out = self._model.predict(batch_tensor)

            ranks_np = out["ranks"].cpu().numpy()
            scores_np = out["scores"].cpu().numpy()
            probs_np = out["probabilities"].cpu().numpy()

            # Ensure 1D arrays for single item vs N items
            if ranks_np.ndim == 0:
                ranks_np = np.array([ranks_np])
                scores_np = np.array([scores_np])
                probs_np = np.array([probs_np])

            items_res = []
            dist_counts = {"A": 0, "B": 0, "C": 0, "D": 0}

            for i, box in enumerate(valid_boxes):
                r_idx = int(ranks_np[i])
                score_val = float(scores_np[i])
                prob_vals = probs_np[i]

                item_grade = GRADE_NAMES[r_idx] if r_idx < len(GRADE_NAMES) else "D"
                item_conf = float(prob_vals[r_idx])
                dist_counts[item_grade] = dist_counts.get(item_grade, 0) + 1

                # Calculate CSS percentages for UI bounding boxes
                left_pct = round((box["x"] / img_width) * 100, 1)
                top_pct = round((box["y"] / img_height) * 100, 1)
                width_pct = round((box["w"] / img_width) * 100, 1)
                height_pct = round((box["h"] / img_height) * 100, 1)

                items_res.append({
                    "item_id": i + 1,
                    "bbox": [box["x"], box["y"], box["w"], box["h"]],
                    "left": f"{left_pct}%",
                    "top": f"{top_pct}%",
                    "width": f"{width_pct}%",
                    "height": f"{height_pct}%",
                    "grade": item_grade,
                    "quality_grade": f"Grade {item_grade}",
                    "quality_score": round(score_val, 1),
                    "confidence": round(item_conf, 4),
                    "probabilities": {
                        GRADE_NAMES[j]: round(float(prob_vals[j]), 4) for j in range(len(GRADE_NAMES))
                    },
                    "is_passed": item_grade in ["A", "B", "C"]
                })

            total_items = len(items_res)
            dist_pct = {
                g: round((count / total_items) * 100, 1) for g, count in dist_counts.items()
            }

            # Calculate weighted average quality score
            avg_score = float(np.mean(scores_np)) if len(scores_np) > 0 else 0.0
            
            # Determine overall weighted lot grade & trade recommendation
            if dist_pct["D"] >= 40.0:
                overall_grade = "D"
                trade_recommendation = "❌ Mixed Lot Rejected: High proportion of Grade D / defective specimens (>40%)."
            elif dist_pct["A"] >= 50.0 and dist_counts["D"] == 0:
                overall_grade = "A"
                trade_recommendation = "🌟 Premium Export Grade Mix: Over 50% Grade A produce with zero defect rejection."
            elif (dist_pct["A"] + dist_pct["B"]) >= 65.0:
                overall_grade = "B"
                trade_recommendation = "✅ Standard Commercial Grade Mix: Strong commercial quality suitable for Mandi floor & retail."
            else:
                overall_grade = "C"
                trade_recommendation = "⚠️ Secondary Processing Grade Mix: Recommended for millers, canning, and juice processing."

            elapsed_ms = (time.time() - start_time) * 1000.0

            return {
                "items_count": total_items,
                "overall_grade": overall_grade,
                "quality_grade": f"Grade {overall_grade}",
                "overall_quality_score": round(avg_score, 1),
                "quality_score": round(avg_score, 1),
                "distribution": dist_counts,
                "distribution_pct": dist_pct,
                "trade_recommendation": trade_recommendation,
                "inference_time_ms": round(elapsed_ms, 2),
                "items": items_res,
                "is_passed": overall_grade in ["A", "B", "C"]
            }

        except Exception as e:
            return {
                "error": f"Multi-item inference pass failed: {str(e)}",
                "items_count": 0,
                "overall_grade": "D",
                "overall_quality_score": 0.0,
                "distribution": {"A": 0, "B": 0, "C": 0, "D": 0},
                "distribution_pct": {"A": 0.0, "B": 0.0, "C": 0.0, "D": 0.0},
                "items": [],
                "is_passed": False
            }

    def _extract_item_bounding_boxes(self, img_np: np.ndarray, img_w: int, img_h: int) -> list:
        """
        Extracts candidate produce item bounding boxes using contour detection / salient color space segmentation.
        Fallback to grid segmentation if items are densely packed.
        """
        boxes = []
        try:
            import cv2
            gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)

            # Adaptive Otsu Thresholding to separate foreground produce from background
            _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

            contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            min_area = (img_w * img_h) * 0.015  # At least 1.5% of total image area

            for cnt in contours:
                area = cv2.contourArea(cnt)
                if area >= min_area:
                    x, y, w, h = cv2.boundingRect(cnt)
                    # Ignore boxes touching entire outer border
                    if w < img_w * 0.95 or h < img_h * 0.95:
                        boxes.append({"x": x, "y": y, "w": w, "h": h})
        except Exception:
            pass

        # If fewer than 2 boxes found (e.g. packed box or single pile), generate candidate region grid
        if len(boxes) < 2:
            boxes = []
            grid_cols, grid_rows = 3, 2
            cell_w = int(img_w / grid_cols)
            cell_h = int(img_h / grid_rows)

            for r in range(grid_rows):
                for c in range(grid_cols):
                    bx = int(c * cell_w + cell_w * 0.05)
                    by = int(r * cell_h + cell_h * 0.05)
                    bw = int(cell_w * 0.90)
                    bh = int(cell_h * 0.90)
                    boxes.append({"x": bx, "y": by, "w": bw, "h": bh})

        # Cap max items to 20 for optimal performance
        return boxes[:20]

    def health_check(self) -> Dict[str, Any]:
        """
        Returns model status, loaded device, checkpoint path, accuracy, and QWK score.
        """
        is_loaded = self._model is not None
        return {
            "loaded": is_loaded,
            "device": str(self._device) if self._device else "none",
            "model_path": self._model_path,
            "backbone": self._config["model"]["backbone_name"] if self._config else "dinov2_vitb14",
            "accuracy": 0.6814,
            "qwk": 0.9107
        }

# Global Singleton Instance
crop_quality_predictor = CropQualityPredictor()

