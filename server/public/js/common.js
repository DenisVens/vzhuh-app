// --- ФОРМАТИРОВАНИЕ ЦЕНЫ ---
const priceFormat = (value) => {
    let result = '';
    const str = value.toString();
    let count = 0;
    for (let i = str.length - 1; i >= 0; i--) {
        if (count % 3 === 0 && count !== 0) result = ' ' + result;
        result = str[i] + result;
        count++;
    }
    return result;
};

// --- СИСТЕМА АВТОРИЗАЦИИ (Mock) ---
const auth = {
    getUser() {
        return JSON.parse(localStorage.getItem('vzhuh_user'));
    },
    login(name, phone) {
        const user = { name, phone, email: '', id: Date.now() };
        localStorage.setItem('vzhuh_user', JSON.stringify(user));
        return user;
    },
    logout() {
        localStorage.removeItem('vzhuh_user');
        window.location.reload();
    },
    isAuthorized() {
        return !!localStorage.getItem('vzhuh_user');
    }
};

// --- СИСТЕМА ТЕМ ---
const theme = {
    init() {
        const saved = localStorage.getItem('vzhuh_theme') || 'light';
        document.body.setAttribute('data-theme', saved);
    },
    toggle() {
        const current = document.body.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', next);
        localStorage.setItem('vzhuh_theme', next);
    }
};

// --- КОРЗИНА И ЗАКАЗ ---
const cart = {
    items: JSON.parse(localStorage.getItem('vzhuh_cart')) || [],

    toggle() {
        const modal = document.getElementById('cartModal');
        const backdrop = document.getElementById('cartBackdrop');
        if(modal && backdrop) {
            modal.classList.toggle('open');
            backdrop.classList.toggle('open');
        }
    },

    save() {
        localStorage.setItem('vzhuh_cart', JSON.stringify(this.items));
        this.render();
    },

    add(itemId) {
        let product;
        if(typeof db !== 'undefined') {
            db.restaurants.forEach(r => {
                const found = r.menu.find(i => i.id === itemId);
                if(found) product = found;
            });
        }
        if (!product) return;

        const existing = this.items.find(i => i.id === itemId);
        if (existing) {
            existing.count++;
        } else {
            this.items.push({ ...product, count: 1 });
        }
        this.save();
        
        // Визуальный эффект для кнопки корзины
        const btn = document.querySelector('.header-cart-btn');
        btn.style.transform = 'scale(1.1)';
        setTimeout(() => btn.style.transform = 'scale(1)', 200);
    },

    remove(itemId) {
        const index = this.items.findIndex(i => i.id === itemId);
        if (index !== -1) {
            if (this.items[index].count > 1) {
                this.items[index].count--;
            } else {
                this.items.splice(index, 1);
            }
            this.save();
        }
    },

    clear() {
        this.items = [];
        this.save();
    },

    render() {
        const container = document.getElementById('cart-items');
        const totalEl = document.getElementById('cart-total-price');
        const headerPrice = document.getElementById('header-price');
        
        if(!container || !totalEl || !headerPrice) return;

        let total = 0;
        
        if (this.items.length === 0) {
            container.innerHTML = `<p style="text-align:center; padding:2rem; color:gray">Корзина пуста</p>`;
            totalEl.innerText = "0 ₽";
            headerPrice.innerText = "0 ₽";
            return;
        }

        container.innerHTML = this.items.map(item => {
            total += item.price * item.count;
            return `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div style="flex:1">
                        <div style="font-weight:600; font-size:0.9rem">${item.name}</div>
                        <div style="color:gray; font-size:0.8rem">${priceFormat(item.price)} ₽</div>
                    </div>
                    <div class="cart-controls">
                        <i class="fas fa-minus" style="cursor:pointer" onclick="cart.remove(${item.id})"></i>
                        <span style="font-weight:600">${item.count}</span>
                        <i class="fas fa-plus" style="cursor:pointer" onclick="cart.add(${item.id})"></i>
                    </div>
                </div>
            `;
        }).join('');

        totalEl.innerText = priceFormat(total) + ' ₽';
        headerPrice.innerText = priceFormat(total) + ' ₽';
    },

    // Основная логика кнопки "Оформить"
    checkout() {
        if(this.items.length === 0) return;

        // 1. Проверяем авторизацию
        if (!auth.isAuthorized()) {
            this.toggle(); // Закрыть корзину
            openAuthModal(); // Открыть регистрацию
            return;
        }

        // 2. Если авторизован, открываем выбор оплаты
        this.toggle();
        openPaymentModal();
    },

    // Финальное оформление после выбора оплаты
    async finalizeOrder(paymentMethod) {
    // Собираем данные
    const user = JSON.parse(localStorage.getItem('vzhuh_user')); // Берем телефон юзера
    const orderData = {
        customerName: user ? user.name : 'Гость',
        phone: user ? user.phone : 'Не указан',
        itemsText: this.items.map(i => `${i.name} x${i.count}`).join(', '),
        total: this.items.reduce((sum, i) => sum + (i.price * i.count), 0),
        payment: paymentMethod
    };

    try {
        // ОТПРАВКА НА СЕРВЕР
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            this.clear();
            closePaymentModal();
            alert(`Заказ успешно отправлен на кухню!`);
            // Можно перенаправить на страницу успеха
            // window.location.href = 'orders.html';
        }
    } catch (e) {
        alert('Ошибка при отправке заказа');
    }
}
};

// --- МОДАЛЬНЫЕ ОКНА (HTML Injection) ---
function injectModals() {
    const body = document.body;
    
    // 1. Auth Modal
    const authHtml = `
    <div class="modal-backdrop" id="authModal">
        <div class="modal-content auth-content">
            <button class="pm-close" onclick="closeAuthModal()">&times;</button>
            <h2 style="margin-bottom:1rem; color:var(--text-dark)">Регистрация</h2>
            <p style="margin-bottom:1.5rem; color:gray">Чтобы оформить заказ, представьтесь, пожалуйста</p>
            <form onsubmit="handleRegister(event)">
                <div class="form-group">
                    <input type="text" id="reg-name" class="form-input" placeholder="Ваше имя" required>
                </div>
                <div class="form-group">
                    <input type="tel" id="reg-phone" class="form-input" placeholder="Номер телефона" required>
                </div>
                <button type="submit" class="save-btn">Продолжить</button>
            </form>
        </div>
    </div>`;

    // 2. Payment Modal
    const payHtml = `
    <div class="modal-backdrop" id="paymentModal">
        <div class="modal-content payment-content">
            <button class="pm-close" onclick="closePaymentModal()">&times;</button>
            <h2 style="margin-bottom:1rem; color:var(--text-dark)">Способ оплаты</h2>
            <p style="margin-bottom:1.5rem; color:gray">Выберите, чем будете платить</p>
            <div class="payment-methods">
                <button class="pay-btn" onclick="cart.finalizeOrder('Apple Pay')">
                    <i class="fab fa-apple" style="font-size:1.5rem"></i> Apple Pay
                </button>
                <button class="pay-btn" onclick="cart.finalizeOrder('Банковская карта')">
                    <i class="fas fa-credit-card" style="font-size:1.2rem"></i> Банковская карта
                </button>
                <button class="pay-btn" onclick="cart.finalizeOrder('Google Play')">
                    <i class="fab fa-google-play" style="font-size:1.2rem"></i> Google Play
                </button>
            </div>
        </div>
    </div>`;

    body.insertAdjacentHTML('beforeend', authHtml);
    body.insertAdjacentHTML('beforeend', payHtml);
}

// --- Управление модалками ---
window.openAuthModal = () => document.getElementById('authModal').classList.add('open');
window.closeAuthModal = () => document.getElementById('authModal').classList.remove('open');

window.handleRegister = (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const phone = document.getElementById('reg-phone').value;
    
    if(name && phone) {
        auth.login(name, phone);
        closeAuthModal();
        openPaymentModal(); // Переход к оплате
    }
};

window.openPaymentModal = () => document.getElementById('paymentModal').classList.add('open');
window.closePaymentModal = () => document.getElementById('paymentModal').classList.remove('open');


// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    theme.init();
    injectModals();
    cart.render();
});