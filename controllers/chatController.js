const Message = require('../models/Message');
const User = require('../models/User');
const axios = require('axios');

// Bot tokenini .env fayldan olamiz
const BOT_TOKEN = process.env.BOT_TOKEN;

// 1. Admin userga javob yozishi (Telegramga boradi)
exports.sendReply = async (req, res) => {
    try {
        const { userId, text } = req.body;
        
        const user = await User.findById(userId);
        
        // 🔥 Userni "yangilandi" deb vaqtini o'zgartiramiz (Tepaga chiqishi uchun)
        await User.findByIdAndUpdate(userId, { updatedAt: new Date() });    
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User topilmadi" });
        }

        // Telegramga yuboramiz
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: user.telegramId,
            text: `👨‍💻 Admin:\n${text}`
        });

        // Bazaga saqlaymiz
        const newMessage = await Message.create({
            userId: user._id,
            sender: 'admin',
            message: text,
            type: 'text',
            isRead: true
        });

        res.status(200).json({ success: true, data: newMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Telegramga yuborishda xatolik" });
    }
};

// 2. User bilan yozishmalarni olish
exports.getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const messages = await Message.find({ userId }).sort({ createdAt: 1 });
        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Userlar ro'yxati (🔥 MUKKAMMAL VERSIYA)
// Bu yerda biz User + O'qilmaganlar soni + Oxirgi xabarni bitta qilib qaytaramiz
exports.getChatUsers = async (req, res) => {
    try {
        const users = await User.aggregate([
            // A) Message jadvalidan shu userga tegishli xabarlarni olib kelamiz
            {
                $lookup: {
                    from: 'messages',         // Baza jadvali nomi (odatda kichik harfda va ko'plikda)
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'messages'
                }
            },
            // B) Kerakli maydonlarni hisoblaymiz
            {
                $addFields: {
                    // O'qilmagan xabarlar soni (Faqat user yozgan va o'qilmagan)
                    unreadCount: {
                        $size: {
                            $filter: {
                                input: '$messages',
                                as: 'msg',
                                cond: { 
                                    $and: [
                                        { $eq: ['$$msg.sender', 'user'] }, 
                                        { $eq: ['$$msg.isRead', false] }
                                    ]
                                }
                            }
                        }
                    },
                    // Oxirgi xabar (Eng oxirgisini olamiz)
                    lastMessage: { $arrayElemAt: [{ $slice: ['$messages', -1] }, 0] }
                }
            },
            // C) Message array juda katta bo'lib ketmasligi uchun uni olib tashlaymiz
            { $project: { messages: 0, password: 0, __v: 0 } },
            // D) Vaqt bo'yicha saralaymiz (Eng yangi yozganlar tepada)
            { $sort: { updatedAt: -1 } }
        ]);

        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Xabarlarni "O'qildi" qilish (🔥 YANGI FUNKSIYA)
exports.markAsRead = async (req, res) => {
    try {
        const { userId } = req.params;

        // Shu user yuborgan barcha o'qilmagan xabarlarni 'isRead: true' qilamiz
        await Message.updateMany(
            { userId: userId, sender: 'user', isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Botdan kelgan xabarni saqlash
exports.receiveMessage = async (req, res) => {
    try {
        const { telegramId, text, fileId, type } = req.body;
        
        const user = await User.findOne({ telegramId });
        if (!user) return res.status(404).json({ message: "User yo'q" });

        // 🔥 Userni tepaga chiqarish uchun vaqtini yangilaymiz
        await User.findByIdAndUpdate(user._id, { updatedAt: new Date() });

        await Message.create({
            userId: user._id,
            sender: 'user',
            message: text || '',
            type: type || 'text',
            telegramFileId: fileId
        });

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 6. Rasmni Telegramdan olib beruvchi PROXY
exports.getTelegramImage = async (req, res) => {
    try {
        const { fileId } = req.params;

        const fileRes = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
        const filePath = fileRes.data.result.file_path;
        const imageUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

        const response = await axios({
            url: imageUrl,
            method: 'GET',
            responseType: 'stream'
        });

        if (response.headers['content-type']) {
            res.setHeader('Content-Type', response.headers['content-type']);
        } else {
            res.setHeader('Content-Type', 'image/jpeg');
        }

        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); 
        res.setHeader('Cache-Control', 'public, max-age=86400');

        response.data.pipe(res);

    } catch (error) {
        console.error("Rasm olishda xato:", error.message);
        res.status(404).send('Not found');
    }
};