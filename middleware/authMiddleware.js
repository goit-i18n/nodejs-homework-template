const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protectRoute = (req, res, next) => {
  const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1]; // Extracting the token

  if (!token) {
    return res.status(401).send("🚫 Access Denied: No token provided!");
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("🚫 Invalid token.");
  }
};

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verifică validitatea token-ului
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Găsește utilizatorul în baza de date pe baza ID-ului din token
    const user = await User.findByUserId(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Pasează token-ul decodat către rutele ulterioare
    req.token = token;
    req.user = user; // Adaugă utilizatorul în obiectul de request pentru utilizarea ulterioară în rute
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { protectRoute, authenticateToken };
