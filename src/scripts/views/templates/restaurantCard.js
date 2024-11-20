const createRestaurantCard = (restaurant) => `
    <div class="restaurant-card">
        <div class="location">City: ${restaurant.city}</div>
        <img src="https://restaurant-api.dicoding.dev/images/small/${restaurant.pictureId}" alt="${restaurant.name}">
        <div class="restaurant-card__details">
            <p class="rating">Rating: <span>${restaurant.rating}</span></p>
            <h3>${restaurant.name}</h3>
            <p class="description">${restaurant.description.substring(0, 50)}...</p>
            <div class="favorite-icon">
                <img src="../images/uil--favorite.svg" alt="favorite icon" class="favorite-toggle" data-id="${restaurant.id}">
            </div>
            <button class="detail-button" data-id="${restaurant.id}">Detail</button> 
        </div>
    </div>
`;

export default createRestaurantCard;