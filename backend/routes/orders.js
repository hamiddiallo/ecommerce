const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus, cancelOrder, unlockOrder } = require('../controllers/ordersController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Créer une nouvelle commande
 *     tags: [Orders]
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
 *               - items
 *               - totalAmount
 *               - fullName
 *               - phone
 *               - shippingAddress
 *               - city
 *             properties:
 *               userId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *               totalAmount:
 *                 type: number
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               shippingAddress:
 *                 type: string
 *               city:
 *                 type: string
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *       401:
 *         description: Non authentifié
 */
router.post('/', verifyToken, createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Récupérer les commandes de l'utilisateur
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, pending, confirmed, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Liste des commandes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Non authentifié
 */
router.get('/', verifyToken, getOrders);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   put:
 *     summary: Annuler une commande
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Commande annulée
 *       401:
 *         description: Non authentifié
 */
router.put('/:id/cancel', verifyToken, cancelOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Mettre à jour le statut d'une commande (Admin uniquement)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Admin requis
 */
router.put('/:id/status', verifyToken, requireAdmin, updateOrderStatus);

/**
 * @swagger
 * /api/orders/{id}/unlock:
 *   put:
 *     summary: Déverrouiller une commande (Admin uniquement)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Commande déverrouillée
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Admin requis
 */
router.put('/:id/unlock', verifyToken, unlockOrder);

module.exports = router;
