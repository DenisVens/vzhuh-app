// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json()); // Позволяет читать JSON в запросах
app.use(cors()); // Разрешает запросы с фронтенда

app.use(express.static(path.join(__dirname, 'public')));

// --- 1. СХЕМЫ БАЗЫ ДАННЫХ ---

// Схема блюда (вложенная)
const ItemSchema = new mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
    img: String,
    cat: String,
    weight: String,
    calories: String,
    desc: String
});

// Схема ресторана
const RestaurantSchema = new mongoose.Schema({
    id: Number,
    name: String,
    image: String,
    rating: String,
    time: String,
    tags: [String],
    menu: [ItemSchema] // Меню внутри ресторана
});

// Схема заказа
const OrderSchema = new mongoose.Schema({
    customerName: String,
    phone: String,
    itemsText: String,
    total: Number,
    payment: String,
    date: { type: Date, default: Date.now },
    status: { type: String, default: 'process' }
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
const Order = mongoose.model('Order', OrderSchema);

// --- 2. API МАРШРУТЫ (End-points) ---

// Получить все рестораны
app.get('/api/restaurants', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения данных' });
    }
});

// Получить один ресторан по ID
app.get('/api/restaurants/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ id: req.params.id });
        res.json(restaurant);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка' });
    }
});

// Создать новый заказ
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.json(savedOrder);
    } catch (err) {
        res.status(500).json({ error: 'Не удалось создать заказ' });
    }
});

// Получить историю заказов (можно добавить фильтр по телефону)
app.get('/api/orders', async (req, res) => {
    try {
        // В реальности тут нужен поиск по User ID или телефону
        const orders = await Order.find().sort({ date: -1 }); 
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка' });
    }
});

// Скрипт для заполнения базы (запусти один раз, если база пустая)
app.post('/api/seed', async (req, res) => {
    // Сюда можно скопировать массив из твоего data.js
    // await Restaurant.insertMany([...твой массив данных...]);
    try {
        // 1. Сначала очищаем базу от старых дублей, если они есть
        await Restaurant.deleteMany({});

        // 2. Подготовленные данные
        const data = [
            {
                id: 1,
                name: "Burger King",
                image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600",
                rating: "4.8",
                time: "25-35 мин",
                tags: ["Бургеры", "Фастфуд"],
                menu: [
                    { 
                        id: 101, 
                        cat: "Бургеры", 
                        name: "Воппер", 
                        price: 299, 
                        weight: "250", 
                        calories: "560", 
                        desc: "Легендарный бургер с говядиной, томатами и салатом.",
                        img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400" 
                    },
                    { 
                        id: 102, 
                        cat: "Бургеры", 
                        name: "Чизбургер", 
                        price: 99, 
                        weight: "150", 
                        calories: "300", 
                        desc: "Классический чизбургер с сыром чеддер.",
                        img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400" 
                    },
                    { 
                        id: 103, 
                        cat: "Закуски", 
                        name: "Картофель Фри", 
                        price: 89, 
                        weight: "100", 
                        calories: "250", 
                        desc: "Хрустящий золотистый картофель.",
                        img: "https://images.unsplash.com/photo-1573080496987-a199f8cd75c5?w=400" 
                    }
                ]
            },
            {
                id: 2,
                name: "Якитория",
                image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600",
                rating: "4.5",
                time: "40-50 мин",
                tags: ["Суши", "Роллы"],
                menu: [
                    { 
                        id: 201, 
                        cat: "Роллы", 
                        name: "Филадельфия", 
                        price: 450, 
                        weight: "220", 
                        calories: "320", 
                        desc: "Лосось, сливочный сыр, огурец.",
                        img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400" 
                    },
                    { 
                        id: 202, 
                        cat: "Суши", 
                        name: "Суши с лососем", 
                        price: 120, 
                        weight: "40", 
                        calories: "60", 
                        desc: "Классическая суши нигири.",
                        img: "https://images.unsplash.com/photo-1607301406259-dfb186e15de8?w=400" 
                    }
                ]
            },
            {
                id: 3,
                name: "Додо Пицца",
                image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600",
                rating: "4.9",
                time: "30-40 мин",
                tags: ["Пицца", "Горячее"],
                menu: [
                    { 
                        id: 301, 
                        cat: "Пицца", 
                        name: "Пепперони", 
                        price: 599, 
                        weight: "500", 
                        calories: "1200", 
                        desc: "Пикантная пепперони, моцарелла и томатный соус.",
                        img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400" 
                    },
                    { 
                        id: 302, 
                        cat: "Пицца", 
                        name: "Маргарита", 
                        price: 450, 
                        weight: "450", 
                        calories: "1000", 
                        desc: "Томаты, моцарелла, орегано.",
                        img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400" 
                    }
                ]
            }
        ];

        // 3. Записываем в базу
        await Restaurant.insertMany(data);
        
        console.log('Database seeded successfully!');
        res.json({ message: 'База данных успешно заполнена!', count: data.length });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка заполнения базы', details: err.message });
    }
});

app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- ЗАПУСК ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ DB Error:', err));

app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});


