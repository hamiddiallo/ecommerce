const express = require('express');
const router = express.Router();
const { getStats, getOrderItems } = require('../controllers/adminController');

router.get('/stats', getStats);
router.get('/order-items', getOrderItems);

module.exports = router;
