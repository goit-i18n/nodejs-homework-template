const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const { id } = jwt.verify(token, 'secret-key'); 
    const user = await User.findById(id);

    if (!user || user.token !== token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = auth;