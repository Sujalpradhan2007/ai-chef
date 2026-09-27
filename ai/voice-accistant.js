// AI Cooking Assistant
// Voice Cooking Assistant
//
// Browser voice input/output for the frontend.
// Real AI voice conversation will be connected
// through the backend later.

class VoiceCookingAssistant {

    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.language = "en-IN";

        this.initializeRecognition();
    }

    initializeRecognition() {
        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            return false;
        }

        this.recognition =
            new SpeechRecognition();

        this.recognition.continuous =
            false;

        this.recognition.interimResults =
            false;

        this.recognition.lang =
            this.language;

        this.recognition.onstart = () => {
            this.isListening = true;

            this.updateUI(true);
        };

        this.recognition.onresult =
            event => {
                const transcript =
                    event.results[0][0]
                        .transcript;

                this.handleSpeechResult(
                    transcript
                );
            };

        this.recognition.onerror =
            event => {
                console.error(
                    "Voice error:",
                    event.error
                );

                this.isListening =
                    false;

                this.updateUI(false);
            };

        this.recognition.onend = () => {
            this.isListening =
                false;

            this.updateUI(false);
        };

        return true;
    }

    start() {
        if (!this.recognition) {
            const initialized =
                this.initializeRecognition();

            if (!initialized) {
                return {
                    success: false,
                    message:
                        "Voice recognition is not supported by this browser."
                };
            }
        }

        if (this.isListening) {
            return {
                success: true,
                message:
                    "Voice recognition is already running."
            };
        }

        try {
            this.recognition.start();

            return {
                success: true,
                message:
                    "Listening..."
            };
        } catch (error) {
            console.error(error);

            return {
                success: false,
                message:
                    "Unable to start voice recognition."
            };
        }
    }

    stop() {
        if (
            this.recognition &&
            this.isListening
        ) {
            this.recognition.stop();
        }
    }

    toggle() {
        if (this.isListening) {
            this.stop();
        } else {
            this.start();
        }
    }

    handleSpeechResult(
        transcript
    ) {
        const input =
            document.getElementById(
                "chatInput"
            );

        if (input) {
            input.value =
                transcript;
        }

        if (
            typeof window.sendAIMessage ===
            "function"
        ) {
            window.sendAIMessage(
                transcript
            );

            if (input) {
                input.value = "";
            }
        }
    }

    updateUI(active) {
        document
            .querySelectorAll(
                "[data-voice-button]"
            )
            .forEach(button => {
                button.classList.toggle(
                    "recording",
                    active
                );
            });
    }

    speak(
        text
    ) {
        if (
            !("speechSynthesis" in window)
        ) {
            return false;
        }

        window.speechSynthesis.cancel();

        const utterance =
            new SpeechSynthesisUtterance(
                text
            );

        utterance.lang =
            this.language;

        utterance.rate = 1;
        utterance.pitch = 1;

        window.speechSynthesis.speak(
            utterance
        );

        return true;
    }

    stopSpeaking() {
        if (
            "speechSynthesis" in
            window
        ) {
            window.speechSynthesis.cancel();
        }
    }
}

const voiceCookingAssistant =
    new VoiceCookingAssistant();

document.addEventListener(
    "DOMContentLoaded",
    () => {
        document
            .querySelectorAll(
                "[data-voice-button]"
            )
            .forEach(button => {
                button.addEventListener(
                    "click",
                    () => {
                        voiceCookingAssistant.toggle();
                    }
                );
            });
    }
);

window.VoiceCookingAssistant =
    voiceCookingAssistant;