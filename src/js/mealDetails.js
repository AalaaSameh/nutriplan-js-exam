const mealDetailsContent = document.getElementById("meal-details-content");

const increaseButton = document.getElementById("increase-servings");
const decreaseButton = document.getElementById("decrease-servings");
const servingsInput = document.getElementById("meal-servings");

increaseButton.addEventListener("click", function() {
    let servings = Number(servingsInput.value);

    if (servings < 10) {
        servingsInput.value = Math.min(servings + 0.5, 10);
    }
});

decreaseButton.addEventListener("click", function() {
    let servings = Number(servingsInput.value);

    if (servings > 0.5) {
        servingsInput.value = Math.max(servings - 0.5, 0.5);
    }
});

document.getElementById("cancel-log-meal").addEventListener("click", function() {
    const modal = document.getElementById("log-meal-modal");

    modal.classList.add("hidden");
    modal.classList.remove("flex");
});

export async function getMealDetails(id) {
    try {
        const response = await fetch(
            `https://nutriplan-api.vercel.app/api/meals/${id}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch meal details");
        }

        const data = await response.json();
        const meal = data.result;

        let cartona = "";
        let ingredientsCartona = "";
        let instructionsCartona = "";
        // let videoCartona = "";


        for (let i = 0; i < meal.ingredients.length; i++) {
            ingredientsCartona += `
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
                    <input type="checkbox" class="w-5 h-5 accent-emerald-600">

                    <span class="text-gray-700">
                        <span class="font-medium text-gray-900">
                            ${meal.ingredients[i].measure}
                        </span>
                        ${meal.ingredients[i].ingredient}
                    </span>
                </div>
            `;
        }

        for (let i = 0; i < meal.instructions.length; i++) {
            instructionsCartona += `
                <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                        ${i + 1}
                    </div>
                    <p class="text-gray-700 leading-relaxed pt-2">
                        ${meal.instructions[i]}
                    </p>
                </div>
            `;
        }

        cartona += `
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                <div class="relative h-80 md:h-96">
                    <img
                        src="${meal.thumbnail}"
                        alt="${meal.name}"
                        class="w-full h-full object-cover"
                    />

                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                    <div class="absolute bottom-0 left-0 right-0 p-8">
                        <div class="flex items-center gap-3 mb-3">
                            <span class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">
                                ${meal.category}
                            </span>

                            <span class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
                                ${meal.area}
                            </span>
                        </div>

                        <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
                            ${meal.name}
                        </h1>
                    </div>
                </div>
            </div>
        `;

        cartona += `
            <div class="flex flex-wrap gap-3 mb-8">
                <button
                    id="log-meal-btn"
                    class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
                    data-meal-id="${meal.id}"
                >
                    <i class="fa-solid fa-clipboard-list"></i>
                    <span>Log This Meal</span>
                </button>
            </div>
        `;

        cartona += `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-8">
        `;


        cartona += `
            <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h2 class="text-xl font-bold text-gray-900 mb-4">
                    <i class="fa-solid fa-list-check text-emerald-600"></i>
                    Ingredients
                    <span class="text-sm font-normal text-gray-500 ml-2">
                        ${meal.ingredients.length} items
                    </span>
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    ${ingredientsCartona}
                </div>
            </div>
        `;

        cartona += `
            <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i class="fa-solid fa-shoe-prints text-emerald-600"></i>
                    Instructions
                </h2>

                <div class="space-y-4">
                    ${instructionsCartona}
                </div>
            </div>
        `;


        if (meal.youtube) {
            const videoId = new URL(meal.youtube).searchParams.get("v");

            if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
                cartona += `
                    <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
                        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-video text-red-500"></i>
                            Video Tutorial
                        </h2>

                        <div class="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                            <iframe
                                src="https://www.youtube.com/embed/${videoId}"
                                class="absolute inset-0 w-full h-full"
                                title="Recipe Video Tutorial"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen>
                            </iframe>
                        </div>
                    </div>
                `;
            }
        }


        cartona += `
            </div>

            <div class="space-y-6">
                <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                    <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                        Nutrition Facts
                    </h2>

                    <div id="nutrition-facts-container">
                        <div class="text-center py-8">
                            <div class="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fa-solid fa-calculator text-emerald-600 text-xl animate-pulse"></i>
                            </div>

                            <p class="font-medium text-gray-700">
                                Calculating Nutrition
                            </p>

                            <p class="text-sm text-gray-500 mt-2">
                                Analyzing ingredients...
                            </p>

                            <div class="flex justify-center gap-1 mt-4">
                                <div
                                    class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                                    style="animation-delay: 0ms"
                                ></div>

                                <div
                                    class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                                    style="animation-delay: 150ms"
                                ></div>

                                <div
                                    class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                                    style="animation-delay: 300ms"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
`;

        mealDetailsContent.innerHTML = cartona;

        await getNutritionData(meal);

    } catch (error) {
        console.error(error);
        mealDetailsContent.textContent = "Failed to load meal details.";
    }
}

async function getNutritionData(meal) {
    const ingredientsArray = [];

    for (let i = 0; i < meal.ingredients.length; i++) {
        const ingredient = meal.ingredients[i];

        ingredientsArray.push(
            `${ingredient.measure} ${ingredient.ingredient}`
        );
    }

    const apiKey = "JBrQ6Q89FkDDrWTTcD9BGbpGmFPjjDdcdcNdKLJk";

    if (!apiKey) return;

    try {
        const response = await fetch(
            "https://nutriplan-api.vercel.app/api/nutrition/analyze",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey.trim()
                },
                body: JSON.stringify({
                    title: meal.name,
                    ingredients: ingredientsArray
                })
            }
        );

        const nutritionJson = await response.json();

        if (!response.ok) {
            throw new Error(
                nutritionJson.error?.message ||
                nutritionJson.message ||
                "Nutrition analysis failed"
            );
        }

        console.log("Nutrition Result:", nutritionJson);

        displayNutritionFacts(nutritionJson.data);

        const logMealButton = document.getElementById("log-meal-btn");

        logMealButton.addEventListener("click", function() {
            openLogMealModal(meal, nutritionJson.data);
        });

        document.getElementById("confirm-log-meal").onclick = function() {
            saveLoggedMeal(meal, nutritionJson.data);
        };

    } catch (error) {
        console.error("Nutrition Error:", error);
    }
}

function displayNutritionFacts(nutrition) {
    const container = document.getElementById("nutrition-facts-container");
    const food = nutrition.perServing;

    const nutrients = [
        { name: "Protein", value: food.protein, color: "emerald", goal: 50 },
        { name: "Carbs", value: food.carbs, color: "blue", goal: 250 },
        { name: "Fat", value: food.fat, color: "purple", goal: 65 },
        { name: "Fiber", value: food.fiber, color: "orange", goal: 30 },
        { name: "Sugar", value: food.sugar, color: "pink", goal: 50 },
        { name: "Saturated Fat", value: food.saturatedFat, color: "red", goal: 20 }
    ];

    let cartona = `
        <p class="text-sm text-gray-500 mb-4">Per serving</p>

        <div class="text-center py-4 mb-4 bg-emerald-50 rounded-xl">
            <p class="text-sm text-gray-600">Calories per serving</p>
            <p class="text-4xl font-bold text-emerald-600">
                ${Math.round(food.calories || 0)}
            </p>
            <p class="text-xs text-gray-500 mt-1">
                Total: ${Math.round(nutrition.totals?.calories || 0)} cal
            </p>
        </div>

        <div class="space-y-4">
    `;

    for (let i = 0; i < nutrients.length; i++) {
        const item = nutrients[i];
        const value = Number(item.value) || 0;
        const percentage = Math.min((value / item.goal) * 100, 100);

        const colors = {
            emerald: "bg-emerald-500",
            blue: "bg-blue-500",
            purple: "bg-purple-500",
            orange: "bg-orange-500",
            pink: "bg-pink-500",
            red: "bg-red-500"
        };

        cartona += `
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full ${colors[item.color]}"></div>
                    <span class="text-gray-700">${item.name}</span>
                </div>
                <span class="font-bold text-gray-900">${Math.round(value)}g</span>
            </div>

            <div class="w-full bg-gray-100 rounded-full h-2">
                <div
                    class="${colors[item.color]} h-2 rounded-full"
                    style="width: ${percentage}%"
                ></div>
            </div>
        `;
    }

    cartona += `</div>`;

    container.innerHTML = cartona;
}

function openLogMealModal(meal, nutrition) {
    const modal = document.getElementById("log-meal-modal");
    const food = nutrition.perServing;

    document.getElementById("modal-meal-image").src = meal.thumbnail;
    document.getElementById("modal-meal-image").alt = meal.name;

    document.getElementById("modal-meal-name").textContent = meal.name;

    document.getElementById("modal-calories").textContent =
        Math.round(food.calories);

    document.getElementById("modal-protein").textContent =
        Math.round(food.protein) + "g";

    document.getElementById("modal-carbs").textContent =
        Math.round(food.carbs) + "g";

    document.getElementById("modal-fat").textContent =
        Math.round(food.fat) + "g";

    document.getElementById("meal-servings").value = 1;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
}

function saveLoggedMeal(meal, nutrition) {
    const servings = Number(document.getElementById("meal-servings").value);

    if (!Number.isFinite(servings) || servings < 0.5 || servings > 10) {
        Swal.fire("Invalid servings", "Choose between 0.5 and 10 servings.", "error");
        return;
    }

    const food = nutrition.perServing;
    const now = new Date();

    const date = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
    ].join("-");

    const entry = {
        id: Date.now(),
        type: "recipe",
        mealId: meal.id,
        name: meal.name,
        image: meal.thumbnail,
        date: date,
        quantity: servings,
        unit: "serving",
        calories: (Number(food.calories) || 0) * servings,
        protein: (Number(food.protein) || 0) * servings,
        carbs: (Number(food.carbs) || 0) * servings,
        fat: (Number(food.fat) || 0) * servings,
        sugar: (Number(food.sugar) || 0) * servings
    };

    const saved = JSON.parse(
        localStorage.getItem("nutriplan-foodlog") || "[]"
    );

    const foodLog = Array.isArray(saved) ? saved : [];

    foodLog.push(entry);

    localStorage.setItem(
        "nutriplan-foodlog",
        JSON.stringify(foodLog)
    );

    const modal = document.getElementById("log-meal-modal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");

    Swal.fire({
        icon: "success",
        title: "Meal Logged!",
        text: `${meal.name} (${servings} ${servings === 1 ? "serving" : "servings"}) has been added to your daily log.`,
        confirmButtonColor: "#059669"
    });
}




/*
<section id="meal-details" class="px-8 py-8 bg-gray-50">
        <div class="max-w-7xl mx-auto">
          <!-- Back Button -->
          <button
            id="back-to-meals-btn"
            class="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium mb-6 transition-colors"
          >
            <i class="fa-solid fa-arrow-left"></i>
            <span>Back to Recipes</span>
          </button>

          <!-- Hero Section -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div class="relative h-80 md:h-96">
              <img
                src="https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg"
                alt="Teriyaki Chicken Casserole"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
              ></div>
              <div class="absolute bottom-0 left-0 right-0 p-8">
                <div class="flex items-center gap-3 mb-3">
                  <span
                    class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full"
                    >Chicken</span
                  >
                  <span
                    class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full"
                    >Japanese</span
                  >
                  <span
                    class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full"
                    >Casserole</span
                  >
                </div>
                <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
                  Teriyaki Chicken Casserole
                </h1>
                <div class="flex items-center gap-6 text-white/90">
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-clock"></i>
                    <span>30 min</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-utensils"></i>
                    <span id="hero-servings">4 servings</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-fire"></i>
                    <span id="hero-calories">485 cal/serving</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-3 mb-8">
            <button
              id="log-meal-btn"
              class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
              data-meal-id="52772"
            >
              <i class="fa-solid fa-clipboard-list"></i>
              <span>Log This Meal</span>
            </button>
          </div>

          <!-- Main Content Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column - Ingredients & Instructions -->
            <div class="lg:col-span-2 space-y-8">
              <!-- Ingredients -->
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-list-check text-emerald-600"></i>
                  Ingredients
                  <span class="text-sm font-normal text-gray-500 ml-auto"
                    >9 items</span
                  >
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"
                    />
                    <span class="text-gray-700">
                      <span class="font-medium text-gray-900">3/4 cup</span> soy
                      sauce
                    </span>
                  </div>
                  <div
                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"
                    />
                    <span class="text-gray-700">
                      <span class="font-medium text-gray-900">1/2 cup</span>
                      water
                    </span>
                  </div>
                  <div
                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"
                    />
                    <span class="text-gray-700">
                      <span class="font-medium text-gray-900">1/4 cup</span>
                      brown sugar
                    </span>
                  </div>
                  <div
                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"
                    />
                    <span class="text-gray-700">
                      <span class="font-medium text-gray-900"
                        >1/2 teaspoon</span
                      >
                      ground ginger
                    </span>
                  </div>
                  <div
                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"
                    />
                    <span class="text-gray-700">
                      <span class="font-medium text-gray-900"
                        >1/2 teaspoon</span
                      >
                      minced garlic
                    </span>
                  </div>
                  <div
                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"
                    />
                    <span class="text-gray-700">
                      <span class="font-medium text-gray-900"
                        >4 Tablespoons</span
                      >
                      cornstarch
                    </span>
                  </div>
                  <div
                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"
                    />
                    <span class="text-gray-700">
                      <span class="font-medium text-gray-900">2</span> chicken
                      breasts
                    </span>
                  </div>
                  <div
                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"
                    />
                    <span class="text-gray-700">
                      <span class="font-medium text-gray-900">1 bag</span>
                      stir-fry vegetables
                    </span>
                  </div>
                  <div
                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"
                    />
                    <span class="text-gray-700">
                      <span class="font-medium text-gray-900">3 cups</span>
                      brown rice
                    </span>
                  </div>
                </div>
              </div>

              <!-- Instructions -->
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-shoe-prints text-emerald-600"></i>
                  Instructions
                </h2>
                <div class="space-y-4">
                  <div
                    class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div
                      class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0"
                    >
                      1
                    </div>
                    <p class="text-gray-700 leading-relaxed pt-2">
                      Preheat oven to 350° F. Spray a 9x13-inch baking pan with
                      non-stick spray.
                    </p>
                  </div>
                  <div
                    class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div
                      class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0"
                    >
                      2
                    </div>
                    <p class="text-gray-700 leading-relaxed pt-2">
                      Combine soy sauce, ½ cup water, brown sugar, ginger and
                      garlic in a small saucepan and cover. Bring to a boil over
                      medium heat. Remove lid and cook for one minute once
                      boiling.
                    </p>
                  </div>
                  <div
                    class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div
                      class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0"
                    >
                      3
                    </div>
                    <p class="text-gray-700 leading-relaxed pt-2">
                      Meanwhile, stir together the cornstarch and 2 tablespoons
                      of water in a separate dish until smooth. Once sauce is
                      boiling, add mixture to the saucepan and stir to combine.
                      Cook until the sauce starts to thicken then remove from
                      heat.
                    </p>
                  </div>
                  <div
                    class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div
                      class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0"
                    >
                      4
                    </div>
                    <p class="text-gray-700 leading-relaxed pt-2">
                      Place the chicken breasts in the prepared pan. Pour one
                      cup of the sauce over top of chicken. Place chicken in
                      oven and bake 35 minutes or until cooked through. Remove
                      from oven and shred chicken in the pan using two forks.
                    </p>
                  </div>
                  <div
                    class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div
                      class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0"
                    >
                      5
                    </div>
                    <p class="text-gray-700 leading-relaxed pt-2">
                      *Meanwhile, steam the vegetables according to package
                      directions and stir together with the cooked brown rice.
                      Add the remaining sauce to the mixture and stir to
                      combine. Serve the chicken over the rice and veggie
                      mixture.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Video Section -->
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-video text-red-500"></i>
                  Video Tutorial
                </h2>
                <div
                  class="relative aspect-video rounded-xl overflow-hidden bg-gray-100"
                >
                  <iframe
                    src="https://www.youtube.com/embed/4aZr5hZXP_s"
                    class="absolute inset-0 w-full h-full"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  >
                  </iframe>
                </div>
              </div>
            </div>

            <!-- Right Column - Nutrition -->
            <div class="space-y-6">
              <!-- Nutrition Facts -->
              <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                  Nutrition Facts
                </h2>
                <div id="nutrition-facts-container">
                  <p class="text-sm text-gray-500 mb-4">Per serving</p>

                  <div
                    class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl"
                  >
                    <p class="text-sm text-gray-600">Calories per serving</p>
                    <p class="text-4xl font-bold text-emerald-600">485</p>
                    <p class="text-xs text-gray-500 mt-1">Total: 1940 cal</p>
                  </div>

                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span class="text-gray-700">Protein</span>
                      </div>
                      <span class="font-bold text-gray-900">42g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-emerald-500 h-2 rounded-full"
                        style="width: 84%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span class="text-gray-700">Carbs</span>
                      </div>
                      <span class="font-bold text-gray-900">52g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-blue-500 h-2 rounded-full"
                        style="width: 17%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span class="text-gray-700">Fat</span>
                      </div>
                      <span class="font-bold text-gray-900">8g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-purple-500 h-2 rounded-full"
                        style="width: 12%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span class="text-gray-700">Fiber</span>
                      </div>
                      <span class="font-bold text-gray-900">4g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-orange-500 h-2 rounded-full"
                        style="width: 14%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span class="text-gray-700">Sugar</span>
                      </div>
                      <span class="font-bold text-gray-900">12g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-pink-500 h-2 rounded-full"
                        style="width: 24%"
                      ></div>
                    </div>
                  </div>

                  <div class="mt-6 pt-6 border-t border-gray-100">
                    <h3 class="text-sm font-semibold text-gray-900 mb-3">
                      Vitamins & Minerals (% Daily Value)
                    </h3>
                    <div class="grid grid-cols-2 gap-3 text-sm">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Vitamin A</span>
                        <span class="font-medium">15%</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Vitamin C</span>
                        <span class="font-medium">25%</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Calcium</span>
                        <span class="font-medium">4%</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Iron</span>
                        <span class="font-medium">12%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



*/