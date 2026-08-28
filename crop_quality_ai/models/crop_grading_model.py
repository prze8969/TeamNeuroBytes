import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.path.insert(0, os.path.abspath("."))
import torch
import torch.nn as nn
from typing import Dict, Tuple, Any

try:
    from crop_quality_ai.models.dinov3_backbone import DINOBackbone
    from crop_quality_ai.models.quality_features import QualityFeatureExtractor
    from crop_quality_ai.models.feature_fusion import FeatureFusionModule
    from crop_quality_ai.models.ordinal_head import CORALOrdinalHead, CORALLoss
except ModuleNotFoundError:
    from models.dinov3_backbone import DINOBackbone
    from models.quality_features import QualityFeatureExtractor
    from models.feature_fusion import FeatureFusionModule
    from models.ordinal_head import CORALOrdinalHead, CORALLoss

class CropQualityGradingModel(nn.Module):
    """
    Unified Crop Quality Grading Model architecture:
    1. Pretrained DINOv2 / DINOv3 backbone (Initially Frozen).
    2. Lightweight handcrafted Quality Feature Extractor (Color, Texture/LBP, Shape, Defects).
    3. Feature Fusion MLP (LayerNorm + Bottleneck projection).
    4. CORAL Ordinal Classification Head (Grades A > B > C > D).
    """
    def __init__(
        self,
        backbone_name: str = "dinov2_vitb14",
        freeze_backbone: bool = True,
        num_classes: int = 4,
        dropout: float = 0.2
    ):
        super().__init__()
        self.num_classes = num_classes
        
        # 1. DINO Backbone
        self.backbone = DINOBackbone(model_name=backbone_name, freeze=freeze_backbone)
        
        # 2. Handcrafted Quality Feature Extractor
        self.handcrafted_extractor = QualityFeatureExtractor(feature_dim=32)
        
        # 3. Fusion Bottleneck MLP
        self.fusion = FeatureFusionModule(
            backbone_dim=self.backbone.embed_dim,
            handcrafted_dim=32,
            hidden_dim=256,
            output_dim=128,
            dropout=dropout
        )
        
        # 4. CORAL Ordinal Classification Head
        self.head = CORALOrdinalHead(in_features=128, num_classes=num_classes)
        self.loss_fn = CORALLoss(num_classes=num_classes)

    def forward(self, images: torch.Tensor) -> torch.Tensor:
        """
        Forward pass returning raw CORAL logits [B, K-1].
        """
        # 1. Visual Feature Extraction
        visual_feats = self.backbone(images)  # [B, embed_dim]
        
        # 2. Handcrafted Feature Extraction
        quality_feats = self.handcrafted_extractor(images)  # [B, 32]
        
        # 3. Fusion
        fused_feats = self.fusion(visual_feats, quality_feats)  # [B, 128]
        
        # 4. Ordinal Head
        logits = self.head(fused_feats)  # [B, num_classes - 1]
        return logits

    def predict(self, images: torch.Tensor) -> Dict[str, torch.Tensor]:
        """
        Full inference forward pass returning predicted rank, quality score (0-100), and class probabilities.
        """
        logits = self.forward(images)
        ranks, scores, probs = self.head.predict_rank_and_score(logits)
        return {
            "logits": logits,
            "ranks": ranks,
            "scores": scores,
            "probabilities": probs
        }
