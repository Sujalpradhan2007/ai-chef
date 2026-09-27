from flask import Blueprint, request, jsonify

from routes.auth import users


users_bp = Blueprint(
    "users",
    __name__
)


@users_bp.route("/", methods=["GET"])
def list_users():

    return jsonify({
        "success": True,
        "users": [
            user.to_dict()
            for user in users.values()
        ]
    })


@users_bp.route("/<user_id>", methods=["GET"])
def get_user(user_id):

    user = users.get(user_id)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    return jsonify({
        "success": True,
        "user": user.to_dict()
    })


@users_bp.route("/<user_id>", methods=["PUT"])
def update_user(user_id):

    user = users.get(user_id)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    data = request.get_json() or {}

    if "name" in data:
        user.name = data["name"].strip()

    if "mobile" in data:
        user.mobile = data["mobile"].strip()

    return jsonify({
        "success": True,
        "message": "User updated successfully.",
        "user": user.to_dict()
    })


@users_bp.route("/<user_id>/block", methods=["POST"])
def block_user(user_id):

    user = users.get(user_id)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    user.status = "blocked"

    return jsonify({
        "success": True,
        "message": "User blocked successfully."
    })


@users_bp.route("/<user_id>/unblock", methods=["POST"])
def unblock_user(user_id):

    user = users.get(user_id)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    user.status = "active"

    return jsonify({
        "success": True,
        "message": "User unblocked successfully."
    })


@users_bp.route("/<user_id>/favorites", methods=["GET"])
def get_favorites(user_id):

    user = users.get(user_id)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    return jsonify({
        "success": True,
        "favorites": user.favorite_recipe_ids
    })


@users_bp.route("/<user_id>/favorites", methods=["POST"])
def add_favorite(user_id):

    user = users.get(user_id)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    data = request.get_json() or {}

    recipe_id = data.get("recipe_id")

    if not recipe_id:
        return jsonify({
            "success": False,
            "message": "Recipe ID is required."
        }), 400

    if recipe_id not in user.favorite_recipe_ids:
        user.favorite_recipe_ids.append(recipe_id)

    return jsonify({
        "success": True,
        "favorites": user.favorite_recipe_ids
    })


@users_bp.route("/<user_id>/favorites/<recipe_id>", methods=["DELETE"])
def remove_favorite(user_id, recipe_id):

    user = users.get(user_id)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    if recipe_id in user.favorite_recipe_ids:
        user.favorite_recipe_ids.remove(recipe_id)

    return jsonify({
        "success": True,
        "favorites": user.favorite_recipe_ids
    })