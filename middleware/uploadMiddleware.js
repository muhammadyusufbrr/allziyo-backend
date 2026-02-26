const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `image-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Faqat rasm yuklashga ruxsat berish
const checkFileType = (file, cb) => {
    console.log("Multer tekshiruvidagi fayl:", {
        name: file.originalname,
        type: file.mimetype
    });

    const filetypes = /jpeg|jpg|png|webp|gif/i;
    
    // 2. TEKSHIRAMIZ
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        // Xatolikni qaytaramiz
        cb(new Error('Faqat rasm (jpg, jpeg, png, webp) yuklash mumkin! Kelgan fayl: ' + file.mimetype));
    }
};

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
    limits: { fileSize: 10 * 1024 * 1024 } 
});

module.exports = upload;