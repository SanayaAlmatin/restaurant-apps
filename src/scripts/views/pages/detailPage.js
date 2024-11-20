import {
    fetchRestaurantDetail
} from "../../utils/api.js";
import {
    createFooter
} from "../templates/footerTemplate.js";
import {
    createDetailContent
} from "../templates/detailTemplate.js";

export async function showDetail(id) {
    const mainContent = document.querySelector(".main-content");
    const hero = document.querySelector(".hero");
    const mainFooter = document.querySelector(".main-footer");

    try {
        document.body.classList.add("detail-page");

        const data = await fetchRestaurantDetail(id);
        const {
            restaurant
        } = data;

        const detailContent = createDetailContent(restaurant);
        document.body.appendChild(detailContent);

        if (mainContent && hero && mainFooter) {
            mainContent.style.display = "none";
            hero.style.display = "none";
            mainFooter.style.display = "none";
        }

        const footer = createFooter();
        document.body.appendChild(footer);

        document.getElementById("restaurant-name").scrollIntoView({
            behavior: "smooth"
        });

        const backButton = document.getElementById("back-button");
        if (backButton) {
            backButton.addEventListener("click", () => {
                detailContent.remove();
                footer.remove();
                if (mainContent && hero && mainFooter) {
                    hero.style.height = "100vh";
                    hero.style.display = "flex";
                    hero.style.alignItems = "center";
                    hero.style.justifyContent = "center";
                    mainContent.style.display = "block";
                    mainFooter.style.display = "block";
                }
                document.body.classList.remove("detail-page");
                document.getElementById("restaurant-list").scrollIntoView({
                    behavior: "smooth"
                });
            });
        }
    } catch (error) {
        console.error("Failed to load detail page:", error);
        if (mainContent) {
            mainContent.innerHTML = `<p>Failed to load detail page. Please try again later.</p>`;
        }
    }
}