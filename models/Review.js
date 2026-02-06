const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    telegramId: Number, // Qidirish oson bo'lishi uchun
    imageUrl: {
        type: String,
        required: true
    },
    comment: String, // User yozgan izoh (ixtiyoriy)
    status: {
        type: String,
        enum: ['pending', 'approved_cashback', 'approved_discount', 'rejected'],
        default: 'pending' // Hozirgina yuklandi, Admin hali ko'rmadi
    },
    adminComment: String, // Admin nega rad etganini yozishi mumkin
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);