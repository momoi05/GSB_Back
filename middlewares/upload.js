const multer = require('multer')
const storage = multer.memoryStorage();


// Upload method that stores image files (et éventuellement PDF) et limite la taille à 5MB
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1025 // 5MB max file size
    },

    fileFilter: (req, file, cb) => {
        // LOGS : informations détaillées sur le fichier reçu
        console.log('[UPLOAD] Nouveau fichier reçu', {
            route: req.originalUrl,
            method: req.method,
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype,
        });

        // Accepter uniquement les images OU les PDF
        // plus robuste : se baser sur le mimetype plutôt que le nom de fichier
        const isImage = file.mimetype.startsWith('image/');
        const isPdf = file.mimetype === 'application/pdf';

        if (!isImage && !isPdf) {
            console.error('[UPLOAD] Fichier refusé (type non autorisé)', {
                originalname: file.originalname,
                mimetype: file.mimetype,
            });
            return cb(new Error('Only image or PDF files are allowed!'), false);
        }

        console.log('[UPLOAD] Fichier accepté par le fileFilter');
        cb(null, true);
    }
});

module.exports = upload;