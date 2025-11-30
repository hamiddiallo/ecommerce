const express = require('express');
const router = express.Router();
const {
    getFavorites,
    addFavorite,
    removeFavorite,
    checkFavorite
} = require('../controllers/favoritesController');

// Get user's favorites
router.get('/', getFavorites);

// Check if product is favorited
router.get('/check', checkFavorite);

// Add to favorites
router.post('/', addFavorite);

// Remove from favorites
router.delete('/', removeFavorite);

module.exports = router;
