const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: String, enum: ['user', 'admin'], required: true },
    message: { type: String, default: '' },
    type: { type: String, enum: ['text', 'image'], default: 'text' },
    
    // 👇 Rasmning Telegramdagi ID si
    telegramFileId: { type: String }, 
    
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);