import express from "express";
import authController from "../../controller/authController.js";
import authMiddleware from "../../middleware/auth.js";
import upload from "../../middleware/upload.js";
import User from "../../models/user.js";
import { STATUS_CODES } from "../../utils/errorHandling.js";

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
// Email verification route
authRouter.get("/verify/:verificationToken", async (req, res) => {
	const token = req.params.verificationToken;
	try {
		const user = await authController.getUserByValidationToken(token);
		if (user) {
			await User.findOneAndUpdate(
				{ verificationToken: token },
				{ verify: true, verificationToken: null } // Optionally clear the token
			);
			res.status(200).send({ message: "Verification successful" });
		} else {
			res.status(404).send({ message: "User not found" });
		}
	} catch (error) {
		respondWithError(res, error, STATUS_CODES.error);
	}
});

// Resend verification email route
authRouter.post("/verify", async (req, res) => {
	try {
		const email = req.body?.email;
		if (email) {
			await authController.updateToken(email);
			res.status(200).json({ message: "Verification email sent" });
		} else {
			res.status(400).json({ message: "The email field is required" });
		}
	} catch (error) {
		respondWithError(res, error, STATUS_CODES.error);
	}
});

export default authRouter;
