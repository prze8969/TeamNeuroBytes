import os
import sys
import json
import torch
import numpy as np
from torch.utils.data import DataLoader

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from models.crop_grading_model import CropGradingModel
from training.extract_features import CropDataset
from evaluation.metrics import compute_all_metrics
from evaluation.confusion_matrix import save_confusion_matrix_plot

def evaluate_test_set(checkpoint_path: str = "checkpoints/best_model.pth", manifest_path: str = "dataset_split/dataset_manifest.json"):
    """
    Evaluates the trained crop quality model EXACTLY ONCE on the untouched test split.
    Generates results/final_report.txt and results/confusion_matrix.png.
    """
    if not os.path.exists(checkpoint_path):
        raise FileNotFoundError(f"Checkpoint not found at '{checkpoint_path}'. Run training first.")

    checkpoint = torch.load(checkpoint_path, map_location="cpu")
    cfg = checkpoint["config"]

    with open(manifest_path, "r") as f:
        manifest = json.load(f)

    test_records = manifest["test"]
    test_dataset = CropDataset(test_records, image_size=cfg["model"]["image_size"], is_train=False)
    test_loader = DataLoader(test_dataset, batch_size=cfg["training"]["batch_size"], shuffle=False)

    device = torch.device(cfg["training"]["device"] if torch.cuda.is_available() else "cpu")
    model = CropGradingModel(
        variant="dinov2_vits14",
        freeze_backbone=cfg["model"]["freeze_backbone"],
        quality_dim=cfg["model"]["quality_feature_dim"],
        fusion_dim=cfg["model"]["fusion_dim"],
        num_classes=cfg["model"]["num_classes"]
    ).to(device)

    model.load_state_dict(checkpoint["model_state_dict"])
    model.eval()

    all_preds, all_targets = [], []
    with torch.no_grad():
        for images, quality_feats, targets in test_loader:
            images = images.to(device)
            quality_feats = quality_feats.to(device)
            logits, probs, scores = model(images, quality_feats)
            preds = torch.argmax(probs, dim=-1)
            all_preds.extend(preds.cpu().numpy())
            all_targets.extend(targets.cpu().numpy())

    metrics = compute_all_metrics(all_targets, all_preds)
    save_confusion_matrix_plot(metrics["confusion_matrix"], output_path="results/confusion_matrix.png")

    report_content = f"""========================================
CROP QUALITY AI - FINAL EVALUATION REPORT
========================================

Dataset Summary:
Total Images: {manifest['summary']['total_images']}
Training Images: {manifest['summary']['train_images']}
Validation Images: {manifest['summary']['val_images']}
Testing Images: {manifest['summary']['test_images']}

Classes Evaluated: Grade A, Grade B, Grade C, Grade D

Best Model Checkpoint: {checkpoint_path} (Trained Epoch {checkpoint.get('epoch', 'N/A')})

Held-Out Test Set Performance Metrics:
----------------------------------------
Accuracy:          {metrics['accuracy'] * 100:.2f}%
Macro F1:          {metrics['macro_f1']:.4f}
Weighted F1:       {metrics['weighted_f1']:.4f}
Precision (Macro): {metrics['precision']:.4f}
Recall (Macro):    {metrics['recall']:.4f}

Ordinal Metrics:
Quadratic Weighted Kappa (QWK): {metrics['qwk']:.4f}
Mean Absolute Error (MAE):       {metrics['mae']:.4f} grade ranks

Confusion Matrix (Actual rows x Predicted columns):
{np.array(metrics['confusion_matrix'])}

========================================
Report generated successfully on untouched test set.
"""

    os.makedirs("results", exist_ok=True)
    report_path = "results/final_report.txt"
    with open(report_path, "w") as f:
        f.write(report_content)

    print("\n" + report_content)
    print(f"[OK] Saved final test evaluation report to: {report_path}")
    return metrics

if __name__ == "__main__":
    evaluate_test_set()
