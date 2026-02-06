const mongoose = require('mongoose');

const PromocodeSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Masalan: "SUPER50"
    percentage: { type: Number, required: true }, // 5, 10, 50 (o'zgarmas qilsak ham bo'ladi)
    limit: { type: Number, default: 100 }, // Necha kishi ishlata oladi
    used: { type: Number, default: 0 }, // Necha kishi ishlatdi
    expireAt: { type: Date, required: true } // Tugash muddati
}, { timestamps: true });

module.exports = mongoose.model('Promocode', PromocodeSchema);