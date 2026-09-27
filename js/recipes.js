// AI Cooking Assistant
// Recipe Controller

const recipes = [
    {
        id: "dalma",
        name: "Dalma",
        state: "Odisha",
        district: "Bhubaneswar",
        cuisine: "Odia",
        category: "Main Course",
        festival: "Traditional",
        prepTime: 15,
        cookTime: 30,
        servings: 4,
        difficulty: "Easy",
        famous: true,
        ingredients: [
            "Toor Dal",
            "Raw Papaya",
            "Potato",
            "Pumpkin",
            "Tomato",
            "Turmeric",
            "Cumin",
            "Salt"
        ]
    },

    {
        id: "pakhala-bhata",
        name: "Pakhala Bhata",
        state: "Odisha",
        district: "Puri",
        cuisine: "Odia",
        category: "Main Course",
        festival: "Summer",
        prepTime: 10,
        cookTime: 10,
        servings: 2,
        difficulty: "Easy",
        famous: true,
        ingredients: [
            "Cooked Rice",
            "Water",
            "Curd",
            "Salt",
            "Green Chili"
        ]
    },

    {
        id: "chhena-poda",
        name: "Chhena Poda",
        state: "Odisha",
        district: "Nayagarh",
        cuisine: "Odia",
        category: "Sweets",
        festival: "Festival",
        prepTime: 15,
        cookTime: 45,
        servings: 6,
        difficulty: "Medium",
        famous: true,
        ingredients: [
            "Fresh Chhena",
            "Sugar",
            "Cardamom",
            "Cashews",
            "Raisins"
        ]
    },

    {
        id: "vada-pav",
        name: "Vada Pav",
        state: "Maharashtra",
        district: "Mumbai",
        cuisine: "Indian",
        category: "Snacks",
        festival: "All",
        prepTime: 20,
        cookTime: 20,
        servings: 4,
        difficulty: "Easy",
        famous: true,
        ingredients: [
            "Potatoes",
            "Gram Flour",
            "Pav",
            "Green Chili",
            "Garlic",
            "Spices"
        ]
    },

    {
        id: "biryani",
        name: "Chicken Biryani",
        state: "Telangana",
        district: "Hyderabad",
        cuisine: "Hyderabadi",
        category: "Main Course",
        festival: "Festival",
        prepTime: 30,
        cookTime: 50,
        servings: 4,
        difficulty: "Medium",
        famous: true,
        ingredients: [
            "Basmati Rice",
            "Chicken",
            "Onion",
            "Yogurt",
            "Biryani Masala",
            "Mint",
            "Coriander"
        ]
    },

    {
        id: "fried-rice",
        name: "Chinese Fried Rice",
        state: "International",
        district: "",
        cuisine: "Chinese",
        category: "Rice",
        festival: "All",
        prepTime: 10,
        cookTime: 15,
        servings: 2,
        difficulty: "Easy",
        famous: true,
        ingredients: [
            "Cooked Rice",
            "Carrot",
            "Capsicum",
            "Spring Onion",
            "Soy Sauce"
        ]
    }
];

function getRecipeById(id) {
    return recipes.find(recipe => recipe.id === id);
}

function searchRecipes(query) {
    const searchText = query.toLowerCase().trim();

    if (!searchText) {
        return recipes;
    }

    return recipes.filter(recipe => {
        return (
            recipe.name.toLowerCase().includes(searchText) ||
            recipe.state.toLowerCase().includes(searchText) ||
            recipe.district.toLowerCase().includes(searchText) ||
            recipe.cuisine.toLowerCase().includes(searchText) ||
            recipe.category.toLowerCase().includes(searchText) ||
            recipe.ingredients.some(item =>
                item.toLowerCase().includes(searchText)
            )
        );
    });
}

function getRecipesByState(stateName) {
    return recipes.filter(
        recipe =>
            recipe.state.toLowerCase() === stateName.toLowerCase()
    );
}

function getRecipesByDistrict(districtName) {
    return recipes.filter(
        recipe =>
            recipe.district.toLowerCase() === districtName.toLowerCase()
    );
}

function getFamousRecipes() {
    return recipes.filter(recipe => recipe.famous === true);
}

function getRecipesByCuisine(cuisineName) {
    return recipes.filter(
        recipe =>
            recipe.cuisine.toLowerCase() === cuisineName.toLowerCase()
    );
}

function getRecipesByCategory(categoryName) {
    return recipes.filter(
        recipe =>
            recipe.category.toLowerCase() === categoryName.toLowerCase()
    );
}

window.recipes = recipes;
window.getRecipeById = getRecipeById;
window.searchRecipes = searchRecipes;
window.getRecipesByState = getRecipesByState;
window.getRecipesByDistrict = getRecipesByDistrict;
window.getFamousRecipes = getFamousRecipes;
window.getRecipesByCuisine = getRecipesByCuisine;
window.getRecipesByCategory = getRecipesByCategory;