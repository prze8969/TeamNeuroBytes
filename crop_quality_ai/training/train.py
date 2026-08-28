import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.path.insert(0, os.path.abspath("."))
import json
import time
import yaml
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image
from typing import Dict, List, Tuple, Any

from crop_quality_ai.models.crop_grading_model import CropQualityGradingModel
from crop_quality_ai.evaluation.metrics import compute_all_metrics, print_metrics_summary
from crop_quality_ai.evaluation.plots import save_training_plots

class CropDataset(Dataset):
    """
    Dataset class loading records from manifest json.
    """
    def __init__(self, records: List[Dict[str, Any]], transform=None):
        self.records = records
        self.transform = transform

    def __len__(self):
        return len(self.records)

    def __getitem__(self, idx):
        rec = self.records[idx]
        img_path = rec["path"]
        label = rec["label"]

        try:
            image = Image.open(img_path).convert("RGB")
        except Exception:
            image = Image.new("RGB", (392, 392), color=(128, 128, 128))

        if self.transform:
            image = self.transform(image)

        return image, label

def get_transforms(image_size: int = 392):
    """
    Returns train and val/test torchvision transforms.
    Agricultural augmentations for training; clean resize for val/test.
    """
    train_transform = transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomVerticalFlip(p=0.3),
        transforms.RandomRotation(degrees=15),
        transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.3),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    val_transform = transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    return train_transform, val_transform

def train_one_epoch(
    model: nn.Module,
    dataloader: DataLoader,
    optimizer: torch.optim.Optimizer,
    scaler: torch.amp.GradScaler,
    device: torch.device,
    use_amp: bool = True
) -> Tuple[float, float]:
    """
    Trains model for one epoch with AMP mixed precision.
    Returns (average_loss, accuracy).
    """
    model.train()
    total_loss = 0.0
    correct = 0
    total = 0

    for images, labels in dataloader:
        images = images.to(device, non_blocking=True)
        labels = labels.to(device, dtype=torch.long, non_blocking=True)

        optimizer.zero_grad()

        if use_amp and device.type == 'cuda':
            with torch.amp.autocast('cuda'):
                logits = model(images)
                loss = model.loss_fn(logits, labels)
            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()
        else:
            logits = model(images)
            loss = model.loss_fn(logits, labels)
            loss.backward()
            optimizer.step()

        total_loss += loss.item() * len(labels)
        
        with torch.no_grad():
            ranks, _, _ = model.head.predict_rank_and_score(logits)
            correct += (ranks == labels).sum().item()
            total += len(labels)

    avg_loss = total_loss / max(total, 1)
    acc = correct / max(total, 1)
    return avg_loss, acc

@torch.no_grad()
def evaluate_epoch(
    model: nn.Module,
    dataloader: DataLoader,
    device: torch.device,
    use_amp: bool = True
) -> Tuple[float, Dict[str, float]]:
    """
    Evaluates model on validation dataloader.
    Returns (validation_loss, metrics_dict).
    """
    model.eval()
    total_loss = 0.0
    all_preds = []
    all_targets = []

    for images, labels in dataloader:
        images = images.to(device, non_blocking=True)
        labels = labels.to(device, dtype=torch.long, non_blocking=True)

        if use_amp and device.type == 'cuda':
            with torch.amp.autocast('cuda'):
                logits = model(images)
                loss = model.loss_fn(logits, labels)
        else:
            logits = model(images)
            loss = model.loss_fn(logits, labels)

        total_loss += loss.item() * len(labels)

        ranks, _, _ = model.head.predict_rank_and_score(logits)
        all_preds.extend(ranks.cpu().numpy())
        all_targets.extend(labels.cpu().numpy())

    avg_loss = total_loss / max(len(all_targets), 1)
    metrics = compute_all_metrics(np.array(all_targets), np.array(all_preds))
    return avg_loss, metrics

def train_pipeline():
    """
    High-Accuracy 50-Epoch Training Pipeline (384x384 Resolution):
    - Unfreezes top 4 transformer blocks from start
    - Warmup + Cosine Annealing Learning Rate Scheduler
    - Automatic Mixed Precision (AMP)
    - Dynamic batch size reduction on CUDA OOM
    """
    config_path = "crop_quality_ai/configs/config.yaml"
    with open(config_path, "r") as f:
        config = yaml.safe_load(f)

    manifest_path = os.path.join(config["data"]["split_dir"], "dataset_manifest.json")
    if not os.path.exists(manifest_path):
        from crop_quality_ai.training.prepare_dataset import inspect_and_split_dataset
        inspect_and_split_dataset()

    with open(manifest_path, "r") as f:
        manifest = json.load(f)

    train_recs = manifest["train"]
    val_recs = manifest["val"]

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[INFO] Training device: {device}", flush=True)
    if device.type == 'cuda':
        print(f"[INFO] GPU Name: {torch.cuda.get_device_name(0)} (12GB VRAM mode)", flush=True)

    image_size = config["data"]["image_size"]  # 384
    train_transform, val_transform = get_transforms(image_size)

    train_dataset = CropDataset(train_recs, transform=train_transform)
    val_dataset = CropDataset(val_recs, transform=val_transform)

    batch_size = config["training"]["batch_size"]  # 8
    num_workers = config["training"]["num_workers"]
    pin_memory = config["training"]["pin_memory"] and (device.type == 'cuda')
    use_amp = config["training"]["use_amp"]

    def create_loaders(bs: int):
        train_loader = DataLoader(
            train_dataset, batch_size=bs, shuffle=True,
            num_workers=num_workers, pin_memory=pin_memory, drop_last=True
        )
        val_loader = DataLoader(
            val_dataset, batch_size=bs, shuffle=False,
            num_workers=num_workers, pin_memory=pin_memory
        )
        return train_loader, val_loader

    train_loader, val_loader = create_loaders(batch_size)

    checkpoints_dir = config["data"]["checkpoints_dir"]
    results_dir = config["data"]["results_dir"]
    os.makedirs(checkpoints_dir, exist_ok=True)
    os.makedirs(results_dir, exist_ok=True)

    best_model_path = os.path.join(checkpoints_dir, "best_model.pth")
    last_model_path = os.path.join(checkpoints_dir, "last_model.pth")

    # Instantiate Model with 4 unfrozen transformer blocks
    backbone_name = config["model"]["backbone_name"]
    model = CropQualityGradingModel(
        backbone_name=backbone_name,
        freeze_backbone=False,
        num_classes=config["model"]["num_classes"],
        dropout=config["model"]["dropout"]
    ).to(device)

    # Unfreeze top 4 transformer blocks as requested
    unfreeze_n = config["model"].get("unfreeze_last_n_blocks", 4)
    model.backbone.unfreeze_top_blocks(num_blocks=unfreeze_n)

    scaler = torch.amp.GradScaler('cuda', enabled=use_amp and (device.type == 'cuda'))

    history = {
        "train_loss": [], "val_loss": [],
        "train_acc": [], "val_acc": [],
        "val_qwk": [], "val_macro_f1": []
    }

    # Setup differential optimizer
    backbone_params = [p for p in model.backbone.parameters() if p.requires_grad]
    head_params = [p for p in list(model.fusion.parameters()) + list(model.head.parameters()) if p.requires_grad]

    head_lr = config["training"]["learning_rate"]        # 0.0001
    backbone_lr = config["training"]["backbone_lr"]      # 0.00001
    weight_decay = config["training"]["weight_decay"]    # 0.0001
    max_epochs = config["training"]["epochs"]            # 50
    warmup_epochs = config["training"].get("warmup_epochs", 5)

    optimizer = torch.optim.AdamW([
        {"params": backbone_params, "lr": backbone_lr},
        {"params": head_params, "lr": head_lr}
    ], weight_decay=weight_decay)

    # Cosine scheduler with linear warmup
    def lr_lambda(current_epoch):
        if current_epoch < warmup_epochs:
            return float(current_epoch + 1) / float(max(1, warmup_epochs))
        progress = float(current_epoch - warmup_epochs) / float(max(1, max_epochs - warmup_epochs))
        return max(0.05, 0.5 * (1.0 + np.cos(np.pi * progress)))

    scheduler = torch.optim.lr_scheduler.LambdaLR(optimizer, lr_lambda=lr_lambda)

    best_val_score = -1.0
    patience = config["training"]["patience"]  # 15
    patience_counter = 0

    print("\n" + "=" * 60, flush=True)
    print(f"HIGH-ACCURACY TRAINING PIPELINE (384x384, {max_epochs} Epochs, {unfreeze_n} Unfrozen Blocks)", flush=True)
    print("=" * 60, flush=True)

    start_time = time.time()

    for epoch in range(1, max_epochs + 1):
        try:
            t_loss, t_acc = train_one_epoch(model, train_loader, optimizer, scaler, device, use_amp)
            v_loss, v_metrics = evaluate_epoch(model, val_loader, device, use_amp)
            scheduler.step()
        except torch.cuda.OutOfMemoryError:
            print(f"[WARN] CUDA Out-Of-Memory error caught! Halving batch size from {batch_size} to {max(batch_size // 2, 2)}...", flush=True)
            torch.cuda.empty_cache()
            batch_size = max(batch_size // 2, 2)
            train_loader, val_loader = create_loaders(batch_size)
            continue

        val_score = (v_metrics["qwk"] + v_metrics["macro_f1"]) / 2.0

        history["train_loss"].append(t_loss)
        history["val_loss"].append(v_loss)
        history["train_acc"].append(t_acc)
        history["val_acc"].append(v_metrics["accuracy"])
        history["val_qwk"].append(v_metrics["qwk"])
        history["val_macro_f1"].append(v_metrics["macro_f1"])

        print(
            f"Epoch {epoch:02d}/{max_epochs:02d} | "
            f"Train Loss: {t_loss:.4f} Acc: {t_acc*100:.2f}% | "
            f"Val Loss: {v_loss:.4f} Acc: {v_metrics['accuracy']*100:.2f}% | "
            f"QWK: {v_metrics['qwk']:.4f} Macro F1: {v_metrics['macro_f1']:.4f}",
            flush=True
        )

        torch.save(model.state_dict(), last_model_path)

        if val_score > best_val_score:
            best_val_score = val_score
            patience_counter = 0
            torch.save(model.state_dict(), best_model_path)
            print(f"  --> Saved new best model to '{best_model_path}' (Val Score: {val_score:.4f})", flush=True)
        else:
            patience_counter += 1
            if patience_counter >= patience:
                print(f"[INFO] Early stopping triggered at epoch {epoch}.", flush=True)
                break

    duration = time.time() - start_time
    print(f"\n[OK] Training completed in {duration:.2f} seconds.", flush=True)

    # Save training curves
    save_training_plots(history, output_dir=results_dir)
    print("[SUCCESS] High-accuracy training pipeline completed.", flush=True)

if __name__ == "__main__":
    train_pipeline()
