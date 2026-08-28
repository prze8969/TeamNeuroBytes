import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image
import numpy as np
import os
from typing import List, Dict, Any

from models.quality_features import QualityFeatureExtractor

class CropDataset(Dataset):
    """
    PyTorch Dataset for Crop Quality Image Loading.
    Loads raw image, applies augmentations, extracts quality features, and returns:
    (image_tensor, quality_features_tensor, label_tensor)
    """
    def __init__(self, records: List[Dict[str, Any]], image_size: int = 224, is_train: bool = True):
        self.records = records
        self.is_train = is_train
        self.feature_extractor = QualityFeatureExtractor()

        if is_train:
            self.transform = transforms.Compose([
                transforms.Resize((image_size, image_size)),
                transforms.RandomHorizontalFlip(p=0.5),
                transforms.RandomRotation(degrees=15),
                transforms.ColorJitter(brightness=0.15, contrast=0.15, saturation=0.15),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
            ])
        else:
            self.transform = transforms.Compose([
                transforms.Resize((image_size, image_size)),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
            ])

    def __len__(self):
        return len(self.records)

    def __getitem__(self, idx):
        rec = self.records[idx]
        img_path = rec["path"]
        label = int(rec["label"])

        with Image.open(img_path) as img:
            img_rgb = img.convert("RGB")
            img_np = np.array(img_rgb)

            # Handcrafted quality feature extraction
            quality_feat = self.feature_extractor.extract_from_numpy(img_np)
            quality_tensor = torch.tensor(quality_feat, dtype=torch.float32)

            image_tensor = self.transform(img_rgb)

        return image_tensor, quality_tensor, torch.tensor(label, dtype=torch.long)
