import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Dict, Tuple

class CORALOrdinalHead(nn.Module):
    """
    CORAL (Consistent Rank Logits) Ordinal Classification Head.
    For K classes (Grade A=0, B=1, C=2, D=3), constructs K-1 binary classification tasks
    sharing a weight vector with individual threshold biases.
    Guarantees monotonic rank predictions (A > B > C > D).
    """
    def __init__(self, in_features: int = 256, num_classes: int = 4):
        super().__init__()
        self.num_classes = num_classes
        self.num_tasks = num_classes - 1

        # Single weight vector shared across all binary tasks
        self.weight = nn.Parameter(torch.Tensor(1, in_features))
        # K-1 task-specific biases
        self.biases = nn.Parameter(torch.Tensor(self.num_tasks))

        self.reset_parameters()

    def reset_parameters(self):
        nn.init.kaiming_uniform_(self.weight, a=1)
        nn.init.zeros_(self.biases)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x: (batch_size, in_features)
        # logits: (batch_size, num_tasks)
        logits = torch.matmul(x, self.weight.t()) + self.biases
        return logits

class CORALLoss(nn.Module):
    """
    Computes Binary Cross Entropy loss across all K-1 ordinal binary tasks.
    """
    def __init__(self, num_classes: int = 4, class_weights: torch.Tensor = None):
        super().__init__()
        self.num_classes = num_classes
        self.class_weights = class_weights

    def forward(self, logits: torch.Tensor, targets: torch.Tensor) -> torch.Tensor:
        # logits: (batch_size, K-1)
        # targets: (batch_size,) integer class ranks 0..K-1
        batch_size = logits.size(0)
        num_tasks = self.num_classes - 1

        # Construct binary target matrix (batch_size, K-1)
        # For rank r, target_task_j = 1 if j < r else 0
        task_indices = torch.arange(num_tasks, device=targets.device).unsqueeze(0)
        binary_targets = (targets.unsqueeze(1) > task_indices).float()

        bce_loss = F.binary_cross_entropy_with_logits(logits, binary_targets, reduction='none')

        if self.class_weights is not None:
            weights = self.class_weights[targets].unsqueeze(1)
            bce_loss = bce_loss * weights

        return bce_loss.mean()

def coral_logits_to_probs(logits: torch.Tensor) -> torch.Tensor:
    """
    Converts CORAL binary logits into normalized multi-class probability distribution over K classes.
    """
    # Sigmoid probabilities for tasks: P(Y > k)
    task_probs = torch.sigmoid(logits)
    batch_size, num_tasks = logits.shape
    num_classes = num_tasks + 1

    probs = torch.zeros((batch_size, num_classes), device=logits.device)
    # P(Y = 0) = 1 - P(Y > 0)
    probs[:, 0] = 1.0 - task_probs[:, 0]
    # P(Y = k) = P(Y > k-1) - P(Y > k)
    for k in range(1, num_tasks):
        probs[:, k] = task_probs[:, k - 1] - task_probs[:, k]
    # P(Y = K-1) = P(Y > K-2)
    probs[:, num_classes - 1] = task_probs[:, num_tasks - 1]

    # Clamp and normalize for numerical stability
    probs = torch.clamp(probs, min=1e-6)
    probs = probs / probs.sum(dim=-1, keepdim=True)
    return probs

def compute_quality_score(probs: torch.Tensor, grade_scores: Tuple[float, ...] = (95.0, 82.0, 68.0, 45.0)) -> torch.Tensor:
    """
    Derives continuous 0–100 Quality Score as expectation over ordinal grade scores.
    Grade A: ~95, Grade B: ~82, Grade C: ~68, Grade D: ~45
    """
    scores_tensor = torch.tensor(grade_scores, device=probs.device, dtype=probs.dtype)
    quality_score = torch.sum(probs * scores_tensor, dim=-1)
    return torch.clamp(quality_score, min=0.0, max=100.0)
