const User = require('../models/User');

// 1. Foydalanuvchini yaratish yoki yangilash (Botdan kelganda)
// Bu funksiya user bazada bormi tekshiradi. Yo'q bo'lsa yaratadi, bor bo'lsa yangilaydi.
exports.createOrUpdateUser = async (req, res) => {
    const { telegramId, firstName, username, language } = req.body;

    // findOneAndUpdate: Qidiradi va yangilaydi. { upsert: true } degani "Topomasang yarat" degani.
    const user = await User.findOneAndUpdate(
        { telegramId },
        { firstName, username, language },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, data: user });
};

// 2. Foydalanuvchi ma'lumotini olish (Profil uchun)
exports.getUser = async (req, res) => {
    const { telegramId } = req.params;
    const user = await User.findOne({ telegramId });

    if (!user) {
        return res.status(404).json({ success: false, message: "Foydalanuvchi topilmadi" });
    }

    res.status(200).json({ success: true, data: user });
};

// 3. Telefon raqamni saqlash (Kontakt ulashish tugmasidan keyin)
exports.updatePhone = async (req, res) => {
    const { telegramId, phoneNumber } = req.body;

    const user = await User.findOneAndUpdate(
        { telegramId },
        { phoneNumber },
        { new: true }
    );

    res.status(200).json({ success: true, data: user });
};

// 4. Karta raqamni saqlash (Cashback uchun)
exports.saveCardNumber = async (req, res) => {
    const { telegramId, cardNumber } = req.body;

    // Karta raqam faqat raqamlardan iboratligini tekshirish (ixtiyoriy)
    if (!/^\d{16}$/.test(cardNumber)) {
         return res.status(400).json({ success: false, message: "Noto'g'ri karta raqami" });
    }

    const user = await User.findOneAndUpdate(
        { telegramId },
        { cardNumber },
        { new: true }
    );

    if (!user) {
        return res.status(404).json({ success: false, message: "User topilmadi" });
    }

    res.status(200).json({ success: true, message: "Karta raqami saqlandi", data: user });
};