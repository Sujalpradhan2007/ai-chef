# ============================================================
# AI COOKING ASSISTANT
# BACKEND APPLICATION
# ============================================================

import os
from pathlib import Path

from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv


# ------------------------------------------------------------
# LOAD ENVIRONMENT VARIABLES
# ------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent

load_dotenv(PROJECT_DIR / ".env")


# ------------------------------------------------------------
# APPLICATION CONFIGURATION
# ------------------------------------------------------------

APP_NAME = os.getenv("APP_NAME", "AI Cooking Assistant")
DEBUG = os.getenv("DEBUG", "false").lower() == "true"
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "5000"))

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://127.0.0.1:5500"
)

UPLOAD_FOLDER = os.getenv(
    "UPLOAD_FOLDER",
    "backend/uploads"
)

MAX_IMAGE_SIZE_MB = int(
    os.getenv("MAX_IMAGE_SIZE_MB", "5")
)

MAX_VIDEO_SIZE_MB = int(
    os.getenv("MAX_VIDEO_SIZE_MB", "50")
)


# ------------------------------------------------------------
# CREATE FLASK APPLICATION
# ------------------------------------------------------------

app = Flask(__name__)


# ------------------------------------------------------------
# FLASK CONFIGURATION
# ------------------------------------------------------------

app.config["SECRET_KEY"] = os.getenv(
    "SECRET_KEY",
    "development-secret-key"
)

app.config["MAX_CONTENT_LENGTH"] = (
    MAX_VIDEO_SIZE_MB * 1024 * 1024
)

app.config["UPLOAD_FOLDER"] = str(
    PROJECT_DIR / UPLOAD_FOLDER
)

app.config["MAX_IMAGE_SIZE_MB"] = MAX_IMAGE_SIZE_MB
app.config["MAX_VIDEO_SIZE_MB"] = MAX_VIDEO_SIZE_MB


# ------------------------------------------------------------
# CREATE UPLOAD DIRECTORIES
# ------------------------------------------------------------

upload_path = Path(app.config["UPLOAD_FOLDER"])

(upload_path / "recipes").mkdir(
    parents=True,
    exist_ok=True
)

(upload_path / "users").mkdir(
    parents=True,
    exist_ok=True
)

(upload_path / "videos").mkdir(
    parents=True,
    exist_ok=True
)


# ------------------------------------------------------------
# CORS CONFIGURATION
# ------------------------------------------------------------

cors_origins = os.getenv(
    "CORS_ORIGINS",
    FRONTEND_URL
)

if cors_origins:
    cors_origins = [
        origin.strip()
        for origin in cors_origins.split(",")
        if origin.strip()
    ]
else:
    cors_origins = "*"


CORS(
    app,
    resources={
        r"/api/*": {
            "origins": cors_origins
        }
    },
    supports_credentials=True
)


# ------------------------------------------------------------
# BASIC API INFORMATION
# ------------------------------------------------------------

@app.route("/")
def home():
    return jsonify({
        "success": True,
        "message": "AI Cooking Assistant Backend is running.",
        "application": APP_NAME,
        "environment": os.getenv(
            "APP_ENV",
            "development"
        ),
        "version": "1.0.0"
    })


# ------------------------------------------------------------
# HEALTH CHECK
# ------------------------------------------------------------

@app.route("/api/health")
def health_check():
    return jsonify({
        "success": True,
        "status": "healthy",
        "message": "Backend server is working."
    })


# ------------------------------------------------------------
# API INFORMATION
# ------------------------------------------------------------

@app.route("/api")
def api_information():
    return jsonify({
        "success": True,
        "application": APP_NAME,
        "message": "AI Cooking Assistant API",
        "endpoints": {
            "health": "/api/health",
            "auth": "/api/auth",
            "users": "/api/users",
            "recipes": "/api/recipes",
            "ai": "/api/ai",
            "uploads": "/api/uploads",
            "submissions": "/api/submissions"
        }
    })


# ------------------------------------------------------------
# ERROR HANDLERS
# ------------------------------------------------------------

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "error": "Endpoint not found",
        "message": "The requested API endpoint does not exist."
    }), 404


@app.errorhandler(400)
def bad_request(error):
    return jsonify({
        "success": False,
        "error": "Bad request",
        "message": "The request data is invalid."
    }), 400


@app.errorhandler(401)
def unauthorized(error):
    return jsonify({
        "success": False,
        "error": "Unauthorized",
        "message": "Authentication is required."
    }), 401


@app.errorhandler(403)
def forbidden(error):
    return jsonify({
        "success": False,
        "error": "Forbidden",
        "message": "You do not have permission to perform this action."
    }), 403


@app.errorhandler(404)
def handle_404(error):
    return jsonify({
        "success": False,
        "error": "Not Found",
        "message": "The requested resource was not found."
    }), 404


@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        "success": False,
        "error": "Method Not Allowed",
        "message": "This HTTP method is not allowed for this endpoint."
    }), 405


@app.errorhandler(413)
def request_too_large(error):
    return jsonify({
        "success": False,
        "error": "File too large",
        "message": (
            f"Maximum upload size is "
            f"{MAX_VIDEO_SIZE_MB} MB."
        )
    }), 413


@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({
        "success": False,
        "error": "Internal Server Error",
        "message": "Something went wrong on the server."
    }), 500


# ------------------------------------------------------------
# DATABASE CONNECTION TEST
# ------------------------------------------------------------

@app.route("/api/database-status")
def database_status():

    database_url = os.getenv(
        "DATABASE_URL",
        ""
    )

    if not database_url:
        return jsonify({
            "success": False,
            "database": "not configured",
            "message": (
                "DATABASE_URL is missing from the .env file."
            )
        }), 503

    return jsonify({
        "success": True,
        "database": "configured",
        "message": (
            "Database configuration was found."
        )
    })


# ------------------------------------------------------------
# REGISTER API ROUTES
# ------------------------------------------------------------

def register_routes():
    """
    Import and register application routes.

    Route modules are imported inside this function
    so the Flask application can start cleanly even
    while individual route files are being developed.
    """

    try:

        from routes.auth import auth_bp
        app.register_blueprint(
            auth_bp,
            url_prefix="/api/auth"
        )

    except ImportError as error:
        print(
            f"[WARNING] Auth routes not available yet: {error}"
        )

    try:

        from routes.users import users_bp
        app.register_blueprint(
            users_bp,
            url_prefix="/api/users"
        )

    except ImportError as error:
        print(
            f"[WARNING] User routes not available yet: {error}"
        )

    try:

        from routes.recipes import recipes_bp
        app.register_blueprint(
            recipes_bp,
            url_prefix="/api/recipes"
        )

    except ImportError as error:
        print(
            f"[WARNING] Recipe routes not available yet: {error}"
        )

    try:

        from routes.ai import ai_bp
        app.register_blueprint(
            ai_bp,
            url_prefix="/api/ai"
        )

    except ImportError as error:
        print(
            f"[WARNING] AI routes not available yet: {error}"
        )

    try:

        from routes.uploads import uploads_bp
        app.register_blueprint(
            uploads_bp,
            url_prefix="/api/uploads"
        )

    except ImportError as error:
        print(
            f"[WARNING] Upload routes not available yet: {error}"
        )

    try:

        from routes.submissions import submissions_bp
        app.register_blueprint(
            submissions_bp,
            url_prefix="/api/submissions"
        )

    except ImportError as error:
        print(
            f"[WARNING] Submission routes not available yet: {error}"
        )


# ------------------------------------------------------------
# REGISTER ROUTES
# ------------------------------------------------------------

register_routes()


# ------------------------------------------------------------
# START SERVER
# ------------------------------------------------------------

if __name__ == "__main__":

    print("")
    print("=" * 60)
    print("       AI COOKING ASSISTANT BACKEND")
    print("=" * 60)
    print("")
    print(f"Application : {APP_NAME}")
    print(f"Environment : {os.getenv('APP_ENV', 'development')}")
    print(f"Host        : {HOST}")
    print(f"Port        : {PORT}")
    print("")
    print(
        f"Server URL  : http://{HOST}:{PORT}"
    )
    print(
        f"Health URL  : http://{HOST}:{PORT}/api/health"
    )
    print("")
    print("=" * 60)
    print("Server starting...")
    print("=" * 60)
    print("")

    app.run(
        host=HOST,
        port=PORT,
        debug=DEBUG
    )