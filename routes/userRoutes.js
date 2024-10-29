const express = require('express');
const { uploadAvatar } = require('../controllers/userController'); 
const auth = require('../middlewares/authMiddleware'); 
const upload = require('../middlewares/uploadConfig'); 
const router = express.Router();


router.patch('/avatars', auth, upload.single('avatar'), uploadAvatar);

module.exports = router; 
