const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const User = require("../models/User");
const STANDARD_ROLE = require("./constants");
const dotenv = require("dotenv");
const authenticateToken = require("../middleware/authMiddleware");

dotenv.config();
const router = express.Router();
const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;

const joiSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Auth page" });
});

// Signup route /users/signup
router.post("/signup", async (req, res) => {
  try {
    const { error } = joiSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;

    // The passsword should never be saved as plain text
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      password: hashedPassword,
      role: STANDARD_ROLE,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", userId: newUser._id });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating the user", error: error.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { error } = joiSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "1h",
    });

    const filter = { email: user.email };
    const update = {
      $set: {
        token: token,
      },
    };

    await User.findOneAndUpdate(filter, update, {
      upsert: true,
      new: true,
    });

    res.status(200).json({
      token: token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).send("Login error");
  }
});

// Logout route
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    const filter = { email: req.user.email };
    const update = { $set: { token: null } };

    await User.findOneAndUpdate(filter, update);

    res.status(204).end(); // Returnează statusul 204 No Content la succesul logout-ului
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Logout error", error: error.message });
  }
});

module.exports = router;
