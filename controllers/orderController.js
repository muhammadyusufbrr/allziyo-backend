const Order = require('../models/Order');
const User = require('../models/User');

// 1. Yangi buyurtma yaratish (Web Appdan)
exports.createOrder = async (req, res) => {
    const { telegramId, products, totalAmount, orderType, contactPhone } = req.body;

    const user = await User.findOne({ telegramId });
    if (!user) return res.status(404).json({ success: false, message: "User topilmadi" });

    const order = await Order.create({
        user: user._id,
        products, // [{ product: ID, quantity: 2 }]
        totalAmount,
        orderType,
        contactPhone,
        status: 'new'
    });

    // TODO: Adminga Telegram orqali xabar yuborish (Yangi buyurtma tushdi!)

    res.status(201).json({ success: true, data: order });
};

// 2. Buyurtmalarni olish (Admin uchun)
exports.getAllOrders = async (req, res) => {
    const orders = await Order.find()
        .populate('user', 'firstName')
        .populate('products.product', 'title price')
        .sort({ createdAt: -1 });
        
    res.status(200).json({ success: true, data: orders });
};