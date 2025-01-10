import express from "express";
import AuthController from "../../controller/authController.js";
import { STATUS_CODES } from "../../utils/constants.js";
import User from "../../models/user.js";

const router = express.Router();

/* POST localhost:3000/api/auth/users/login/ */
router.post("/users/login", async (req, res, next) => {
  try {
    const isValid = checkLoginPayload(req.body);
    if (!isValid) {
      throw new Error("The login request is invalid.");
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Email or password is wrong",
        data: "Conflict",
      });
    }

    const token = await AuthController.login({ email, password });

    res
      .status(STATUS_CODES.success)
      .json({ message: `Utilizatorul a fost logat cu succes`, token: token });
  } catch (error) {
    respondWithError(res, error, STATUS_CODES.error);
  }
});

/* POST localhost:3000/api/auth/users/signup/ */
router.post("/users/signup", async (req, res, next) => {
  try {
    const isValid = checkSignupPayload(req.body);

    if (!isValid) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Eroare de la librăria Joi sau o altă librărie de validare",
        data: "Bad request",
      });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({
        status: "error",
        code: 409,
        message: "Email in use",
        data: "Conflict",
      });
    }

    await AuthController.signup({ email, password });

    res.status(204).json({ message: "Utilizatorul a fost creat" });
  } catch (error) {
    throw new Error(error);
  }
});

// GET localhost:3000/api/auth/users/logout/
router.get("/users/logout", AuthController.validateAuth, async (req, res, next) => {
  try {
    const header = req.get("authorization");
    if (!header) {
      throw new Error("E nevoie de autentificare pentru aceasta ruta.");
    }
    console.log("Token");
    const token = header.split(" ")[1];
    const payload = AuthController.getPayloadFromJWT(token);

    await User.findOneAndUpdate({ email: payload.data.email }, { token: null });

    res.status(204).send();
  } catch (error) {
    throw new Error(error);
  }
});

router.get(
  "/users/current",
  AuthController.validateAuth,
  async (req, res, next) => {
    try {
      const header = req.get("authorization");
      if (!header) {
        throw new Error("Not authorized.");
      }

      const token = header.split(" ")[1];
      const payload = AuthController.getPayloadFromJWT(token);

      const user = await User.findOne({ email: payload.data.email });

      res.status(STATUS_CODES.success).json({
        email: user.email,
        user: user.role,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
);

export default router;

/**
 * Validate Product Body
 */
function checkLoginPayload(data) {
  if (!data?.email || !data?.password) {
    return false;
  }

  return true;
}

/**
 * Validate Product Body
 */
function checkSignupPayload(data) {
  if (!data?.email || !data?.password) {
    return false;
  }

  if (data?.password > 8) {
    return false;
  }

  return true;
}

/**
 * Handles Error Cases
 */
function respondWithError(res, error, statusCode) {
  console.error(error);
  res.status(statusCode).json({ message: `${error}` });
}