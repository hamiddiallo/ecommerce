const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus, cancelOrder, unlockOrder } = require('../controllers/ordersController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// User routes - require authentication
router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getOrders);
router.put('/:id/cancel', verifyToken, cancelOrder);

// Admin routes - require admin role
router.put('/:id/status', verifyToken, requireAdmin, updateOrderStatus);
router.put('/:id/unlock', verifyToken, requireAdmin, unlockOrder);

module.exports = router;
