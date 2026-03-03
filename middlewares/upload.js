const multer = require('multer')
const storage = multer.memoryStorage();


// Upload method that stores image files only and limits file size to 5MB
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1025 // 5MB max file size
    },

    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

module.exports = upload;