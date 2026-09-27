// AI Cooking Assistant
// Smart Ingredient Substitution Engine

const ingredientSubstitutions = {
    paneer: [
        {
            substitute: "Tofu",
            reason: "Good vegetarian alternative with a similar firm texture."
        },
        {
            substitute: "Cottage cheese",
            reason: "Can work in several paneer-style dishes."
        }
    ],

    butter: [
        {
            substitute: "Ghee",
            reason: "Works well in many Indian dishes."
        },
        {
            substitute: "Oil",
            reason: "Can be used for cooking when butter is unavailable."
        }
    ],

    cream: [
        {
            substitute: "Milk + butter",
            reason: "Can provide richness in some recipes."
        },
        {
            substitute: "Cashew paste",
            reason: "Useful for creamy Indian gravies."
        }
    ],

    yogurt: [
        {
            substitute: "Buttermilk",
            reason: "Can work in marinades and some sauces."
        },
        {
            substitute: "Sour cream",
            reason: "Can work in selected recipes."
        }
    ],

    sugar: [
        {
            substitute: "Jaggery",
            reason: "Useful in many Indian sweets and dishes."
        },
        {
            substitute: "Honey",
            reason: "Can provide sweetness in suitable recipes."
        }
    ],

    lemon: [
        {
            substitute: "Lime",
            reason: "Very similar acidic flavor."
        },
        {
            substitute: "Vinegar",
            reason: "Can provide acidity, but use a smaller amount."
        }
    ],

    cornstarch: [
        {
            substitute: "Arrowroot powder",
            reason: "Can be used as a thickening agent."
        },
        {
            substitute: "Rice flour",
            reason: "Can help with thickening or crispiness in some dishes."
        }
    ]
};

function normalizeIngredient(
    ingredient
) {
    return String(ingredient || "")
        .toLowerCase()
        .trim();
}

function getSubstitutions(
    ingredient
) {
    const normalized =
        normalizeIngredient(
            ingredient
        );

    return (
        ingredientSubstitutions[
            normalized
        ] || []
    );
}

function suggestSubstitute(
    ingredient,
    preference = {}
) {
    const options =
        getSubstitutions(
            ingredient
        );

    if (options.length === 0) {
        return {
            success: false,
            message:
                "No substitution is available in the current database."
        };
    }

    let selected =
        options[0];

    if (
        preference.preferredIngredient
    ) {
        const preferred =
            options.find(
                option =>
                    option.substitute
                        .toLowerCase()
                        .includes(
                            String(
                                preference
                                    .preferredIngredient
                            ).toLowerCase()
                        )
            );

        if (preferred) {
            selected = preferred;
        }
    }

    return {
        success: true,
        original: ingredient,
        substitute:
            selected.substitute,
        reason:
            selected.reason,
        alternatives: options
    };
}

window.IngredientSubstitution = {
    getSubstitutions,
    suggestSubstitute
};