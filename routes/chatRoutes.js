const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');


router.post('/send', protect, chatController.sendReply);     
router.get('/users', protect, chatController.getChatUsers);  
router.get('/:userId', protect, chatController.getMessages); 
router.post('/receive-from-bot', chatController.receiveMessage);
router.get('/image/:fileId', chatController.getTelegramImage);
router.put('/read/:userId', protect, chatController.markAsRead);

module.exports = router;