# Crop Quality Grading AI (DINOv3 + Feature Fusion + CORAL Ordinal Classification)

High-accuracy, time-aware agricultural crop quality grading model designed for 8-12 GB VRAM GPUs.

## Key Features
- **Backbone**: Pretrained DINOv3 / DINOv2 visual representation vector extractor.
- **Quality Features**: Explicit handcrafted color, texture (LBP), shape, and defect features.
- **Fusion Network**: Trainable LayerNorm bottleneck fusion module.
- **Ordinal Head**: CORAL (Consistent Rank Logits) enforcing monotonic rank ordering ($Grade\ A > Grade\ B > Grade\ C > Grade\ D$).
- **Explainability**: Saliency heatmap visualizer showing regions driving quality decisions.

## Quick Start Commands

### 1. Data Preparation & Leak-Proof Split
```bash
python training/prepare_dataset.py
```

### 2. Time-Aware Training & Checkpointing
```bash
python training/train.py
```

### 3. Untouched Test Set Evaluation
```bash
python training/evaluate.py
```

### 4. Single-Image Inference
```bash
python inference/inference.py --image path/to/crop_sample.jpg
```
