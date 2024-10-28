const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized' });
    }
};

module.exports = { authenticate };
