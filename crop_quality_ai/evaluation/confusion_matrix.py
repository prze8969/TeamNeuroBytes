import os
import numpy as np
import matplotlib.pyplot as plt
try:
    import seaborn as sns
except Exception:
    sns = None

def save_confusion_matrix_plot(cm_matrix: list, class_names: list = ["Grade A", "Grade B", "Grade C", "Grade D"], output_path: str = "results/confusion_matrix.png"):
    """
    Renders and saves a clean annotated confusion matrix image.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    cm_arr = np.array(cm_matrix)

    plt.figure(figsize=(7, 6))
    if sns is not None:
        sns.heatmap(cm_arr, annot=True, fmt="d", cmap="Blues",
                    xticklabels=class_names, yticklabels=class_names,
                    cbar=False, linewidths=1.0, annot_kws={"size": 14, "weight": "bold"})
    else:
        plt.imshow(cm_arr, interpolation='nearest', cmap=plt.cm.Blues)
        plt.colorbar()
        tick_marks = np.arange(len(class_names))
        plt.xticks(tick_marks, class_names)
        plt.yticks(tick_marks, class_names)
        for i in range(cm_arr.shape[0]):
            for j in range(cm_arr.shape[1]):
                plt.text(j, i, str(cm_arr[i, j]), horizontalalignment="center", color="white" if cm_arr[i, j] > cm_arr.max() / 2 else "black", fontweight="bold")

    plt.title("Crop Quality Ordinal Confusion Matrix", fontsize=14, pad=12, fontweight="bold")
    plt.xlabel("Predicted Grade", fontsize=12, labelpad=8)
    plt.ylabel("Actual True Grade", fontsize=12, labelpad=8)
    plt.tight_layout()
    plt.savefig(output_path, dpi=200)
    plt.close()
    print(f"[OK] Saved confusion matrix to: {output_path}")
