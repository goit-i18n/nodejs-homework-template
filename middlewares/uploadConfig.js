// middlewares/uploadConfig.js
const multer = require('multer');
const path = require('path');

// Configurarea pentru `multer` pentru a stoca fișiere în folderul tmp/avatars
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../tmp/avatars')); // Folderul `tmp/avatars`
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Nume unic pentru fiecare fișier
    }
});

// Inițializează `multer` cu configurația de storage
const upload = multer({ storage });

module.exports = upload;
