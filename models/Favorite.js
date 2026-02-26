const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
    telegramId: { type: Number, required: true, index: true },
    products: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Product' } // Faqat ID saqlaymiz
    ]
}, { timestamps: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);