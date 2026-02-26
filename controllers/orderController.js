const Order = require('../models/Order');

// 1. Barcha buyurtmalarni olish (Filter bilan)
exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query; // ?status=new kelsa faqat yangilarini oladi
    
    let filter = {};
    if (status && status !== 'all') {
        filter.status = status;
    }

    // Eng yangilari tepada turadi (.sort)
    // .populate('items.product') -> Mahsulot rasmi va nomini olib keladi
    const orders = await Order.find(filter)
      .populate('items.product', 'title image price')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Bitta buyurtmani olish (Detail sahifa uchun)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'title image price sku');
    
    if (!order) return res.status(404).json({ success: false, message: "Buyurtma topilmadi" });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ... getAllOrders, getOrderById funksiyalari yoniga qo'shing:

// 🔥 YANGI: Buyurtma yaratish (Mijoz uchun)
exports.createOrder = async (req, res) => {
  try {
    const { contact, items, orderType, totalPrice } = req.body;

    // 1. Validatsiya (Tekshirish)
    if (!contact || !contact.fullName || !contact.phone) {
      return res.status(400).json({ success: false, message: "Ism va telefon raqam kiritilishi shart!" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Savatcha bo'sh!" });
    }

    // 2. Yangi buyurtma obyektini yasash
    const newOrder = new Order({
      contact: {
        fullName: contact.fullName,
        phone: contact.phone
      },
      orderType: orderType || 'cart', // 'quick' yoki 'cart'
      items: items.map(item => ({
        product: item.product, // Product ID
        quantity: item.quantity,
        price: item.price // O'sha paytdagi narxi
      })),
      totalPrice: totalPrice,
      status: 'new' // Har doim yangi bo'lib tushadi
    });

    // 3. Bazaga saqlash
    await newOrder.save();

    // 4. (Ixtiyoriy) Adminga Telegramdan xabar yuborish logikasini shu yerga qo'shsa bo'ladi

    res.status(201).json({ success: true, message: "Buyurtma qabul qilindi!", data: newOrder });

  } catch (error) {
    console.error("Order create error:", error);
    res.status(500).json({ success: false, message: "Serverda xatolik yuz berdi" });
  }
};
// 3. Statusni o'zgartirish
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'in_progress', 'completed', etc.
    
    const order = await Order.findByIdAndUpdate(
        req.params.id, 
        { status }, 
        { new: true }
    );

    res.status(200).json({ success: true, data: order, message: "Status o'zgartirildi" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// User uchun buyurtma yaratish funksiyasini keyinroq qo'shamiz (Client qismida)