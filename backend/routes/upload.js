const express = require('express');
const router = express.Router();
const { upload, uploadFile } = require('../controllers/uploadController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Admin-only route
router.post('/', verifyToken, requireAdmin, upload.single('file'), uploadFile);

module.exports = router;
