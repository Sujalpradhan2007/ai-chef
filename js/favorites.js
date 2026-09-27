// AI Cooking Assistant
// Favorites Controller

const FAVORITES_KEY =
    "aiCookingFavorites";

function getFavorites() {
    try {
        return JSON.parse(
            localStorage.getItem(
                FAVORITES_KEY
            )
        ) || [];
    } catch {
        return [];
    }
}

function saveFavorites(favorites) {
    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favorites)
    );
}

function isFavorite(recipeId) {
    return getFavorites().includes(
        recipeId
    );
}

function toggleFavorite(recipeId) {
    let favorites =
        getFavorites();

    if (favorites.includes(recipeId)) {
        favorites =
            favorites.filter(
                id => id !== recipeId
            );
    } else {
        favorites.push(recipeId);
    }

    saveFavorites(favorites);

    updateFavoriteButtons();

    return favorites;
}

function updateFavoriteButtons() {
    document
        .querySelectorAll(
            "[data-favorite-id]"
        )
        .forEach(button => {
            const recipeId =
                button.dataset.favoriteId;

            const active =
                isFavorite(recipeId);

            button.classList.toggle(
                "active",
                active
            );

            button.setAttribute(
                "aria-pressed",
                String(active)
            );

            const icon =
                button.querySelector("i");

            if (icon) {
                icon.className =
                    active
                        ? "fa-solid fa-heart"
                        : "fa-regular fa-heart";
            }
        });
}

document.addEventListener("click", event => {
    const button =
        event.target.closest(
            "[data-favorite-id]"
        );

    if (!button) return;

    const recipeId =
        button.dataset.favoriteId;

    toggleFavorite(recipeId);

    if (typeof showNotification === "function") {
        showNotification(
            isFavorite(recipeId)
                ? "Recipe added to favorites."
                : "Recipe removed from favorites.",
            "success"
        );
    }
});

document.addEventListener(
    "DOMContentLoaded",
    updateFavoriteButtons
);

window.getFavorites =
    getFavorites;

window.isFavorite =
    isFavorite;

window.toggleFavorite =
    toggleFavorite;

window.updateFavoriteButtons =
    updateFavoriteButtons;