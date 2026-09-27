"use strict";

const API_BASE_URL = "http://127.0.0.1:5000/api";


/* --------------------------------------------------
   Utility
-------------------------------------------------- */

function showToast(
    message,
    type = "success"
) {

    const container =
        document.getElementById("toastContainer");

    if (!container) {
        return;
    }

    const toast =
        document.createElement("div");

    toast.className =
        `toast ${type}`;

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3500);
}


async function apiRequest(
    endpoint,
    options = {}
) {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}${endpoint}`,
                {
                    headers: {
                        "Content-Type":
                            "application/json",
                        ...(options.headers || {})
                    },
                    ...options
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Request failed."
            );
        }

        return data;

    } catch (error) {

        console.error(
            "API Error:",
            error
        );

        throw error;
    }
}


/* --------------------------------------------------
   Sidebar
-------------------------------------------------- */

function initializeSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    const toggle =
        document.getElementById("sidebarToggle");

    if (!sidebar || !toggle) {
        return;
    }

    toggle.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );

        }
    );


    document.addEventListener(
        "click",
        event => {

            if (
                window.innerWidth > 800
            ) {
                return;
            }

            if (
                !sidebar.contains(
                    event.target
                ) &&
                !toggle.contains(
                    event.target
                )
            ) {

                sidebar.classList.remove(
                    "open"
                );
            }

        }
    );

}


/* --------------------------------------------------
   Active Navigation
-------------------------------------------------- */

function setActiveNavigation() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop() ||
        "index.html";

    document
        .querySelectorAll(
            ".sidebar-nav .nav-item"
        )
        .forEach(link => {

            const href =
                link.getAttribute("href");

            link.classList.toggle(
                "active",
                href === currentPage
            );

        });

}


/* --------------------------------------------------
   Logout
-------------------------------------------------- */

function initializeLogout() {

    const button =
        document.getElementById(
            "logoutButton"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        () => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to logout?"
                );

            if (!confirmed) {
                return;
            }

            localStorage.removeItem(
                "aiCookingAdmin"
            );

            showToast(
                "Logged out successfully.",
                "success"
            );

            setTimeout(() => {

                window.location.href =
                    "../index.html";

            }, 800);

        }
    );

}


/* --------------------------------------------------
   Dashboard
-------------------------------------------------- */

async function loadDashboardStats() {

    const totalRecipes =
        document.getElementById(
            "totalRecipes"
        );

    const totalUsers =
        document.getElementById(
            "totalUsers"
        );

    const pendingSubmissions =
        document.getElementById(
            "pendingSubmissions"
        );

    const totalStates =
        document.getElementById(
            "totalStates"
        );


    try {

        const recipes =
            await apiRequest(
                "/recipes/"
            );

        if (totalRecipes) {

            totalRecipes.textContent =
                recipes.count || 0;

        }

    } catch (error) {

        if (totalRecipes) {
            totalRecipes.textContent = "0";
        }

    }


    try {

        const users =
            await apiRequest(
                "/users/"
            );

        if (totalUsers) {

            totalUsers.textContent =
                users.users
                    ? users.users.length
                    : 0;

        }

    } catch (error) {

        if (totalUsers) {
            totalUsers.textContent = "0";
        }

    }


    try {

        const submissions =
            await apiRequest(
                "/submissions/?status=pending"
            );

        if (pendingSubmissions) {

            pendingSubmissions.textContent =
                submissions.count || 0;

        }

    } catch (error) {

        if (pendingSubmissions) {
            pendingSubmissions.textContent =
                "0";
        }

    }


    try {

        const response =
            await fetch(
                "../data/states.json"
            );

        const states =
            await response.json();

        if (totalStates) {

            totalStates.textContent =
                states.length || 0;

        }

    } catch (error) {

        if (totalStates) {
            totalStates.textContent = "0";
        }

    }

}


/* --------------------------------------------------
   Recent Submissions
-------------------------------------------------- */

async function loadRecentSubmissions() {

    const container =
        document.getElementById(
            "recentSubmissions"
        );

    if (!container) {
        return;
    }

    try {

        const data =
            await apiRequest(
                "/submissions/"
            );

        const submissions =
            data.submissions || [];

        if (!submissions.length) {

            container.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-file-circle-check"></i>
                    <h3>No submissions yet</h3>
                    <p>
                        User submitted recipes
                        will appear here.
                    </p>
                </div>
            `;

            return;
        }


        const recent =
            submissions
                .slice(-5)
                .reverse();


        container.innerHTML = `
            <table class="admin-table">

                <thead>
                    <tr>
                        <th>Recipe</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>

                    ${recent.map(
                        submission => {

                            const recipe =
                                submission.recipe_data ||
                                {};

                            const status =
                                submission.status;

                            let badgeClass =
                                "badge-warning";

                            if (
                                status ===
                                "approved"
                            ) {
                                badgeClass =
                                    "badge-success";
                            }

                            if (
                                status ===
                                "rejected"
                            ) {
                                badgeClass =
                                    "badge-danger";
                            }

                            return `
                                <tr>

                                    <td>
                                        ${
                                            recipe.name ||
                                            "Untitled Recipe"
                                        }
                                    </td>

                                    <td>
                                        <span
                                            class="badge ${badgeClass}"
                                        >
                                            ${status}
                                        </span>
                                    </td>

                                    <td>
                                        ${
                                            submission.created_at
                                                ? new Date(
                                                    submission.created_at
                                                  ).toLocaleDateString()
                                                : "-"
                                        }
                                    </td>

                                </tr>
                            `;

                        }
                    ).join("")}

                </tbody>

            </table>
        `;

    } catch (error) {

        container.innerHTML = `
            <div class="empty-state">

                <i class="fa-solid fa-server"></i>

                <h3>Backend not connected</h3>

                <p>
                    Start the Flask backend
                    to load live submissions.
                </p>

            </div>
        `;

    }

}


/* --------------------------------------------------
   Global Initialization
-------------------------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeSidebar();

        setActiveNavigation();

        initializeLogout();

        loadDashboardStats();

        loadRecentSubmissions();

    }
);


/* Global API helper */

window.AdminPanel = {

    API_BASE_URL,

    apiRequest,

    showToast

};