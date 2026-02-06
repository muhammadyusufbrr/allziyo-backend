const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Message = require('./models/Message');

// .env faylni o'qiymiz
dotenv.config();

const cleanData = async () => {
    try {
        // 1. Bazaga ulanish
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDBga ulandi...');

        // 2. Hamma narsani o'chirish
        await User.deleteMany({});
        console.log('🗑  Hamma Userlar o\'chirildi!');

        await Message.deleteMany({});
        console.log('🗑  Hamma Xabarlar o\'chirildi!');

        console.log('🎉 BAZA TOP-TOZA BO\'LDI!');
        process.exit();

    } catch (error) {
        console.error('❌ Xatolik:', error);
        process.exit(1);
    }
};

cleanData();