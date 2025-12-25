// js/data.js
// Глобальный объект для хранения данных
let db = {
    restaurants: []
};

// URL твоего сервера (пока локальный, потом поменяем на рабочий)
const API_URL = 'http://localhost:5000/api';

// Функция загрузки данных
async function fetchRestaurants() {
    try {
        const response = await fetch(`${API_URL}/restaurants`);
        const data = await response.json();
        db.restaurants = data; // Записываем данные в глобальную переменную
        console.log('Данные загружены:', db.restaurants.length);
    } catch (error) {
        console.error('Ошибка связи с сервером:', error);
        alert('Сервер недоступен. Попробуйте позже.');
    }
}