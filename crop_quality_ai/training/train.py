import os
import sys
import time
import json
import csv
import yaml
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torch.cuda.amp import autocast, GradScaler
import numpy as np

# Ensure root package is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from models.crop_grading_model import CropGradingModel
from models.ordinal_head import CORALLoss
from training.extract_features import CropDataset
from training.prepare_dataset import inspect_and_split_dataset
from evaluation.metrics import compute_all_metrics
from evaluation.confusion_matrix import save_confusion_matrix_plot
from evaluation.plots import plot_training_curves
from explainability.visualize import generate_crop_saliency_map

def train_pipeline(config_path: str = "configs/config.yaml", max_hours: float = 3.5):
    start_time = time.time()

    # Load configuration
    with open(config_path, "r") as f:
        cfg = yaml.safe_load(f)

    device = torch.device(cfg["training"]["device"] if torch.cuda.is_available() else "cpu")
    print(f"[OK] Training Device selected: {device}")

    # Step 1: Prepare & Split Dataset
    manifest = inspect_and_split_dataset(
        data_dir=cfg["dataset"]["data_dir"],
        train_ratio=cfg["dataset"]["train_ratio"],
        val_ratio=cfg["dataset"]["val_ratio"],
        test_ratio=cfg["dataset"]["test_ratio"],
        seed=cfg["training"]["seed"]
    )

    train_dataset = CropDataset(manifest["train"], image_size=cfg["model"]["image_size"], is_train=True)
    val_dataset = CropDataset(manifest["val"], image_size=cfg["model"]["image_size"], is_train=False)

    batch_size = cfg["training"]["batch_size"]
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=0)

    # Class Weights for Imbalance Handling
    labels = [rec["label"] for rec in manifest["train"]]
    counts = np.bincount(labels, minlength=4)
    weights = 1.0 / (counts + 1e-5)
    weights = weights / weights.sum()
    class_weights = torch.tensor(weights, dtype=torch.float32, device=device)

    # Instantiate Model
    model = CropGradingModel(
        variant="dinov2_vits14",
        freeze_backbone=cfg["model"]["freeze_backbone"],
        quality_dim=cfg["model"]["quality_feature_dim"],
        fusion_dim=cfg["model"]["fusion_dim"],
        num_classes=cfg["model"]["num_classes"]
    ).to(device)

    criterion = CORALLoss(num_classes=4, class_weights=class_weights)
    optimizer = torch.optim.AdamW(
        filter(lambda p: p.requires_grad, model.parameters()),
        lr=cfg["training"]["learning_rate"],
        weight_decay=cfg["training"]["weight_decay"]
    )
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(
        optimizer,
        T_max=cfg["training"]["epochs"],
        eta_min=float(cfg["scheduler"]["min_lr"])
    )

    use_amp = cfg.get("mixed_precision", True) and device.type == "cuda"
    scaler = GradScaler(enabled=use_amp)

    os.makedirs("checkpoints", exist_ok=True)
    os.makedirs("results", exist_ok=True)

    best_val_qwk = -1.0
    patience_counter = 0
    patience = cfg["training"]["patience"]

    history = {
        "train_loss": [], "val_loss": [],
        "train_acc": [], "val_acc": [],
        "val_qwk": [], "val_mae": []
    }

    print("\n" + "=" * 60)
    print("STARTING PHASE 1: FAST BASELINE TRAINING (Frozen DINOv3 + CORAL)")
    print("=" * 60)

    for epoch in range(1, cfg["training"]["epochs"] + 1):
        # Time budget check
        elapsed_hours = (time.time() - start_time) / 3600.0
        if elapsed_hours >= max_hours:
            print(f"[WARN] Reached maximum training time limit of {max_hours} hours. Stopping early.")
            break

        # Train loop
        model.train()
        running_loss = 0.0
        train_preds, train_targets = [], []

        for images, quality_feats, targets in train_loader:
            images = images.to(device)
            quality_feats = quality_feats.to(device)
            targets = targets.to(device)

            optimizer.zero_grad()

            with autocast(enabled=use_amp):
                logits, probs, scores = model(images, quality_feats)
                loss = criterion(logits, targets)

            if use_amp:
                scaler.scale(loss).backward()
                scaler.step(optimizer)
                scaler.update()
            else:
                loss.backward()
                optimizer.step()

            running_loss += loss.item() * images.size(0)
            preds = torch.argmax(probs, dim=-1)
            train_preds.extend(preds.cpu().numpy())
            train_targets.extend(targets.cpu().numpy())

        scheduler.step()
        train_loss = running_loss / len(train_dataset)
        train_acc = float(np.mean(np.array(train_preds) == np.array(train_targets)))

        # Validation loop
        model.eval()
        val_running_loss = 0.0
        val_preds, val_targets = [], []

        with torch.no_grad():
            for images, quality_feats, targets in val_loader:
                images = images.to(device)
                quality_feats = quality_feats.to(device)
                targets = targets.to(device)

                with autocast(enabled=use_amp):
                    logits, probs, scores = model(images, quality_feats)
                    loss = criterion(logits, targets)

                val_running_loss += loss.item() * images.size(0)
                preds = torch.argmax(probs, dim=-1)
                val_preds.extend(preds.cpu().numpy())
                val_targets.extend(targets.cpu().numpy())

        val_loss = val_running_loss / len(val_dataset)
        val_metrics = compute_all_metrics(val_targets, val_preds)

        history["train_loss"].append(train_loss)
        history["val_loss"].append(val_loss)
        history["train_acc"].append(train_acc)
        history["val_acc"].append(val_metrics["accuracy"])
        history["val_qwk"].append(val_metrics["qwk"])
        history["val_mae"].append(val_metrics["mae"])

        print(f"Epoch [{epoch:02d}/{cfg['training']['epochs']:02d}] "
              f"Train Loss: {train_loss:.4f} Acc: {train_acc:.4f} | "
              f"Val Loss: {val_loss:.4f} Acc: {val_metrics['accuracy']:.4f} "
              f"MacroF1: {val_metrics['macro_f1']:.4f} QWK: {val_metrics['qwk']:.4f} MAE: {val_metrics['mae']:.4f}")

        # Checkpoint saving based on validation QWK/Macro F1
        if val_metrics["qwk"] > best_val_qwk:
            best_val_qwk = val_metrics["qwk"]
            patience_counter = 0
            torch.save({
                "model_state_dict": model.state_dict(),
                "config": cfg,
                "epoch": epoch,
                "val_metrics": val_metrics
            }, "checkpoints/best_model.pth")
            print(f"  --> Saved new best checkpoint (Val QWK: {best_val_qwk:.4f})")
        else:
            patience_counter += 1
            if patience_counter >= patience:
                print(f" Early stopping triggered after {patience} epochs without validation QWK improvement.")
                break

    # Save last model checkpoint
    torch.save({
        "model_state_dict": model.state_dict(),
        "config": cfg,
        "epoch": epoch,
        "val_metrics": val_metrics
    }, "checkpoints/last_model.pth")

    plot_training_curves(history, output_dir="results")

    # Generate sample explainability heatmap on validation sample
    try:
        sample_img, sample_q, sample_lbl = val_dataset[0]
        generate_crop_saliency_map(
            model,
            sample_img.unsqueeze(0).to(device),
            sample_q.unsqueeze(0).to(device),
            output_path="results/explainability_attention.png"
        )
    except Exception as e:
        print(f"Notice: Saliency generation skipped ({e})")

    # Record experiment log
    total_time = round(time.time() - start_time, 2)
    exp_file = "results/experiments.csv"
    file_exists = os.path.exists(exp_file)
    with open(exp_file, "a", newline="") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(["experiment_id", "model", "image_size", "batch_size", "learning_rate", "epochs", "accuracy", "macro_f1", "weighted_f1", "qwk", "mae", "training_time_sec"])
        writer.writerow(["exp_dinov3_coral", "DINOv3+QualityFeat+CORAL", cfg["model"]["image_size"], batch_size, cfg["training"]["learning_rate"], epoch, val_metrics["accuracy"], val_metrics["macro_f1"], val_metrics["weighted_f1"], val_metrics["qwk"], val_metrics["mae"], total_time])

    print(f"\n Phase 1 Training completed in {total_time}s. Best Val QWK: {best_val_qwk:.4f}")
    return manifest

if __name__ == "__main__":
    train_pipeline()
