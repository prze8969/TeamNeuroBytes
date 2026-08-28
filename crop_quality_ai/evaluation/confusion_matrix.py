import os
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix
from typing import List

def plot_and_save_confusion_matrix(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    class_names: List[str] = ["Grade A", "Grade B", "Grade C", "Grade D"],
    output_path: str = "crop_quality_ai/results/confusion_matrix.png"
):
    """
    Computes and saves a sleek, professional confusion matrix plot.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    cm = confusion_matrix(y_true, y_pred, labels=list(range(len(class_names))))
    
    fig, ax = plt.subplots(figsize=(7, 6), dpi=300)
    cax = ax.matshow(cm, cmap=plt.cm.Blues, alpha=0.85)
    
    fig.colorbar(cax)
    
    ax.set_xticks(np.arange(len(class_names)))
    ax.set_yticks(np.arange(len(class_names)))
    ax.set_xticklabels(class_names, fontsize=11, fontweight='bold')
    ax.set_yticklabels(class_names, fontsize=11, fontweight='bold')
    
    plt.xlabel('Predicted Grade', fontsize=12, labelpad=10)
    plt.ylabel('True Grade', fontsize=12, labelpad=10)
    plt.title('Crop Quality Grading — Confusion Matrix', fontsize=13, fontweight='bold', pad=15)
    
    # Annotate counts inside cells
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            val = cm[i, j]
            color = "white" if val > cm.max() / 2.0 else "black"
            ax.text(j, i, str(val), ha="center", va="center", color=color, fontsize=13, fontweight='bold')
            
    plt.tight_layout()
    plt.savefig(output_path, dpi=300)
    plt.close()
    print(f"[OK] Saved confusion matrix to '{output_path}'.")
