const Product = require('../models/Product');
const mongoose = require('mongoose'); // ObjectId uchun kerak
const fs = require('fs');
const path = require('path');

// 1. Tovar qo'shish
exports.createProduct = async (req, res) => {
    try {
        const { title, description, price, oldPrice, category, stock } = req.body;
        const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        const newProduct = new Product({
            title, description, price, oldPrice, category, stock, images: imagePaths
        });

        await newProduct.save();
        res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 🔥 2. KUCHAYTIRILGAN SEARCH VA FILTER (Google Style)
exports.getAllProducts = async (req, res) => {
    try {
        // Query parametrlarini olamiz
        const { search, categoryId, page = 1, limit = 20 } = req.query;
        
        const pipeline = [];

        // 🔍 A. QIDIRUV LOGIKASI (SEARCH)
        if (search) {
            const cleanSearch = search.trim();
            
            pipeline.push({
                $match: {
                    $or: [
                        // 1. Index orqali qidirish (Eng aniq va tez)
                        { $text: { $search: cleanSearch } },
                        // 2. Chala so'zlar uchun Regex (Masalan: "iph" -> "iphone")
                        { title: { $regex: cleanSearch, $options: "i" } },
                        { description: { $regex: cleanSearch, $options: "i" } }
                    ]
                }
            });

            // Reyting (Score) hisoblash: Eng mos kelganlari tepaga chiqadi
            pipeline.push({
                $addFields: {
                    score: { $meta: "textScore" }
                }
            });

            // Score bo'yicha saralash
            pipeline.push({ $sort: { score: -1, createdAt: -1 } });
        } else {
            // Agar search bo'lmasa, shunchaki eng yangilari chiqsin
            pipeline.push({ $sort: { createdAt: -1 } });
        }

        // 🏷️ B. KATEGORIYA BO'YICHA FILTER
        if (categoryId) {
            pipeline.push({
                $match: {
                    category: new mongoose.Types.ObjectId(categoryId)
                }
            });
        }

        // 🔗 C. POPULATE QILISH ($lookup)
        // Aggregationda .populate() ishlamaydi, shuning uchun $lookup ishlatamiz
        pipeline.push({
            $lookup: {
                from: "categories", // Bazadagi collection nomi (odatda ko'plikda bo'ladi)
                localField: "category",
                foreignField: "_id",
                as: "categoryData"
            }
        });

        // Arrayni obyektga aylantirish (Populate natijasi array bo'lib qoladi)
        pipeline.push({
            $unwind: { path: "$categoryData", preserveNullAndEmptyArrays: true }
        });

        // 📄 D. PAGINATION (Sahifalash) va TOTAL SONI
        // Bu qism bir vaqtning o'zida ham ma'lumotni, ham umumiy sonini qaytaradi
        const skip = (Number(page) - 1) * Number(limit);
        
        pipeline.push({
            $facet: {
                metadata: [{ $count: "total" }], // Jami nechta borligini sanaydi
                data: [
                    { $skip: skip },
                    { $limit: Number(limit) },
                    // Kerakli maydonlarni chiroyli qilib yig'ish
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            description: 1,
                            price: 1,
                            oldPrice: 1,
                            stock: 1,
                            images: 1,
                            createdAt: 1,
                            score: 1, // Agar search bo'lsa score chiqadi
                            category: "$categoryData" // Populate qilingan kategoriya
                        }
                    }
                ]
            }
        });

        // So'rovni bajarish
        const result = await Product.aggregate(pipeline);

        // Natijani formatlash
        const products = result[0].data;
        const total = result[0].metadata[0] ? result[0].metadata[0].total : 0;

        res.status(200).json({
            success: true,
            count: products.length,
            total,      // Jami mahsulotlar soni (Pagination uchun kerak)
            page: Number(page),
            totalPages: Math.ceil(total / limit),
            products    // Mahsulotlar ro'yxati
        });

    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// 3. Bitta tovarni ko'rish
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) return res.status(404).json({ message: "Tovar topilmadi" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Tovarni o'chirish
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Tovar topilmadi" });

        // Rasmlarni o'chirish logikasi
        if (product.images && product.images.length > 0) {
            product.images.forEach(imagePath => {
                // /uploads/image.png -> uploads/image.png (boshidagi slashni olib tashlash)
                const fullPath = path.join(__dirname, '..', imagePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Tovar va uning rasmlari o'chirildi" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Tovarni yangilash
exports.updateProduct = async (req, res) => {
    try {
        const { title, description, price, oldPrice, category, stock } = req.body;
        const product = await Product.findById(req.params.id);
        
        if (!product) return res.status(404).json({ message: "Tovar topilmadi" });

        // Ma'lumotlarni yangilash
        if (title) product.title = title;
        if (description) product.description = description;
        if (price) product.price = price;
        if (oldPrice) product.oldPrice = oldPrice;
        if (category) product.category = category;
        if (stock) product.stock = stock;

        // Yangi rasm qo'shish (Eskilari o'chmaydi, yangisi qo'shiladi. 
        // Agar eskisini o'chirib yangilash kerak bo'lsa, logikani o'zgartirish kerak)
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/${file.filename}`);
            product.images = [...product.images, ...newImages];
        }

        await product.save();
        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};