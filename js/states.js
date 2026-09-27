// AI Cooking Assistant
// Indian States Data Controller

const indianStates = [
    {
        id: "andhra-pradesh",
        name: "Andhra Pradesh",
        capital: "Amaravati",
        region: "South India",
        famousFood: "Pulihora, Gongura Pachadi"
    },
    {
        id: "arunachal-pradesh",
        name: "Arunachal Pradesh",
        capital: "Itanagar",
        region: "North East India",
        famousFood: "Thukpa, Momos"
    },
    {
        id: "assam",
        name: "Assam",
        capital: "Dispur",
        region: "North East India",
        famousFood: "Masor Tenga, Khar"
    },
    {
        id: "bihar",
        name: "Bihar",
        capital: "Patna",
        region: "East India",
        famousFood: "Litti Chokha"
    },
    {
        id: "chhattisgarh",
        name: "Chhattisgarh",
        capital: "Raipur",
        region: "Central India",
        famousFood: "Fara, Chila"
    },
    {
        id: "goa",
        name: "Goa",
        capital: "Panaji",
        region: "West India",
        famousFood: "Goan Fish Curry"
    },
    {
        id: "gujarat",
        name: "Gujarat",
        capital: "Gandhinagar",
        region: "West India",
        famousFood: "Dhokla, Thepla"
    },
    {
        id: "haryana",
        name: "Haryana",
        capital: "Chandigarh",
        region: "North India",
        famousFood: "Bajra Khichdi"
    },
    {
        id: "himachal-pradesh",
        name: "Himachal Pradesh",
        capital: "Shimla",
        region: "North India",
        famousFood: "Dham, Siddu"
    },
    {
        id: "jharkhand",
        name: "Jharkhand",
        capital: "Ranchi",
        region: "East India",
        famousFood: "Dhuska, Thekua"
    },
    {
        id: "karnataka",
        name: "Karnataka",
        capital: "Bengaluru",
        region: "South India",
        famousFood: "Bisi Bele Bath, Mysore Pak"
    },
    {
        id: "kerala",
        name: "Kerala",
        capital: "Thiruvananthapuram",
        region: "South India",
        famousFood: "Appam, Kerala Sadya"
    },
    {
        id: "madhya-pradesh",
        name: "Madhya Pradesh",
        capital: "Bhopal",
        region: "Central India",
        famousFood: "Poha, Bhutte Ka Kees"
    },
    {
        id: "maharashtra",
        name: "Maharashtra",
        capital: "Mumbai",
        region: "West India",
        famousFood: "Vada Pav, Misal Pav"
    },
    {
        id: "manipur",
        name: "Manipur",
        capital: "Imphal",
        region: "North East India",
        famousFood: "Eromba"
    },
    {
        id: "meghalaya",
        name: "Meghalaya",
        capital: "Shillong",
        region: "North East India",
        famousFood: "Jadoh"
    },
    {
        id: "mizoram",
        name: "Mizoram",
        capital: "Aizawl",
        region: "North East India",
        famousFood: "Bai, Sawhchiar"
    },
    {
        id: "nagaland",
        name: "Nagaland",
        capital: "Kohima",
        region: "North East India",
        famousFood: "Smoked Pork"
    },
    {
        id: "odisha",
        name: "Odisha",
        capital: "Bhubaneswar",
        region: "East India",
        famousFood: "Dalma, Pakhala Bhata, Chhena Poda"
    },
    {
        id: "punjab",
        name: "Punjab",
        capital: "Chandigarh",
        region: "North India",
        famousFood: "Sarson Saag, Makki Di Roti"
    },
    {
        id: "rajasthan",
        name: "Rajasthan",
        capital: "Jaipur",
        region: "North India",
        famousFood: "Dal Baati Churma"
    },
    {
        id: "sikkim",
        name: "Sikkim",
        capital: "Gangtok",
        region: "North East India",
        famousFood: "Momos, Thukpa"
    },
    {
        id: "tamil-nadu",
        name: "Tamil Nadu",
        capital: "Chennai",
        region: "South India",
        famousFood: "Dosa, Pongal"
    },
    {
        id: "telangana",
        name: "Telangana",
        capital: "Hyderabad",
        region: "South India",
        famousFood: "Hyderabadi Biryani"
    },
    {
        id: "tripura",
        name: "Tripura",
        capital: "Agartala",
        region: "North East India",
        famousFood: "Mui Borok"
    },
    {
        id: "uttar-pradesh",
        name: "Uttar Pradesh",
        capital: "Lucknow",
        region: "North India",
        famousFood: "Awadhi Biryani, Tunday Kabab"
    },
    {
        id: "uttarakhand",
        name: "Uttarakhand",
        capital: "Dehradun",
        region: "North India",
        famousFood: "Aloo Ke Gutke"
    },
    {
        id: "west-bengal",
        name: "West Bengal",
        capital: "Kolkata",
        region: "East India",
        famousFood: "Macher Jhol, Rasgulla"
    }
];

function getStateById(id) {
    return indianStates.find(state => state.id === id);
}

function getStateByName(name) {
    return indianStates.find(
        state => state.name.toLowerCase() === name.toLowerCase()
    );
}

function displayStates(containerId) {
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    indianStates.forEach(state => {
        const card = document.createElement("a");

        card.href = `state.html?state=${encodeURIComponent(state.name)}`;
        card.className = "state-card";

        card.innerHTML = `
            <div class="state-card-content">
                <h3>${state.name}</h3>
                <p>${state.region}</p>
                <span>${state.famousFood}</span>
            </div>
        `;

        container.appendChild(card);
    });
}

window.indianStates = indianStates;
window.getStateById = getStateById;
window.getStateByName = getStateByName;
window.displayStates = displayStates;