const express = require('express');
const router = express.Router();
const { upload, uploadFile } = require('../controllers/uploadController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload une image (Admin uniquement)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploadée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Admin requis
 */
router.post('/', verifyToken, requireAdmin, upload.single('file'), uploadFile);

module.exports = router;
