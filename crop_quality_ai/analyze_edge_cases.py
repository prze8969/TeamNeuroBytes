import os
import sys
import json
import torch
import pandas as pd
import numpy as np
from typing import List, Dict

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
from train_dino_crop import CropQualityGradingModel, DINOBackbone, CropQualityDataset, get_grade_preserving_transforms

def analyze_boundary_edge_cases():
    """
    Identifies top 10 test samples closest to ordinal decision boundaries (0.5, 1.5, 2.5) or misclassified.
    Exports details to CSV for manual visual inspection.
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

    dino_backbone = DINOBackbone(model_name="dinov2_vitb14", freeze=True)
    model = CropQualityGradingModel(dino_backbone=dino_backbone, n_handcrafted=32, fusion_dim=256, num_classes=4).to(device)
    model.load_state_dict(torch.load(checkpoint_path, map_location=device))
    model.eval()

    records = []

    with torch.no_grad():
        for idx in range(len(test_dataset)):
            rec = test_recs[idx]
            img_tensor, label_tensor, handcrafted_tensor = test_dataset[idx]
            
            img_input = img_tensor.unsqueeze(0).to(device)
            feat_input = handcrafted_tensor.unsqueeze(0).to(device)

            with torch.amp.autocast('cuda', enabled=(device.type == 'cuda')):
                logits = model(img_input, feat_input)

            ranks, scores, probs = model.head.predict_rank_and_score(logits)
            pred_rank = int(ranks[0].item())
            score = float(scores[0].item())
            prob_dist = probs[0].cpu().numpy().tolist()
            true_label = int(label_tensor.item())

            # Distance to nearest ordinal decision boundary (0.5, 1.5, 2.5)
            boundary_dists = [abs(score - b) for b in [0.5, 1.5, 2.5]]
            min_boundary_dist = min(boundary_dists)
            is_misclassified = (pred_rank != true_label)

            records.append({
                "sample_index": idx,
                "image_path": rec["path"],
                "true_label": true_label,
                "predicted_rank": pred_rank,
                "continuous_score": round(score, 4),
                "min_boundary_distance": round(min_boundary_dist, 4),
                "is_misclassified": is_misclassified,
                "prob_grade_A": round(prob_dist[0], 4),
                "prob_grade_B": round(prob_dist[1], 4),
                "prob_grade_C": round(prob_dist[2], 4),
                "prob_grade_D": round(prob_dist[3], 4)
            })

    df = pd.DataFrame(records)
    
    # Priority: Misclassified samples first, then samples closest to decision boundaries
    df_sorted = df.sort_values(by=["is_misclassified", "min_boundary_distance"], ascending=[False, True])
    top_10_edge_cases = df_sorted.head(10)

    csv_path = os.path.join(analytics_dir, "edge_cases_report.csv")
    top_10_edge_cases.to_csv(csv_path, index=False)

    print(f"\n[EDGE CASES] Successfully extracted top 10 boundary samples to: {csv_path}")
    print(top_10_edge_cases[["image_path", "true_label", "predicted_rank", "continuous_score", "min_boundary_distance"]].to_string())


if __name__ == "__main__":
    analyze_boundary_edge_cases()
