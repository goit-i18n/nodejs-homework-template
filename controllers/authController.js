const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
require("dotenv").config();
const gravatar = require("gravatar");
const { v4: uuidv4 } = require("uuid");
const sendWithSendGrid = require("../utils/sendEmail.js");

const AuthController = {
  signup,
  login,
  validateAuth,
  getPayloadFromJWT,
  getUserByValidationToken,
  updateToken,
};

const secretForToken = process.env.TOKEN_SECRET;

// TODO SIGNUP:
async function signup(data) {
  const { email, password } = data;

  //! Validare pentru email și password:
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  //! Verificarea existenței utilizatorului:
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email in use");
  }

  const userAvatar = gravatar.url(email);

  //! implementez o functie care sa genereze un token:
  const token = uuidv4();

  //! Crearea unui nou utilizator:
  const newUser = new User({
    email: email,
    subscription: "starter",
    token: null,
    avatarURL: userAvatar,
    //! Adaugam la noul user:
    verificationToken: token,
    verify: false,
  });

  //! Apelez functia sendWithSendGrid():
  sendWithSendGrid(email, token);

  //! Setarea parolei:
  newUser.setPassword(password);

  await newUser.save();

  return newUser;
}

// TODO LOGIN:
async function login(data) {
  const { email, password } = data;

  //! Validare pentru email și password:
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  //* Trebuie să se țină cont de faptul că utilizatorul nu va putea să se autentifice până când adresa lui de e-mail nu a fost verificată. Deci adaugam si 'verify: true':
  const user = await User.findOne({ email: email, verify: true });

  if (!user) {
    throw new Error("Email or password is wrong");
  }

  const passwordMatch = user.validPassword(password);
  if (!passwordMatch) {
    throw new Error("Email or password is wrong");
  }

  const token = jwt.sign(
    {
      userId: user._id,
    },
    secretForToken,
    {
      expiresIn: "1h",
    }
  );

  user.token = token;
  await user.save();

  return { token, user };
}

//! Funcția pentru obținerea payload-ului din JWT:
function getPayloadFromJWT(token) {
  try {
    const payload = jwt.verify(token, secretForToken);

    return payload;
  } catch (err) {
    console.error(err);
  }
}

//! Funcția pentru validarea autentificării:
function validateAuth(req, res, next) {
  console.log("validateAuth middleware called");
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err) {
      console.log("Unauthorized request"); // Log pentru debugging
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Unauthorized",
        data: "Unauthorized",
      });
    }
    console.log("User authenticated:", user); // Log utilizator autentificat
    req.user = user;
    next();
  })(req, res, next);
}

//! Funcția pentru găsirea unui user în baza de date folosind un token de validare, user cu emailul încă nevalidat:
async function getUserByValidationToken(token) {
  const user = await User.findOne({
    verificationToken: token,
    verify: false,
  });

  if (user) {
    return true;
  }

  return false;
}

async function updateToken(email, token) {
  token = token || uuidv4();

  await User.findOneAndUpdate({ email: email }, { verificationToken: token });

  sendWithSendGrid(email, token);
}

module.exports = AuthController;