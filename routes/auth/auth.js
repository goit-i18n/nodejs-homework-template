const express = require('express');
const router = express.Router();
const User = require('../../service/usersSchema');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const authMiddleware = require('../../middlewares/authMiddleware');

router.post('/signup', async (req, res) => {
    const { email, password, subscription } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        return res.status(409).json({
            status: "error",
            code: 409,
            message: "Email already in use",
            data: "Conflict",
        });
    }

    try {
        const newUser = new User({ email, password, subscription });
        await newUser.setPassword(password);
        await newUser.save();

        res.status(201).json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.isValidPassword(password))) {
        return res.status(400).json({
            status: "error",
            code: 400,
            message: "Incorrect email or password",
            data: {
                message: "Bad Request",
            },
        });
    }

    const payload = {
        id: user._id,
        username: user.username,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    user.token = token;
    await user.save();

    res.json({
        status: "success",
        code: 200,
        data: {
            token,
        },
    });
});

router.get('/logout', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(401).json({
            status: "error",
            code: 401,
            message: "Not authorized",
        });
    }

    user.token = null;
    await user.save();

    return res.status(204).send();
});

router.get('/current', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(401).json({
            status: "error",
            code: 401,
            message: "Not authorized",
        });
    }

    return res.status(200).json({
        status: "success",
        code: 200,
        data: {
            email: user.email,
            subscription: user.subscription,
        },
    });
});

module.exports = router;
