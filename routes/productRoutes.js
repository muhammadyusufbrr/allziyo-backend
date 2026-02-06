const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware'); // Himoya (Login talab qilinadi)

// --- OCHIQ YO'LLAR (Hamma uchun) ---
router.get('/', productController.getAllProducts);       // Hamma mahsulotlar
router.get('/:id', productController.getProductById);    // Bitta mahsulot (Batafsil ko'rish uchun)

// --- YOPIQ YO'LLAR (Faqat Admin Token bilan) ---
router.post('/', protect, productController.createProduct);      // Qo'shish
router.put('/:id', protect, productController.updateProduct);    // Tahrirlash (UPDATE)
router.delete('/:id', protect, productController.deleteProduct); // O'chirish

module.exports = router;