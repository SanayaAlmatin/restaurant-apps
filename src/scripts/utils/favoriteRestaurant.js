import {
    addFavorite,
    removeFavorite,
    isFavorite as checkFavorite, // Ubah nama fungsi yang diimpor
    getAllFavorites,
} from "./db.js";

async function addToFavorites(restaurant) {
    try {
        await addFavorite(restaurant); // Gunakan addFavorite dari db.js
        console.log("Restaurant added to favorites:", restaurant);
    } catch (error) {
        console.error("Failed to add restaurant to favorites:", error);
    }
}

async function removeFromFavorites(id) {
    try {
        await removeFavorite(id); // Gunakan removeFavorite dari db.js
        console.log("Restaurant removed from favorites:", id);
    } catch (error) {
        console.error("Failed to remove restaurant from favorites:", error);
    }
}

async function isFavoriteRestaurant(id) {
    // Ubah nama fungsi lokal menjadi lebih deskriptif
    try {
        const result = await checkFavorite(id); // Gunakan fungsi yang diimpor dengan nama baru
        return result;
    } catch (error) {
        console.error("Failed to check if restaurant is favorite:", error);
        return false;
    }
}

async function fetchAllFavorites() {
    try {
        const favorites = await getAllFavorites(); // Gunakan getAllFavorites dari db.js
        return favorites;
    } catch (error) {
        console.error("Failed to fetch favorite restaurants:", error);
        return [];
    }
}

export {
    addToFavorites,
    removeFromFavorites,
    isFavoriteRestaurant as isFavorite, // Ekspor fungsi lokal sebagai isFavorite
    fetchAllFavorites,
};