import os
import sys
import json
import shutil
import torch
import numpy as np

# Add crop_quality_ai root to sys.path
ai_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, ai_dir)

from inference.inference import CropQualityInferencePipeline
from training.prepare_dataset import REVERSE_GRADE_MAP

def create_valid_images_folder():
    manifest_path = os.path.join(ai_dir, "dataset_split", "dataset_manifest.json")
    checkpoint_path = os.path.join(ai_dir, "checkpoints", "best_model.pth")
    dest_dir = os.path.abspath(os.path.join(ai_dir, "..", "valid_images"))

    os.makedirs(dest_dir, exist_ok=True)

    with open(manifest_path, "r") as f:
        manifest = json.load(f)

    pipeline = CropQualityInferencePipeline(checkpoint_path=checkpoint_path)

    all_records = manifest["train"] + manifest["val"] + manifest["test"]
    valid_records = []

    for rec in all_records:
        img_path = os.path.abspath(rec["path"])
        true_grade = REVERSE_GRADE_MAP[rec["label"]]

        res = pipeline.predict_image(img_path)
        if "error" in res:
            continue

        pred_grade = res["grade"]
        conf = res["confidence"]

        # Filter for 100% accurate predictions with high confidence (> 85%)
        if pred_grade == true_grade and conf >= 0.85:
            valid_records.append({
                "path": img_path,
                "grade": true_grade,
                "confidence": conf,
                "quality_score": res["quality_score"],
                "filename": os.path.basename(img_path)
            })

    print(f"[OK] Found {len(valid_records)} 100% accurate, high-confidence images.")

    # Organize copied images into valid_images/
    grade_counts = {"A": 0, "B": 0, "C": 0, "D": 0}

    for item in valid_records:
        g = item["grade"]
        grade_counts[g] += 1

        # Save into Grade subfolders
        grade_dir = os.path.join(dest_dir, f"Grade_{g}")
        os.makedirs(grade_dir, exist_ok=True)
        shutil.copy2(item["path"], os.path.join(grade_dir, item["filename"]))

        # Also copy directly into valid_images root with clear naming
        flat_filename = f"Grade_{g}_{item['filename']}"
        shutil.copy2(item["path"], os.path.join(dest_dir, flat_filename))

    print("=" * 60)
    print("VALID IMAGES SUMMARY")
    print("=" * 60)
    print(f"Destination Folder: {dest_dir}")
    print("Breakdown of 100% Verified Right Images:")
    for gr, count in grade_counts.items():
        print(f"  - Grade {gr}: {count} images")
    print("=" * 60)

if __name__ == "__main__":
    create_valid_images_folder()
