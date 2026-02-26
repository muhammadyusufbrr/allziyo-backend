const express = require('express');
const router = express.Router();
const { getAllOrders, getOrderById, updateOrderStatus, createOrder } = require('../controllers/orderController');

router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);
router.post('/', createOrder);
module.exports = router;