// AI Cooking Assistant
// AI Chat Controller

let chatMessages = [];

const demoResponses = [
    {
        keywords: ["paneer", "paneer recipe"],
        response:
            "You can make Paneer Butter Masala, Chilli Paneer, Paneer Tikka, or Palak Paneer. Tell me what other ingredients you have and I can suggest a recipe."
    },
    {
        keywords: ["rice"],
        response:
            "With rice you can make Fried Rice, Pulao, Biryani, Lemon Rice, or Pakhala. Tell me your available vegetables or protein."
    },
    {
        keywords: ["potato", "aloo"],
        response:
            "You can make Aloo Paratha, Aloo Dum, Jeera Aloo, Aloo Fry, or Samosa. I can give you the full recipe."
    },
    {
        keywords: ["chicken"],
        response:
            "Some options are Chicken Biryani, Chicken Curry, Chicken Tikka, Butter Chicken, and Chicken Fried Rice."
    },
    {
        keywords: ["breakfast"],
        response:
            "For breakfast, try Dosa, Idli, Poha, Upma, Aloo Paratha, or Vegetable Sandwich."
    },
    {
        keywords: ["odisha", "odia"],
        response:
            "Popular Odia dishes include Dalma, Pakhala Bhata, Dahi Bara Aloo Dum, Chhena Poda, Poda Pitha, and Macha Besara."
    }
];

function getDemoAIResponse(message) {
    const text = message.toLowerCase();

    for (const item of demoResponses) {
        if (item.keywords.some(keyword => text.includes(keyword))) {
            return item.response;
        }
    }

    return "I can help you with recipes, ingredients, cooking steps, substitutions, Indian cuisines, festivals, and meal ideas. Tell me what you want to cook.";
}

function addChatMessage(message, sender = "user") {
    const chatContainer =
        document.getElementById("chatMessages");

    if (!chatContainer) return;

    const messageElement =
        document.createElement("div");

    messageElement.className =
        `chat-message ${sender}`;

    messageElement.innerHTML = `
        <div class="chat-message-content">
            ${escapeChatHTML(message)}
        </div>
    `;

    chatContainer.appendChild(messageElement);

    chatContainer.scrollTop =
        chatContainer.scrollHeight;

    chatMessages.push({
        sender,
        message,
        timestamp: new Date().toISOString()
    });
}

function sendAIMessage(message) {
    const text = message.trim();

    if (!text) return;

    addChatMessage(text, "user");

    const typing = document.createElement("div");

    typing.className = "chat-message ai typing-message";

    typing.innerHTML = `
        <div class="chat-message-content">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        </div>
    `;

    const container =
        document.getElementById("chatMessages");

    if (container) {
        container.appendChild(typing);
        container.scrollTop = container.scrollHeight;
    }

    setTimeout(() => {
        typing.remove();

        const response =
            getDemoAIResponse(text);

        addChatMessage(response, "ai");
    }, 900);
}

function clearAIChat() {
    const container =
        document.getElementById("chatMessages");

    if (container) {
        container.innerHTML = "";
    }

    chatMessages = [];

    addChatMessage(
        "Hello! I am your AI Cooking Assistant. What would you like to cook today?",
        "ai"
    );
}

function escapeChatHTML(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", () => {
    const input =
        document.getElementById("chatInput");

    const sendButton =
        document.getElementById("sendChatButton");

    if (sendButton && input) {
        sendButton.addEventListener("click", () => {
            sendAIMessage(input.value);
            input.value = "";
        });

        input.addEventListener("keydown", event => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();

                sendAIMessage(input.value);
                input.value = "";
            }
        });
    }

    const quickButtons =
        document.querySelectorAll("[data-ai-prompt]");

    quickButtons.forEach(button => {
        button.addEventListener("click", () => {
            const prompt =
                button.dataset.aiPrompt;

            if (input) {
                input.value = prompt;
                sendAIMessage(prompt);
                input.value = "";
            }
        });
    });

    const clearButton =
        document.getElementById("clearChatButton");

    if (clearButton) {
        clearButton.addEventListener(
            "click",
            clearAIChat
        );
    }
});

window.sendAIMessage = sendAIMessage;
window.clearAIChat = clearAIChat;
window.addChatMessage = addChatMessage;