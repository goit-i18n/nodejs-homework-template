const express = require("express");
const router = express.Router();
const usersController = require("../../controller/authController");

const auth = require("../../auth/authMiddleware");

router.post("/signup", auth, usersController.signup);

router.post("/login", auth, usersController.login);
router.get("/users/logout", auth, usersController.logout);
module.exports = router;
