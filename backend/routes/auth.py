from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

from models.user import User


auth_bp = Blueprint(
    "auth",
    __name__
)


users = {}


def find_user_by_mobile(mobile):

    for user in users.values():

        if user.mobile == mobile:
            return user

    return None


@auth_bp.route("/signup", methods=["POST"])
def signup():

    data = request.get_json() or {}

    name = data.get("name", "").strip()
    mobile = data.get("mobile", "").strip()
    password = data.get("password", "").strip()

    if not name:
        return jsonify({
            "success": False,
            "message": "Name is required."
        }), 400

    if not mobile:
        return jsonify({
            "success": False,
            "message": "Mobile number is required."
        }), 400

    if not password:
        return jsonify({
            "success": False,
            "message": "Password is required."
        }), 400

    existing_user = find_user_by_mobile(mobile)

    if existing_user:
        return jsonify({
            "success": False,
            "message": "Mobile number is already registered."
        }), 409

    user = User(
        name=name,
        mobile=mobile,
        password_hash=generate_password_hash(password)
    )

    users[user.id] = user

    return jsonify({
        "success": True,
        "message": "Account created successfully.",
        "user": user.to_dict()
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json() or {}

    mobile = data.get("mobile", "").strip()
    password = data.get("password", "").strip()

    user = find_user_by_mobile(mobile)

    if not user:
        return jsonify({
            "success": False,
            "message": "Invalid mobile number or password."
        }), 401

    if user.status != "active":
        return jsonify({
            "success": False,
            "message": "This account is blocked."
        }), 403

    if not check_password_hash(
        user.password_hash,
        password
    ):
        return jsonify({
            "success": False,
            "message": "Invalid mobile number or password."
        }), 401

    from datetime import datetime

    user.last_login = datetime.utcnow().isoformat()

    return jsonify({
        "success": True,
        "message": "Login successful.",
        "user": user.to_dict()
    })


@auth_bp.route("/users", methods=["GET"])
def get_users():

    return jsonify({
        "success": True,
        "users": [
            user.to_dict()
            for user in users.values()
        ]
    })


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():

    data = request.get_json() or {}

    mobile = data.get("mobile", "").strip()

    user = find_user_by_mobile(mobile)

    if not user:
        return jsonify({
            "success": False,
            "message": "Mobile number not found."
        }), 404

    return jsonify({
        "success": True,
        "message": "OTP request accepted. Real SMS OTP will be connected later."
    })


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():

    data = request.get_json() or {}

    mobile = data.get("mobile", "").strip()
    new_password = data.get("new_password", "").strip()

    if not mobile or not new_password:
        return jsonify({
            "success": False,
            "message": "Mobile and new password are required."
        }), 400

    user = find_user_by_mobile(mobile)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    user.password_hash = generate_password_hash(
        new_password
    )

    return jsonify({
        "success": True,
        "message": "Password reset successfully."
    })