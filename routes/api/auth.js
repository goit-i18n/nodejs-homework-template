import express from "express";
import User from "../../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authMiddleware from "../../middleware/auth.js";

dotenv.config();

const authRouter = express.Router();
const secretForToken = process.env.TOKEN_SECRET;

authRouter.post("/signup", async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validate email and password
		if (!email || !password) {
			return res.status(400).json({
				message: "Eroare de la librăria Joi sau o altă librărie de validare",
			});
		}

		// Check if the email is already in use
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(409).json({ message: "Email in use" });
		}

		// Create a new user
		const newUser = new User({ email, password });
		await newUser.save();

		// Return the response
		res.status(201).json({
			user: {
				email: newUser.email,
				subscription: newUser.subscription,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: `Server error: ${error.message}` });
	}
});

authRouter.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validate email and password
		if (!email || !password) {
			return res.status(400).json({
				message:
					"Eroare de la librăria Joi sau o altă librărie de validareEroare de la librăria Joi sau o altă librărie de validare",
			});
		}

		// Find the user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: "Email or password is wrong" });
		}

		// Compare the password
		const isPasswordValid = await user.comparePassword(password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Email or password is wrong" });
		}

		// Create a token
		const token = jwt.sign({ id: user._id }, secretForToken, {
			expiresIn: "1h",
		});
		user.token = token;
		await user.save();

		// Return the response
		res.status(200).json({
			token,
			user: {
				email: user.email,
				subscription: user.subscription,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: `Server error: ${error.message}` });
	}
});

authRouter.get("/logout", authMiddleware, async (req, res) => {
	try {
		const user = req.user;
		user.token = null;
		await user.save();

		res.status(204).send();
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: `Server error: ${error.message}` });
	}
});

authRouter.get("/current", authMiddleware, async (req, res) => {
	try {
		const user = req.user;

		res.status(200).json({
			email: user.email,
			subscription: user.subscription,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: `Server error: ${error.message}` });
	}
});

export default authRouter;
