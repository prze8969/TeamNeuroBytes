import os
import matplotlib.pyplot as plt

def plot_training_curves(history: dict, output_dir: str = "results"):
    """
    Plots and saves training & validation curves:
    - training_loss.png
    - validation_loss.png
    - training_accuracy.png
    - validation_accuracy.png
    - validation_qwk.png
    - validation_mae.png
    """
    os.makedirs(output_dir, exist_ok=True)
    epochs = range(1, len(history["train_loss"]) + 1)

    # 1. Loss Curves
    plt.figure(figsize=(8, 5))
    plt.plot(epochs, history["train_loss"], 'b-o', label="Training Loss")
    plt.plot(epochs, history["val_loss"], 'r-s', label="Validation Loss")
    plt.title("Training & Validation Loss", fontweight="bold")
    plt.xlabel("Epoch")
    plt.ylabel("CORAL Ordinal Loss")
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "training_loss.png"), dpi=200)
    plt.close()

    # 2. Accuracy Curves
    plt.figure(figsize=(8, 5))
    plt.plot(epochs, history["train_acc"], 'b-o', label="Training Accuracy")
    plt.plot(epochs, history["val_acc"], 'g-^', label="Validation Accuracy")
    plt.title("Training & Validation Accuracy", fontweight="bold")
    plt.xlabel("Epoch")
    plt.ylabel("Accuracy")
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "validation_accuracy.png"), dpi=200)
    plt.close()

    # 3. Ordinal QWK & MAE Curves
    if "val_qwk" in history and "val_mae" in history:
        plt.figure(figsize=(8, 5))
        plt.plot(epochs, history["val_qwk"], 'purple', marker='o', label="Validation QWK")
        plt.title("Validation Quadratic Weighted Kappa (QWK)", fontweight="bold")
        plt.xlabel("Epoch")
        plt.ylabel("QWK Score")
        plt.legend()
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, "validation_qwk.png"), dpi=200)
        plt.close()

        plt.figure(figsize=(8, 5))
        plt.plot(epochs, history["val_mae"], 'orange', marker='s', label="Validation MAE (Grade Rank)")
        plt.title("Validation Mean Absolute Error (MAE)", fontweight="bold")
        plt.xlabel("Epoch")
        plt.ylabel("MAE (Grade Error)")
        plt.legend()
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, "validation_mae.png"), dpi=200)
        plt.close()

    print(f"[OK] Saved all training curve plots to '{output_dir}/'.")
