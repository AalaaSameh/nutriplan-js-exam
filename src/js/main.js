
import { initSidebar, closeSidebar } from "./sidebar.js";
import { getCategories } from "./categories.js";
import { getAreas } from "./areas.js";
import { getMealDetails } from "./mealDetails.js";
import { getProducts, getProductByBarcode, filterProductsByGrade, getProductsByCategory, getProductCategories, initProductModal } from "./products.js";
import { displayFoodLog } from "./foodLog.js";

const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section");
const recipesGrid = document.getElementById("recipes-grid");
const gridBtn = document.getElementById("grid-view-btn");
const listBtn = document.getElementById("list-view-btn");
const recipesCount = document.getElementById("recipes-count");
const searchInput = document.getElementById("search-input");
const productSearchInput = document.getElementById("product-search-input");
const searchProductBtn = document.getElementById("search-product-btn");

const barcodeInput = document.getElementById("barcode-input");
const lookupBarcodeBtn = document.getElementById("lookup-barcode-btn");

const nutriScoreButtons = document.querySelectorAll(".nutri-score-filter");

// const productCategoryButtons = document.querySelectorAll(".product-category-btn");

const pages = {
    meals: [
        "search-filters-section",
        "meal-categories-section",
        "all-recipes-section"
    ],
    products: ["products-section"],
    foodlog: ["foodlog-section"],
    details: ["meal-details"]
};

const pageNames = ["meals", "products", "foodlog"];

let currentView = "grid";
let requestNumber = 0;


searchInput.addEventListener("input", function() {
    getRecipes("", "", searchInput.value.trim());
});

searchProductBtn.addEventListener("click", function() {
    const search = productSearchInput.value.trim();

    if (search === "") return;

    getProducts(search);
});

lookupBarcodeBtn.addEventListener("click", function() {
    const barcode = barcodeInput.value.trim();

    if (barcode === "") return;

    getProductByBarcode(barcode);
});

nutriScoreButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const grade = button.dataset.grade;

        filterProductsByGrade(grade);
    });
});

document.getElementById("product-categories").addEventListener("click", function(e) {
    const button = e.target.closest(".product-category-btn");

    if (!button) return;

    const category = button.dataset.category;

    getProductsByCategory(category);
});

function showPage(pageName) {
    if (!pages[pageName]) {
        pageName = "meals";
    }

    sections.forEach((section) => {
        section.classList.add("hidden");
    });

    pages[pageName].forEach((sectionId) => {
        document.getElementById(sectionId).classList.remove("hidden");
    });

    navLinks.forEach((link, index) => {
        const isActive = pageNames[index] === pageName ||
            (pageName === "details" && pageNames[index] === "meals");

        link.classList.toggle("bg-emerald-50", isActive);
        link.classList.toggle("text-emerald-700", isActive);
        link.classList.toggle("text-gray-600", !isActive);
    });

    if (pageName === "foodlog") {
        displayFoodLog();
    }
}

function changeView(view) {
    currentView = view;

    const isGrid = view === "grid";

    recipesGrid.classList.toggle("grid-cols-4", isGrid);
    recipesGrid.classList.toggle("grid-cols-2", !isGrid);

    gridBtn.classList.toggle("bg-white", isGrid);
    gridBtn.classList.toggle("rounded-md", isGrid);
    gridBtn.classList.toggle("shadow-sm", isGrid);

    listBtn.classList.toggle("bg-white", !isGrid);
    listBtn.classList.toggle("rounded-md", !isGrid);
    listBtn.classList.toggle("shadow-sm", !isGrid);

    const cards = recipesGrid.querySelectorAll(".recipe-card");

    cards.forEach((card) => {
        const imageContainer = card.querySelector(".relative");
        const badges = card.querySelector(".absolute.bottom-3");

        card.classList.toggle("flex", !isGrid);
        card.classList.toggle("flex-row", !isGrid);
        card.classList.toggle("h-40", !isGrid);

        imageContainer.classList.toggle("h-48", isGrid);
        imageContainer.classList.toggle("w-40", !isGrid);
        imageContainer.classList.toggle("h-full", !isGrid);
        imageContainer.classList.toggle("shrink-0", !isGrid);

        if (badges) {
            badges.classList.toggle("hidden", !isGrid);
        }
    });
}

function displayRecipes(recipes, category = "") {
    recipesCount.textContent = category
        ? `Showing ${recipes.length} ${category} recipes`
        : `Showing ${recipes.length} recipes`;


        if (recipes.length === 0) {
        recipesGrid.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <i class="fa-solid fa-magnifying-glass text-3xl text-gray-400"></i>
                </div>
                <p class="text-gray-500 text-xl leading-relaxed">
                    No recipes found. Try a different search term.
                </p>
            </div>
        `;
        return;
    }

    let cartona = "";

    for (let i = 0; i < recipes.length; i++) {
        cartona += `
            <div
                class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                data-meal-id="${recipes[i].id}"
            >
                <div class="relative h-48 overflow-hidden">
                    <img
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        src="${recipes[i].thumbnail || ""}"
                        alt=""
                        loading="lazy"
                    />
                    <div class="absolute bottom-3 left-3 flex gap-2">
                        <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">
                            ${recipes[i].category || "Unknown"}
                        </span>
                        <span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white">
                            ${recipes[i].area || "Unknown"}
                        </span>
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                        ${recipes[i].name}
                    </h3>
                    <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                        Delicious recipe to try!
                    </p>
                    <div class="flex items-center justify-between text-xs">
                        <span class="font-semibold text-gray-900">
                            <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                            ${recipes[i].category || "Unknown"}
                        </span>
                        <span class="font-semibold text-gray-500">
                            <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                            ${recipes[i].area || "Unknown"}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }

    recipesGrid.innerHTML = cartona;
    changeView(currentView);
}

async function getRecipes(category = "", area = "", search = "") {
    const currentRequest = ++requestNumber;

    let url = "https://nutriplan-api.vercel.app/api/meals/random?count=25";

    if (category !== "") {
        url = `https://nutriplan-api.vercel.app/api/meals/filter?category=${encodeURIComponent(category)}&limit=25`;
    }

    if (area !== "") {
        url = `https://nutriplan-api.vercel.app/api/meals/filter?area=${encodeURIComponent(area)}&limit=25`;
    }

    if (search !== "") {
        url = `https://nutriplan-api.vercel.app/api/meals/search?q=${encodeURIComponent(search)}`;
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch meals");
        }

        const data = await response.json();

        if (currentRequest !== requestNumber) return;

        if (!Array.isArray(data.results)) {
            throw new Error("Invalid recipes data");
        }

        displayRecipes(data.results, category || area);
    } catch (error) {
        if (currentRequest !== requestNumber) return;

        console.error(error);
        recipesCount.textContent = "Failed to load recipes";
    }
}

gridBtn.addEventListener("click", () => {
    changeView("grid");
});

listBtn.addEventListener("click", () => {
    changeView("list");
});

navLinks.forEach((link, index) => {
    link.href = `#${pageNames[index]}`;

    link.addEventListener("click", () => {
        closeSidebar();
    });
});

window.addEventListener("hashchange", () => {
    const page = location.hash.slice(1) || "meals";
    showPage(page);
    closeSidebar();
});

document.getElementById("back-to-meals-btn").addEventListener("click", () => {
    location.hash = "meals";
    showPage("meals");
});

recipesGrid.addEventListener("click", function(e) {
    const recipeCard = e.target.closest(".recipe-card");

    if (!recipeCard) return;

    const recipeId = recipeCard.dataset.mealId;

    location.hash = "details";
    showPage("details");

    getMealDetails(recipeId);
});

document.querySelector("#meal-categories-section button").addEventListener("click", () => {
    getRecipes();
});

initSidebar();
showPage(location.hash.slice(1) || "meals");
getRecipes();
getCategories(getRecipes);
getAreas(function(area) {
    getRecipes("", area);
});
getProductCategories();
initProductModal();