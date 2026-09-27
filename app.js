/* =========================================================
   AI COOKING ASSISTANT
   Main Frontend JavaScript
========================================================= */

"use strict";


/* =========================================================
   1. DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializePageLoader();
    initializeMobileMenu();
    initializeHeaderScroll();
    initializeBackToTop();
    initializeCurrentYear();
    initializeHeroSearch();
    initializeIngredientFinder();
    initializeIngredientTags();
    initializeFavoriteButtons();
    initializeSmoothScrolling();
    initializeScrollReveal();
    initializeKeyboardShortcuts();

});


/* =========================================================
   2. PAGE LOADER
========================================================= */

function initializePageLoader() {

    const loader = document.getElementById("pageLoader");

    if (!loader) {
        return;
    }

    window.addEventListener("load", () => {

        setTimeout(() => {

            loader.classList.add("hidden");

        }, 500);

    });

}


/* =========================================================
   3. MOBILE MENU
========================================================= */

function initializeMobileMenu() {

    const menuButton =
        document.getElementById("mobileMenuButton");

    const mobileMenu =
        document.getElementById("mobileMenu");

    if (!menuButton || !mobileMenu) {
        return;
    }


    menuButton.addEventListener("click", () => {

        const isOpen =
            mobileMenu.classList.toggle("open");

        document.body.classList.toggle(
            "menu-open",
            isOpen
        );


        const icon =
            menuButton.querySelector("i");

        if (icon) {

            if (isOpen) {

                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");

                menuButton.setAttribute(
                    "aria-label",
                    "Close menu"
                );

            } else {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

                menuButton.setAttribute(
                    "aria-label",
                    "Open menu"
                );

            }

        }

    });


    /* Close menu when a link is clicked */

    const menuLinks =
        mobileMenu.querySelectorAll("a");

    menuLinks.forEach((link) => {

        link.addEventListener("click", () => {

            closeMobileMenu();

        });

    });


    /* Close menu when clicking outside */

    document.addEventListener("click", (event) => {

        if (
            mobileMenu.classList.contains("open") &&
            !mobileMenu.contains(event.target) &&
            !menuButton.contains(event.target)
        ) {

            closeMobileMenu();

        }

    });


    /* Close menu with Escape */

    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Escape" &&
            mobileMenu.classList.contains("open")
        ) {

            closeMobileMenu();

        }

    });


    function closeMobileMenu() {

        mobileMenu.classList.remove("open");

        document.body.classList.remove(
            "menu-open"
        );


        const icon =
            menuButton.querySelector("i");

        if (icon) {

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        }

        menuButton.setAttribute(
            "aria-label",
            "Open menu"
        );

    }

}


/* =========================================================
   4. HEADER SCROLL EFFECT
========================================================= */

function initializeHeaderScroll() {

    const header =
        document.getElementById("mainHeader");

    if (!header) {
        return;
    }


    function updateHeader() {

        if (window.scrollY > 30) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }


    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

}


/* =========================================================
   5. BACK TO TOP
========================================================= */

function initializeBackToTop() {

    const button =
        document.getElementById("backToTop");

    if (!button) {
        return;
    }


    function updateButton() {

        if (window.scrollY > 500) {

            button.classList.add("visible");

        } else {

            button.classList.remove("visible");

        }

    }


    updateButton();


    window.addEventListener(
        "scroll",
        updateButton,
        { passive: true }
    );


    button.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


/* =========================================================
   6. CURRENT YEAR
========================================================= */

function initializeCurrentYear() {

    const yearElement =
        document.getElementById("currentYear");

    if (!yearElement) {
        return;
    }

    yearElement.textContent =
        new Date().getFullYear();

}


/* =========================================================
   7. HERO SEARCH
========================================================= */

function initializeHeroSearch() {

    const input =
        document.getElementById("heroSearchInput");

    const button =
        document.getElementById("heroSearchButton");

    if (!input || !button) {
        return;
    }


    function performSearch() {

        const query =
            input.value.trim();

        if (!query) {

            showNotification(
                "Please enter a recipe, ingredient or dish name.",
                "warning"
            );

            input.focus();

            return;
        }


        /*
         * For now the search redirects to the states/recipe
         * page with the search query.
         *
         * Later this will connect to the real recipe database.
         */

        const searchUrl =
            `pages/states.html?search=${encodeURIComponent(query)}`;

        window.location.href = searchUrl;

    }


    button.addEventListener(
        "click",
        performSearch
    );


    input.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            performSearch();

        }

    });

}


/* =========================================================
   8. INGREDIENT FINDER
========================================================= */

function initializeIngredientFinder() {

    const input =
        document.getElementById("ingredientInput");

    const button =
        document.getElementById("findRecipeButton");

    if (!input || !button) {
        return;
    }


    function findRecipes() {

        const ingredients =
            input.value.trim();

        if (!ingredients) {

            showNotification(
                "Please enter at least one ingredient.",
                "warning"
            );

            input.focus();

            return;
        }


        /*
         * Convert ingredients into URL parameters.
         *
         * Example:
         * potato, onion, tomato
         */

        const ingredientQuery =
            encodeURIComponent(ingredients);

        const targetUrl =
            `pages/ingredient-finder.html?ingredients=${ingredientQuery}`;


        window.location.href = targetUrl;

    }


    button.addEventListener(
        "click",
        findRecipes
    );


    input.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            findRecipes();

        }

    });

}


/* =========================================================
   9. INGREDIENT QUICK TAGS
========================================================= */

function initializeIngredientTags() {

    const tags =
        document.querySelectorAll(".ingredient-tag");

    const input =
        document.getElementById("ingredientInput");

    if (!tags.length || !input) {
        return;
    }


    tags.forEach((tag) => {

        tag.addEventListener("click", () => {

            const ingredient =
                tag.dataset.ingredient;

            if (!ingredient) {
                return;
            }


            const currentValue =
                input.value.trim();


            if (!currentValue) {

                input.value = ingredient;

            } else {

                const ingredients =
                    currentValue
                    .split(",")
                    .map(item => item.trim())
                    .filter(Boolean);


                if (
                    !ingredients.some(
                        item =>
                            item.toLowerCase() ===
                            ingredient.toLowerCase()
                    )
                ) {

                    ingredients.push(ingredient);

                }


                input.value =
                    ingredients.join(", ");

            }


            input.focus();

        });

    });

}


/* =========================================================
   10. FAVORITE BUTTONS
========================================================= */

function initializeFavoriteButtons() {

    const buttons =
        document.querySelectorAll(
            ".favorite-button"
        );

    if (!buttons.length) {
        return;
    }


    buttons.forEach((button, index) => {

        /*
         * Temporary local identifier.
         *
         * Later this will use the actual recipe ID
         * from the database.
         */

        const recipeId =
            button.dataset.recipeId ||
            `home-recipe-${index + 1}`;


        const storageKey =
            `favorite-${recipeId}`;


        const icon =
            button.querySelector("i");


        /* Restore saved state */

        const saved =
            localStorage.getItem(storageKey);


        if (saved === "true") {

            button.classList.add("active");

            if (icon) {

                icon.classList.remove(
                    "fa-regular"
                );

                icon.classList.add(
                    "fa-solid"
                );

            }

        }


        button.addEventListener("click", (event) => {

            event.preventDefault();
            event.stopPropagation();


            const active =
                button.classList.toggle("active");


            if (active) {

                localStorage.setItem(
                    storageKey,
                    "true"
                );


                if (icon) {

                    icon.classList.remove(
                        "fa-regular"
                    );

                    icon.classList.add(
                        "fa-solid"
                    );

                }


                showNotification(
                    "Recipe added to favorites.",
                    "success"
                );

            } else {

                localStorage.removeItem(
                    storageKey
                );


                if (icon) {

                    icon.classList.remove(
                        "fa-solid"
                    );

                    icon.classList.add(
                        "fa-regular"
                    );

                }


                showNotification(
                    "Recipe removed from favorites.",
                    "info"
                );

            }

        });

    });

}


/* =========================================================
   11. SMOOTH SCROLLING
========================================================= */

function initializeSmoothScrolling() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    if (!links.length) {
        return;
    }


    links.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");


            if (
                !targetId ||
                targetId === "#"
            ) {

                return;

            }


            const target =
                document.querySelector(targetId);


            if (!target) {
                return;
            }


            event.preventDefault();


            const header =
                document.getElementById(
                    "mainHeader"
                );


            const headerHeight =
                header
                    ? header.offsetHeight
                    : 0;


            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;


            window.scrollTo({

                top: targetPosition,

                behavior: "smooth"

            });

        });

    });

}


/* =========================================================
   12. SCROLL REVEAL
========================================================= */

function initializeScrollReveal() {

    /*
     * Add reveal class to selected sections/cards.
     */

    const elements =
        document.querySelectorAll(
            ".ai-feature-card, " +
            ".state-card, " +
            ".recipe-card, " +
            ".festival-card, " +
            ".cuisine-card, " +
            ".step-card"
        );


    if (!elements.length) {
        return;
    }


    elements.forEach((element) => {

        element.classList.add("reveal");

    });


    if (
        !("IntersectionObserver" in window)
    ) {

        elements.forEach((element) => {

            element.classList.add("active");

        });

        return;

    }


    const observer =
        new IntersectionObserver(
            (entries, observerInstance) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    entry.target.classList.add(
                        "active"
                    );


                    observerInstance.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -40px 0px"
            }
        );


    elements.forEach((element) => {

        observer.observe(element);

    });

}


/* =========================================================
   13. NOTIFICATION SYSTEM
========================================================= */

function showNotification(
    message,
    type = "info"
) {

    /*
     * Remove old notification first.
     */

    const oldNotification =
        document.querySelector(
            ".site-notification"
        );


    if (oldNotification) {

        oldNotification.remove();

    }


    const notification =
        document.createElement("div");


    notification.className =
        `site-notification notification-${type}`;


    const iconMap = {

        success:
            "fa-circle-check",

        warning:
            "fa-triangle-exclamation",

        error:
            "fa-circle-xmark",

        info:
            "fa-circle-info"

    };


    const icon =
        iconMap[type] ||
        iconMap.info;


    notification.innerHTML = `

        <div class="notification-icon">

            <i class="fa-solid ${icon}"></i>

        </div>

        <div class="notification-message">

            ${escapeHTML(message)}

        </div>

        <button
            class="notification-close"
            aria-label="Close notification">

            <i class="fa-solid fa-xmark"></i>

        </button>

    `;


    document.body.appendChild(
        notification
    );


    /*
     * Add temporary notification styles.
     */

    injectNotificationStyles();


    requestAnimationFrame(() => {

        notification.classList.add(
            "show"
        );

    });


    const closeButton =
        notification.querySelector(
            ".notification-close"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            () => {

                removeNotification(
                    notification
                );

            }
        );

    }


    const timeout =
        setTimeout(() => {

            removeNotification(
                notification
            );

        }, 4000);


    notification.dataset.timeout =
        timeout.toString();

}


/* =========================================================
   14. REMOVE NOTIFICATION
========================================================= */

function removeNotification(
    notification
) {

    if (!notification) {
        return;
    }


    notification.classList.remove(
        "show"
    );


    setTimeout(() => {

        notification.remove();

    }, 300);

}


/* =========================================================
   15. NOTIFICATION CSS
========================================================= */

function injectNotificationStyles() {

    if (
        document.getElementById(
            "notificationStyles"
        )
    ) {

        return;

    }


    const style =
        document.createElement("style");


    style.id =
        "notificationStyles";


    style.textContent = `

        .site-notification {

            position: fixed;

            top: 95px;
            right: 20px;

            z-index: 99999;

            width: min(
                calc(100% - 40px),
                380px
            );

            display: flex;

            align-items: center;

            gap: 12px;

            padding: 14px 15px;

            background: #ffffff;

            border: 1px solid #eeeeee;

            border-radius: 13px;

            box-shadow:
                0 15px 40px rgba(
                    0,
                    0,
                    0,
                    0.15
                );

            opacity: 0;

            transform:
                translateX(30px);

            transition:
                opacity 0.3s ease,
                transform 0.3s ease;

        }


        .site-notification.show {

            opacity: 1;

            transform:
                translateX(0);

        }


        .notification-icon {

            width: 35px;
            height: 35px;

            display: flex;

            align-items: center;

            justify-content: center;

            flex-shrink: 0;

            border-radius: 9px;

            background: #fff1eb;

            color: #ff6b35;

        }


        .notification-message {

            flex: 1;

            color: #333333;

            font-size: 12px;

            line-height: 1.5;

            font-weight: 600;

        }


        .notification-close {

            width: 28px;
            height: 28px;

            display: flex;

            align-items: center;

            justify-content: center;

            flex-shrink: 0;

            color: #888888;

            background: transparent;

            border-radius: 7px;

        }


        .notification-close:hover {

            color: #333333;

            background: #f5f5f5;

        }


        .notification-success
        .notification-icon {

            color: #22a06b;

            background: #eaf8f1;

        }


        .notification-warning
        .notification-icon {

            color: #d88900;

            background: #fff6dd;

        }


        .notification-error
        .notification-icon {

            color: #e63946;

            background: #ffebed;

        }


        @media (max-width: 500px) {

            .site-notification {

                top: 80px;

                right: 14px;

                width:
                    calc(100% - 28px);

            }

        }

    `;


    document.head.appendChild(style);

}


/* =========================================================
   16. ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    const element =
        document.createElement("div");


    element.textContent =
        String(value);


    return element.innerHTML;

}


/* =========================================================
   17. KEYBOARD SHORTCUTS
========================================================= */

function initializeKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        (event) => {

            /*
             * "/" focuses the main search box.
             */

            if (
                event.key === "/" &&
                !isTypingInInput(event.target)
            ) {

                event.preventDefault();


                const searchInput =
                    document.getElementById(
                        "heroSearchInput"
                    );


                if (searchInput) {

                    searchInput.focus();

                }

            }


            /*
             * Escape closes mobile menu.
             */

            if (
                event.key === "Escape"
            ) {

                const menu =
                    document.getElementById(
                        "mobileMenu"
                    );


                if (
                    menu &&
                    menu.classList.contains(
                        "open"
                    )
                ) {

                    menu.classList.remove(
                        "open"
                    );

                    document.body.classList.remove(
                        "menu-open"
                    );

                }

            }

        }
    );

}


/* =========================================================
   18. CHECK TYPING ELEMENT
========================================================= */

function isTypingInInput(element) {

    if (!element) {
        return false;
    }


    const tagName =
        element.tagName.toLowerCase();


    return (
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        element.isContentEditable
    );

}


/* =========================================================
   19. WINDOW RESIZE HANDLER
========================================================= */

window.addEventListener(
    "resize",
    debounce(() => {

        /*
         * If desktop width is reached while mobile
         * menu is open, close the mobile menu.
         */

        if (window.innerWidth > 900) {

            const mobileMenu =
                document.getElementById(
                    "mobileMenu"
                );


            if (mobileMenu) {

                mobileMenu.classList.remove(
                    "open"
                );

            }


            document.body.classList.remove(
                "menu-open"
            );

        }

    }, 200)
);


/* =========================================================
   20. DEBOUNCE
========================================================= */

function debounce(
    callback,
    delay = 200
) {

    let timeout;


    return function (...args) {

        clearTimeout(timeout);


        timeout = setTimeout(() => {

            callback.apply(
                this,
                args
            );

        }, delay);

    };

}


/* =========================================================
   21. GLOBAL APP OBJECT
========================================================= */

window.AICookingAssistant = {

    version: "1.0.0",

    showNotification,

    escapeHTML,

    debounce

};


/* =========================================================
   END OF APP.JS
========================================================= */