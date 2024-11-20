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

// (Tambahkan fungsi `removeFavorite`, `isFavorite`, `getAllFavorites` dengan cara serupa)

export {
    openDatabase,
    addFavorite,
    removeFavorite,
    isFavorite,
    getAllFavorites,
    deleteFavorite
};