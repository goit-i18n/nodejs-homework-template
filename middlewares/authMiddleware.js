const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = async (req, res, next) => {
    console.log('Auth middleware called'); // Log pentru debugging
    
    // Obține tokenul din header
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verifică și decodează tokenul
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Găsește utilizatorul în baza de date
        req.user = await User.findById(decoded.id).select('-password'); // Exclude parola

        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        
        // Continuă spre următorul middleware/rută
        next();
    } catch (error) {
        console.error('Error in auth middleware:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = auth;
