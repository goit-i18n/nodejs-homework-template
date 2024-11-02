import express from "express";
import User from "../../models/user.model.js";
import auth from "../../middlewares/auth.middleware.js";
import Joi from "joi";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../../emailService.js"; // Import the email service
import { v4 as uuidv4 } from "uuid"; // Import UUID for token generation

const router = express.Router();

// Validation schemas using Joi
const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Endpoint for user registration
router.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate the request body
    const { error } = signupSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    // Create a new user with a verification token
    const verificationToken = uuidv4(); // Generate a unique token
    const user = new User({
      email,
      password,
      verificationToken, // Save the verification token in the user model
      verify: false, // Set verify field to false initially
    });
    await user.save();

    // Send the verification email
    await sendVerificationEmail(email, verificationToken);

    return res.status(201).json({
      message: "User registered, verification email sent",
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Endpoint for email verification
router.get("/verify/:verificationToken", async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    // Find the user by the verification token
    const user = await User.findOne({ verificationToken });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's verification status and clear the verification token
    user.verify = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
});

// Endpoint for user login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate the request body
    const { error } = loginSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    // Check if the email is verified
    if (!user.verify) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Save the token in the user and respond with it
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

// Endpoint for logout
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

export default router;
