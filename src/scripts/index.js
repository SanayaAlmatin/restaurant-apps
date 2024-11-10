import 'regenerator-runtime';
import '../styles/main.scss';

// Toggle untuk hamburger button
const hamburgerButton = document.querySelector(".hamburger-button");
if (hamburgerButton) {
    hamburgerButton.addEventListener("click", function () {
        this.classList.toggle("active");
        document.querySelector(".nav-menu").classList.toggle("active");
    });
}

// Fungsi toggle untuk deskripsi
function toggleDescription(button) {
    const description = button.previousElementSibling;
    if (description.classList.contains("expanded")) {
        description.classList.remove("expanded");
        button.textContent = "Read More";
    } else {
        description.classList.add("expanded");
        button.textContent = "Read Less";
    }
}

// Attach toggleDescription function to buttons
document.querySelectorAll(".toggle-button").forEach(button => {
    button.addEventListener("click", function () {
        toggleDescription(button);
    });
});

// Fungsi untuk memuat dan menampilkan restoran dalam bentuk carousel
document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector(".carousel");
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");
    const itemsPerPage = 3; // Menampilkan 3 item per halaman
    let currentPage = 0;
    let totalPages = 0;
    let restaurantsData = [];

    // Memuat data dari JSON dan menampilkan di carousel
    fetch("data/DATA.json")
        .then(response => response.json())
        .then(data => {
            restaurantsData = data.restaurants;
            totalPages = Math.ceil(restaurantsData.length / itemsPerPage);
            updateCarousel();
        })
        .catch(error => console.error("Failed to load data:", error));

    // Update carousel untuk menampilkan 3 item
    function updateCarousel() {
        carousel.innerHTML = ""; // Bersihkan carousel
        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;
        const itemsToShow = restaurantsData.slice(start, end);

        itemsToShow.forEach(restaurant => {
            const card = document.createElement("div");
            card.classList.add("restaurant-card");
            card.innerHTML = `
                <div class="location">City: ${restaurant.city}</div>
                <img src="${restaurant.pictureId}" alt="${restaurant.name}">
                <div class="restaurant-card__details">
                    <p class="rating">Rating: <span>${restaurant.rating}</span></p>
                    <h3>${restaurant.name}</h3>
                    <p class="description">${restaurant.description.substring(0, 50)}...</p>
                    <button class="toggle-button">Read More</button>
                </div>
            `;
            carousel.appendChild(card);
        });

        // Event listener untuk tombol "Read More"
        document.querySelectorAll(".toggle-button").forEach(button => {
            button.addEventListener("click", function () {
                const description = this.previousElementSibling;
                description.classList.toggle("expanded");
                this.textContent = description.classList.contains("expanded") ? "Read Less" : "Read More";
            });
        });
    }

    // Event listener untuk tombol navigasi
    prevButton.addEventListener("click", () => {
        if (currentPage > 0) currentPage--;
        updateCarousel();
    });

    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages - 1) currentPage++;
        updateCarousel();
    });
});