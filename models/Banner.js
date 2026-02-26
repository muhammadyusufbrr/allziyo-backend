const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Sarlavha bo'lishi shart"],
    trim: true,
  },
  image: {
    type: String, // Bu yerga rasm yo'li tushadi: "/uploads/image-123.jpg"
    required: [true, "Rasm bo'lishi shart"],
  },
  link: {
    type: String,
    default: "/",
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);