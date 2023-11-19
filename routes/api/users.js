const express = require("express");
const router = express.Router();
const { auth } = require("../../middleware/authenticate");

const {
  getAll,
  getUsersController,
  createUserController,
  loginUserController,
  updateUserController,
  logoutUserController,
} = require("../../controllers/index");

router.get("/users", auth, getUsersController);
router.post("/users/signup", createUserController);
router.post("/users/login", loginUserController);
router.get("/users/logout", auth, logoutUserController);
router.patch("/users/:userId", auth, updateUserController);
router.get("/contacts", auth, getAll);

module.exports = router;
