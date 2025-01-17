const express = require('express');
const { validateBody, userRegistrationSchema, userLoginSchema } = require('../middlewares/validationMiddleware');
const { register, login } = require('../controllers/authController');
const router = express.Router();

router.post('/register', validateBody(userRegistrationSchema), register);
router.post('/login', validateBody(userLoginSchema), login);

module.exports = router;