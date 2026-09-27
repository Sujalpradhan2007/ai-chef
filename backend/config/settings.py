import os
from pathlib import Path
from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR.parent / ".env")


class Config:

    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "change-this-secret-key-in-production"
    )

    HOST = os.getenv(
        "HOST",
        "127.0.0.1"
    )

    PORT = int(
        os.getenv(
            "PORT",
            "5000"
        )
    )

    DEBUG = os.getenv(
        "DEBUG",
        "True"
    ).lower() == "true"

    MAX_CONTENT_LENGTH = 50 * 1024 * 1024

    UPLOAD_FOLDER = str(
        BASE_DIR / "uploads"
    )

    ALLOWED_IMAGE_EXTENSIONS = {
        "png",
        "jpg",
        "jpeg",
        "webp"
    }

    ALLOWED_VIDEO_EXTENSIONS = {
        "mp4",
        "webm",
        "mov",
        "avi"
    }

    AI_API_KEY = os.getenv(
        "AI_API_KEY",
        ""
    )

    AI_API_URL = os.getenv(
        "AI_API_URL",
        ""
    )

    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "sqlite:///ai_cooking.db"
    )