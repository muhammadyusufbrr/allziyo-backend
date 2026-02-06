const mongoose = require('mongoose');

const SupportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    telegramId: Number, // Qidirish oson bo'lishi uchun
    messages: [
        {
            sender: {
                type: String,
                enum: ['user', 'admin'],
                required: true
            },
            text: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    lastMessageAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Support', SupportSchema);