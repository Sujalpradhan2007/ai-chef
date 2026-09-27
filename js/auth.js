// AI Cooking Assistant
// Authentication Controller
// Frontend demo only.
// Real authentication will be connected to the backend later.

const USER_KEY =
    "aiCookingUser";

const LOGIN_KEY =
    "aiCookingLoggedIn";

function getCurrentUser() {
    try {
        return JSON.parse(
            localStorage.getItem(
                USER_KEY
            )
        );
    } catch {
        return null;
    }
}

function isLoggedIn() {
    return (
        localStorage.getItem(
            LOGIN_KEY
        ) === "true"
    );
}

function loginUser(user) {
    localStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
    );

    localStorage.setItem(
        LOGIN_KEY,
        "true"
    );
}

function logoutUser() {
    localStorage.removeItem(
        LOGIN_KEY
    );

    window.location.href =
        "login.html";
}

function requireLogin() {
    if (!isLoggedIn()) {
        window.location.href =
            "login.html";
        return false;
    }

    return true;
}

function updateUserProfile(updates) {
    const user =
        getCurrentUser();

    if (!user) return null;

    const updatedUser = {
        ...user,
        ...updates
    };

    localStorage.setItem(
        USER_KEY,
        JSON.stringify(
            updatedUser
        )
    );

    return updatedUser;
}

function getUserSubmissions() {
    const user =
        getCurrentUser();

    if (!user) return [];

    const submissions =
        typeof getRecipeSubmissions === "function"
            ? getRecipeSubmissions()
            : [];

    return submissions.filter(
        item =>
            item.submittedBy ===
            user.name
    );
}

function updateAuthUI() {
    const user =
        getCurrentUser();

    document
        .querySelectorAll(
            "[data-user-name]"
        )
        .forEach(element => {
            element.textContent =
                user?.name ||
                "Guest";
        });

    document
        .querySelectorAll(
            "[data-login-only]"
        )
        .forEach(element => {
            element.style.display =
                isLoggedIn()
                    ? ""
                    : "none";
        });

    document
        .querySelectorAll(
            "[data-guest-only]"
        )
        .forEach(element => {
            element.style.display =
                isLoggedIn()
                    ? "none"
                    : "";
        });
}

document.addEventListener(
    "DOMContentLoaded",
    updateAuthUI
);

window.getCurrentUser =
    getCurrentUser;

window.isLoggedIn =
    isLoggedIn;

window.loginUser =
    loginUser;

window.logoutUser =
    logoutUser;

window.requireLogin =
    requireLogin;

window.updateUserProfile =
    updateUserProfile;

window.getUserSubmissions =
    getUserSubmissions;