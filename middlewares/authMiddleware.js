const jwt = require("jsonwebtoken");

const User = require("../models/users.js");

const JWT_SECRET = process.env.JWT_SECRET || "secret_key_for_jwt";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1];

  if (!authHeader) {
    return res.status(401).json({ message: "Token not provided" });
  }

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);

    if (!user || user.token !== token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = authMiddleware;
