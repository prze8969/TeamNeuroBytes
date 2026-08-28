import numpy as np
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    cohen_kappa_score, confusion_matrix
)
from typing import Dict, Any

def compute_all_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, Any]:
    """
    Computes comprehensive multi-class & ordinal metrics:
    - Accuracy, Macro F1, Weighted F1, Precision, Recall
    - Ordinal Metrics: Mean Absolute Error (MAE), Quadratic Weighted Kappa (QWK)
    - Confusion Matrix
    """
    y_true = np.array(y_true, dtype=int)
    y_pred = np.array(y_pred, dtype=int)

    acc = float(accuracy_score(y_true, y_pred))
    macro_f1 = float(f1_score(y_true, y_pred, average="macro", zero_division=0))
    weighted_f1 = float(f1_score(y_true, y_pred, average="weighted", zero_division=0))
    macro_prec = float(precision_score(y_true, y_pred, average="macro", zero_division=0))
    macro_rec = float(recall_score(y_true, y_pred, average="macro", zero_division=0))

    # Ordinal MAE between grade index ranks
    mae = float(np.mean(np.abs(y_true - y_pred)))
    # Quadratic Weighted Kappa (QWK) for ordinal agreement
    qwk = float(cohen_kappa_score(y_true, y_pred, weights="quadratic"))

    cm = confusion_matrix(y_true, y_pred, labels=[0, 1, 2, 3])

    return {
        "accuracy": round(acc, 4),
        "macro_f1": round(macro_f1, 4),
        "weighted_f1": round(weighted_f1, 4),
        "precision": round(macro_prec, 4),
        "recall": round(macro_rec, 4),
        "mae": round(mae, 4),
        "qwk": round(qwk, 4),
        "confusion_matrix": cm.tolist()
    }
