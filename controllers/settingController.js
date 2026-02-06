const Setting = require('../models/Setting');

// Promokodlarni olish (Bot uchun)
exports.getPromos = async (req, res) => {
    // Bazadan birinchi sozlamani olamiz. Agar yo'q bo'lsa, yangisini yaratamiz.
    let settings = await Setting.findOne();
    if (!settings) {
        settings = await Setting.create({});
    }
    res.status(200).json({ success: true, data: settings });
};

// Promokodlarni yangilash (Admin Panel uchun)
exports.updatePromos = async (req, res) => {
    const { welcomePromo, registerPromo } = req.body;
    
    let settings = await Setting.findOne();
    if (!settings) {
        settings = await Setting.create({ welcomePromo, registerPromo });
    } else {
        settings.welcomePromo = welcomePromo || settings.welcomePromo;
        settings.registerPromo = registerPromo || settings.registerPromo;
        await settings.save();
    }

    res.status(200).json({ success: true, data: settings });
};