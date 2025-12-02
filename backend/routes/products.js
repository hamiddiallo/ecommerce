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

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Récupérer la liste des produits
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre de produits par page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche par nom de produit
 *     responses:
 *       200:
 *         description: Liste des produits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', cache, getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Récupérer un produit par son ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Détails du produit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produit non trouvé
 */
router.get('/:id', cache, getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Créer un nouveau produit (Admin uniquement)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - unit
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               unit:
 *                 type: string
 *               stock:
 *                 type: integer
 *               category_id:
 *                 type: string
 *               image_url:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Admin requis
 */
router.post('/', verifyToken, requireAdmin, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Mettre à jour un produit (Admin uniquement)
 *     tags: [Products]
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
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Produit mis à jour
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Admin requis
 */
router.put('/:id', verifyToken, requireAdmin, updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Supprimer un produit (Admin uniquement)
 *     tags: [Products]
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
 *         description: Produit supprimé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Admin requis
 */
router.delete('/:id', verifyToken, requireAdmin, deleteProduct);

module.exports = router;
