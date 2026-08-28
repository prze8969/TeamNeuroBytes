import numpy as np
from typing import Dict, Any
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    mean_absolute_error,
    cohen_kappa_score,
    confusion_matrix
)

def compute_all_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    """
    Computes comprehensive classification and ordinal metrics:
    - Accuracy
    - Precision (Macro)
    - Recall (Macro)
    - Macro F1
    - Weighted F1
    - Mean Absolute Error (MAE)
    - Quadratic Weighted Kappa (QWK)
    """
    y_true = np.asarray(y_true, dtype=int)
    y_pred = np.asarray(y_pred, dtype=int)

    acc = float(accuracy_score(y_true, y_pred))
    prec = float(precision_score(y_true, y_pred, average='macro', zero_division=0))
    rec = float(recall_score(y_true, y_pred, average='macro', zero_division=0))
    macro_f1 = float(f1_score(y_true, y_pred, average='macro', zero_division=0))
    weighted_f1 = float(f1_score(y_true, y_pred, average='weighted', zero_division=0))
    mae = float(mean_absolute_error(y_true, y_pred))
    qwk = float(cohen_kappa_score(y_true, y_pred, weights='quadratic'))

    return {
        "accuracy": round(acc, 4),
        "precision_macro": round(prec, 4),
        "recall_macro": round(rec, 4),
        "macro_f1": round(macro_f1, 4),
        "weighted_f1": round(weighted_f1, 4),
        "mae": round(mae, 4),
        "qwk": round(qwk, 4)
    }

def print_metrics_summary(metrics: Dict[str, float], title: str = "Evaluation Metrics"):
    print("=" * 60)
    print(f" {title.upper()} ")
    print("=" * 60)
    print(f"  - Accuracy:           {metrics['accuracy']:.4f} ({metrics['accuracy']*100:.2f}%)")
    print(f"  - Precision (Macro):   {metrics['precision_macro']:.4f}")
    print(f"  - Recall (Macro):      {metrics['recall_macro']:.4f}")
    print(f"  - Macro F1:           {metrics['macro_f1']:.4f}")
    print(f"  - Weighted F1:        {metrics['weighted_f1']:.4f}")
    print(f"  - Mean Abs Error:     {metrics['mae']:.4f}")
    print(f"  - Quadratic Kappa:    {metrics['qwk']:.4f} (QWK)")
    print("=" * 60)
