const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error); 
        res.status(401).json({ message: 'Not authorized' });
    }
};