const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoriesController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Cache middleware
const cache = (req, res, next) => {
    res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    next();
};

// Public route
router.get('/', cache, getCategories);

// Admin-only routes
router.post('/', verifyToken, requireAdmin, createCategory);
router.put('/:id', verifyToken, requireAdmin, updateCategory);
router.delete('/:id', verifyToken, requireAdmin, deleteCategory);

module.exports = router;
