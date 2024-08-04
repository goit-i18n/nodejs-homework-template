const express = require('express');
const multer = require('multer');
const { updateAvatar } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const upload = multer({ dest: 'tmp/' });
const router = express.Router();

router.patch('/avatars', authMiddleware, upload.single('avatar'), updateAvatar);

module.exports = router;