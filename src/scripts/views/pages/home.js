import createRestaurantCard from "../templates/restaurantCard.js";
import {
    showDetail
} from "../pages/detailPage.js";
import {
    addToFavorites,
    removeFromFavorites,
    isFavorite
} from "../../utils/favoriteRestaurant.js"; // Import util favorit dengan nama baru

const Home = async () => {
    const carousel = document.querySelector(".carousel");
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");

    let itemsPerPage = 3; // Jumlah kartu per halaman dalam mode desktop
    let currentPage = 0;
    let totalPages = 0;
    let restaurantsData = [];

    const isMobile = () => window.innerWidth <= 768; // Deteksi mode mobile

    // Fungsi untuk merender semua restoran (mobile mode)
    function renderAllRestaurants() {
        carousel.innerHTML = restaurantsData
            .map((restaurant) => createRestaurantCard(restaurant))
            .join("");

        // Tambahkan event listener ke tombol
        attachButtonListeners();
    }

    // Fungsi untuk merender halaman berdasarkan currentPage (desktop mode)
    function renderPage() {
        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;

        // Potong data berdasarkan halaman saat ini
        const itemsToShow = restaurantsData.slice(start, end);

        // Render kartu restoran
        carousel.innerHTML = itemsToShow
            .map((restaurant) => createRestaurantCard(restaurant))
            .join("");

        // Tambahkan event listener ke tombol
        attachButtonListeners();
    }

    const checkMobileView = () => {
        if (isMobile()) {
            prevButton.style.display = "none";
            nextButton.style.display = "none";
            renderAllRestaurants(); // Gunakan renderAllRestaurants untuk mobile view
        } else {
            prevButton.style.display = "block";
            nextButton.style.display = "block";
            renderPage(); // Gunakan renderPage untuk desktop view
        }
    };

    // Tambahkan event listener untuk perubahan ukuran layar
    window.addEventListener("resize", checkMobileView);

    try {
        // Fetch data dari API
        const response = await fetch("https://restaurant-api.dicoding.dev/list");
        const data = await response.json();
        restaurantsData = data.restaurants;

        // Hitung total halaman berdasarkan jumlah kartu per halaman
        totalPages = Math.ceil(restaurantsData.length / itemsPerPage);

        // Render kartu restoran untuk tampilan awal
        checkMobileView();

        // Event listener untuk tombol navigasi
        prevButton.addEventListener("click", () => {
            if (currentPage > 0) {
                currentPage--;
                renderPage();
            }
        });

        nextButton.addEventListener("click", () => {
            if (currentPage < totalPages - 1) {
                currentPage++;
                renderPage();
            }
        });
    } catch (error) {
        console.error("Failed to fetch restaurants:", error);
        carousel.innerHTML = `<p>Failed to load restaurants. Please try again later.</p>`;
    }

    // Fungsi untuk menambahkan event listener ke tombol
    function attachButtonListeners() {
        // Event listener untuk tombol "Detail"
        const detailButtons = document.querySelectorAll(".detail-button");
        detailButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                const restaurantId = event.target.dataset.id;
                showDetail(restaurantId);
            });
        });

        // Event listener untuk tombol "Favorite"
        const favoriteIcons = document.querySelectorAll(".favorite-toggle");
        favoriteIcons.forEach(async (icon) => {
            const restaurantId = icon.dataset.id;

            // Set status awal tombol berdasarkan apakah restoran sudah difavoritkan
            if (await isFavorite(restaurantId)) {
                icon.src = "../images/uim--favorite.svg"; // Gambar untuk status difavoritkan
            }

            icon.addEventListener("click", async () => {
                if (await isFavorite(restaurantId)) {
                    await removeFromFavorites(restaurantId);
                    icon.src = "../images/uil--favorite.svg"; // Gambar untuk status tidak difavoritkan
                } else {
                    const restaurant = restaurantsData.find((r) => r.id === restaurantId);
                    await addToFavorites(restaurant);
                    icon.src = "../images/uim--favorite.svg"; // Gambar untuk status difavoritkan
                }
            });
        });
    }
};

export default Home;