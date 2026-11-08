
const areasContainer = document.getElementById("areas-container");

export async function getAreas(onAreaClick) {
    const response = await fetch(
        "https://nutriplan-api.vercel.app/api/meals/areas"
    );

    const data = await response.json();

    let cartona = `
        <button class="area-btn px-4 py-2 bg-emerald-600 text-white rounded-full whitespace-nowrap" data-area="">
            All Cuisines
        </button>
    `;

    for (let i = 0; i < 10 && i < data.results.length; i++) {
        cartona += `
            <button
                class="area-btn px-4 py-2 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap hover:bg-gray-200"
                data-area="${data.results[i].name}"
            >
                ${data.results[i].name}
            </button>
        `;
    }

    areasContainer.innerHTML = cartona;

    areasContainer.addEventListener("click", function(e) {
        const button = e.target.closest(".area-btn");

        if (!button) return;

        const buttons = areasContainer.querySelectorAll(".area-btn");

        buttons.forEach(function(btn) {
            btn.classList.remove("bg-emerald-600", "text-white");
            btn.classList.add("bg-gray-100", "text-gray-700");
        });

        button.classList.remove("bg-gray-100", "text-gray-700");
        button.classList.add("bg-emerald-600", "text-white");

        onAreaClick(button.dataset.area);
    });
}
