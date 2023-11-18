const {
  getAllContacts,
  getAllUsers,
  createUser,
  updateUser,
  checkUserDB,
} = require("../services/index");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.SECRET;

const getUsersController = async (req, res, next) => {
  try {
    const results = await getAllUsers();
    res.json({
      status: "Success",
      code: 200,
      data: results,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
    });
    next(error);
  }
};

const createUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log(email);
    const result = await createUser({
      email,
      password,
    });

    const payload = { email: result.email };

    const token = jwt.sign(payload, secret, { expiresIn: "1h" });

    res.status(201).json({
      status: "succes",
      code: 201,
      data: { email: result.email, token },
    });
  } catch (error) {
    res.status(404).json({
      status: 404,
      error: error.message,
    });
  }
};

const loginUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await checkUserDB({
      email,
      password,
    });

    const payload = { email: result.email };

    const token = jwt.sign(payload, secret, { expiresIn: "1h" });

    res.status(201).json({
      status: "succes",
      code: 201,
      data: {
        email: result.email,
        token,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 404,
      error: error.message,
    });
  }
};

const updateUserController = async (req, res, next) => {
  const { userId } = req.params;
  const { major } = req.body;
  try {
    const result = await updateUser(userId, { major });
    console.log(result);
    if (result) {
      res.status(200).json({
        status: "updated",
        code: 200,
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "error",
    });
  }
};
const logoutUserController = async (req, res, _id) => {
  try {
    const user = await getUserbyId();
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    user.token = null;
    await user.save();

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAll = async (req, res, next) => {
  try {
    const results = await getAllContacts();
    if (!results || results.length === 0) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Contacts not found",
      });
    }

    res.json({
      status: "Success",
      code: 200,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getUsersController,
  createUserController,
  loginUserController,
  updateUserController,
  logoutUserController,
};
