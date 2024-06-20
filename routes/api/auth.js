// routes/api/auth.js
import express from "express";
import authController from "../../controller/authController.js";
import authMiddleware from "../../middleware/auth.js";
import upload from "../../middleware/upload.js";

const authRouter = express.Router();

authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);
authRouter.get("/logout", authMiddleware, authController.logout);
authRouter.get("/current", authMiddleware, authController.getCurrentUser);
authRouter.patch(
	"/avatars",
	authMiddleware,
	upload.single("avatar"),
	authController.updateAvatar
);

export default authRouter;
