import os
import logging
import cv2
import numpy as np
import onnxruntime as ort
from PIL import Image
from typing import Dict, Any, List, Optional, Tuple

logger = logging.getLogger(__name__)

class ONNXInferenceService:
    """
    Singleton service for high-performance dual-input DINOv2 + CORAL ONNX inference.
    Loads the ONNX model once at startup and executes on NVIDIA GPU (CUDAExecutionProvider)
    with automatic CPU fallback.
    """
    _instance: Optional["ONNXInferenceService"] = None

    def __new__(cls, model_path: Optional[str] = None):
        if cls._instance is None:
            cls._instance = super(ONNXInferenceService, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self, model_path: Optional[str] = None):
        # Guarantee single initialization
        if self._initialized:
            return

        self.model_path = model_path or self._resolve_model_path()
        self.session = self._initialize_session()
        self._initialized = True

    def _resolve_model_path(self) -> str:
        """
        Locates the exported dual-input crop_quality_dino.onnx model across relative project paths.
        """
        candidate_paths = [
            os.path.abspath("crop_quality_ai/checkpoints/crop_quality_dino.onnx"),
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "crop_quality_ai", "checkpoints", "crop_quality_dino.onnx")),
            os.path.abspath("backend/app/core/ml_models/crop_quality_dino.onnx"),
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "core", "ml_models", "crop_quality_dino.onnx")),
        ]

        for path in candidate_paths:
            if os.path.exists(path):
                logger.info(f"[ONNXInferenceService] Located ONNX checkpoint at: {path}")
                return path

        raise FileNotFoundError(
            f"[ONNXInferenceService] Could not locate 'crop_quality_dino.onnx'. "
            f"Searched candidate paths: {candidate_paths}"
        )

    def _initialize_session(self) -> ort.InferenceSession:
        """
        Initializes ONNX Runtime session targeting CUDAExecutionProvider with CPU fallback.
        """
        requested_providers = ["CUDAExecutionProvider", "CPUExecutionProvider"]
        available_providers = ort.get_available_providers()
        logger.info(f"[ONNXInferenceService] Available ONNX providers: {available_providers}")

        # Configure session options for optimal performance
        sess_options = ort.SessionOptions()
        sess_options.execution_mode = ort.ExecutionMode.ORT_SEQUENTIAL
        sess_options.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL

        session = ort.InferenceSession(
            self.model_path,
            sess_options=sess_options,
            providers=requested_providers
        )

        active_providers = session.get_providers()
        logger.info(f"[ONNXInferenceService] Successfully loaded ONNX session with active providers: {active_providers}")
        return session

    def extract_handcrafted_features(self, image: np.ndarray) -> np.ndarray:
        """
        Extracts exactly 32 domain-specific color, texture, shape, and defect features
        from an RGB uint8 image [H, W, 3] using OpenCV.

        Returns:
            np.ndarray of shape [1, 32] and float32 dtype.
        """
        if image.ndim != 3 or image.shape[2] != 3:
            raise ValueError(f"Input image must be [H, W, 3] RGB array, got shape {image.shape}")

        img_rgb = image.astype(np.uint8)
        h, w, _ = img_rgb.shape
        total_pixels = float(max(h * w, 1))

        # -------------------------------------------------------------
        # 1. Color Features (12 dimensions)
        # -------------------------------------------------------------
        rgb_mean = np.mean(img_rgb, axis=(0, 1)) / 255.0  # 3 dims
        rgb_std = np.std(img_rgb, axis=(0, 1)) / 255.0    # 3 dims

        hsv_img = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2HSV)
        hsv_mean = np.mean(hsv_img, axis=(0, 1)) / np.array([180.0, 255.0, 255.0])  # 3 dims
        hsv_std = np.std(hsv_img, axis=(0, 1)) / np.array([180.0, 255.0, 255.0])    # 3 dims
        color_feats = np.concatenate([rgb_mean, rgb_std, hsv_mean, hsv_std])

        # -------------------------------------------------------------
        # 2. Texture Features via 8-neighbor LBP (8 dimensions)
        # -------------------------------------------------------------
        gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
        padded = np.pad(gray, 1, mode='edge')
        center = padded[1:-1, 1:-1]
        lbp = np.zeros_like(center, dtype=np.uint8)

        neighbors = [
            padded[:-2, :-2], padded[:-2, 1:-1], padded[:-2, 2:],
            padded[1:-1, 2:], padded[2:, 2:], padded[2:, 1:-1],
            padded[2:, :-2], padded[1:-1, :-2]
        ]
        for i, n in enumerate(neighbors):
            lbp |= ((n >= center).astype(np.uint8) << i)

        lbp_hist, _ = np.histogram(lbp.ravel(), bins=8, range=(0, 256), density=True)
        texture_feats = lbp_hist.astype(np.float32)

        # -------------------------------------------------------------
        # 3. Shape & Geometry Features (6 dimensions)
        # -------------------------------------------------------------
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        if contours:
            largest_cnt = max(contours, key=cv2.contourArea)
            area = float(cv2.contourArea(largest_cnt))
            perimeter = float(cv2.arcLength(largest_cnt, True))
            _, _, w_b, h_b = cv2.boundingRect(largest_cnt)

            aspect_ratio = float(w_b) / float(max(h_b, 1))
            compactness = (perimeter ** 2) / (4.0 * np.pi * max(area, 1.0))
            extent = area / float(max(w_b * h_b, 1))
            hull_area = float(cv2.contourArea(cv2.convexHull(largest_cnt)))
            solidity = area / float(max(hull_area, 1.0))
            perim_area_ratio = perimeter / float(max(area, 1.0))
            norm_area = area / total_pixels
        else:
            aspect_ratio, compactness, extent, solidity, perim_area_ratio, norm_area = 1.0, 1.0, 0.5, 0.5, 0.01, 0.5

        shape_feats = np.array(
            [aspect_ratio, compactness, extent, solidity, perim_area_ratio, norm_area],
            dtype=np.float32
        )

        # -------------------------------------------------------------
        # 4. Defect & Surface Blemish Features (6 dimensions)
        # -------------------------------------------------------------
        dark_pixels = (gray < 60).astype(np.float32)
        dark_ratio = np.sum(dark_pixels) / total_pixels
        
        contrast_spots = (np.abs(gray.astype(float) - np.mean(gray)) > (2.0 * np.std(gray))).astype(np.float32)
        contrast_ratio = np.sum(contrast_spots) / total_pixels

        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.sum(edges > 0) / total_pixels

        color_var = float(np.var(rgb_std))
        defect_severity = float(min(dark_ratio * 4.0 + contrast_ratio * 2.0, 1.0))
        rot_index = float(np.sum((img_rgb[:, :, 0] < 50) & (img_rgb[:, :, 1] < 50) & (img_rgb[:, :, 2] < 50)) / total_pixels)

        defect_feats = np.array(
            [dark_ratio, contrast_ratio, edge_density, color_var, defect_severity, rot_index],
            dtype=np.float32
        )

        # -------------------------------------------------------------
        # Combine & Enforce Exactly 32 Dimensions [1, 32]
        # -------------------------------------------------------------
        features_32 = np.concatenate([color_feats, texture_feats, shape_feats, defect_feats]).astype(np.float32)

        if len(features_32) < 32:
            features_32 = np.pad(features_32, (0, 32 - len(features_32)), mode='constant')
        elif len(features_32) > 32:
            features_32 = features_32[:32]

        return np.expand_dims(features_32, axis=0)

    def preprocess_image_tensor(self, pil_image: Image.Image, target_size: int = 392) -> np.ndarray:
        """
        Applies exact validation pre-processing pipeline:
        1. Resize to target size (392x392) with Bicubic interpolation.
        2. Normalize image with ImageNet mean [0.485, 0.456, 0.406] and std [0.229, 0.224, 0.225].
        3. Formats array to NCHW shape [1, 3, 392, 392] with float32 precision.
        """
        rgb_img = pil_image.convert("RGB").resize((target_size, target_size), Image.Resampling.BICUBIC)
        img_np = np.array(rgb_img, dtype=np.float32) / 255.0

        # ImageNet Mean & Std Normalization
        mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
        img_normalized = (img_np - mean) / std

        # Transpose [H, W, C] -> [C, H, W] and add batch dimension -> [1, C, H, W]
        img_chw = np.transpose(img_normalized, (2, 0, 1))
        return np.expand_dims(img_chw, axis=0).astype(np.float32)

    def generate_tta_views(self, base_tensor: np.ndarray) -> List[np.ndarray]:
        """
        Generates 4 spatial Test-Time Augmentation (TTA) views using NumPy/OpenCV:
        1. View 1: Original Image
        2. View 2: Horizontal Flip
        3. View 3: 10-degree Rotation
        4. View 4: Gaussian Blur
        """
        # View 1: Original
        v1_orig = base_tensor.copy()

        # View 2: Horizontal Flip (along spatial W axis, index 3)
        v2_hflip = np.flip(base_tensor, axis=3).copy()

        # View 3: 10-degree Rotation using OpenCV warpAffine
        img_chw = base_tensor[0]
        c, h, w = img_chw.shape
        rot_mat = cv2.getRotationMatrix2D((w / 2.0, h / 2.0), 10.0, 1.0)
        v3_rotated = np.zeros_like(img_chw)
        for channel in range(c):
            v3_rotated[channel] = cv2.warpAffine(img_chw[channel], rot_mat, (w, h), flags=cv2.INTER_LINEAR)
        v3_rotate = np.expand_dims(v3_rotated, axis=0)

        # View 4: Gaussian Blur
        v4_blurred = np.zeros_like(img_chw)
        for channel in range(c):
            v4_blurred[channel] = cv2.GaussianBlur(img_chw[channel], (3, 3), 0.5)
        v4_blur = np.expand_dims(v4_blurred, axis=0)

        return [v1_orig, v2_hflip, v3_rotate, v4_blur]

    def predict(self, image_pil: Image.Image) -> Dict[str, Any]:
        """
        Runs complete ONNX crop quality prediction:
        1. Extracts 32 handcrafted domain features from raw RGB numpy array.
        2. Applies standard ImageNet validation transforms (392x392).
        3. Runs 4-view TTA through ONNX Runtime graph.
        4. Computes CORAL ordinal logits, ranks, continuous scores, and class probabilities.
        """
        raw_rgb = np.array(image_pil.convert("RGB"))

        # Step 1: Handcrafted feature extraction [1, 32]
        handcrafted_feat = self.extract_handcrafted_features(raw_rgb)

        # Step 2: Preprocess base image tensor [1, 3, 392, 392]
        base_tensor = self.preprocess_image_tensor(image_pil, target_size=392)

        # Step 3: Generate 4 TTA views
        tta_views = self.generate_tta_views(base_tensor)

        # Step 4: Run ONNX Runtime inference across TTA views and average logits
        accumulated_logits = np.zeros((1, 3), dtype=np.float32)

        for view_tensor in tta_views:
            ort_inputs = {
                "images": view_tensor,
                "handcrafted": handcrafted_feat
            }
            ort_outputs = self.session.run(None, ort_inputs)
            accumulated_logits += ort_outputs[0]

        avg_logits = accumulated_logits / float(len(tta_views))

        # Step 5: CORAL Ordinal Head Math
        # sigmoids P(Y > k) for k in {0, 1, 2}
        sigmoids = 1.0 / (1.0 + np.exp(-avg_logits[0]))

        # Discrete predicted rank (count of binary task cuts exceeding 0.5)
        predicted_rank = int(np.sum(sigmoids > 0.5))

        # Class Probability Distribution P(Y = k)
        probs = np.zeros(4, dtype=np.float32)
        probs[0] = 1.0 - sigmoids[0]
        probs[1] = sigmoids[0] - sigmoids[1]
        probs[2] = sigmoids[1] - sigmoids[2]
        probs[3] = sigmoids[2]

        probs = np.clip(probs, 1e-7, 1.0)
        probs = probs / np.sum(probs)

        # Continuous Score Expectation E[Rank] = sum(k * P(Y=k))
        class_indices = np.array([0.0, 1.0, 2.0, 3.0], dtype=np.float32)
        continuous_score = float(np.sum(probs * class_indices))

        grade_map = {
            0: "Grade A",
            1: "Grade B",
            2: "Grade C",
            3: "Grade D"
        }
        grade_label = grade_map.get(predicted_rank, "Grade D")

        return {
            "predicted_rank": predicted_rank,
            "grade_label": grade_label,
            "continuous_score": round(continuous_score, 4),
            "probabilities": {
                "Grade A": round(float(probs[0]), 4),
                "Grade B": round(float(probs[1]), 4),
                "Grade C": round(float(probs[2]), 4),
                "Grade D": round(float(probs[3]), 4)
            }
        }
