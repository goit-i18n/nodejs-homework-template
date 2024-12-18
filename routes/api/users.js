const express = require('express');
const { registerUser, loginUser, logoutUser, getCurrentUser, updateSubscription } = require('../controllers/users');
const { authMiddleware } = require('../middlewares/auth');
const router = express.Router();

// Routes
router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/logout', authMiddleware, logoutUser);
router.get('/current', authMiddleware, getCurrentUser);
router.patch('/', authMiddleware, updateSubscription);

module.exports = router;