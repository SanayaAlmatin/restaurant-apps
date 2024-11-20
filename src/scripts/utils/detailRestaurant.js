export function showDetail(id, source = "home") {
    const mainContent = document.querySelector(".main-content");
    const detailContent = document.createElement("section");
    const hero = document.querySelector(".hero");
    const mainFooter = document.querySelector(".main-footer");
    detailContent.classList.add("restaurant-detail");

    // Tambahkan kelas .detail-page ke elemen body
    document.body.classList.add("detail-page");

    // Memuat data detail dari API menggunakan ID
    fetch(`https://restaurant-api.dicoding.dev/detail/${id}`)
        .then((response) => response.json())
        .then((data) => {
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
                                ${restaurant.menus.foods.map((food) => `<li>${food.name}</li>`).join("")}
                            </ul>
                        </div>
                        <div class="menu-drinks">
                            <h4>Drinks</h4>
                            <ul>
                                ${restaurant.menus.drinks.map((drink) => `<li>${drink.name}</li>`).join("")}
                            </ul>
                        </div>
                    </div>
                    <div class="customer-reviews">
                        <h3>Customer Reviews</h3>
                        <div class="review-list">
                            ${restaurant.customerReviews.map((review) => `
                                <div class="review">
                                    <p><strong>${review.name}</strong></p>
                                    <p>${review.review}</p>
                                    <p id="date-review">${review.date}</p>
                                </div>
                            `).join("")}
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
            const footer = document.createElement("footer");
            const div1 = document.createElement("div");
            const section = document.createElement("section");

            const instagramLink = document.createElement("a");
            instagramLink.href = "#!";
            instagramLink.role = "button";
            instagramLink.setAttribute("data-title", "Instagram");
            instagramLink.style.backgroundColor = "#ac2bac";
            instagramLink.innerHTML = '<i class="fab fa-instagram"></i>';

            const githubLink = document.createElement("a");
            githubLink.href = "https://github.com/SanayaAlmatin";
            githubLink.target = "_blank";
            githubLink.role = "button";
            githubLink.setAttribute("data-title", "GitHub");
            githubLink.style.backgroundColor = "#333333";
            githubLink.innerHTML = '<i class="fab fa-github"></i>';

            section.appendChild(instagramLink);
            section.appendChild(githubLink);
            div1.appendChild(section);

            const div2 = document.createElement("div");
            div2.className = "text-footer";
            div2.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
            div2.innerHTML = `
                © 2024 Copyright:
                <p>Muchamad Sanaya Almatin (Id: F1837YB42)</p>
            `;

            footer.appendChild(div1);
            footer.appendChild(div2);

            document.body.appendChild(footer);

            // Scroll ke bagian "restaurant-name"
            document.getElementById("restaurant-name").scrollIntoView({
                behavior: "smooth",
            });

            // Tambahkan event listener untuk tombol back
            document.getElementById("back-button").addEventListener("click", () => {
                detailContent.remove();
                footer.remove();
                document.body.classList.remove("detail-page");

                if (source === "favorites") {
                    // Tampilkan kembali halaman favorit
                    import("../views/pages/favorites.js").then((module) => {
                        module.default();
                    });
                } else {
                    // Tampilkan kembali halaman utama
                    hero.style.height = "100vh";
                    hero.style.display = "flex";
                    hero.style.alignItems = "center";
                    hero.style.justifyContent = "center";
                    mainContent.style.display = "block";
                    mainFooter.style.display = "block";
                    document.getElementById("restaurant-list").scrollIntoView({
                        behavior: "smooth",
                    });
                }
            });
        })
        .catch((error) => console.error("Failed to load detail:", error));
}