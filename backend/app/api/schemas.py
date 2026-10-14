"""
Pydantic schemas for request/response validation.
"""

from pydantic import BaseModel, Field


class PredictionResponse(BaseModel):
    """
    Successful classification response.

    - **prediction**: The predicted class label (e.g. "Normal", "COVID").
    - **confidence**: Model confidence for the predicted class, in percent (0–100).
    """

    prediction: str = Field(
        ...,
        description="Predicted class label from the classification model.",
        examples=["Normal", "COVID", "Lung_Opacity", "Viral Pneumonia"],
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=100.0,
        description="Confidence score for the prediction, as a percentage (0–100).",
        examples=[96.42],
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {"prediction": "Normal", "confidence": 96.42},
                {"prediction": "COVID", "confidence": 87.15},
                {"prediction": "Lung_Opacity", "confidence": 72.38},
                {"prediction": "Viral Pneumonia", "confidence": 91.03},
            ]
        }
    }


class HealthResponse(BaseModel):
    """Health check response."""

    status: str = Field(..., description="API status.", examples=["healthy"])
    model_loaded: bool = Field(
        ..., description="Whether the classification model is loaded and ready."
    )


class RootResponse(BaseModel):
    """Root endpoint response."""

    message: str


class ErrorResponse(BaseModel):
    """Standard error response."""

    error: str = Field(..., description="Human-readable error description.")
