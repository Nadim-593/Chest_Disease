"""
API routes.

Endpoints:
    GET  /          — Root / welcome message
    GET  /health    — Health check with model status
    POST /predict   — Chest X-ray classification
"""

import logging

from fastapi import APIRouter, HTTPException, Request, UploadFile, File, status
from fastapi.responses import JSONResponse

from app.api.schemas import (
    ErrorResponse,
    HealthResponse,
    PredictionResponse,
    RootResponse,
)
from app.config import settings
from app.utils.preprocessing import (
    ALLOWED_EXTENSIONS,
    preprocess_image,
    validate_image_bytes,
)

logger = logging.getLogger("xrayai.routes")

router = APIRouter()


# ---------------------------------------------------------------------------
# GET /
# ---------------------------------------------------------------------------
@router.get(
    "/",
    response_model=RootResponse,
    summary="Root",
    description="Welcome message and API status.",
    tags=["Health"],
)
async def root():
    return {"message": "Chest X-Ray Classification API is running"}


# ---------------------------------------------------------------------------
# GET /health
# ---------------------------------------------------------------------------
@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health Check",
    description="Returns API health status and whether the model is loaded.",
    tags=["Health"],
)
async def health(request: Request):
    predictor = getattr(request.app.state, "predictor", None)
    model_loaded = predictor is not None and predictor.is_loaded
    return {"status": "healthy", "model_loaded": model_loaded}


# ---------------------------------------------------------------------------
# POST /predict
# ---------------------------------------------------------------------------
@router.post(
    "/predict",
    response_model=PredictionResponse,
    summary="Classify Chest X-Ray",
    description=(
        "Upload a chest X-ray image (JPG, JPEG, or PNG) and receive an "
        "AI-generated classification result.\n\n"
        "**Disclaimer:** This endpoint is for **research purposes only** and "
        "must not be used for clinical diagnosis or medical decision-making."
    ),
    responses={
        200: {"model": PredictionResponse, "description": "Classification result."},
        400: {"model": ErrorResponse, "description": "Invalid or missing file."},
        415: {"model": ErrorResponse, "description": "Unsupported file type."},
        503: {"model": ErrorResponse, "description": "Model not ready."},
        500: {"model": ErrorResponse, "description": "Internal server error."},
    },
    tags=["Prediction"],
)
async def predict(
    request: Request,
    file: UploadFile = File(
        ...,
        description="Chest X-ray image file (JPG, JPEG, or PNG, max 10 MB).",
    ),
):
    # ------------------------------------------------------------------ #
    # 1. Check model is loaded
    # ------------------------------------------------------------------ #
    predictor = getattr(request.app.state, "predictor", None)
    if predictor is None or not predictor.is_loaded:
        logger.error("Predict called but model is not loaded.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"error": "The classification model is not available. Please try again later."},
        )

    # ------------------------------------------------------------------ #
    # 2. Check file was provided
    # ------------------------------------------------------------------ #
    if file is None or file.filename == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "No file was provided. Please upload a chest X-ray image."},
        )

    # ------------------------------------------------------------------ #
    # 3. Check content-type header (quick pre-validation)
    # ------------------------------------------------------------------ #
    content_type = (file.content_type or "").lower()
    filename = file.filename or ""
    ext = ("." + filename.rsplit(".", 1)[-1].lower()) if "." in filename else ""

    if ext not in ALLOWED_EXTENSIONS:
        logger.warning(
            "Rejected upload — unsupported extension '%s' (file: %s).", ext, filename
        )
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail={
                "error": (
                    f"Unsupported file type '{ext}'. "
                    f"Please upload a JPG, JPEG, or PNG image."
                )
            },
        )

    # ------------------------------------------------------------------ #
    # 4. Read file bytes
    # ------------------------------------------------------------------ #
    try:
        image_bytes = await file.read()
    except Exception as exc:
        logger.error("Failed to read uploaded file: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "Failed to read the uploaded file. Please try again."},
        )

    # ------------------------------------------------------------------ #
    # 5. Validate (size, extension, non-empty)
    # ------------------------------------------------------------------ #
    try:
        validate_image_bytes(image_bytes, filename, settings.MAX_UPLOAD_SIZE_BYTES)
    except ValueError as exc:
        logger.warning("Image validation failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": str(exc)},
        )

    # ------------------------------------------------------------------ #
    # 6. Preprocess
    # ------------------------------------------------------------------ #
    try:
        img_array = preprocess_image(image_bytes, settings)
    except ValueError as exc:
        logger.warning("Preprocessing failed for '%s': %s", filename, exc)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": str(exc)},
        )
    except Exception as exc:
        logger.error("Unexpected preprocessing error: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Failed to process the uploaded image."},
        )

    # ------------------------------------------------------------------ #
    # 7. Run inference
    # ------------------------------------------------------------------ #
    try:
        result = predictor.predict(img_array)
    except RuntimeError as exc:
        logger.error("Prediction failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "The AI model encountered an error during analysis. Please try again."},
        )

    logger.info(
        "Request completed | file='%s' | prediction='%s' | confidence=%.2f%%",
        filename,
        result["prediction"],
        result["confidence"],
    )

    return PredictionResponse(**result)
