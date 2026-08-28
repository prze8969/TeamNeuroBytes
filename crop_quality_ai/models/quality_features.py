import numpy as np
import cv2
from typing import Dict, Any, List
try:
    from skimage.feature import local_binary_pattern
except Exception:
    local_binary_pattern = None

class QualityFeatureExtractor:
    """
    Extracts explicit, interpretable agricultural quality features:
    - Color: RGB/HSV statistics, brightness, saturation, uniformity index
    - Texture: Local Binary Patterns (LBP), edge density, local variance
    - Shape: Aspect ratio, circularity, bounding dimensions
    - Defect: Blemish ratio, dark spot percentage, discoloration index
    """
    def __init__(self, lbp_points: int = 8, lbp_radius: float = 1.0):
        self.lbp_points = lbp_points
        self.lbp_radius = lbp_radius
        self.feature_names = [
            "r_mean", "g_mean", "b_mean", "r_std", "g_std", "b_std",
            "h_mean", "s_mean", "v_mean", "h_std", "s_std", "v_std",
            "brightness", "saturation", "color_uniformity",
            "edge_density", "local_variance", "lbp_mean", "lbp_std",
            "aspect_ratio", "circularity",
            "dark_spot_percent", "discoloration_percent", "defect_ratio"
        ]
        self.feature_dim = len(self.feature_names)

    def extract_from_numpy(self, img_np: np.ndarray) -> np.ndarray:
        """
        Input: RGB uint8 numpy array (H, W, 3)
        Output: Normalized float32 feature vector of length 24
        """
        h, w, _ = img_np.shape
        img_np_float = img_np.astype(np.float32)

        # 1. Color Features
        r, g, b = img_np_float[:, :, 0], img_np_float[:, :, 1], img_np_float[:, :, 2]
        r_mean, g_mean, b_mean = float(np.mean(r)), float(np.mean(g)), float(np.mean(b))
        r_std, g_std, b_std = float(np.std(r)), float(np.std(g)), float(np.std(b))

        # HSV conversion
        img_hsv = cv2.cvtColor(img_np, cv2.COLOR_RGB2HSV).astype(np.float32)
        h_channel, s_channel, v_channel = img_hsv[:, :, 0], img_hsv[:, :, 1], img_hsv[:, :, 2]

        h_mean, s_mean, v_mean = float(np.mean(h_channel)), float(np.mean(s_channel)), float(np.mean(v_channel))
        h_std, s_std, v_std = float(np.std(h_channel)), float(np.std(s_channel)), float(np.std(v_channel))

        brightness = float(0.299 * r_mean + 0.587 * g_mean + 0.114 * b_mean)
        saturation = float(s_mean)
        color_uniformity = float(100.0 - np.mean([r_std, g_std, b_std]))

        # 2. Texture Features
        gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
        edges = cv2.Canny(gray, 50, 150)
        edge_density = float(np.sum(edges > 0) / (h * w))
        local_variance = float(np.var(gray))

        try:
            lbp = local_binary_pattern(gray, self.lbp_points, self.lbp_radius, method="uniform")
            lbp_mean = float(np.mean(lbp))
            lbp_std = float(np.std(lbp))
        except Exception:
            lbp_mean, lbp_std = 0.0, 0.0

        # 3. Shape Features (assuming foreground object)
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if len(contours) > 0:
            c = max(contours, key=cv2.contourArea)
            area = cv2.contourArea(c)
            perimeter = cv2.arcLength(c, True)
            x, y, cw, ch = cv2.boundingRect(c)
            aspect_ratio = float(cw / (ch + 1e-5))
            circularity = float(4 * np.pi * area / ((perimeter + 1e-5) ** 2))
        else:
            aspect_ratio = 1.0
            circularity = 1.0

        # 4. Defect Features
        luminance = 0.299 * r + 0.587 * g + 0.114 * b
        dark_mask = (luminance < 50) & (r < 65) & (g < 65) & (b < 65)
        dark_spot_percent = float(np.sum(dark_mask) / (h * w) * 100.0)

        discoloration_mask = (s_channel < 30) & (luminance > 40) & (luminance < 210)
        discoloration_percent = float(np.sum(discoloration_mask) / (h * w) * 100.0)
        defect_ratio = float((dark_spot_percent * 1.5 + discoloration_percent * 0.5) / 100.0)

        features = np.array([
            r_mean / 255.0, g_mean / 255.0, b_mean / 255.0,
            r_std / 128.0, g_std / 128.0, b_std / 128.0,
            h_mean / 180.0, s_mean / 255.0, v_mean / 255.0,
            h_std / 90.0, s_std / 128.0, v_std / 128.0,
            brightness / 255.0, saturation / 255.0, color_uniformity / 100.0,
            edge_density, local_variance / 5000.0, lbp_mean / 10.0, lbp_std / 10.0,
            min(aspect_ratio, 5.0) / 5.0, min(circularity, 1.0),
            dark_spot_percent / 100.0, discoloration_percent / 100.0, min(defect_ratio, 1.0)
        ], dtype=np.float32)

        return features
