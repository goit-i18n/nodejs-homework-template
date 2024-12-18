const express = require("express");
const { signup } = require("../controllers/authController");

const router = express.Router();

// Endpoint-ul pentru înregistrare
router.post("/signup", signup);

module.exports = router;

const { login } = require("../controllers/authController");

// Endpoint-ul pentru logare
router.post("/login", login);