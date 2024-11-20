import Home from '../views/pages/home.js';
import Detail from '../views/pages/detail.js';
import Favorites from '../views/pages/favorites.js';

const routes = {
    "/": Home,
    "/detail/:id": Detail,
    "/favorites": Favorites,
};

export default routes;