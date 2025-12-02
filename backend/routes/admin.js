const express = require('express');
const router = express.Router();
const { getStats, getOrderItems } = require('../controllers/adminController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(verifyToken);
router.use(requireAdmin);

router.get('/stats', getStats);
router.get('/order-items', getOrderItems);

module.exports = router;
