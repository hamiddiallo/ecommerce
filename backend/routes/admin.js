const express = require('express');
const router = express.Router();
const { getStats, getOrderItems } = require('../controllers/adminController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(verifyToken);
router.use(requireAdmin);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Récupérer les statistiques du dashboard admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques du dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalOrders:
 *                   type: integer
 *                 totalRevenue:
 *                   type: number
 *                 totalProducts:
 *                   type: integer
 *                 totalUsers:
 *                   type: integer
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Admin requis
 */
router.get('/stats', getStats);

/**
 * @swagger
 * /api/admin/order-items:
 *   get:
 *     summary: Récupérer tous les articles commandés (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des articles commandés
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Admin requis
 */
router.get('/order-items', getOrderItems);

module.exports = router;
