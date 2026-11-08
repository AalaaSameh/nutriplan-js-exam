
const productsGrid = document.getElementById("products-grid");
const productsCount = document.getElementById("products-count");
let allProducts = [];
let selectedProduct = null;

function safeText(value) {
    return String(value ?? "").replace(/[&<>"']/g, function(char) {
        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };
        return characters[char];
    });
}

function safeImage(url) {
    if (typeof url !== "string") return "";
    if (!/^https?:\/\//i.test(url)) return "";
    return safeText(url);
}

function formatNumber(value, digits = 1) {
    if (value === null || value === undefined || value === "") return "-";
    const number = Number(value);
    if (!Number.isFinite(number)) return "-";
    return number.toFixed(digits);
}

function displayProducts(products) {
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="col-span-full text-center py-16 text-gray-500">
                No products found.
            </div>
        `;
        productsCount.textContent = "Showing 0 products";
        return;
    }

    let cartona = "";

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const nutrients = product.nutrients || {};

        cartona += `
            <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                data-barcode="${safeText(product.barcode)}">

                <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                        class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        src="${safeImage(product.image)}"
                        alt="${safeText(product.name || "Product")}"
                        loading="lazy"
                    />

                    <div class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded uppercase">
                        Nutri-Score ${safeText((product.nutritionGrade || "unknown").toUpperCase())}
                    </div>

                    <div class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                        ${safeText(product.novaGroup ?? "-")}
                    </div>
                </div>

                <div class="p-4">
                    <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">
                        ${safeText(product.brand || "Unknown Brand")}
                    </p>

                    <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        ${safeText(product.name || "Unknown Product")}
                    </h3>

                    <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span>
                            <i class="fa-solid fa-barcode mr-1"></i>
                            ${safeText(product.barcode)}
                        </span>
                        <span>
                            <i class="fa-solid fa-fire mr-1"></i>
                            ${formatNumber(nutrients.calories, 0)} kcal
                        </span>
                    </div>

                    <div class="grid grid-cols-4 gap-1 text-center">
                        <div class="bg-emerald-50 rounded p-1.5">
                            <p class="text-xs font-bold text-emerald-700">${formatNumber(nutrients.protein)}g</p>
                            <p class="text-[10px] text-gray-500">Protein</p>
                        </div>

                        <div class="bg-blue-50 rounded p-1.5">
                            <p class="text-xs font-bold text-blue-700">${formatNumber(nutrients.carbs)}g</p>
                            <p class="text-[10px] text-gray-500">Carbs</p>
                        </div>

                        <div class="bg-purple-50 rounded p-1.5">
                            <p class="text-xs font-bold text-purple-700">${formatNumber(nutrients.fat)}g</p>
                            <p class="text-[10px] text-gray-500">Fat</p>
                        </div>

                        <div class="bg-orange-50 rounded p-1.5">
                            <p class="text-xs font-bold text-orange-700">${formatNumber(nutrients.sugar)}g</p>
                            <p class="text-[10px] text-gray-500">Sugar</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    productsGrid.innerHTML = cartona;
    productsCount.textContent = `Showing ${products.length} products`;
}

export async function getProducts(search) {
    try {
        productsCount.textContent = "Loading products...";

        const response = await fetch(
            `https://nutriplan-api.vercel.app/api/products/search?q=${encodeURIComponent(search)}`
        );

        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();

        if (!Array.isArray(data.results)) {
            throw new Error("Invalid products data");
        }

        allProducts = data.results;
        displayProducts(allProducts);

    } catch (error) {
        console.error(error);
        productsCount.textContent = "Failed to load products";
    }
}

export async function getProductByBarcode(barcode) {
    try {
        productsCount.textContent = "Loading product...";

        const response = await fetch(
            `https://nutriplan-api.vercel.app/api/products/barcode/${encodeURIComponent(barcode)}`
        );

        if (!response.ok) throw new Error("Failed to fetch product");

        const data = await response.json();

        allProducts = data.result ? [data.result] : [];
        displayProducts(allProducts);

    } catch (error) {
        console.error(error);
        productsCount.textContent = "Failed to load product";
    }
}

export function filterProductsByGrade(grade) {
    if (grade === "") {
        displayProducts(allProducts);
        return;
    }

    let filteredProducts = [];

    for (let i = 0; i < allProducts.length; i++) {
        if (allProducts[i].nutritionGrade === grade) {
            filteredProducts.push(allProducts[i]);
        }
    }

    displayProducts(filteredProducts);
}

export async function getProductCategories() {
    const categoryStyles = {
        breakfast_cereals: {
            color: "from-amber-500 to-orange-500",
            icon: "fa-wheat-awn"
        },
        beverages: {
            color: "from-blue-500 to-cyan-500",
            icon: "fa-bottle-water"
        },
        snacks: {
            color: "from-purple-500 to-pink-500",
            icon: "fa-cookie"
        },
        dairy: {
            color: "from-sky-400 to-blue-500",
            icon: "fa-cheese"
        },
        fruits: {
            color: "from-red-500 to-rose-500",
            icon: "fa-apple-whole"
        },
        vegetables: {
            color: "from-green-500 to-emerald-500",
            icon: "fa-carrot"
        },
        breads: {
            color: "from-amber-600 to-yellow-500",
            icon: "fa-bread-slice"
        },
        meats: {
            color: "from-red-600 to-rose-600",
            icon: "fa-drumstick-bite"
        },
        frozen_foods: {
            color: "from-cyan-500 to-blue-600",
            icon: "fa-snowflake"
        },
        sauces: {
            color: "from-orange-500 to-red-500",
            icon: "fa-jar"
        }
    };

    try {
        const response = await fetch(
            "https://nutriplan-api.vercel.app/api/products/categories?page=1&limit=50"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }

        const data = await response.json();

        let cartona = "";

        for (let i = 0; i < data.results.length; i++) {
            const category = data.results[i];
            const style = categoryStyles[category.id];

            if (!style) continue;

            cartona += `
                <button
                    class="product-category-btn flex-shrink-0 px-5 py-3 bg-gradient-to-r ${style.color} text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    data-category="${safeText(category.id)}"
                >
                    <i class="fa-solid ${style.icon} mr-2"></i>
                    ${safeText(category.name)}
                </button>
            `;
        }

        document.getElementById("product-categories").innerHTML = cartona;

    } catch (error) {
        console.error(error);
    }
}

export async function getProductsByCategory(category) {
    try {
        productsCount.textContent = "Loading products...";

        const response = await fetch(
            `https://nutriplan-api.vercel.app/api/products/category/${encodeURIComponent(category)}`
        );

        if (!response.ok) throw new Error("Failed to fetch category");

        const data = await response.json();

        if (!Array.isArray(data.results)) {
            throw new Error("Invalid category data");
        }

        allProducts = data.results;
        displayProducts(allProducts);

    } catch (error) {
        console.error(error);
        productsCount.textContent = "Failed to load products";
    }
}

function getGradeInfo(grade) {
    const grades = {
        a: ["#038141", "Excellent"],
        b: ["#85bb2f", "Good"],
        c: ["#fecb02", "Average"],
        d: ["#ee8100", "Poor"],
        e: ["#e63e11", "Bad"]
    };

    return grades[grade] || ["#9ca3af", "Unknown"];
}

function getNovaInfo(group) {
    const names = {
        1: "Unprocessed",
        2: "Processed ingredients",
        3: "Processed",
        4: "Ultra-processed"
    };

    return names[group] || "Unknown";
}

function nutritionItem(label, value, color) {
    const number = Number(value);
    const valid = value !== null && value !== undefined && Number.isFinite(number);
    const width = valid ? Math.min(100, Math.max(0, number)) : 0;

    return `
        <div class="text-center">
            <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div class="${color} h-2 rounded-full" style="width: ${width}%"></div>
            </div>
            <p class="text-lg font-bold ${color.replace("bg-", "text-")}">
                ${formatNumber(value)}g
            </p>
            <p class="text-xs text-gray-500">${label}</p>
        </div>
    `;
}

function renderProductModal(product) {
    const modal = document.getElementById("product-detail-modal");
    const nutrients = product.nutrients || {};
    const grade = String(product.nutritionGrade || "unknown").toLowerCase();
    const gradeInfo = getGradeInfo(grade);
    const nova = product.novaGroup;
    const ingredients = product.ingredientsText || product.ingredients_text || product.ingredients;
    const ingredientsText = Array.isArray(ingredients)
        ? ingredients.map(item => typeof item === "string" ? item : item.text || "").join(", ")
        : typeof ingredients === "string" ? ingredients : "Ingredients information unavailable.";
    const servingSize = product.quantity || product.servingSize || product.serving_size || "";
    const salt = nutrients.salt ?? (
        nutrients.sodium === null || nutrients.sodium === undefined
            ? null
            : Number(nutrients.sodium) * 2.5
    );

    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true" aria-label="Product details">
            <div class="p-6">
                <div class="flex items-start gap-6 mb-6">
                    <div class="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                            src="${safeImage(product.image)}"
                            alt="${safeText(product.name || "Product")}"
                            class="w-full h-full object-contain"
                        />
                    </div>

                    <div class="flex-1 min-w-0">
                        <p class="text-sm text-emerald-600 font-semibold mb-1">
                            ${safeText(product.brand || "Unknown Brand")}
                        </p>
                        <h2 class="text-2xl font-bold text-gray-900 mb-2">
                            ${safeText(product.name || "Unknown Product")}
                        </h2>
                        <p class="text-sm text-gray-500 mb-3">
                            ${safeText(servingSize)}
                        </p>

                        <div class="flex items-center gap-3 flex-wrap">
                            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: ${gradeInfo[0]}20">
                                <span class="w-8 h-8 rounded flex items-center justify-center text-white font-bold" style="background-color: ${gradeInfo[0]}">
                                    ${safeText(grade.toUpperCase())}
                                </span>
                                <div>
                                    <p class="text-xs font-bold" style="color: ${gradeInfo[0]}">Nutri-Score</p>
                                    <p class="text-[10px] text-gray-600">${gradeInfo[1]}</p>
                                </div>
                            </div>

                            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: #e63e1120">
                                <span class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style="background-color: #e63e11">
                                    ${safeText(nova ?? "-")}
                                </span>
                                <div>
                                    <p class="text-xs font-bold text-orange-600">NOVA</p>
                                    <p class="text-[10px] text-gray-600">${getNovaInfo(nova)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button type="button" class="close-product-modal text-gray-400 hover:text-gray-600" aria-label="Close">
                        <i class="fa-solid fa-xmark text-2xl"></i>
                    </button>
                </div>

                <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 mb-6 border border-emerald-200">
                    <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                        Nutrition Facts
                        <span class="text-sm font-normal text-gray-500">(per 100g)</span>
                    </h3>

                    <div class="text-center mb-4 pb-4 border-b border-emerald-200">
                        <p class="text-4xl font-bold text-gray-900">
                            ${formatNumber(nutrients.calories, 0)}
                        </p>
                        <p class="text-sm text-gray-500">Calories</p>
                    </div>

                    <div class="grid grid-cols-4 gap-4">
                        ${nutritionItem("Protein", nutrients.protein, "bg-emerald-500")}
                        ${nutritionItem("Carbs", nutrients.carbs, "bg-blue-500")}
                        ${nutritionItem("Fat", nutrients.fat, "bg-purple-500")}
                        ${nutritionItem("Sugar", nutrients.sugar, "bg-orange-500")}
                    </div>

                    <div class="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-emerald-200">
                        <div class="text-center">
                            <p class="text-sm font-semibold text-gray-900">${formatNumber(nutrients.saturatedFat)}g</p>
                            <p class="text-xs text-gray-500">Saturated Fat</p>
                        </div>
                        <div class="text-center">
                            <p class="text-sm font-semibold text-gray-900">${formatNumber(nutrients.fiber)}g</p>
                            <p class="text-xs text-gray-500">Fiber</p>
                        </div>
                        <div class="text-center">
                            <p class="text-sm font-semibold text-gray-900">${formatNumber(salt, 2)}g</p>
                            <p class="text-xs text-gray-500">Salt</p>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 rounded-xl p-5 mb-6">
                    <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <i class="fa-solid fa-list text-gray-600"></i>
                        Ingredients
                    </h3>
                    <p class="text-sm text-gray-600 leading-relaxed">
                        ${safeText(ingredientsText)}
                    </p>
                </div>

                <div class="flex gap-3">
                    <button type="button" class="add-product-to-log flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all">
                        <i class="fa-solid fa-plus mr-2"></i>
                        Log This Food
                    </button>
                    <button type="button" class="close-product-modal flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

function closeProductModal() {
    const modal = document.getElementById("product-detail-modal");
    modal.classList.add("hidden");
    modal.innerHTML = "";
    document.body.style.overflow = "";
    selectedProduct = null;
}

async function openProductModal(barcode) {
    const modal = document.getElementById("product-detail-modal");

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    try {
        const response = await fetch(
            `https://nutriplan-api.vercel.app/api/products/barcode/${encodeURIComponent(barcode)}`
        );

        if (!response.ok) throw new Error("Failed to fetch product details");

        const data = await response.json();

        if (modal.classList.contains("hidden")) return;

        if (!data.result) throw new Error("Product not found");

        selectedProduct = data.result;
        renderProductModal(selectedProduct);

    } catch (error) {
        console.error(error);
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-8 mx-4 text-center">
                <p class="text-red-500 mb-4">Failed to load product details.</p>
                <button type="button" class="close-product-modal px-6 py-2 bg-gray-100 rounded-lg">
                    Close
                </button>
            </div>
        `;
    }
}

function logSelectedProduct() {
    if (!selectedProduct) return;

    const nutrients = selectedProduct.nutrients || {};
    const now = new Date();
    const date = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
    ].join("-");

    const entry = {
        id: Date.now(),
        type: "product",
        barcode: selectedProduct.barcode,
        name: selectedProduct.name,
        image: selectedProduct.image || "",
        date: date,
        quantity: 100,
        unit: "g",
        calories: nutrients.calories ?? 0,
        protein: nutrients.protein ?? 0,
        carbs: nutrients.carbs ?? 0,
        fat: nutrients.fat ?? 0,
        sugar: nutrients.sugar ?? 0
    };

    try {
        const saved = JSON.parse(localStorage.getItem("nutriplan-foodlog") || "[]");
        const foodLog = Array.isArray(saved) ? saved : [];

        foodLog.push(entry);
        localStorage.setItem("nutriplan-foodlog", JSON.stringify(foodLog));

        closeProductModal();

        if (typeof Swal !== "undefined") {
            Swal.fire({
                icon: "success",
                title: "Food Added!",
                text: "Product saved to your Food Log.",
                timer: 1800,
                showConfirmButton: false
            });
        }
    } catch (error) {
        console.error(error);
        alert("Could not save food to the Food Log.");
    }
}

export function initProductModal() {
    const modal = document.createElement("div");
    modal.id = "product-detail-modal";
    modal.className = "fixed inset-0 bg-black/50 flex items-center justify-center z-50 hidden";
    document.body.appendChild(modal);

    productsGrid.addEventListener("click", function(e) {
        const card = e.target.closest(".product-card");

        if (!card) return;

        const barcode = card.dataset.barcode;

        if (!barcode) return;

        openProductModal(barcode);
    });

    modal.addEventListener("click", function(e) {
        if (e.target === modal || e.target.closest(".close-product-modal")) {
            closeProductModal();
            return;
        }

        if (e.target.closest(".add-product-to-log")) {
            logSelectedProduct();
        }
    });

    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape" && !modal.classList.contains("hidden")) {
            closeProductModal();
        }
    });
}
