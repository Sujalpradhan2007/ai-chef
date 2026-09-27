// AI Cooking Assistant
// District Data Controller

const districts = {
    Odisha: [
        {
            id: "bhubaneswar",
            name: "Bhubaneswar",
            famousFoods: ["Dalma", "Dahi Bara Aloo Dum", "Chhena Poda"]
        },
        {
            id: "cuttack",
            name: "Cuttack",
            famousFoods: ["Dahi Bara Aloo Dum", "Barabati Chaat"]
        },
        {
            id: "puri",
            name: "Puri",
            famousFoods: ["Mahaprasad", "Khaja", "Dalma"]
        },
        {
            id: "khordha",
            name: "Khordha",
            famousFoods: ["Dalma", "Pakhala", "Chhena Poda"]
        },
        {
            id: "ganjam",
            name: "Ganjam",
            famousFoods: ["Ganjam Kheeri", "Poda Pitha"]
        }
    ],

    Maharashtra: [
        {
            id: "mumbai",
            name: "Mumbai",
            famousFoods: ["Vada Pav", "Pav Bhaji", "Misal Pav"]
        },
        {
            id: "pune",
            name: "Pune",
            famousFoods: ["Misal Pav", "Bakarwadi"]
        }
    ],

    "West Bengal": [
        {
            id: "kolkata",
            name: "Kolkata",
            famousFoods: ["Macher Jhol", "Kathi Roll", "Rasgulla"]
        }
    ],

    Punjab: [
        {
            id: "amritsar",
            name: "Amritsar",
            famousFoods: ["Amritsari Kulcha", "Chole", "Lassi"]
        }
    ]
};

function getDistrictsByState(stateName) {
    return districts[stateName] || [];
}

function getDistrictById(stateName, districtId) {
    const stateDistricts = getDistrictsByState(stateName);

    return stateDistricts.find(
        district => district.id === districtId
    );
}

function displayDistricts(stateName, containerId) {
    const container = document.getElementById(containerId);

    if (!container) return;

    const stateDistricts = getDistrictsByState(stateName);

    container.innerHTML = "";

    if (stateDistricts.length === 0) {
        container.innerHTML = `
            <p class="empty-message">
                District data will be added soon.
            </p>
        `;
        return;
    }

    stateDistricts.forEach(district => {
        const card = document.createElement("a");

        card.href =
            `district.html?state=${encodeURIComponent(stateName)}&district=${encodeURIComponent(district.name)}`;

        card.className = "district-card";

        card.innerHTML = `
            <div class="district-card-content">
                <h3>${district.name}</h3>
                <p>${district.famousFoods.join(", ")}</p>
            </div>
        `;

        container.appendChild(card);
    });
}

window.districts = districts;
window.getDistrictsByState = getDistrictsByState;
window.getDistrictById = getDistrictById;
window.displayDistricts = displayDistricts;