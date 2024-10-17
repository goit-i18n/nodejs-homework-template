import express from "express";
import User from "../../models/user.model.js";
import auth from "../../middlewares/auth.middleware.js";
import Joi from "joi";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

// Schema de validare pentru Joi
const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Endpoint pentru inregistrare
router.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validare date folosind Joi
    const { error } = signupSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Verificarebemail dc există deja în baza de date
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    // Creare nou utilizator
    const user = new User({ email, password });
    await user.save();

    return res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

// logica pentru autentificare:
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validare date
    const { error } = loginSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Găsește utilizatorul în baza de date
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    // Creează un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Salvează token-ul în utilizator
    user.token = token;
    await user.save();

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
});

//  logică pentru deconectare:
router.get("/logout", auth, async (req, res, next) => {
  try {
    const user = req.user;
    user.token = null;
    await user.save();
    res.status(204).json();
  } catch (error) {
    next(error);
  }
});
