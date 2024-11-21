const express = require('express');
const router = express.Router();
const { register, login } = require('../../controllers/authController'); // Asigură-te că folosești controller-ul corect

router.post('/register', register);
router.post('/login', login);

module.exports = router;
