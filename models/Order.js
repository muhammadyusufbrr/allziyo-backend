const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    totalAmount: Number,
    orderType: {
        type: String,
        enum: ['web_app_cart', '1_click'],
        default: 'web_app_cart'
    },
    contactPhone: String, // Buyurtma uchun alohida nomer
    status: {
        type: String,
        enum: ['new', 'processing', 'completed', 'cancelled'],
        default: 'new'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);