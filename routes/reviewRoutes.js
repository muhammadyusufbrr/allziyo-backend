const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware'); // <--- Soqchi

router.post('/', upload.single('image'), reviewController.createReview); // User rasm yuklaydi (Ochiq)

// Admin tasdiqlaydi
router.put('/:id/decide', protect, reviewController.decideReview); // <--- Qulflandi 🔒
router.get('/pending', protect, reviewController.getPendingReviews); // <--- Qulflandi 🔒

module.exports = router;