from pydantic import BaseModel, Field

class GradeProbabilities(BaseModel):
    """
    Class probability distribution across four ordinal quality grades.
    """
    grade_a: float = Field(..., description="Probability of Grade A (Premium Export Quality)", example=0.8845)
    grade_b: float = Field(..., description="Probability of Grade B (Fair Average Quality)", example=0.0821)
    grade_c: float = Field(..., description="Probability of Grade C (Secondary Processing Grade)", example=0.0210)
    grade_d: float = Field(..., description="Probability of Grade D (Below Standard / Defective)", example=0.0124)

class CropPredictionResult(BaseModel):
    """
    Core prediction payload produced by DINOv2 + CORAL Ordinal ONNX model.
    """
    predicted_rank: int = Field(..., description="Predicted discrete ordinal rank index (0: Grade A, 1: Grade B, 2: Grade C, 3: Grade D)", example=0)
    grade_label: str = Field(..., description="Human-readable grade label ('Grade A', 'Grade B', 'Grade C', 'Grade D')", example="Grade A")
    continuous_score: float = Field(..., description="Continuous quality score expectation E[Rank] in range [0.0, 3.0]", example=0.1542)
    probabilities: GradeProbabilities = Field(..., description="Probability breakdown for each quality grade")

class CropGradingResponse(BaseModel):
    """
    Standardized API response wrapper for crop quality grading predictions.
    """
    success: bool = Field(True, description="Indicates whether the quality grading inference completed successfully", example=True)
    message: str = Field(..., description="Status summary message", example="Crop quality grading completed successfully.")
    data: CropPredictionResult = Field(..., description="Detailed prediction result data")
