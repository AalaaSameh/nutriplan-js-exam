
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("sidebar-overlay");
const openBtn = document.getElementById("header-menu-btn");
const closeBtn = document.getElementById("sidebar-close-btn");
const mainContent = document.getElementById("main-content");

const mediaQuery = window.matchMedia("(min-width: 1024px)");

export function openSidebar() {
    if (mediaQuery.matches) return;

    sidebar.classList.remove("hidden");
    sidebar.classList.add("open");
    sidebar.style.transform = "translateX(0)";

    overlay.classList.remove("hidden");
    overlay.classList.add("active");
}

export function closeSidebar() {
    if (mediaQuery.matches) return;

    sidebar.classList.remove("open");
    sidebar.style.transform = "translateX(-100%)";

    overlay.classList.add("hidden");
    overlay.classList.remove("active");
}

function updateLayout() {
    if (mediaQuery.matches) {
        sidebar.classList.remove("hidden", "open");
        sidebar.style.transform = "translateX(0)";

        openBtn.classList.add("hidden");
        closeBtn.classList.add("hidden");

        overlay.classList.add("hidden");
        overlay.classList.remove("active");
    } else {

        openBtn.classList.remove("hidden");
        closeBtn.classList.remove("hidden");

        closeSidebar();
    }
}

export function initSidebar() {
    openBtn.addEventListener("click", openSidebar);
    closeBtn.addEventListener("click", closeSidebar);
    overlay.addEventListener("click", closeSidebar);

    mediaQuery.addEventListener("change", updateLayout);

    updateLayout();
}
