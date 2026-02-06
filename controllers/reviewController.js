const Review = require('../models/Review');
const User = require('../models/User');

// 1. Foydalanuvchi rasm yuklaydi (Botdan keladi)
exports.createReview = async (req, res) => {
    try {
        const { telegramId, comment } = req.body;
        
        // Agar rasm yuklanmagan bo'lsa
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Rasm yuklanmadi" });
        }

        // Telegram ID orqali Userni topamiz (ID sini olish uchun)
        const user = await User.findOne({ telegramId });
        if (!user) {
            return res.status(404).json({ success: false, message: "Foydalanuvchi topilmadi" });
        }

        const review = await Review.create({
            user: user._id,
            telegramId,
            imageUrl: `/uploads/${req.file.filename}`, // Rasm manzili
            comment
        });

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Admin rasmni tasdiqlaydi yoki rad etadi
exports.decideReview = async (req, res) => {
    const { id } = req.params; // Review ID
    const { status, adminComment } = req.body; 
    // status: 'approved_cashback', 'approved_discount', 'rejected' bo'lishi mumkin

    const review = await Review.findByIdAndUpdate(
        id,
        { status, adminComment },
        { new: true }
    );

    // TODO: Shu yerda keyinchalik Botga xabar yuborish funksiyasini qo'shamiz
    // Masalan: Agar 'approved_cashback' bo'lsa -> Bot userdan karta so'raydi.

    res.status(200).json({ success: true, data: review });
};

// 3. Admin uchun kutayotgan (pending) rasmlarni olish
exports.getPendingReviews = async (req, res) => {
    const reviews = await Review.find({ status: 'pending' }).populate('user', 'firstName phoneNumber');
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
};