import os
import logging
import asyncio
import cv2
import numpy as np
import onnxruntime as ort
from PIL import Image
from typing import Dict, Any, List, Optional
from fastapi.concurrency import run_in_threadpool

logger = logging.getLogger(__name__)

class CropGradingService:
    """
    Singleton service class for DINOv2 + CORAL Ordinal ONNX crop quality grading.
    Provides robust ONNX execution provider fallbacks, exact PyTorch-aligned image preprocessing,
    32 handcrafted feature extraction, and async non-blocking execution via thread pooling.
    """
    _instance: Optional["CropGradingService"] = None

    def __new__(cls, model_path: Optional[str] = None):
        if cls._instance is None:
            cls._instance = super(CropGradingService, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self, model_path: Optional[str] = None):
        if self._initialized:
            return

        self.model_path = model_path or self._resolve_model_path()
        self.session = self._initialize_session_safe()
        self._initialized = True

    def _resolve_model_path(self) -> str:
        """
        Resolves the absolute file path to crop_quality_dino.onnx across candidate project directories.
        """
        candidate_paths = [
            os.path.abspath("crop_quality_ai/checkpoints/crop_quality_dino.onnx"),
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "crop_quality_ai", "checkpoints", "crop_quality_dino.onnx")),
            os.path.abspath("backend/app/core/ml_models/crop_quality_dino.onnx"),
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "core", "ml_models", "crop_quality_dino.onnx")),
        ]

        for path in candidate_paths:
            if os.path.exists(path):
                logger.info(f"[CropGradingService] Found ONNX model at: {path}")
                return path

        raise FileNotFoundError(
            f"[CropGradingService] Could not locate 'crop_quality_dino.onnx'. "
            f"Checked candidate paths: {candidate_paths}"
        )

    def _initialize_session_safe(self) -> ort.InferenceSession:
        """
        Initializes ONNX Runtime session with strict fallback handling:
        Tries CUDAExecutionProvider first. If CUDA initialization fails or GPU libraries are missing,
        gracefully falls back to CPUExecutionProvider without crashing the application.
        """
        sess_options = ort.SessionOptions()
        sess_options.execution_mode = ort.ExecutionMode.ORT_SEQUENTIAL
        sess_options.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL

        # 1. Attempt GPU Execution Provider
        try:
            available_providers = ort.get_available_providers()
            logger.info(f"[CropGradingService] Available ONNX Execution Providers: {available_providers}")

            if "CUDAExecutionProvider" in available_providers:
                logger.info("[CropGradingService] Attempting to initialize ONNX session with CUDAExecutionProvider...")
                session = ort.InferenceSession(
                    self.model_path,
                    sess_options=sess_options,
                    providers=["CUDAExecutionProvider", "CPUExecutionProvider"]
                )
                logger.info(f"[CropGradingService] Active ONNX Providers: {session.get_providers()}")
                return session

        except Exception as cuda_err:
            logger.warning(f"[CropGradingService] CUDA initialization failed ({cuda_err}). Falling back to CPU...")

        # 2. Fallback to CPU Execution Provider
        logger.info("[CropGradingService] Initializing ONNX session with CPUExecutionProvider fallback...")
        session = ort.InferenceSession(
            self.model_path,
            sess_options=sess_options,
            providers=["CPUExecutionProvider"]
        )
        logger.info(f"[CropGradingService] Active ONNX Providers: {session.get_providers()}")
        return session

    def preprocess_image(self, image_pil: Image.Image) -> np.ndarray:
        """
        Preprocesses a raw input PIL Image to match PyTorch validation transforms:
        1. Strictly converts to RGB color space.
        2. Applies PyTorch-style Resize(392) preserving aspect ratio (scales shorter edge to 392).
        3. Applies CenterCrop(392) to yield an exact [392, 392] square crop.
        4. Scales pixel values to [0.0, 1.0] float32.
        5. Normalizes using ImageNet mean=[0.485, 0.456, 0.406] and std=[0.229, 0.224, 0.225].
        6. Transposes layout from HWC to CHW and adds batch dimension -> [1, 3, 392, 392].
        """
        # Ensure strict RGB color space
        img_rgb = image_pil.convert("RGB")
        w, h = img_rgb.size

        # 1. PyTorch Resize(392) preserving aspect ratio
        target_short_edge = 392
        min_dim = float(min(w, h))
        scale = target_short_edge / min_dim
        new_w = int(round(w * scale))
        new_h = int(round(h * scale))

        resized_img = img_rgb.resize((new_w, new_h), Image.Resampling.BICUBIC)

        # 2. PyTorch CenterCrop(392)
        left = (new_w - target_short_edge) // 2
        top = (new_h - target_short_edge) // 2
        right = left + target_short_edge
        bottom = top + target_short_edge

        cropped_img = resized_img.crop((left, top, right, bottom))

        # 3. Convert to Float32 NumPy Array [392, 392, 3] in [0, 1]
        img_np = np.array(cropped_img, dtype=np.float32) / 255.0

        # 4. Standard ImageNet Normalization
        mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
        img_norm = (img_np - mean) / std

        # 5. Transpose HWC -> CHW and expand batch axis -> [1, 3, 392, 392]
        img_chw = np.transpose(img_norm, (2, 0, 1))
        return np.expand_dims(img_chw, axis=0).astype(np.float32)

    def get_handcrafted_features(
        self,
        image_np: np.ndarray,
        override_features: Optional[List[float]] = None
    ) -> np.ndarray:
        """
        ====================================================================================
        CRITICAL FEATURE ALIGNMENT REQUIREMENT:
        ------------------------------------------------------------------------------------
        The dual-input DINOv2 ONNX model requires a second input tensor named 'handcrafted'
        with shape [1, 32] float32. These 32 domain features MUST correspond to the exact
        statistical feature extraction pipeline used during model training:
        - 12 Color features: RGB means (3), RGB stds (3), HSV means (3), HSV stds (3).
        - 8 Texture features: 8-bin Local Binary Pattern (LBP) histogram.
        - 6 Shape features: aspect ratio, compactness, extent, solidity, perimeter/area ratio, norm area.
        - 6 Defect features: dark pixel ratio, contrast spot ratio, edge density, color variance,
          defect severity, rot index.

        If 'override_features' is supplied (e.g. pre-calculated by frontend or edge camera),
        it overrides auto-extraction, allowing zero-latency client-side feature passing.
        ====================================================================================
        """
        if override_features is not None:
            feat_arr = np.array(override_features, dtype=np.float32).ravel()
            if len(feat_arr) < 32:
                feat_arr = np.pad(feat_arr, (0, 32 - len(feat_arr)), mode='constant')
            elif len(feat_arr) > 32:
                feat_arr = feat_arr[:32]
            return np.expand_dims(feat_arr, axis=0)

        # OpenCV automatic 32-feature extraction from raw RGB image [H, W, 3]
        img_rgb = image_np.astype(np.uint8)
        h, w, _ = img_rgb.shape
        total_pixels = float(max(h * w, 1))

        # 1. Color Features (12 dims)
        rgb_mean = np.mean(img_rgb, axis=(0, 1)) / 255.0
        rgb_std = np.std(img_rgb, axis=(0, 1)) / 255.0

        hsv_img = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2HSV)
        hsv_mean = np.mean(hsv_img, axis=(0, 1)) / np.array([180.0, 255.0, 255.0])
        hsv_std = np.std(hsv_img, axis=(0, 1)) / np.array([180.0, 255.0, 255.0])
        color_feats = np.concatenate([rgb_mean, rgb_std, hsv_mean, hsv_std])

        # 2. Texture LBP Features (8 dims)
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

        # 3. Shape & Geometry Features (6 dims)
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

        shape_feats = np.array([aspect_ratio, compactness, extent, solidity, perim_area_ratio, norm_area], dtype=np.float32)

        # 4. Defect Features (6 dims)
        dark_pixels = (gray < 60).astype(np.float32)
        dark_ratio = np.sum(dark_pixels) / total_pixels

        contrast_spots = (np.abs(gray.astype(float) - np.mean(gray)) > (2.0 * np.std(gray))).astype(np.float32)
        contrast_ratio = np.sum(contrast_spots) / total_pixels

        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.sum(edges > 0) / total_pixels

        color_var = float(np.var(rgb_std))
        defect_severity = float(min(dark_ratio * 4.0 + contrast_ratio * 2.0, 1.0))
        rot_index = float(np.sum((img_rgb[:, :, 0] < 50) & (img_rgb[:, :, 1] < 50) & (img_rgb[:, :, 2] < 50)) / total_pixels)

        defect_feats = np.array([dark_ratio, contrast_ratio, edge_density, color_var, defect_severity, rot_index], dtype=np.float32)

        # Concatenate and pad/truncate to exactly 32 dimensions [1, 32]
        all_feats = np.concatenate([color_feats, texture_feats, shape_feats, defect_feats]).astype(np.float32)
        if len(all_feats) < 32:
            all_feats = np.pad(all_feats, (0, 32 - len(all_feats)), mode='constant')
        elif len(all_feats) > 32:
            all_feats = all_feats[:32]

        return np.expand_dims(all_feats, axis=0)

    def generate_tta_views(self, base_tensor: np.ndarray) -> List[np.ndarray]:
        """
        Generates 4 NumPy/OpenCV Test-Time Augmentation (TTA) views:
        1. View 1: Original Image
        2. View 2: Horizontal Flip
        3. View 3: 10-degree Rotation
        4. View 4: Gaussian Blur
        """
        v1_orig = base_tensor.copy()
        v2_hflip = np.flip(base_tensor, axis=3).copy()

        img_chw = base_tensor[0]
        c, h, w = img_chw.shape
        rot_mat = cv2.getRotationMatrix2D((w / 2.0, h / 2.0), 10.0, 1.0)
        v3_rotated = np.zeros_like(img_chw)
        for channel in range(c):
            v3_rotated[channel] = cv2.warpAffine(img_chw[channel], rot_mat, (w, h), flags=cv2.INTER_LINEAR)
        v3_rotate = np.expand_dims(v3_rotated, axis=0)

        v4_blurred = np.zeros_like(img_chw)
        for channel in range(c):
            v4_blurred[channel] = cv2.GaussianBlur(img_chw[channel], (3, 3), 0.5)
        v4_blur = np.expand_dims(v4_blurred, axis=0)

        return [v1_orig, v2_hflip, v3_rotate, v4_blur]

    def predict_sync(
        self,
        image_pil: Image.Image,
        override_features: Optional[List[float]] = None
    ) -> Dict[str, Any]:
        """
        Synchronous core prediction function:
        1. Preprocesses image tensor to [1, 3, 392, 392].
        2. Obtains 32 handcrafted domain features [1, 32].
        3. Generates 4 TTA views and executes ONNX session.
        4. Averages CORAL logits and calculates rank, continuous score, and class probabilities.
        """
        raw_rgb = np.array(image_pil.convert("RGB"))
        handcrafted_input = self.get_handcrafted_features(raw_rgb, override_features=override_features)
        base_tensor = self.preprocess_image(image_pil)
        tta_views = self.generate_tta_views(base_tensor)

        accumulated_logits = np.zeros((1, 3), dtype=np.float32)
        for view_tensor in tta_views:
            inputs = {
                "images": view_tensor,
                "handcrafted": handcrafted_input
            }
            outputs = self.session.run(None, inputs)
            accumulated_logits += outputs[0]

        avg_logits = accumulated_logits / float(len(tta_views))

        # CORAL Sigmoids P(Y > k) for k in {0, 1, 2}
        sigmoids = 1.0 / (1.0 + np.exp(-avg_logits[0]))
        predicted_rank = int(np.sum(sigmoids > 0.5))

        # Probability distribution across 4 classes P(Y = k)
        probs = np.zeros(4, dtype=np.float32)
        probs[0] = 1.0 - sigmoids[0]
        probs[1] = sigmoids[0] - sigmoids[1]
        probs[2] = sigmoids[1] - sigmoids[2]
        probs[3] = sigmoids[2]

        probs = np.clip(probs, 1e-7, 1.0)
        probs = probs / np.sum(probs)

        # Expected Continuous Quality Score E[Rank] = sum(k * P(Y=k))
        class_indices = np.array([0.0, 1.0, 2.0, 3.0], dtype=np.float32)
        continuous_score = float(np.sum(probs * class_indices))

        grade_map = {0: "Grade A", 1: "Grade B", 2: "Grade C", 3: "Grade D"}
        grade_label = grade_map.get(predicted_rank, "Grade D")

        return {
            "predicted_rank": predicted_rank,
            "grade_label": grade_label,
            "continuous_score": round(continuous_score, 4),
            "probabilities": {
                "grade_a": round(float(probs[0]), 4),
                "grade_b": round(float(probs[1]), 4),
                "grade_c": round(float(probs[2]), 4),
                "grade_d": round(float(probs[3]), 4)
            }
        }

    async def predict(
        self,
        image_pil: Image.Image,
        override_features: Optional[List[float]] = None
    ) -> Dict[str, Any]:
        """
        Async thread-safe inference wrapper:
        Offloads heavy OpenCV feature extraction, numpy preprocessing, and ONNX Runtime execution
        to an asynchronous worker thread pool using 'run_in_threadpool' / 'asyncio.to_thread'
        to prevent blocking the FastAPI async event loop.
        """
        return await run_in_threadpool(self.predict_sync, image_pil, override_features)
