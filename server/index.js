// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.static('public')); // Позволяет читать JSON в запросах
app.use(cors()); // Разрешает запросы с фронтенда

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
    res.send('База заполнена (раскомментируй код)');
});

// --- 3. ЗАПУСК ---

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI; // Ссылка из MongoDB Atlas

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ DB Error:', err));

app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});