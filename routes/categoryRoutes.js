const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware'); 
const categoryController = require('../controllers/categoryController');

// 1. Hamma kategoriyalar
router.get('/', categoryController.getAllCategories);

// 2. Yaratish
router.post('/', upload.single('image'), categoryController.createCategory);

router.put('/reorder/all', categoryController.reorderCategories);

// 4. O'zgartirish (Update)
router.put('/:id', upload.single('image'), categoryController.updateCategory);

// 5. O'chirish
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;