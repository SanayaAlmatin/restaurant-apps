import createRestaurantCard from "../templates/restaurantCard.js";
import {
    getAllFavorites
} from "../../utils/db.js";

const FavoritesPage = async () => {
    const mainContent = document.querySelector("#mainContent"); // Elemen tempat konten akan dirender

    // Kosongkan konten utama
    mainContent.innerHTML = "<h2>Loading favorites...</h2>";

    try {
        // Ambil data restoran favorit dari IndexedDB
        const favorites = await getAllFavorites();

        if (favorites.length === 0) {
            mainContent.innerHTML = "<p>No favorite restaurants found.</p>";
            return;
        }

        // Render kartu restoran favorit
        mainContent.innerHTML = `
            <div class="favorites-container">
                ${favorites.map((restaurant) => createRestaurantCard(restaurant)).join("")}
            </div>
        `;
    } catch (error) {
        console.error("Failed to fetch favorite restaurants:", error);
        mainContent.innerHTML = "<p>Failed to load favorite restaurants.</p>";
    }
};

export default FavoritesPage;