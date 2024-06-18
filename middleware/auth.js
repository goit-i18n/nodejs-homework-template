import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();
const secretForToken = process.env.TOKEN_SECRET;

const authMiddleware = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			return res.status(401).json({ message: "Not authorized" });
		}

		const token = authHeader.replace("Bearer ", "");
		const decoded = jwt.verify(token, secretForToken);

		const user = await User.findById(decoded.id);
		if (!user || user.token !== token) {
			return res.status(401).json({ message: "Not authorized" });
		}

		req.user = user;
		next();
	} catch (error) {
		console.error(error);
		res.status(401).json({ message: "Not authorized" });
	}
};

export default authMiddleware;
