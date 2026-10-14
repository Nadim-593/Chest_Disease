"""
XRayAI Backend — Chest X-Ray Classification API
================================================
FastAPI application entry point.

This API provides AI-assisted chest X-ray classification for research
and academic purposes. It is NOT intended for clinical diagnosis.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.services.predictor import PredictorService
from app.api.routes import router

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("xrayai")

# ---------------------------------------------------------------------------
# Application state — holds singleton predictor
# ---------------------------------------------------------------------------
predictor: PredictorService | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the model once at startup; release on shutdown."""
    global predictor
    logger.info("=== XRayAI API starting up ===")
    logger.info("Model path : %s", settings.MODEL_PATH)
    logger.info("Image size : %dx%d", settings.IMAGE_WIDTH, settings.IMAGE_HEIGHT)
    logger.info("Classes    : %s", settings.CLASS_NAMES)

    predictor = PredictorService(settings)
    predictor.load()

    # Attach to app state so routes can access it
    app.state.predictor = predictor
    logger.info("=== Startup complete. Model ready. ===")

    yield  # — application is running —

    logger.info("=== XRayAI API shutting down ===")


# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------
app = FastAPI(
    title="XRayAI — Chest X-Ray Classification API",
    description=(
        "## AI-Assisted Chest X-Ray Classification\n\n"
        "This API provides AI-assisted image classification for **research purposes only** "
        "and is **not intended to provide medical diagnosis or clinical decision-making**.\n\n"
        "### Model\n"
        "- Architecture: DenseNet121 (Transfer Learning)\n"
        "- Task: Multi-class classification (softmax output)\n"
        "- Input: RGB chest X-ray image (224×224)\n\n"
        "### Disclaimer\n"
        "> ⚠️ **Research prototype only.** Predictions must not be used as a substitute "
        "for professional medical evaluation."
    ),
    version="1.0.0",
    contact={
        "name": "XRayAI Research Project",
    },
    license_info={
        "name": "Academic / Research Use Only",
    },
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Accept"],
)

# ---------------------------------------------------------------------------
# Global exception handler — never expose internal traces
# ---------------------------------------------------------------------------
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception on %s: %s", request.url.path, exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "An unexpected server error occurred. Please try again."},
    )


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
app.include_router(router)
