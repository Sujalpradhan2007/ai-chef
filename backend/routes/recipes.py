import json
from pathlib import Path
from flask import Blueprint, request, jsonify
from models.recipe import Recipe
recipes_bp = Blueprint(
    "recipes",
    __name__
)


recipes = {}


def load_catalog_recipes():
    catalog_path = Path(__file__).resolve().parents[2] / "data" / "recipes.json"
    try:
        catalog = json.loads(catalog_path.read_text(encoding="utf-8")).get("recipes", [])
    except (OSError, json.JSONDecodeError) as error:
        print(f"[WARNING] Recipe catalog could not be loaded: {error}")
        catalog = []

    for item in catalog:
        recipe = Recipe(
            name=item.get("name", "Untitled Recipe"),
            state=item.get("state", ""),
            district=item.get("district", ""),
            cuisine=item.get("cuisine", ""),
            category=item.get("category", ""),
            description=item.get("description", ""),
            prep_time=item.get("prepTime", 0),
            cook_time=item.get("cookTime", 0),
            servings=item.get("servings", 1),
            difficulty=item.get("difficulty", "Easy"),
            is_famous=item.get("famous", False),
            is_approved=True
        )
        recipe.id = item.get("id", recipe.id)
        recipes[recipe.id] = recipe

def create_demo_recipes():

    demo_recipes = [

        Recipe(
            name="Dalma",
            state="Odisha",
            district="Puri",
            cuisine="Odia",
            category="Main Course",
            ingredients=[
                {
                    "name": "Toor Dal",
                    "quantity": "1 cup"
                },
                {
                    "name": "Raw Papaya",
                    "quantity": "1 cup"
                },
                {
                    "name": "Potato",
                    "quantity": "1"
                }
            ],
            steps=[
                "Wash and soak the dal.",
                "Cook dal and vegetables together.",
                "Prepare tempering.",
                "Mix everything and serve hot."
            ],
            description="Traditional Odia dal and vegetable preparation.",
            prep_time=15,
            cook_time=30,
            servings=4,
            difficulty="Easy",
            is_famous=True
        ),

        Recipe(
            name="Pakhala Bhata",
            state="Odisha",
            district="Puri",
            cuisine="Odia",
            category="Traditional",
            ingredients=[
                {
                    "name": "Cooked Rice",
                    "quantity": "2 cups"
                },
                {
                    "name": "Water",
                    "quantity": "3 cups"
                },
                {
                    "name": "Curd",
                    "quantity": "1/2 cup"
                }
            ],
            steps=[
                "Add water to cooked rice.",
                "Add curd.",
                "Mix well.",
                "Serve chilled with side dishes."
            ],
            description="A famous traditional fermented-style rice dish from Odisha.",
            prep_time=10,
            cook_time=5,
            servings=2,
            difficulty="Easy",
            is_famous=True
        ),

        Recipe(
            name="Vada Pav",
            state="Maharashtra",
            district="Mumbai",
            cuisine="Maharashtrian",
            category="Street Food",
            ingredients=[
                {
                    "name": "Potato",
                    "quantity": "4"
                },
                {
                    "name": "Gram Flour",
                    "quantity": "1 cup"
                },
                {
                    "name": "Pav",
                    "quantity": "4"
                }
            ],
            steps=[
                "Prepare spiced potato filling.",
                "Make gram flour batter.",
                "Dip potato balls in batter.",
                "Deep fry until golden.",
                "Serve inside pav with chutney."
            ],
            description="Popular Indian street food from Maharashtra.",
            prep_time=20,
            cook_time=20,
            servings=4,
            difficulty="Medium",
            is_famous=True
        )

    ]

    for recipe in demo_recipes:
        recipes[recipe.id] = recipe


create_demo_recipes()
load_catalog_recipes()

@recipes_bp.route("/", methods=["GET"])
def get_recipes():

    state = request.args.get("state")
    district = request.args.get("district")
    cuisine = request.args.get("cuisine")
    category = request.args.get("category")
    search = request.args.get("search")

    result = []

    for recipe in recipes.values():

        if not recipe.is_approved:
            continue

        if state and recipe.state.lower() != state.lower():
            continue

        if district and recipe.district.lower() != district.lower():
            continue

        if cuisine and recipe.cuisine.lower() != cuisine.lower():
            continue

        if category and recipe.category.lower() != category.lower():
            continue

        if search:

            search_text = (
                recipe.name +
                " " +
                recipe.description +
                " " +
                recipe.cuisine +
                " " +
                recipe.state +
                " " +
                recipe.district
            ).lower()

            ingredient_text = " ".join(
                item.get("name", "") if isinstance(item, dict) else str(item)
                for item in recipe.ingredients
            )
            if search.lower() not in (search_text + " + ingredient_text.lower()):
                continue

        result.append(recipe.to_dict())

    result.sort(
        key=lambda x: x["is_famous"],
        reverse=True
    )

    return jsonify({
        "success": True,
        "count": len(result),
        "recipes": result
    })


@recipes_bp.route("/<recipe_id>", methods=["GET"])
def get_recipe(recipe_id):

    recipe = recipes.get(recipe_id)

    if not recipe:
        return jsonify({
            "success": False,
            "message": "Recipe not found."
        }), 404

    recipe.views += 1

    return jsonify({
        "success": True,
        "recipe": recipe.to_dict()
    })


@recipes_bp.route("/", methods=["POST"])
def create_recipe():

    data = request.get_json() or {}

    name = data.get("name", "").strip()

    if not name:
        return jsonify({
            "success": False,
            "message": "Recipe name is required."
        }), 400

    recipe = Recipe(
        name=name,
        state=data.get("state", ""),
        district=data.get("district", ""),
        cuisine=data.get("cuisine", ""),
        category=data.get("category", ""),
        ingredients=data.get("ingredients", []),
        steps=data.get("steps", []),
        description=data.get("description", ""),
        prep_time=data.get("prep_time", 0),
        cook_time=data.get("cook_time", 0),
        servings=data.get("servings", 1),
        difficulty=data.get("difficulty", "Easy"),
        photo=data.get("photo", ""),
        video=data.get("video", ""),
        is_famous=data.get("is_famous", False),
        is_approved=data.get("is_approved", True)
    )

    recipes[recipe.id] = recipe

    return jsonify({
        "success": True,
        "message": "Recipe created successfully.",
        "recipe": recipe.to_dict()
    }), 201


@recipes_bp.route("/<recipe_id>", methods=["PUT"])
def update_recipe(recipe_id):

    recipe = recipes.get(recipe_id)

    if not recipe:
        return jsonify({
            "success": False,
            "message": "Recipe not found."
        }), 404

    data = request.get_json() or {}

    editable_fields = [
        "name",
        "state",
        "district",
        "cuisine",
        "category",
        "ingredients",
        "steps",
        "description",
        "prep_time",
        "cook_time",
        "servings",
        "difficulty",
        "photo",
        "video",
        "is_famous",
        "is_approved"
    ]

    for field in editable_fields:

        if field in data:
            setattr(
                recipe,
                field,
                data[field]
            )

    from datetime import datetime

    recipe.updated_at = datetime.utcnow().isoformat()

    return jsonify({
        "success": True,
        "message": "Recipe updated successfully.",
        "recipe": recipe.to_dict()
    })


@recipes_bp.route("/<recipe_id>", methods=["DELETE"])
def delete_recipe(recipe_id):

    if recipe_id not in recipes:
        return jsonify({
            "success": False,
            "message": "Recipe not found."
        }), 404

    del recipes[recipe_id]

    return jsonify({
        "success": True,
        "message": "Recipe deleted successfully."
    })


@recipes_bp.route("/<recipe_id>/like", methods=["POST"])
def like_recipe(recipe_id):

    recipe = recipes.get(recipe_id)

    if not recipe:
        return jsonify({
            "success": False,
            "message": "Recipe not found."
        }), 404

    recipe.likes += 1

    return jsonify({
        "success": True,
        "likes": recipe.likes
    })