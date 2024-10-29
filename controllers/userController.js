const User = require('../models/usermodel'); 

const updateAvatar = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const avatarURL = `/avatars/${req.file.filename}`;

    try {
        await User.findByIdAndUpdate(req.user.id, { avatar: avatarURL });
        return res.status(200).json({ avatarURL });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating avatar', error });
    }
};

module.exports = { updateAvatar };
