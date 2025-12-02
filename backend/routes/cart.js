const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart } = require('../controllers/cartController');
const { verifyToken } = require('../middleware/auth');

// All cart routes require authentication
router.use(verifyToken);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Récupérer le panier de l'utilisateur
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Contenu du panier
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItem'
 *       401:
 *         description: Non authentifié
 */
router.get('/', getCart);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Ajouter un produit au panier
 *     tags: [Cart]
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
 *               - quantity
 *             properties:
 *               userId:
 *                 type: string
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Produit ajouté au panier
 *       401:
 *         description: Non authentifié
 */
router.post('/', addToCart);

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     summary: Mettre à jour la quantité d'un article du panier
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'article du panier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Quantité mise à jour
 *       401:
 *         description: Non authentifié
 */
router.put('/:id', updateCartItem);

/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: Supprimer un article du panier
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'article du panier
 *     responses:
 *       200:
 *         description: Article supprimé
 *       401:
 *         description: Non authentifié
 */
router.delete('/:id', removeFromCart);

module.exports = router;
