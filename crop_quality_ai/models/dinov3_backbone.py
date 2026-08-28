import torch
import torch.nn as nn
import torchvision.models as models

class DINOBackbone(nn.Module):
    """
    Pretrained DINOv2 / DINOv3 visual feature extractor.
    Downloads dinov2_vitb14 (or fallback dinov2_vits14) from PyTorch Hub / Torchvision.
    Supports freezing all layers initially and selective unfreezing of top transformer blocks.
    """
    def __init__(self, model_name: str = "dinov2_vitb14", freeze: bool = True):
        super().__init__()
        self.model_name = model_name
        self.embed_dim = 768 # Default for ViT-B/14

        try:
            # Load pretrained DINOv2 from PyTorch Hub
            self.backbone = torch.hub.load("facebookresearch/dinov2", model_name, pretrained=True)
            if hasattr(self.backbone, "embed_dim"):
                self.embed_dim = self.backbone.embed_dim
            elif hasattr(self.backbone, "num_features"):
                self.embed_dim = self.backbone.num_features
            print(f"[OK] Successfully loaded PyTorch Hub backbone '{model_name}' (embed_dim={self.embed_dim}).")
        except Exception as e:
            print(f"[WARN] Could not load '{model_name}' via torch.hub ({e}). Falling back to torchvision ViT-B/16...")
            vit = models.vit_b_16(weights=models.ViT_B_16_Weights.DEFAULT)
            self.embed_dim = 768
            # Wrap ViT as backbone
            vit.heads = nn.Identity()
            self.backbone = vit

        if freeze:
            self.freeze_all()

    def freeze_all(self):
        """Freezes all backbone parameters."""
        for param in self.backbone.parameters():
            param.requires_grad = False

    def unfreeze_top_blocks(self, num_blocks: int = 2):
        """
        Unfreezes the last N transformer blocks for fine-tuning.
        """
        # First freeze all
        self.freeze_all()
        
        # Identify transformer blocks attribute
        blocks = None
        if hasattr(self.backbone, "blocks"):
            blocks = self.backbone.blocks
        elif hasattr(self.backbone, "encoder") and hasattr(self.backbone.encoder, "layers"):
            blocks = self.backbone.encoder.layers
            
        if blocks is not None and len(blocks) >= num_blocks:
            for block in blocks[-num_blocks:]:
                for param in block.parameters():
                    param.requires_grad = True
            print(f"[OK] Unfrozen the top {num_blocks} transformer blocks of backbone.")
        else:
            # Fallback: unfreeze last parameters
            params = list(self.backbone.parameters())
            for param in params[-20:]:
                param.requires_grad = True
            print(f"[OK] Unfrozen top parameters of backbone.")

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Input: [B, 3, H, W]
        Output: [B, embed_dim]
        """
        if hasattr(self.backbone, "forward_features"):
            feats = self.backbone.forward_features(x)
            if isinstance(feats, dict):
                return feats["x_norm_clstoken"]
            elif hasattr(feats, "x_norm_clstoken"):
                return feats.x_norm_clstoken
            else:
                return feats[:, 0]
        else:
            out = self.backbone(x)
            if isinstance(out, torch.Tensor):
                return out
            return out.logits
