"""
Image preprocessing pipeline for chest X-ray classification.

IMPORTANT — match this EXACTLY to what was used during training:
  - Input size : 224 × 224
  - Color mode : RGB (3 channels)
  - Normalization: divide by 255.0  (rescale=1./255)

If you change the model, update this file to match the new training config.
"""

import logging
from io import BytesIO
from typing import TYPE_CHECKING

import numpy as np
from PIL import Image, UnidentifiedImageError

if TYPE_CHECKING:
    from app.config import Settings

logger = logging.getLogger("xrayai.preprocessing")

# Allowed MIME types / file extensions
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/jpg", "image/png"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}


def validate_image_bytes(data: bytes, filename: str, max_bytes: int) -> None:
    """
    Basic validation before we attempt to open the image.

    Raises:
        ValueError  — business-rule violations (bad type, too large)
        IOError     — cannot read/decode the image
    """
    if not data:
        raise ValueError("Uploaded file is empty.")

    if len(data) > max_bytes:
        max_mb = max_bytes / (1024 * 1024)
        raise ValueError(f"File size exceeds the {max_mb:.0f} MB limit.")

    ext = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(
            f"Unsupported file extension '{ext}'. "
            f"Accepted formats: {', '.join(sorted(ALLOWED_EXTENSIONS))}."
        )


def preprocess_image(image_bytes: bytes, settings: "Settings") -> np.ndarray:
    """
    Full preprocessing pipeline.

    Steps:
        1. Open image with Pillow (validates it is a real image)
        2. Convert to RGB — handles grayscale, RGBA, CMYK, etc.
        3. Resize to configured IMAGE_WIDTH × IMAGE_HEIGHT
        4. Convert to float32 NumPy array
        5. Normalize: divide by 255.0  (matches training rescale=1./255)
        6. Add batch dimension → shape (1, H, W, 3)

    Returns:
        np.ndarray of shape (1, IMAGE_HEIGHT, IMAGE_WIDTH, 3), dtype float32
    """
    target_size = (settings.IMAGE_WIDTH, settings.IMAGE_HEIGHT)  # (W, H) for Pillow

    try:
        img = Image.open(BytesIO(image_bytes))
        img.verify()  # Detect truncated / corrupted files
    except UnidentifiedImageError:
        raise ValueError("Cannot identify image file. The file may be corrupted or not a valid image.")
    except Exception:
        raise ValueError("The uploaded file could not be opened as an image.")

    # Re-open after verify() (verify() seeks to end and closes internal state)
    try:
        img = Image.open(BytesIO(image_bytes))
    except Exception:
        raise ValueError("Failed to reload image after validation.")

    # --- Step 2: Convert to RGB ---
    # DenseNet121 was trained on 3-channel RGB images.
    if img.mode != "RGB":
        logger.debug("Converting image from mode '%s' to RGB.", img.mode)
        img = img.convert("RGB")

    # --- Step 3: Resize ---
    img = img.resize(target_size, Image.LANCZOS)

    # --- Step 4: To NumPy float32 ---
    img_array = np.array(img, dtype=np.float32)  # shape: (H, W, 3)

    # --- Step 5: Normalize (matches training: rescale=1./255) ---
    img_array = img_array / 255.0

    # --- Step 6: Add batch dimension ---
    img_array = np.expand_dims(img_array, axis=0)  # shape: (1, H, W, 3)

    logger.debug(
        "Preprocessing complete. Shape: %s, min=%.4f, max=%.4f",
        img_array.shape, img_array.min(), img_array.max(),
    )

    return img_array
