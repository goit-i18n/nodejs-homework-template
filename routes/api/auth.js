import express from "express";
import authController from "../../controller/authController.js";
import { STATUS_CODES } from "../../utils/constants.js";
import User from "../../models/users.js";
import fileController from "../../controller/fileController.js";

const router = express.Router();

// localhost:3000/api/auth/singup
router.post("/signup", async (req, res, next) => {
  try {
    const isValid = checkRequestPayload(req.body);
    if (!isValid) {
      throw new Error("The singup request is invalid");
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return res.status(STATUS_CODES.conflict).json({
        status: "error",
        code: STATUS_CODES.conflict,
        message: "Email is already in use",
        data: "Conflict",
      });
    }

    const newUser = await authController.singUp({ email, password });

    res
      .status(STATUS_CODES.success)
      .json({ message: "User was created successfully", data: newUser });
  } catch (error) {
    res.status(STATUS_CODES.badRequest).json({
      message: `Eroare de la librăria Joi sau o altă librărie de validare`,
    });
  }
});

// localhost:3000/api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const isValid = checkRequestPayload(req.body);
    if (!isValid) {
      throw new Error("The login request is invalid");
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(STATUS_CODES.badRequest).json({
        status: "error",
        code: STATUS_CODES.badRequest,
        message: "Username or password is not correct",
        data: "Conflict",
      });
    }

    const token = await authController.login({ email, password });

    res
      .status(STATUS_CODES.success)
      .json({ message: "User logged in successfully", data: token });
  } catch (error) {
    res.status(STATUS_CODES.badRequest).json({
      message: "Email or password is wrong",
      error: error,
    });
  }
});

// localhost:3000/api/auth/logout
router.get("/logout", authController.validateAuth, async (req, res, next) => {
  try {
    const header = req.get("authorization");
    if (!header) {
      throw new Error("Authorization required");
    }

    const token = header.split(" ")[1];
    const payload = authController.getPayloadFromJWT(token);

    await User.findOneAndUpdate({ email: payload.data.email }, { token: null });

    res.status(STATUS_CODES.noContent).send();
  } catch (error) {
    throw new Error("The request could not be fullfield");
  }
});

// localhost:3000/api/auth/users/current
router.get("/current", authController.validateAuth, async (req, res, next) => {
  try {
    const header = req.get("authorization");
    if (!header) {
      throw new Error("Authorization required");
    }

    const token = header.split(" ")[1];
    const payload = authController.getPayloadFromJWT(token);

    const user = await User.findOne({ email: payload.data.email });

    res.status(STATUS_CODES.success).json({
      email: user.email,
      user: user.subscription,
    });
  } catch (error) {
    throw new Error("There was a problem with your request");
  }
});

router.patch(
  "/avatars",
  [authController.validateAuth, fileController.uploadFile],
  async (req, res) => {
    try {
      const response = await fileController.processAvatar(req, res);
      res.status(STATUS_CODES.success).json(response);
    } catch (error) {
      throw new Error(error);
    }
  }
);

function checkRequestPayload(data) {
  if (!data?.email || !data?.password) {
    return false;
  }
  return true;
}
export default router;
