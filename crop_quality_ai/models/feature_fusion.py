import torch
import torch.nn as nn

class FeatureFusionNetwork(nn.Module):
    """
    Fuses deep pretrained DINO visual embeddings with explicit handcrafted quality features.
    Uses bottleneck projections, LayerNorm, GELU activations, and dropout for regularized fusion.
    """
    def __init__(self, embed_dim: int = 384, quality_dim: int = 24, fusion_dim: int = 256, dropout: float = 0.2):
        super().__init__()
        self.dino_proj = nn.Sequential(
            nn.Linear(embed_dim, 192),
            nn.LayerNorm(192),
            nn.GELU(),
            nn.Dropout(dropout)
        )

        self.quality_proj = nn.Sequential(
            nn.Linear(quality_dim, 64),
            nn.LayerNorm(64),
            nn.GELU(),
            nn.Dropout(dropout)
        )

        self.fusion_head = nn.Sequential(
            nn.Linear(192 + 64, fusion_dim),
            nn.LayerNorm(fusion_dim),
            nn.GELU(),
            nn.Dropout(dropout)
        )

    def forward(self, dino_embed: torch.Tensor, quality_feat: torch.Tensor) -> torch.Tensor:
        proj_dino = self.dino_proj(dino_embed)
        proj_quality = self.quality_proj(quality_feat)
        concatenated = torch.cat([proj_dino, proj_quality], dim=1)
        fused = self.fusion_head(concatenated)
        return fused
