const Category = require('../models/Category');

// 1. Kategoriya yaratish
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : '';

        // 🔥 YANGI: Avtomatik eng oxirgi tartib raqamini (order) hisoblash
        const lastCategory = await Category.findOne().sort('-order');
        const newOrder = lastCategory ? lastCategory.order + 1 : 1;

        const newCategory = new Category({ 
            name, 
            image,
            order: newOrder, // Tartib raqami qo'shildi
            isShown: false   // Default holatda saytda ko'rinmaydi
        });
        
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Barcha kategoriyalarni olish
exports.getAllCategories = async (req, res) => {
    try {
        // Order bo'yicha tartiblab beradi (1, 2, 3...)
        const categories = await Category.find().sort({ order: 1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. O'chirish
exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Kategoriya o'chirildi" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Yangilash (Update)
exports.updateCategory = async (req, res) => {
  try {
    // 🔥 YANGI: isShown (Switch) ni ham qabul qilish kerak
    const { name, isShown } = req.body; 
    let updateData = {};

    if (name) updateData.name = name;
    
    // Switch logikasi: Agar frontdan true/false kelsa, yozamiz
    if (isShown !== undefined) {
        updateData.isShown = isShown;
    }

    // Rasm yangilansa
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ success: false, message: "Kategoriya topilmadi" });
    }

    res.status(200).json({
      success: true,
      data: category,
      message: "Kategoriya yangilandi"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Serverda xatolik" });
  }
};

// 5. Tartiblash (Reorder)
exports.reorderCategories = async (req, res) => {
    try {
        const { categories } = req.body; // Frontdan [{_id: '...', order: 1}, ...] keladi

        if (!categories || !Array.isArray(categories)) {
            return res.status(400).json({ message: "Noto'g'ri ma'lumot" });
        }

        // BulkWrite orqali hammasini bittada yangilaymiz (Database uchun yengil)
        const bulkOps = categories.map((cat, index) => ({
            updateOne: {
                filter: { _id: cat._id },
                update: { order: index + 1 } // Index 0 dan boshlanadi, biz 1 dan boshlaymiz
            }
        }));

        await Category.bulkWrite(bulkOps);

        res.status(200).json({ success: true, message: "Tartib saqlandi" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};