import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.path.insert(0, os.path.abspath("."))
import json
import yaml
import numpy as np
import torch
from torch.utils.data import DataLoader

from crop_quality_ai.models.crop_grading_model import CropQualityGradingModel
from crop_quality_ai.training.train import CropDataset, get_transforms
from crop_quality_ai.evaluation.metrics import compute_all_metrics, print_metrics_summary
from crop_quality_ai.evaluation.confusion_matrix import plot_and_save_confusion_matrix

def evaluate_test_set():
    """
    Phase 3: Final Test Set Evaluation.
    Evaluates the best trained model exactly ONCE on the completely untouched test set.
    """
    config_path = "crop_quality_ai/configs/config.yaml"
    with open(config_path, "r") as f:
        config = yaml.safe_load(f)

    manifest_path = os.path.join(config["data"]["split_dir"], "dataset_manifest.json")
    if not os.path.exists(manifest_path):
        raise FileNotFoundError(f"Dataset manifest not found at '{manifest_path}'. Run prepare_dataset.py first.")

    with open(manifest_path, "r") as f:
        manifest = json.load(f)

    test_recs = manifest["test"]
    print(f"[INFO] Loaded untouched Test Set with {len(test_recs)} images.")

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[INFO] Evaluation Device: {device}")

    image_size = config["data"]["image_size"]
    _, test_transform = get_transforms(image_size)

    test_dataset = CropDataset(test_recs, transform=test_transform)
    test_loader = DataLoader(
        test_dataset, batch_size=config["training"]["batch_size"],
        shuffle=False, num_workers=config["training"]["num_workers"]
    )

    best_model_path = os.path.join(config["data"]["checkpoints_dir"], "best_model.pth")
    if not os.path.exists(best_model_path):
        best_model_path = os.path.join(config["data"]["checkpoints_dir"], "last_model.pth")
        if not os.path.exists(best_model_path):
            raise FileNotFoundError("No trained checkpoint found in checkpoints directory.")

    model = CropQualityGradingModel(
        backbone_name=config["model"]["backbone_name"],
        freeze_backbone=True,
        num_classes=config["model"]["num_classes"],
        dropout=config["model"]["dropout"]
    ).to(device)

    model.load_state_dict(torch.load(best_model_path, map_location=device))
    model.eval()
    print(f"[OK] Successfully loaded weights from '{best_model_path}'.")

    all_preds = []
    all_targets = []
    all_scores = []
    all_probs = []

    with torch.no_grad():
        for images, labels in test_loader:
            images = images.to(device)
            out = model.predict(images)

            ranks = out["ranks"].cpu().numpy()
            scores = out["scores"].cpu().numpy()
            probs = out["probabilities"].cpu().numpy()

            all_preds.extend(ranks)
            all_targets.extend(labels.numpy())
            all_scores.extend(scores)
            all_probs.extend(probs)

    all_preds = np.array(all_preds)
    all_targets = np.array(all_targets)

    # Compute metrics
    metrics = compute_all_metrics(all_targets, all_preds)
    print_metrics_summary(metrics, title="FINAL UNTOUCHED TEST SET EVALUATION")

    # Save metrics JSON
    results_dir = config["data"]["results_dir"]
    os.makedirs(results_dir, exist_ok=True)
    metrics_path = os.path.join(results_dir, "test_metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)
    print(f"[OK] Saved test set metrics to '{metrics_path}'.")

    # Save Confusion Matrix
    cm_path = os.path.join(results_dir, "confusion_matrix.png")
    plot_and_save_confusion_matrix(all_targets, all_preds, class_names=["Grade A", "Grade B", "Grade C", "Grade D"], output_path=cm_path)

    return metrics

if __name__ == "__main__":
    evaluate_test_set()
