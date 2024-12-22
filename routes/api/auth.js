const express = require("express");
const {
  register,
  login,
  logout,
  getCurrentUser,
} = require("../../controllers/authController");
const authMiddleware = require("../../middlewares/authMiddleware");

const authRouter = express.Router();

authRouter.post("/signup", register);
authRouter.post("/login", login);

authRouter.get("/logout", authMiddleware, logout);

authRouter.get("/currentuser", authMiddleware, getCurrentUser);

module.exports = authRouter;
