from flask import Blueprint, request, jsonify
import os
import requests


ai_bp = Blueprint(
    "ai",
    __name__
)


def demo_ai_response(message):

    text = message.lower()

    if "paneer" in text:

        return (
            "You can make Paneer Butter Masala, "
            "Paneer Tikka, Shahi Paneer, or Paneer Bhurji."
        )

    if "potato" in text:

        return (
            "With potato you can make Aloo Paratha, "
            "Aloo Fry, Dum Aloo, or Vada Pav."
        )

    if "rice" in text:

        return (
            "With rice you can make Fried Rice, "
            "Biryani, Pulao, Lemon Rice, or Pakhala."
        )

    if "chicken" in text:

        return (
            "You can make Chicken Biryani, "
            "Chicken Curry, Chicken Fry, or Chicken Tikka."
        )

    if "substitute" in text:

        return (
            "Tell me the ingredient you want to replace, "
            "and I will suggest suitable alternatives."
        )

    return (
        "I can help you with recipes, ingredients, "
        "cooking steps, substitutions, Indian cuisines, "
        "and meal ideas. Tell me what ingredients you have."
    )


@ai_bp.route("/chat", methods=["POST"])
def chat():

    data = request.get_json() or {}

    message = data.get("message", "").strip()

    if not message:

        return jsonify({
            "success": False,
            "message": "Message is required."
        }), 400

    api_key = os.getenv("AI_API_KEY", "")
    api_url = os.getenv("AI_API_URL", "")

    # Real AI API can be connected here.
    # The API key stays on the backend.

    if api_key and api_url:

        try:

            response = requests.post(
                api_url,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "message": message
                },
                timeout=30
            )

            if response.ok:

                result = response.json()

                return jsonify({
                    "success": True,
                    "source": "ai-api",
                    "reply": result.get(
                        "reply",
                        result.get(
                            "message",
                            "AI response received."
                        )
                    )
                })

        except requests.RequestException:
            pass

    return jsonify({
        "success": True,
        "source": "demo",
        "reply": demo_ai_response(message)
    })


@ai_bp.route("/recipe-generate", methods=["POST"])
def generate_recipe():

    data = request.get_json() or {}

    ingredients = data.get(
        "ingredients",
        []
    )

    cuisine = data.get(
        "cuisine",
        "Indian"
    )

    if not ingredients:

        return jsonify({
            "success": False,
            "message": "At least one ingredient is required."
        }), 400

    ingredient_text = ", ".join(
        ingredients
    )

    recipe = {
        "name": f"{cuisine} {ingredients[0]} Special",
        "cuisine": cuisine,
        "ingredients": [
            {
                "name": item,
                "quantity": "As required"
            }
            for item in ingredients
        ],
        "steps": [
            "Prepare all ingredients.",
            "Heat the cooking pan.",
            "Add ingredients and cook properly.",
            "Add spices according to taste.",
            "Cook until ready.",
            "Serve hot."
        ],
        "description": (
            f"A recipe generated using {ingredient_text}."
        )
    }

    return jsonify({
        "success": True,
        "recipe": recipe
    })


@ai_bp.route("/ingredient-substitution", methods=["POST"])
def ingredient_substitution():

    data = request.get_json() or {}

    ingredient = data.get(
        "ingredient",
        ""
    ).strip().lower()

    substitutions = {

        "paneer": [
            "Tofu",
            "Cottage cheese",
            "Firm cheese"
        ],

        "butter": [
            "Ghee",
            "Oil",
            "Margarine"
        ],

        "cream": [
            "Milk + butter",
            "Cashew paste",
            "Coconut cream"
        ],

        "sugar": [
            "Jaggery",
            "Honey",
            "Date syrup"
        ],

        "lemon": [
            "Lime",
            "Vinegar",
            "Tamarind water"
        ]
    }

    result = substitutions.get(
        ingredient,
        []
    )

    return jsonify({
        "success": True,
        "ingredient": ingredient,
        "substitutions": result
    })


@ai_bp.route("/image-recipe", methods=["POST"])
def image_recipe():

    return jsonify({
        "success": True,
        "message": (
            "Image analysis endpoint is ready. "
            "Real vision AI integration will be connected "
            "in the AI integration stage."
        ),
        "detected_food": None,
        "suggested_recipes": []
    })