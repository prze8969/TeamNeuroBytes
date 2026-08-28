import torch
import torch.nn as nn

class FeatureFusionModule(nn.Module):
    """
    Lightweight Feature Fusion MLP combining DINO visual embeddings (e.g., 768-dim)
    and handcrafted quality features (32-dim).
    Uses LayerNorm, GELU activation, and Dropout for regularization.
    """
    def __init__(
        self,
        backbone_dim: int = 768,
        handcrafted_dim: int = 32,
        hidden_dim: int = 256,
        output_dim: int = 128,
        dropout: float = 0.2
    ):
        super().__init__()
        in_dim = backbone_dim + handcrafted_dim
        
        self.fusion = nn.Sequential(
            nn.LayerNorm(in_dim),
            nn.Linear(in_dim, hidden_dim),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.LayerNorm(hidden_dim),
            nn.Linear(hidden_dim, output_dim),
            nn.GELU(),
            nn.Dropout(dropout)
        )

    def forward(self, backbone_feats: torch.Tensor, handcrafted_feats: torch.Tensor) -> torch.Tensor:
        """
        backbone_feats: [B, backbone_dim]
        handcrafted_feats: [B, handcrafted_dim]
        Output: Bottleneck embedding [B, output_dim]
        """
        combined = torch.cat([backbone_feats, handcrafted_feats], dim=-1)
        return self.fusion(combined)
