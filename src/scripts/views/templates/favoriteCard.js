const createFavoriteCard = (restaurant) => `
    <div class="favorite-card" data-id="${restaurant.id}">
        <div class="favorite-location">City: ${restaurant.city}</div>
        <img src="https://restaurant-api.dicoding.dev/images/small/${restaurant.pictureId}" alt="${restaurant.name}">
        <div class="favorite-card__details">
            <p class="favorite-rating">Rating: <span>${restaurant.rating}</span></p>
            <h3>${restaurant.name}</h3>
            <p class="favorite-description">${restaurant.description.substring(0, 50)}...</p>
            <div class="favorite-actions">
                <button class="delete-toggle-button" data-id="${restaurant.id}">
                    <img src="../images/ion--trash.svg" alt="Delete Favorite">
                </button>
                <button class="detail-button" data-id="${restaurant.id}">Detail</button>
            </div>
        </div>
    </div>
`;

export default createFavoriteCard;