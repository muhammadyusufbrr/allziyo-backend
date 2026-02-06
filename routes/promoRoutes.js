const express = require('express');
const router = express.Router();
const promoController = require('../controllers/promoController');

router.get('/', promoController.getPromocodes);
router.put('/:id', promoController.updatePromocode);

module.exports = router;