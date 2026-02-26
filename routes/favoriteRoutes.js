const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

router.post('/toggle', favoriteController.toggleFavorite); // Qo'shish/O'chirish
router.get('/:telegramId', favoriteController.getFavorites); // Ro'yxatni olish

module.exports = router;