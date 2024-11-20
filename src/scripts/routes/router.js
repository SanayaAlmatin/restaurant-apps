// router.js
import routes from './routes.js';

const Router = () => {
    const path = location.hash.slice(1).toLowerCase() || "/";
    const urlParts = path.split("/");

    const parsedRoute = `/${urlParts[1] ? urlParts[1] : ""}${urlParts[2] ? "/:id" : ""}`;
    const page = routes[parsedRoute] || routes["/"];

    page(urlParts[2]); // Kirim parameter ID jika ada
};

const navigateTo = (hash) => {
    location.hash = hash; // Navigasi ke route berdasarkan hash
};

window.addEventListener("hashchange", Router);
window.addEventListener("load", Router);

export {
    navigateTo
};