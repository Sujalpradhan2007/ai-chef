// AI Cooking Assistant
// Navigation Controller

document.addEventListener("DOMContentLoaded", () => {
    const mobileMenuButton = document.getElementById("mobileMenuButton");
    const mobileMenu = document.getElementById("mobileMenu");
    const mainHeader = document.getElementById("mainHeader");
    const backToTop = document.getElementById("backToTop");

    // Mobile menu
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener("click", () => {
            mobileMenu.classList.toggle("active");
            mobileMenuButton.classList.toggle("active");
        });

        mobileMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("active");
                mobileMenuButton.classList.remove("active");
            });
        });
    }

    // Header scroll effect
    window.addEventListener("scroll", () => {
        if (mainHeader) {
            mainHeader.classList.toggle("scrolled", window.scrollY > 50);
        }

        if (backToTop) {
            backToTop.classList.toggle("show", window.scrollY > 400);
        }
    });

    // Back to top
    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // Current year
    const yearElements = document.querySelectorAll("#currentYear");

    yearElements.forEach(element => {
        element.textContent = new Date().getFullYear();
    });
});