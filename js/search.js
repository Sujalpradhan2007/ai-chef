// AI Cooking Assistant
// Search Controller

document.addEventListener("DOMContentLoaded", () => {

    const searchInputs = document.querySelectorAll(
        "[data-recipe-search], #heroSearchInput"
    );

    searchInputs.forEach(input => {
        input.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                performSearch(input.value);
            }
        });
    });

    const searchButtons = document.querySelectorAll(
        "[data-search-button], #heroSearchButton"
    );

    searchButtons.forEach(button => {
        button.addEventListener("click", () => {
            const input =
                button.parentElement.querySelector("input") ||
                document.getElementById("heroSearchInput");

            if (input) {
                performSearch(input.value);
            }
        });
    });
});

function performSearch(query) {
    const value = query.trim();

    if (!value) {
        showSearchMessage("Please enter a recipe, ingredient, state or cuisine.");
        return;
    }

    window.location.href =
        `pages/states.html?search=${encodeURIComponent(value)}`;
}

function showSearchMessage(message) {
    if (typeof showNotification === "function") {
        showNotification(message, "info");
    } else {
        alert(message);
    }
}

function filterRecipeCards(query, containerId) {
    const container = document.getElementById(containerId);

    if (!container) return;

    const cards = container.querySelectorAll("[data-name]");

    const searchText = query.toLowerCase().trim();

    cards.forEach(card => {
        const name =
            card.dataset.name.toLowerCase();

        const ingredients =
            card.dataset.ingredients
                ? card.dataset.ingredients.toLowerCase()
                : "";

        const matches =
            name.includes(searchText) ||
            ingredients.includes(searchText);

        card.style.display = matches ? "" : "none";
    });
}

window.performSearch = performSearch;
window.filterRecipeCards = filterRecipeCards;