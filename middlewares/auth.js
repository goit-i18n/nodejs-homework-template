const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';

  
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or malformed token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.token !== token) {
      return res.status(401).json({ message: 'Token mismatch' });
    }

    req.user = user;
    next();
  } catch (error) {
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }

    console.error('Authorization error:', error.message);

    return res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = { authMiddleware };