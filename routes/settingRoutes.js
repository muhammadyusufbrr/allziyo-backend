const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', settingController.getPromos); // Bot o'qiydi (Ochiq)
router.put('/', protect, settingController.updatePromos); // Admin o'zgartiradi (Qulf 🔒)

module.exports = router;