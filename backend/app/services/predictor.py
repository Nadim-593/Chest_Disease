"""
Prediction service.

Responsibilities:
    - Load the Keras model exactly once at startup.
    - Accept a preprocessed NumPy tensor and run inference.
    - Interpret the softmax output (argmax + confidence).
    - Return a structured PredictionResult dict.

Output format (softmax, 4 classes):
    {
        "prediction": "Normal",
        "confidence": 96.42
    }

IMPORTANT: Do NOT retrain or modify the model.
"""

import logging
from pathlib import Path
from typing import TYPE_CHECKING

import numpy as np

if TYPE_CHECKING:
    from app.config import Settings

logger = logging.getLogger("xrayai.predictor")


class PredictorService:
    """
    Singleton-style service that loads the Keras model and performs inference.

    Usage:
        service = PredictorService(settings)
        service.load()                       # call once at startup
        result = service.predict(img_array)  # call per request
    """

    def __init__(self, settings: "Settings") -> None:
        self._settings = settings
        self._model = None
        self._loaded = False

    # ------------------------------------------------------------------
    # Startup
    # ------------------------------------------------------------------

    def load(self) -> None:
        """Load the Keras model from disk. Called once during app startup."""
        # Lazy import — keeps startup fast and avoids importing TF at module level
        import tensorflow as tf  # noqa: F401
        from tensorflow import keras

        model_path = Path(self._settings.MODEL_PATH)
        if not model_path.exists():
            raise FileNotFoundError(
                f"Model file not found at '{model_path}'. "
                "Please place 'chest_xray_model.keras' in 'app/model/'."
            )

        logger.info("Loading model from '%s' ...", model_path)
        try:
            self._model = keras.models.load_model(str(model_path), compile=False)
            self._loaded = True
            logger.info(
                "Model loaded successfully. Output shape: %s",
                self._model.output_shape,
            )
            # Log class count sanity check
            num_outputs = self._model.output_shape[-1]
            num_classes = len(self._settings.CLASS_NAMES_LIST)
            if num_outputs != num_classes:
                logger.warning(
                    "Model output size (%d) does not match CLASS_NAMES count (%d). "
                    "Please update CLASS_NAMES in .env.",
                    num_outputs, num_classes,
                )
        except Exception as exc:
            logger.error("Failed to load model: %s", exc)
            raise RuntimeError(f"Model loading failed: {exc}") from exc

    # ------------------------------------------------------------------
    # Properties
    # ------------------------------------------------------------------

    @property
    def is_loaded(self) -> bool:
        return self._loaded and self._model is not None

    # ------------------------------------------------------------------
    # Inference
    # ------------------------------------------------------------------

    def predict(self, img_array: np.ndarray) -> dict:
        """
        Run inference on a preprocessed image tensor.

        Args:
            img_array: float32 NumPy array of shape (1, H, W, 3), values in [0, 1].

        Returns:
            dict with keys "prediction" (str) and "confidence" (float, 0–100).

        Raises:
            RuntimeError: if model is not loaded or inference fails.
        """
        if not self.is_loaded:
            raise RuntimeError("Model is not loaded. Cannot perform inference.")

        logger.info("Running inference on image of shape %s.", img_array.shape)

        try:
            # --- Forward pass ---
            raw_output = self._model.predict(img_array, verbose=0)
            # raw_output shape: (1, num_classes) — softmax probabilities

            # --- Interpret softmax output ---
            probs = raw_output[0]  # shape: (num_classes,)

            predicted_idx = int(np.argmax(probs))
            confidence_raw = float(probs[predicted_idx])

            class_names = self._settings.CLASS_NAMES_LIST

            # Guard against index out of range
            if predicted_idx >= len(class_names):
                raise ValueError(
                    f"Model predicted class index {predicted_idx} but only "
                    f"{len(class_names)} class names are configured."
                )

            predicted_class = class_names[predicted_idx]
            confidence_pct = round(confidence_raw * 100, 2)

            logger.info(
                "Prediction: '%s' | Confidence: %.2f%% | All probs: %s",
                predicted_class,
                confidence_pct,
                {class_names[i]: round(float(probs[i]) * 100, 2) for i in range(len(class_names))},
            )

            return {
                "prediction": predicted_class,
                "confidence": confidence_pct,
            }

        except Exception as exc:
            logger.error("Inference error: %s", exc, exc_info=True)
            raise RuntimeError("Prediction failed during model inference.") from exc
