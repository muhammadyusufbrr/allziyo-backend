const multer = require('multer');
const path = require('path');

// Rasmni qayerga saqlash va nomini o'zgartirish
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/'); // Rasmlar shu papkaga tushadi
    },
    filename(req, file, cb) {
        // Fayl nomi: image-vaqt-originalnom.jpg (bir xil nom bo'lib qolmasligi uchun)
        cb(null, `image-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Faqat rasm yuklashga ruxsat berish
const checkFileType = (file, cb) => {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Faqat rasm (jpg, jpeg, png) yuklash mumkin!');
    }
};

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = upload;