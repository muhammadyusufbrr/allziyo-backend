const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 1. Foydalanuvchini yaratish yoki yangilash (Botdan /start bosilganda)
// Manzil: POST /api/users
router.post('/', userController.createOrUpdateUser);

// 2. Kontaktni saqlash (Botga nomer yuborilganda)
// Manzil: POST /api/users/phone
router.post('/phone', userController.updatePhone);

// 3. Foydalanuvchi haqida ma'lumot olish
// Manzil: GET /api/users/12345678 (TelegramID)
router.get('/:telegramId', userController.getUser);


// 4. Karta raqamni qabul qilish
router.post('/card', userController.saveCardNumber); 



module.exports = router;