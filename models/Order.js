const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // 1. Mijoz Ma'lumotlari
  contact: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
  },
  
  // 2. Buyurtma Turi (Tezkor yoki Savatcha)
  orderType: {
    type: String,
    enum: ['quick', 'cart'], // 'quick' = 1 click, 'cart' = savatchadan
    default: 'cart',
  },

  // 3. Mahsulotlar
  items: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', // Product modeliga bog'laymiz
        required: true 
      },
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true }, // O'sha paytdagi narxi
    }
  ],

  // 4. Umumiy summa
  totalPrice: { type: Number, required: true },

  // 5. Status (Jarayon)
  status: {
    type: String,
    enum: ['new', 'in_progress', 'completed', 'cancelled'],
    default: 'new',
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);