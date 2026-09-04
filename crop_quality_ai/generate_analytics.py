import os
import sys
import json
import torch
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix
from typing import Tuple

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
from train_dino_crop import CropQualityGradingModel, DINOBackbone, CropQualityDataset, get_grade_preserving_transforms

def generate_visual_analytics():
    """
    Generates publication-grade ordinal confusion matrix & continuous score distribution plots.
    """
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    base_dir = os.path.dirname(os.path.abspath(__file__))
    analytics_dir = os.path.join(base_dir, "analytics")
    os.makedirs(analytics_dir, exist_ok=True)

    manifest_path = os.path.join(base_dir, "dataset_split", "dataset_manifest.json")
    checkpoint_path = os.path.join(base_dir, "checkpoints", "best_dino_model.pth")

    with open(manifest_path, "r") as f:
        manifest = json.load(f)

    test_recs = manifest["test"]
    _, val_transform = get_grade_preserving_transforms(image_size=392)
    test_dataset = CropQualityDataset(test_recs, transform=val_transform)
    test_loader = torch.utils.data.DataLoader(test_dataset, batch_size=16, shuffle=False)

    # Load Model
    dino_backbone = DINOBackbone(model_name="dinov2_vitb14", freeze=True)
    model = CropQualityGradingModel(dino_backbone=dino_backbone, n_handcrafted=32, fusion_dim=256, num_classes=4).to(device)
    model.load_state_dict(torch.load(checkpoint_path, map_location=device))
    model.eval()

    y_true = []
    y_pred = []
    y_scores = []

    with torch.no_grad():
        for images, labels, handcrafted in test_loader:
            images = images.to(device)
            handcrafted = handcrafted.to(device)
            with torch.amp.autocast('cuda', enabled=(device.type == 'cuda')):
                logits = model(images, handcrafted)

            ranks, scores, _ = model.head.predict_rank_and_score(logits)
            y_true.extend(labels.numpy())
            y_pred.extend(ranks.cpu().numpy())
            y_scores.extend(scores.cpu().numpy())

    y_true = np.array(y_true)
    y_pred = np.array(y_pred)
    y_scores = np.array(y_scores)

    # 1. Ordinal Distance Confusion Matrix Plot
    cm = confusion_matrix(y_true, y_pred, labels=[0, 1, 2, 3])
    cm_norm = cm.astype('float') / np.maximum(cm.sum(axis=1)[:, np.newaxis], 1)

    fig, ax = plt.subplots(figsize=(8, 6), dpi=300)
    sns.heatmap(
        cm_norm, annot=True, fmt=".2%", cmap="YlGnBu", cbar=True,
        xticklabels=["Grade A", "Grade B", "Grade C", "Grade D"],
        yticklabels=["Grade A", "Grade B", "Grade C", "Grade D"],
        ax=ax, annot_kws={"size": 12, "weight": "bold"}
    )
    ax.set_title("Ordinal Quality Confusion Matrix (Normalized)", fontsize=14, pad=12, fontweight="bold")
    ax.set_xlabel("Predicted Grade Rank", fontsize=12, fontweight="bold")
    ax.set_ylabel("True Ground-Truth Grade", fontsize=12, fontweight="bold")
    plt.tight_layout()
    cm_plot_path = os.path.join(analytics_dir, "ordinal_confusion_matrix.png")
    plt.savefig(cm_plot_path, dpi=300)
    plt.close()
    print(f"[ANALYTICS] Saved Confusion Matrix plot to: {cm_plot_path}")

    # 2. Continuous Score Distribution Violin Plot
    fig, ax = plt.subplots(figsize=(9, 6), dpi=300)
    palette = ["#2ecc71", "#3498db", "#e67e22", "#e74c3c"]
    
    sns.violinplot(
        x=y_true, y=y_scores, palette=palette, inner="quartile", cut=0, ax=ax
    )
    sns.stripplot(
        x=y_true, y=y_scores, color="black", alpha=0.3, jitter=0.15, size=4, ax=ax
    )

    # Add ordinal decision boundary lines
    ax.axhline(0.5, color="gray", linestyle="--", alpha=0.7, label="Cutoff 0.5 (A/B)")
    ax.axhline(1.5, color="gray", linestyle="--", alpha=0.7, label="Cutoff 1.5 (B/C)")
    ax.axhline(2.5, color="gray", linestyle="--", alpha=0.7, label="Cutoff 2.5 (C/D)")

    ax.set_xticklabels(["Grade A (0)", "Grade B (1)", "Grade C (2)", "Grade D (3)"], fontweight="bold")
    ax.set_title("Continuous Quality Score Expectation E[Rank] per Ground-Truth Grade", fontsize=13, fontweight="bold")
    ax.set_xlabel("True Ground-Truth Grade Class", fontsize=11, fontweight="bold")
    ax.set_ylabel("Model Continuous Quality Score [0.0 - 3.0]", fontsize=11, fontweight="bold")
    ax.legend(loc="upper left")
    plt.tight_layout()
    dist_plot_path = os.path.join(analytics_dir, "continuous_score_distribution.png")
    plt.savefig(dist_plot_path, dpi=300)
    plt.close()
    print(f"[ANALYTICS] Saved Continuous Score Distribution plot to: {dist_plot_path}")


if __name__ == "__main__":
    generate_visual_analytics()
