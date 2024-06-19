import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import "dotenv/config";
import { STATUS_CODES } from "../utils/constants.js";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import sendWithSendGrid from "../utils/sendEmail.js";

const secretForToken = process.env.TOKEN_SECRET;

const authController = {
  login,
  singUp,
  validateJWT,
  getPayloadFromJWT,
  validateAuth,
  getUserByValidationToken,
  updateValidationToken,
};

async function login(data) {
  const { email, password } = data;
  const user = await User.findOne({ email, verify: true });

  if (!user) {
    throw new Error(
      "The username does not exist or the email was not yet validated"
    );
  }
  const isMatching = await bcrypt.compare(password, user.password);

  if (isMatching) {
    const token = jwt.sign(
      {
        data: user,
      },
      secretForToken,
      { expiresIn: "1h" }
    );

    await User.findOneAndUpdate({ email: email }, { token: token });
    return token;
  } else {
    throw new Error("Email or password is wrong");
  }
}

async function singUp(data) {
  const saltRounds = 10;
  try {
    let encryptedPassword = await bcrypt.hash(data.password, saltRounds);
    const userAvatar = gravatar.url(data.email);
    const token = nanoid();
    const newUser = new User({
      password: encryptedPassword,
      email: data.email,
      subscription: "starter",
      token: null,
      avatarURL: userAvatar,
      verificationToken: token,
      verify: false,
    });
    sendWithSendGrid(data.email, token);
    return User.create(newUser);
  } catch (error) {
    throw new Error(`There was an error creating the new user: ${error}`);
  }
}

function validateJWT(token) {
  try {
    let isAuthenticated = false;

    jwt.verify(token, secretForToken, (err, _decoded) => {
      if (err) {
        throw new Error(err);
      }

      isAuthenticated = true;
    });

    return isAuthenticated;
  } catch (err) {
    console.error(err);
  }
}

function getPayloadFromJWT(token) {
  try {
    const payload = jwt.verify(token, secretForToken);

    return payload;
  } catch (err) {
    console.error(err);
  }
}

function validateAuth(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err) {
      return res.status(STATUS_CODES.unauthorized).json({
        status: "error",
        code: STATUS_CODES.unauthorized,
        message: "Unauthorized",
        data: "Unauthorized",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
}

async function getUserByValidationToken(token) {
  const user = await User.findOne({ verificationToken: token, verify: false });

  if (user) {
    return true;
  }
  return false;
}

async function updateValidationToken(email, token) {
  token = token || nanoid();
  await User.findOneAndUpdate({ email }, { verificationToken: token });
  sendWithSendGrid(email, token);
}

export default authController;
