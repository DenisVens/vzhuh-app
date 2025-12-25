// Данные
const db = {
    restaurants: [
        {
            id: 1,
            name: "Burger King",
            image: "https://avatars.mds.yandex.net/i?id=714eeae36f416f7a9e5e98b94cd80015_sr-5855238-images-thumbs&n=13",
            rating: "4.8",
            time: "25-35 мин",
            tags: ["Бургеры", "Напитки"],
            menu: [
                { id: 101, cat: "Бургеры", name: "Воппер", price: 299, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400" },
                { id: 102, cat: "Бургеры", name: "Чизбургер", price: 99, img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400" },
                { id: 104, cat: "Напитки", name: "Кола 0.5", price: 120, img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400" },
            ]
        },
        {
            id: 2,
            name: "Sushi Master",
            image: "https://s.rbk.ru/v1_companies_s3/media/trademarks/b82c6fa2-932b-4895-9db7-2f601371f585.jpg",
            rating: "4.9",
            time: "40-50 мин",
            tags: ["Суши", "Роллы"],
            menu: [
                { id: 201, cat: "Роллы", name: "Филадельфия", price: 450, img: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400" },
                { id: 202, cat: "Роллы", name: "Калифорния", price: 390, img: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400" },
            ]
        },
        {
            id: 3,
            name: "Dodo Pizza",
            image: "https://doska.ykt2.ru/files/2025-04-02/boi50NtrcS.jpeg",
            rating: "4.7",
            time: "30-40 мин",
            tags: ["Пицца"],
            menu: [
                { id: 301, cat: "Пицца", name: "Пепперони", price: 549, img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400" },
                { id: 302, cat: "Пицца", name: "Маргарита", price: 699, img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400" },
                { id: 303, cat: "Пицца", name: "Додо", price: 1079, img: ""},
                { id: 304, cat: "Пицца", name: "Чоризо фреш", price: 559, img: ""},
            ]
        },
        {
            id: 4,
            name: "Вкусно и точка",
            image: "https://visittula.com/upload/iblock/dec/q3u1o6vbgyr7ahbn39as5e19epj0rjaq.webp",
            rating: "4.9",
            time: "35-50 мин",
            tags: ["Бургеры", "Напитки"],
            menu: [
                { id: 401, cat: "Бургеры", name: "Минский бургер с курицей", price: 299, img: "https://vkusnoitochka.ru/resize/194x194/upload/iblock/902/1m25bs31904qk6g1n2fnfojnn9wmk65l/large.png" },
                { id: 402, cat: "Бургеры", name: "Чизбургер", price: 97, img: "https://vkusnoitochka.ru/resize/194x194/upload/iblock/7a1/5ne31kd248o11nayzm077y2tbmdmev38/large.png" },
                { id: 403, cat: "Бургеры", name: "Двойной чизбургер", price: 183, img: "https://vkusnoitochka.ru/resize/194x194/upload/iblock/3a4/bpozc95smrogp3ve6sbsojnmno84j66f/large.png" },
                { id: 404, cat: "Бургеры", name: "Чикенбургер", price: 79, img: "https://vkusnoitochka.ru/resize/194x194/upload/iblock/931/6uqws268vvo2ju6bu6b0seud570ow28a/large.png" },
                { id: 405, cat: "Бургеры", name: "Гамбургер", price: 89, img: "https://vkusnoitochka.ru/resize/194x194/upload/iblock/d2e/fcgru6zo5gcory7qcj4zttzvbrqfnu4w/large.png" },
                { id: 406, cat: "Бургеры", name: "Биг Хит", price: 211, img: "https://vkusnoitochka.ru/resize/194x194/upload/iblock/475/ri6yakro2gi150a3abujhegz6x12a6ql/large.png" },
                { id: 407, cat: "Бургеры", name: "Двойной Биг Хит", price: 308, img: "https://vkusnoitochka.ru/resize/194x194/upload/iblock/0de/ms211qtk0dt2kqvwa8qzj9mub7mbotmt/large.png" },
            ]
        },
        {
            id: 5,
            name: "Нино играет в домино",
            image: "",
            rating: "5,0",
            time: "30-50 мин",
            tags: ["Хачапури", "Хинкали", "Гриль", "Горячее"],
            menu: [
                { id: 501, cat: "Хачапури", name: "Хачапури по-аджарски", price: 520, img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/khachapuri-po-adzharski-6540020a2cc62220630722-234.webp" },
                { id: 502, cat: "Хачапури", name: "Хачапури по-имеритински", price: 600, img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/khachapuri-po-imeretinski-6540027cedd85150465184-1056.webp" },
                { id: 503, cat: "Хачапури", name: "Хачапури с вялеными томатами", price: 680, img: "" },
                { id: 504, cat: "Хачапури", name: "Хачапури с дорблю, грушей и орехами", price: 690, img: "" },
                { id: 505, cat: "Хачапури", name: "Хачапури с зеленью и сыром", price: 520, img: "" },
                { id: 506, cat: "Хачапури", name: "Пеновани пури из слоеного теста", price: 710, img: "" },
                { id: 507, cat: "Хачапури", name: "Хачапури Генацвале с говядиной, свининой, зеленью и сыром", price: 610, img: "" },
                { id: 508, cat: "Хинкали", name: "Хинкали с говядиной и бараниной", price: 490, img: "" },
                { id: 509, cat: "Хинкали", name: "Хинкали с цыпленком", price: 330, img: "" },
                { id: 510, cat: "Хинкали", name: "Хинкали с говядиной и свининой", price: 360, img: "" },
                { id: 511, cat: "Хинкали", name: "Хинкали с грибами", price: 360, img: "" },
                { id: 512, cat: "Хинкали", name: "Хинкали с сыром", price: 490, img: "" },
                { id: 513, cat: "Гриль", name: "Мцвади из свинины", price: 610, img: "" },
                { id: 514, cat: "Гриль", name: "Мцвади из цыпленка", price: 580, img: "" },
                { id: 515, cat: "Гриль", name: "Мцвади из говядины", price: 960, img: "" },
                { id: 516, cat: "Гриль", name: "Мцвади из баранины", price: 1110, img: "" },
                { id: 517, cat: "Гриль", name: "Шашлык из лосося", price: 1800, img: "" },
                { id: 518, cat: "Гриль", name: "Шашлык из креветок", price: 1010, img: "" },
                { id: 519, cat: "Гриль", name: "Гриль-сет для 4-5 джигитов", price: 2650, img: "" },
                { id: 520, cat: "Гриль", name: "Кебаби из баранины и говядины", price: 1050, img: "" },
                { id: 521, cat: "Горячее", name: "Стейк из свиной шеи с картофелем", price: 690, img: "" },
                { id: 522, cat: "Горячее", name: "Долма из баранины и говядины", price: 710, img: "" },
            ],
        },
        {
            id: 6,
            name: "Ронни",
            image: "https://avatars.mds.yandex.net/i?id=142d3014fee9fb67890d9f37998cbfab7bea2cf7-10332876-images-thumbs&n=13",
            rating: "5,0",
            time: "30-50 мин",
            tags: ["Бургеры", "Горячее", "Десерты"],
            menu: [
                { id: 601, cat: "Бургеры", name: "Большой куш", price: 535, img: "" },
                { id: 602, cat: "Бургеры", name: "Гаудзилла", price: 510, img: "" },
                { id: 603, cat: "Бургеры", name: "Кинг слоу", price: 500, img: "" },
                { id: 604, cat: "Бургеры", name: "Ориджинал", price: 380, img: "" },
                { id: 605, cat: "Бургеры", name: "Зеленый Орк", price: 520, img: "" },
                { id: 606, cat: "Бургеры", name: "Звездный лорд", price: 530, img: "" },
                { id: 607, cat: "Горячее", name: "Филе курицы на гриле", price: 580, img: "" },
                { id: 608, cat: "Горячее", name: "Свинина по-брутальски", price: 580, img: "" },
                { id: 609, cat: "Горячее", name: "Боул чикен батат", price: 570, img: "" },
                { id: 610, cat: "Горячее", name: "Боул с курицей", price: 520, img: "" },
                { id: 611, cat: "Десерты", name: "Полосатый сметанник", price: 390, img: "" },
                { id: 612, cat: "Десерты", name: "Чизкейк с карамелью", price: 390, img: "" },
            ],
        },
    ]
};

// Состояние
const state = {
    cart: [],
    favorites: [], // ID любимых ресторанов
    orders: [], // История заказов
    user: {
        name: "Алексей",
        phone: "+7 999 123 45 67",
        email: "alex@example.com"
    },
    currentView: 'home'
};

// Приложение 
const app = {
    init() {
        this.router('home');
        cart.render();
    },

    router(page) {
        state.currentView = page;
        const view = document.getElementById('app-view');
        
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const activeLink = document.getElementById(`link-${page}`);
        if(activeLink) activeLink.classList.add('active');

        if (page === 'home') this.renderRestaurants(db.restaurants);
        else if (page === 'favorites') this.renderFavorites();
        else if (page === 'orders') this.renderOrders();
        else if (page === 'profile') this.renderProfile();
    },

    filterGlobal(category) {
        if (category === 'all') {
            this.renderRestaurants(db.restaurants);
            return;
        }
        const filtered = db.restaurants.filter(r => r.tags.includes(category));
        this.renderRestaurants(filtered, `Категория: ${category}`);
    },

    renderRestaurants(list, title = "Рестораны") {
        const view = document.getElementById('app-view');
        
        if (list.length === 0) {
            view.innerHTML = `<h2 class="section-title">${title}</h2><p>Ничего не найдено :(</p>`;
            return;
        }

        let html = `
            <h2 class="section-title">${title}</h2>
            <div class="restaurants-grid">
        `;

        list.forEach(rest => {
            const isFav = state.favorites.includes(rest.id) ? 'active' : '';
            html += `
                <div class="restaurant-card" onclick="app.openRestaurant(${rest.id})">
                    <button class="like-btn ${isFav}" onclick="event.stopPropagation(); app.toggleFavorite(${rest.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                    <img src="${rest.image}" class="res-img" alt="${rest.name}">
                    <div class="res-info">
                        <div class="res-header">
                            <h3>${rest.name}</h3>
                            <span class="res-rating"><i class="fas fa-star"></i> ${rest.rating}</span>
                        </div>
                        <div class="res-meta">
                            <i class="fas fa-bicycle"></i> ${rest.time} • ${rest.tags.join(', ')}
                        </div>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
        view.innerHTML = html;
    },

    // Добавить/Удалить из любимого
    toggleFavorite(id) {
        if (state.favorites.includes(id)) {
            state.favorites = state.favorites.filter(favId => favId !== id);
        } else {
            state.favorites.push(id);
        }
        
        if (state.currentView === 'favorites') {
            this.renderFavorites();
        } else if (state.currentView === 'home') {
            this.router('home'); // Упрощенно перезагружаем view
        }
    },

    renderFavorites() {
        const view = document.getElementById('app-view');
        const favList = db.restaurants.filter(r => state.favorites.includes(r.id));
        
        if (favList.length === 0) {
            view.innerHTML = `
                <h2 class="section-title">Любимое</h2>
                <div style="text-align:center; margin-top: 3rem; color: gray;">
                    <i class="far fa-heart" style="font-size: 4rem; margin-bottom: 1rem; color: #ddd"></i>
                    <p>Вы пока ничего не добавили в любимое</p>
                </div>`;
            return;
        }
        this.renderRestaurants(favList, "Ваши любимые рестораны");
    },

    openRestaurant(id) {
        const rest = db.restaurants.find(r => r.id === id);
        if (!rest) return;

        const view = document.getElementById('app-view');
        
        // Категории внутри ресторана
        const categoriesHtml = [...new Set(rest.menu.map(i => i.cat))].map((cat, index) => 
            `<button class="cat-btn ${index === 0 ? 'active' : ''}" onclick="app.filterLocalMenu('${cat}', this, ${rest.id})">${cat}</button>`
        ).join('');

        const menuHtml = rest.menu.map(item => this.createFoodCard(item)).join('');

        view.innerHTML = `
            <div style="margin-bottom: 2rem;">
                <button onclick="app.router('home')" style="border:none; background:none; cursor:pointer; color: var(--primary); font-weight:600">
                    <i class="fas fa-arrow-left"></i> Назад
                </button>
                <h1 style="font-size: 2.5rem; margin-top: 1rem">${rest.name}</h1>
                <p style="color: gray">${rest.tags.join(', ')} • ${rest.time}</p>
            </div>
            
            <div class="categories-bar">
                <button class="cat-btn" onclick="app.filterLocalMenu('all', this, ${rest.id})">Все</button>
                ${categoriesHtml}
            </div>

            <div class="menu-grid" id="menuGrid">
                ${menuHtml}
            </div>
        `;
    },

    createFoodCard(item) {
        return `
            <div class="food-card">
                <img src="${item.img}" class="food-img" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <p style="color: gray; font-size: 0.9rem">250г</p>
                </div>
                <button class="food-price-btn" onclick="cart.add(${item.id})">
                    ${item.price} ₽ 
                    <i class="fas fa-plus" style="float: right"></i>
                </button>
            </div>
        `;
    },

    filterLocalMenu(category, btn, restId) {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const rest = db.restaurants.find(r => r.id === restId);
        const grid = document.getElementById('menuGrid');
        
        const items = (category === 'all') 
            ? rest.menu 
            : rest.menu.filter(i => i.cat === category);
            
        grid.innerHTML = items.map(item => this.createFoodCard(item)).join('');
    },

    // страница профиля
    renderProfile() {
        const view = document.getElementById('app-view');
        view.innerHTML = `
            <h2 class="section-title">Профиль</h2>
            <div class="profile-container">
                <form onsubmit="event.preventDefault(); alert('Данные сохранены!');">
                    <div class="form-group">
                        <label>Имя</label>
                        <input type="text" class="form-input" value="${state.user.name}">
                    </div>
                    <div class="form-group">
                        <label>Телефон</label>
                        <input type="tel" class="form-input" value="${state.user.phone}">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" class="form-input" value="${state.user.email}">
                    </div>
                    <button type="submit" class="save-btn">Сохранить изменения</button>
                </form>
            </div>
        `;
    },

    // страница заказов
    renderOrders() {
        const view = document.getElementById('app-view');
        if (state.orders.length === 0) {
            view.innerHTML = `
                <h2 class="section-title">История заказов</h2>
                <div style="text-align:center; margin-top: 3rem; color: gray;">
                    <i class="fas fa-history" style="font-size: 4rem; margin-bottom: 1rem; color: #ddd"></i>
                    <p>У вас пока нет заказов</p>
                </div>`;
            return;
        }

        let html = `<h2 class="section-title">История заказов</h2>`;
        state.orders.reverse().forEach(order => {
            html += `
                <div class="order-card">
                    <div class="order-header">
                        <div>
                            <h3 style="margin-bottom:5px">Заказ #${order.id}</h3>
                            <div style="color:gray; font-size:0.9rem">${order.date}</div>
                        </div>
                        <div class="order-status">Выполнен</div>
                    </div>
                    <div>
                        <p>${order.itemsText}</p>
                        <h4 style="margin-top: 10px">Итого: ${order.total} ₽</h4>
                    </div>
                </div>
            `;
        });
        view.innerHTML = html;
        state.orders.reverse();
    },

    // Оформление заказа
    checkout() {
        if (state.cart.length === 0) return;
        
        const total = state.cart.reduce((sum, item) => sum + (item.price * item.count), 0);
        const itemsText = state.cart.map(i => `${i.name} x${i.count}`).join(', ');
        
        const newOrder = {
            id: Math.floor(Math.random() * 10000),
            date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
            total: total,
            itemsText: itemsText
        };

        state.orders.push(newOrder);
        cart.clear();
        cart.toggle(); // закрыть корзину
        alert(`Заказ #${newOrder.id} успешно оформлен!`);
        this.router('orders');
    }
};

// Корзина 
const cart = {
    toggle() {
        const modal = document.getElementById('cartModal');
        const backdrop = document.getElementById('cartBackdrop');
        modal.classList.toggle('open');
        backdrop.classList.toggle('open');
    },

    add(itemId) {
        let item;
        db.restaurants.forEach(r => {
            const found = r.menu.find(i => i.id === itemId);
            if (found) item = found;
        });

        const existing = state.cart.find(i => i.id === itemId);
        if (existing) {
            existing.count++;
        } else {
            state.cart.push({ ...item, count: 1 });
        }
        this.render();
    },

    remove(itemId) {
        const index = state.cart.findIndex(i => i.id === itemId);
        if (index !== -1) {
            if (state.cart[index].count > 1) {
                state.cart[index].count--;
            } else {
                state.cart.splice(index, 1);
            }
        }
        this.render();
    },

    clear() {
        state.cart = [];
        this.render();
    },

    render() {
        const container = document.getElementById('cart-items');
        const totalEl = document.getElementById('cart-total-price');
        const headerPrice = document.getElementById('header-price');
        
        let total = 0;
        
        if (state.cart.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding: 2rem 0; color: gray;">
                    <i class="fas fa-shopping-basket" style="font-size: 3rem; margin-bottom: 1rem; color: #ddd"></i>
                    <p>Корзина пуста</p>
                </div>
            `;
            totalEl.innerText = "0 ₽";
            headerPrice.innerText = "0 ₽";
            return;
        }

        container.innerHTML = state.cart.map(item => {
            total += item.price * item.count;
            return `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div style="flex:1">
                        <div style="font-weight:600; font-size: 0.9rem">${item.name}</div>
                        <div style="color:gray; font-size: 0.8rem">${item.price} ₽</div>
                    </div>
                    <div class="cart-controls">
                        <i class="fas fa-minus" style="cursor:pointer; font-size: 0.8rem" onclick="cart.remove(${item.id})"></i>
                        <span style="font-weight:600; font-size: 0.9rem">${item.count}</span>
                        <i class="fas fa-plus" style="cursor:pointer; font-size: 0.8rem" onclick="cart.add(${item.id})"></i>
                    </div>
                </div>
            `;
        }).join('');

        totalEl.innerText = total + " ₽";
        headerPrice.innerText = total + " ₽";
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    await fetchRestaurants(); // Ждем данные с сервера!
    app.init();
});