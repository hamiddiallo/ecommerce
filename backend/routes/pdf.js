const express = require('express');
const router = express.Router();
const { generateInvoicePDF } = require('../controllers/pdfController');
const { verifyToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/orders/{id}/pdf:
 *   get:
 *     summary: Generate and download PDF invoice for an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Commande non trouvée
 */
router.get('/:id/pdf', verifyToken, generateInvoicePDF);

module.exports = router;
