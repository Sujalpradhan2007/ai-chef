// AI Cooking Assistant
// Recipe Suggestion Engine

function getRecipeSuggestions(
    recipes = [],
    preferences = {}
) {
    let results = [...recipes];

    if (preferences.state) {
        results = results.filter(
            recipe =>
                String(recipe.state)
                    .toLowerCase() ===
                String(preferences.state)
                    .toLowerCase()
        );
    }

    if (preferences.district) {
        results = results.filter(
            recipe =>
                String(recipe.district)
                    .toLowerCase() ===
                String(preferences.district)
                    .toLowerCase()
        );
    }

    if (preferences.cuisine) {
        results = results.filter(
            recipe =>
                String(recipe.cuisine)
                    .toLowerCase() ===
                String(preferences.cuisine)
                    .toLowerCase()
        );
    }

    if (preferences.category) {
        results = results.filter(
            recipe =>
                String(recipe.category)
                    .toLowerCase() ===
                String(preferences.category)
                    .toLowerCase()
        );
    }

    if (preferences.difficulty) {
        results = results.filter(
            recipe =>
                String(recipe.difficulty)
                    .toLowerCase() ===
                String(preferences.difficulty)
                    .toLowerCase()
        );
    }

    if (
        preferences.maxCookingTime
    ) {
        results = results.filter(
            recipe =>
                Number(recipe.cookTime || 0) <=
                Number(
                    preferences.maxCookingTime
                )
        );
    }

    if (
        preferences.vegetarian === true
    ) {
        results = results.filter(
            recipe =>
                recipe.vegetarian === true
        );
    }

    if (preferences.famousFirst) {
        results.sort(
            (a, b) =>
                Number(b.famous) -
                Number(a.famous)
        );
    }

    return results;
}

function getPopularSuggestions(
    recipes = [],
    limit = 6
) {
    return [...recipes]
        .sort(
            (a, b) =>
                Number(b.famous) -
                Number(a.famous)
        )
        .slice(0, limit);
}

function getQuickRecipeSuggestions(
    recipes = [],
    maxMinutes = 30
) {
    return recipes.filter(
        recipe =>
            Number(recipe.cookTime || 0) <=
            maxMinutes
    );
}

function getFestivalSuggestions(
    recipes = [],
    festival
) {
    if (!festival) {
        return [];
    }

    return recipes.filter(
        recipe =>
            String(recipe.festival)
                .toLowerCase()
                .includes(
                    String(festival)
                        .toLowerCase()
                )
    );
}

window.RecipeSuggestions = {
    getRecipeSuggestions,
    getPopularSuggestions,
    getQuickRecipeSuggestions,
    getFestivalSuggestions
};