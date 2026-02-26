const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    telegramId: { type: Number, required: true, index: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Bizning bazaga bog'landi
            quantity: { type: Number, default: 1 }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);