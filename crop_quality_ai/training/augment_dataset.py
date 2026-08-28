import os
import sys
import glob
import random
import numpy as np
import cv2
import albumentations as A
from PIL import Image
from typing import List, Dict

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.path.insert(0, os.path.abspath("."))

def build_augmentors():
    """
    Builds the 4 specific albumentations transformation pipelines as requested:
    - Version 1: Random rotation (+/-15 deg), horizontal flip
    - Version 2: Color jitter (brightness=0.2, contrast=0.2, saturation=0.2)
    - Version 3: Random resized crop (scale 0.8-1.0), slight blur
    - Version 4: Combined rotation + color jitter + slight Gaussian noise
    """
    v1 = A.Compose([
        A.Rotate(limit=15, p=1.0, border_mode=cv2.BORDER_REFLECT),
        A.HorizontalFlip(p=0.5)
    ])

    v2 = A.Compose([
        A.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.05, p=1.0)
    ])

    v3 = A.Compose([
        A.RandomResizedCrop(size=(256, 256), scale=(0.8, 1.0), p=1.0),
        A.GaussianBlur(blur_limit=(3, 5), p=0.5)
    ])

    v4 = A.Compose([
        A.Rotate(limit=15, p=0.8, border_mode=cv2.BORDER_REFLECT),
        A.ColorJitter(brightness=0.15, contrast=0.15, saturation=0.15, p=0.8),
        A.GaussNoise(std_range=(0.02, 0.05), p=0.5)
    ])

    return [v1, v2, v3, v4]

def augment_dataset(
    source_dirs: List[str] = ["crop_quality_ai/data", "valid_images"],
    output_dir: str = "crop_quality_ai/data_augmented",
    seed: int = 42
):
    """
    Loads images from source directories, generates 4 augmented versions per image,
    preserves original Grade labels, and saves output to crop_quality_ai/data_augmented/.
    Expands ~454 images into ~2,270 images.
    """
    random.seed(seed)
    np.random.seed(seed)

    os.makedirs(output_dir, exist_ok=True)
    grades = ["Grade_A", "Grade_B", "Grade_C", "Grade_D"]
    for g in grades:
        os.makedirs(os.path.join(output_dir, g), exist_ok=True)

    augmentors = build_augmentors()

    # Collect source images
    image_files = []
    for sdir in source_dirs:
        if not os.path.exists(sdir):
            continue
        for root, _, files in os.walk(sdir):
            for f in files:
                if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                    fpath = os.path.join(root, f)
                    
                    # Identify Grade label
                    grade_folder = None
                    fname_upper = f.upper()
                    root_upper = os.path.basename(root).upper()
                    
                    for g in ["GRADE_A", "GRADE_B", "GRADE_C", "GRADE_D"]:
                        if g in fname_upper or g in root_upper:
                            grade_folder = g.title() # Grade_A, Grade_B...
                            break
                            
                    if grade_folder is None:
                        for g in ["_A_", "_B_", "_C_", "_D_"]:
                            if g in fname_upper:
                                grade_folder = f"Grade_{g.strip('_')}"
                                break

                    if grade_folder:
                        image_files.append((fpath, grade_folder, f))

    print(f"[INFO] Found {len(image_files)} source images to augment.")
    total_saved = 0

    for idx, (fpath, grade_folder, fname) in enumerate(image_files):
        try:
            # Read image via cv2
            img_bgr = cv2.imread(fpath)
            if img_bgr is None:
                continue
            img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
            
            # Save original image copy into data_augmented
            out_grade_dir = os.path.join(output_dir, grade_folder)
            base_name, ext = os.path.splitext(fname)
            
            orig_save_path = os.path.join(out_grade_dir, f"{base_name}_orig{ext}")
            cv2.imwrite(orig_save_path, img_bgr)
            total_saved += 1

            # Generate 4 augmented versions
            for ver_idx, aug in enumerate(augmentors, start=1):
                augmented = aug(image=img_rgb)["image"]
                aug_bgr = cv2.cvtColor(augmented, cv2.COLOR_RGB2BGR)
                
                aug_save_name = f"{base_name}_v{ver_idx}{ext}"
                aug_save_path = os.path.join(out_grade_dir, aug_save_name)
                cv2.imwrite(aug_save_path, aug_bgr)
                total_saved += 1

        except Exception as e:
            print(f"[WARN] Error augmenting image '{fpath}': {e}")

    print("=" * 60)
    print("DATASET AUGMENTATION SUMMARY")
    print("=" * 60)
    print(f"Source Images:       {len(image_files)}")
    print(f"Augmented Versions:  4 per image")
    print(f"Total Dataset Size:  {total_saved} images in '{output_dir}'")
    print("=" * 60)

if __name__ == "__main__":
    augment_dataset()
