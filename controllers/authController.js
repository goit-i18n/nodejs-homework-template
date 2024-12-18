const User = require("../models/user");
const Joi = require("joi");

const signupValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const signup = async (req, res) => {
  try {
    // Validarea datelor primite
    const { email, password } = await signupValidationSchema.validateAsync(req.body);

    // Verificarea dacă utilizatorul există deja
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    // Crearea unui nou utilizator
    const newUser = await User.create({ email, password });
    return res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup };

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../config");

const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const login = async (req, res) => {
  try {
    // Validarea datelor primite
    const { email, password } = await loginValidationSchema.validateAsync(req.body);

    // Verificarea existenței utilizatorului
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    // Verificarea parolei
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    // Generarea token-ului JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    // Salvarea token-ului în baza de date
    user.token = token;
    await user.save();

    return res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup, login };