import os
import matplotlib.pyplot as plt
from typing import List, Dict

def save_training_plots(history: Dict[str, List[float]], output_dir: str = "crop_quality_ai/results"):
    """
    Saves clean, high-resolution training curves:
    - loss.png
    - accuracy.png
    - qwk.png
    """
    os.makedirs(output_dir, exist_ok=True)
    epochs = range(1, len(history["train_loss"]) + 1)

    # 1. Loss Plot
    plt.figure(figsize=(7, 5), dpi=300)
    plt.plot(epochs, history["train_loss"], 'b-o', label='Train CORAL Loss', linewidth=2)
    plt.plot(epochs, history["val_loss"], 'r-s', label='Val CORAL Loss', linewidth=2)
    plt.title('Training & Validation Loss', fontsize=13, fontweight='bold')
    plt.xlabel('Epoch', fontsize=11)
    plt.ylabel('CORAL Loss', fontsize=11)
    plt.legend(fontsize=10)
    plt.grid(True, linestyle='--', alpha=0.6)
    plt.tight_layout()
    loss_path = os.path.join(output_dir, "loss.png")
    plt.savefig(loss_path, dpi=300)
    plt.close()
    print(f"[OK] Saved loss curve to '{loss_path}'.")

    # 2. Accuracy Plot
    plt.figure(figsize=(7, 5), dpi=300)
    plt.plot(epochs, [a * 100 for a in history["train_acc"]], 'b-o', label='Train Accuracy (%)', linewidth=2)
    plt.plot(epochs, [a * 100 for a in history["val_acc"]], 'g-^', label='Val Accuracy (%)', linewidth=2)
    plt.title('Training & Validation Accuracy', fontsize=13, fontweight='bold')
    plt.xlabel('Epoch', fontsize=11)
    plt.ylabel('Accuracy (%)', fontsize=11)
    plt.legend(fontsize=10)
    plt.grid(True, linestyle='--', alpha=0.6)
    plt.tight_layout()
    acc_path = os.path.join(output_dir, "accuracy.png")
    plt.savefig(acc_path, dpi=300)
    plt.close()
    print(f"[OK] Saved accuracy curve to '{acc_path}'.")

    # 3. QWK Plot
    plt.figure(figsize=(7, 5), dpi=300)
    plt.plot(epochs, history["val_qwk"], 'purple', marker='d', label='Val QWK (Quadratic Kappa)', linewidth=2)
    plt.title('Validation Quadratic Weighted Kappa (QWK)', fontsize=13, fontweight='bold')
    plt.xlabel('Epoch', fontsize=11)
    plt.ylabel('QWK Score', fontsize=11)
    plt.legend(fontsize=10)
    plt.grid(True, linestyle='--', alpha=0.6)
    plt.tight_layout()
    qwk_path = os.path.join(output_dir, "qwk.png")
    plt.savefig(qwk_path, dpi=300)
    plt.close()
    print(f"[OK] Saved QWK curve to '{qwk_path}'.")
