const express = require("express");
const router = express.Router();
const { auth } = require("../../middleware/auth");

const {
  getContactsController,
  getContactByIdController,
  removeContactController,
  createContactController,
  updateContactController,
  updateFavoriteContactController,
  getAllUsersController,
  createUserController,
  loginUserController,
  findUserController,
  logOutController,
} = require("../../controllers/index");

// ************CONTACTS************
router.get("/contacts", getContactsController);
router.get("/contacts/:contactId", getContactByIdController);
router.delete("/contacts/:contactId", removeContactController);
router.post("/contacts", createContactController);
router.put("/contacts/:contactId", auth, updateContactController);
router.patch("/contacts/:contactId/favorite", auth, updateFavoriteContactController);

//   ************USERS************
router.get("/users", getAllUsersController);
router.post("/users/signup", createUserController);
router.post("/users/login", loginUserController);
router.get("/users/current", auth, findUserController);
router.get("/users/logout", auth, logOutController);

module.exports = router;
