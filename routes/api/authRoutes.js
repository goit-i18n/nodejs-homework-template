const express = require("express");
const router = express.Router();
const usersController = require("../../controller/authController");
const auth = require("../../auth/authMiddleware");

router.post("/signup", usersController.signup);
router.post("/login", usersController.login);
router.get("/logout", auth, usersController.logout);
module.exports = router;
