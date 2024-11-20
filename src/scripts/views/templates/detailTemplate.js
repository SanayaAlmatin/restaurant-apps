// templates/detailTemplate.js

export function createDetailContent(restaurant) {
    const section = document.createElement("section");
    section.classList.add("restaurant-detail");
    section.innerHTML = `
        <div class="detail-header" id="restaurant-name">
            <h2>${restaurant.name}</h2>
            <button id="back-button">
                <img src="../images/weui--back-filled.svg" alt="back button">
            </button>
        </div>
        <div class="image-wrapper">
            <img src="https://restaurant-api.dicoding.dev/images/small/${restaurant.pictureId}" alt="${restaurant.name}">
            <div class="location">
                <p><b>City:</b> ${restaurant.city}</p>
                <p><b>Address:</b> ${restaurant.address}</p>
            </div>
        </div>
        <div class="content-wrapper">
            <p class="rating"><b>Rating: <span>${restaurant.rating}</span></b></p>
            <div class="detail-description">
                <p><b>Description:</b><br>${restaurant.description}</p>
            </div>
            <div class="menus">
                <h3>Menus</h3>
                <div class="menu-foods">
                    <h4>Foods</h4>
                    <ul>
                        ${restaurant.menus.foods.map((food) => `<li>${food.name}</li>`).join("")}
                    </ul>
                </div>
                <div class="menu-drinks">
                    <h4>Drinks</h4>
                    <ul>
                        ${restaurant.menus.drinks.map((drink) => `<li>${drink.name}</li>`).join("")}
                    </ul>
                </div>
            </div>
            <div class="customer-reviews">
                <h3>Customer Reviews</h3>
                <div class="review-list">
                    ${restaurant.customerReviews.map((review) => `
                        <div class="review">
                            <p><strong>${review.name}</strong></p>
                            <p>${review.review}</p>
                            <p id="date-review">${review.date}</p>
                        </div>
                    `).join("")}
                </div>
            </div>
        </div>
    `;
    return section;
}