const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');

// User xabar yuborishi
router.post('/message', supportController.sendMessage);

// Admin javob yozishi
router.post('/reply', supportController.replyMessage);

// Admin chatlarni ko'rishi
router.get('/', supportController.getAllChats);

module.exports = router;