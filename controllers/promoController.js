const Promocode = require('../models/Promocode');

// 1. Promokodlarni olish
exports.getPromocodes = async (req, res) => {
    try {
        // Agar baza bo'sh bo'lsa, avtomatik 3 tasini yaratib qo'yamiz (Seed)
        const count = await Promocode.countDocuments();
        if (count === 0) {
            await Promocode.insertMany([
                { name: "START5", percentage: 5, limit: 100, expireAt: new Date("2030-01-01") },
                { name: "DISCOUNT10", percentage: 10, limit: 50, expireAt: new Date("2030-01-01") },
                { name: "SUPER50", percentage: 50, limit: 10, expireAt: new Date("2030-01-01") }
            ]);
        }
        
        const promos = await Promocode.find().sort({ percentage: 1 });
        res.status(200).json({ success: true, data: promos });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Tahrirlash (Edit)
exports.updatePromocode = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, limit, expireAt } = req.body;

        const updated = await Promocode.findByIdAndUpdate(
            id, 
            { name, limit, expireAt }, 
            { new: true }
        );

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};