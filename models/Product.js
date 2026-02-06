const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    // 1. Asosiy ma'lumotlar
    title: {
        type: String,
        required: [true, "Mahsulot nomi kiritilishi shart"],
        trim: true
    },
    slug: { // URL uchun chiroyli nom (masalan: macbook-pro-m1)
        type: String,
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, "Mahsulot haqida ma'lumot kiritilishi shart"]
    },
    
    // 2. Narx va Chegirma
    price: { // Hozirgi narx
        type: Number,
        required: true
    },
    oldPrice: { // Eski narx (Agar bu price dan katta bo'lsa, ustiga chizib ko'rsatiladi)
        type: Number,
        default: 0
    },

    // 3. Media (Rasmlar)
    images: [{ // Endi bitta rasm emas, rasmlar to'plami bo'ladi
        type: String,
        required: true
    }],
    
    // 4. Kategoriyasi
    category: {
        type: String,
        required: true,
        trim: true
    },
    brand: { // Brend nomi (Apple, Samsung, Rapoo...)
        type: String,
        default: 'General'
    },

    // 5. Holati va Ombordagi soni
    countInStock: { // Nechta qoldi? (0 bo'lsa "Sotuvda yo'q" chiqadi)
        type: Number,
        default: 0,
        required: true
    },
    isActive: { // Admin panelda mahsulotni vaqtincha yashirib qo'yish uchun
        type: Boolean,
        default: true
    },

    // 6. Qo'shimcha havolalar
    uzumLink: String, // Uzum marketdagi linki

    // 7. Statistika (Avtomatik hisoblanadi)
    rating: { // O'rtacha baho (1-5)
        type: Number,
        default: 0
    },
    numReviews: { // Nechta odam izoh qoldirdi
        type: Number,
        default: 0
    }

}, { timestamps: true });

// Qidiruvni tezlashtirish uchun index qo'shamiz
ProductSchema.index({ title: 'text', category: 'text' });

module.exports = mongoose.model('Product', ProductSchema);