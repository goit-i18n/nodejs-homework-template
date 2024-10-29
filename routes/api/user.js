const express = require('express');
const { updateAvatar } = require('../../controllers/userController');
const auth = require('../../middlewares/authMiddleware');
const upload = require('../../middlewares/uploadConfig');

const router = express.Router();

// Ruta pentru actualizarea avatarului
router.patch('/avatars', auth, upload.single('avatar'), updateAvatar);

module.exports = router; // Exportă router-ul
