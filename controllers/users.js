const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your_secret_key'; 

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email or password is wrong' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Email or password is wrong' });
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
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
    res.status(400).json({ message: error.message });
  }
};

const logoutUser = async (req, res) => {
  const user = req.user;
  user.token = undefined; 
  await user.save();
  res.status(204).send();
};

const getCurrentUser = (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};

const updateSubscription = async (req, res) => {
  const { subscription } = req.body;

  if (!['starter', 'pro', 'business'].includes(subscription)) {
    return res.status(400).json({ message: 'Invalid subscription value' });
  }

  req.user.subscription = subscription;
  await req.user.save();

  res.status(200).json({ email: req.user.email, subscription });
};

module.exports = { registerUser, loginUser, logoutUser, getCurrentUser, updateSubscription };