import os
import sys
import json
import torch
import torch.nn as nn
import torchvision.transforms.functional as TF
import numpy as np
from PIL import Image
from torch.utils.data import DataLoader
from sklearn.metrics import accuracy_score, cohen_kappa_score, mean_absolute_error, classification_report
from typing import Dict, Tuple, List

# Add parent path for imports
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
from train_dino_crop import CropQualityGradingModel, DINOBackbone, CropQualityDataset, get_grade_preserving_transforms

def predict_single_sample_tta(
    model: nn.Module,
    image_tensor: torch.Tensor,
    handcrafted_tensor: torch.Tensor,
    device: torch.device
) -> Tuple[int, float, np.ndarray]:
    """
    Performs 4-view Test-Time Augmentation (TTA) by averaging raw CORAL logits.
    Views: 1. Original, 2. Horizontal Flip, 3. 10-degree Rotation, 4. Slight Gaussian Blur.
    """
    model.eval()
    if image_tensor.dim() == 3:
        image_tensor = image_tensor.unsqueeze(0)  # [1, 3, 392, 392]
    if handcrafted_tensor.dim() == 1:
        handcrafted_tensor = handcrafted_tensor.unsqueeze(0)  # [1, 32]

    image_tensor = image_tensor.to(device)
    handcrafted_tensor = handcrafted_tensor.to(device)

    # 4 TTA Spatial Views
    views = [
        image_tensor,                                                           # 1. Original
        TF.hflip(image_tensor),                                                # 2. Horizontal Flip
        TF.rotate(image_tensor, angle=10, interpolation=TF.InterpolationMode.BILINEAR), # 3. 10-deg Rotation
        TF.gaussian_blur(image_tensor, kernel_size=[3, 3], sigma=[0.5, 0.5])   # 4. Blur
    ]

    accumulated_logits = torch.zeros(1, 3, device=device)

    with torch.no_grad():
        with torch.amp.autocast('cuda', enabled=(device.type == 'cuda')):
            for view in views:
                logits = model(view, handcrafted_tensor)
                accumulated_logits += logits

    avg_logits = accumulated_logits / len(views)
    ranks, scores, probs = model.head.predict_rank_and_score(avg_logits)

    return int(ranks[0].item()), float(scores[0].item()), probs[0].cpu().numpy()


def evaluate_unseen_test_set():
    """
    Evaluates best_dino_model.pth on the 570 unseen test set images using 4-view TTA.
    """
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[EVAL] Evaluating on device: {device}")

    base_dir = os.path.dirname(os.path.abspath(__file__))
    manifest_path = os.path.join(base_dir, "dataset_split", "dataset_manifest.json")
    checkpoint_path = os.path.join(base_dir, "checkpoints", "best_dino_model.pth")

    if not os.path.exists(checkpoint_path):
        raise FileNotFoundError(f"Checkpoint not found at: {checkpoint_path}")

    # Load dataset manifest
    with open(manifest_path, "r") as f:
        manifest = json.load(f)

    test_recs = manifest["test"]
    print(f"[EVAL] Loaded {len(test_recs)} unseen test set records.")

    _, val_transform = get_grade_preserving_transforms(image_size=392)
    test_dataset = CropQualityDataset(test_recs, transform=val_transform)

    # Initialize Model Architecture
    print("[EVAL] Initializing DINOv2 ViT-B/14 Backbone...")
    dino_backbone = DINOBackbone(model_name="dinov2_vitb14", freeze=True)
    model = CropQualityGradingModel(
        dino_backbone=dino_backbone,
        n_handcrafted=32,
        fusion_dim=256,
        num_classes=4,
        dropout=0.4
    ).to(device)

    # Load Trained Weights
    state_dict = torch.load(checkpoint_path, map_location=device)
    model.load_state_dict(state_dict)
    model.eval()
    print(f"[EVAL] Successfully loaded weights from '{checkpoint_path}'.")

    y_true = []
    y_pred = []
    y_scores = []

    print("[EVAL] Running 4-View Test-Time Augmentation (TTA) inference...")
    for idx in range(len(test_dataset)):
        img_tensor, label_tensor, handcrafted_tensor = test_dataset[idx]
        true_label = int(label_tensor.item())

        pred_rank, pred_score, _ = predict_single_sample_tta(
            model, img_tensor, handcrafted_tensor, device
        )

        y_true.append(true_label)
        y_pred.append(pred_rank)
        y_scores.append(pred_score)

        if (idx + 1) % 100 == 0 or (idx + 1) == len(test_dataset):
            print(f"       Processed {idx + 1}/{len(test_dataset)} test samples...")

    y_true = np.array(y_true)
    y_pred = np.array(y_pred)
    y_scores = np.array(y_scores)

    # Metrics Computation
    test_acc = accuracy_score(y_true, y_pred)
    test_qwk = cohen_kappa_score(y_true, y_pred, weights='quadratic')
    test_mae = mean_absolute_error(y_true, y_pred)

    print("\n" + "=" * 65)
    print("      UNSEEN TEST SET EVALUATION RESULTS (WITH 4-VIEW TTA)")
    print("=" * 65)
    print(f" Test Accuracy              : {test_acc * 100:.2f}%")
    print(f" Quadratic Weighted Kappa   : {test_qwk:.4f}")
    print(f" Mean Absolute Error (MAE)  : {test_mae:.4f} grade ranks")
    print("=" * 65 + "\n")

    target_names = ["Grade A (0)", "Grade B (1)", "Grade C (2)", "Grade D (3)"]
    print("Detailed Classification Report:\n")
    print(classification_report(y_true, y_pred, target_names=target_names, digits=4))


if __name__ == "__main__":
    evaluate_unseen_test_set()
