// js/pages.js

// --- Глобальные функции (доступны из HTML) ---

window.deleteOrder = function(id) {
    if(!confirm('Удалить этот заказ из истории?')) return;
    
    let orders = JSON.parse(localStorage.getItem('vzhuh_orders')) || [];
    // Если на бэкенде нет удаления, удаляем локально для вида, 
    // но в идеале тут нужен fetch DELETE запрос
    orders = orders.filter(o => o.id !== id);
    localStorage.setItem('vzhuh_orders', JSON.stringify(orders));
    
    location.reload();
};

window.clearAllOrders = function() {
    if(!confirm('Вы уверены, что хотите удалить всю историю заказов?')) return;
    
    localStorage.removeItem('vzhuh_orders');
    location.reload();
};

window.toggleFavorite = function(id) {
    let favs = JSON.parse(localStorage.getItem('vzhuh_favs')) || [];
    const index = favs.indexOf(id);
    if (index === -1) favs.push(id);
    else favs.splice(index, 1);
    localStorage.setItem('vzhuh_favs', JSON.stringify(favs));
    location.reload();
};

window.openProductModal = function(itemId) {
    let product;
    if(typeof db !== 'undefined' && db.restaurants) {
        db.restaurants.forEach(r => {
            const found = r.menu.find(i => i.id === itemId);
            if(found) product = found;
        });
    }
    if(!product) return;

    document.getElementById('pm-img').src = product.img || 'img/placeholder.png';
    document.getElementById('pm-title').innerText = product.name;
    document.getElementById('pm-weight').innerText = `${product.weight} г • ${product.calories} ккал`;
    document.getElementById('pm-desc').innerText = product.desc || "Описание отсутствует";
    // Используем глобальную функцию priceFormat, если она есть, иначе просто число
    const price = typeof priceFormat === 'function' ? priceFormat(product.price) : product.price;
    document.getElementById('pm-price').innerText = `${price} ₽`;

    document.getElementById('pm-prot').innerText = product.protein || '-';
    document.getElementById('pm-fat').innerText = product.fats || '-';
    document.getElementById('pm-carb').innerText = product.carbs || '-';
    document.getElementById('pm-cal').innerText = product.calories || '-';

    const addBtn = document.getElementById('pm-add-btn');
    if(addBtn) {
        addBtn.onclick = () => {
            cart.add(product.id);
            closeProductModal();
        };
    }

    const modal = document.getElementById('productModal');
    if(modal) modal.classList.add('open');
};

window.closeProductModal = function() {
    const modal = document.getElementById('productModal');
    if(modal) modal.classList.remove('open');
};

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('product-modal-backdrop')) {
        closeProductModal();
    }
});

// --- ГЛАВНАЯ ЛОГИКА ЗАГРУЗКИ ---
document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. Ждем данные с сервера
    const loaded = await fetchRestaurants();

    // Если данные не загрузились, db.restaurants будет пустым, но код продолжит работать
    
    const params = new URLSearchParams(window.location.search);
    const savedFavs = JSON.parse(localStorage.getItem('vzhuh_favs')) || [];
    const currentTag = params.get('tag');

    // --- СТРАНИЦА: ГЛАВНАЯ (index.html) ---
    const restGrid = document.querySelector('.restaurants-grid:not(#favorites-grid)');
    if (restGrid) {
        
        // Популярное (Слайдер сверху)
        const popContainer = document.getElementById('popular-section');
        if(popContainer && db.restaurants.length > 0) {
            const popularItems = [];
            db.restaurants.slice(0, 5).forEach(r => {
                if(r.menu.length > 0) popularItems.push({ ...r.menu[0], rName: r.name });
            });
            
            popContainer.innerHTML = popularItems.map(item => `
                <div class="popular-item" onclick="openProductModal(${item.id})">
                    <img src="${item.img}" alt="">
                    <div class="popular-info">
                        <h4>${item.name}</h4>
                        <p>${item.price} ₽</p>
                    </div>
                </div>
            `).join('');
        }

        // Список ресторанов
        const renderList = (list) => {
            if (list.length === 0) {
                if (!loaded) {
                    restGrid.innerHTML = `<p style="grid-column:1/-1; text-align:center; color: red;">Ошибка подключения к серверу</p>`;
                } else {
                    restGrid.innerHTML = `<p style="grid-column:1/-1; text-align:center; color: var(--text-gray)">Ничего не найдено :(</p>`;
                }
                return;
            }
            restGrid.innerHTML = list.map(rest => {
                const isFav = savedFavs.includes(rest.id) ? 'active' : '';
                return `
                <div class="restaurant-card-wrapper">
                    <button class="like-btn ${isFav}" onclick="event.preventDefault(); toggleFavorite(${rest.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                    <a href="restaurant.html?id=${rest.id}" style="text-decoration:none; color:inherit">
                        <div class="restaurant-card">
                            <img src="${rest.image}" class="res-img" alt="${rest.name}">
                            <div class="res-info">
                                <div class="res-header">
                                    <h3>${rest.name}</h3>
                                    <span class="res-rating"><i class="fas fa-star"></i> ${rest.rating}</span>
                                </div>
                                <div class="res-meta">
                                    ${rest.time} • ${rest.tags.join(', ')}
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            `}).join('');
        };

        let currentList = db.restaurants;
        if (currentTag) {
            currentList = db.restaurants.filter(r => r.tags.includes(currentTag));
            const titleEl = document.querySelector('.section-title.rest-title-main');
            if(titleEl) titleEl.innerText = currentTag;
        }
        renderList(currentList);

        // Поиск
        const searchInput = document.getElementById('main-search');
        if(searchInput) {
            searchInput.addEventListener('input', (e) => {
                const val = e.target.value.toLowerCase();
                if(!val) {
                    renderList(currentList);
                    return;
                }
                const filtered = currentList.filter(r => 
                    r.name.toLowerCase().includes(val) || 
                    r.tags.some(t => t.toLowerCase().includes(val))
                );
                renderList(filtered);
            });
        }
    }

    // --- СТРАНИЦА: ЛЮБИМОЕ (favorites.html) ---
    const favGrid = document.getElementById('favorites-grid');
    if (favGrid) {
        const favoriteRestaurants = db.restaurants.filter(r => savedFavs.includes(r.id));
        if (favoriteRestaurants.length === 0) {
            favGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align:center; margin-top:3rem; color:gray">
                    <i class="far fa-heart" style="font-size:3rem; margin-bottom:1rem; opacity:0.5"></i>
                    <p>Вы пока никого не лайкнули</p>
                    <a href="index.html" style="color:var(--primary); margin-top:1rem; display:inline-block">Перейти к ресторанам</a>
                </div>
            `;
        } else {
            favGrid.innerHTML = favoriteRestaurants.map(rest => `
                <div class="restaurant-card-wrapper">
                    <button class="like-btn active" onclick="toggleFavorite(${rest.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                    <a href="restaurant.html?id=${rest.id}" style="text-decoration:none; color:inherit">
                        <div class="restaurant-card">
                            <img src="${rest.image}" class="res-img" alt="${rest.name}">
                            <div class="res-info">
                                <div class="res-header">
                                    <h3>${rest.name}</h3>
                                    <span class="res-rating"><i class="fas fa-star"></i> ${rest.rating}</span>
                                </div>
                                <div class="res-meta">${rest.time} • ${rest.tags.join(', ')}</div>
                            </div>
                        </div>
                    </a>
                </div>
            `).join('');
        }
    }

    // --- СТРАНИЦА: РЕСТОРАН (restaurant.html) ---
    const menuContainer = document.getElementById('menu-container');
    if (menuContainer) {
        const id = parseInt(params.get('id'));
        const rest = db.restaurants.find(r => r.id === id);
        
        if (!rest) {
            menuContainer.innerHTML = '<h2>Ресторан не найден или данные загружаются...</h2><a href="index.html">На главную</a>';
        } else {
            document.getElementById('rest-title').innerText = rest.name;
            document.getElementById('rest-meta').innerText = `${rest.tags.join(', ')} • ${rest.time}`;
            const menuGrid = document.getElementById('menuGrid');
            
            menuGrid.innerHTML = rest.menu.map(item => `
                <div class="food-card" onclick="openProductModal(${item.id})">
                    <img src="${item.img}" class="food-img" alt="${item.name}">
                    <div>
                        <h4>${item.name}</h4>
                        <p style="color: gray; font-size: 0.9rem">${item.weight}г</p>
                    </div>
                    <div class="food-footer">
                        <span class="food-price">${item.price} ₽</span>
                        <button class="food-add-btn-small" onclick="event.stopPropagation(); cart.add(${item.id})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    // --- СТРАНИЦА: ПРОФИЛЬ (profile.html) ---
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        const user = JSON.parse(localStorage.getItem('vzhuh_user'));
        
        if (user) {
            document.getElementById('p-name').value = user.name;
            document.getElementById('p-phone').value = user.phone;
            document.getElementById('p-email').value = user.email || '';
        } else {
            document.querySelector('.profile-container').innerHTML = `
                <div style="text-align:center; padding: 2rem 0">
                    <p style="margin-bottom:1rem">Вы еще не зарегистрированы</p>
                    <button class="save-btn" onclick="openAuthModal()">Войти / Регистрация</button>
                </div>
            `;
        }

        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newData = {
                ...user,
                name: document.getElementById('p-name').value,
                phone: document.getElementById('p-phone').value,
                email: document.getElementById('p-email').value
            };
            localStorage.setItem('vzhuh_user', JSON.stringify(newData));
            alert('Данные профиля сохранены!');
        });
    }

    // --- СТРАНИЦА: ЗАКАЗЫ (orders.html) ---
    const ordersContainer = document.getElementById('orders-list');
    if (ordersContainer) {
        let orders = [];

        try {
            // 1. Запрашиваем заказы с сервера (БД)
            const response = await fetch('/api/orders');
            if (response.ok) {
                orders = await response.json();
            }
        } catch (e) {
            console.error('Не удалось загрузить историю заказов', e);
        }

        const sectionTitle = document.querySelector('.section-title');
        
        if (orders.length === 0) {
            ordersContainer.innerHTML = `
                <div style="text-align:center; margin-top:3rem; color:gray">
                     <i class="fas fa-history" style="font-size:3rem; margin-bottom:1rem; opacity:0.5"></i>
                     <p>Вы еще ничего не заказывали (или база пуста)</p>
                </div>
            `;
        } else {
            // Для БД кнопку "Очистить" лучше пока скрыть или переделать под API
            // (удаление из БД сложнее, чем из localStorage)
            if(sectionTitle) {
                sectionTitle.innerText = "История заказов (из облака)";
            }

            ordersContainer.innerHTML = orders.map(order => {
                // Форматируем дату, если она пришла с сервера
                const dateObj = new Date(order.date);
                const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString().slice(0,5);
                
                // Статус
                const statusClass = order.status === 'process' ? 'process' : 'done';
                const statusText = order.status === 'process' ? 'Готовится <i class="fas fa-spinner fa-spin"></i>' : 'Выполнен <i class="fas fa-check"></i>';
                
                // MongoDB создает длинные _id, для красоты можно их обрезать или не показывать
                const displayId = order.id || order._id.slice(-6); 

                return `
                <div class="order-card">
                    <div class="order-header">
                        <div>
                            <h3>Заказ #${displayId}</h3>
                            <small style="color:gray">${order.payment || 'Оплата при получении'}</small>
                        </div>
                        <div class="order-actions">
                            <span class="order-status ${statusClass}">${statusText}</span>
                        </div>
                    </div>
                    <p>${order.itemsText}</p>
                    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:10px">
                        <h4>Итого: ${order.total} ₽</h4>
                        <small style="color:gray">${dateStr}</small>
                    </div>
                </div>
            `}).join('');
        }
    }

    // --- СТРАНИЦА: НАСТРОЙКИ (settings.html) ---
    const settingsForm = document.getElementById('settings-form');
    if(settingsForm) {
        const mapSelect = document.getElementById('map-select');
        const savedProvider = localStorage.getItem('vzhuh_map_provider') || 'yandex';
        if(mapSelect) mapSelect.value = savedProvider;

        const themeSelect = document.getElementById('theme-select');
        const currentTheme = localStorage.getItem('vzhuh_theme') || 'light';
        if(themeSelect) themeSelect.value = currentTheme;

        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if(mapSelect) localStorage.setItem('vzhuh_map_provider', mapSelect.value);
            if(themeSelect) {
                const newTheme = themeSelect.value;
                document.body.setAttribute('data-theme', newTheme);
                localStorage.setItem('vzhuh_theme', newTheme);
            }
            alert('Настройки сохранены!');
        });
    }

    // --- СТРАНИЦА: КАРТЫ (maps.html) ---
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        const provider = localStorage.getItem('vzhuh_map_provider') || 'yandex';
        document.querySelectorAll('.map-frame').forEach(el => el.classList.remove('active'));
        const activeMap = document.getElementById(`map-${provider}`);
        if(activeMap) activeMap.classList.add('active');
        else document.getElementById('map-yandex').classList.add('active');
    }
});

