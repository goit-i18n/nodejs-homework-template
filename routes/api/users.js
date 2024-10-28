const express = require('express');
<<<<<<< Updated upstream
const multer = require('multer');
const jimp = require('jimp');
const path = require('path');
const User = require('../../models/userModel'); 
const { authenticate } = require('../../middlewares/authMiddleware'); 

const router = express.Router();

// Configurarea storage pentru multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'tmp'); // folderul temporar
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Ruta pentru actualizarea avatarului
router.patch('/avatars', authenticate, upload.single('file'), async (req, res) => {
    try {
        const avatarPath = path.join(__dirname, '../../tmp', req.file.filename);
        const image = await jimp.read(avatarPath);
        image.resize(250, 250);
        const avatarName = `avatar-${req.user.id}${path.extname(req.file.originalname)}`;
        const publicPath = path.join(__dirname, '../../public/avatars', avatarName);

        await image.write(publicPath);

        const avatarURL = `/avatars/${avatarName}`;
        await User.findByIdAndUpdate(req.user.id, { avatarURL });

        res.status(200).json({ avatarURL });
    } catch (error) {
        res.status(500).json({ message: 'Error processing image', error });
    }
});
=======
const { registerUser, updateUserAvatar } = require('../../controllers/userController');
const authMiddleware = require('../../middlewares/auth');
const upload = require('../../middlewares/uploadMiddleware');

const router = express.Router();

router.post('/register', registerUser); 
router.patch('/avatars', authMiddleware, upload.single('avatar'), updateUserAvatar);
>>>>>>> Stashed changes

module.exports = router;
