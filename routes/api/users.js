import express from "express";
import Joi from "joi";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/user.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

router.post("/signup", async (req, res) => {
  try {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = value;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = value;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ id: user._id }, "secret_key", { expiresIn: "1h" });
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
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

router.get("/logout", auth, async (req, res) => {
  try {
    req.user.token = null;
    await req.user.save();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

router.get("/current", auth, (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
});

export default router;
