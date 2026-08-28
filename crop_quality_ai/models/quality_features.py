import torch
import torch.nn as nn
import numpy as np
import cv2
from PIL import Image
from typing import List, Union

class QualityFeatureExtractor(nn.Module):
    """
    Computes 32 lightweight, explicit handcrafted domain features for agricultural crop quality:
    - Color (12 dims): RGB/HSV means, stds, hue & saturation ratios
    - Texture/LBP (8 dims): Local Binary Pattern texture histogram & variance
    - Shape (6 dims): Compactness, aspect ratio, perimeter/area ratio, eccentricity
    - Defects (6 dims): Dark spot density, blemish surface percentage, color variance
    """
    def __init__(self, feature_dim: int = 32):
        super().__init__()
        self.feature_dim = feature_dim

    def extract_single_np(self, img_np: np.ndarray) -> np.ndarray:
        """
        Extracts 32-dim feature vector from a single RGB uint8 image [H, W, 3].
        """
        h, w, _ = img_np.shape
        total_pixels = float(h * w)

        # 1. Color Features (12 dims)
        rgb_mean = np.mean(img_np, axis=(0, 1)) / 255.0  # 3 dims
        rgb_std = np.std(img_np, axis=(0, 1)) / 255.0    # 3 dims
        
        hsv_img = cv2.cvtColor(img_np, cv2.COLOR_RGB2HSV)
        hsv_mean = np.mean(hsv_img, axis=(0, 1)) / [180.0, 255.0, 255.0] # 3 dims
        hsv_std = np.std(hsv_img, axis=(0, 1)) / [180.0, 255.0, 255.0]   # 3 dims
        color_feats = np.concatenate([rgb_mean, rgb_std, hsv_mean, hsv_std])

        # 2. Texture & LBP Features (8 dims)
        gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
        # Compute simplified LBP texture
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
        texture_feats = lbp_hist # 8 dims

        # 3. Shape & Compactness Features (6 dims)
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if contours:
            largest_cnt = max(contours, key=cv2.contourArea)
            area = float(cv2.contourArea(largest_cnt))
            perimeter = float(cv2.arcLength(largest_cnt, True))
            bx, by, bw, bh = cv2.boundingRect(largest_cnt)
            aspect_ratio = float(bw) / float(bh + 1e-5)
            compactness = (perimeter ** 2) / (4.0 * np.pi * area + 1e-5)
            extent = area / float(bw * bh + 1e-5)
            solidity = area / float(cv2.contourArea(cv2.convexHull(largest_cnt)) + 1e-5)
            area_ratio = area / total_pixels
        else:
            aspect_ratio, compactness, extent, solidity, area_ratio = 1.0, 1.0, 0.5, 0.5, 0.5

        shape_feats = np.array([aspect_ratio, compactness, extent, solidity, area_ratio, min(compactness / 10.0, 1.0)], dtype=np.float32)

        # 4. Defect & Spot Features (6 dims)
        # Blemish detection via luminance & color variance thresholding
        luminance = 0.299 * img_np[:, :, 0] + 0.587 * img_np[:, :, 1] + 0.114 * img_np[:, :, 2]
        dark_spots = (luminance < 60).astype(np.float32)
        dark_ratio = np.sum(dark_spots) / total_pixels
        
        high_contrast_spots = (np.abs(gray.astype(float) - np.mean(gray)) > 2.0 * np.std(gray)).astype(np.float32)
        contrast_ratio = np.sum(high_contrast_spots) / total_pixels
        
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.sum(edges > 0) / total_pixels

        color_var = np.var(rgb_std)
        defect_severity = min(dark_ratio * 4.0 + contrast_ratio * 2.0, 1.0)
        rot_index = float(np.sum((img_np[:, :, 0] < 50) & (img_np[:, :, 1] < 50) & (img_np[:, :, 2] < 50)) / total_pixels)

        defect_feats = np.array([dark_ratio, contrast_ratio, edge_density, color_var, defect_severity, rot_index], dtype=np.float32)

        feat_32 = np.concatenate([color_feats, texture_feats, shape_feats, defect_feats]).astype(np.float32)
        # Ensure 32 dims
        if len(feat_32) < 32:
            feat_32 = np.pad(feat_32, (0, 32 - len(feat_32)))
        elif len(feat_32) > 32:
            feat_32 = feat_32[:32]
            
        return feat_32

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Input: [B, 3, H, W] normalized PyTorch tensor or unnormalized RGB tensor.
        Output: [B, 32] handcrafted feature tensor.
        """
        device = x.device
        batch_size = x.shape[0]
        feats_list = []

        # Convert tensor batch to uint8 numpy for opencv/lbp calculations
        x_np = x.detach().cpu().numpy()
        # Scale if normalized
        if x_np.max() <= 1.0:
            x_np = (x_np * 255.0).astype(np.uint8)
        else:
            x_np = x_np.astype(np.uint8)

        # Transpose [B, C, H, W] -> [B, H, W, C]
        x_np = np.transpose(x_np, (0, 2, 3, 1))

        for i in range(batch_size):
            feat = self.extract_single_np(x_np[i])
            feats_list.append(feat)

        out_tensor = torch.from_numpy(np.stack(feats_list, axis=0)).to(device=device, dtype=torch.float32)
        return out_tensor
