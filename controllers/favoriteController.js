const Favorite = require('../models/Favorite');

// ❤️ Sevimlilarga qo'shish yoki Olib tashlash (Toggle)
exports.toggleFavorite = async (req, res) => {
    try {
        const { telegramId, product } = req.body;

        let userFav = await Favorite.findOne({ telegramId });

        if (!userFav) {
            // User birinchi marta kiryapti
            userFav = new Favorite({ telegramId, products: [product] });
            await userFav.save();
            return res.status(200).json({ status: 'added', products: userFav.products });
        }

        // Mahsulot borligini tekshiramiz
        const existIndex = userFav.products.findIndex(p => p.uzumProductId === product.uzumProductId);

        if (existIndex > -1) {
            // BOR ekan -> O'CHIRAMIZ
            userFav.products.splice(existIndex, 1);
            await userFav.save();
            return res.status(200).json({ status: 'removed', products: userFav.products });
        } else {
            // YO'Q ekan -> QO'SHAMIZ
            userFav.products.push(product);
            await userFav.save();
            return res.status(200).json({ status: 'added', products: userFav.products });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ❤️ Userning barcha sevimlilarini olish
exports.getFavorites = async (req, res) => {
    try {
        const { telegramId } = req.params;
        const userFav = await Favorite.findOne({ telegramId });
        res.status(200).json(userFav ? userFav.products : []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};