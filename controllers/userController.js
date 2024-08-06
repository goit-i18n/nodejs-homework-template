const jimp = require('jimp');
const fs = require('fs').promises;
const path = require('path');
const User = require('../models/userModel');

exports.updateAvatar = async (req, res) => {
    try {
        console.log('File received:', req.file);  
        const { file } = req;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const image = await jimp.read(file.path);
        await image.resize(250, 250).writeAsync(file.path);

        const avatarsDir = path.join(__dirname, '..', '..', 'public', 'avatars');
        if (!await fs.stat(avatarsDir).then(() => true).catch(() => false)) {
            await fs.mkdir(avatarsDir, { recursive: true });
        }

        const avatarFilename = `${req.user._id}-${Date.now()}.jpg`;
        const avatarPath = path.join(avatarsDir, avatarFilename);

        await fs.rename(file.path, avatarPath);

        const avatarURL = `/public/avatars/${avatarFilename}`;
        req.user.avatarURL = avatarURL;
        await req.user.save();

        res.json({ avatarURL });
    } catch (error) {
        console.error('Error updating avatar:', error); 
        res.status(500).json({ message: error.message });
    }
};