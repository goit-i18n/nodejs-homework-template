import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();

const authController = {
	login,
	validateJWT,
};

const secretForToken = process.env.TOKEN_SECRET;

if (!secretForToken) {
	throw new Error("TOKEN_SECRET is not defined in the environment variables");
}

async function login(data) {
	const { username, password } = data;

	// Find the user by username
	const user = await User.findOne({ username });
	if (!user) {
		throw new Error("The username or password entered is not correct");
	}

	// Compare the provided password with the stored hashed password
	const isPasswordValid = await user.comparePassword(password);
	if (!isPasswordValid) {
		throw new Error("The username or password entered is not correct");
	}

	const token = jwt.sign(
		{
			data: {
				username: user.username,
				name: user.name,
			},
		},
		secretForToken,
		{ expiresIn: "1h" }
	);

	return token;
}

function validateJWT(token) {
	try {
		jwt.verify(token, secretForToken);
		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
}

export default authController;
