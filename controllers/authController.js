const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { sendVerificationEmail } = require('../service/emailService');

const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists. Please log in.' });
        }

        const verificationToken = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            verificationToken,
            verify: false
        });

        await newUser.save();
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: 'User registered successfully. Verification email sent.' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).lean();
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.verify) {
            return res.status(401).json({ message: 'Account is unverified. Please check your email.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, userId: user._id });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;

    try {
        const user = await User.findOne({ verificationToken }).lean();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.verify = true;
        user.verificationToken = null;
        await user.save();

        res.status(200).json({ message: 'Verification successful' });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const resendVerification = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Missing required field email' });
    }

    try {
        const user = await User.findOne({ email }).lean();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.verify) {
            return res.status(400).json({ message: 'Verification has already been completed' });
        }

        user.verificationToken = uuidv4();
        await user.save();
        await sendVerificationEmail(email, user.verificationToken);

        res.status(200).json({ message: 'Verification email sent' });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { register, login, verifyEmail, resendVerification };
