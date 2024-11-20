import {
    fetchAllFavorites,
    removeFromFavorites,
} from "../../utils/favoriteRestaurant.js"; // Ganti getAllFavorites dengan fetchAllFavorites
import createFavoriteCard from "../templates/favoriteCard.js";
import {
    showDetail
} from "../../utils/detailRestaurant.js";

const Favorite = async () => {
    const mainContent = document.querySelector("main");
    const heroSection = document.querySelector(".hero");

    // Sembunyikan elemen .hero
    heroSection.style.display = "none";

    // Siapkan konten utama
    mainContent.innerHTML = `
        <div class="favorite-header">
            <button id="back-button" aria-label="Go Back">
                <img src="../images/weui--back-filled.svg" alt="Back">
            </button>
            <h2 class="favorite-title">Favorite Restaurants</h2>
        </div>
        <div id="favorite-container" class="favorites-container"></div>
    `;

    const favoriteContainer = document.getElementById("favorite-container");
    const backButton = document.getElementById("back-button");

    // Event listener untuk tombol kembali
    backButton.addEventListener("click", () => {
        heroSection.style.display = "block"; // Tampilkan kembali elemen .hero
        mainContent.innerHTML = ""; // Bersihkan konten favorit
        location.hash = "/"; // Ubah URL menjadi halaman utama
    });

    try {
        const favorites = await fetchAllFavorites(); // Ambil semua data favorit dari IndexedDB

        if (favorites.length === 0) {
            favoriteContainer.innerHTML = `<p>No favorite restaurants found.</p>`;
            return;
        }

        // Render daftar restoran favorit
        favoriteContainer.innerHTML = favorites
            .map((restaurant) => createFavoriteCard(restaurant))
            .join("");

        // Tambahkan event listener untuk tombol hapus
        // Tambahkan event listener untuk tombol hapus
        const deleteButtons = document.querySelectorAll(".delete-toggle-button");
        deleteButtons.forEach((button) => {
            button.addEventListener("click", async (event) => {
                const restaurantId = event.target.closest("button").dataset.id;

                // Hapus dari IndexedDB
                await removeFromFavorites(restaurantId);

                // Cari elemen kartu berdasarkan ID
                const restaurantElement = document.querySelector(
                    `.favorite-card[data-id="${restaurantId}"]`
                );

                // Pastikan elemen ditemukan sebelum mencoba menghapusnya
                if (restaurantElement) {
                    restaurantElement.remove();
                } else {
                    console.error(`Element with data-id="${restaurantId}" not found.`);
                }

                // Tampilkan pesan jika semua restoran favorit telah dihapus
                if (document.querySelectorAll(".favorite-card").length === 0) {
                    favoriteContainer.innerHTML = `<p>No favorite restaurants found.</p>`;
                }
            });
        });

        const detailButtons = document.querySelectorAll(".detail-button");
        detailButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                const restaurantId = event.target.dataset.id;
                showDetail(restaurantId, "favorites");
            });
        });

    } catch (error) {
        favoriteContainer.innerHTML = `<p>Failed to load favorite restaurants. Please try again later.</p>`;
        console.error("Error loading favorite restaurants:", error);
    }
};

export default Favorite;