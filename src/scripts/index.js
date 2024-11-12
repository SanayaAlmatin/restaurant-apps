import 'regenerator-runtime';
import '../styles/main.scss';

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

document.querySelectorAll(".toggle-button").forEach(button => {
    button.addEventListener("click", function () {
        toggleDescription(button);
    });
});

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

    fetch("data/DATA.json")
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

        document.querySelectorAll(".toggle-button").forEach(button => {
            button.addEventListener("click", function () {
                const description = this.previousElementSibling;
                description.classList.toggle("expanded");
                this.textContent = description.classList.contains("expanded") ? "Read Less" : "Read More";
            });
        });

        if (window.innerWidth <= 768) {
            prevButton.style.display = "none";
            nextButton.style.display = "none";
        } else {
            prevButton.style.display = "block";
            nextButton.style.display = "block";
        }
    }

    prevButton.addEventListener("click", () => {
        if (currentPage > 0) currentPage--;
        updateCarousel();
    });

    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages - 1) currentPage++;
        updateCarousel();
    });

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