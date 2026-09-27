// AI Cooking Assistant
// AI Recipe Generator

function generateRecipeFromIngredients(
    ingredients = [],
    options = {}
) {
    const cleanIngredients = ingredients
        .map(item =>
            String(item).trim()
        )
        .filter(Boolean);

    if (cleanIngredients.length === 0) {
        return {
            success: false,
            message:
                "Please provide at least one ingredient."
        };
    }

    const cuisine =
        options.cuisine || "Indian";

    const servings =
        options.servings || 2;

    const difficulty =
        options.difficulty || "Easy";

    const cookingTime =
        options.cookingTime || 30;

    const recipeName =
        createRecipeName(
            cleanIngredients,
            cuisine
        );

    return {
        success: true,

        recipe: {
            id:
                `ai-${Date.now()}`,

            name: recipeName,

            cuisine,

            servings,

            difficulty,

            cookingTime,

            ingredients:
                cleanIngredients.map(
                    ingredient => ({
                        name: ingredient,
                        quantity: "As required"
                    })
                ),

            steps: [
                "Prepare and wash all ingredients.",
                "Cut or measure the ingredients as required.",
                "Heat the cooking pan and add the required oil or fat.",
                "Add the main ingredients and cook with suitable spices.",
                "Cook until the ingredients are properly done.",
                "Taste and adjust salt and spices.",
                "Serve hot."
            ],

            generatedBy:
                "AI Cooking Assistant",

            generatedAt:
                new Date().toISOString()
        }
    };
}

function createRecipeName(
    ingredients,
    cuisine
) {
    const first =
        ingredients[0] || "Mixed";

    const second =
        ingredients[1] || "";

    if (
        cuisine.toLowerCase() ===
        "chinese"
    ) {
        return second
            ? `${first} ${second} Fried Rice`
            : `${first} Fried Rice`;
    }

    if (
        cuisine.toLowerCase() ===
        "italian"
    ) {
        return `${first} Pasta`;
    }

    return second
        ? `${first} & ${second} Special Curry`
        : `${first} Special Recipe`;
}

function generateRecipeByPreferences(
    ingredients,
    preferences = {}
) {
    return generateRecipeFromIngredients(
        ingredients,
        preferences
    );
}

function formatGeneratedRecipe(recipe) {
    if (!recipe) return "";

    let output = "";

    output += `Recipe: ${recipe.name}\n`;
    output += `Cuisine: ${recipe.cuisine}\n`;
    output += `Servings: ${recipe.servings}\n`;
    output += `Difficulty: ${recipe.difficulty}\n`;
    output += `Cooking Time: ${recipe.cookingTime} minutes\n\n`;

    output += "Ingredients:\n";

    recipe.ingredients.forEach(
        ingredient => {
            output +=
                `- ${ingredient.name}: ${ingredient.quantity}\n`;
        }
    );

    output += "\nSteps:\n";

    recipe.steps.forEach(
        (step, index) => {
            output +=
                `${index + 1}. ${step}\n`;
        }
    );

    return output;
}

window.RecipeGenerator = {
    generateRecipeFromIngredients,
    generateRecipeByPreferences,
    formatGeneratedRecipe
};