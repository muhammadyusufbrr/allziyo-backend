const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  isShown: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0, // Standart tartib
  },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);