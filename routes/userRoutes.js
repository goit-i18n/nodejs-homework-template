const express = require('express');
const { uploadAvatar } = require('../controllers/userController'); // Asigură-te că ai un controller corespunzător
const auth = require('../middlewares/authMiddleware'); // Middleware pentru autentificare
const upload = require('../middlewares/uploadConfig'); // Configurația multer

const router = express.Router();

// Ruta pentru actualizarea avatarului
router.patch('/avatars', auth, upload.single('avatar'), uploadAvatar);

module.exports = router; // Exportă router-ul
