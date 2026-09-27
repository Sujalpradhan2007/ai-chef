from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from pathlib import Path
import uuid


uploads_bp = Blueprint(
    "uploads",
    __name__
)


def allowed_file(filename, allowed_extensions):

    if "." not in filename:
        return False

    extension = filename.rsplit(
        ".",
        1
    )[1].lower()

    return extension in allowed_extensions


def save_uploaded_file(
    file,
    folder_name,
    allowed_extensions
):

    if not file or not file.filename:

        return None

    if not allowed_file(
        file.filename,
        allowed_extensions
    ):

        return None

    upload_root = Path(
        current_app.config["UPLOAD_FOLDER"]
    )

    folder = upload_root / folder_name

    folder.mkdir(
        parents=True,
        exist_ok=True
    )

    original_name = secure_filename(
        file.filename
    )

    extension = original_name.rsplit(
        ".",
        1
    )[1].lower()

    new_name = (
        f"{uuid.uuid4().hex}."
        f"{extension}"
    )

    file_path = folder / new_name

    file.save(file_path)

    return f"/uploads/{folder_name}/{new_name}"


@uploads_bp.route("/image", methods=["POST"])
def upload_image():

    if "file" not in request.files:

        return jsonify({
            "success": False,
            "message": "No image file provided."
        }), 400

    file = request.files["file"]

    path = save_uploaded_file(
        file,
        "images",
        current_app.config[
            "ALLOWED_IMAGE_EXTENSIONS"
        ]
    )

    if not path:

        return jsonify({
            "success": False,
            "message": "Invalid image file."
        }), 400

    return jsonify({
        "success": True,
        "message": "Image uploaded successfully.",
        "url": path
    })


@uploads_bp.route("/video", methods=["POST"])
def upload_video():

    if "file" not in request.files:

        return jsonify({
            "success": False,
            "message": "No video file provided."
        }), 400

    file = request.files["file"]

    path = save_uploaded_file(
        file,
        "videos",
        current_app.config[
            "ALLOWED_VIDEO_EXTENSIONS"
        ]
    )

    if not path:

        return jsonify({
            "success": False,
            "message": "Invalid video file."
        }), 400

    return jsonify({
        "success": True,
        "message": "Video uploaded successfully.",
        "url": path
    })