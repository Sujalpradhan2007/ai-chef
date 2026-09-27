// AI Cooking Assistant
// Ingredient to Recipe Engine

const ingredientRecipeDatabase = {
    rice: [
        "Pakhala Bhata",
        "Vegetable Pulao",
        "Fried Rice",
        "Biryani",
        "Lemon Rice"
    ],

    potato: [
        "Aloo Paratha",
        "Aloo Dum",
        "Jeera Aloo",
        "Samosa",
        "Vada Pav"
    ],

    paneer: [
        "Paneer Butter Masala",
        "Chilli Paneer",
        "Paneer Tikka",
        "Palak Paneer"
    ],

    chicken: [
        "Chicken Biryani",
        "Chicken Curry",
        "Chicken Tikka",
        "Butter Chicken"
    ],

    egg: [
        "Egg Curry",
        "Egg Fried Rice",
        "Masala Omelette",
        "Egg Bhurji"
    ],

    tomato: [
        "Tomato Soup",
        "Tomato Rice",
        "Tomato Curry"
    ],

    onion: [
        "Onion Pakora",
        "Onion Paratha",
        "Onion Curry"
    ],

    flour: [
        "Roti",
        "Paratha",
        "Poori",
        "Naan"
    ],

    "gram flour": [
        "Pakora",
        "Dhokla",
        "Besan Chilla"
    ]
};

function normalizeIngredientName(
    ingredient
) {
    return String(ingredient || "")
        .toLowerCase()
        .trim();
}

function findRecipesBySingleIngredient(
    ingredient
) {
    const normalized =
        normalizeIngredientName(
            ingredient
        );

    return (
        ingredientRecipeDatabase[
            normalized
        ] || []
    );
}

function findRecipesByIngredients(
    ingredients = []
) {
    const cleanIngredients =
        ingredients
            .map(
                normalizeIngredientName
            )
            .filter(Boolean);

    const recipeScores = {};

    cleanIngredients.forEach(
        ingredient => {
            const recipeList =
                findRecipesBySingleIngredient(
                    ingredient
                );

            recipeList.forEach(recipe => {
                if (!recipeScores[recipe]) {
                    recipeScores[recipe] = 0;
                }

                recipeScores[recipe]++;
            });
        }
    );

    return Object.entries(
        recipeScores
    )
        .sort(
            (a, b) => b[1] - a[1]
        )
        .map(
            ([recipe, score]) => ({
                recipe,
                matchedIngredients: score
            })
        );
}

function getBestRecipeMatches(
    ingredients,
    limit = 10
) {
    return findRecipesByIngredients(
        ingredients
    ).slice(0, limit);
}

window.IngredientToRecipe = {
    findRecipesBySingleIngredient,
    findRecipesByIngredients,
    getBestRecipeMatches
};