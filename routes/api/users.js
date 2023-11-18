const express = require("express");
const router = express.Router();

const {
  getAll,
  getUsersController,
  createUserController,
  loginUserController,
  updateUserController,
  logoutUserController,
} = require("../../controllers/index");

router.get("/users", getUsersController);
router.post("/users/signup", createUserController);
router.post("/users/login", loginUserController);
router.get("/users/logout", logoutUserController);
router.patch("/users/:userId", updateUserController);
router.get("/contacts", getAll);

module.exports = router;
