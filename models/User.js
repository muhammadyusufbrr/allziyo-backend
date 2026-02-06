const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    telegramId: {
        type: Number,
        required: true,
        unique: true
    },
    firstName: String,
    lastName: String,
    username: String,
    phoneNumber: String,
    language: {
        type: String,
        enum: ['uz', 'ru'],
        default: 'uz'
    },
    balance: { // Cashback yig'iladigan hamyon
        type: Number,
        default: 0
    },
    cardNumber: String, // Pul tashlab berish uchun
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);