require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

// --- 1. СХЕМЫ БАЗЫ ДАННЫХ ---

const ItemSchema = new mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
    img: String,
    cat: String,
    weight: Number,
    calories: Number,
    protein: Number,
    fats: Number,
    carbs: Number,
    desc: String
});

const RestaurantSchema = new mongoose.Schema({
    id: Number,
    name: String,
    image: String,
    rating: String,
    time: String,
    tags: [String],
    menu: [ItemSchema]
});

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

// --- 2. ДАННЫЕ ДЛЯ АВТО-ЗАПОЛНЕНИЯ ---
const restaurantsData = [
    {
        id: 1,
        name: "Burger King",
        image: "https://avatars.mds.yandex.net/i?id=714eeae36f416f7a9e5e98b94cd80015_sr-5855238-images-thumbs&n=13",
        rating: "4.8",
        time: "25-35 мин",
        tags: ["Бургеры", "Напитки"],
        menu: [
            { 
                id: 101, cat: "Бургеры", name: "Воппер", price: 309, weight: 274, 
                img: "https://orderapp-app-static.burgerkingrus.ru/x512/catalog/images/dishes/89879d2602a8e9eefb4234bceca7393c.png",
                desc: "Легендарный бургер с приготовленной на огне 100% говядиной, сочными помидорами, свежим нарезанным салатом, густым майонезом, хрустящими маринованными огурчиками и рубленым белым луком на мягкой булочке с кунжутом.",
                calories: 263, protein: 10, fats: 16, carbs: 19
            },
            { 
                id: 102, cat: "Бургеры", name: "Чизбургер", price: 109, weight: 114, 
                img: "https://orderapp-app-static.burgerkingrus.ru/x512/catalog/images/dishes/5e66239c34d074a8edb4f79cbfa6caac.png",
                desc: "Классический чизбургер с говяжьей котлетой, ломтиком сыра Чеддер, горчицей, кетчупом и маринованным огурчиком.",
                calories: 298, protein: 12, fats: 15, carbs: 28
            },
            { 
                id: 104, cat: "Напитки", name: "Эвервесс Кола 0.5", price: 159, weight: 500, 
                img: "https://orderapp-app-static.burgerkingrus.ru/x512/catalog/images/dishes/aeec9d2664d925706fa5c0d3fbac775b.png",
                desc: "Освежающий газированный напиток.",
                calories: 44, protein: 0, fats: 0, carbs: 11
            },
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
            { 
                id: 201, cat: "Роллы", name: "Филадельфия", price: 539, weight: 240, 
                img: "https://venus-img-sm-ru.snet.su/sm-ru/products/0001-filadelfiya-syake.jpg?&w=991&h=700&format=auto&mode=fit&q=80",
                desc: "Классический ролл со сливочным сыром, свежим огурцом и нежным лососем. Самый популярный выбор наших гостей. (8 шт)",
                calories: 213, protein: 6, fats: 8, carbs: 28
            },
            { 
                id: 202, cat: "Роллы", name: "Калифорния", price: 259, weight: 210, 
                img: "https://venus-img-sm-ru.snet.su/sm-ru/products/0001-kaliforniya-kappa-maki-s-ikroy.jpg?&w=991&h=700&format=auto&mode=fit&q=80",
                desc: "Ролл с мясом снежного краба, авокадо и огурцом в икре тобико. (8 шт)",
                calories: 195, protein: 6, fats: 3, carbs: 34
            },
            {
                id: 203, cat: "Роллы", name: "Сет Ёлка угощений", price: 2299, weight: 1870,
                img: "https://venus-img-sm-ru.snet.su/sm-ru/products/0001-set-yolka-ugoshchenij.jpg?&w=991&h=700&format=auto&mode=fit&q=80",
                desc: "Состав: Ролл Филадельфия лайт сяке (8 шт), Ролл Лава с лососем (8 шт), Ролл Калифорния классика (8 шт), Ролл Чикен дон (8 шт), Ролл Лосось фри темпура (8 шт), Цезарь ролл запеченный (8 шт), Ролл Чикен фри хот запеченный (8 шт), Ролл Флешбек запеченный (8 шт).",
                calories: 223, protein: 5, fats: 8, carbs: 31
            },
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
            { 
                id: 301, cat: "Пицца", name: "Пепперони", price: 549, weight: 600, 
                img: "https://media.dodostatic.net/image/r:584x584/0198bf39dda97082912be8d1f3f2b233.avif",
                desc: "Пикантная пепперони, увеличенная порция моцареллы и фирменный томатный соус.",
                calories: 1200, protein: 50, fats: 60, carbs: 110
            },
            {
                id: 302, cat: "Пицца", name: "Маргарита", price: 699, weight: 590,
                img: "https://media.dodostatic.net/image/r:584x584/0198bf3d788b78d491891a6da5e94bf1.avif",
                desc: "Увеличенная порция моцареллы, томаты, итальянские травы, фирменный томатный соус",
                calories: 235.4, protein: 9.8, fats: 7.6, carbs: 30.5
            },
            {
                id: 303, cat: "Пицца", name: "Додо", price: 1079, weight: 640,
                img: "https://media.dodostatic.net/image/r:584x584/019ac604bad37209b1ec496bbdd98560.avif",
                desc: "Секрет обновленной пиццы - в новом соусе. Он усиливает вкус и делает сочетание бекона, говядины и пепперони еще мяснее!",
                calories: 283.1, protein: 10.3, fats: 14.4, carbs: 28.1
            },
            {
                id: 304, cat: "Пицца", name: "Чоризо фреш", price: 559, weight: 470,
                img: "https://media.dodostatic.net/image/r:584x584/0198bf4f806371f19d529f9e9e7dba36.avif",
                desc: "Острые колбаски чоризо, сладкий перец, моцарелла, фирменный томатный соус",
                calories: 279.1, protein: 10.6, fats: 8.7, carbs: 37.8
            },
        ]
    },
    {
        id: 4,
        name: "Вкусно и точка",
        image: "https://visittula.com/upload/iblock/dec/q3u1o6vbgyr7ahbn39as5e19epj0rjaq.webp",
        rating: "4.8",
        time: "40-50 мин",
        tags: ["Бургеры"],
        menu: [
            { 
                id: 401, cat: "Бургеры", name: "Минский бургер с курицей", price: 299, weight: 284, 
                img: "https://vkusnoitochka.ru/resize/194x194/upload/iblock/902/1m25bs31904qk6g1n2fnfojnn9wmk65l/large.png",
                desc: "По-белорусски вкусный! Бургер с сочной куриной котлетой в хрустящей панировке, румяным картофельным оладушком, свежим салатом, двумя ломтиками нежного сыра, хрустящим ароматным беконом, маринованными огурчиками, нежным соусом «Сметана-укроп», и всё это — на воздушной горячей булочке с хрустящей крошкой.",
                calories: 695, protein: 26, fats: 39, carbs: 60
            },
            { 
                id: 402, cat: "Бургеры", name: "Чизбургер", price: 97, weight: 117, 
                img: "https://vkusnoitochka.ru/resize/194x194/upload/iblock/7a1/5ne31kd248o11nayzm077y2tbmdmev38/large.png",
                desc: "Рубленый бифштекс из натуральной цельной говядины с кусочками сыра Чеддер на карамелизованной булочке, заправленной горчицей, кетчупом, луком и кусочком маринованного огурчика",
                calories: 299, protein: 16, fats: 13, carbs: 30
            },
            { 
                id: 403, cat: "Бургеры", name: "Двойной чизбургер", price: 183, weight: 173, 
                img: "https://vkusnoitochka.ru/resize/194x194/upload/iblock/3a4/bpozc95smrogp3ve6sbsojnmno84j66f/large.png",
                desc: "Два рубленых бифштекса из натуральной цельной говядины с двумя кусочками сыра Чеддер на карамелизованной булочке, заправленной горчицей, кетчупом, луком и двумя кусочками маринованного огурчика",
                calories: 441, protein: 26, fats: 23, carbs: 31
            },
            { 
                id: 404, cat: "Бургеры", name: "Чикенбургер", price: 79, weight: 129, 
                img: "https://vkusnoitochka.ru/resize/194x194/upload/iblock/931/6uqws268vvo2ju6bu6b0seud570ow28a/large.png",
                desc: "Обжаренная куриная котлета из сочного куриного мяса, панированная в сухарях, которая подается на карамелизованной булочке, заправленной свежим салатом и специальным соусом",
                calories: 337, protein: 12, fats: 16, carbs: 37
            },
            { 
                id: 405, cat: "Бургеры", name: "Гамбургер", price: 89, weight: 103, 
                img: "https://vkusnoitochka.ru/resize/194x194/upload/iblock/d2e/fcgru6zo5gcory7qcj4zttzvbrqfnu4w/large.png",
                desc: "Рубленый бифштекс из натуральной цельной говядины на карамелизованной булочке, заправленной горчицей, кетчупом, луком и кусочком маринованного огурчика",
                calories: 251, protein: 13, fats: 8.8, carbs: 29
            },
            { 
                id: 406, cat: "Бургеры", name: "Биг Хит", price: 211, weight: 228, 
                img: "https://vkusnoitochka.ru/resize/194x194/upload/iblock/475/ri6yakro2gi150a3abujhegz6x12a6ql/large.png",
                desc: "Легендарный бургер с двумя рублеными бифштексами из 100% говядины, маринованными огурчиками, свежим салатом «Айсберг», ломтиком плавленого сыра Чеддер и специальным соусом «Биг Хит» на новой булочке с двумя видами кунжута",
                calories: 503, protein: 26, fats: 25, carbs: 16
            },
            { 
                id: 407, cat: "Бургеры", name: "Двойной Биг Хит", price: 308, weight: 303, 
                img: "https://vkusnoitochka.ru/resize/194x194/upload/iblock/0de/ms211qtk0dt2kqvwa8qzj9mub7mbotmt/large.png",
                desc: "Большой бургер с четырьмя рублеными бифштексами из 100% говядины, маринованными огурчиками, свежим салатом «Айсберг», ломтиком плавленого сыра Чеддер и специальным соусом «Биг Хит» на новой булочке с двумя видами кунжута",
                calories: 711, protein: 43, fats: 41, carbs: 41
            },
        ]
    },
    {
        id: 5,
        name: "Нино играет в домино",
        image: "https://s.rbk.ru/v1_companies_s3/media/trademarks/2ef2ef1b-93e6-4748-810c-ab3e8e3aba60.jpg",
        rating: "5.0",
        time: "30-40 мин",
        tags: ["Хачапури", "Хинкали", "Гриль", "Горячее"],
        menu: [
            {
                id: 501, cat: "Хачапури", name: "Хачапури по-аджарски", price: 520, weight: 280, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/khachapuri-po-adzharski-6540020a2cc62220630722-234.webp",
                desc: "Традиционный хачапури в виде лодочки с сырной начинкой и яичным желтком",
                calories: 183, protein: 13, fats: 12, carbs: 5
            },
            {
                id: 502, cat: "Хачапури", name: "Хачапури по-имеретински", price: 600, weight: 380, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/khachapuri-po-imeretinski-6540027cedd85150465184-1056.webp",
                desc: "Хачапури с сырной начинкой",
                calories: 249, protein: 12, fats: 13, carbs: 21
            },
            {
                id: 503, cat: "Хачапури", name: "Хачапури с вялеными томатами", price: 680, weight: 390, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/07/24/khachapuri-s-vyalenymi-tomatami-i-shpinatom-6881f692284e6625780682-1056.webp",
                desc: "Нежное тесто, трио Грузинских сыров с пикантными вялеными томатами и эстрагоном под румяной корочкой.",
                calories: 202, protein: 12, fats: 12, carbs: 11
            },
            {
                id: 504, cat: "Хачапури", name: "Хачапури с дорблю, грушей и орехами", price: 690, weight: 420, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/khachapuri-s-dorblyu-grushei-i-orekhami-6540034e31361914481985-1056.webp",
                desc: "Хачапури с сырной начинкой, украшенный сладкой грушей, нежным сыром дорблю и грецкими орехами",
                calories: 254, protein: 13, fats: 15, carbs: 18
            },
            {
                id: 505, cat: "Хачапури", name: "Хачапури с зеленью и сыром", price: 520, weight: 340, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/khachapuri-po-imeretinski-6540e34c111f5801849254-1056.webp",
                desc: "Хачапури с начинкой из сыра и зелени",
                calories: 231, protein: 11, fats: 12, carbs: 20
            },
            {
                id: 506, cat: "Хачапури", name: "Пеновани пури", price: 710, weight: 300, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/penovani-puri-iz-sloyenogo-testa-654004448fb66286228132-1056.webp",
                desc: "Хачапури из слоёного теста с сырной начинкой",
                calories: 194, protein: 13, fats: 14, carbs: 4
            },
            {
                id: 507, cat: "Хачапури", name: "Хачапури Генацвале", price: 610, weight: 350, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/khachapuri-po-imeretinski-6540e3636b78d026168023-1056.webp",
                desc: "Хачапури с начинкой из сыра и сочного мяса",
                calories: 236, protein: 11, fats: 12, carbs: 21
            },
            {
                id: 508, cat: "Хинкали", name: "Хинкали с говядиной и бараниной", price: 490, weight: 210, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/khinkali-s-nachinkoi-v-assortimente-6540198b2028b030851589-1056.webp",
                desc: "Хинкали с говядиной и бараниной с добавлением репчатого лука, свежей кинзы и специй (3 шт.)",
                calories: 243, protein: 8, fats: 1, carbs: 50
            },
            {
                id: 509, cat: "Хинкали", name: "Хинкали с цыпленком", price: 330, weight: 210, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/khinkali-s-nachinkoi-v-assortimente-6540198b2028b030851589-1056.webp",
                desc: "Хинкали с цыпленком с добавлением репчатого лука, свежей кинзы и специй (3 шт.)",
                calories: 242, protein: 8, fats: 1, carbs: 50
            },
            {
                id: 510, cat: "Хинкали", name: "Хинкали с говядиной и свининой", price: 360, weight: 210, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/khinkali-s-nachinkoi-v-assortimente-6540198b2028b030851589-1056.webp",
                desc: "Хинкали с говядиной и свининой с добавлением репчатого лука, свежей кинзы и специй (3 шт.)",
                calories: 242, protein: 8, fats: 1, carbs: 50
            },
            {
                id: 511, cat: "Хинкали", name: "Хинкали с грибами", price: 360, weight: 210, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/khinkali-s-nachinkoi-v-assortimente-6540198b2028b030851589-1056.webp",
                desc: "Хинкали из трех видов грибов с добавлением репчатого лука (3 шт.)",
                calories: 240, protein: 8, fats: 1, carbs: 50
            },
            {
                id: 512, cat: "Хинкали", name: "Хинкали с сыром", price: 490, weight: 210, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/khinkali-s-nachinkoi-v-assortimente-6540198b2028b030851589-1056.webp",
                desc: "Хинкали с сыром сулугуни (3 шт.)",
                calories: 249, protein: 9, fats: 2, carbs: 50
            },
            {
                id: 513, cat: "Гриль", name: "Мцвади из свинины", price: 610, weight: 320, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/mtsvadi-iz-svininy-65400852ed3c4015259772-1056.webp",
                desc: "Сочный шашлык из свинины с маринованным луком, свежей зеленью, домашней лепешкой и томатным соусом с кинзой",
                calories: 217, protein: 8, fats: 5, carbs: 35
            },
            {
                id: 514, cat: "Гриль", name: "Мцвади из цыпленка", price: 580, weight: 320, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/mtsvadi-iz-svininy-65400852ed3c4015259772-1056.webp",
                desc: "Сочный шашлык из цыпленка с маринованным луком, свежей зеленью, домашней лепешкой и томатным соусом с кинзой",
                calories: 197, protein: 7, fats: 3, carbs: 36
            },
            {
                id: 515, cat: "Гриль", name: "Мцвади из говядины", price: 960, weight: 320, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/mtsvadi-iz-svininy-65400852ed3c4015259772-1056.webp",
                desc: "Сочный шашлык из говядины с маринованым луком, свежей зеленью, домашней лепешкой и томатным соусом с кинзой",
                calories: 194, protein: 8, fats: 2, carbs: 36
            },
            {
                id: 516, cat: "Гриль", name: "Мцвади из баранины", price: 1110, weight: 320, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/mtsvadi-iz-svininy-65400852ed3c4015259772-1056.webp",
                desc: "Сочный шашлык из баранины с маринованным луком, свежей зеленью, домашней лепешкой и томатным соусом с кинзой",
                calories: 208, protein: 8, fats: 4, carbs: 36
            },
            {
                id: 517, cat: "Гриль", name: "Шашлык из лосося", price: 1800, weight: 250, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/7-65400aef534e4065133370-1056.webp",
                desc: "Шашлык из нежного лосося с соусом тар-тар, домашней лепешкой и долькой свежего лимона",
                calories: 199, protein: 12, fats: 7, carbs: 22
            },
            {
                id: 518, cat: "Гриль", name: "Шашлык из креветок", price: 1010, weight: 150, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/dsc07283-66faf6f36786d293044753-1056.webp",
                desc: "Шашлык из креветок с соусом тар-тар, домашней лепешкой и долькой свежего лимона",
                calories: 199, protein: 12, fats: 8, carbs: 22
            },
            {
                id: 519, cat: "Гриль", name: "Гриль-сет для 4-5 джигитов", price: 2650, weight: 380, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/gril-set-dlya-4-5-dzhigitov-65400c2b6e098184999638-1056.webp",
                desc: "В состав сета для 4 - 5 человек входят: Мцвади из свинины и цыпленка, Кебаби из свинины и говядины, Стейк из индейки, Овощи...",
                calories: 184, protein: 10, fats: 4, carbs: 28
            },
            {
                id: 520, cat: "Гриль", name: "Кебаби из баранины и говядины", price: 1050, weight: 320, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/kebabi-iz-myasa-na-vybor-65400d1389fb6081329669-1056.webp",
                desc: "Сочный кебаби из смешанного фарша баранины и говядины. Подается с домашней лепешкой, маринованным луком и томатным соусом с кинзой",
                calories: 235, protein: 7, fats: 7, carbs: 35
            },
            {
                id: 521, cat: "Горячее", name: "Стейк из свиной шеи с картофелем", price: 690, weight: 310, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/07/25/steik-iz-svinoi-shei-6883824c04192662248364-1056.webp",
                desc: "Сочный стейк из свиной шеи с сочетанием нежного бейби-картофель, обжаренный в сливочном масле, под бархатистым ореховым соусом.",
                calories: 254, protein: 8, fats: 22, carbs: 5
            },
            {
                id: 522, cat: "Горячее", name: "Долма из баранины и говядины", price: 710, weight: 260, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/07/25/dolma-s-govyadinoi-i-baraninoi-6883837ee6519895327024-1056.webp",
                desc: "Сочная Долма из нежной говядины и баранины, приправленные зелёной аджикой и ароматными травами, в объятиях виноградных листьев.",
                calories: 94, protein: 11, fats: 3, carbs: 6
            },
        ]
    },
    {
        id: 6,
        name: "Ронни",
        image: "https://avatars.mds.yandex.net/i?id=142d3014fee9fb67890d9f37998cbfab7bea2cf7-10332876-images-thumbs&n=13",
        rating: "4.8",
        time: "30-45 мин",
        tags: ["Бургеры", "Горячее", "Десерты"],
        menu: [
            {
                id: 601, cat: "Бургеры", name: "Большой куш", price: 535, weight: 310, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/05/05/bol-shoi-kush-6818f70af114b219045686-1056.webp",
                desc: "Белая булочка с соусом чипотл, томлёная свинина в островатой глазури, сырная котлета, карамелизированный лук, бекон, халапеньо, сыр гауда.",
                calories: 157, protein: 9, fats: 8, carbs: 18
            },
            {
                id: 602, cat: "Бургеры", name: "Гаудзилла", price: 510, weight: 285, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/gaudzilla-673e39e1a0dac477938407-1056.webp",
                desc: "Сочная говяжья и сырная котлеты, бекон, маринованные огурчики, свежие томаты, тянущийся гауда и листья салата.",
                calories: 160, protein: 10, fats: 9, carbs: 20
            },
            {
                id: 603, cat: "Бургеры", name: "Кинг слоу", price: 500, weight: 255, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/05/05/bol-shoi-kush-6818f70af114b219045686-1056.webp",
                desc: "Сочная говяжья котлета, хрустящий коул-слоу, бекон, тянущийся чеддер, свежие томаты и листья салата с соусом на основе чеддера.",
                calories: 157, protein: 9, fats: 8, carbs: 18
            },
            {
                id: 604, cat: "Бургеры", name: "Ориджинал", price: 380, weight: 205, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/oridzhinal-673e3a0e72405701125645-1056.webp",
                desc: "Классический бургер с котлетой из говядины, приготовленной на гриле, сыром гауда, томатным соусом, листом свежего салата.",
                calories: 198, protein: 7, fats: 12, carbs: 14
            },
            {
                id: 605, cat: "Бургеры", name: "Зеленый орк", price: 520, weight: 300, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/zelenyi-ork-673e3a3b18a8a721671384-1056.webp",
                desc: "Булочка, увеличенная котлета из говядины, томаты, свежие огурчики, салат айсберг, хрустящий лук фри с беконом, сыр и домашний чесночный соус.",
                calories: 73, protein: 2, fats: 3, carbs: 10
            },
            {
                id: 606, cat: "Бургеры", name: "Звездный лорд", price: 530, weight: 250, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/03/zvezdnyi-lord-673e3ad076924983983470-1056.webp",
                desc: "Нежнейшая говяжья котлета, листья салата, обжаренный на гриле бекон, сыр гауда, микс вишневого соуса с сырным майонезом.",
                calories: 81, protein: 3, fats: 3, carbs: 11
            },
            {
                id: 607, cat: "Горячее", name: "Филе курицы на гриле", price: 580, weight: 310, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/12/07/file-kuritsy-na-grile-69351318869be876093828-1056.webp",
                desc: "Филе курицы на гриле с бэби картофелем, салатом коул слоу и медово-горчичным соусом",
                calories: 169, protein: 18, fats: 7, carbs: 9
            },
            {
                id: 608, cat: "Горячее", name: "Свинина по-брутальски", price: 580, weight: 330, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/28/svinina-po-brutal-ski-67e68d484719f914771152-1056.webp",
                desc: "Свинина с чесночным маслом, салат коул-слоу из двух видов капусты с яблоком и бейби-картофель.",
                calories: 73, protein: 2, fats: 3, carbs: 10
            },
            {
                id: 609, cat: "Горячее", name: "Боул чикен батат", price: 570, weight: 330, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/12/08/boul-chiken-batat-69364a7b038ad044193667-1056.webp",
                desc: "Хрустящая курица в панировке, батат фри, поджаренный на гриле бекон, свежие томаты, огурцы баттер пиклз, салат коул слоу.",
                calories: 274, protein: 17, fats: 22, carbs: 12
            },
            {
                id: 610, cat: "Горячее", name: "Боул с курицей", price: 520, weight: 330, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/03/28/boul-s-kuritsei-67e68d5734b3c704524599-1056.webp",
                desc: "Курица и удон под соусом терияки, свежие огурцы и томаты под ореховым соусом, поджаренные на гриле шампиньоны.",
                calories: 173, protein: 20, fats: 20, carbs: 10
            },
            {
                id: 611, cat: "Десерты", name: "Полосатый сметанник", price: 390, weight: 100, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/12/07/polosatyi-smetannik-6935144e1130d411802565-1056.webp",
                desc: "Воздушные слои из сметанного крема с прослойкой тонкого черного теста.",
                calories: 237, protein: 7, fats: 19, carbs: 9
            },
            {
                id: 612, cat: "Десерты", name: "Чизкейк с карамелью", price: 390, weight: 100, 
                img: "https://cdn.welcome-dostavka.ru/uploads/2025/12/07/karamel-nyi-chizkeik-693513b4cf038286647239-1056.webp",
                desc: "Классический чизкейк. С карамелью и кренделем.",
                calories: 253, protein: 6, fats: 18, carbs: 16
            },
        ],
    }
];

// --- 3. ФУНКЦИЯ АВТО-ЗАПОЛНЕНИЯ ---
async function seedDatabase() {
    try {
        await Restaurant.deleteMany({}); // Очищаем всё
        await Restaurant.insertMany(restaurantsData); // Записываем данные
        console.log('✅ База данных автоматически обновлена!');
    } catch (e) {
        console.error('❌ Ошибка при обновлении базы:', e);
    }
}

// --- 4. API МАРШРУТЫ ---

app.get('/api/restaurants', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения данных' });
    }
});

app.get('/api/restaurants/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ id: req.params.id });
        res.json(restaurant);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка' });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.json(savedOrder);
    } catch (err) {
        res.status(500).json({ error: 'Не удалось создать заказ' });
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 }); 
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка' });
    }
});

app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- ЗАПУСК ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        // Запускаем заполнение базы сразу после подключения
        seedDatabase();
    })
    .catch((err) => console.error('❌ DB Error:', err));

app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});
