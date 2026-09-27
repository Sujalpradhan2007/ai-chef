// AI Cooking Assistant
// Image Recipe Assistant
//
// Demo version.
// Actual image recognition will be connected
// to a secure backend AI vision service later.

const imageRecipeDatabase = [
    {
        keywords: [
            "tomato",
            "red vegetable"
        ],
        suggestions: [
            "Tomato Soup",
            "Tomato Rice",
            "Tomato Curry"
        ]
    },

    {
        keywords: [
            "potato",
            "aloo"
        ],
        suggestions: [
            "Aloo Paratha",
            "Aloo Dum",
            "Jeera Aloo"
        ]
    },

    {
        keywords: [
            "paneer"
        ],
        suggestions: [
            "Paneer Butter Masala",
            "Paneer Tikka",
            "Chilli Paneer"
        ]
    },

    {
        keywords: [
            "rice",
            "cooked rice"
        ],
        suggestions: [
            "Fried Rice",
            "Pulao",
            "Biryani"
        ]
    }
];

function validateImageFile(
    file
) {
    if (!file) {
        return {
            valid: false,
            message: "Please select an image."
        };
    }

    if (!file.type.startsWith("image/")) {
        return {
            valid: false,
            message:
                "Please select a valid image file."
        };
    }

    const maxSize =
        5 * 1024 * 1024;

    if (file.size > maxSize) {
        return {
            valid: false,
            message:
                "Image size must be 5 MB or less."
        };
    }

    return {
        valid: true
    };
}

function previewImage(
    file,
    imageElement
) {
    const validation =
        validateImageFile(file);

    if (!validation.valid) {
        return validation;
    }

    if (!imageElement) {
        return {
            valid: false,
            message:
                "Image preview element not found."
        };
    }

    const reader =
        new FileReader();

    reader.onload = event => {
        imageElement.src =
            event.target.result;

        imageElement.style.display =
            "block";
    };

    reader.readAsDataURL(file);

    return {
        valid: true
    };
}

function analyzeImageDemo(
    description = ""
) {
    const text =
        String(description)
            .toLowerCase();

    const matches = [];

    imageRecipeDatabase.forEach(
        item => {
            if (
                item.keywords.some(
                    keyword =>
                        text.includes(
                            keyword
                        )
                )
            ) {
                matches.push(
                    ...item.suggestions
                );
            }
        }
    );

    return [
        ...new Set(matches)
    ];
}

async function analyzeImageWithBackend(
    file
) {
    const validation =
        validateImageFile(file);

    if (!validation.valid) {
        return validation;
    }

    const formData =
        new FormData();

    formData.append(
        "image",
        file
    );

    try {
        const response =
            await fetch(
                "/api/ai/image-recipe",
                {
                    method: "POST",
                    body: formData
                }
            );

        if (!response.ok) {
            throw new Error(
                "Image analysis failed."
            );
        }

        return await response.json();
    } catch (error) {
        console.error(
            "Image AI error:",
            error
        );

        return {
            success: false,
            message:
                "Image AI service is not connected yet."
        };
    }
}

window.ImageRecipeAI = {
    validateImageFile,
    previewImage,
    analyzeImageDemo,
    analyzeImageWithBackend
};