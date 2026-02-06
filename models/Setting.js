const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
    welcomePromo: { // 5% lik (Start bosganda)
        type: String,
        default: "WELCOME5"
    },
    registerPromo: { // 15% lik (Telefon yuborganda)
        type: String,
        default: "SUPER15"
    }
}, { timestamps: true });

module.exports = mongoose.model('Setting', SettingSchema);