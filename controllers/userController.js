const User = require('../models/userModel');
const gravatar = require('gravatar');
const fs = require('fs').promises;
const path = require('path');
const Jimp = require('jimp');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const avatarsDir = path.join(__dirname, '../public/avatars');

exports.registerUser = async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
    }

    const avatarURL = gravatar.url(email, { s: '250' }, true); 
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await User.create({ email, password: hashedPassword, avatarURL });
    res.status(201).json({ email: newUser.email, avatarURL: newUser.avatarURL });
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, avatarURL: user.avatarURL });
};

exports.updateUserAvatar = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const { path: tempPath, filename } = req.file;
    const avatarPath = path.join(avatarsDir, filename);

    const avatarImage = await Jimp.read(tempPath);
    await avatarImage.resize(250, 250).writeAsync(avatarPath);
    await fs.unlink(tempPath);

    const avatarURL = `/avatars/${filename}`;
    await User.findByIdAndUpdate(req.user._id, { avatar: avatarURL });

    res.status(200).json({ avatarURL });
};
