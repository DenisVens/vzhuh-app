// js/data.js

// Глобальная переменная для данных
var db = {
    restaurants: []
};

// URL API (относительный путь, чтобы работало и локально, и на сервере)
const API_URL = '/api';

// Функция загрузки данных
async function fetchRestaurants() {
    try {
        console.log('🔄 Начинаю загрузку данных...');
        const response = await fetch(`${API_URL}/restaurants`);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        db.restaurants = data;
        console.log(`✅ Данные загружены: ${db.restaurants.length} ресторанов`);
        return true;
    } catch (error) {
        console.error('❌ Не удалось загрузить данные:', error);
        return false;
    }
}
