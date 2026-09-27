// AI Cooking Assistant
// Festival Recipe Controller

const festivals = [
    {
        id: "diwali",
        name: "Diwali",
        description: "Festival of lights and festive food.",
        recipes: [
            "Gulab Jamun",
            "Kaju Katli",
            "Samosa",
            "Paneer Tikka"
        ]
    },
    {
        id: "holi",
        name: "Holi",
        description: "Festival of colors and traditional dishes.",
        recipes: [
            "Gujiya",
            "Dahi Vada",
            "Thandai",
            "Malpua"
        ]
    },
    {
        id: "dussehra",
        name: "Dussehra",
        description: "Traditional festive meals and sweets.",
        recipes: [
            "Poori",
            "Halwa",
            "Chole",
            "Kheer"
        ]
    },
    {
        id: "ganesh-chaturthi",
        name: "Ganesh Chaturthi",
        description: "Traditional Ganesh Chaturthi dishes.",
        recipes: [
            "Modak",
            "Puran Poli",
            "Karanji"
        ]
    },
    {
        id: "makar-sankranti",
        name: "Makar Sankranti",
        description: "Seasonal dishes prepared during Makar Sankranti.",
        recipes: [
            "Til Ladoo",
            "Pongal",
            "Khichdi"
        ]
    }
];

function getFestivalById(id) {
    return festivals.find(
        festival => festival.id === id
    );
}

function getFestivalRecipes(festivalName) {
    const festival =
        festivals.find(
            item =>
                item.name.toLowerCase() ===
                festivalName.toLowerCase()
        );

    return festival
        ? festival.recipes
        : [];
}

function displayFestivals(containerId) {
    const container =
        document.getElementById(
            containerId
        );

    if (!container) return;

    container.innerHTML =
        festivals.map(festival => `
            <a
                class="festival-card"
                href="festivals.html?festival=${festival.id}"
            >
                <h3>${festival.name}</h3>
                <p>${festival.description}</p>
            </a>
        `).join("");
}

window.festivals = festivals;
window.getFestivalById =
    getFestivalById;
window.getFestivalRecipes =
    getFestivalRecipes;
window.displayFestivals =
    displayFestivals;