const Cart = require('../models/Cart');

// 1. Savatga qo'shish
exports.addToCart = async (req, res) => {
    try {
        const { telegramId, productId, quantity } = req.body;
        
        let cart = await Cart.findOne({ telegramId });
        if (!cart) cart = new Cart({ telegramId, items: [] });

        // Item bormi tekshiramiz (toString() muhim, chunki baza ObjectId qaytaradi)
        const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity || 1;
        } else {
            cart.items.push({ productId, quantity: quantity || 1 });
        }

        await cart.save();
        res.status(200).json(cart.items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Savatni olish (Populate bilan)
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ telegramId: req.params.telegramId })
            .populate('items.productId'); 
            
        // Agar tovar bazadan o'chib ketgan bo'lsa, null bo'lib qolmasligi uchun tozalaymiz
        if(cart) {
             cart.items = cart.items.filter(item => item.productId !== null);
        }

        res.status(200).json(cart ? cart.items : []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Savatdan bitta mahsulotni o'chirish (BU YETISHMAYOTGAN EDI)
exports.removeFromCart = async (req, res) => {
    try {
        const { telegramId, productId } = req.body;
        const cart = await Cart.findOne({ telegramId });

        if (cart) {
            // Berilgan ID ga teng bo'lmaganlarini olib qolamiz (o'chirib tashlaymiz)
            cart.items = cart.items.filter(p => p.productId.toString() !== productId);
            await cart.save();
        }
        res.status(200).json(cart ? cart.items : []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Savatni butunlay tozalash (BU HAM YETISHMAYOTGAN EDI)
exports.clearCart = async (req, res) => {
    try {
        const { telegramId } = req.params;
        await Cart.findOneAndDelete({ telegramId });
        res.status(200).json({ message: "Savat tozalandi" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};