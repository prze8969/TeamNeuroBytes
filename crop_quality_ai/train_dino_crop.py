import os
import sys
import json
import math
import time
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.transforms as transforms
import torchvision.transforms.functional as TF
from torch.utils.data import Dataset, DataLoader
from torch.optim.lr_scheduler import LambdaLR
from PIL import Image
from sklearn.metrics import cohen_kappa_score, accuracy_score
from typing import Tuple, Optional, Dict, List

# Add crop_quality_ai directory to path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from models.quality_features import QualityFeatureExtractor
from models.dinov3_backbone import DINOBackbone

# ==========================================
# 1. MODEL COMPONENTS (Fusion + CORAL Head)
# ==========================================
class FeatureFusionNetwork(nn.Module):
    """
    MLP with LayerNorm and Dropout to fuse DINOv2 embeddings (768-dim) 
    with handcrafted domain features (32-dim).
    """
    def __init__(self, dino_dim: int = 768, n_handcrafted: int = 32, fusion_dim: int = 256, dropout: float = 0.4):
        super().__init__()
        self.n_handcrafted = n_handcrafted
        in_dim = dino_dim + n_handcrafted
        self.fusion_mlp = nn.Sequential(
            nn.Linear(in_dim, fusion_dim),
            nn.LayerNorm(fusion_dim),
            nn.GELU(),
            nn.Dropout(p=dropout),
            nn.Linear(fusion_dim, fusion_dim),
            nn.LayerNorm(fusion_dim),
            nn.GELU(),
            nn.Dropout(p=dropout)
        )

    def forward(self, dino_cls: torch.Tensor, handcrafted: Optional[torch.Tensor] = None) -> torch.Tensor:
        if handcrafted is not None and self.n_handcrafted > 0:
            x = torch.cat([dino_cls, handcrafted], dim=-1)
        else:
            x = dino_cls
        return self.fusion_mlp(x)


class CORALOrdinalHead(nn.Module):
    """
    CORAL (Consistent Rank Logits) Ordinal Head for monotonic grade predictions.
    Outputs K-1 binary logits for K classes (Grade A=0, B=1, C=2, D=3).
    """
    def __init__(self, in_features: int = 256, num_classes: int = 4):
        super().__init__()
        self.num_classes = num_classes
        self.num_tasks = num_classes - 1
        self.weight = nn.Linear(in_features, 1, bias=False)
        self.bias = nn.Parameter(torch.zeros(self.num_tasks))
        with torch.no_grad():
            self.bias.copy_(torch.linspace(1.0, -1.0, self.num_tasks))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        projected = self.weight(x)
        return projected + self.bias

    def logits_to_probabilities(self, logits: torch.Tensor) -> torch.Tensor:
        sigmoids = torch.sigmoid(logits)
        batch_size = logits.size(0)
        probs = torch.zeros(batch_size, self.num_classes, device=logits.device)
        probs[:, 0] = 1.0 - sigmoids[:, 0]
        for k in range(1, self.num_tasks):
            probs[:, k] = sigmoids[:, k - 1] - sigmoids[:, k]
        probs[:, -1] = sigmoids[:, -1]
        probs = torch.clamp(probs, min=1e-7, max=1.0)
        return probs / probs.sum(dim=-1, keepdim=True)

    def predict_rank_and_score(self, logits: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        sigmoids = torch.sigmoid(logits)
        predicted_ranks = (sigmoids > 0.5).sum(dim=-1)
        class_probs = self.logits_to_probabilities(logits)
        class_indices = torch.arange(self.num_classes, device=logits.device, dtype=torch.float32)
        quality_scores = (class_probs * class_indices).sum(dim=-1)
        return predicted_ranks, quality_scores, class_probs


class CORALOrdinalLoss(nn.Module):
    """
    Binary Cross Entropy Loss across ordinal binary task cuts.
    """
    def __init__(self, num_classes: int = 4):
        super().__init__()
        self.num_classes = num_classes
        self.num_tasks = num_classes - 1

    def forward(self, logits: torch.Tensor, targets: torch.Tensor) -> torch.Tensor:
        task_indices = torch.arange(self.num_tasks, device=targets.device).unsqueeze(0)
        binary_targets = (targets.unsqueeze(1) > task_indices).float()
        loss = F.binary_cross_entropy_with_logits(logits, binary_targets, reduction='none')
        return loss.sum(dim=-1).mean()


class CropQualityGradingModel(nn.Module):
    """
    Full High-Accuracy Ordinal Crop Quality Classifier.
    DINOv2 ViT-B/14 Backbone + Feature Fusion + CORAL Head.
    """
    def __init__(
        self, 
        dino_backbone: nn.Module, 
        n_handcrafted: int = 32, 
        fusion_dim: int = 256, 
        num_classes: int = 4, 
        dropout: float = 0.4
    ):
        super().__init__()
        self.backbone = dino_backbone
        self.fusion = FeatureFusionNetwork(dino_dim=768, n_handcrafted=n_handcrafted, fusion_dim=fusion_dim, dropout=dropout)
        self.head = CORALOrdinalHead(in_features=fusion_dim, num_classes=num_classes)
        self.loss_fn = CORALOrdinalLoss(num_classes=num_classes)

    def forward(self, images: torch.Tensor, handcrafted: Optional[torch.Tensor] = None) -> torch.Tensor:
        feats = self.backbone(images)
        if isinstance(feats, dict):
            dino_cls = feats["x_norm_clstoken"]
        elif hasattr(feats, "x_norm_clstoken"):
            dino_cls = feats.x_norm_clstoken
        else:
            dino_cls = feats[:, 0] if feats.ndim == 3 else feats
        bottleneck = self.fusion(dino_cls, handcrafted)
        return self.head(bottleneck)


# ==========================================
# 2. DATASET CLASS
# ==========================================
class CropQualityDataset(Dataset):
    """
    Dataset class loading images & records from dataset_manifest.json.
    Computes/caches 32-dim quality features for each sample.
    """
    def __init__(self, records: List[Dict], transform=None):
        self.records = records
        self.transform = transform
        self.feature_extractor = QualityFeatureExtractor(feature_dim=32)

    def __len__(self):
        return len(self.records)

    def __getitem__(self, idx):
        rec = self.records[idx]
        img_path = rec["path"]
        label = rec["label"]

        try:
            pil_img = Image.open(img_path).convert("RGB")
            img_np = np.array(pil_img)
            handcrafted_feat = self.feature_extractor.extract_single_np(img_np)
        except Exception:
            pil_img = Image.new("RGB", (392, 392), color=(128, 128, 128))
            handcrafted_feat = np.zeros(32, dtype=np.float32)

        if self.transform:
            image_tensor = self.transform(pil_img)
        else:
            image_tensor = transforms.ToTensor()(pil_img)

        label_tensor = torch.tensor(label, dtype=torch.long)
        handcrafted_tensor = torch.tensor(handcrafted_feat, dtype=torch.float32)

        return image_tensor, label_tensor, handcrafted_tensor


# ==========================================
# 3. TRANSFORMS & OPTIMIZER SETUP
# ==========================================
def get_grade_preserving_transforms(image_size: int = 392):
    train_transform = transforms.Compose([
        transforms.RandomResizedCrop(
            (image_size, image_size), 
            scale=(0.85, 1.0), 
            ratio=(0.9, 1.1), 
            interpolation=transforms.InterpolationMode.BICUBIC
        ),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomVerticalFlip(p=0.3),
        transforms.RandomRotation(degrees=15, interpolation=transforms.InterpolationMode.BICUBIC),
        transforms.ColorJitter(brightness=0.15, contrast=0.15, saturation=0.10, hue=0.02),
        transforms.TrivialAugmentWide(interpolation=transforms.InterpolationMode.BICUBIC),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        transforms.RandomErasing(p=0.20, scale=(0.02, 0.08), value=0)
    ])

    val_transform = transforms.Compose([
        transforms.Resize((image_size, image_size), interpolation=transforms.InterpolationMode.BICUBIC),
        transforms.CenterCrop((image_size, image_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    return train_transform, val_transform


def setup_optimizer_and_scheduler(model: CropQualityGradingModel, stage: int, max_epochs: int = 40):
    if stage == 1:
        # Freeze backbone
        model.backbone.freeze_all()
        for param in model.fusion.parameters(): param.requires_grad = True
        for param in model.head.parameters(): param.requires_grad = True

        head_params = list(model.fusion.parameters()) + list(model.head.parameters())
        optimizer = torch.optim.AdamW(head_params, lr=3e-4, weight_decay=0.01)
        scheduler = LambdaLR(optimizer, lr_lambda=lambda epoch: 1.0)

    elif stage == 2:
        # Unfreeze top 4 transformer blocks
        model.backbone.unfreeze_top_blocks(num_blocks=4)

        backbone_params = [p for p in model.backbone.parameters() if p.requires_grad]
        head_params = [p for p in list(model.fusion.parameters()) + list(model.head.parameters()) if p.requires_grad]

        optimizer = torch.optim.AdamW([
            {"params": backbone_params, "lr": 1e-5},
            {"params": head_params, "lr": 1e-4}
        ], weight_decay=0.01)

        warmup_epochs = 5
        def lr_lambda(current_epoch: int) -> float:
            if current_epoch < warmup_epochs:
                return float(current_epoch + 1) / float(warmup_epochs)
            progress = float(current_epoch - warmup_epochs) / float(max(1, max_epochs - warmup_epochs))
            return 0.5 * (1.0 + math.cos(math.pi * progress))

        scheduler = LambdaLR(optimizer, lr_lambda=lr_lambda)

    return optimizer, scheduler


# ==========================================
# 4. TRAINING & EVALUATION LOOPS
# ==========================================
def train_one_epoch(model, dataloader, optimizer, scaler, device, accumulation_steps=4, use_amp=True):
    model.train()
    total_loss, correct, total = 0.0, 0, 0
    optimizer.zero_grad(set_to_none=True)

    for step, (images, labels, handcrafted) in enumerate(dataloader):
        images = images.to(device, non_blocking=True)
        labels = labels.to(device, dtype=torch.long, non_blocking=True)
        handcrafted = handcrafted.to(device, dtype=torch.float32, non_blocking=True)

        with torch.amp.autocast('cuda', enabled=use_amp and device.type == 'cuda'):
            logits = model(images, handcrafted)
            loss = model.loss_fn(logits, labels) / accumulation_steps

        scaler.scale(loss).backward()

        if (step + 1) % accumulation_steps == 0 or (step + 1) == len(dataloader):
            scaler.unscale_(optimizer)
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            scaler.step(optimizer)
            scaler.update()
            optimizer.zero_grad(set_to_none=True)

        total_loss += loss.item() * accumulation_steps * len(labels)
        with torch.no_grad():
            ranks, _, _ = model.head.predict_rank_and_score(logits)
            correct += (ranks == labels).sum().item()
            total += len(labels)

    return total_loss / max(total, 1), correct / max(total, 1)


@torch.no_grad()
def evaluate(model, dataloader, device, use_amp=True):
    model.eval()
    total_loss, all_preds, all_targets = 0.0, [], []

    for images, labels, handcrafted in dataloader:
        images = images.to(device, non_blocking=True)
        labels = labels.to(device, dtype=torch.long, non_blocking=True)
        handcrafted = handcrafted.to(device, dtype=torch.float32, non_blocking=True)

        with torch.amp.autocast('cuda', enabled=use_amp and device.type == 'cuda'):
            logits = model(images, handcrafted)
            loss = model.loss_fn(logits, labels)

        total_loss += loss.item() * len(labels)
        ranks, _, _ = model.head.predict_rank_and_score(logits)
        all_preds.extend(ranks.cpu().numpy())
        all_targets.extend(labels.cpu().numpy())

    y_true, y_pred = np.array(all_targets), np.array(all_preds)
    acc = accuracy_score(y_true, y_pred)
    qwk = cohen_kappa_score(y_true, y_pred, weights='quadratic')

    return {
        "val_loss": total_loss / max(len(y_true), 1),
        "val_accuracy": float(acc),
        "val_qwk": float(qwk)
    }


# ==========================================
# 5. MAIN TRAINING PIPELINE
# ==========================================
def main():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[INIT] Training device: {device}", flush=True)
    if device.type == 'cuda':
        print(f"[INIT] GPU: {torch.cuda.get_device_name(0)} (12GB VRAM mode)", flush=True)

    BATCH_SIZE = 8
    ACCUMULATION_STEPS = 4
    IMAGE_SIZE = 392
    MAX_EPOCHS_STAGE1 = 10
    MAX_EPOCHS_STAGE2 = 40

    # Locate manifest file
    base_dir = os.path.dirname(os.path.abspath(__file__))
    manifest_path = os.path.join(base_dir, "dataset_split", "dataset_manifest.json")

    if not os.path.exists(manifest_path):
        print(f"[ERROR] Dataset manifest not found at: {manifest_path}")
        return

    with open(manifest_path, "r") as f:
        manifest = json.load(f)

    train_recs = manifest["train"]
    val_recs = manifest["val"]

    print(f"[DATA] Loaded {len(train_recs)} training images and {len(val_recs)} validation images.")

    train_transform, val_transform = get_grade_preserving_transforms(IMAGE_SIZE)

    train_dataset = CropQualityDataset(train_recs, transform=train_transform)
    val_dataset = CropQualityDataset(val_recs, transform=val_transform)

    train_loader = DataLoader(
        train_dataset, batch_size=BATCH_SIZE, shuffle=True,
        num_workers=4, pin_memory=(device.type == 'cuda'), drop_last=True
    )
    val_loader = DataLoader(
        val_dataset, batch_size=BATCH_SIZE, shuffle=False,
        num_workers=4, pin_memory=(device.type == 'cuda')
    )

    print("[MODEL] Loading Meta DINOv2 ViT-B/14 backbone...", flush=True)
    dino_backbone = DINOBackbone(model_name="dinov2_vitb14", freeze=True)

    model = CropQualityGradingModel(
        dino_backbone=dino_backbone,
        n_handcrafted=32,
        fusion_dim=256,
        num_classes=4,
        dropout=0.4
    ).to(device)

    scaler = torch.amp.GradScaler('cuda', enabled=(device.type == 'cuda'))

    checkpoints_dir = os.path.join(base_dir, "checkpoints")
    os.makedirs(checkpoints_dir, exist_ok=True)
    best_model_path = os.path.join(checkpoints_dir, "best_dino_model.pth")

    best_qwk = 0.0

    # ==========================================
    # STAGE 1: Train Head & Fusion Only
    # ==========================================
    print("\n" + "="*60, flush=True)
    print("[STAGE 1] Freezing DINOv2 Backbone (Epochs 1-10)", flush=True)
    print("="*60, flush=True)

    optimizer, scheduler = setup_optimizer_and_scheduler(model, stage=1, max_epochs=MAX_EPOCHS_STAGE1)

    for epoch in range(1, MAX_EPOCHS_STAGE1 + 1):
        t0 = time.time()
        train_loss, train_acc = train_one_epoch(model, train_loader, optimizer, scaler, device, ACCUMULATION_STEPS)
        val_metrics = evaluate(model, val_loader, device)
        elapsed = time.time() - t0

        print(
            f"[S1 Epoch {epoch:02d}/{MAX_EPOCHS_STAGE1:02d}] ({elapsed:.1f}s) "
            f"Train Loss: {train_loss:.4f} | Train Acc: {train_acc*100:.2f}% | "
            f"Val Loss: {val_metrics['val_loss']:.4f} | Val Acc: {val_metrics['val_accuracy']*100:.2f}% | "
            f"Val QWK: {val_metrics['val_qwk']:.4f}",
            flush=True
        )

        if val_metrics['val_qwk'] > best_qwk:
            best_qwk = val_metrics['val_qwk']
            torch.save(model.state_dict(), best_model_path)
            print(f"[SAVED] New Best Stage 1 Model (QWK: {best_qwk:.4f})", flush=True)

    # ==========================================
    # STAGE 2: Unfreeze Top 4 ViT Transformer Blocks
    # ==========================================
    print("\n" + "="*60, flush=True)
    print("[STAGE 2] Unfreezing Top 4 ViT Blocks (Epochs 11-50)", flush=True)
    print("="*60, flush=True)

    optimizer, scheduler = setup_optimizer_and_scheduler(model, stage=2, max_epochs=MAX_EPOCHS_STAGE2)

    for epoch in range(1, MAX_EPOCHS_STAGE2 + 1):
        t0 = time.time()
        train_loss, train_acc = train_one_epoch(model, train_loader, optimizer, scaler, device, ACCUMULATION_STEPS)
        val_metrics = evaluate(model, val_loader, device)
        scheduler.step()
        elapsed = time.time() - t0

        current_lr = optimizer.param_groups[0]['lr']
        print(
            f"[S2 Epoch {epoch:02d}/{MAX_EPOCHS_STAGE2:02d}] ({elapsed:.1f}s) LR: {current_lr:.2e} | "
            f"Train Loss: {train_loss:.4f} | Train Acc: {train_acc*100:.2f}% | "
            f"Val Loss: {val_metrics['val_loss']:.4f} | Val Acc: {val_metrics['val_accuracy']*100:.2f}% | "
            f"Val QWK: {val_metrics['val_qwk']:.4f}",
            flush=True
        )

        if val_metrics['val_qwk'] > best_qwk:
            best_qwk = val_metrics['val_qwk']
            torch.save(model.state_dict(), best_model_path)
            print(f"[SAVED] New Best Overall Model (QWK: {best_qwk:.4f})", flush=True)

    print(f"\n[COMPLETE] Training finished! Peak Validation QWK: {best_qwk:.4f}", flush=True)

if __name__ == "__main__":
    main()
