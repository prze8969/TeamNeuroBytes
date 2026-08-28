import torch
import torch.nn as nn
from typing import Dict, Any, Tuple
from .dinov3_backbone import DINOv3Backbone
from .feature_fusion import FeatureFusionNetwork
from .ordinal_head import CORALOrdinalHead, coral_logits_to_probs, compute_quality_score

class CropGradingModel(nn.Module):
    """
    End-to-End Deep Crop Quality Grading Model.
    Architecture:
    Input Image -> Pretrained DINO Visual Backbone -> Visual Embedding (384/768)
                +
    Handcrafted Quality Features Vector (24) -> Feature Fusion Network -> Fused Vector (256)
                -> CORAL Ordinal Head -> Grade Probabilities + 0-100 Quality Score
    """
    def __init__(
        self,
        variant: str = "dinov2_vits14",
        freeze_backbone: bool = True,
        quality_dim: int = 24,
        fusion_dim: int = 256,
        num_classes: int = 4
    ):
        super().__init__()
        self.num_classes = num_classes
        self.backbone = DINOv3Backbone(variant=variant, freeze=freeze_backbone)
        self.fusion = FeatureFusionNetwork(
            embed_dim=self.backbone.embed_dim,
            quality_dim=quality_dim,
            fusion_dim=fusion_dim
        )
        self.ordinal_head = CORALOrdinalHead(in_features=fusion_dim, num_classes=num_classes)

    def forward(self, images: torch.Tensor, quality_features: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        """
        Returns:
          logits: CORAL ordinal binary logits (batch_size, num_classes - 1)
          probs: Class probabilities over K grades (batch_size, num_classes)
          quality_scores: Numerical quality score 0-100 (batch_size,)
        """
        dino_embed = self.backbone(images)
        fused = self.fusion(dino_embed, quality_features)
        logits = self.ordinal_head(fused)
        probs = coral_logits_to_probs(logits)
        quality_scores = compute_quality_score(probs)
        return logits, probs, quality_scores
