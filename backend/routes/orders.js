const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus, cancelOrder, unlockOrder } = require('../controllers/ordersController');

router.post('/', createOrder);
router.get('/', getOrders);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/unlock', unlockOrder);

module.exports = router;
