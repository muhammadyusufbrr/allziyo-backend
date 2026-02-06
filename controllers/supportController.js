const Support = require('../models/Support');
const User = require('../models/User');

// 1. User xabar yozadi (Botdan keladi)
exports.sendMessage = async (req, res) => {
    const { telegramId, text } = req.body;

    // Userni topamiz
    const user = await User.findOne({ telegramId });
    if (!user) return res.status(404).json({ success: false, message: "User topilmadi" });

    // Shu user bilan oldin chat bo'lganmi?
    let chat = await Support.findOne({ telegramId });

    if (!chat) {
        // Yangi chat ochamiz
        chat = await Support.create({
            user: user._id,
            telegramId,
            messages: [{ sender: 'user', text }]
        });
    } else {
        // Eski chatga xabar qo'shamiz
        chat.messages.push({ sender: 'user', text });
        chat.lastMessageAt = Date.now();
        await chat.save();
    }

    res.status(200).json({ success: true, message: "Xabar yuborildi" });
};

// 2. Admin javob yozadi (Admin paneldan)
exports.replyMessage = async (req, res) => {
    const { telegramId, text } = req.body; // Kimga javob yozilyapti?

    const chat = await Support.findOne({ telegramId });
    if (!chat) return res.status(404).json({ success: false, message: "Chat topilmadi" });

    chat.messages.push({ sender: 'admin', text });
    chat.lastMessageAt = Date.now();
    await chat.save();

    // TODO: Shu yerda Botga signal berish kerak: "Userga javobni yetkaz!"

    res.status(200).json({ success: true, message: "Javob yuborildi" });
};

// 3. Hamma chatlarni olish (Admin uchun)
exports.getAllChats = async (req, res) => {
    const chats = await Support.find()
        .populate('user', 'firstName lastName')
        .sort({ lastMessageAt: -1 }); // Eng yangi yozishmalar tepada

    res.status(200).json({ success: true, data: chats });
};