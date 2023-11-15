const {
  getAllContacts,
  getContactById,
  removeContact,
  createContact,
  updateContact,
  updateFavoriteContact,
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
const getById = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await getContactById(contactId);
    if (result) {
      res.json({
        status: "Success",
        code: 200,
        data: result,
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: "Contact not found",
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Not found",
    });
    next(error);
  }
};

const remove = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await removeContact(contactId);
    if (result) {
      res.json({
        status: "Success",
        code: 200,
        message: "Contact deleted",
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: "Contact not found",
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Not found",
    });
  }
};

const create = async (req, res, next) => {
  try {
    const { name, email, phone, favorite, age } = req.body;
    const result = await createContact({ name, email, phone, favorite, age });

    res.status(201).json({
      status: "Success",
      code: 201,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone, age } = req.body;
  try {
    const result = await updateContact(contactId, { name, email, phone, age });
    if (result) {
      res.status(200).json({
        status: "Success",
        code: 200,
        data: result,
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: "Contact not found",
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Not found",
    });
  }
};

const updateFavorite = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  try {
    const result = await updateFavoriteContact(contactId, { favorite });
    if (result) {
      res.status(200).json({
        status: "updated",
        code: 200,
        data: result,
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: "Contact not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Not found",
    });
  }
};

module.exports = {
  getAll,
  getById,
  remove,
  create,
  update,
  updateFavorite,
  getUsersController,
  createUserController,
  loginUserController,
  updateUserController,
};
