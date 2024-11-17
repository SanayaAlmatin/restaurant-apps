import 'regenerator-runtime';
import '../styles/main.scss';

// IndexedDB Utility Functions
const dbName = "restaurant-favorites";
const storeName = "favorites";

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = event => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, {
                    keyPath: "id"
                });
            }
        };

        request.onsuccess = event => resolve(event.target.result);
        request.onerror = event => reject(event.target.error);
    });
}

function addFavorite(restaurant) {
    return openDatabase().then(db => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const addRequest = store.add(restaurant);
            addRequest.onsuccess = () => resolve();
            addRequest.onerror = () => reject(addRequest.error);
        });
    });
}

function removeFavorite(id) {
    return openDatabase().then(db => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const deleteRequest = store.delete(id);
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
        });
    });
}

function isFavorite(id) {
    return openDatabase().then(db => {
        return new Promise(resolve => {
            const tx = db.transaction(storeName, "readonly");
            const store = tx.objectStore(storeName);
            const request = store.get(id);

            request.onsuccess = () => resolve(!!request.result);
            request.onerror = () => resolve(false);
        });
    });
}

function getAllFavorites() {
    return openDatabase().then(db => {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, "readonly");
            const store = tx.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    });
}

function deleteFavorite(id) {
    return openDatabase().then(db => {
        const transaction = db.transaction(storeName, "readwrite"); // Menggunakan storeName
        const store = transaction.objectStore(storeName);

        return new Promise((resolve, reject) => {
            const deleteRequest = store.delete(id);
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
        });
    });
}

// Mendapatkan jumlah item per halaman berdasarkan ukuran layar
function getItemsPerPage(dataLength) {
    return window.innerWidth <= 768 ? dataLength : 3;
}

document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector(".carousel");
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");
    let itemsPerPage = 3;
    let currentPage = 0;
    let totalPages = 0;
    let restaurantsData = [];

    // Mengganti URL ke API
    fetch("https://restaurant-api.dicoding.dev/list")
        .then(response => response.json())
        .then(data => {
            restaurantsData = data.restaurants;
            itemsPerPage = getItemsPerPage(restaurantsData.length);
            totalPages = Math.ceil(restaurantsData.length / itemsPerPage);
            updateCarousel();
        })
        .catch(error => console.error("Failed to load data:", error));

    function updateCarousel() {
        carousel.innerHTML = "";

        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;
        const itemsToShow = window.innerWidth <= 768 ? restaurantsData : restaurantsData.slice(start, end);

        itemsToShow.forEach(restaurant => {
            const card = document.createElement("div");
            card.classList.add("restaurant-card");
            card.innerHTML = `
                <div class="location">City: ${restaurant.city}</div>
                <img src="https://restaurant-api.dicoding.dev/images/small/${restaurant.pictureId}" alt="${restaurant.name}">
                <div class="restaurant-card__details">
                    <p class="rating">Rating: <span>${restaurant.rating}</span></p>
                    <h3>${restaurant.name}</h3>
                    <p class="description">${restaurant.description.substring(0, 50)}...</p>
                    <div class="favorite-icon">
                        <img src="../images/uil--favorite.svg" alt="favorite icon" class="favorite-toggle" data-id="${restaurant.id}">
                    </div>
                    <button class="toggle-button" data-id="${restaurant.id}">Detail</button>
                </div>
            `;
            carousel.appendChild(card);

            // Cek status favorit untuk setiap restoran
            const favoriteIcon = card.querySelector(".favorite-toggle");
            isFavorite(restaurant.id).then(isFav => {
                favoriteIcon.src = isFav ? "../images/uim--favorite.svg" : "../images/uil--favorite.svg";
            });

            // Tambahkan event listener untuk ikon favorit
            favoriteIcon.addEventListener("click", () => {
                isFavorite(restaurant.id).then(isFav => {
                    if (isFav) {
                        removeFavorite(restaurant.id).then(() => {
                            favoriteIcon.src = "../images/uil--favorite.svg";
                        });
                    } else {
                        addFavorite(restaurant).then(() => {
                            favoriteIcon.src = "../images/uim--favorite.svg";
                        });
                    }
                });
            });

            // Tambahkan event listener untuk tombol detail
            const detailButton = card.querySelector(".toggle-button");
            detailButton.addEventListener("click", () => {
                showDetail(restaurant.id);
            });
        });

        // Atur visibilitas tombol carousel untuk layar kecil
        if (window.innerWidth <= 768) {
            prevButton.style.display = "none";
            nextButton.style.display = "none";
        } else {
            prevButton.style.display = "block";
            nextButton.style.display = "block";
        }
    }

    // Fungsi untuk menampilkan halaman detail
    function showDetail(id) {
        const mainContent = document.querySelector(".main-content");
        const detailContent = document.createElement("section");
        const hero = document.querySelector(".hero");
        const mainFooter = document.querySelector(".main-footer");
        detailContent.classList.add("restaurant-detail");

        // Tambahkan kelas .detail-page ke elemen body
        document.body.classList.add("detail-page");

        // Memuat data detail dari API menggunakan ID
        fetch(`https://restaurant-api.dicoding.dev/detail/${id}`)
            .then(response => response.json())
            .then(data => {
                const restaurant = data.restaurant;
                detailContent.innerHTML = `
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
                                    ${restaurant.menus.foods.map(food => `<li>${food.name}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="menu-drinks">
                                <h4>Drinks</h4>
                                <ul>
                                    ${restaurant.menus.drinks.map(drink => `<li>${drink.name}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                        <div class="customer-reviews">
                            <h3>Customer Reviews</h3>
                            <div class="review-list">
                                ${restaurant.customerReviews.map(review => `
                                    <div class="review">
                                        <p><strong>${review.name}</strong></p>
                                        <p>${review.review}</p>
                                        <p id="date-review">${review.date}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;

                document.body.appendChild(detailContent);
                mainContent.style.display = "none";
                hero.style.display = "none";
                mainFooter.style.display = "none";
                detailContent.style.display = "block";

                // Buat footer baru
                const footer = document.createElement('footer');
                const div1 = document.createElement('div');
                const section = document.createElement('section');

                const instagramLink = document.createElement('a');
                instagramLink.href = '#!';
                instagramLink.role = 'button';
                instagramLink.setAttribute('data-title', 'Instagram');
                instagramLink.style.backgroundColor = '#ac2bac';
                instagramLink.innerHTML = '<i class="fab fa-instagram"></i>';

                const githubLink = document.createElement('a');
                githubLink.href = 'https://github.com/SanayaAlmatin';
                githubLink.target = '_blank';
                githubLink.role = 'button';
                githubLink.setAttribute('data-title', 'GitHub');
                githubLink.style.backgroundColor = '#333333';
                githubLink.innerHTML = '<i class="fab fa-github"></i>';

                section.appendChild(instagramLink);
                section.appendChild(githubLink);
                div1.appendChild(section);

                const div2 = document.createElement('div');
                div2.className = 'text-footer';
                div2.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                div2.innerHTML = `
                    © 2024 Copyright:
                    <p>Muchamad Sanaya Almatin (Id: F1837YB42)</p>
                `;

                footer.appendChild(div1);
                footer.appendChild(div2);

                document.body.appendChild(footer);

                // Scroll ke bagian "restaurant-name"
                document.getElementById("restaurant-name").scrollIntoView({
                    behavior: "smooth"
                });

                // Tambahkan event listener untuk tombol back
                document.getElementById("back-button").addEventListener("click", () => {
                    detailContent.remove();
                    footer.remove();
                    hero.style.height = "100vh"; // Sesuaikan jika ada perubahan ukuran
                    hero.style.display = "flex";
                    hero.style.alignItems = "center";
                    hero.style.justifyContent = "center";
                    mainContent.style.display = "block";
                    mainFooter.style.display = "block";
                    document.body.classList.remove("detail-page");
                    document.getElementById("restaurant-list").scrollIntoView({
                        behavior: "smooth"
                    });
                });
            })
            .catch(error => console.error("Failed to load detail:", error));
    }

    // Fungsi untuk navigasi carousel
    prevButton.addEventListener("click", () => {
        if (currentPage > 0) currentPage--;
        updateCarousel();
    });

    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages - 1) currentPage++;
        updateCarousel();
    });

    // Ubah jumlah item per halaman jika ukuran layar berubah
    window.addEventListener("resize", () => {
        const newItemsPerPage = getItemsPerPage(restaurantsData.length);
        if (newItemsPerPage !== itemsPerPage) {
            itemsPerPage = newItemsPerPage;
            totalPages = Math.ceil(restaurantsData.length / itemsPerPage);
            currentPage = 0;
            updateCarousel();
        }
    });
});

document.getElementById("favorite-menu").addEventListener("click", (event) => {
    event.preventDefault();

    const mainContent = document.querySelector(".main-content");
    const hero = document.querySelector(".hero");
    const mainFooter = document.getElementById("main-footer"); // Footer utama
    const existingFavoriteSection = document.querySelector(".favorites-section");
    const existingFavoritesFooter = document.querySelector("footer.favorites-footer");

    // Hapus section favorit yang sudah ada untuk mencegah duplikasi
    if (existingFavoriteSection) {
        existingFavoriteSection.remove();
    }

    // Hapus footer khusus favorit jika sudah ada
    if (existingFavoritesFooter) {
        existingFavoritesFooter.remove();
    }

    // Buat section favorit baru
    const favoriteSection = document.createElement("section");
    favoriteSection.classList.add("favorites-section");

    // Tambahkan tombol kembali dengan gambar SVG
    const backButton = document.createElement("button");
    backButton.id = "back-button";
    backButton.innerHTML = `
        <img src="../images/weui--back-filled.svg" alt="Back to home button">
    `;
    backButton.classList.add("back-to-home");

    // Tambahkan listener untuk tombol kembali
    backButton.addEventListener("click", () => {
        favoriteSection.remove();
        favoritesFooter.remove(); // Hapus footer khusus favorit
        mainContent.style.display = "block";
        hero.style.display = "block";
        mainFooter.style.display = "block"; // Tampilkan kembali footer utama
        hero.style.height = "100vh"; // Sesuaikan jika ada perubahan ukuran
        hero.style.display = "flex";
        hero.style.alignItems = "center";
        hero.style.justifyContent = "center";
        document.body.classList.remove("favorites-page");
    });

    // Susun tombol kembali dan judul di dalam section favorit
    favoriteSection.innerHTML = `
        <div class="favorites-header">
            <h2>Your Favorites</h2>
        </div>
        <div class="favorites-container"></div>
    `;

    // Tambahkan tombol ke dalam header favorit
    const favoritesHeader = favoriteSection.querySelector(".favorites-header");
    favoritesHeader.prepend(backButton);

    // Sembunyikan elemen utama lainnya
    document.body.classList.add("favorites-page");
    mainContent.style.display = "none";
    hero.style.display = "none";
    mainFooter.style.display = "none"; // Sembunyikan footer utama

    // Tambahkan section favorit ke body
    document.body.appendChild(favoriteSection);

    const favoritesContainer = favoriteSection.querySelector(".favorites-container");

    // Mengambil data favorit dari IndexedDB
    getAllFavorites()
        .then((favorites) => {
            favoritesContainer.innerHTML = "";

            if (favorites.length === 0) {
                favoritesContainer.innerHTML = `<p>No favorite restaurants yet.</p>`;
                return;
            }

            favorites.forEach((restaurant) => {
                const card = document.createElement("div");
                card.classList.add("favorite-card");
                card.innerHTML = `
                    <div class="favorite-location">City: ${restaurant.city}</div>
                    <img src="https://restaurant-api.dicoding.dev/images/small/${restaurant.pictureId}" alt="${restaurant.name}">
                    <div class="favorite-card__details">
                        <p class="favorite-rating">Rating: <span>${restaurant.rating}</span></p>
                        <h3>${restaurant.name}</h3>
                        <p class="favorite-description">${restaurant.description.substring(0, 50)}...</p>
                        <button class="delete-toggle-button" data-id="${restaurant.id}">
                            <img src="../images/ion--trash.svg" alt="Delete Favorite">
                        </button>
                    </div>
                `;
                favoritesContainer.appendChild(card);

                // Tambahkan event listener untuk tombol hapus
                const deleteButton = card.querySelector(".delete-toggle-button");
                deleteButton.addEventListener("click", () => {
                    if (confirm(`Are you sure you want to remove "${restaurant.name}" from favorites?`)) {
                        deleteFavorite(restaurant.id) // Fungsi untuk menghapus dari IndexedDB
                            .then(() => {
                                // Hapus kartu dari DOM setelah berhasil dihapus
                                card.remove();

                                // Tampilkan pesan jika tidak ada favorit yang tersisa
                                if (favoritesContainer.children.length === 0) {
                                    favoritesContainer.innerHTML = `<p>No favorite restaurants yet.</p>`;
                                }
                            })
                            .catch((error) => console.error("Failed to delete favorite:", error));
                    }
                });
            });

        })
        .catch((error) => console.error("Failed to load favorites:", error));

    // Tambahkan footer khusus untuk halaman favorites
    const favoritesFooter = document.createElement("footer");
    favoritesFooter.classList.add("favorites-footer");
    favoritesFooter.innerHTML = `
    <div>
        <section>
            <a style="background-color: #ac2bac;" href="#!" role="button" data-title="Instagram"><i class="fab fa-instagram"></i></a>
            <a style="background-color: #333333;" href="https://github.com/SanayaAlmatin" target="_blank" rel="noopener noreferrer" role="button" data-title="GitHub"><i class="fab fa-github"></i></a>
        </section>
    </div>
    <div class="text-footer" style="background-color: rgba(0, 0, 0, 0.05);">
        © 2024 Copyright:
        <p>Muchamad Sanaya Almatin (Id: F1837YB42)</p>
    </div>
`;
    document.body.appendChild(favoritesFooter);
});