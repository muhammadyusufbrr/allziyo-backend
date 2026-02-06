const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`✅ MongoDB bazasiga ulandi: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Bazaga ulanishda xatolik: ${error.message}`);
        process.exit(1); // Xatolik bo'lsa serverni to'xtatish
    }
};

module.exports = connectDB;