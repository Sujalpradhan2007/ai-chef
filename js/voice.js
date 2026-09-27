// AI Cooking Assistant
// Voice Assistant Controller

let speechRecognition = null;
let isListening = false;

function initializeVoiceRecognition() {
    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        return false;
    }

    speechRecognition =
        new SpeechRecognition();

    speechRecognition.continuous = false;
    speechRecognition.interimResults = false;
    speechRecognition.lang = "en-IN";

    speechRecognition.onstart = () => {
        isListening = true;
        updateVoiceButton(true);
    };

    speechRecognition.onresult = event => {
        const transcript =
            event.results[0][0].transcript;

        const input =
            document.getElementById("chatInput");

        if (input) {
            input.value = transcript;
        }
    };

    speechRecognition.onerror = event => {
        console.error(
            "Speech recognition error:",
            event.error
        );

        updateVoiceButton(false);

        if (typeof showNotification === "function") {
            showNotification(
                "Voice recognition could not be started.",
                "error"
            );
        }
    };

    speechRecognition.onend = () => {
        isListening = false;
        updateVoiceButton(false);
    };

    return true;
}

function toggleVoiceRecognition() {
    if (!speechRecognition) {
        const supported =
            initializeVoiceRecognition();

        if (!supported) {
            alert(
                "Voice recognition is not supported in this browser."
            );
            return;
        }
    }

    if (isListening) {
        speechRecognition.stop();
    } else {
        speechRecognition.start();
    }
}

function updateVoiceButton(active) {
    const buttons =
        document.querySelectorAll(
            "[data-voice-button]"
        );

    buttons.forEach(button => {
        button.classList.toggle(
            "recording",
            active
        );

        button.setAttribute(
            "aria-label",
            active
                ? "Stop voice input"
                : "Start voice input"
        );
    });
}

function speakText(text) {
    if (!("speechSynthesis" in window)) {
        return;
    }

    window.speechSynthesis.cancel();

    const utterance =
        new SpeechSynthesisUtterance(text);

    utterance.lang = "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.speak(
        utterance
    );
}

document.addEventListener("DOMContentLoaded", () => {
    initializeVoiceRecognition();

    document
        .querySelectorAll("[data-voice-button]")
        .forEach(button => {
            button.addEventListener(
                "click",
                toggleVoiceRecognition
            );
        });
});

window.toggleVoiceRecognition =
    toggleVoiceRecognition;

window.speakText = speakText;