const express = require('express');
const router = express.Router();
const {
    getFavorites,
    addFavorite,
    removeFavorite,
    checkFavorite
} = require('../controllers/favoritesController');
const { verifyToken } = require('../middleware/auth');

// All favorites routes require authentication
router.use(verifyToken);

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Récupérer les favoris de l'utilisateur
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des favoris
 *       401:
 *         description: Non authentifié
 */
router.get('/', getFavorites);

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Ajouter un produit aux favoris
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productId
 *             properties:
 *               userId:
 *                 type: string
 *               productId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Produit ajouté aux favoris
 *       401:
 *         description: Non authentifié
 */
router.post('/', addFavorite);

/**
 * @swagger
 * /api/favorites:
 *   delete:
 *     summary: Retirer un produit des favoris
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produit retiré des favoris
 *       401:
 *         description: Non authentifié
 */
router.delete('/', removeFavorite);

/**
 * @swagger
 * /api/favorites/check:
 *   get:
 *     summary: Vérifier si un produit est dans les favoris
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statut du favori
 *       401:
 *         description: Non authentifié
 */
router.get('/check', checkFavorite);

module.exports = router;
