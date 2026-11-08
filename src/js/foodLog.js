
const loggedItemsList = document.getElementById("logged-items-list");


loggedItemsList.addEventListener("click", function(e) {
    const deleteButton = e.target.closest(".remove-foodlog-item");

    if (!deleteButton) return;

    const id = deleteButton.dataset.id;

    const foodLog = JSON.parse(
        localStorage.getItem("nutriplan-foodlog") || "[]"
    );

    let updatedFoodLog = [];

    for (let i = 0; i < foodLog.length; i++) {
        if (String(foodLog[i].id) !== id) {
            updatedFoodLog.push(foodLog[i]);
        }
    }

    localStorage.setItem( "nutriplan-foodlog", JSON.stringify(updatedFoodLog));

    displayFoodLog();
});

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

export function displayFoodLog() {
    const foodLog = JSON.parse( localStorage.getItem("nutriplan-foodlog") || "[]" );
    displayWeeklyStats(foodLog);
    displayWeeklyChart(foodLog);

    const today = new Date();
    const foodLogDate = document.getElementById("foodlog-date");

    foodLogDate.textContent = today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric"
    });
    const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    let todayItems = [];

    for (let i = 0; i < foodLog.length; i++) {
        if (foodLog[i].date === todayDate) {
            todayItems.push(foodLog[i]);
        }
    }

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

for (let i = 0; i < todayItems.length; i++) {
    totalCalories += Number(todayItems[i].calories) || 0;
    totalProtein += Number(todayItems[i].protein) || 0;
    totalCarbs += Number(todayItems[i].carbs) || 0;
    totalFat += Number(todayItems[i].fat) || 0;
}

const totals = [
    { value: totalCalories, goal: 2000, unit: "kcal" },
    { value: totalProtein, goal: 50, unit: "g" },
    { value: totalCarbs, goal: 250, unit: "g" },
    { value: totalFat, goal: 65, unit: "g" }
];

const progressCards = document.querySelectorAll(
    "#foodlog-today-section > div.grid > div"
);

for (let i = 0; i < totals.length; i++) {
    const total = totals[i];
    const card = progressCards[i];

    const percentage = Math.min((total.value / total.goal) * 100, 100);

    const valueText = card.querySelector(".flex.items-center.justify-between span.text-sm.text-gray-500");
    const progressBar = card.querySelector(".rounded-full.h-2\\.5 > div");

    valueText.textContent = `${total.value.toFixed(1)} / ${total.goal} ${total.unit}`;
    progressBar.style.width = `${percentage}%`;

    if (total.value > total.goal) {
        progressBar.classList.remove(
            "bg-emerald-500",
            "bg-blue-500",
            "bg-amber-500",
            "bg-purple-500"
        );
        progressBar.classList.add("bg-red-500");
    } else {
        progressBar.classList.remove("bg-red-500");
    }
}

    const itemsHeading = document.querySelector("#foodlog-today-section h4");
    itemsHeading.textContent = `Logged Items (${todayItems.length})`;

    if (todayItems.length === 0) {
        loggedItemsList.innerHTML = `
            <div class="text-center py-12">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fa-solid fa-utensils text-3xl text-gray-300"></i>
                </div>

                <p class="text-gray-500 font-medium mb-2">
                    No food logged today
                </p>

                <p class="text-gray-400 text-sm mb-4">
                    Start tracking your nutrition by logging meals or scanning products
                </p>

                <div class="flex justify-center gap-3">
                    <a
                        href="#meals"
                        class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                    >
                        <i class="fa-solid fa-plus"></i>
                        Browse Recipes
                    </a>

                    <a
                        href="#products"
                        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                    >
                        <i class="fa-solid fa-barcode"></i>
                        Scan Product
                    </a>
                </div>
            </div>
        `;
        return;
    }

    let cartona = "";

    for (let i = 0; i < todayItems.length; i++) {
        const item = todayItems[i];
        const isProduct = item.type === "product";
        const image = typeof item.image === "string" && /^https?:\/\//i.test(item.image)
            ? item.image
            : "";

        cartona += `
            <div class="flex items-center justify-between gap-4 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">
                <div class="flex items-center gap-4 min-w-0">
                    <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        ${image
                            ? `<img src="${safeText(image)}" alt="${safeText(item.name)}" class="w-14 h-14 rounded-xl object-contain">`
                            : `<i class="fa-solid fa-box text-blue-600 text-xl"></i>`
                        }
                    </div>

                    <div class="min-w-0">
                        <p class="font-semibold text-gray-900">
                            ${safeText(item.name)}
                        </p>
                        <p class="text-sm text-gray-500">
                            ${safeText(item.quantity ?? 100)} ${safeText(item.unit || "g")}
                            <span class="mx-1">•</span>
                            <span class="${isProduct ? "text-blue-600" : "text-emerald-600"}">
                                ${isProduct ? "Product" : "Recipe"}
                            </span>
                        </p>
                    </div>
                </div>

                <div class="flex items-center gap-4">
                    <div class="text-right">
                        <p class="text-lg font-bold text-emerald-600">
                            ${Math.round(Number(item.calories) || 0)}
                        </p>
                        <p class="text-xs text-gray-500">kcal</p>
                    </div>

                    <div class="hidden md:flex gap-2 text-xs text-gray-500">
                        <span class="px-2 py-1 bg-blue-50 rounded">
                            ${(Number(item.protein) || 0).toFixed(1)}g P
                        </span>
                        <span class="px-2 py-1 bg-amber-50 rounded">
                            ${(Number(item.carbs) || 0).toFixed(1)}g C
                        </span>
                        <span class="px-2 py-1 bg-purple-50 rounded">
                            ${(Number(item.fat) || 0).toFixed(1)}g F
                        </span>
                    </div>

                    <button class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2" data-id="${safeText(item.id)}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        `;
    }

    loggedItemsList.innerHTML = cartona;
}

function calculateWeeklyStats(foodLog) {
    const today = new Date();
    const startOfWeek = new Date(today);

    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(today.getDate() - today.getDay());

    let weeklyCalories = 0;
    let weeklyItems = 0;
    let daysOnGoal = 0;

    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);

        const date = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;

        let dayCalories = 0;
        let dayItems = 0;

        for (let j = 0; j < foodLog.length; j++) {
            if (foodLog[j].date === date) {
                dayCalories += Number(foodLog[j].calories) || 0;
                dayItems++;
            }
        }

        weeklyCalories += dayCalories;
        weeklyItems += dayItems;

        if (dayItems > 0 && dayCalories <= 2000) {
            daysOnGoal++;
        }
    }

    return {
        weeklyAverage: Math.round(weeklyCalories / 7),
        weeklyItems: weeklyItems,
        daysOnGoal: daysOnGoal
    };
}

function displayWeeklyStats(foodLog) {
    const stats = calculateWeeklyStats(foodLog);

    document.getElementById("weekly-stats").innerHTML = `
        <div class="bg-white rounded-xl p-4 border-2 border-gray-200">
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <i class="fa-solid fa-chart-line text-emerald-600 text-xl"></i>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Weekly Average</p>
                    <p class="text-xl font-bold text-gray-900">
                        ${stats.weeklyAverage} kcal
                    </p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl p-4 border-2 border-gray-200">
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <i class="fa-solid fa-utensils text-blue-600 text-xl"></i>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Total Items This Week</p>
                    <p class="text-xl font-bold text-gray-900">
                        ${stats.weeklyItems} items
                    </p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl p-4 border-2 border-gray-200">
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <i class="fa-solid fa-bullseye text-purple-600 text-xl"></i>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Days On Goal</p>
                    <p class="text-xl font-bold text-gray-900">
                        ${stats.daysOnGoal} / 7
                    </p>
                </div>
            </div>
        </div>
    `;
}



function displayWeeklyChart(foodLog) {
    const weeklyChart = document.getElementById("weekly-chart");
    const today = new Date();
    const startOfWeek = new Date(today);

    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let cartona = "";

    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);

        const date = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;

        let calories = 0;
        let items = 0;

        for (let j = 0; j < foodLog.length; j++) {
            if (foodLog[j].date === date) {
                calories += Number(foodLog[j].calories) || 0;
                items++;
            }
        }

        const isToday = date === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

        cartona += `
            <div class="text-center p-3 ${isToday ? "bg-indigo-100 rounded-xl" : ""}">
                <p class="text-xs text-gray-500 mb-1">${days[i]}</p>
                <p class="text-sm font-medium text-gray-900">${day.getDate()}</p>

                <div class="mt-2 ${items > 0 ? "text-emerald-600" : "text-gray-300"}">
                    <p class="text-lg font-bold">${Math.round(calories)}</p>
                    <p class="text-xs">kcal</p>
                </div>

                ${items > 0 ? `
                    <p class="text-xs text-gray-400 mt-1">
                        ${items} ${items === 1 ? "item" : "items"}
                    </p>
                ` : ""}
            </div>
        `;
    }

    weeklyChart.innerHTML = cartona;
}