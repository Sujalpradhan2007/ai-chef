// AI Cooking Assistant
// AI Chat Engine
// Demo version - real AI API will be connected through backend later.

const AI_CHAT_CONFIG = {
    assistantName: "AI Cooking Assistant",
    language: "en-IN",
    maxHistory: 50
};

const aiChatHistory = [];

const aiKnowledge = [
    {
        keywords: ["hello", "hi", "hey"],
        response:
            "Hello! I am your AI Cooking Assistant. Tell me what you would like to cook today."
    },
    {
        keywords: ["rice", "chawal"],
        response:
            "You can make fried rice, pulao, biryani, lemon rice, or Pakhala Bhata with rice."
    },
    {
        keywords: ["potato", "aloo"],
        response:
            "You can make Aloo Paratha, Aloo Dum, Jeera Aloo, Samosa, or Vada Pav with potatoes."
    },
    {
        keywords: ["paneer"],
        response:
            "You can make Paneer Butter Masala, Chilli Paneer, Paneer Tikka, or Palak Paneer."
    },
    {
        keywords: ["chicken"],
        response:
            "You can make Chicken Biryani, Chicken Curry, Chicken Tikka, Butter Chicken, or Chicken Fried Rice."
    },
    {
        keywords: ["odisha", "odia"],
        response:
            "Popular Odia dishes include Dalma, Pakhala Bhata, Dahi Bara Aloo Dum, Chhena Poda, and Poda Pitha."
    },
    {
        keywords: ["breakfast"],
        response:
            "Good breakfast options include Dosa, Idli, Poha, Upma, Aloo Paratha, and Vegetable Sandwich."
    },
    {
        keywords: ["substitute", "replacement"],
        response:
            "Tell me the ingredient you want to replace and I will suggest possible alternatives."
    }
];

function generateDemoAIResponse(message) {
    const text = String(message || "").toLowerCase();

    for (const item of aiKnowledge) {
        if (
            item.keywords.some(keyword =>
                text.includes(keyword)
            )
        ) {
            return item.response;
        }
    }

    return (
        "I can help you with recipes, ingredients, " +
        "cooking steps, substitutions, Indian cuisines, " +
        "festival recipes, and meal planning. " +
        "Tell me what ingredients you have."
    );
}

function askAI(message) {
    const userMessage = String(message || "").trim();

    if (!userMessage) {
        return {
            success: false,
            message: "Please enter a question."
        };
    }

    const response =
        generateDemoAIResponse(userMessage);

    aiChatHistory.push({
        role: "user",
        content: userMessage,
        timestamp: new Date().toISOString()
    });

    aiChatHistory.push({
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString()
    });

    if (
        aiChatHistory.length >
        AI_CHAT_CONFIG.maxHistory * 2
    ) {
        aiChatHistory.splice(
            0,
            aiChatHistory.length -
                AI_CHAT_CONFIG.maxHistory * 2
        );
    }

    return {
        success: true,
        message: response
    };
}

function getAIChatHistory() {
    return [...aiChatHistory];
}

function clearAIChatHistory() {
    aiChatHistory.length = 0;
}

async function askBackendAI(message) {
    try {
        const response = await fetch(
            "/api/ai/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                "AI server returned an error."
            );
        }

        return await response.json();
    } catch (error) {
        console.error(
            "Backend AI error:",
            error
        );

        return askAI(message);
    }
}

window.AIChat = {
    askAI,
    askBackendAI,
    getHistory: getAIChatHistory,
    clearHistory: clearAIChatHistory
};