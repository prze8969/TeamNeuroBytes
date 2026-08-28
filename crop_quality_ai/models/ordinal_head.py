import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Dict, Tuple

class CORALOrdinalHead(nn.Module):
    """
    CORAL (Consistent Rank Logits) Ordinal Classification Head.
    Enforces monotonic rank ordering across K grades (A > B > C > D).
    Uses K-1 binary classification tasks with a shared weight vector w and rank biases b_k.
    """
    def __init__(self, in_features: int, num_classes: int = 4):
        super().__init__()
        self.num_classes = num_classes
        self.num_tasks = num_classes - 1  # 3 tasks for 4 grades
        
        # Shared projection vector w (1-dim output)
        self.weight = nn.Linear(in_features, 1, bias=False)
        # Task-specific biases b_k initialized in decreasing order
        self.bias = nn.Parameter(torch.zeros(self.num_tasks))
        
        # Initialize bias so initial thresholds are monotonic
        with torch.no_grad():
            self.bias.copy_(torch.linspace(1.0, -1.0, self.num_tasks))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Input: Fusion bottleneck embedding [B, in_features]
        Output: Raw rank logits [B, num_classes - 1]
        """
        # w^T x: shape [B, 1]
        projected = self.weight(x)
        # Add biases b_k: shape [B, num_tasks]
        logits = projected + self.bias
        return logits

    def logits_to_probabilities(self, logits: torch.Tensor) -> torch.Tensor:
        """
        Converts K-1 binary logits to K class probabilities.
        P(y > k) = sigmoid(logits[:, k])
        P(y = 0) = 1 - P(y > 0)
        P(y = k) = P(y > k-1) - P(y > k)
        P(y = K-1) = P(y > K-2)
        Output: Class probabilities tensor [B, num_classes]
        """
        sigmoids = torch.sigmoid(logits)  # [B, K-1]
        batch_size = logits.size(0)
        
        probs = torch.zeros(batch_size, self.num_classes, device=logits.device)
        # P(y = 0 / Grade A)
        probs[:, 0] = 1.0 - sigmoids[:, 0]
        # P(y = k / Grade B, C)
        for k in range(1, self.num_tasks):
            probs[:, k] = sigmoids[:, k - 1] - sigmoids[:, k]
        # P(y = K-1 / Grade D)
        probs[:, -1] = sigmoids[:, -1]
        
        # Clamp to avoid numerical issues and normalize
        probs = torch.clamp(probs, min=1e-7, max=1.0)
        probs = probs / probs.sum(dim=-1, keepdim=True)
        return probs

    def predict_rank_and_score(self, logits: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        """
        Computes predicted class rank, quality score (0-100), and class probabilities.
        Returns:
            - predicted_ranks: LongTensor [B] (0=A, 1=B, 2=C, 3=D)
            - quality_scores: FloatTensor [B] (0.0 to 100.0)
            - probabilities: FloatTensor [B, K]
        """
        probs = self.logits_to_probabilities(logits)
        # Expected rank = sum_{k=0}^{K-1} (k * P(y = k))
        ranks_float = torch.sum(probs * torch.arange(self.num_classes, device=logits.device, dtype=torch.float32), dim=-1)
        
        # Rank by argmax probability
        predicted_ranks = torch.argmax(probs, dim=-1)
        
        # Continuous Quality Score (0 to 100)
        # Grade A (rank 0) -> 90-100, Grade D (rank 3) -> 0-45
        quality_scores = torch.clamp(100.0 - (ranks_float / (self.num_classes - 1)) * 80.0, min=0.0, max=100.0)
        
        return predicted_ranks, quality_scores, probs


class CORALLoss(nn.Module):
    r"""
    Computes CORAL Loss for ordinal classification.
    Given target rank y \in {0, 1, ..., K-1}, creates binary targets:
    y_binary^{(k)} = 1 if y > k else 0 for k=0, ..., K-2.
    Sums binary cross-entropy loss over all tasks.
    """
    def __init__(self, num_classes: int = 4):
        super().__init__()
        self.num_classes = num_classes
        self.num_tasks = num_classes - 1

    def forward(self, logits: torch.Tensor, targets: torch.Tensor) -> torch.Tensor:
        """
        logits: [B, K-1]
        targets: [B] integer tensor of ground truth ranks (0, 1, 2, 3)
        """
        device = logits.device
        batch_size = targets.size(0)
        
        # Construct binary targets [B, K-1]
        levels = torch.arange(self.num_tasks, device=device).unsqueeze(0).expand(batch_size, -1)
        target_levels = targets.unsqueeze(1).expand(-1, self.num_tasks)
        binary_targets = (target_levels > levels).float()
        
        # Binary cross entropy with logits
        bce_loss = F.binary_cross_entropy_with_logits(logits, binary_targets, reduction='mean')
        return bce_loss
