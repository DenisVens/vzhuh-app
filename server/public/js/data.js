// Глобальная переменная для данных
let db = {
    restaurants: []
};

// 1. Убираем localhost, чтобы ссылка работала везде.
// Теперь это относительный путь.
const API_URL = '/api';

// 2. Функция, которая запрашивает данные с нашего сервера
async function fetchRestaurants() {
    try {
        const response = await fetch(`${API_URL}/restaurants`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        db.restaurants = data; // Заполняем нашу переменную данными с сервера
        console.log('✅ Данные с сервера получены:', db.restaurants.length, 'ресторанов');
    } catch (error) {
        console.error('❌ Ошибка при загрузке данных с сервера:', error);
        // Можно показать ошибку на странице, если что-то пошло не так
        const restGrid = document.querySelector('.restaurants-grid');
        if(restGrid) {
            restGrid.innerHTML = `<p style="grid-column:1/-1; text-align:center; color: red;">Не удалось загрузить рестораны. Сервер недоступен.</p>`;
        }
    }
}
