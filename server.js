// require('dotenv').config(); // .env faylni o'qish
// require('express-async-errors'); // Xatolarni ushlash

// const express = require('express');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const path = require('path');
// const connectDB = require('./config/db');
// const cors = require('cors');
// const userRoutes = require('./routes/userRoutes');
// const productRoutes = require('./routes/productRoutes');
// const reviewRoutes = require('./routes/reviewRoutes'); 
// const orderRoutes = require('./routes/orderRoutes');
// const supportRoutes = require('./routes/supportRoutes');
// const settingRoutes = require('./routes/settingRoutes');
// const authRoutes = require('./routes/authRoutes');     // YANGI
// const uploadRoutes = require('./routes/uploadRoutes');
// const chatRoutes = require('./routes/chatRoutes');
// const promoRoutes = require('./routes/promoRoutes');
// const categoryRoutes = require('./routes/categoryRoutes');
// const cartRoutes = require('./routes/cartRoutes');
// const favoriteRoutes = require('./routes/favoriteRoutes');
// const bannerRoutes = require('./routes/bannerRoutes');


// const app = express();

// app.use(express.json());

// app.use(cors()); 
// app.use(helmet({
//   crossOriginResourcePolicy: false, 
// }));
// app.use(morgan('dev')); 
// app.use('/api/chat', chatRoutes);
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/api/users', userRoutes); 
// app.use('/api/products', productRoutes); 
// app.use('/api/users', userRoutes);
// app.use('/api/reviews', reviewRoutes); 
// app.use('/api/orders', orderRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/support', supportRoutes);
// app.use('/api/settings', settingRoutes);
// app.use('/api/promocodes', promoRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/favorites', favoriteRoutes);
// app.use('/api/banners', bannerRoutes);

// app.get('/', (req, res) => {
//     res.json({ message: 'Alziyo Backend API ishlayapti 🚀' });
// });
// app.use('/api/auth', authRoutes);     
// app.use('/api/upload', uploadRoutes);
// const PORT = process.env.PORT || 5000;

// const start = async () => {
//     try {
//         // 1. Avval bazaga ulanamiz
//         await connectDB();
        
//         // 2. Keyin serverni yoqamiz
//         app.listen(PORT, () => {
//             console.log(`🚀 Server ${PORT}-portda ishga tushdi (Mode: ${process.env.NODE_ENV})`);
//         });
//     } catch (error) {
//         console.log(error);
//     }
// };

// start();

require('dotenv').config();
require('express-async-errors');

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const cors = require('cors');

// Route fayllar
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes'); 
const orderRoutes = require('./routes/orderRoutes');
const supportRoutes = require('./routes/supportRoutes');
const settingRoutes = require('./routes/settingRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const chatRoutes = require('./routes/chatRoutes');
const promoRoutes = require('./routes/promoRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const bannerRoutes = require('./routes/bannerRoutes');

const app = express();

// --- 1. MIDDLEWARE SOZLAMALARI (TARTIB MUHIM) ---

// CORS: Hamma joydan kirishga ruxsat berish
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// HELMET: Rasmlar "begona" joyda ochilishi uchun maxsus sozlama
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use(morgan('dev'));
app.use(express.json());

// --- 2. STATIC FAYLLAR (RASMLAR) ---
// 🔥 ENG MUHIM JOYI: Rasmlarga majburan Header qo'shamiz
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, path, stat) => {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

// --- 3. ROUTES ---
app.get('/', (req, res) => {
    res.json({ message: 'Alziyo Backend API ishlayapti 🚀' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/products', productRoutes); 
app.use('/api/reviews', reviewRoutes); 
app.use('/api/orders', orderRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/promocodes', promoRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/banners', bannerRoutes); // ✅ Banner route
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatRoutes);

// --- 4. SERVERNI ISHGA TUSHIRISH ---
const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server ${PORT}-portda ishga tushdi (Mode: ${process.env.NODE_ENV})`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();