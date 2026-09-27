from flask import Blueprint, request, jsonify

from models.submission import RecipeSubmission
from routes.auth import users
from routes.recipes import recipes
from models.recipe import Recipe


submissions_bp = Blueprint(
    "submissions",
    __name__
)


submissions = {}


@submissions_bp.route("/", methods=["POST"])
def submit_recipe():

    data = request.get_json() or {}

    user_id = data.get(
        "user_id"
    )

    recipe_data = data.get(
        "recipe",
        {}
    )

    if not user_id:

        return jsonify({
            "success": False,
            "message": "User ID is required."
        }), 400

    if user_id not in users:

        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    if not recipe_data.get("name"):

        return jsonify({
            "success": False,
            "message": "Recipe name is required."
        }), 400

    submission = RecipeSubmission(
        user_id=user_id,
        recipe_data=recipe_data
    )

    submissions[submission.id] = submission

    users[user_id].submitted_recipe_count += 1

    return jsonify({
        "success": True,
        "message": (
            "Recipe submitted successfully. "
            "It is waiting for admin approval."
        ),
        "submission": submission.to_dict()
    }), 201


@submissions_bp.route("/", methods=["GET"])
def get_submissions():

    status = request.args.get(
        "status"
    )

    result = []

    for submission in submissions.values():

        if status and submission.status != status:
            continue

        result.append(
            submission.to_dict()
        )

    return jsonify({
        "success": True,
        "count": len(result),
        "submissions": result
    })


@submissions_bp.route("/<submission_id>", methods=["GET"])
def get_submission(submission_id):

    submission = submissions.get(
        submission_id
    )

    if not submission:

        return jsonify({
            "success": False,
            "message": "Submission not found."
        }), 404

    return jsonify({
        "success": True,
        "submission": submission.to_dict()
    })


@submissions_bp.route(
    "/<submission_id>/approve",
    methods=["POST"]
)
def approve_submission(submission_id):

    submission = submissions.get(
        submission_id
    )

    if not submission:

        return jsonify({
            "success": False,
            "message": "Submission not found."
        }), 404

    data = request.get_json() or {}

    admin_id = data.get(
        "admin_id",
        "admin"
    )

    note = data.get(
        "note",
        ""
    )

    submission.approve(
        admin_id,
        note
    )

    recipe_data = submission.recipe_data

    recipe = Recipe(
        name=recipe_data.get("name", ""),
        state=recipe_data.get("state", ""),
        district=recipe_data.get("district", ""),
        cuisine=recipe_data.get("cuisine", ""),
        category=recipe_data.get("category", ""),
        ingredients=recipe_data.get("ingredients", []),
        steps=recipe_data.get("steps", []),
        description=recipe_data.get("description", ""),
        prep_time=recipe_data.get("prep_time", 0),
        cook_time=recipe_data.get("cook_time", 0),
        servings=recipe_data.get("servings", 1),
        difficulty=recipe_data.get(
            "difficulty",
            "Easy"
        ),
        photo=recipe_data.get(
            "photo",
            ""
        ),
        video=recipe_data.get(
            "video",
            ""
        ),
        is_famous=recipe_data.get(
            "is_famous",
            False
        ),
        is_approved=True
    )

    recipes[recipe.id] = recipe

    return jsonify({
        "success": True,
        "message": "Recipe approved and published.",
        "recipe": recipe.to_dict(),
        "submission": submission.to_dict()
    })


@submissions_bp.route(
    "/<submission_id>/reject",
    methods=["POST"]
)
def reject_submission(submission_id):

    submission = submissions.get(
        submission_id
    )

    if not submission:

        return jsonify({
            "success": False,
            "message": "Submission not found."
        }), 404

    data = request.get_json() or {}

    admin_id = data.get(
        "admin_id",
        "admin"
    )

    note = data.get(
        "note",
        "Recipe submission rejected."
    )

    submission.reject(
        admin_id,
        note
    )

    return jsonify({
        "success": True,
        "message": "Recipe submission rejected.",
        "submission": submission.to_dict()
    })