const express = require('express');
const Joi = require('joi');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const upload = require('../../middlewares/upload');
const processAvatar = require('../../middlewares/processAvatar');
const { auth } = require('../../middlewares/auth');
const path = require('path');

const router = express.Router();

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
}); 

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  const { error } = signupSchema.validate({ email, password });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({
      status: 'error',
      code: 409,
      message: 'Email in use',
      data: 'Conflict',
    });
  }

  try {
    const avatarURL = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });
    const newUser = new User({
      email,
      password: bcrypt.hashSync(password, 10),
      avatarURL,
    });
    await newUser.save();
    res.status(201).json({
      status: 'success',
      code: 201,
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginSchema.validate({ email, password });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const user = await User.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({
      status: 'error',
      code: 401,
      message: 'Incorrect email or password',
      data: {
        message: 'Unauthorized',
      },
    });
  }

  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({
    status: 'success',
    code: 200,
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    },
  });
});

router.get('/logout', auth, async (req, res) => {
  console.log('Logout attempt by user:', req.user);
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Not authorized',
      });
    }

    user.token = null;
    await user.save();

    res.status(204).send();
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Server error',
    });
  }
});

router.get('/current', auth, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Not authorized',
      });
    }

    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.patch('/avatars', auth, upload.single('avatar'), async (req, res) => {
 
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const tmpPath = path.join(__dirname, '../../tmp', req.file.filename);
    const targetPath = path.join(__dirname, '../public/avatars', req.file.filename);

  
   
    await processAvatar(tmpPath, targetPath);

    
    fs.unlink(tmpPath, (err) => {
      if (err) {
        console.error('Error deleting  file:', err);
      }
    });

    
    user.avatarURL = `/avatars/${req.file.filename}`;
    await user.save();

    res.json({ avatarURL: user.avatarURL });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
