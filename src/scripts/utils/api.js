// utils/api.js

export async function fetchRestaurantDetail(id) {
    try {
        const response = await fetch(`https://restaurant-api.dicoding.dev/detail/${id}`);
        if (!response.ok) throw new Error("Failed to fetch restaurant detail");
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}