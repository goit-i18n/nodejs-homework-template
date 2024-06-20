// controller/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import User from "../models/user.js";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import jimp from "jimp";

dotenv.config();
const secretForToken = process.env.TOKEN_SECRET;

const authController = {
	signup: async (req, res, next) => {
		const { email, password } = req.body;
		try {
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				return res.status(409).json({ message: "Email in use" });
			}

			const hashedPassword = await bcrypt.hash(password, 10);
			const avatarURL = gravatar.url(email, {
				s: "250",
				r: "pg",
				d: "identicon",
			});
			const newUser = new User({
				email,
				password,
				avatarURL,
			});
			await newUser.save();
			res.status(201).json({
				user: {
					email: newUser.email,
					subscription: newUser.subscription,
					avatarURL: newUser.avatarURL,
				},
			});
		} catch (error) {
			next(error);
		}
	},

	login: async (req, res, next) => {
		const { email, password } = req.body;
		try {
			const user = await User.findOne({ email });
			if (!user) {
				return res.status(401).json({ message: "Email or password is wrong" });
			}

			const isPasswordValid = await bcrypt.compare(password, user.password);
			if (!isPasswordValid) {
				return res.status(401).json({ message: "Email or password is wrong" });
			}

			const token = jwt.sign({ id: user._id }, secretForToken, {
				expiresIn: "1h",
			});
			user.token = token;
			await user.save();

			res.status(200).json({
				token,
				user: { email: user.email, subscription: user.subscription },
			});
		} catch (error) {
			next(error);
		}
	},

	logout: async (req, res, next) => {
		try {
			const user = req.user;
			user.token = null;
			await user.save();

			res.status(204).send();
		} catch (error) {
			next(error);
		}
	},

	getCurrentUser: async (req, res, next) => {
		try {
			const user = req.user;

			res
				.status(200)
				.json({ email: user.email, subscription: user.subscription });
		} catch (error) {
			next(error);
		}
	},

	updateAvatar: async (req, res, next) => {
		const { path: tempPath, originalname } = req.file;
		const { _id: userId } = req.user;

		try {
			const avatar = await jimp.read(tempPath);
			await avatar.resize(250, 250).writeAsync(tempPath);

			const avatarName = `${userId}_${originalname}`;
			const resultPath = path.join("public", "avatars", avatarName);
			await fs.rename(tempPath, resultPath);

			const avatarURL = `/avatars/${avatarName}`;
			await User.findByIdAndUpdate(userId, { avatarURL });

			res.json({ avatarURL });
		} catch (error) {
			await fs.unlink(tempPath);
			next(error);
		}
	},
};

export default authController;
