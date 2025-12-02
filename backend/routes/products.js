const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productsController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Cache middleware
const cache = (req, res, next) => {
    res.set('Cache-Control', 'public, max-age=60'); // Cache for 60 seconds
    next();
};

// Public routes
router.get('/', cache, getProducts);
router.get('/:id', cache, getProductById);

// Admin-only routes
router.post('/', verifyToken, requireAdmin, createProduct);
router.put('/:id', verifyToken, requireAdmin, updateProduct);
router.delete('/:id', verifyToken, requireAdmin, deleteProduct);

module.exports = router;
