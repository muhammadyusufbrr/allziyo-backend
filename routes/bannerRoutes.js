const express = require('express');
const router = express.Router();
const { getBanners, createBanner, updateBanner, deleteBanner,getBannerById, reorderBanners } = require('../controllers/bannerController');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getBanners);
router.post('/', upload.single('image'), createBanner);
router.put('/:id', upload.single('image'), updateBanner);
router.put('/reorder/all', reorderBanners);
router.delete('/:id', deleteBanner);
router.get('/:id', getBannerById);
module.exports = router;
