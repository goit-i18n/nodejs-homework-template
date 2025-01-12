const express = require("express");
const {
  register,
  login,
  logout,
  getCurrentUser,
  updateAvatar,
} = require("../../controllers/authController");
const authMiddleware = require("../../middlewares/authMiddleware");
const upload = require("../../middlewares/upload");

const authRouter = express.Router();

authRouter.post("/signup", register);
authRouter.post("/login", login);

authRouter.get("/logout", authMiddleware, logout);

authRouter.get("/currentuser", authMiddleware, getCurrentUser);

authRouter.patch("/avatars", authMiddleware, upload.single("avatar"), updateAvatar);

module.exports = authRouter;
