const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register); // Admin qo'shish uchun
router.post('/login', authController.login);       // Panelga kirish uchun

module.exports = router;