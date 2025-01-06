const fs = require('fs/promises');
const path = require('path');
const jimp = require('jimp');
const User = require('../../models/user');

const avatarsDir = path.join(__dirname, '../../public/avatars');

const updateAvatar = async (req, res, next) => {
  try {
    const { path: tempPath, originalname } = req.file;
    const { _id } = req.user;

    const extension = originalname.split('.').pop();
    const fileName = `${_id}.${extension}`;
    const finalPath = path.join(avatarsDir, fileName);

    // Redimensionare avatar
    const image = await jimp.read(tempPath);
    await image.resize(250, 250).writeAsync(tempPath);

    // Mutare în folderul public
    await fs.rename(tempPath, finalPath);

    const avatarURL = `/avatars/${fileName}`;
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

module.exports = updateAvatar;