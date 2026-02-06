const Product = require('../models/Product');

// 1. CREATE - Yangi mahsulot qo'shish
// YANGI Create Product Funksiyasi
exports.createProduct = async (req, res) => {
    try {
        // Frontenddan keladigan ma'lumotlar
        const { 
            title, 
            description, 
            price, 
            oldPrice, 
            images, // Bu endi Array bo'lishi kerak! ["url1.jpg", "url2.jpg"]
            category, 
            brand, 
            countInStock, 
            uzumLink 
        } = req.body;

        // Slug yaratish (Nomni kichkina harf va chiziqchaga aylantirish)
        // Masalan: "MacBook Pro M1" -> "macbook-pro-m1"
        const slug = title.toLowerCase().split(' ').join('-');

        const product = await Product.create({
            title,
            slug,
            description,
            price,
            oldPrice,
            images,
            category,
            brand,
            countInStock,
            uzumLink
        });

        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. READ ALL - Hamma mahsulotlarni olish
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. READ ONE - Bitta mahsulotni olish (ID bo'yicha) - YANGI
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Mahsulot topilmadi" });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. UPDATE - Mahsulotni tahrirlash - YANGI
exports.updateProduct = async (req, res) => {
    try {
        const { title, price, image, category, uzumLink, inStock } = req.body;

        // findByIdAndUpdate: ID bo'yicha topib, yuborilgan ma'lumotlarni yangilaydi
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { title, price, image, category, uzumLink, inStock },
            { new: true, runValidators: true } // new: true -> yangilangan versiyani qaytaradi
        );

        if (!product) {
            return res.status(404).json({ success: false, message: "Mahsulot topilmadi" });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. DELETE - Mahsulotni o'chirish
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: "Mahsulot topilmadi" });
        }

        res.status(200).json({ success: true, message: "Mahsulot o'chirildi" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};