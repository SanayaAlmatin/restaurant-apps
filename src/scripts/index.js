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
        store.add(restaurant);
        return tx.complete;
    });
}

function removeFavorite(id) {
    return openDatabase().then(db => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        store.delete(id);
        return tx.complete;
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
                    mainContent.style.display = "block";
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