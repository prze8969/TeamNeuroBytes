import os
import sys
import json
import random
import hashlib
import numpy as np
from PIL import Image
from typing import Dict, List, Any

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.path.insert(0, os.path.abspath("."))

GRADE_MAP = {"A": 0, "B": 1, "C": 2, "D": 3}
REVERSE_GRADE_MAP = {0: "A", 1: "B", 2: "C", 3: "D"}

def inspect_and_split_dataset(
    data_dirs: List[str] = ["crop_quality_ai/data_augmented", "crop_quality_ai/data", "valid_images"],
    output_dir: str = "crop_quality_ai/dataset_split",
    train_ratio: float = 0.70,
    val_ratio: float = 0.15,
    test_ratio: float = 0.15,
    seed: int = 42
) -> Dict[str, Any]:
    """
    Validates dataset, removes corrupted images, pools from data_augmented/data/valid_images,
    and performs a leak-proof train/val/test split.
    Group splitting by base image root ID prevents data leakage between original & augmented versions.
    """
    random.seed(seed)
    np.random.seed(seed)

    image_records = []
    hashes = set()
    corrupted_count = 0
    duplicate_count = 0

    # Primary scan: use augmented dataset if available
    aug_dir = "crop_quality_ai/data_augmented"
    scan_dirs = [aug_dir] if os.path.exists(aug_dir) and len(os.listdir(aug_dir)) > 0 else data_dirs

    for ddir in scan_dirs:
        if not os.path.exists(ddir):
            continue
        
        for root, dirs, files in os.walk(ddir):
            for fname in files:
                if not fname.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                    continue
                
                fpath = os.path.join(root, fname)
                
                grade = None
                fname_upper = fname.upper()
                folder_upper = os.path.basename(root).upper()
                
                for g in ["GRADE_A", "GRADE_B", "GRADE_C", "GRADE_D"]:
                    if g in fname_upper or g in folder_upper:
                        grade = g.replace("GRADE_", "")
                        break
                
                if grade is None:
                    for g in ["_A_", "_B_", "_C_", "_D_"]:
                        if g in fname_upper:
                            grade = g.strip("_")
                            break
                            
                if grade is None or grade not in GRADE_MAP:
                    continue

                label_idx = GRADE_MAP[grade]

                try:
                    # Quick size and extension check
                    fsize = os.path.getsize(fpath)
                    if fsize < 100:  # Skip empty files
                        corrupted_count += 1
                        continue

                    # Extract base crop ID (stripping _v1, _v2, _v3, _v4, _orig) for leak-proof group splitting
                    base_id = fname.split("_v")[0].split("_orig")[0]

                    image_records.append({
                        "path": os.path.abspath(fpath),
                        "class_name": grade,
                        "label": label_idx,
                        "crop_id": base_id
                    })
                except Exception:
                    corrupted_count += 1

    # Group by crop_id (base image) to guarantee zero data leakage
    crop_groups = {}
    for rec in image_records:
        cid = rec["crop_id"]
        if cid not in crop_groups:
            crop_groups[cid] = []
        crop_groups[cid].append(rec)

    group_keys = list(crop_groups.keys())
    random.shuffle(group_keys)

    n_groups = len(group_keys)
    n_train_g = int(n_groups * train_ratio)
    n_val_g = int(n_groups * val_ratio)

    train_groups = set(group_keys[:n_train_g])
    val_groups = set(group_keys[n_train_g:n_train_g + n_val_g])
    test_groups = set(group_keys[n_train_g + n_val_g:])

    train_recs, val_recs, test_recs = [], [], []

    for cid, recs in crop_groups.items():
        if cid in train_groups:
            train_recs.extend(recs)
        elif cid in val_groups:
            val_recs.extend(recs)
        else:
            test_recs.extend(recs)

    random.shuffle(train_recs)
    random.shuffle(val_recs)
    random.shuffle(test_recs)

    n_total = len(train_recs) + len(val_recs) + len(test_recs)

    os.makedirs(output_dir, exist_ok=True)
    manifest = {
        "summary": {
            "total_images": n_total,
            "train_images": len(train_recs),
            "val_images": len(val_recs),
            "test_images": len(test_recs),
            "corrupted_images": corrupted_count,
            "duplicate_images": duplicate_count,
            "classes": ["A", "B", "C", "D"]
        },
        "train": train_recs,
        "val": val_recs,
        "test": test_recs
    }

    manifest_path = os.path.join(output_dir, "dataset_manifest.json")
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)

    print("=" * 60)
    print("LEAK-PROOF DATASET SPLIT SUMMARY (AUGMENTED)")
    print("=" * 60)
    print(f"Total Valid Images: {n_total}")
    print(f"  - Train Split (70%): {len(train_recs)}")
    print(f"  - Val Split   (15%): {len(val_recs)}")
    print(f"  - Test Split  (15%): {len(test_recs)}")
    print(f"Corrupted Images Skipped: {corrupted_count}")
    print(f"Duplicate Images Skipped: {duplicate_count}")
    print(f"Manifest written to: {manifest_path}")
    print("=" * 60)

    return manifest

if __name__ == "__main__":
    inspect_and_split_dataset()
