// AI Cooking Assistant
// Ingredient Finder

const ingredientRecipeMap = {
    rice: [
        "Chinese Fried Rice",
        "Vegetable Pulao",
        "Biryani",
        "Pakhala Bhata"
    ],

    potato: [
        "Aloo Paratha",
        "Aloo Dum",
        "Jeera Aloo",
        "Samosa"
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
        "Chicken Fried Rice"
    ],

    tomato: [
        "Tomato Soup",
        "Tomato Rice",
        "Paneer Curry"
    ],

    egg: [
        "Egg Curry",
        "Egg Fried Rice",
        "Masala Omelette",
        "Egg Bhurji"
    ]
};

function normalizeIngredient(value) {
    return value
        .toLowerCase()
        .trim();
}

function findRecipesFromIngredients(
    ingredients
) {
    const list = ingredients
        .map(normalizeIngredient)
        .filter(Boolean);

    const results = new Set();

    list.forEach(ingredient => {
        const matches =
            ingredientRecipeMap[ingredient];

        if (matches) {
            matches.forEach(recipe =>
                results.add(recipe)
            );
        }
    });

    return Array.from(results);
}

function displayIngredientResults(
    recipesFound,
    containerId
) {
    const container =
        document.getElementById(containerId);

    if (!container) return;

    if (recipesFound.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No matching recipes found</h3>
                <p>
                    Try adding more ingredients.
                </p>
            </div>
        `;

        return;
    }

    container.innerHTML =
        recipesFound.map(recipe => `
            <div class="recipe-result-card">
                <h3>${recipe}</h3>
                <a href="recipe.html?recipe=${encodeURIComponent(recipe)}">
                    View Recipe
                </a>
            </div>
        `).join("");
}

function runIngredientFinder(
    inputValue,
    containerId = "ingredientResults"
) {
    const ingredients =
        inputValue
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);

    const results =
        findRecipesFromIngredients(
            ingredients
        );

    displayIngredientResults(
        results,
        containerId
    );

    return results;
}

document.addEventListener("DOMContentLoaded", () => {
    const input =
        document.getElementById(
            "ingredientInput"
        );

    const button =
        document.getElementById(
            "findRecipeButton"
        );

    if (input && button) {
        button.addEventListener(
            "click",
            () => {
                runIngredientFinder(
                    input.value
                );
            }
        );
    }

    document
        .querySelectorAll(
            ".ingredient-tag[data-ingredient]"
        )
        .forEach(tag => {
            tag.addEventListener(
                "click",
                () => {
                    const ingredient =
                        tag.dataset.ingredient;

                    if (!input) return;

                    const existing =
                        input.value.trim();

                    input.value =
                        existing
                            ? `${existing}, ${ingredient}`
                            : ingredient;
                }
            );
        });
});

window.runIngredientFinder =
    runIngredientFinder;

window.findRecipesFromIngredients =
    findRecipesFromIngredients;