const multer = require('multer');
const path = require('path');

// Configuration de stockage pour Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

function uploadFile(req, res) {
    if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier reçu' });
    }

    // Retourner le chemin relatif pour l'accès public
    // Assurez-vous que votre frontend est configuré pour accéder à ces fichiers via l'URL du backend
    const filePath = `/uploads/${req.file.filename}`;
    res.json({ filePath });
}

module.exports = {
    upload,
    uploadFile
};
