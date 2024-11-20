const Detail = async (id) => {
    try {
        const detailContent = document.querySelector(".restaurant-detail");
        if (!detailContent) {
            throw new Error("Detail container element not found");
        }

        const response = await fetch(`https://restaurant-api.dicoding.dev/detail/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch restaurant detail: ${response.status}`);
        }

        const {
            restaurant
        } = await response.json();

        detailContent.innerHTML = `
            <h2>${restaurant.name}</h2>
            <img src="https://restaurant-api.dicoding.dev/images/small/${restaurant.pictureId}" alt="${restaurant.name}">
            <p>${restaurant.description}</p>
        `;
    } catch (error) {
        console.error("Error loading restaurant detail:", error);
        const detailContent = document.querySelector(".restaurant-detail");
        if (detailContent) {
            detailContent.innerHTML = `<p>Failed to load restaurant detail. Please try again later.</p>`;
        }
    }
};

export default Detail;