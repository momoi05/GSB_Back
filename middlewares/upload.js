const multer = require('multer')
const storage = multer.memoryStorage();


// Upload method that stores image files (et éventuellement PDF) et limite la taille à 5MB
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1025 // 5MB max file size
    },

    fileFilter: (req, file, cb) => {
        // Accepter uniquement les images OU les PDF
        // plus robuste : se baser sur le mimetype plutôt que le nom de fichier
        if (
            !file.mimetype.startsWith('image/') && // toutes les images
            file.mimetype !== 'application/pdf'     // et les PDF
        ) {
            return cb(new Error('Only image or PDF files are allowed!'), false);
        }
        cb(null, true);
    }
});

module.exports = upload;