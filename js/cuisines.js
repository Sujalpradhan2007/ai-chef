// AI Cooking Assistant
// Cuisine Controller

const cuisines = [
    {
        id: "odia",
        name: "Odia",
        country: "India",
        recipes: [
            "Dalma",
            "Pakhala Bhata",
            "Chhena Poda",
            "Dahi Bara Aloo Dum"
        ]
    },

    {
        id: "indian",
        name: "Indian",
        country: "India",
        recipes: [
            "Butter Chicken",
            "Paneer Butter Masala",
            "Biryani",
            "Masala Dosa"
        ]
    },

    {
        id: "chinese",
        name: "Chinese",
        country: "China",
        recipes: [
            "Chinese Fried Rice",
            "Hakka Noodles",
            "Manchurian",
            "Spring Rolls"
        ]
    },

    {
        id: "italian",
        name: "Italian",
        country: "Italy",
        recipes: [
            "Pizza",
            "Pasta",
            "Lasagna",
            "Risotto"
        ]
    },

    {
        id: "mexican",
        name: "Mexican",
        country: "Mexico",
        recipes: [
            "Tacos",
            "Burritos",
            "Quesadilla"
        ]
    },

    {
        id: "thai",
        name: "Thai",
        country: "Thailand",
        recipes: [
            "Pad Thai",
            "Thai Green Curry",
            "Tom Yum Soup"
        ]
    },

    {
        id: "japanese",
        name: "Japanese",
        country: "Japan",
        recipes: [
            "Sushi",
            "Ramen",
            "Tempura"
        ]
    },

    {
        id: "american",
        name: "American",
        country: "USA",
        recipes: [
            "Burger",
            "Pancakes",
            "Mac and Cheese"
        ]
    }
];

function getCuisineById(id) {
    return cuisines.find(
        cuisine => cuisine.id === id
    );
}

function getCuisineRecipes(cuisineName) {
    const cuisine =
        cuisines.find(
            item =>
                item.name.toLowerCase() ===
                cuisineName.toLowerCase()
        );

    return cuisine
        ? cuisine.recipes
        : [];
}

function displayCuisines(containerId) {
    const container =
        document.getElementById(
            containerId
        );

    if (!container) return;

    container.innerHTML =
        cuisines.map(cuisine => `
            <a
                class="cuisine-card"
                href="cuisines.html?cuisine=${cuisine.id}"
            >
                <h3>${cuisine.name}</h3>
                <p>${cuisine.country}</p>
            </a>
        `).join("");
}

window.cuisines = cuisines;
window.getCuisineById =
    getCuisineById;
window.getCuisineRecipes =
    getCuisineRecipes;
window.displayCuisines =
    displayCuisines;