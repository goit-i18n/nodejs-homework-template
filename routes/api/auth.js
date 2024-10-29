// routes/api/auth.js
const express = require('express');
const { register, login } = require('../../controllers/authController');
const router = express.Router();

// Ruta pentru înregistrare
router.post('/register', register);

// Ruta pentru autentificare
router.post('/login', login);

module.exports = router;
