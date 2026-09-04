from pydantic import BaseModel, Field
from typing import Dict

class CropPredictionResponse(BaseModel):
    predicted_rank: int = Field(..., description="Discrete grade rank: 0 (A), 1 (B), 2 (C), 3 (D)")
    grade_label: str = Field(..., description="Human-readable grade label, e.g., Grade A")
    continuous_score: float = Field(..., description="Continuous quality score expectation E[Rank] in [0.0, 3.0]")
    probabilities: Dict[str, float] = Field(..., description="Class probability distribution for Grade A, B, C, D")

class APIResponse(BaseModel):
    success: bool = Field(True, description="Request execution status")
    filename: str = Field(..., description="Uploaded image filename")
    prediction: CropPredictionResponse = Field(..., description="Detailed AI quality prediction output")
