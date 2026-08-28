import os
import sys
import shutil
import json
from pathlib import Path

# Ensure backend root is in sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
workspace_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
if workspace_dir not in sys.path:
    sys.path.insert(0, workspace_dir)

from app.core.ml_models.crop_quality_predictor import crop_quality_predictor

def filter_and_populate_valid_images():
    print("=" * 70)
    print("  FILTERING & POPULATING valid_images/ WITH DINOv2 PASSED PRODUCE IMAGES")
    print("=" * 70)

    # Pre-load model
    crop_quality_predictor.load_model()

    valid_images_dir = Path(workspace_dir) / "valid_images"
    rejected_images_dir = Path(workspace_dir) / "rejected_images"
    data_dir = Path(workspace_dir) / "crop_quality_ai" / "data"

    valid_images_dir.mkdir(exist_ok=True)
    rejected_images_dir.mkdir(exist_ok=True)

    # Gather all candidate image files
    candidate_files = []

    # 1. Gather from valid_images/
    for ext in ["*.jpg", "*.jpeg", "*.png"]:
        candidate_files.extend(list(valid_images_dir.rglob(ext)))

    # 2. Gather from dataset data_dir if needed
    if data_dir.exists():
        for ext in ["*.jpg", "*.jpeg", "*.png"]:
            candidate_files.extend(list(data_dir.rglob(ext)))

    # Remove duplicates
    unique_candidates = list({f.resolve(): f for f in candidate_files}.values())
    print(f"[INFO] Scanning {len(unique_candidates)} candidate produce images...")

    passed_count = 0
    rejected_count = 0
    grade_counts = {"A": 0, "B": 0, "C": 0, "D": 0}

    manifest = []

    for idx, img_path in enumerate(unique_candidates):
        try:
            res = crop_quality_predictor.predict(str(img_path))
            grade = res.get("grade", "D")
            is_passed = res.get("is_passed", False)
            score = res.get("quality_score", 0.0)
            confidence = res.get("confidence", 0.0)

            grade_counts[grade] = grade_counts.get(grade, 0) + 1

            target_filename = f"Grade_{grade}_{img_path.name}"

            if is_passed and grade in ["A", "B", "C"]:
                passed_count += 1
                target_folder = valid_images_dir / f"Grade_{grade}"
                target_folder.mkdir(exist_ok=True)
                dest_path = target_folder / target_filename
                shutil.copy2(img_path, dest_path)

                # Also place copy in root valid_images/ for quick flat access
                flat_dest_path = valid_images_dir / target_filename
                shutil.copy2(img_path, flat_dest_path)

                manifest.append({
                    "filename": target_filename,
                    "grade": grade,
                    "score": score,
                    "confidence": confidence,
                    "passed": True,
                    "path": str(dest_path.relative_to(workspace_dir))
                })
            else:
                rejected_count += 1
                target_folder = rejected_images_dir / f"Grade_{grade}"
                target_folder.mkdir(exist_ok=True)
                dest_path = target_folder / target_filename
                shutil.copy2(img_path, dest_path)

                # Clean up Grade_D images from valid_images root if present
                if img_path.is_relative_to(valid_images_dir):
                    try:
                        img_path.unlink()
                    except Exception:
                        pass

        except Exception as e:
            print(f"[WARN] Error evaluating {img_path.name}: {e}")

    # Clean up empty legacy folders in valid_images
    for item in list(valid_images_dir.iterdir()):
        if item.is_dir() and item.name == "Grade_D":
            shutil.rmtree(item, ignore_errors=True)

    # Save manifest summary
    manifest_path = valid_images_dir / "valid_images_manifest.json"
    with open(manifest_path, "w") as f:
        json.dump({
            "total_passed": passed_count,
            "total_rejected": rejected_count,
            "grade_distribution": grade_counts,
            "passed_images": manifest
        }, f, indent=2)

    print("\n" + "=" * 70)
    print("                FILTERING COMPLETE")
    print("=" * 70)
    print(f"[SUCCESS] Total Passed Images in valid_images/: {passed_count}")
    print(f"[INFO] Total Rejected Images in rejected_images/: {rejected_count}")
    print(f"[SUMMARY] Grade Breakdown: {grade_counts}")
    print(f"[FILE] Manifest saved to: '{manifest_path}'")
    print("=" * 70)

if __name__ == "__main__":
    filter_and_populate_valid_images()
