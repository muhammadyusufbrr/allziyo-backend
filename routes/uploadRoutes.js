const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware'); // Tayyor multer

// POST /api/upload
router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Rasm yuklanmadi" });
    }
    
    // Rasm manzilini qaytaradi (Frontend shuni Product.image ga saqlaydi)
    res.status(200).json({ 
        success: true, 
        imageUrl: `/uploads/${req.file.filename}` 
    });
});

module.exports = router;