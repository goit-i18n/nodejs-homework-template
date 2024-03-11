const express = require("express");
const router = express.Router();
const usersController = require("../../controller/authController");

router.post("/signup", usersController.signup);

router.post("/login", usersController.login);
// router.get("/users/logout", async (req, res, next) => {});
module.exports = router;
