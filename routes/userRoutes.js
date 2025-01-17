const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getCurrentUser } = require('../controllers/usersController');
const router = express.Router();

router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;