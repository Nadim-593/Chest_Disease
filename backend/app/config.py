"""
Configuration — reads all settings from environment / .env file.
"""

from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings.  All values can be overridden via environment
    variables or the .env file in the project root.
    """

    # ------------------------------------------------------------------ #
    # Model
    # ------------------------------------------------------------------ #
    MODEL_PATH: str = "app/model/chest_xray_model.keras"

    IMAGE_WIDTH: int = 224
    IMAGE_HEIGHT: int = 224

    # Comma-separated class names — must match the training order exactly.
    # Training used: ["Normal", "COVID", "Lung_Opacity", "Viral Pneumonia"]
    # flow_from_dataframe sorts alphabetically, so real order is:
    #   0=COVID, 1=Lung_Opacity, 2=Normal, 3=Viral Pneumonia
    # Update this after verifying with your trained model.
    CLASS_NAMES: str = "COVID,Lung_Opacity,Normal,Viral Pneumonia"

    # ------------------------------------------------------------------ #
    # CORS
    # ------------------------------------------------------------------ #
    FRONTEND_URL: str = "http://localhost:3000"

    # ------------------------------------------------------------------ #
    # Upload limits
    # ------------------------------------------------------------------ #
    MAX_UPLOAD_SIZE_MB: int = 10

    # ------------------------------------------------------------------ #
    # Internal — derived
    # ------------------------------------------------------------------ #
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def IMAGE_SIZE(self) -> tuple[int, int]:
        return (self.IMAGE_WIDTH, self.IMAGE_HEIGHT)

    @property
    def CLASS_NAMES_LIST(self) -> List[str]:
        return [c.strip() for c in self.CLASS_NAMES.split(",")]

    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        return [self.FRONTEND_URL.rstrip("/")]

    @property
    def MAX_UPLOAD_SIZE_BYTES(self) -> int:
        return self.MAX_UPLOAD_SIZE_MB * 1024 * 1024


@lru_cache
def get_settings() -> Settings:
    return Settings()


# Module-level singleton
settings = get_settings()
