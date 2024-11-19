import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extrage token-ul
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifică token-ul

    const user = await User.findById(decoded.id);
    if (!user || user.token !== token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user; // Adaugă utilizatorul la req
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};

export default auth;
