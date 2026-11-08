
const categoriesGrid = document.getElementById("categories-grid");

const categoryStyles = {
    Beef: ["from-red-50 to-rose-50", "border-red-200", "from-red-400 to-rose-500", "fa-drumstick-bite"],
    Chicken: ["from-amber-50 to-orange-50", "border-amber-200", "from-amber-400 to-orange-500", "fa-drumstick-bite"],
    Dessert: ["from-pink-50 to-rose-50", "border-pink-200", "from-pink-400 to-rose-500", "fa-cake-candles"],
    Lamb: ["from-orange-50 to-amber-50", "border-orange-200", "from-orange-400 to-amber-500", "fa-drumstick-bite"],
    Miscellaneous: ["from-slate-50 to-gray-50", "border-slate-200", "from-slate-400 to-gray-500", "fa-bowl-rice"],
    Pasta: ["from-yellow-50 to-amber-50", "border-yellow-200", "from-yellow-400 to-amber-500", "fa-bowl-food"],
    Pork: ["from-rose-50 to-red-50", "border-rose-200", "from-rose-400 to-red-500", "fa-bacon"],
    Seafood: ["from-cyan-50 to-blue-50", "border-cyan-200", "from-cyan-400 to-blue-500", "fa-fish"],
    Side: ["from-green-50 to-emerald-50", "border-green-200", "from-green-400 to-emerald-500", "fa-plate-wheat"],
    Starter: ["from-teal-50 to-cyan-50", "border-teal-200", "from-teal-400 to-cyan-500", "fa-utensils"],
    Vegan: ["from-emerald-50 to-green-50", "border-emerald-200", "from-emerald-400 to-green-500", "fa-leaf"],
    Vegetarian: ["from-lime-50 to-green-50", "border-lime-200", "from-lime-400 to-green-500", "fa-seedling"]
};

export async function getCategories(onCategoryClick) {
    categoriesGrid.addEventListener("click", (e) => {
        const card = e.target.closest(".category-card");

        if (!card) return;

        onCategoryClick(card.dataset.category);
    });

    try {
        const response = await fetch(
            "https://nutriplan-api.vercel.app/api/meals/categories"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }

        const data = await response.json();

        if (!Array.isArray(data.results)) {
            throw new Error("Invalid categories data");
        }

        let cartona = "";

        for (const name in categoryStyles) {
            const category = data.results.find((item) => item.name === name);

            if (!category) continue;

            const style = categoryStyles[name];

            cartona += `
                <div
                    class="category-card bg-gradient-to-br ${style[0]} ${style[1]} border rounded-xl p-3 cursor-pointer hover:shadow-md transition-all group min-w-0"
                    data-category="${name}"
                >
                    <div class="flex items-center gap-2.5 min-w-0">
                        <div class="w-9 h-9 shrink-0 bg-gradient-to-br ${style[2]} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                            <i class="fa-solid ${style[3]} text-white text-sm"></i>
                        </div>
                        <h3 class="text-sm font-bold text-gray-900 min-w-0 truncate" title="${name}">
                            ${name}
                        </h3>
                    </div>
                </div>
            `;
        }

        categoriesGrid.innerHTML = cartona;
    } catch (error) {
        console.error(error);
        categoriesGrid.textContent = "Failed to load categories.";
    }
}
