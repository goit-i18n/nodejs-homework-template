import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Asigură-te că variabilele de mediu sunt încărcate

const secretForToken = process.env.TOKEN_SECRET;
console.log(`AuthController: secretForToken = ${secretForToken}`);

import User from "../models/user.js";
import bcrypt from "bcrypt";
import passport from "passport";

const AuthController = {
    login,
    signup,
    validateJWT,
    validateAuth,
    getPayloadFromJWT,
};

async function login(data) {
  const {email, password} = data;

    const user = await User.findOne({email});

    
      const isMatching = await bcrypt.compare(password, user.password);

      if(isMatching){
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
        throw new Error("Username is not matching");
      }
}

async function signup(data) {
  const saltRounds = 10;
  
  const encryptedPassword = await bcrypt.hash(data.password, saltRounds);


  const newUser = new User({
    email: data.email, 
    password: encryptedPassword, 
    subscription: 'starter', 
    token: null
  });

  return User.create(newUser);
}

export function validateJWT(token) {
  
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

export function validateAuth(req, res, next) {
  
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (!user || err) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
          data: 'Unauthorized',
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  
}

export default AuthController;
