require('dotenv').config(); // .env faylni o'qish
require('express-async-errors'); // Xatolarni ushlash

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db'); // Bazaga ulanish funksiyasi

// --- ROUTELARNI IMPORT QILISH ---
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes'); 
const orderRoutes = require('./routes/orderRoutes');
const supportRoutes = require('./routes/supportRoutes');
const settingRoutes = require('./routes/settingRoutes');
const authRoutes = require('./routes/authRoutes');     // YANGI
const uploadRoutes = require('./routes/uploadRoutes');
const chatRoutes = require('./routes/chatRoutes');
const promoRoutes = require('./routes/promoRoutes');
// Serverni yaratish
const app = express();

// --- MIDDLEWARES ---
app.use(express.json()); // JSON ma'lumotlarni o'qish
app.use(cors()); // Frontend va Botdan kirishga ruxsat
app.use(helmet()); // Xavfsizlik himoyasi
app.use(morgan('dev')); // Terminalda loglarni ko'rsatish
app.use('/api/chat', chatRoutes);
// Rasmlar papkasini ochiq qilish (public)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/users', userRoutes); 
app.use('/api/products', productRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes); 
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/promocodes', promoRoutes);
app.get('/', (req, res) => {
    res.json({ message: 'Alziyo Backend API ishlayapti 🚀' });
});
app.use('/api/auth', authRoutes);       // Admin kirishi uchun
app.use('/api/upload', uploadRoutes);
// --- SERVERNI ISHGA TUSHIRISH ---
const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        // 1. Avval bazaga ulanamiz
        await connectDB();
        
        // 2. Keyin serverni yoqamiz
        app.listen(PORT, () => {
            console.log(`🚀 Server ${PORT}-portda ishga tushdi (Mode: ${process.env.NODE_ENV})`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();