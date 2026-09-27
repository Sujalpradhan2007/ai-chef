/* Shared recipe catalog loader for recipe details. */
(function () {
  "use strict";

  function escapeHTML(value) {
    return String(value ?? "").replace(
      /[&<>\"']/g,
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        })[character],
    );
  }

  function ingredientRows(recipe) {
    const names = {
      dalma: [
        "Toor dal",
        "Raw papaya",
        "Potato",
        "Pumpkin",
        "Tomato",
        "Turmeric",
        "Cumin",
        "Salt",
      ],
      "pakhala-bhata": ["Cooked rice", "Water", "Curd", "Salt", "Green chilli"],
      "chhena-poda": [
        "Fresh chhena",
        "Sugar",
        "Cardamom",
        "Cashews",
        "Raisins",
      ],
      "dahi-bara-aloo-dum": [
        "Urad dal",
        "Potatoes",
        "Curd",
        "Tamarind chutney",
        "Spices",
      ],
      "litti-chokha": [
        "Wheat flour",
        "Sattu",
        "Potatoes",
        "Tomato",
        "Onion",
        "Spices",
      ],
      "vada-pav": [
        "Potatoes",
        "Gram flour",
        "Pav",
        "Green chilli",
        "Garlic",
        "Spices",
      ],
      "misal-pav": ["Mixed sprouts", "Onion", "Tomato", "Misal masala", "Pav"],
      "hyderabadi-biryani": [
        "Basmati rice",
        "Chicken",
        "Yogurt",
        "Onion",
        "Biryani masala",
        "Mint",
      ],
      "amritsari-kulcha": [
        "Refined flour",
        "Potatoes",
        "Paneer",
        "Yogurt",
        "Spices",
      ],
      "chinese-fried-rice": [
        "Cooked rice",
        "Carrot",
        "Capsicum",
        "Spring onion",
        "Soy sauce",
      ],
    };
    return (
      names[recipe.id] || ["Fresh ingredients", "Spices", "Salt", "Cooking oil"]
    );
  }

  function updateRecipePage(recipe) {
    const set = (id, value) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    };
    set("recipeTitle", recipe.name);
    set(
      "recipeDescription",
      recipe.description ||
        `A delicious ${recipe.cuisine || "regional"} recipe.`,
    );
    set("recipeState", recipe.state);
    set("recipeDistrict", recipe.district || "Regional");
    set("recipeCuisine", recipe.cuisine);
    set("recipeCuisineTag", recipe.cuisine);
    set("recipeFestivalTag", recipe.festival || "Popular");
    set("recipeBadge", recipe.category || "Recipe");
    set("prepTime", `${recipe.prepTime || 0} min`);
    set("cookTime", `${recipe.cookTime || 0} min`);
    set("servings", recipe.servings || 1);
    set("difficulty", recipe.difficulty || "Easy");
    set("breadcrumbState", recipe.state);
    set("breadcrumbRecipe", recipe.name);
    document.title = `${recipe.name} | AI Cooking Assistant`;

    const ingredients = document.getElementById("ingredientsList");
    if (ingredients)
      ingredients.innerHTML = ingredientRows(recipe)
        .map(
          (name) =>
            `<li class="ingredient-item"><span class="ingredient-name"><i class="fa-solid fa-circle"></i>${escapeHTML(name)}</span><span class="ingredient-quantity">As required</span></li>`,
        )
        .join("");
    const steps = document.getElementById("stepsList");
    if (steps)
      steps.innerHTML = [
        `Prepare and measure all ingredients for ${recipe.name}.`,
        `Cook the main ingredients with spices over medium heat.`,
        `Adjust seasoning and cook until the ingredients are tender.`,
        `Garnish and serve hot with your preferred accompaniment.`,
      ]
        .map(
          (description, index) =>
            `<div class="step"><div class="step-number">${index + 1}</div><div class="step-content"><h3>Step ${index + 1}</h3><p>${escapeHTML(description)}</p></div></div>`,
        )
        .join("");
    ["calories", "protein", "carbs", "fat"].forEach((id) => set(id, "—"));
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const id = new URLSearchParams(window.location.search).get("recipe");
    if (!id || !document.getElementById("recipeTitle")) return;
    try {
      const response = await fetch("../data/recipes.json");
      if (!response.ok) return;
      const catalog = (await response.json()).recipes || [];
      const recipe = catalog.find((item) => item.id === id);
      if (recipe) updateRecipePage(recipe);
    } catch (error) {
      console.warn("Recipe catalog could not be loaded", error);
    }
  });
})();
