const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    

    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    },

    images: [{ type: String }],
    stock: { type: Boolean, default: true },
    isTop: { type: Boolean, default: false },
}, { timestamps: true });
ProductSchema.index(
  { title: "text", description: "text" }, 
  { weights: { title: 10, description: 5 } }
);
module.exports = mongoose.model('Product', ProductSchema);