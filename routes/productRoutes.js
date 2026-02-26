const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');

// --- MULTER SOZLAMASI (Rasm yuklash uchun) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Rasmlar 'uploads' papkasiga tushadi
    },
    filename: (req, file, cb) => {
        // Rasm nomini unikal qilamiz: vaqt + original nom
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });


// --- YO'LLAR ---

// 1. Tovar qo'shish (Admin) - 'images' nomi bilan 5 tagacha rasm yuklash mumkin
router.post('/add', upload.array('images', 5), productController.createProduct);

// 2. Hamma tovarlar (User)
router.get('/', productController.getAllProducts);

// 3. Bitta tovar
router.get('/:id', productController.getProductById);

// 4. O'chirish (Admin)
router.delete('/:id', productController.deleteProduct);
router.put('/:id', upload.array('images', 5), productController.updateProduct);

module.exports = router;